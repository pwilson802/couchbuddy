/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Adsense } from "@ctrl/react-adsense";
import Footer from "../../components/Footer";
import DetailPageNav from "../../components/DetailPageNav";
import {
  getWatchlist,
  removeFromWatchlist,
  onWatchlistChanged,
} from "../../lib/watchlist";

const colors = {
  light: {
    text: "black",
    subtleText: "rgba(0,0,0,0.65)",
    cardBackground: "rgba(150,208,211,0.4)",
    cardBorder: "rgba(150,208,211,1)",
  },
  dark: {
    text: "white",
    subtleText: "rgba(255,255,255,0.65)",
    cardBackground: "rgba(150,208,211,0.1)",
    cardBorder: "rgba(150,208,211,0.3)",
  },
};

// Reads entirely from localStorage (see src/lib/watchlist.js) - there's no
// account system on this site, so "my list" only ever means "this
// browser's list". `items` starts as null (rather than []) so the
// server-rendered shell and the very first client render agree there's
// nothing to show yet, avoiding a hydration flash of "nothing saved" before
// localStorage has been read.
function WatchlistPage({ mode, changeMode, location, handleLocation }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    changeMode(localStorage.getItem("mode") || "dark");
    setItems(getWatchlist());
    return onWatchlistChanged(() => setItems(getWatchlist()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const palette = colors[mode] || colors.dark;

  const styles = {
    wrapper: css({
      maxWidth: 1100,
      margin: "0 auto",
      padding: "16px 16px 48px",
      minHeight: "50vh",
      "@media(min-width: 768px)": {
        padding: "16px 32px 48px",
      },
    }),
    heading: css({
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: 28,
      color: palette.text,
      marginBottom: 20,
    }),
    empty: css({
      color: palette.subtleText,
      fontSize: 15,
    }),
    grid: css({
      display: "grid",
      gap: 20,
      gridTemplateColumns: "repeat(2, 1fr)",
      "@media(min-width: 550px)": {
        gridTemplateColumns: "repeat(3, 1fr)",
      },
      "@media(min-width: 800px)": {
        gridTemplateColumns: "repeat(4, 1fr)",
      },
      "@media(min-width: 1050px)": {
        gridTemplateColumns: "repeat(5, 1fr)",
      },
    }),
    card: css({
      borderRadius: 12,
      backgroundColor: palette.cardBackground,
      border: `1px solid ${palette.cardBorder}`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }),
    posterLink: css({
      display: "block",
    }),
    poster: css({
      width: "100%",
      aspectRatio: "2 / 3",
      objectFit: "cover",
      display: "block",
      backgroundColor: "rgba(0,0,0,0.2)",
    }),
    info: css({
      padding: "8px 10px 10px",
      display: "flex",
      flexDirection: "column",
      flex: 1,
    }),
    title: css({
      margin: 0,
      fontSize: 13,
      fontWeight: "bold",
      color: palette.text,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    }),
    meta: css({
      margin: "4px 0 8px 0",
      fontSize: 11,
      color: palette.subtleText,
    }),
    adWrap: css({
      marginTop: 32,
    }),
    removeButton: css({
      marginTop: "auto",
      alignSelf: "flex-start",
      background: "transparent",
      border: "none",
      padding: 0,
      color: "#E12C86",
      fontSize: 11,
      fontWeight: "bold",
      cursor: "pointer",
      textDecoration: "underline",
    }),
  };

  return (
    <div>
      <Head>
        <title>My Watchlist - CouchBuddy</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>
      <main>
        <DetailPageNav
          mode={mode}
          changeMode={changeMode}
          location={location}
          handleLocation={handleLocation}
        />
        <div css={styles.wrapper}>
          <h1 css={styles.heading}>My Watchlist</h1>
          {items && items.length === 0 && (
            <p css={styles.empty}>
              Nothing saved yet - tap &ldquo;Add to Watchlist&rdquo; on any
              movie or TV show to save it here.
            </p>
          )}
          {items && items.length > 0 && (
            <div css={styles.grid}>
              {items.map((item) => (
                <div key={`${item.mediaType}-${item.id}`} css={styles.card}>
                  <Link href={item.href} css={styles.posterLink}>
                    <img
                      css={styles.poster}
                      src={
                        item.posterPath
                          ? `https://image.tmdb.org/t/p/w342${item.posterPath}`
                          : "/CouchBuddyLogo.png"
                      }
                      alt={item.title}
                    />
                  </Link>
                  <div css={styles.info}>
                    <p css={styles.title}>{item.title}</p>
                    <p css={styles.meta}>
                      {item.year} &middot;{" "}
                      {item.mediaType === "tv" ? "TV Show" : "Movie"}
                    </p>
                    <button
                      css={styles.removeButton}
                      onClick={() =>
                        removeFromWatchlist(item.id, item.mediaType)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {items && items.length > 0 && (
            <div css={styles.adWrap}>
              <Adsense
                client="ca-pub-9245347946008848"
                slot="5327454859"
                style={{ display: "block" }}
                responsive={true}
              />
            </div>
          )}
        </div>
        <Footer
          activePage="watchlist"
          mode={mode}
          location={location}
          handleLocation={handleLocation}
        />
      </main>
    </div>
  );
}

export default WatchlistPage;
