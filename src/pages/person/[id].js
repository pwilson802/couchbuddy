/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useEffect } from "react";
import Head from "next/head";
import Footer from "../../components/Footer";
import DetailPageNav from "../../components/DetailPageNav";
import PersonDetail from "../../components/PersonDetail";
import { slugify, parseIdParam, personHref } from "../../lib/slug";

const MAX_CREDITS = 40;

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

// Talk, News, Reality - sorting combined_credits by raw popularity surfaces
// these constantly, since a long-running talk show accrues huge popularity
// from its own audience regardless of how incidental a single guest
// appearance was to the actual person (a one-episode "Self" credit on The
// Tonight Show can out-popularity an actor's own starring films). Excluding
// the format outright is more reliable than trying to detect "Self" credits
// by name, since talk shows use it inconsistently.
const EXCLUDED_TV_GENRES = new Set([10767, 10763, 10764]);

// How central the role actually was, not how popular the title is - a movie
// billed order:0 (lead) scores 1.0, tapering off for lower billing; a TV
// role scores by episode_count, capped at 20 since a long-running regular
// doesn't need to keep outscoring an already-clear "regular" once there.
// TMDB doesn't populate `order` on TV combined_credits, so episode_count is
// the only signal available there.
function roleProminence(item) {
  if (item.media_type === "movie") {
    const order = item.order ?? 15;
    return 1 / (1 + order);
  }
  return Math.min((item.episode_count || 0) / 20, 1);
}

function normalizePerson(person) {
  // Acting credits only (not crew/directing) - "movies they are in", ranked
  // by role prominence (see roleProminence) scaled by the title's own
  // popularity so well-known work still edges out equally-prominent but
  // obscure work, then capped so a prolific actor's page doesn't turn into
  // an unbounded grid.
  const credits = (person.combined_credits?.cast || [])
    .filter(
      (item) =>
        (item.media_type === "movie" || item.media_type === "tv") &&
        item.poster_path
    )
    .filter(
      (item) =>
        item.media_type !== "tv" ||
        !(item.genre_ids || []).some((id) => EXCLUDED_TV_GENRES.has(id))
    )
    .map((item) => ({
      ...item,
      _score: roleProminence(item) * Math.sqrt(item.popularity || 0),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, MAX_CREDITS)
    .map((item) => ({
      id: item.id,
      mediaType: item.media_type,
      title: item.media_type === "tv" ? item.name : item.title,
      posterPath: item.poster_path,
      character: item.character || null,
      year:
        (item.media_type === "tv" ? item.first_air_date : item.release_date || "").split(
          "-"
        )[0] || null,
      voteAverage: item.vote_average
        ? Number(item.vote_average).toFixed(1)
        : null,
    }));

  return {
    id: person.id,
    name: person.name,
    biography: person.biography || null,
    profilePath: person.profile_path,
    birthday: person.birthday || null,
    placeOfBirth: person.place_of_birth || null,
    href: personHref(person.id, person.name),
    credits,
  };
}

export async function getServerSideProps({ params, res }) {
  const id = parseIdParam(params.id);
  if (!id) return { notFound: true };

  const url = `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMB_KEY}&language=en-US&append_to_response=combined_credits`;

  let person;
  try {
    const response = await fetchRetry(url, 3);
    if (!response.ok) return { notFound: true };
    person = await response.json();
  } catch {
    return { notFound: true };
  }
  if (!person || !person.id) return { notFound: true };

  const canonicalSlug = slugify(person.name);
  const requestedSlug = params.id.slice(id.length).replace(/^-/, "");
  if (requestedSlug !== canonicalSlug) {
    return {
      redirect: {
        destination: `/person/${id}-${canonicalSlug}`,
        permanent: true,
      },
    };
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );

  return { props: { data: normalizePerson(person) } };
}

export default function PersonPage({
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

  const description = data.biography
    ? data.biography.slice(0, 200)
    : `${data.name} on CouchBuddy`;
  const canonicalUrl = `https://couchbuddy.info${data.href}`;
  const imageUrl = data.profilePath
    ? `https://image.tmdb.org/t/p/w500${data.profilePath}`
    : "https://couchbuddy-images.s3.amazonaws.com/twitter-card-main5.png";

  return (
    <div>
      <Head>
        <title>{`${data.name} - CouchBuddy`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={data.name} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.name} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: data.name,
              description: data.biography || undefined,
              image: imageUrl,
              birthDate: data.birthday || undefined,
              birthPlace: data.placeOfBirth || undefined,
            }),
          }}
        />
      </Head>
      <main>
        <DetailPageNav
          mode={mode}
          changeMode={changeMode}
          location={location}
          handleLocation={handleLocation}
        />
        <PersonDetail data={data} mode={mode} />
        <Footer
          activePage="person"
          mode={mode}
          location={location}
          handleLocation={handleLocation}
        />
      </main>
    </div>
  );
}
