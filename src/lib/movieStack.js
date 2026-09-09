import { runDiscoverMovie, runDiscoverTv } from "./discover";
import { toDiscoverParams } from "./searchQuery";

export const STACK_SIZE = 100;
// Bounds total random-page fetch attempts for the plain-popularity path
// below (each call is a single ~20-result TMDB page) - a hard ceiling
// regardless of how many attempts come back sparse or duplicate, so a run
// of bad luck can't turn into an unbounded number of round-trips.
const MAX_PAGE_FETCHES = 8;
// Deliberately much tighter than ResultsPage's own randomPage cap (500):
// that page is sorted by popularity.desc, and our own post-filter in
// discover.js drops anything under a popularity floor - a page from deep
// in the range is mostly (sometimes entirely) below that floor, so random
// picks there mostly waste a fetch rather than contributing titles.
// Keeping the random range within the more-popular end still gives a
// meaningfully different ~2000-title pool to draw from across repeated
// rounds, without the yield collapsing.
const MAX_RANDOM_PAGE = 100;

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

// Same page-picking approach as ResultsPage.js's own randomPage - kept as
// a separate copy rather than shared, since this one runs server-side
// against a TMDB total_pages count from a fresh discover call, not a
// client-side one already in React state.
function randomPage(ceiling, exclude) {
  if (ceiling <= 1) return 1;
  let page;
  let attempts = 0;
  do {
    page = 1 + Math.floor(Math.random() * ceiling);
    attempts += 1;
  } while (exclude.has(page) && attempts < 10);
  return page;
}

// Builds the shared swipe stack for a "Play as a Group" round from the
// host's own filters - same underlying discover query as the regular
// results list. Tolerates narrow filters returning fewer than STACK_SIZE
// titles (matches how sparse results are already handled elsewhere)
// rather than erroring.
export async function generateStack({ view, filters, location }) {
  const run = view === "movie" ? runDiscoverMovie : runDiscoverTv;
  const seen = new Set();
  const stack = [];

  function addResults(results) {
    for (const item of results) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      stack.push(normalizeStub(item, view));
      if (stack.length >= STACK_SIZE) return;
    }
  }

  const first = await run(toDiscoverParams(filters, location, 1));
  addResults(first.results || []);

  const isSortByVote = filters.sortByVote === true;
  const totalPages = first.total_pages || 1;

  // "Top Rated" already returns one large, deterministically-ranked pool
  // from page 1 (see discover.js's sortByVote branch) - nothing more to
  // fetch, and staying deterministic there is the whole point of a ranked
  // list. Otherwise, pick further pages RANDOMLY rather than sequentially
  // (1, 2, 3...) - sequential pages are the same every time for the same
  // filters, which is why repeated "Play as a Group" rounds kept
  // generating the identical stack. The regular results page doesn't have
  // this problem because it already picks a random starting page (see
  // ResultsPage.js's own randomPage) - this mirrors that.
  if (!isSortByVote && totalPages > 1) {
    const pageCeiling = Math.min(totalPages, MAX_RANDOM_PAGE);
    const pagesUsed = new Set([1]);
    let fetches = 0;
    while (stack.length < STACK_SIZE && pagesUsed.size < pageCeiling && fetches < MAX_PAGE_FETCHES) {
      const page = randomPage(pageCeiling, pagesUsed);
      if (pagesUsed.has(page)) break; // ran out of unused pages in range
      pagesUsed.add(page);
      fetches++;
      const data = await run(toDiscoverParams(filters, location, page));
      addResults(data.results || []);
    }
  }

  return stack;
}
