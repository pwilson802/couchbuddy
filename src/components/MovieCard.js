/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import ShareButtons from "./ShareButtons";
import Image from "next/image";
import MovieCardLoading from "./MovieCardLoading";
import YouTubeVideo from "./YouTubeVideo";

async function getMovieDetails(id) {
  let url = `/api/movie/${id}`;
  const response = await fetch(url);
  const movieDetails = await response.json();
  return movieDetails;
}

async function getMovieTrailer(id) {
  let url = `/api/trailer/${id}`;
  const response = await fetch(url);
  const movieDetails = await response.json();
  return movieDetails;
}

const colors = {
  light: {
    text: "black",
    cardBorder: "rgba(150,208,211,1)",
    voteBorder: "rgba(150,208,211,1)",
    cardBackground: "rgba(150,208,211,0.4)",
  },
  dark: {
    text: "white",
    cardBorder: "rgba(150,208,211,0.3)",
    voteBorder: "rgba(150,208,211,0.6)",
    cardBackground: "rgba(150,208,211,0.1)",
  },
};

function MovieCard({
  id,
  allProviderData,
  providers,
  screenSize,
  mode,
  width,
}) {
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState();
  const [overview, setOverview] = useState();
  const [tagline, setTagline] = useState();
  const [runtime, setRuntime] = useState();
  const [image, setImage] = useState();
  const [year, setYear] = useState();
  const [voteAverage, setVoteAverage] = useState();
  const [providerImages, setProviderImages] = useState([]);
  const [showAllOverview, setShowAllOverview] = useState(false);
  const [hasTrailer, setHasTrailer] = useState(false);
  const [trailerID, setTrailerID] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  useEffect(() => {
    async function setMovieCard() {
      const {
        title,
        overview,
        tagline,
        runtime,
        poster_path,
        vote_average,
        release_date,
      } = await getMovieDetails(id);
      const releaseYear = release_date.split("-")[0];
      setYear(releaseYear);
      setTitle(title);
      setOverview(overview);
      setTagline(tagline);
      setRuntime(runtime);
      setVoteAverage(Number(vote_average).toFixed(1));
      const imagePath = "https://image.tmdb.org/t/p/w185" + poster_path;
      setImage(imagePath);
      const providerLogos = providers.map(
        (item) => allProviderData[item]["logo"]
      );
      setShowAllOverview(screenSize === "large");
      setProviderImages(providerLogos);
      const trailer = await getMovieTrailer(id);
      if (trailer.result === true) {
        setHasTrailer(true);
        setTrailerID(trailer.id);
      }
      setLoaded(true);
    }
    setMovieCard();
  }, [id]);

  const onPress = () => {
    if (screenSize === "small") {
      setShowAllOverview(!showAllOverview);
    }
  };

  const styles = {
    wrapper: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    }),
    cardWrapper: css({
      borderColor: colors[mode]["cardBorder"],
      backgroundColor: colors[mode]["cardBackground"],
      borderStyle: "solid",
      marginTop: 8,
      borderWidth: 2,
      paddingHorizontal: 5,
      paddingVertical: 2,
      width: "95%",
      alignSelf: "center",
      minHeight: "185px",
      "@media(min-width: 768px)": {
        width: "90%",
      },
      "@media(min-width: 1024px)": {
        width: "80%",
      },
      "@media(min-width: 1900px)": {
        width: "60%",
      },
    }),
    mobileImage: css({
      width: 92.5,
      height: 139,
    }),
    imageBox: css({
      padding: 10,
    }),
    infoBox: css({
      width: "90%",
    }),
    title: css({
      fontSize: 18,
      fontFamily: "Kanit",
      fontWeight: "bold",
      color: colors[mode]["text"],
      margin: "2px 0 0 0",
      textAlign: "center",
      "@media(min-width: 768px)": {
        fontSize: 22,
      },
    }),
    runtime: css({
      color: colors[mode]["text"],
      fontStyle: "italic",
      margin: "3px 10px 0 10px",
      fontSize: 11,
    }),
    year: css({
      color: colors[mode]["text"],
      margin: 0,
      fontSize: 16,
      fontWeight: "bold",
    }),
    providerImage: css({
      width: 40,
      height: 40,
      marginLeft: 3,
      borderRadius: 10,
    }),
    overview: css({
      paddingBottom: 5,
      color: colors[mode]["text"],
      margin: 1,
      fontSize: 14,
    }),
    providerWrapper: css({
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    }),
    providerSharingWrapper: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "flex-end",
      flexWrap: "wrap",
    }),
    voteAverage: css({
      margin: 0,
      borderColor: colors[mode]["voteBorder"],
      borderStyle: "solid",
      borderWidth: 1,
      padding: 5,
      borderRadius: "50%",
    }),
    dataWrap: css({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      color: colors[mode]["text"],
      margin: 0,
      fontSize: 10,
    }),
    bodyWrapper: css({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    }),
    spinnerWrap: css({
      width: "100px",
    }),
    trailerButton: css({
      padding: "5px 10px",
      outline: "none",
      cursor: "pointer",
      backgroundColor: "#96D0D3",
      border: "none",
      borderRadius: "20px",
      fontWeight: "bold",
      marginBottom: "5px",
      alignSelf: "center",
      width: "5rem",
      margin: "0 0.4rem",
    }),
    trailerShare: css({
      display: "flex",
      flexDirection: "row",
      alignSelf: "flex-end",
      justifySelf: "flex-end",
    }),
    trailerWrapperSmall: css({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBotton: "5px",
    }),
  };

  return (
    <div css={styles.cardWrapper}>
      {loaded ? (
        <div>
          {screenSize === "small" && <p css={styles.title}>{title}</p>}
          <div css={styles.bodyWrapper}>
            <div onClick={onPress} css={styles.imageBox}>
              <img
                src={image}
                alt={`${title} poster`}
                width={111}
                height={166.7}
              />
            </div>
            <div css={styles.infoBox}>
              {screenSize === "large" && <p css={styles.title}>{title}</p>}
              <div onClick={onPress} css={styles.dataWrap}>
                <p css={styles.year}>{year}</p>
                <p css={styles.runtime}>{runtime} minutes</p>
                <p css={styles.voteAverage}>{voteAverage}</p>
              </div>
              <p onClick={onPress} css={styles.overview}>
                {showAllOverview
                  ? overview
                  : overview.slice(0, 120) +
                  (overview.length > 120 ? "..." : "")}
              </p>
              <div css={styles.providerSharingWrapper}>
                <div css={styles.providerWrapper}>
                  {providerImages.map((item) => (
                    <div key={item}>
                      <img
                        css={styles.providerImage}
                        src={item}
                        alt="provider"
                      />
                    </div>
                  ))}
                </div>
                {hasTrailer && (
                  <button
                    css={styles.trailerButton}
                    onClick={() => setShowTrailer(!showTrailer)}
                  >
                    {showTrailer ? "CLOSE" : "TRAILER"}
                  </button>
                )}
                <div css={styles.trailerShare}>
                  <ShareButtons movie={title} tagline={tagline} />
                </div>
              </div>
            </div>
          </div>
          {showTrailer && <YouTubeVideo id={trailerID} width={width} />}
        </div>
      ) : (
        <MovieCardLoading mode={mode} />
      )}
    </div>
  );
}

export default MovieCard;
