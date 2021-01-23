/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getCouchmovie, getGenre, listMovieLengths } from "../graphql/queries";
import ShareButtons from "./ShareButtons";

async function getMovieDetails(id) {
  const movieDetails = await API.graphql({
    query: getCouchmovie,
    variables: { movieID: id },
  });
  console.log(movieDetails.data.getCouchmovie);
  return movieDetails.data.getCouchmovie;
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
        image,
        vote_average,
      } = await getMovieDetails(id);
      setTitle(title);
      setOverview(overview);
      setTagline(tagline);
      setRuntime(runtime);
      setVoteAverage(vote_average);
      const imagePath = "http://image.tmdb.org/t/p/w185" + image;
      setImage(imagePath);
      const providerLogos = providers.map(
        (item) => allProviderData[item]["logo"]
      );
      console.log("providerLogos", providerLogos);
      setProviderImages(providerLogos);
      setLoaded(true);
    }
    setMovieCard();
  }, [id]);

  const styles = {
    cardWrapperLarge: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderColor: colors[mode]["cardBorder"],
      borderStyle: "solid",
      marginTop: 8,
      borderWidth: 1,
      paddingHorizontal: 5,
      paddingVertical: 2,
      width: "80%",
      alignSelf: "center",
    }),
    cardWrapperSmall: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderColor: colors[mode]["cardBorder"],
      borderStyle: "solid",
      marginTop: 8,
      borderWidth: 1,
      paddingHorizontal: 5,
      paddingVertical: 2,
      width: "95%",
      alignSelf: "center",
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
      fontSize: 20,
      color: colors[mode]["text"],
      margin: 0,
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
    }),
    providerSharingWrapper: css({
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    }),
    cardWrapper: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
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
  };

  return (
    <div css={styles.cardWrapper}>
      {loaded && (
        <div
          css={
            screenSize === "large"
              ? styles.cardWrapperLarge
              : styles.cardWrapperSmall
          }
        >
          <div css={styles.imageBox}>
            <img css={styles.mobileImage} src={image} alt={`${title} poster`} />
          </div>
          <div css={styles.infoBox}>
            <p css={styles.title}>{title}</p>
            <div css={styles.dataWrap}>
              <p css={styles.runtime}>{runtime} minutes</p>
              <p css={styles.voteAverage}>{voteAverage}</p>
            </div>
            <p css={styles.overview}>
              {screenSize === "large"
                ? overview
                : overview.slice(0, 160) + "..."}
            </p>
            <div css={styles.providerSharingWrapper}>
              <div css={styles.providerWrapper}>
                {providerImages.map((item) => (
                  <div key={item}>
                    <img css={styles.providerImage} src={item} alt="provider" />
                  </div>
                ))}
              </div>
              <div>
                <ShareButtons movie={title} tagline={tagline} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieCard;
