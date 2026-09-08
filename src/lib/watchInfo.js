import { getCuratedProviders, NOT_A_REAL_SERVICE_IDS } from "./providers";

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

// Flatrate (subscription) is filtered down to curatedIds - TMDB's own
// flatrate list for a title includes every regional bundle/add-on channel
// it knows about, which is a lot noisier than the ~40 services the search
// feature's provider picker actually offers as filter options (and matches
// its own with_watch_monetization_types=flatrate-only discover queries).
//
// Rent/buy is a different case: there's no discover-filter equivalent to
// stay consistent with, and TMDB's per-title rent/buy list is already just
// the handful of real storefronts that actually sell/rent that title (not
// a firehose of every regional service) - including transactional-only
// ones like Apple TV Store, Google Play, Amazon Video, Vudu, YouTube that
// curatedIds deliberately excludes for the flatrate picker. So rent/buy is
// mapped straight through, uncurated.
export function filterProviders(watchProviders, country, curatedIds) {
  const entry = watchProviders?.results?.[country];
  const mapAll = (list) =>
    (list || [])
      .filter((provider) => !NOT_A_REAL_SERVICE_IDS.has(provider.provider_id))
      .map((provider) => ({
        id: provider.provider_id,
        name: provider.provider_name,
        logoPath: provider.logo_path,
      }));
  const mapCurated = (list) =>
    mapAll(list).filter((provider) => curatedIds.has(String(provider.id)));
  if (!entry) return { flatrate: [], rent: [], buy: [], link: null };
  return {
    flatrate: mapCurated(entry.flatrate),
    rent: mapAll(entry.rent),
    buy: mapAll(entry.buy),
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
