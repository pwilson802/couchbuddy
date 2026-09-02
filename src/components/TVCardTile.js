/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ShareButtons from "./ShareButtons";
import MovieCardLoading from "./MovieCardLoading";
import TrailerModal from "./TrailerModal";
import OutsideClickHandler from "react-outside-click-handler";
import TVStatus from "./TVStatus";
import { tvHref } from "../lib/slug";

async function getTvDetails(id, selectedProviders, country) {
  const params = new URLSearchParams();
  if (selectedProviders && selectedProviders.length > 0) {
    params.set("providers", selectedProviders.join("|"));
  }
  if (country) params.set("country", country);
  let url = `/api/tv/${id}?${params.toString()}`;
  const response = await fetch(url);
  const movieDetails = await response.json();
  return JSON.parse(movieDetails);
}

async function getTvTrailer(id) {
  let url = `/api/tvtrailer/${id}`;
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

function TVCardTile({ id, allProviderData, selectedProviders, country, mode }) {
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState();
  const [overview, setOverview] = useState();
  const [tagline, setTagline] = useState();
  const [seasons, setSeasons] = useState();
  const [image, setImage] = useState();
  const [year, setYear] = useState();
  const [voteAverage, setVoteAverage] = useState();
  const [providerImages, setProviderImages] = useState([]);
  const [hasTrailer, setHasTrailer] = useState(false);
  const [trailerID, setTrailerID] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [status, setStatus] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    async function setTvCard() {
      try {
        const [tvData, trailer] = await Promise.all([
          getTvDetails(id, selectedProviders, country),
          getTvTrailer(id),
        ]);
        const {
          name,
          overview,
          tagline,
          poster_path,
          vote_average,
          first_air_date,
          number_of_seasons,
          status,
          matchedProviders,
        } = tvData;
        setTitle(name);
        setOverview(overview);
        setTagline(tagline);
        setYear(first_air_date.split("-")[0]);
        setVoteAverage(Number(vote_average).toFixed(1));
        setSeasons(number_of_seasons);
        setStatus(status === "Returning Series" ? "Returning" : status);
        setImage("https://image.tmdb.org/t/p/w342" + poster_path);
        setProviderImages(
          (matchedProviders || []).map((item) => allProviderData[item]["logo"])
        );
        if (trailer.result === true) {
          setHasTrailer(true);
          setTrailerID(trailer.id);
        }
        setLoaded(true);
      } catch (err) {
        // A malformed/failed response for this title must not leave the
        // tile spinning forever - hide it instead of crashing the render
        // with undefined fields.
        console.error("Failed to load tv tile", id, err);
        setFailed(true);
      }
    }
    setTvCard();
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
      display: "block",
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
    statusBadge: css({
      position: "absolute",
      top: 8,
      left: 8,
      transform: "scale(0.8)",
      transformOrigin: "top left",
    }),
    info: css({
      padding: "8px 10px 10px",
    }),
    title: css({
      margin: 0,
      textDecoration: "none",
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
    // Always present with a fixed min-height (not just rendered when there
    // happens to be a provider or trailer) so every card is the same
    // height regardless of what that title actually has - previously a
    // title with no trailer produced a visibly shorter card.
    metaActionsRow: css({
      display: "flex",
      alignItems: "center",
      minHeight: 26,
      marginTop: 8,
    }),
    providerWrapper: css({
      display: "flex",
      flexWrap: "wrap",
      gap: 4,
    }),
    providerImage: css({
      width: 26,
      height: 26,
      borderRadius: 6,
    }),
    actionsRow: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: 8,
    }),
    // Icon-only, inline with the provider logos instead of its own labeled
    // row below - a play glyph reads as "press to watch" without needing
    // the word "TRAILER" spelled out, and keeps the card more compact.
    trailerIconButton: css({
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 26,
      height: 26,
      marginLeft: "auto",
      flexShrink: 0,
      borderRadius: "50%",
      backgroundColor: "#96D0D3",
      border: "none",
      cursor: "pointer",
      color: "#152025",
      fontSize: 10,
      paddingLeft: 2,
    }),
    loadingWrap: css({
      aspectRatio: "2 / 3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
  };

  const href = tvHref(id, title, country);

  return (
    <OutsideClickHandler onOutsideClick={() => setExpanded(false)}>
      <div
        css={[styles.tile, expanded && styles.tileExpanded]}
        onClick={() => loaded && setExpanded(!expanded)}
      >
        {failed ? null : loaded ? (
          <React.Fragment>
            <Link
              href={href}
              css={styles.posterBox}
              onClick={(event) => event.stopPropagation()}
            >
              <img css={styles.poster} src={image} alt={`${title} poster`} />
              <div css={styles.statusBadge}>
                <TVStatus status={status} />
              </div>
              <p css={styles.voteBadge}>{voteAverage}</p>
            </Link>
            <div css={styles.info}>
              <Link
                href={href}
                css={styles.title}
                onClick={(event) => event.stopPropagation()}
              >
                {title}
              </Link>
              <p css={styles.meta}>
                {year} &middot; {seasons} seasons
              </p>
              <div css={styles.metaActionsRow}>
                {providerImages.length > 0 && (
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
                )}
                {hasTrailer && (
                  <button
                    css={styles.trailerIconButton}
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowTrailer(true);
                    }}
                    aria-label="Watch trailer"
                    title="Watch trailer"
                  >
                    &#9654;
                  </button>
                )}
              </div>
            </div>
            <div
              css={[styles.hoverPanel, expanded && styles.hoverPanelExpanded]}
            >
              <p css={styles.overview}>{overview}</p>
              <div
                css={styles.actionsRow}
                onClick={(event) => event.stopPropagation()}
              >
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

export default TVCardTile;
