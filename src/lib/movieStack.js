import { runDiscoverMovie, runDiscoverTv } from "./discover";
import { toDiscoverParams } from "./searchQuery";

export const STACK_SIZE = 100;
// A "sortByVote" call already returns up to RATED_CANDIDATE_PAGES worth of
// results (see discover.js) in one go with total_pages: 1 - this only ever
// loops more than once for the plain-popularity path, where each call is a
// single ~20-result TMDB page.
const MAX_PAGES = 6;

function normalizeStub(item, view) {
  const title = view === "movie" ? item.title : item.name;
  const dateStr = view === "movie" ? item.release_date : item.first_air_date;
  return {
    id: item.id,
    title: title || "Untitled",
    year: dateStr ? dateStr.split("-")[0] : null,
    posterPath: item.poster_path || null,
    voteAverage:
      item.vote_average != null ? Math.round(item.vote_average * 10) / 10 : null,
    overview: item.overview || "",
  };
}

// Builds the shared swipe stack for a "Play as a Group" round from the
// host's own filters - same underlying discover query as the regular
// results list, just pulled several pages deep up front instead of
// revealed incrementally, since every player needs to see the exact same
// stack. Tolerates narrow filters returning fewer than STACK_SIZE titles
// (matches how sparse results are already handled elsewhere) rather than
// erroring.
export async function generateStack({ view, filters, location }) {
  const seen = new Set();
  const stack = [];

  for (let page = 1; page <= MAX_PAGES && stack.length < STACK_SIZE; page++) {
    const params = toDiscoverParams(filters, location, page);
    const data = view === "movie" ? await runDiscoverMovie(params) : await runDiscoverTv(params);

    for (const item of data.results || []) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      stack.push(normalizeStub(item, view));
      if (stack.length >= STACK_SIZE) break;
    }

    if (!data.total_pages || page >= data.total_pages) break;
  }

  return stack;
}
