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

const MAX_VISIBLE_PROVIDERS = 4;

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
      position: "relative",
      width: "100%",
      aspectRatio: "2 / 3",
      borderRadius: "12px 12px 0 0",
      overflow: "hidden",
      backgroundColor: "rgba(0,0,0,0.2)",
    }),
    posterLink: css({
      display: "block",
      width: "100%",
      height: "100%",
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
    meta: css({
      margin: 0,
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
    // Fixed min-height regardless of whether this title has any providers
    // to show, so cards stay a consistent height either way.
    metaActionsRow: css({
      display: "flex",
      alignItems: "center",
      minHeight: 26,
      marginTop: 8,
    }),
    // Capped to MAX_VISIBLE_PROVIDERS (+ an overflow badge) rather than
    // wrapping - a title on many services (e.g. a popular sitcom bundled
    // across half a dozen add-on channels) would otherwise wrap to a
    // second line and make that one card taller than the rest.
    providerWrapper: css({
      display: "flex",
      gap: 4,
      overflow: "hidden",
    }),
    providerImage: css({
      width: 26,
      height: 26,
      borderRadius: 6,
      flexShrink: 0,
    }),
    providerMore: css({
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 26,
      height: 26,
      borderRadius: 6,
      backgroundColor: "rgba(255,255,255,0.15)",
      color: colors[mode]["text"],
      fontSize: 11,
      fontWeight: "bold",
      flexShrink: 0,
    }),
    actionsRow: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: 8,
    }),
    // Overlaid on the poster (bottom-right, opposite the vote badge)
    // instead of living in the same row as the provider logos - a title
    // available on many services no longer pushes the trailer button
    // around or forces it to wrap. Frosted-glass look (translucent +
    // blurred rather than a solid fill) so it sits quietly on top of any
    // poster art instead of reading as an opaque UI chrome element.
    trailerIconButton: css({
      position: "absolute",
      bottom: 8,
      right: 8,
      width: 34,
      height: 34,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.18)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      border: "1px solid rgba(255,255,255,0.4)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
      color: "white",
      cursor: "pointer",
      fontSize: 13,
      paddingLeft: 3,
      zIndex: 2,
      transition: "background-color 0.15s ease, transform 0.15s ease",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.32)",
        transform: "scale(1.08)",
      },
    }),
    loadingWrap: css({
      aspectRatio: "2 / 3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
  };

  const href = tvHref(id, title, country);
  const visibleProviders = providerImages.slice(0, MAX_VISIBLE_PROVIDERS);
  const extraProviders = providerImages.length - visibleProviders.length;

  return (
    <OutsideClickHandler onOutsideClick={() => setExpanded(false)}>
      <div
        css={[styles.tile, expanded && styles.tileExpanded]}
        onClick={() => loaded && setExpanded(!expanded)}
      >
        {failed ? null : loaded ? (
          <React.Fragment>
            <div css={styles.posterBox}>
              <Link
                href={href}
                css={styles.posterLink}
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  css={styles.poster}
                  src={image}
                  alt={`${title} poster`}
                />
              </Link>
              <div css={styles.statusBadge}>
                <TVStatus status={status} />
              </div>
              <p css={styles.voteBadge}>{voteAverage}</p>
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
            <div css={styles.info}>
              <p css={styles.meta}>
                {year} &middot; {seasons} seasons
              </p>
              <div css={styles.metaActionsRow}>
                {visibleProviders.length > 0 && (
                  <div css={styles.providerWrapper}>
                    {visibleProviders.map((item) => (
                      <img
                        key={item}
                        css={styles.providerImage}
                        src={item}
                        alt="provider"
                      />
                    ))}
                    {extraProviders > 0 && (
                      <span css={styles.providerMore}>+{extraProviders}</span>
                    )}
                  </div>
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
