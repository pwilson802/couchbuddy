/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import {
  isInWatchlist,
  toggleWatchlist,
  onWatchlistChanged,
} from "../lib/watchlist";

function BookmarkIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3.5C6 2.67 6.67 2 7.5 2h9C17.33 2 18 2.67 18 3.5V21l-6-4-6 4V3.5Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// item: { id, mediaType, title, posterPath, year, href } - the minimal
// shape the /watchlist page needs to render a card without re-fetching.
function WatchlistButton({ item, mode }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchlist(item.id, item.mediaType));
    return onWatchlistChanged(() => {
      setSaved(isInWatchlist(item.id, item.mediaType));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, item.mediaType]);

  const styles = {
    button: css({
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 18px",
      outline: "none",
      cursor: "pointer",
      backgroundColor: saved ? "#96D0D3" : "transparent",
      border: "2px solid #96D0D3",
      borderRadius: 24,
      fontWeight: "bold",
      fontSize: 14,
      color: mode === "light" ? "black" : "white",
    }),
  };

  return (
    <button
      css={styles.button}
      onClick={() => toggleWatchlist(item)}
      aria-pressed={saved}
    >
      <BookmarkIcon filled={saved} />
      {saved ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}

export default WatchlistButton;
