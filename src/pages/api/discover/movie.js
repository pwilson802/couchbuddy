import { certificationQueryValue } from "../../../data/certifications";
import { rankByWeightedRating } from "../../../lib/weightedRating";

const RATED_CANDIDATE_PAGES = 10;

function buildParams({
  genres,
  providers,
  certifications,
  country,
  runtime,
  dateStart,
  dateEnd,
  sortByVote,
  page,
}) {
  const params = new URLSearchParams({
    api_key: process.env.TMB_KEY,
    language: "en-US",
    include_adult: "false",
    include_video: "false",
    page: String(page),
    // When ranking by vote, sort the raw candidate fetch by vote_count
    // (not vote_average) so the pool skews toward statistically reliable
    // titles before the weighted-rating re-ranking below runs on it.
    sort_by: sortByVote === "true" ? "vote_count.desc" : "popularity.desc",
    // Matches the quality floor the old nightly pipeline applied to every
    // movie before it ever entered the dataset (see
    // couchbuddy-data-upload/load-movies-json.py: vote_count >= 14,
    // runtime >= 25). Without these, titles with only a handful of votes
    // can outrank real results when sorting by vote average, which never
    // happened against the old, pre-filtered dataset. TMDB discover has
    // no popularity filter param (confirmed: "popularity.gte" is silently
    // ignored) - the matching minimum_popularity = 4 floor is applied
    // as a post-filter on the fetched results instead.
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
  return params;
}

async function fetchPage(args) {
  const params = buildParams(args);
  const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    return { results: [], page: args.page, total_pages: 0, total_results: 0 };
  }
  return await response.json();
}

export default async function handler(req, res) {
  const { sortByVote, page = "1" } = req.query;

  if (sortByVote === "true") {
    // "Sort by Vote" is a bounded top-rated view, not an infinite scroll
    // through the whole catalog re-ranked - fetch a candidate pool once,
    // rank it, and return it in a single page (total_pages: 1). The
    // client's existing buffering already reveals a large result set 10 at
    // a time, so no pagination logic is needed on top of this.
    const first = await fetchPage({ ...req.query, page: 1 });
    const pagesToFetch = Math.min(first.total_pages || 1, RATED_CANDIDATE_PAGES);
    const rest = await Promise.all(
      Array.from({ length: pagesToFetch - 1 }, (_, i) =>
        fetchPage({ ...req.query, page: i + 2 })
      )
    );
    const candidates = [first, ...rest]
      .flatMap((data) => data.results || [])
      .filter((item) => item.popularity > 4);
    const ranked = rankByWeightedRating(candidates);

    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");
    res.status(200).json({
      results: ranked,
      nextPage: 2,
      total_pages: 1,
      total_results: ranked.length,
    });
    return;
  }

  const data = await fetchPage({ ...req.query, page });
  const results = (data.results || []).filter((item) => item.popularity > 4);

  res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");
  res.status(200).json({
    results,
    nextPage: (data.page || 1) + 1,
    total_pages: data.total_pages,
    total_results: data.total_results,
  });
}
