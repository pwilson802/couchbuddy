/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import MovieCard from "./MovieCard";
import TVCard from "./TVCard";
import MovieCardTile from "./MovieCardTile";
import TVCardTile from "./TVCardTile";
import SpinnerMovie from "./SpinnerMovie";
import NavButton from "./NavButton";
import NothingFound from "./NothingFound";
import FakeAd from "./FakeAd";
import { Adsense } from "@ctrl/react-adsense";
import InfiniteScroll from "react-infinite-scroll-component";
import NavResults from "./NavResults";
import Footer from "./Footer";
import { movieGenres, tvGenres } from "../data/genres";

const MAX_RANDOM_PAGE = 500;
// Cards each trigger several TMDB calls on mount (detail + watch/providers +
// trailer). Revealing them in chunks of 10 keeps the concurrent-request burst
// the same size as before this migration, even though each API call to our
// own /api/discover/* route now pulls a full TMDB page (20 results) to
// minimize round trips. This is the list/mobile reveal size - grid mode
// computes its own target based on actual column count, see
// computeRevealTarget below.
const REVEAL_CHUNK = 10;
// A fixed reveal count doesn't make sense once a row can hold 7+ tiles - 10
// items barely fills a row and a half on a wide grid, leaving it looking
// sparse and unfinished until the user scrolls. Aim for a few full rows
// instead, scaling with however many columns actually fit.
const GRID_ROWS_PER_REVEAL = 3;
const MAX_REVEAL = 40;
// Bounds how many extra TMDB pages a single reveal will fetch (in parallel
// batches, see fetchAdditionalItems) to hit its target - caps worst-case
// added latency rather than fetching indefinitely if filters are so narrow
// that pages keep coming back thin.
const MAX_FETCH_ROUNDS = 3;
const MAX_BATCH_PAGES = 6;

function selectedKeys(obj) {
  return Object.keys(obj || {}).filter((key) => obj[key]);
}

function genreIds(selectedGenres, view) {
  const map = view === "movie" ? movieGenres : tvGenres;
  return selectedKeys(selectedGenres)
    .map((name) => map[name])
    .filter((id) => id != null);
}

function certificationLabels(selectedCertifications) {
  const keys = Object.keys(selectedCertifications || {});
  if (keys.length === 0) return null;
  const anyUnselected = keys.some((key) => !selectedCertifications[key]);
  if (!anyUnselected) return null; // nothing narrowed, don't filter
  const selected = selectedKeys(selectedCertifications);
  return selected.length > 0 ? selected : null;
}

function randomPage(totalPages, exclude) {
  const ceiling = Math.max(1, Math.min(totalPages || 1, MAX_RANDOM_PAGE));
  if (ceiling <= 1) return 1;
  let page;
  let attempts = 0;
  do {
    page = 1 + Math.floor(Math.random() * ceiling);
    attempts += 1;
  } while (exclude.has(page) && attempts < 10);
  return page;
}

function buildDiscoverUrl({
  view,
  page,
  searchDetails,
  location,
}) {
  const {
    selectedGenres,
    selectedProviders,
    selectedCertifications,
    sortByVote,
    dateRange,
    duration,
    seasons,
    onlyfinishedTv,
  } = searchDetails;

  const params = new URLSearchParams();
  params.set("country", location);
  params.set("page", String(page));
  params.set("sortByVote", sortByVote ? "true" : "false");

  const genres = genreIds(selectedGenres, view);
  if (genres.length > 0) params.set("genres", genres.join("|"));

  const providers = selectedKeys(selectedProviders);
  if (providers.length > 0) params.set("providers", providers.join("|"));

  const certifications = certificationLabels(selectedCertifications);
  if (certifications) params.set("certifications", certifications.join("|"));

  if (dateRange && (dateRange[0] !== 1950 || dateRange[1] !== 2030)) {
    params.set("dateStart", String(dateRange[0]));
    params.set("dateEnd", String(dateRange[1]));
  }

  if (view === "movie") {
    if (duration !== 400) params.set("runtime", String(duration));
    return `/api/discover/movie?${params.toString()}`;
  }

  if (seasons && (seasons[0] !== 1 || seasons[1] !== 50)) {
    params.set("seasonsMin", String(seasons[0]));
    params.set("seasonsMax", String(seasons[1]));
  }
  if (onlyfinishedTv) params.set("status", "finished");
  return `/api/discover/tv?${params.toString()}`;
}

