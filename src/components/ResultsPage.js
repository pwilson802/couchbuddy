/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import MovieCard from "./MovieCard";
import SpinnerMovie from "./SpinnerMovie";
import NavButton from "./NavButton";
import NothingFound from "./NothingFound";

async function filterMoviesByData(duration, sortByVote) {
  const url = `https://couchbuddy.s3-ap-southeast-2.amazonaws.com/data/movie-filter.json`;
  console.log(url);
  const response = await fetch(url);
  const allMovies = await response.json();
  // console.log("movie object:", movieObject);
  // let firstQuery = await API.graphql({
  //   query: listMovieDatas,
  //   limit: 1000,
  // });
  // let allMovies = firstQuery.data.listMovieDatas.items;
  // let nextToken = firstQuery.data.listMovieDatas.nextToken;
  // while (nextToken != null) {
  //   let nextPage = await API.graphql({
  //     query: listMovieDatas,
  //     variables: {
  //       limit: 1000,
  //       nextToken,
  //     },
  //   });
  //   allMovies = [...allMovies, ...nextPage.data.listMovieDatas.items];
  //   nextToken = nextPage.data.listMovieDatas.nextToken;
  // }
  // const moviesUnderDuration = allMovies.filter(
  //   (item) => item.runtime < duration
  // );
  const moviesUnderDuration = allMovies.filter((item) => item.r < duration);
  if (sortByVote === true) {
    console.log("sortByVote", sortByVote);
    console.log("moviesUnderDuration", moviesUnderDuration);
    console.log("sorting by vote");
    moviesUnderDuration.sort(compare);
    console.log("sorted Movies: ", moviesUnderDuration);
    // const result = moviesUnderDuration.map((item) => Number(item.movieID));
    const result = moviesUnderDuration.map((item) => Number(item.id));
    console.log("result in function", result);
    return result;
  }
  return moviesUnderDuration.map((item) => Number(item.id));
  // return moviesUnderDuration.map((item) => Number(item.movieID));
}

// async function getMoviesByGenre(genre) {
//   const movies = await API.graphql({
//     query: getGenre,
//     variables: { genre: genre },
//   });
//   if (movies.data.getGenre == null) {
//     return [];
//   }
//   const moviesList = JSON.parse(movies.data.getGenre.movieIDs);
//   return moviesList;
// }

async function getMovieIDsforGenres(genres) {
  const url = `https://couchbuddy.s3-ap-southeast-2.amazonaws.com/data/genres.json`;
  console.log(url);
  const response = await fetch(url);
  const genresObject = await response.json();
  console.log("genres json response", genresObject);
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
    console.log("shuffling....");
    shuffle(movies);
  }
  return movies.slice(0, 99);
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
  const [movieNumber, setMovieNumber] = useState(3);
  const [pagDirection, setPagDirection] = useState("next");
  const {
    allProviderData,
    selectedGenres,
    selectedProviders,
    duration,
    certificationMovies,
    sortByVote,
  } = searchDetails;
  // console.log(selectedProviders);
  console.log("certificationMovies", certificationMovies);

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
      // const moviesByLength = await getMoviesByLength(duration);
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
      console.log("result", result);
      setMovies(result);
      setActiveMovies(result.slice(0, 3));
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
    const pagNumber = pagDirection === "next" ? 3 : 6;
    const startNumber = pagDirection === "next" ? 0 : 3;
    setActiveMovies(
      movies.slice(movieNumber + startNumber, movieNumber + pagNumber)
    );
    setMovieNumber(movieNumber + pagNumber);
    setPagDirection("next");
  }

  function prevMovies() {
    if (movieNumber <= 0) {
      // show an end page screen
      return;
    }
    const pagNumber = pagDirection === "prev" ? 3 : 6;
    const startNumber = pagDirection === "prev" ? 0 : 3;
    setActiveMovies(
      movies.slice(movieNumber - pagNumber, movieNumber - startNumber)
    );
    setMovieNumber(movieNumber - pagNumber);
    setPagDirection("prev");
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
  };

  return (
    <div>
      <div css={styles.logoWrap}>
        <Logo setPage={setPage} logo={"main"} />
      </div>
      {loaded ? (
        nothingFound ? (
          <NothingFound setPage={setPage} />
        ) : (
          <div css={styles.resultsWrap}>
            <div>
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
            <div css={styles.buttons}>
              {movieNumber !== 0 && (
                <NavButton
                  handleSubmit={prevMovies}
                  buttonText={"Previous"}
                  width={90}
                />
              )}
              {movieNumber <= movies.length - 3 && (
                <NavButton
                  handleSubmit={nextMovies}
                  buttonText={"Next"}
                  width={90}
                />
              )}
            </div>
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
