/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Link from "next/link";
import { movieHref, tvHref } from "../../lib/slug";

const colors = {
  light: { text: "black", subtleText: "rgba(0,0,0,0.6)" },
  dark: { text: "white", subtleText: "rgba(255,255,255,0.6)" },
};

function MatchResult({ view, winner, mode, location, onPlayAgain, onBackToSearch }) {
  const palette = colors[mode] || colors.dark;
  const movie = winner.movie;
  const href = movie
    ? (view === "movie" ? movieHref : tvHref)(movie.id, movie.title, location)
    : null;
  const isRealMatch = winner.kind === "match";

  async function handleShare() {
    if (!movie) return;
    const url = `${window.location.origin}${href}`;
    const text = isRealMatch
      ? `We all matched on ${movie.title}! 🍿`
      : `The group couldn't agree, so we're going with ${movie.title}.`;
    // Leaves room for a richer shareable image later without changing this
    // call site - navigator.share already accepts a `files` array, and the
    // clipboard fallback below can just as easily copy a generated link.
    if (navigator.share) {
      try {
        await navigator.share({ title: "CouchBuddy - Swipe to Decide", text, url });
        return;
      } catch {
        // Cancelled - no fallback needed.
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
    } catch {
      // Best-effort only.
    }
  }

  const styles = {
    wrapper: css({
      maxWidth: 420,
      margin: "0 auto",
      padding: "40px 20px 60px",
      textAlign: "center",
      color: palette.text,
    }),
    kicker: css({
      fontSize: 14,
      fontWeight: "bold",
      letterSpacing: 1,
      textTransform: "uppercase",
      color: isRealMatch ? "#4ADE80" : "#FDD782",
      marginBottom: 4,
    }),
    sub: css({ fontSize: 13, opacity: 0.6, marginBottom: 20 }),
    poster: css({
      width: "60%",
      maxWidth: 220,
      borderRadius: 16,
      boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
      marginBottom: 20,
    }),
    title: css({ fontSize: 24, fontWeight: "bold", margin: "0 0 4px" }),
    meta: css({ fontSize: 14, opacity: 0.7, marginBottom: 28 }),
    primaryButton: css({
      display: "block",
      width: "100%",
      padding: "14px",
      fontSize: 16,
      fontWeight: "bold",
      borderRadius: 10,
      border: "none",
      backgroundColor: "#FDD782",
      color: "black",
      textDecoration: "none",
      cursor: "pointer",
      marginBottom: 12,
      boxSizing: "border-box",
    }),
    secondaryButton: css({
      display: "block",
      width: "100%",
      padding: "14px",
      fontSize: 15,
      borderRadius: 10,
      border: "1px solid rgba(150,208,211,0.5)",
      backgroundColor: "transparent",
      color: palette.text,
      cursor: "pointer",
      marginBottom: 12,
      boxSizing: "border-box",
    }),
  };

  return (
    <div css={styles.wrapper}>
      <p css={styles.kicker}>{isRealMatch ? "It's a match!" : "Closest match"}</p>
      <p css={styles.sub}>
        {isRealMatch
          ? "Everyone swiped yes on this one."
          : "No unanimous pick, so here's the group favorite."}
      </p>
      {movie && movie.posterPath && (
        <img
          css={styles.poster}
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          alt={movie.title}
        />
      )}
      {movie && (
        <React.Fragment>
          <p css={styles.title}>{movie.title}</p>
          <p css={styles.meta}>
            {movie.year}
            {movie.voteAverage ? ` · ★ ${movie.voteAverage}` : ""}
          </p>
        </React.Fragment>
      )}
      {href && (
        <Link href={href} css={styles.primaryButton}>
          View details
        </Link>
      )}
      <button css={styles.secondaryButton} onClick={handleShare}>
        Share result
      </button>
      <button css={styles.secondaryButton} onClick={onPlayAgain}>
        Play again with these filters
      </button>
      <button css={styles.secondaryButton} onClick={onBackToSearch}>
        Back to search
      </button>
    </div>
  );
}

export default MatchResult;