function makeItemGroup(items) {
  if (items.length > 7) {
    items.splice(7, 0, "ad");
    return items;
  }
  return items;
}

// Must match styles.tileGrid's own grid-template-columns math below, since
// there's no clean way to ask a CSS auto-fill grid how many columns it
// actually rendered.
const TILE_MIN_WIDTH = 170;
const TILE_GAP = 16;

function computeGridColumns(width) {
  if (!width) return 1;
  const containerWidth = Math.min(width * 0.95, 1400);
  return Math.max(
    1,
    Math.floor((containerWidth + TILE_GAP) / (TILE_MIN_WIDTH + TILE_GAP))
  );
}

function computeRevealTarget(screenSize, width) {
  if (screenSize !== "large") return REVEAL_CHUNK;
  const columns = computeGridColumns(width);
  return Math.min(
    MAX_REVEAL,
    Math.max(REVEAL_CHUNK, columns * GRID_ROWS_PER_REVEAL)
  );
}

// The plain makeItemGroup above inserts an ad at a fixed item-index, which
// works fine in the single-column list (every item is its own row) but
// breaks a multi-column grid: a full-width ad forced in mid-row splits it
// into a "7, ad, 3"-looking mess, repeating unpredictably every reveal
// chunk since chunk-relative index 7 has no relationship to the grid's
// actual column count. Instead, track the running count of real (non-ad)
// items already shown and only insert an ad once the cumulative count
// crosses a whole-row boundary (every 2 full rows), so ads always land
// between complete rows regardless of chunk/viewport size.
function interleaveGridAds(existingRealCount, chunk, columns) {
  const adSpacing = columns * 2;
  const result = [];
  let count = existingRealCount;
  for (const item of chunk) {
    result.push(item);
    count++;
    if (count % adSpacing === 0) {
      result.push("ad");
    }
  }
  return result;
}

function groupForReveal(prevItems, chunk, screenSize, width) {
  if (screenSize === "large") {
    const realCount = prevItems.filter((item) => item !== "ad").length;
    return interleaveGridAds(realCount, chunk, computeGridColumns(width));
  }
  return makeItemGroup(chunk);
}

