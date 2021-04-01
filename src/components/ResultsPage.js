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
    //console.log()("shuffling....");
    shuffle(movies);
  }
  return movies.slice(0, 209);
}

export default function ResultsPage({
  searchDetails,
  setPage,
  width,
  screenSize,
  mode,
}) {
  const [loaded, setLoaded] = useState(false);
  const [nothingFound, setNothingFound] = useState(false);
  const [movies, setMovies] = useState([]);
  const [activeMovies, setActiveMovies] = useState([]);
  //changing number from 3 to 6
  // const [movieNumber, setMovieNumber] = useState(3);
  const [movieNumber, setMovieNumber] = useState(6);
  const [pagDirection, setPagDirection] = useState("next");
  const {
    allProviderData,
    selectedGenres,
    selectedProviders,
    duration,
    certificationMovies,
    sortByVote,
  } = searchDetails;

  function getProviders(id) {
    return Object.keys(selectedProviders).filter((item) =>
      selectedProviders[item].includes(id)
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
      const matchedMoviesbyProvider = Object.values(selectedProviders).flat();
      const moviesInProvider = matchedMoviesByGenre.filter((movie) =>
        matchedMoviesbyProvider.includes(movie)
      );
      const filterMovieData = sortByVote || duration === 400;
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
      setMovies(result);
      // changing number from 3 to 6
      // setActiveMovies(result.slice(0, 3));
      setActiveMovies(result.slice(0, 6));
      if (result.length === 0) {
        setNothingFound(true);
      }
      setLoaded(true);
    }
    updateMovies();
  }, []);

  function nextMovies() {
    if (movieNumber > movies.length) {
      // show an end page screen
      return;
    }
    // changing number from 3 to 6
    // const pagNumber = pagDirection === "next" ? 3 : 6;
    // const startNumber = pagDirection === "next" ? 0 : 3;
    const pagNumber = pagDirection === "next" ? 6 : 12;
    const startNumber = pagDirection === "next" ? 0 : 6;
    setActiveMovies(
      movies.slice(movieNumber + startNumber, movieNumber + pagNumber)
    );
    setMovieNumber(movieNumber + pagNumber);
    setPagDirection("next");
    window.scrollTo(0, 0);
  }

  function prevMovies() {
    if (movieNumber <= 0) {
      // show an end page screen
      return;
    }
    // changing number from 3 to 6
    const pagNumber = pagDirection === "prev" ? 6 : 12;
    const startNumber = pagDirection === "prev" ? 0 : 6;
    // const pagNumber = pagDirection === "prev" ? 3 : 6;
    // const startNumber = pagDirection === "prev" ? 0 : 3;
    setActiveMovies(
      movies.slice(movieNumber - pagNumber, movieNumber - startNumber)
    );
    setMovieNumber(movieNumber - pagNumber);
    setPagDirection("prev");
    window.scrollTo(0, 0);
  }

  const styles = {
    resultsWrap: css({
      margin: 10,
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
    }),
    prevButton: css({
      marginRight: 10,
    }),
    nextButton: css({
      marginLeft: 10,
    }),
    adWrap: css({
      marginTop: "1rem",
      maxHeight: "200px",
    }),
  };

  return (
    <div>
      <div css={styles.logoWrap}>
        <Logo setPage={setPage} logo={"mainSetPage"} width={250} />
      </div>
      {loaded ? (
        nothingFound ? (
          <NothingFound setPage={setPage} logo={"main"} />
        ) : (
          <div css={styles.resultsWrap}>
            <div css={styles.cardsWrap}>
              {activeMovies.map((item) => (
                <MovieCard
                  id={item.id}
                  providers={item.providers}
                  allProviderData={allProviderData}
                  screenSize={screenSize}
                  mode={mode}
                  key={item.id}
                ></MovieCard>
              ))}
            </div>
            {movieNumber % 12 === 0 && (
              <div css={styles.adWrap}>
                {/* <FakeAd num={1} /> */}
                <Adsense
                  client="ca-pub-9245347946008848"
                  slot="5327454859"
                  style={{ display: "block" }}
                  responsive={true}
                />
              </div>
            )}
            {/* changing number from 3 to 6 */}
            {/* {movies.length > 3 && ( */}
            {movies.length > 6 && (
              <div css={styles.buttons}>
                {/* changing number from 3 to 6 */}
                {/* {movieNumber > 3 && ( */}
                {movieNumber > 6 && (
                  <div css={styles.prevButton}>
                    <NavButton
                      handleSubmit={prevMovies}
                      buttonText={"Previous"}
                      width={90}
                    />
                  </div>
                )}
                {movieNumber < movies.length && (
                  <div css={styles.nextButton}>
                    <NavButton
                      handleSubmit={nextMovies}
                      buttonText={"Next"}
                      width={90}
                    />
                  </div>
                )}
              </div>
            )}
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
