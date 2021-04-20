/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import MovieCard from "./MovieCard";
import SpinnerMovie from "./SpinnerMovie";
import NavButton from "./NavButton";
import NothingFound from "./NothingFound";
import FakeAd from "./FakeAd";
import { Adsense } from "@ctrl/react-adsense";
import InfiniteScroll from "react-infinite-scroll-component";
import NavResults from "./NavResults";
import Footer from "./Footer";
import MovieCardLoading from "./MovieCardLoading";
// const DATA_BUCKET = process.env.DATA_BUCKET;
const DATA_BUCKET = "couchbuddy-data";
const DATA_URL = "https://d1jby5x0ota8zi.cloudfront.net";

async function filterMoviesByData(duration, sortByVote) {
  const url = `${DATA_URL}/movie-filter.json`;
  const response = await fetch(url);
  const allMovies = await response.json();
  const moviesUnderDuration = allMovies.filter((item) => item.r < duration);
  if (sortByVote === true) {
    moviesUnderDuration.sort(compare);
    const result = moviesUnderDuration.map((item) => Number(item.id));
    return result;
  }
  return moviesUnderDuration.map((item) => Number(item.id));
}

async function getMovieIDsforGenres(genres) {
  const url = `${DATA_URL}/genres.json`;
  const response = await fetch(url);
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
      const matchedMoviesByGenre = await getMovieIDsforGenres(genres);
      const matchedMoviesbyProvider = Object.values(providerMovies).flat();
      const moviesInProvider = matchedMoviesByGenre.filter((movie) =>
        matchedMoviesbyProvider.includes(movie)
      );
      const filterMovieData = sortByVote || duration != 400;
      const moviesByLength =
        filterMovieData === true
          ? await filterMoviesByData(duration, sortByVote)
          : moviesInProvider;
      const moviesInLength = moviesByLength.filter((item) =>
        moviesInProvider.includes(item)
      );
      const moviesInCertification =
        // TODO - Check this is working to skip the filter for certifiation movies
        certificationMovies === true
          ? moviesInLength
          : filterCertification(moviesInLength);
      const result = reduceShuffleMovies(
        moviesInCertification,
        sortByVote
      ).reduce((acc, curr) => {
        let providers = getProviders(curr);
        acc.push({ id: curr, providers: providers });
        return acc;
      }, []);
      const uniqResult = Array.from(new Set(result));
      setMovies(uniqResult);
      // setActiveMovies(result.slice(0, 6));
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
                  <div css={styles.adWrap}>
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
              return (
                <MovieCard
                  id={item.id}
                  providers={item.providers}
                  allProviderData={allProviderData}
                  screenSize={screenSize}
                  mode={mode}
                  key={item.id}
                  width={width}
                ></MovieCard>
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
        <SpinnerMovie />
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
