// Node's fetch has been observed to intermittently ETIMEDOUT against TMDB in
// this environment even when the same request succeeds immediately via curl
// (same root cause as api/movie/[id].js's fetchRetry) - retry a couple of
// times before giving up.
const fetchRetry = async (url, attemptsLeft) => {
  try {
    const response = await fetch(url);
    return response;
  } catch (err) {
    if (attemptsLeft <= 1) throw err;
    return fetchRetry(url, attemptsLeft - 1);
  }
};

async function fetchJson(url) {
  const response = await fetchRetry(url, 3);
  if (!response.ok) return null;
  return response.json();
}

// Every quiz question must be ABOUT the title the viewer is already looking
// at (it's the subject named in the question), never a hidden answer choice
// among several movies - the viewer already knows which title's page
// they're on, so "which movie is this from?" gives nothing away to guess.
// Translations/backdrops are therefore needed for distractor titles too
// (real foreign titles / real stills from OTHER movies, used as wrong
// answers), not just the main title.
function normalizeTranslations(item, mediaType) {
  const ownTitle = mediaType === "tv" ? item.name : item.title;
  return (item.translations?.translations || [])
    .map((entry) => ({
      language: entry.english_name,
      title: mediaType === "tv" ? entry.data?.name : entry.data?.title,
    }))
    .filter(
      (entry) =>
        entry.title &&
        entry.title.trim() &&
        entry.title.trim().toLowerCase() !== (ownTitle || "").trim().toLowerCase()
    );
}

function normalizeDistractor(item, mediaType) {
  if (!item) return null;
  return {
    title: mediaType === "tv" ? item.name : item.title,
    tagline: item.tagline || null,
    releaseYear:
      (mediaType === "tv" ? item.first_air_date : item.release_date || "").split(
        "-"
      )[0] || null,
    runtime:
      mediaType === "tv"
        ? item.number_of_episodes || null
        : item.runtime || null,
    seasons: mediaType === "tv" ? item.number_of_seasons || null : null,
    budget: mediaType === "movie" ? item.budget || 0 : 0,
    revenue: mediaType === "movie" ? item.revenue || 0 : 0,
    originalLanguage: item.original_language || null,
    backdrops: (item.images?.backdrops || []).map((b) => b.file_path).filter(Boolean),
    translations: normalizeTranslations(item, mediaType),
  };
}

export default async function handler(req, res) {
  const { id } = req.query;
  const view = req.query.view === "tv" ? "tv" : "movie";
  const mediaType = view;
  const key = process.env.TMB_KEY;

  const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${key}&language=en-US&append_to_response=keywords,translations,recommendations,images`;

  let main;
  try {
    main = await fetchJson(url);
  } catch {
    main = null;
  }
  if (!main || !main.id) {
    res.status(200).json({ main: null, distractors: [] });
    return;
  }

  const recommendations = (main.recommendations?.results || []).slice(0, 6);
  const distractorResults = await Promise.all(
    recommendations.map(async (item) => {
      try {
        const detailUrl = `https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${key}&language=en-US&append_to_response=translations,images`;
        const detail = await fetchJson(detailUrl);
        return normalizeDistractor(detail, mediaType);
      } catch {
        return null;
      }
    })
  );
  const distractors = distractorResults.filter(Boolean);

  const keywords =
    mediaType === "tv"
      ? main.keywords?.results || []
      : main.keywords?.keywords || [];
  const mainTitle = mediaType === "tv" ? main.name : main.title;
  const mainOriginalTitle = mediaType === "tv" ? main.original_name : main.original_title;
  const translations = normalizeTranslations(main, mediaType);
  const backdrops = (main.images?.backdrops || [])
    .map((item) => item.file_path)
    .filter(Boolean);

  let collection = null;
  if (mediaType === "movie" && main.belongs_to_collection) {
    try {
      const collectionUrl = `https://api.themoviedb.org/3/collection/${main.belongs_to_collection.id}?api_key=${key}&language=en-US`;
      const collectionData = await fetchJson(collectionUrl);
      if (collectionData) {
        collection = {
          name: collectionData.name,
          count: (collectionData.parts || []).length,
        };
      }
    } catch {
      collection = null;
    }
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.status(200).json({
    main: {
      id: main.id,
      title: mainTitle,
      // Only worth asking about when it's genuinely different from the
      // display title - most English-language titles are identical to
      // their own "original title" and that makes for a useless question.
      originalTitle:
        mainOriginalTitle &&
        mainOriginalTitle.trim().toLowerCase() !== (mainTitle || "").trim().toLowerCase()
          ? mainOriginalTitle
          : null,
      originalLanguage: main.original_language || null,
      productionCountries: (main.production_countries || []).map((c) => c.name),
      tagline: main.tagline || null,
      releaseYear:
        (mediaType === "tv" ? main.first_air_date : main.release_date || "").split(
          "-"
        )[0] || null,
      runtime:
        mediaType === "tv" ? main.number_of_episodes || null : main.runtime || null,
      seasons: mediaType === "tv" ? main.number_of_seasons || null : null,
      budget: mediaType === "movie" ? main.budget || 0 : 0,
      revenue: mediaType === "movie" ? main.revenue || 0 : 0,
      keywords: keywords.map((k) => k.name),
      translations,
      backdrops,
      collection,
    },
    distractors,
  });
}
