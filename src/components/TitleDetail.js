/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import Link from "next/link";
import ShareButtons from "./ShareButtons";
import TrailerModal from "./TrailerModal";
import TVStatus from "./TVStatus";
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

function TitleDetail({ type, data, mode }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const palette = colors[mode] || colors.dark;
  const posterUrl = data.posterPath
    ? `https://image.tmdb.org/t/p/w500${data.posterPath}`
    : "/CouchBuddyLogo.png";
  const backdropUrl = data.backdropPath
    ? `https://image.tmdb.org/t/p/original${data.backdropPath}`
    : null;
  const similarHref = type === "movie" ? movieHref : tvHref;
  const similarLabel = type === "movie" ? "Similar Movies" : "Similar Shows";
  const hasProviders =
    data.providers.flatrate.length > 0 ||
    data.providers.rent.length > 0 ||
    data.providers.buy.length > 0;

  const styles = {
    hero: css({
      backgroundColor: palette.panelBackground,
      backgroundSize: "cover",
      backgroundPosition: "center 20%",
      ...(backdropUrl
        ? {
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, ${
              mode === "light" ? "rgba(255,255,255,0.92)" : "rgba(21,32,37,0.92)"
            } 100%), url(${backdropUrl})`,
          }
        : {}),
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
    poster: css({
      width: 200,
      borderRadius: 12,
      boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
      flexShrink: 0,
    }),
    heroInfo: css({
      marginTop: 20,
      width: "100%",
      "@media(min-width: 768px)": {
        marginTop: 0,
        marginLeft: 32,
      },
    }),
    titleRow: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8,
    }),
    title: css({
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: 28,
      margin: 0,
      color: palette.text,
      "@media(min-width: 768px)": {
        fontSize: 36,
      },
    }),
    tagline: css({
      fontStyle: "italic",
      color: palette.subtleText,
      margin: "8px 0 0 0",
    }),
    metaRow: css({
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 12,
      color: palette.text,
      fontSize: 14,
    }),
    certBadge: css({
      border: `1px solid ${palette.cardBorder}`,
      borderRadius: 4,
      padding: "1px 6px",
      fontSize: 12,
      fontWeight: "bold",
    }),
    voteBadge: css({
      border: `1px solid ${palette.cardBorder}`,
      borderRadius: "50%",
      padding: "4px 8px",
      fontSize: 13,
      fontWeight: "bold",
    }),
    genreRow: css({
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 12,
    }),
    genrePill: css({
      backgroundColor: palette.pillBackground,
      color: palette.text,
      borderRadius: 20,
      padding: "3px 12px",
      fontSize: 12,
    }),
    overview: css({
      marginTop: 16,
      color: palette.text,
      lineHeight: 1.6,
      maxWidth: 640,
    }),
    actionsRow: css({
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginTop: 16,
      flexWrap: "wrap",
    }),
    trailerButton: css({
      padding: "8px 18px",
      outline: "none",
      cursor: "pointer",
      backgroundColor: "#96D0D3",
      border: "none",
      borderRadius: 20,
      fontWeight: "bold",
      fontSize: 13,
    }),
    providersSection: css({
      marginTop: 20,
    }),
    providersLabel: css({
      margin: "0 0 8px 0",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: palette.subtleText,
    }),
    providerLogos: css({
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
    }),
    providerLogo: css({
      width: 42,
      height: 42,
      borderRadius: 10,
    }),
    justwatchLink: css({
      display: "inline-block",
      marginTop: 8,
      fontSize: 11,
      color: palette.subtleText,
    }),
    section: css({
      maxWidth: 1100,
      margin: "0 auto",
      padding: "0 16px 32px",
      "@media(min-width: 768px)": {
        padding: "0 32px 40px",
      },
    }),
    sectionTitle: css({
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: 20,
      color: palette.text,
      marginBottom: 14,
    }),
    scrollRow: css({
      display: "flex",
      gap: 16,
      overflowX: "auto",
      paddingBottom: 8,
    }),
    castCard: css({
      flex: "0 0 auto",
      width: 100,
      textAlign: "center",
    }),
    castPhoto: css({
      width: 100,
      height: 100,
      borderRadius: "50%",
      objectFit: "cover",
      backgroundColor: palette.pillBackground,
      display: "block",
    }),
    castName: css({
      margin: "8px 0 0 0",
      fontSize: 12,
      fontWeight: "bold",
      color: palette.text,
    }),
    castCharacter: css({
      margin: 0,
      fontSize: 11,
      color: palette.subtleText,
    }),
    similarCard: css({
      flex: "0 0 auto",
      width: 130,
      textDecoration: "none",
    }),
    similarPoster: css({
      width: 130,
      height: 195,
      objectFit: "cover",
      borderRadius: 8,
      backgroundColor: palette.pillBackground,
      display: "block",
    }),
    similarTitle: css({
      margin: "6px 0 0 0",
      fontSize: 12,
      color: palette.text,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    }),
  };

  return (
    <div>
      <div css={styles.hero}>
        <div css={styles.heroInner}>
          <img css={styles.poster} src={posterUrl} alt={`${data.title} poster`} />
          <div css={styles.heroInfo}>
            <div css={styles.titleRow}>
              <h1 css={styles.title}>{data.title}</h1>
              {type === "tv" && data.status && <TVStatus status={data.status} />}
            </div>
            {data.tagline && <p css={styles.tagline}>{data.tagline}</p>}
            <div css={styles.metaRow}>
              {data.year && <span>{data.year}</span>}
              {data.metaLabel && <span>{data.metaLabel}</span>}
              {data.certification && (
                <span css={styles.certBadge}>{data.certification}</span>
              )}
              {data.voteAverage && (
                <span css={styles.voteBadge}>{data.voteAverage}</span>
              )}
            </div>
            {data.genres.length > 0 && (
              <div css={styles.genreRow}>
                {data.genres.map((genre) => (
                  <span key={genre} css={styles.genrePill}>
                    {genre}
                  </span>
                ))}
              </div>
            )}
            <p css={styles.overview}>{data.overview}</p>
            <div css={styles.actionsRow}>
              {data.trailerKey && (
                <button
                  css={styles.trailerButton}
                  onClick={() => setShowTrailer(true)}
                >
                  WATCH TRAILER
                </button>
              )}
              <ShareButtons movie={data.title} tagline={data.tagline} />
            </div>
            {hasProviders && (
              <div css={styles.providersSection}>
                <p css={styles.providersLabel}>Where to watch</p>
                <div css={styles.providerLogos}>
                  {[
                    ...data.providers.flatrate,
                    ...data.providers.rent,
                    ...data.providers.buy,
                  ]
                    .filter(
                      (provider, index, all) =>
                        all.findIndex((p) => p.id === provider.id) === index
                    )
                    .map((provider) => (
                      <img
                        key={provider.id}
                        css={styles.providerLogo}
                        src={`https://image.tmdb.org/t/p/w92${provider.logoPath}`}
                        alt={provider.name}
                        title={provider.name}
                      />
                    ))}
                </div>
                {data.providers.link && (
                  <a
                    css={styles.justwatchLink}
                    href={data.providers.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Streaming data provided by JustWatch
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {data.cast.length > 0 && (
        <section css={styles.section}>
          <h2 css={styles.sectionTitle}>Cast</h2>
          <div css={styles.scrollRow}>
            {data.cast.map((member) => (
              <div key={member.id} css={styles.castCard}>
                {member.profilePath ? (
                  <img
                    css={styles.castPhoto}
                    src={`https://image.tmdb.org/t/p/w185${member.profilePath}`}
                    alt={member.name}
                  />
                ) : (
                  <div css={styles.castPhoto} />
                )}
                <p css={styles.castName}>{member.name}</p>
                <p css={styles.castCharacter}>{member.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.similar.length > 0 && (
        <section css={styles.section}>
          <h2 css={styles.sectionTitle}>{similarLabel}</h2>
          <div css={styles.scrollRow}>
            {data.similar.map((item) => (
              <Link
                key={item.id}
                href={similarHref(item.id, item.title)}
                css={styles.similarCard}
              >
                <img
                  css={styles.similarPoster}
                  src={
                    item.posterPath
                      ? `https://image.tmdb.org/t/p/w185${item.posterPath}`
                      : "/CouchBuddyLogo.png"
                  }
                  alt={item.title}
                />
                <p css={styles.similarTitle}>{item.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showTrailer && data.trailerKey && (
        <TrailerModal
          videoId={data.trailerKey}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}

export default TitleDetail;
