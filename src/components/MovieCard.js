/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import ShareButtons from "./ShareButtons";
import Image from "next/image";
import MovieCardLoading from "./MovieCardLoading";

async function getMovieDetails(id) {
  let TMB_KEY = process.env.TMB_KEY;
  // let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMB_KEY}&language=en-US`;
  let url = `/api/movie/${id}`;
  const response = await fetch(url);
  const movieDetails = await response.json();
  // //console.log()(movieDetails);
  return movieDetails;
}

const colors = {
  light: {
    text: "black",
    cardBorder: "rgba(150,208,211,1)",
    voteBorder: "rgba(150,208,211,1)",
  },
  dark: {
    text: "white",
    cardBorder: "rgba(150,208,211,0.3)",
    voteBorder: "rgba(150,208,211,0.6)",
  },
};

function MovieCard({ id, allProviderData, providers, screenSize, mode }) {
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState();
  const [overview, setOverview] = useState();
  const [tagline, setTagline] = useState();
  const [runtime, setRuntime] = useState();
  const [image, setImage] = useState();
  const [voteAverage, setVoteAverage] = useState();
  const [providerImages, setProviderImages] = useState([]);
  useEffect(() => {
    async function setMovieCard() {
      const {
        title,
        overview,
        tagline,
        runtime,
        poster_path,
        vote_average,
      } = await getMovieDetails(id);
      setTitle(title);
      setOverview(overview);
      setTagline(tagline);
      setRuntime(runtime);
      setVoteAverage(vote_average);
      const imagePath = "http://image.tmdb.org/t/p/w185" + poster_path;
      setImage(imagePath);
      const providerLogos = providers.map(
        (item) => allProviderData[item]["logo"]
      );
      // //console.log()("providerLogos", providerLogos);
      setProviderImages(providerLogos);
      setLoaded(true);
    }
    setMovieCard();
  }, [id]);

  const styles = {
    wrapper: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    }),
    cardWrapper: css({
      borderColor: colors[mode]["cardBorder"],
      borderStyle: "solid",
      marginTop: 8,
      borderWidth: 1,
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
      fontFamily: "Roboto Slab",
      fontWeight: "bold",
      color: colors[mode]["text"],
      margin: 0,
      textAlign: "center",
      "@media(min-width: 768px)": {
        fontSize: 22,
      },
    }),
    runtime: css({
      color: colors[mode]["text"],
      fontStyle: "italic",
      margin: 0,
      fontSize: 10,
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
      justifyContent: "space-between",
      alignItems: "flex-end",
    }),
    voteAverage: css({
      margin: 0,
      marginLeft: 10,
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
  };

  return (
    <div css={styles.cardWrapper}>
      {loaded ? (
        <div>
          {screenSize === "small" && <p css={styles.title}>{title}</p>}
          <div css={styles.bodyWrapper}>
            <div css={styles.imageBox}>
              <Image
                src={image}
                alt={`${title} poster`}
                width={111}
                height={166.7}
              />
            </div>
            <div css={styles.infoBox}>
              {screenSize === "large" && <p css={styles.title}>{title}</p>}
              <div css={styles.dataWrap}>
                <p css={styles.runtime}>{runtime} minutes</p>
                <p css={styles.voteAverage}>{voteAverage}</p>
              </div>
              <p css={styles.overview}>
                {screenSize === "large"
                  ? overview
                  : overview.slice(0, 120) + "..."}
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
                <div>
                  <ShareButtons movie={title} tagline={tagline} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <MovieCardLoading mode={mode} />
      )}
    </div>
  );
}

export default MovieCard;
