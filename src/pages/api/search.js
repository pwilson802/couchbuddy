import { movieHref, tvHref, personHref } from "../../lib/slug";

const MAX_RESULTS = 8;

const fetchRetry = async (url, attemptsLeft) => {
  try {
    return await fetch(url);
  } catch (err) {
    if (attemptsLeft <= 1) throw err;
    return fetchRetry(url, attemptsLeft - 1);
  }
};

function normalizeResult(item, country) {
  if (item.media_type === "movie" && item.title) {
    const year = (item.release_date || "").split("-")[0] || null;
    return {
      id: item.id,
      mediaType: "movie",
      title: item.title,
      subtitle: year,
      imagePath: item.poster_path,
      href: movieHref(item.id, item.title, country),
    };
  }
  if (item.media_type === "tv" && item.name) {
    const year = (item.first_air_date || "").split("-")[0] || null;
    return {
      id: item.id,
      mediaType: "tv",
      title: item.name,
      subtitle: year,
      imagePath: item.poster_path,
      href: tvHref(item.id, item.name, country),
    };
  }
  if (item.media_type === "person" && item.name) {
    const knownFor = (item.known_for || [])
      .map((k) => k.title || k.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(", ");
    return {
      id: item.id,
      mediaType: "person",
      title: item.name,
      subtitle: knownFor || null,
      imagePath: item.profile_path,
      href: personHref(item.id, item.name),
    };
  }
  return null;
}

// Backs the site-wide search box (see SearchBox.js) - TMDB's /search/multi
// covers movies, TV, and people in one call, which is exactly the mix a
// visitor typing a name into a single box expects to find.
export default async function handler(req, res) {
  const query = (req.query.q || "").toString().trim();
  const country = (req.query.country || "US").toString().toUpperCase();

  if (query.length < 2) {
    res.status(200).json({ results: [] });
    return;
  }

  const url = `https://api.themoviedb.org/3/search/multi?api_key=${
    process.env.TMB_KEY
  }&language=en-US&include_adult=false&query=${encodeURIComponent(query)}`;

  let data;
  try {
    const response = await fetchRetry(url, 2);
    if (!response.ok) {
      res.status(200).json({ results: [] });
      return;
    }
    data = await response.json();
  } catch {
    res.status(200).json({ results: [] });
    return;
  }

  const results = (data.results || [])
    .filter((item) => (item.popularity || 0) > 0)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .map((item) => normalizeResult(item, country))
    .filter(Boolean)
    .slice(0, MAX_RESULTS);

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.status(200).json({ results });
}
