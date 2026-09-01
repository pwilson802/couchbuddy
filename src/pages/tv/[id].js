/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useEffect } from "react";
import Head from "next/head";
import Logo from "../../components/Logo";
import Footer from "../../components/Footer";
import TitleDetail from "../../components/TitleDetail";
import { slugify, parseIdParam, tvHref } from "../../lib/slug";

function getContentRating(contentRatingsResults, country) {
  const entry = (contentRatingsResults || []).find(
    (item) => item.iso_3166_1 === country
  );
  return entry ? entry.rating || null : null;
}

function getProviders(watchProviders, country) {
  const entry = watchProviders?.results?.[country];
  const mapList = (list) =>
    (list || []).map((provider) => ({
      id: provider.provider_id,
      name: provider.provider_name,
      logoPath: provider.logo_path,
    }));
  if (!entry) return { flatrate: [], rent: [], buy: [], link: null };
  return {
    flatrate: mapList(entry.flatrate),
    rent: mapList(entry.rent),
    buy: mapList(entry.buy),
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

function normalizeTv(show, country) {
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
    similar: (show.similar?.results || []).slice(0, 12).map((item) => ({
      id: item.id,
      title: item.name,
      posterPath: item.poster_path,
      year: (item.first_air_date || "").split("-")[0] || null,
    })),
    providers: getProviders(show["watch/providers"], country),
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

  const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMB_KEY}&language=en-US&append_to_response=videos,credits,similar,watch/providers,content_ratings`;

  let show;
  try {
    const response = await fetchRetry(url, 3);
    if (!response.ok) return { notFound: true };
    show = await response.json();
  } catch {
    return { notFound: true };
  }
  if (!show || !show.id) return { notFound: true };

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

  return { props: { data: normalizeTv(show, country) } };
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
    topBar: css({
      padding: "16px 16px 0",
      "@media(min-width: 768px)": {
        padding: "24px 32px 0",
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
          <Logo logo="main" width={140} />
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
