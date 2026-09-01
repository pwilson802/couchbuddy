import { getCuratedProviders } from "./providers";

export function getMovieCertification(releaseDatesResults, country) {
  const entry = (releaseDatesResults || []).find(
    (item) => item.iso_3166_1 === country
  );
  if (!entry) return null;
  const withCert = (entry.release_dates || []).find(
    (release) => release.certification
  );
  return withCert ? withCert.certification : null;
}

export function getTvContentRating(contentRatingsResults, country) {
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
export function filterProviders(watchProviders, country, curatedIds) {
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

// Used to re-fetch just the country-specific parts of a title (not the
// full detail page payload) when the viewer changes country after the
// page has already loaded - see api/watchinfo/[id].js.
export async function fetchWatchInfo(id, view, country) {
  const mediaType = view === "tv" ? "tv" : "movie";
  const append =
    mediaType === "tv" ? "watch/providers,content_ratings" : "watch/providers,release_dates";
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${process.env.TMB_KEY}&language=en-US&append_to_response=${append}`;

  const curatedProvidersPromise = getCuratedProviders(country, mediaType);

  let data;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    data = await response.json();
  } catch {
    return null;
  }

  const curatedProviders = await curatedProvidersPromise;
  const curatedIds = new Set(
    curatedProviders.map((provider) => String(provider.provider_id))
  );

  const certification =
    mediaType === "tv"
      ? getTvContentRating(data.content_ratings?.results, country)
      : getMovieCertification(data.release_dates?.results, country);

  return {
    certification,
    providers: filterProviders(data["watch/providers"], country, curatedIds),
  };
}
