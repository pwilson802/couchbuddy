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
const DATA_URL = process.env.NEXT_PUBLIC_DATA_URL;

async function getMovieFilterData(ids) {
  const url = `${DATA_URL}/movie-filter.json`;
  const response = await fetchRetry(url, 3);
  const allTV = await response.json();
  const result = allTV.filter((item) => {
    return ids.includes(item.id);
  });
  return result;
}

async function filterMoviesByData(
  duration,
  sortByVote,
  allMovies,
  filterByDate,
  dateRange
) {
  const moviesUnderDuration = allMovies.filter((item) => item.r < duration);
  const moviesInDateRange = filterByDate
    ? filterMovieDate(moviesUnderDuration, dateRange)
    : moviesUnderDuration;
  if (sortByVote === true) {
    moviesInDateRange.sort(compare);
    const result = moviesInDateRange.map((item) => Number(item.id));
    return result;
  }
  return moviesInDateRange.map((item) => Number(item.id));
}

function filterMovieDate(movies, dateRange) {
  return movies.filter((item) => {
    const year = item.d.split("-")[0];
    if (year >= dateRange[0] && year <= dateRange[1]) {
      return true;
    }
  });
}

async function getTVFilterData(ids) {
  const url = `${DATA_URL}/tv-filter.json`;
  const response = await fetchRetry(url, 3);
  const allTV = await response.json();
  const result = allTV.filter((item) => {
    return ids.includes(item.id);
  });
  return result;
}

function filterTVSeason(tvShows, seasons) {
  return tvShows.filter((item) => {
    if (item.se >= seasons[0] && item.se <= seasons[1]) {
      return true;
    }
    return false;
  });
}

function filterTVDate(tvShows, dateRange, dateFilter) {
  if (dateFilter == "releaseDate") {
    return tvShows.filter((item) => {
      const year = item.d.split("-")[0];
      if (year >= dateRange[0] && year <= dateRange[1]) {
        return true;
      }
    });
  }
  return tvShows.filter((item) => {
    const year = Number(item.d.split("-")[0]);
    const seasons = item.se;
    const yearsOn = [];
    const lastYear = year + seasons;
    for (let i = year; i <= lastYear; i++) {
      yearsOn.push(i);
    }
    return yearsOn.some((y) => {
      if (y >= dateRange[0] && y <= dateRange[1]) {
        return true;
      }
    });
  });
}

function filterTVFinished(tvShows) {
  return tvShows.filter((item) => item.st == "Ended");
}

async function getMovieIDsforGenres(genres, view) {
  const url =
    view == "movie" ? `${DATA_URL}/genres.json` : `${DATA_URL}/tv_genres.json`;
  const response = await fetchRetry(url, 3);
  const genresObject = await response.json();
  let result = [];
  for (let i = 0; i < genres.length; i++) {
    if (Object.keys(genresObject).includes(genres[i])) {
      let movies = genresObject[genres[i]];
      result = [...result, ...movies];
    }
  }
  return result;
}

