/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect } from "react";
import Head from "next/head";
import Logo from "../../components/Logo";
import Footer from "../../components/Footer";
import Burger from "../../components/Burger";
import LocationSelectSmall from "../../components/LocationSelectSmall";
import TitleDetail from "../../components/TitleDetail";
import { slugify, parseIdParam, tvHref } from "../../lib/slug";
import { getCuratedProviders } from "../../lib/providers";

function getContentRating(contentRatingsResults, country) {
  const entry = (contentRatingsResults || []).find(
    (item) => item.iso_3166_1 === country
  );
  return entry ? entry.rating || null : null;
}

// Streaming (flatrate) only - buy/rent is deliberately left out, matching
// the search feature's own with_watch_monetization_types=flatrate-only
// focus. Also filtered down to curatedIds - TMDB's own flatrate list for a
// title includes every regional bundle/add-on channel it knows about,
// which is a lot noisier than the ~40 services the search page actually
// offers as options.
function getProviders(watchProviders, country, curatedIds) {
  const entry = watchProviders?.results?.[country];
  const mapList = (list) =>
    (list || [])
      .filter((provider) => curatedIds.has(String(provider.provider_id)))
      .map((provider) => ({
        id: provider.provider_id,
        name: provider.provider_name,
        logoPath: provider.logo_path,
      }));
  if (!entry) return { flatrate: [], link: null };
  return {
    flatrate: mapList(entry.flatrate),
    link: entry.link || null,
  };
}

// Node's fetch has been observed to intermittently ETIMEDOUT against TMDB in
// this environment even when the same request succeeds immediately via curl
// (same root cause as api/tv/[id].js's fetchRetry) - retry a couple of times
// before giving up, so a transient blip doesn't serve a real visitor a false
// 404.
const fetchRetry = async (url, attemptsLeft) => {
  try {
    return await fetch(url);
  } catch (err) {
    if (attemptsLeft <= 1) throw err;
    return fetchRetry(url, attemptsLeft - 1);
  }
};

function normalizeTv(show, country, curatedIds) {
  const trailer = (show.videos?.results || []).find(
    (item) => item.type === "Trailer" && item.site === "YouTube"
  );
  const seasons = show.number_of_seasons;
  return {
    id: show.id,
    title: show.name,
    tagline: show.tagline,
    overview: show.overview,
    posterPath: show.poster_path,
    backdropPath: show.backdrop_path,
    releaseDate: show.first_air_date || null,
    year: (show.first_air_date || "").split("-")[0] || null,
    metaLabel: seasons
      ? `${seasons} season${seasons === 1 ? "" : "s"}`
      : null,
    voteAverage: show.vote_average
      ? Number(show.vote_average).toFixed(1)
      : null,
    voteCount: show.vote_count || 0,
    genres: (show.genres || []).map((genre) => genre.name),
    certification: getContentRating(
      show.content_ratings?.results,
      country
    ),
    status: show.status === "Returning Series" ? "Returning" : show.status,
    cast: (show.credits?.cast || []).slice(0, 12).map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profilePath: member.profile_path,
    })),
    // recommendations (collaborative, "people who liked this also liked")
    // is noticeably higher quality than TMDB's own "similar" endpoint
    // (keyword/genre matching, which can surface unrelated titles just for
    // sharing a genre tag).
    similar: (show.recommendations?.results || []).slice(0, 12).map((item) => ({
      id: item.id,
      title: item.name,
      posterPath: item.poster_path,
      year: (item.first_air_date || "").split("-")[0] || null,
    })),
    providers: getProviders(show["watch/providers"], country, curatedIds),
    trailerKey: trailer ? trailer.key : null,
    href: tvHref(show.id, show.name),
  };
}

