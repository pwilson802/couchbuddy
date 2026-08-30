/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import MovieCard from "./MovieCard";
import TVCard from "./TVCard";
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
// minimize round trips.
const REVEAL_CHUNK = 10;

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

      let dataToShow = firstPage;
      const pagesSeen = new Set([1]);

      if (!sortByVote) {
        const page = randomPage(total, pagesSeen);
        if (page !== 1) {
          dataToShow = await fetchDiscoverPage(page);
          pagesSeen.add(page);
        }
      }

      const idsSeen = new Set();
      const newItems = dedupedItems(dataToShow.results || [], idsSeen);
      const firstChunk = newItems.slice(0, REVEAL_CHUNK);
      const rest = newItems.slice(REVEAL_CHUNK);
      setItems(makeItemGroup(firstChunk));
      setBuffer(rest);
      setSeenIds(idsSeen);
      setUsedPages(pagesSeen);
      setHasMore(rest.length > 0 || total > pagesSeen.size);
      setLoaded(true);
    }
    load();
  }, []);

  const fetchMoreData = async () => {
    if (buffer.length > 0) {
      const chunk = buffer.slice(0, REVEAL_CHUNK);
      const rest = buffer.slice(REVEAL_CHUNK);
      setItems((prev) => [...prev, ...makeItemGroup(chunk)]);
      setBuffer(rest);
      setHasMore(rest.length > 0 || totalPages > usedPages.size);
      return;
    }

    const page = sortByVote
      ? Math.max(...usedPages) + 1
      : randomPage(totalPages, usedPages);
    const data = await fetchDiscoverPage(page);
    const idsSeen = new Set(seenIds);
    const newItems = dedupedItems(data.results || [], idsSeen);
    const chunk = newItems.slice(0, REVEAL_CHUNK);
    const rest = newItems.slice(REVEAL_CHUNK);
    setItems((prev) => [...prev, ...makeItemGroup(chunk)]);
    setBuffer(rest);
    setSeenIds(idsSeen);
    const nextUsedPages = new Set(usedPages);
    nextUsedPages.add(page);
    setUsedPages(nextUsedPages);
    const total = data.total_pages || totalPages;
    setTotalPages(total);
    setHasMore(rest.length > 0 || total > nextUsedPages.size);
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
            {items.map((item, index) => {
              if (item == "ad") {
                return (
                  <div css={styles.adWrap} key={`Ad${index}`}>
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
