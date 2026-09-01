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
import { slugify, parseIdParam, movieHref } from "../../lib/slug";

function getCertification(releaseDatesResults, country) {
  const entry = (releaseDatesResults || []).find(
    (item) => item.iso_3166_1 === country
  );
  if (!entry) return null;
  const withCert = (entry.release_dates || []).find(
    (release) => release.certification
  );
  return withCert ? withCert.certification : null;
}

// Streaming (flatrate) only - buy/rent is deliberately left out, matching
// the search feature's own with_watch_monetization_types=flatrate-only
// focus rather than covering every way to watch something.
function getProviders(watchProviders, country) {
  const entry = watchProviders?.results?.[country];
  const mapList = (list) =>
    (list || []).map((provider) => ({
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
// (same root cause as api/movie/[id].js's fetchRetry) - retry a couple of
// times before giving up, so a transient blip doesn't serve a real visitor
// a false 404.
const fetchRetry = async (url, attemptsLeft) => {
  try {
    return await fetch(url);
  } catch (err) {
    if (attemptsLeft <= 1) throw err;
    return fetchRetry(url, attemptsLeft - 1);
  }
};

function normalizeMovie(movie, country) {
  const trailer = (movie.videos?.results || []).find(
    (item) => item.type === "Trailer" && item.site === "YouTube"
  );
  return {
    id: movie.id,
    title: movie.title,
    tagline: movie.tagline,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date || null,
    year: (movie.release_date || "").split("-")[0] || null,
    metaLabel: movie.runtime ? `${movie.runtime} min` : null,
    voteAverage: movie.vote_average
      ? Number(movie.vote_average).toFixed(1)
      : null,
    voteCount: movie.vote_count || 0,
    genres: (movie.genres || []).map((genre) => genre.name),
    certification: getCertification(
      movie.release_dates?.results,
      country
    ),
    status: null,
    cast: (movie.credits?.cast || []).slice(0, 12).map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profilePath: member.profile_path,
    })),
    // recommendations (collaborative, "people who liked this also liked")
    // is noticeably higher quality than TMDB's own "similar" endpoint
    // (keyword/genre matching, which can surface unrelated titles just for
    // sharing a genre tag).
    similar: (movie.recommendations?.results || []).slice(0, 12).map((item) => ({
      id: item.id,
      title: item.title,
      posterPath: item.poster_path,
      year: (item.release_date || "").split("-")[0] || null,
    })),
    providers: getProviders(movie["watch/providers"], country),
    trailerKey: trailer ? trailer.key : null,
    href: movieHref(movie.id, movie.title),
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

  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMB_KEY}&language=en-US&append_to_response=videos,credits,recommendations,watch/providers,release_dates`;

  let movie;
  try {
    const response = await fetchRetry(url, 3);
    if (!response.ok) return { notFound: true };
    movie = await response.json();
  } catch {
    return { notFound: true };
  }
  if (!movie || !movie.id) return { notFound: true };

  const canonicalSlug = slugify(movie.title);
  const requestedSlug = params.id.slice(id.length).replace(/^-/, "");
  if (requestedSlug !== canonicalSlug) {
    const suffix = query.country ? `?country=${query.country}` : "";
    return {
      redirect: {
        destination: `/movie/${id}-${canonicalSlug}${suffix}`,
        permanent: true,
      },
    };
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );

  return { props: { data: normalizeMovie(movie, country) } };
}

export default function MoviePage({
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
    topBar: css({
      display: "flex",
      alignItems: "center",
      padding: "16px 16px 0",
      "@media(min-width: 768px)": {
        padding: "24px 32px 0",
      },
    }),
    locationWrap: css({
      display: "none",
      "@media(min-width: 700px)": {
        display: "block",
        marginLeft: "auto",
        marginRight: 48,
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
        <meta property="og:type" content="video.movie" />
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
              "@type": "Movie",
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
          <Logo logo="main" width={140} />
          {location && (
            <div css={styles.locationWrap}>
              <LocationSelectSmall
                mode={mode}
                location={location}
                handleLocation={handleLocation}
              />
            </div>
          )}
          <Burger
            handleLocation={handleLocation}
            location={location}
            mode={mode}
            changeMode={changeMode}
          />
        </div>
        <TitleDetail type="movie" data={data} mode={mode} />
        <Footer
          activePage="movie"
          mode={mode}
          location={location}
          handleLocation={handleLocation}
        />
      </main>
    </div>
  );
}