export async function getServerSideProps({ params, query, req, res }) {
  const id = parseIdParam(params.id);
  if (!id) return { notFound: true };

  const country = (
    query.country ||
    req.headers["x-vercel-ip-country"] ||
    "US"
  ).toUpperCase();

  const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMB_KEY}&language=en-US&append_to_response=videos,credits,recommendations,watch/providers,content_ratings`;

  // Kicked off alongside the main detail fetch rather than after it -
  // independent TMDB calls, no reason to wait on one before starting the
  // other. Never throws (see getCuratedProviders), so it's safe to leave
  // outside the try/catch below.
  const curatedProvidersPromise = getCuratedProviders(country, "tv");

  let show;
  try {
    const response = await fetchRetry(url, 3);
    if (!response.ok) return { notFound: true };
    show = await response.json();
  } catch {
    return { notFound: true };
  }
  if (!show || !show.id) return { notFound: true };

  const curatedProviders = await curatedProvidersPromise;
  const curatedIds = new Set(
    curatedProviders.map((provider) => String(provider.provider_id))
  );

  const canonicalSlug = slugify(show.name);
  const requestedSlug = params.id.slice(id.length).replace(/^-/, "");
  if (requestedSlug !== canonicalSlug) {
    const suffix = query.country ? `?country=${query.country}` : "";
    return {
      redirect: {
        destination: `/tv/${id}-${canonicalSlug}${suffix}`,
        permanent: true,
      },
    };
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );

  return { props: { data: normalizeTv(show, country, curatedIds) } };
}

export default function TvPage({
  data,
  mode,
  changeMode,
  location,
  handleLocation,
}) {
  useEffect(() => {
    // Must run unconditionally (matching App.js's own mount effect) - on a
    // fresh visit with no saved preference, the body background is never
    // otherwise set to match the "dark" default the text colors assume,
    // leaving white-on-white sections.
    changeMode(localStorage.getItem("mode") || "dark");
  }, []);

  const description = (data.overview || "").slice(0, 200);
  const canonicalUrl = `https://couchbuddy.info${data.href}`;
  const imageUrl = data.posterPath
    ? `https://image.tmdb.org/t/p/w500${data.posterPath}`
    : "https://couchbuddy-images.s3.amazonaws.com/twitter-card-main5.png";

  const styles = {
    // A 3-column grid centers the logo reliably regardless of ancestor
    // positioning context - the previous position:absolute + translate
    // approach copied from SearchPage's nav relied on an ancestor
    // positioning context SearchPage happens to have and this page
    // doesn't, which clipped the logo against the top of the viewport
    // instead of centering it.
    topBar: css({
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      padding: "10px 16px",
    }),
    locationWrap: css({
      display: "none",
      "@media(min-width: 700px)": {
        display: "block",
        justifySelf: "start",
      },
    }),
    logoWrap: css({
      display: "none",
      "@media(min-width: 700px)": {
        display: "block",
        justifySelf: "center",
      },
    }),
    logoWrapMobile: css({
      justifySelf: "start",
      "@media(min-width: 700px)": {
        display: "none",
      },
    }),
  };

  return (
    <div>
      <Head>
        <title>{`${data.title}${data.year ? ` (${data.year})` : ""} - CouchBuddy`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="video.tv_show" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TVSeries",
              name: data.title,
              description: data.overview,
              image: imageUrl,
              datePublished: data.releaseDate || undefined,
              aggregateRating: data.voteAverage
                ? {
                    "@type": "AggregateRating",
                    ratingValue: data.voteAverage,
                    ratingCount: data.voteCount || 1,
                    bestRating: "10",
                  }
                : undefined,
            }),
          }}
        />
      </Head>
      <main>
        <div css={styles.topBar}>
          {location && (
            <div css={styles.locationWrap}>
              <LocationSelectSmall
                mode={mode}
                location={location}
                handleLocation={handleLocation}
              />
            </div>
          )}
          <div css={styles.logoWrapMobile}>
            <Logo logo="main" width={250} />
          </div>
          <div css={styles.logoWrap}>
            <Logo logo="main" width={250} />
          </div>
          <Burger
            handleLocation={handleLocation}
            location={location}
            mode={mode}
            changeMode={changeMode}
          />
        </div>
        <TitleDetail type="tv" data={data} mode={mode} />
        <Footer
          activePage="tv"
          mode={mode}
          location={location}
          handleLocation={handleLocation}
        />
      </main>
    </div>
  );
}
