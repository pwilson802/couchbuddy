import { rankByWeightedRating } from "../../../lib/weightedRating";

const MAX_BACKFILL_PAGES = 3;
const RATED_CANDIDATE_PAGES = 10;

function buildParams({
  genres,
  providers,
  certifications,
  country,
  dateStart,
  dateEnd,
  status,
  sortByVote,
  page,
}) {
  const params = new URLSearchParams({
    api_key: process.env.TMB_KEY,
    language: "en-US",
    include_adult: "false",
    page: String(page),
    // When ranking by vote, sort the raw candidate fetch by vote_count
    // (not vote_average) so the pool skews toward statistically reliable
    // titles before the weighted-rating re-ranking runs on it.
    sort_by: sortByVote === "true" ? "vote_count.desc" : "popularity.desc",
    // Matches the quality floor the old nightly pipeline applied to every
    // show before it ever entered the dataset (see
    // couchbuddy-data-upload/load-tvs-json.py: vote_count >= 11). The
    // matching minimum_popularity = 2.3 floor has no discover equivalent
    // and is applied as a post-filter below.
    "vote_count.gte": "11",
  });
  if (genres) params.set("with_genres", genres);
  if (providers) {
    params.set("with_watch_providers", providers);
    params.set("watch_region", country);
    params.set("with_watch_monetization_types", "flatrate");
  }
  if (certifications) {
    params.set("certification_country", country);
    params.set("certification", certifications);
  }
  if (dateStart && Number(dateStart) > 1950) {
    params.set("first_air_date.gte", `${dateStart}-01-01`);
  }
  if (dateEnd && Number(dateEnd) < 2030) {
    params.set("first_air_date.lte", `${dateEnd}-12-31`);
  }
  if (status === "finished") {
    params.set("with_status", "3|4");
  }
  return params;
}

async function fetchDiscoverPage(args) {
  const params = buildParams(args);
  const url = `https://api.themoviedb.org/3/discover/tv?${params.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { results: [], page: args.page, total_pages: args.page, total_results: 0 };
    }
    return await response.json();
  } catch {
    // A transient network failure reaching TMDB shouldn't 500 the whole
    // route - degrade to an empty page so the caller's own retry/backfill
    // logic can move on to a different page instead.
    return { results: [], page: args.page, total_pages: args.page, total_results: 0 };
  }
}

async function filterBySeasons(results, seasonsMin, seasonsMax) {
  const details = await Promise.all(
    results.map(async (item) => {
      try {
        const detailUrl = `https://api.themoviedb.org/3/tv/${item.id}?api_key=${process.env.TMB_KEY}`;
        const detailResponse = await fetch(detailUrl);
        if (!detailResponse.ok) return null;
        const detail = await detailResponse.json();
        return detail.number_of_seasons >= seasonsMin &&
          detail.number_of_seasons <= seasonsMax
          ? item
          : null;
      } catch {
        return null;
      }
    })
  );
  return details.filter(Boolean);
}

export default async function handler(req, res) {
  const { seasonsMin, seasonsMax, sortByVote, page = "1" } = req.query;
  const needsSeasonFilter =
    seasonsMin && seasonsMax && (Number(seasonsMin) > 1 || Number(seasonsMax) < 50);

  if (sortByVote === "true") {
    // "Sort by Vote" is a bounded top-rated view, not an infinite scroll
    // through the whole catalog re-ranked - fetch a candidate pool once,
    // rank it, and return it in a single page (total_pages: 1). The
    // client's existing buffering already reveals a large result set 10 at
    // a time, so no pagination logic is needed on top of this.
    const first = await fetchDiscoverPage({ ...req.query, page: 1 });
    const pagesToFetch = Math.min(first.total_pages || 1, RATED_CANDIDATE_PAGES);
    const rest = await Promise.all(
      Array.from({ length: pagesToFetch - 1 }, (_, i) =>
        fetchDiscoverPage({ ...req.query, page: i + 2 })
      )
    );
    let candidates = [first, ...rest]
      .flatMap((data) => data.results || [])
      .filter((item) => item.popularity > 2.3);
    if (needsSeasonFilter) {
      candidates = await filterBySeasons(
        candidates,
        Number(seasonsMin),
        Number(seasonsMax)
      );
    }
    const ranked = rankByWeightedRating(candidates);

    res.setHeader(
      "Cache-Control",
      needsSeasonFilter
        ? "no-store"
        : "public, s-maxage=1800, stale-while-revalidate=3600"
    );
    res.status(200).json({
      results: ranked,
      nextPage: 2,
      total_pages: 1,
      total_results: ranked.length,
    });
    return;
  }

  let currentPage = Number(page);
  let accumulated = [];
  let lastData = null;
  let attempts = 0;

  do {
    lastData = await fetchDiscoverPage({ ...req.query, page: currentPage });
    let pageResults = (lastData.results || []).filter(
      (item) => item.popularity > 2.3
    );
    if (needsSeasonFilter) {
      pageResults = await filterBySeasons(
        pageResults,
        Number(seasonsMin),
        Number(seasonsMax)
      );
    }
    accumulated = accumulated.concat(pageResults);
    currentPage += 1;
    attempts += 1;
  } while (
    needsSeasonFilter &&
    accumulated.length < 20 &&
    lastData.page < lastData.total_pages &&
    attempts < MAX_BACKFILL_PAGES
  );

  res.setHeader(
    "Cache-Control",
    needsSeasonFilter
      ? "no-store"
      : "public, s-maxage=1800, stale-while-revalidate=3600"
  );
  res.status(200).json({
    results: accumulated,
    nextPage: currentPage,
    total_pages: lastData ? lastData.total_pages : 0,
    total_results: lastData ? lastData.total_results : 0,
  });
}
