import { certificationQueryValue } from "../../../data/certifications";

export default async function handler(req, res) {
  const TMB_KEY = process.env.TMB_KEY;
  const {
    genres,
    providers,
    certifications,
    country = "AU",
    runtime,
    dateStart,
    dateEnd,
    sortByVote,
    page = "1",
  } = req.query;

  const params = new URLSearchParams({
    api_key: TMB_KEY,
    language: "en-US",
    include_adult: "false",
    include_video: "false",
    page,
    sort_by: sortByVote === "true" ? "vote_average.desc" : "popularity.desc",
    // Matches the quality floor the old nightly pipeline applied to every
    // movie before it ever entered the dataset (see
    // couchbuddy-data-upload/load-movies-json.py: vote_count >= 14,
    // runtime >= 25). Without these, titles with only a handful of votes
    // can outrank real results when sorting by vote average, which never
    // happened against the old, pre-filtered dataset. TMDB discover has
    // no popularity filter param (confirmed: "popularity.gte" is silently
    // ignored) - the matching minimum_popularity = 4 floor is applied
    // below as a post-filter on the fetched page instead.
    "vote_count.gte": "14",
    "with_runtime.gte": "25",
  });
  if (genres) params.set("with_genres", genres);
  if (providers) {
    params.set("with_watch_providers", providers);
    params.set("watch_region", country);
    params.set("with_watch_monetization_types", "flatrate");
  }
  if (certifications) {
    const mapped = certifications
      .split("|")
      .map((label) => certificationQueryValue(country, label))
      .join("|");
    params.set("certification_country", country);
    params.set("certification", mapped);
  }
  if (runtime && Number(runtime) < 400) {
    params.set("with_runtime.lte", runtime);
  }
  if (dateStart && Number(dateStart) > 1950) {
    params.set("primary_release_date.gte", `${dateStart}-01-01`);
  }
  if (dateEnd && Number(dateEnd) < 2030) {
    params.set("primary_release_date.lte", `${dateEnd}-12-31`);
  }

  const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    res.status(200).json({ results: [], page: 1, total_pages: 0, total_results: 0 });
    return;
  }
  const data = await response.json();
  const results = (data.results || []).filter((item) => item.popularity > 4);

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1800, stale-while-revalidate=3600"
  );
  res.status(200).json({
    results,
    nextPage: (data.page || 1) + 1,
    total_pages: data.total_pages,
    total_results: data.total_results,
  });
}
