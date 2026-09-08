import { rankByWeightedRating } from "./weightedRating";

// Shared TMDB discover logic - used both by the /api/discover/* routes
// (client-facing, paginated) and by movieStack.js (server-side, called
// directly with no HTTP round trip, to build a "Play as a Group" stack from
// several pages at once). Extracted from what used to be two near-identical
// route handlers so both callers stay in sync with the same filtering/
// ranking rules.

const RATED_CANDIDATE_PAGES = 10;
const MAX_BACKFILL_PAGES = 3;

function buildMovieParams({
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
    sort_by: sortByVote === "true" ? "vote_count.desc" : "popularity.desc",
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
    params.set("certification_country", country);
    params.set("certification", certifications);
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

async function fetchMoviePage(args) {
  const params = buildMovieParams(args);
  const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { results: [], page: args.page, total_pages: 0, total_results: 0 };
    }
    return await response.json();
  } catch {
    return { results: [], page: args.page, total_pages: 0, total_results: 0 };
  }
}

export async function runDiscoverMovie(query) {
  const { sortByVote, page = "1" } = query;

  if (sortByVote === "true") {
    const first = await fetchMoviePage({ ...query, page: 1 });
    const pagesToFetch = Math.min(first.total_pages || 1, RATED_CANDIDATE_PAGES);
    const rest = await Promise.all(
      Array.from({ length: pagesToFetch - 1 }, (_, i) =>
        fetchMoviePage({ ...query, page: i + 2 })
      )
    );
    const candidates = [first, ...rest]
      .flatMap((data) => data.results || [])
      .filter((item) => item.popularity > 4);
    const ranked = rankByWeightedRating(candidates);
    return { results: ranked, nextPage: 2, total_pages: 1, total_results: ranked.length };
  }

  const data = await fetchMoviePage({ ...query, page });
  const results = (data.results || []).filter((item) => item.popularity > 4);
  return {
    results,
    nextPage: (data.page || 1) + 1,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
}

function buildTvParams({
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
    sort_by: sortByVote === "true" ? "vote_count.desc" : "popularity.desc",
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

async function fetchTvPage(args) {
  const params = buildTvParams(args);
  const url = `https://api.themoviedb.org/3/discover/tv?${params.toString()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { results: [], page: args.page, total_pages: args.page, total_results: 0 };
    }
    return await response.json();
  } catch {
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

export async function runDiscoverTv(query) {
  const { seasonsMin, seasonsMax, sortByVote, page = "1" } = query;
  const needsSeasonFilter =
    seasonsMin && seasonsMax && (Number(seasonsMin) > 1 || Number(seasonsMax) < 50);

  if (sortByVote === "true") {
    const first = await fetchTvPage({ ...query, page: 1 });
    const pagesToFetch = Math.min(first.total_pages || 1, RATED_CANDIDATE_PAGES);
    const rest = await Promise.all(
      Array.from({ length: pagesToFetch - 1 }, (_, i) =>
        fetchTvPage({ ...query, page: i + 2 })
      )
    );
    let candidates = [first, ...rest]
      .flatMap((data) => data.results || [])
      .filter((item) => item.popularity > 2.3);
    if (needsSeasonFilter) {
      candidates = await filterBySeasons(candidates, Number(seasonsMin), Number(seasonsMax));
    }
    const ranked = rankByWeightedRating(candidates);
    return { results: ranked, nextPage: 2, total_pages: 1, total_results: ranked.length };
  }

  let currentPage = Number(page);
  let accumulated = [];
  let lastData = null;
  let attempts = 0;

  do {
    lastData = await fetchTvPage({ ...query, page: currentPage });
    let pageResults = (lastData.results || []).filter((item) => item.popularity > 2.3);
    if (needsSeasonFilter) {
      pageResults = await filterBySeasons(pageResults, Number(seasonsMin), Number(seasonsMax));
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

  return {
    results: accumulated,
    nextPage: currentPage,
    total_pages: lastData ? lastData.total_pages : 0,
    total_results: lastData ? lastData.total_results : 0,
  };
}
