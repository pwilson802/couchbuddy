/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Link from "next/link";
import { movieHref, tvHref } from "../lib/slug";

const colors = {
  light: {
    text: "black",
    subtleText: "rgba(0,0,0,0.65)",
    cardBorder: "rgba(150,208,211,1)",
    cardBackground: "rgba(150,208,211,0.4)",
    panelBackground: "#e9f5f6",
    pillBackground: "rgba(150,208,211,0.5)",
  },
  dark: {
    text: "white",
    subtleText: "rgba(255,255,255,0.65)",
    cardBorder: "rgba(150,208,211,0.3)",
    cardBackground: "rgba(150,208,211,0.1)",
    panelBackground: "#152025",
    pillBackground: "rgba(150,208,211,0.15)",
  },
};

function PersonDetail({ data, mode }) {
  const palette = colors[mode] || colors.dark;
  const photoUrl = data.profilePath
    ? `https://image.tmdb.org/t/p/w500${data.profilePath}`
    : "/CouchBuddyLogo.png";

  const styles = {
    hero: css({
      backgroundColor: palette.panelBackground,
    }),
    heroInner: css({
      maxWidth: 1100,
      margin: "0 auto",
      padding: "24px 16px 32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "@media(min-width: 768px)": {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: "48px 32px",
      },
    }),
    photo: css({
      width: 200,
      aspectRatio: "2 / 3",
      objectFit: "cover",
      borderRadius: 12,
      boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
      flexShrink: 0,
      backgroundColor: palette.pillBackground,
    }),
    heroInfo: css({
      marginTop: 20,
      width: "100%",
      "@media(min-width: 768px)": {
        marginTop: 0,
        marginLeft: 32,
      },
    }),
    name: css({
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: 28,
      margin: 0,
      color: palette.text,
      "@media(min-width: 768px)": {
        fontSize: 36,
      },
    }),
    meta: css({
      marginTop: 8,
      fontSize: 13,
      color: palette.subtleText,
    }),
    biography: css({
      marginTop: 16,
      color: palette.text,
      lineHeight: 1.6,
      maxWidth: 700,
      whiteSpace: "pre-line",
    }),
    section: css({
      maxWidth: 1100,
      margin: "0 auto",
      padding: "32px 16px 40px",
      "@media(min-width: 768px)": {
        padding: "32px 32px 48px",
      },
    }),
    sectionTitle: css({
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: 20,
      color: palette.text,
      marginBottom: 14,
    }),
    grid: css({
      display: "grid",
      gap: 16,
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    }),
    card: css({
      display: "block",
      textDecoration: "none",
      borderRadius: 12,
      backgroundColor: palette.cardBackground,
      border: `1px solid ${palette.cardBorder}`,
      overflow: "hidden",
    }),
    posterBox: css({
      position: "relative",
      width: "100%",
      aspectRatio: "2 / 3",
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
      padding: "3px 7px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: "bold",
      color: "white",
      backgroundColor: "rgba(0,0,0,0.65)",
    }),
    cardInfo: css({
      padding: "8px 10px 10px",
    }),
    cardTitle: css({
      margin: 0,
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: 13,
      lineHeight: 1.3,
      color: palette.text,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      minHeight: "2.2em",
    }),
    cardMeta: css({
      margin: "4px 0 0 0",
      fontSize: 11,
      color: palette.subtleText,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
  };

  return (
    <div>
      <div css={styles.hero}>
        <div css={styles.heroInner}>
          <img css={styles.photo} src={photoUrl} alt={data.name} />
          <div css={styles.heroInfo}>
            <h1 css={styles.name}>{data.name}</h1>
            {(data.birthday || data.placeOfBirth) && (
              <p css={styles.meta}>
                {data.birthday && <span>Born {data.birthday}</span>}
                {data.birthday && data.placeOfBirth && <span> &middot; </span>}
                {data.placeOfBirth && <span>{data.placeOfBirth}</span>}
              </p>
            )}
            {data.biography && <p css={styles.biography}>{data.biography}</p>}
          </div>
        </div>
      </div>

      {data.credits.length > 0 && (
        <section css={styles.section}>
          <h2 css={styles.sectionTitle}>Known For</h2>
          <div css={styles.grid}>
            {data.credits.map((item) => {
              const href =
                item.mediaType === "tv"
                  ? tvHref(item.id, item.title)
                  : movieHref(item.id, item.title);
              return (
                <Link
                  key={`${item.mediaType}-${item.id}`}
                  href={href}
                  css={styles.card}
                >
                  <div css={styles.posterBox}>
                    <img
                      css={styles.poster}
                      src={
                        item.posterPath
                          ? `https://image.tmdb.org/t/p/w342${item.posterPath}`
                          : "/CouchBuddyLogo.png"
                      }
                      alt={`${item.title} poster`}
                    />
                    {item.voteAverage && (
                      <p css={styles.voteBadge}>{item.voteAverage}</p>
                    )}
                  </div>
                  <div css={styles.cardInfo}>
                    <p css={styles.cardTitle}>{item.title}</p>
                    <p css={styles.cardMeta}>
                      {item.year}
                      {item.character ? ` · ${item.character}` : ""}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default PersonDetail;