export default function ResultsPage({
  searchDetails,
  setPage,
  width,
  screenSize,
  mode,
  location,
  handleLocation,
  changeMode,
  setRefine,
  setRefineData,
}) {
  const [loaded, setLoaded] = useState(false);
  const [nothingFound, setNothingFound] = useState(false);
  const [items, setItems] = useState([]);
  const [buffer, setBuffer] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [usedPages, setUsedPages] = useState(new Set());
  const [seenIds, setSeenIds] = useState(new Set());

  const {
    allProviderData,
    selectedProviders,
    sortByVote,
    selectedCertifications,
    selectedGenres,
    view,
    dateRange,
    dateFilter,
    seasons,
    onlyfinishedTv,
  } = searchDetails;

  const selectedProviderIds = selectedKeys(selectedProviders);

  async function fetchDiscoverPage(page) {
    const url = buildDiscoverUrl({ view, page, searchDetails, location });
    const response = await fetch(url);
    return await response.json();
  }

  // TMDB's total_pages count doesn't guarantee every page in that range has
  // results (the last page is often partial, and our own popularity
  // post-filter can empty one out entirely) - a random pick can land on one
  // of those. Retry a few times with different pages before giving up,
  // tracking every page tried (empty or not) in excludeSet so callers don't
  // waste a retry re-fetching the same empty page later.
  async function fetchRandomNonEmptyPage(excludeSet, totalPagesKnown, maxAttempts = 4) {
    for (let i = 0; i < maxAttempts; i++) {
      const page = randomPage(totalPagesKnown, excludeSet);
      const data = await fetchDiscoverPage(page);
      excludeSet.add(page);
      if ((data.results || []).length > 0) {
        return { page, data };
      }
    }
    return null;
  }

  function dedupedItems(results, alreadySeen) {
    const fresh = [];
    for (const item of results) {
      if (!alreadySeen.has(item.id)) {
        alreadySeen.add(item.id);
        fresh.push({ id: item.id });
      }
    }
    return fresh;
  }

  function pickPageBatch(batchSize, pagesSeenSet, totalPagesKnown) {
    const pages = [];
    if (sortByVote) {
      // "Top Rated" almost never reaches this path at all - that route
      // already returns its whole ranked pool in one total_pages:1
      // response, comfortably over any reveal target - but stay correct
      // for the edge case where it doesn't.
      let next = pagesSeenSet.size === 0 ? 1 : Math.max(...pagesSeenSet) + 1;
      for (let i = 0; i < batchSize && next <= totalPagesKnown; i++, next++) {
        pages.push(next);
        pagesSeenSet.add(next);
      }
      return pages;
    }
    for (let i = 0; i < batchSize && pagesSeenSet.size < totalPagesKnown; i++) {
      const page = randomPage(totalPagesKnown, pagesSeenSet);
      pagesSeenSet.add(page);
      pages.push(page);
    }
    return pages;
  }

  // Keeps fetching batches of pages *in parallel* until at least
  // `neededCount` new deduped items have been accumulated, pages run out, or
  // MAX_FETCH_ROUNDS is hit. A wide grid's reveal target can exceed what a
  // single TMDB page (~20 results) provides, especially after the
  // popularity post-filter thins it further, so this often needs several
  // pages - fetching a batch per round instead of one page at a time keeps
  // added latency to roughly one round trip per round rather than one per
  // page (a sequential per-page loop, including the empty-page retries a
  // single random pick can need, was taking 15+ seconds to fill a wide
  // grid's initial reveal).
  async function fetchAdditionalItems(
    neededCount,
    pagesSeenSet,
    idsSeenSet,
    totalPagesKnown
  ) {
    const accumulated = [];
    let round = 0;
    while (
      accumulated.length < neededCount &&
      pagesSeenSet.size < totalPagesKnown &&
      round < MAX_FETCH_ROUNDS
    ) {
      const remaining = neededCount - accumulated.length;
      const batchSize = Math.min(
        MAX_BATCH_PAGES,
        Math.max(1, Math.ceil(remaining / 10))
      );
      const pages = pickPageBatch(batchSize, pagesSeenSet, totalPagesKnown);
      if (pages.length === 0) break;
      const results = await Promise.all(pages.map(fetchDiscoverPage));
      for (const data of results) {
        accumulated.push(...dedupedItems(data.results || [], idsSeenSet));
      }
      round++;
    }
    return accumulated;
  }

  useEffect(() => {
    async function load() {
      const firstPage = await fetchDiscoverPage(1);
      const total = firstPage.total_pages || 1;
      setTotalPages(total);

      if (total === 0 || (firstPage.total_results || 0) === 0) {
        setNothingFound(true);
        setLoaded(true);
        return;
      }

      const target = computeRevealTarget(screenSize, width);
      const pagesSeen = new Set([1]);
      const idsSeen = new Set();
      let accumulated = dedupedItems(firstPage.results || [], idsSeen);

      if (!sortByVote && total > 1) {
        const attempt = await fetchRandomNonEmptyPage(pagesSeen, total);
        if (attempt) {
          // Replaces page 1's items with the random page's, same as before
          // this change - page 1 was only ever fetched to learn totals.
          accumulated = dedupedItems(attempt.data.results || [], idsSeen);
        }
        // else: every random attempt came back empty - fall back to the
        // already-confirmed-non-empty first page rather than show nothing.
      }

      if (accumulated.length < target) {
        accumulated = accumulated.concat(
          await fetchAdditionalItems(
            target - accumulated.length,
            pagesSeen,
            idsSeen,
            total
          )
        );
      }

      const firstChunk = accumulated.slice(0, target);
      const rest = accumulated.slice(target);
      setItems(groupForReveal([], firstChunk, screenSize, width));
      setBuffer(rest);
      setSeenIds(idsSeen);
      setUsedPages(pagesSeen);
      setHasMore(rest.length > 0 || total > pagesSeen.size);
      setLoaded(true);
    }
    load();
  }, []);

  const fetchMoreData = async () => {
    const target = computeRevealTarget(screenSize, width);
    const idsSeen = new Set(seenIds);
    const pagesSeen = new Set(usedPages);
    let accumulated = [...buffer];

    if (accumulated.length < target && pagesSeen.size < totalPages) {
      accumulated = accumulated.concat(
        await fetchAdditionalItems(
          target - accumulated.length,
          pagesSeen,
          idsSeen,
          totalPages
        )
      );
    }

    const chunk = accumulated.slice(0, target);
    const rest = accumulated.slice(target);
    setItems((prev) => [
      ...prev,
      ...groupForReveal(prev, chunk, screenSize, width),
    ]);
    setBuffer(rest);
    setSeenIds(idsSeen);
    setUsedPages(pagesSeen);
    setHasMore(rest.length > 0 || totalPages > pagesSeen.size);
  };

  const handleRefine = () => {
    setRefine(true);
    setRefineData({
      selectedGenres: selectedGenres,
      duration: searchDetails.duration,
      selectedCertifications: selectedCertifications,
      sortByVote: sortByVote,
      selectedProviders: selectedProviders,
      dateRange: dateRange,
      dateFilter: dateFilter,
      seasons: seasons,
      onlyfinishedTv: onlyfinishedTv,
    });
    setPage("SearchPage");
  };

  const handleSearch = () => {
    setRefine(false);
    setRefineData({});
    setPage("SearchPage");
  };

  const styles = {
    resultsWrap: css({
      margin: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "40px",
    }),
    buttons: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    }),
    logoWrap: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    cardsWrap: css({
      display: "flex",
      flexDirection: "column",
      marginTop: "20px",
    }),
    tileGrid: css({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
      gap: "24px 16px",
      width: "95%",
      maxWidth: "1400px",
      margin: "20px auto 0",
    }),
    adWrapGrid: css({
      gridColumn: "1 / -1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.5rem 0",
    }),
    prevButton: css({
      marginRight: 10,
    }),
    nextButton: css({
      marginLeft: 10,
    }),
    adWrap: css({
      paddingTop: "1rem",
      paddingBottom: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    loader: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    }),
  };

  return (
    <div>
      <div css={styles.logoWrap}>
        <NavResults
          handleLocation={handleLocation}
          location={location}
          mode={mode}
          changeMode={changeMode}
          setPage={setPage}
          handleRefine={handleRefine}
          handleSearch={handleSearch}
        />
      </div>
      {loaded ? (
        nothingFound ? (
          <NothingFound setPage={setPage} logo={"main"} />
        ) : (
          <div css={styles.resultsWrap}>
            <InfiniteScroll
              css={styles.cardsWrap}
              dataLength={items.length}
              next={fetchMoreData}
              hasMore={hasMore}
            ></InfiniteScroll>
            <div css={screenSize === "large" ? styles.tileGrid : undefined}>
              {items.map((item, index) => {
                if (item == "ad") {
                  return (
                    <div
                      css={
                        screenSize === "large"
                          ? styles.adWrapGrid
                          : styles.adWrap
                      }
                      key={`Ad${index}`}
                    >
                      {/* <FakeAd key={`add-${index}`} num={"1"} /> */}
                      {screenSize === "small" ? (
                        <Adsense
                          client="ca-pub-9245347946008848"
                          slot="5327454859"
                          style={{ width: 300, height: 100 }}
                          format=""
                        />
                      ) : (
                        <Adsense
                          client="ca-pub-9245347946008848"
                          slot="5327454859"
                          style={{ width: 728, height: 90 }}
                          format=""
                        />
                      )}
                    </div>
                  );
                }
                if (screenSize === "large") {
                  return view == "movie" ? (
                    <MovieCardTile
                      id={item.id}
                      selectedProviders={selectedProviderIds}
                      country={location}
                      allProviderData={allProviderData}
                      mode={mode}
                      key={item.id}
                    />
                  ) : (
                    <TVCardTile
                      id={item.id}
                      selectedProviders={selectedProviderIds}
                      country={location}
                      allProviderData={allProviderData}
                      mode={mode}
                      key={item.id}
                    />
                  );
                }
                return view == "movie" ? (
                  <MovieCard
                    id={item.id}
                    selectedProviders={selectedProviderIds}
                    country={location}
                    allProviderData={allProviderData}
                    screenSize={screenSize}
                    mode={mode}
                    key={item.id}
                    width={width}
                  ></MovieCard>
                ) : (
                  <TVCard
                    id={item.id}
                    selectedProviders={selectedProviderIds}
                    country={location}
                    allProviderData={allProviderData}
                    screenSize={screenSize}
                    mode={mode}
                    key={item.id}
                    width={width}
                  />
                );
              })}
            </div>
            <Footer
              activePage="app"
              setPage={setPage}
              mode={mode}
              location={location}
              handleLocation={handleLocation}
            />
          </div>
        )
      ) : (
        <SpinnerMovie view={view} mode={mode} />
      )}
    </div>
  );
}
