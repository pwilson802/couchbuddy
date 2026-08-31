/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import ShareButtons from "./ShareButtons";
import MovieCardLoading from "./MovieCardLoading";
import TrailerModal from "./TrailerModal";
import OutsideClickHandler from "react-outside-click-handler";

async function getMovieDetails(id, selectedProviders, country) {
  const params = new URLSearchParams();
  if (selectedProviders && selectedProviders.length > 0) {
    params.set("providers", selectedProviders.join("|"));
  }
  if (country) params.set("country", country);
  let url = `/api/movie/${id}?${params.toString()}`;
  const response = await fetch(url);
  const movieDetails = await response.json();
  return JSON.parse(movieDetails);
}

async function getMovieTrailer(id) {
  let url = `/api/trailer/${id}`;
  const response = await fetch(url);
  const movieDetails = await response.json();
  return JSON.parse(movieDetails);
}

const colors = {
  light: {
    text: "black",
    cardBorder: "rgba(150,208,211,1)",
    voteBorder: "rgba(150,208,211,1)",
    cardBackground: "rgba(150,208,211,0.4)",
    panelBackground: "#e9f5f6",
  },
  dark: {
    text: "white",
    cardBorder: "rgba(150,208,211,0.3)",
    voteBorder: "rgba(150,208,211,0.6)",
    cardBackground: "rgba(150,208,211,0.1)",
    panelBackground: "#152025",
  },
};

function MovieCardTile({ id, allProviderData, selectedProviders, country, mode }) {
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState();
  const [overview, setOverview] = useState();
  const [tagline, setTagline] = useState();
  const [runtime, setRuntime] = useState();
  const [image, setImage] = useState();
  const [year, setYear] = useState();
  const [voteAverage, setVoteAverage] = useState();
  const [providerImages, setProviderImages] = useState([]);
  const [hasTrailer, setHasTrailer] = useState(false);
  const [trailerID, setTrailerID] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function setMovieCard() {
      const [movieData, trailer] = await Promise.all([
        getMovieDetails(id, selectedProviders, country),
        getMovieTrailer(id),
      ]);
      setTitle(movieData.title);
      setOverview(movieData.overview);
      setTagline(movieData.tagline);
      setRuntime(movieData.runtime);
      setYear(movieData.release_date.split("-")[0]);
      setVoteAverage(Number(movieData.vote_average).toFixed(1));
      setImage("https://image.tmdb.org/t/p/w342" + movieData.poster_path);
      setProviderImages(
        (movieData.matchedProviders || []).map(
          (item) => allProviderData[item]["logo"]
        )
      );
      if (trailer.result === true) {
        setHasTrailer(true);
        setTrailerID(trailer.id);
      }
      setLoaded(true);
    }
    setMovieCard();
  }, [id]);

  const styles = {
    tile: css({
      position: "relative",
      borderRadius: 12,
      backgroundColor: colors[mode]["cardBackground"],
      border: `1px solid ${colors[mode]["cardBorder"]}`,
      cursor: "pointer",
      transition: "transform 0.15s ease",
    }),
    tileExpanded: css({
      transform: "translateY(-4px)",
      zIndex: 5,
    }),
    posterBox: css({
      position: "relative",
      width: "100%",
      aspectRatio: "2 / 3",
      borderRadius: "12px 12px 0 0",
      overflow: "hidden",
      backgroundColor: "rgba(0,0,0,0.2)",
    }),
    poster: css({
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }),
    voteBadge: css({
      position: "absolute",
      top: 8,
      right: 8,
      margin: 0,
      padding: "4px 8px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: "bold",
      color: "white",
      backgroundColor: "rgba(0,0,0,0.65)",
      border: `1px solid ${colors[mode]["voteBorder"]}`,
    }),
    info: css({
      padding: "8px 10px 10px",
    }),
    title: css({
      margin: 0,
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: 15,
      lineHeight: 1.3,
      color: colors[mode]["text"],
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      minHeight: "2.6em",
    }),
    meta: css({
      margin: "4px 0 0 0",
      fontSize: 12,
      color: colors[mode]["text"],
      opacity: 0.7,
    }),
    hoverPanel: css({
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      marginTop: 6,
      padding: 12,
      borderRadius: 10,
      backgroundColor: colors[mode]["panelBackground"],
      border: `1px solid ${colors[mode]["cardBorder"]}`,
      boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
      opacity: 0,
      pointerEvents: "none",
      transform: "translateY(-6px)",
      transition: "opacity 0.15s ease, transform 0.15s ease",
      zIndex: 10,
    }),
    hoverPanelExpanded: css({
      opacity: 1,
      pointerEvents: "auto",
      transform: "translateY(0)",
    }),
    overview: css({
      margin: 0,
      fontSize: 12,
      lineHeight: 1.4,
      color: colors[mode]["text"],
      display: "-webkit-box",
      WebkitLineClamp: 4,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    }),
    providerWrapper: css({
      display: "flex",
      flexWrap: "wrap",
      gap: 4,
      marginTop: 8,
    }),
    providerImage: css({
      width: 26,
      height: 26,
      borderRadius: 6,
    }),
    actionsRow: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
    }),
    trailerButton: css({
      padding: "4px 10px",
      outline: "none",
      cursor: "pointer",
      backgroundColor: "#96D0D3",
      border: "none",
      borderRadius: 20,
      fontWeight: "bold",
      fontSize: 12,
    }),
    loadingWrap: css({
      aspectRatio: "2 / 3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setExpanded(false)}>
      <div
        css={[styles.tile, expanded && styles.tileExpanded]}
        onClick={() => loaded && setExpanded(!expanded)}
      >
        {loaded ? (
          <React.Fragment>
            <div css={styles.posterBox}>
              <img css={styles.poster} src={image} alt={`${title} poster`} />
              <p css={styles.voteBadge}>{voteAverage}</p>
            </div>
            <div css={styles.info}>
              <p css={styles.title}>{title}</p>
              <p css={styles.meta}>
                {year} &middot; {runtime} min
              </p>
            </div>
            <div
              css={[styles.hoverPanel, expanded && styles.hoverPanelExpanded]}
            >
              <p css={styles.overview}>{overview}</p>
              <div css={styles.providerWrapper}>
                {providerImages.map((item) => (
                  <img
                    key={item}
                    css={styles.providerImage}
                    src={item}
                    alt="provider"
                  />
                ))}
              </div>
              <div
                css={styles.actionsRow}
                onClick={(event) => event.stopPropagation()}
              >
                {hasTrailer ? (
                  <button
                    css={styles.trailerButton}
                    onClick={() => setShowTrailer(true)}
                  >
                    TRAILER
                  </button>
                ) : (
                  <span />
                )}
                <ShareButtons movie={title} tagline={tagline} />
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div css={styles.loadingWrap}>
            <MovieCardLoading mode={mode} />
          </div>
        )}
        {showTrailer && (
          <TrailerModal
            videoId={trailerID}
            onClose={() => setShowTrailer(false)}
          />
        )}
      </div>
    </OutsideClickHandler>
  );
}

export default MovieCardTile;