function reduceShuffleMovies(movies, sortByVote) {
  if (!sortByVote) {
    shuffle(movies);
  }
  return movies;
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
  const [movies, setMovies] = useState([]);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [moviesViewed, setMoviesViewed] = useState(0);

  const {
    allProviderData,
    selectedGenres,
    providerMovies,
    duration,
    certificationMovies,
    sortByVote,
    selectedCertifications,
    selectedProviders,
    view,
    dateRange,
    dateFilter,
    seasons,
    onlyfinishedTv,
  } = searchDetails;

  function getProviders(id) {
    return Object.keys(providerMovies).filter((item) =>
      providerMovies[item].includes(id)
    );
  }

  function filterCertification(movies) {
    const certificationMoviesList = Object.values(certificationMovies).flat();
    return movies.filter((movie) => certificationMoviesList.includes(movie));
  }

  useEffect(() => {
    const genres = Object.keys(selectedGenres).filter(
      (item) => selectedGenres[item]
    );
    async function updateMovies() {
      const matchedMoviesByGenre = await getMovieIDsforGenres(genres, view);
      const matchedMoviesbyProvider = Object.values(providerMovies).flat();
      const moviesInProvider = matchedMoviesByGenre.filter((movie) =>
        matchedMoviesbyProvider.includes(movie)
      );
      async function filterMovies(movies) {
        const filterMovieData =
          sortByVote ||
          duration != 400 ||
          dateRange[0] != 1950 ||
          dateRange[1] != 2030;
        if (filterMovieData == false) {
          return movies;
        }
        const filterData = await getMovieFilterData(movies);
        const filterByDate = dateRange[0] != 1950 || dateRange[1] != 2030;
        const moviesByLength =
          filterMovieData === true
            ? await filterMoviesByData(
                duration,
                sortByVote,
                filterData,
                filterByDate,
                dateRange
              )
            : movies;
        const moviesInLength = moviesByLength.filter((item) =>
          movies.includes(item)
        );
        const moviesInCertification =
          certificationMovies === true
            ? moviesInLength
            : filterCertification(moviesInLength);
        return moviesInCertification;
      }

      async function filterTV(tvShows) {
        const filterTVData =
          sortByVote ||
          onlyfinishedTv ||
          seasons[0] != 1 ||
          seasons[1] != 50 ||
          dateRange[0] != 1950 ||
          dateRange[1] != 2030;
        if (filterTVData == false) {
          return tvShows;
        }
        const filterData = await getTVFilterData(tvShows);
        const filterBySeason = seasons[0] != 1 || seasons[1] != 50;
        const tvBySeason = filterBySeason
          ? filterTVSeason(filterData, seasons)
          : filterData;
        const filterByDate = dateRange[0] != 1950 || dateRange[1] != 2030;
        const tvByDate = filterByDate
          ? filterTVDate(tvBySeason, dateRange, dateFilter)
          : tvBySeason;
        const tvByFinished = onlyfinishedTv
          ? filterTVFinished(tvByDate)
          : tvByDate;
        const tvSorted = sortByVote ? tvByFinished.sort(compare) : tvByFinished;
        const tvIds = tvSorted.map((item) => Number(item.id));
        const tvInCertification =
          certificationMovies === true ? tvIds : filterCertification(tvIds);
        return tvInCertification;
      }

      const filteredIDs =
        view == "movie"
          ? await filterMovies(moviesInProvider)
          : await filterTV(moviesInProvider);
      const result = reduceShuffleMovies(filteredIDs, sortByVote).reduce(
        (acc, curr) => {
          let providers = getProviders(curr);
          acc.push({ id: curr, providers: providers });
          return acc;
        },
        []
      );
      const uniqResult = Array.from(new Set(result));
      setMovies(uniqResult);
      if (uniqResult.length === 0) {
        setNothingFound(true);
      }
      const startingItems = uniqResult.slice(0, 10);
      const startingItemsWithAds = makeItemGroup(startingItems);
      if (uniqResult.length <= 10) {
        setHasMore(false);
      }
      setMoviesViewed(startingItems.length);
      setItems(startingItemsWithAds);
      setLoaded(true);
    }
    updateMovies();
  }, []);

  const fetchMoreData = () => {
    const newItems = movies.slice(moviesViewed, moviesViewed + 10);
    if (moviesViewed + 10 >= movies.length) {
      setHasMore(false);
    }
    setMoviesViewed(moviesViewed + 10);
    const newItemsWithAds = makeItemGroup(newItems);
    setItems([...items, ...newItemsWithAds]);
  };

  const handleRefine = () => {
    setRefine(true);
    setRefineData({
      selectedGenres: selectedGenres,
      duration: duration,
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
                  providers={item.providers}
                  allProviderData={allProviderData}
                  screenSize={screenSize}
                  mode={mode}
                  key={item.id}
                  width={width}
                ></MovieCard>
              ) : (
                <TVCard
                  id={item.id}
                  providers={item.providers}
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

function shuffle(data) {
  // shuffle the questions using Fisher-Yates Algorithm
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = data[i];
    data[i] = data[j];
    data[j] = temp;
  }
  return data;
}

function compare(a, b) {
  // const voteA = Number(a.vote_average);
  // const voteB = Number(b.vote_average);
  const voteA = Number(a.v);
  const voteB = Number(b.v);

  let comparison = 0;
  if (voteA > voteB) {
    comparison = -1;
  } else if (voteA < voteB) {
    comparison = 1;
  }
  return comparison;
}

const fetchRetry = async (url, n) => {
  try {
    return await fetch(url);
  } catch (err) {
    if (n === 1) throw err;
    return await fetchRetry(url, n - 1);
  }
};
