const MAX_PROVIDERS = 40;

// TMDB's provider list mixes flatrate (subscription) services with
// transactional rent/buy storefronts, with no way to filter by
// monetization type on this endpoint (confirmed: it silently ignores a
// `monetization_types` param). Since our discover queries only ever
// request `with_watch_monetization_types=flatrate`, selecting one of
// these would just return zero results - and several of them are
// confusingly similar in name/logo to the real flatrate entry (e.g.
// "Apple TV Store" vs "Apple TV", "Amazon Video" vs "Amazon Prime
// Video"). These IDs are global TMDB constants, verified against the
// AU/US/GB/CA provider lists.
const TRANSACTIONAL_ONLY_IDS = new Set([
  2, // Apple TV Store
  3, // Google Play Movies
  7, // Fandango At Home (Vudu)
  10, // Amazon Video
  130, // Sky Store
  192, // YouTube
  332, // Fandango at Home Free
]);

// Not a real destination service a user would recognize or have a
// subscription to - JustWatch is TMDB's own watch-availability data
// partner (the source of this whole endpoint's data), not a streaming
// platform. Its display_priority is a suspiciously flat "4" in nearly
// every country worldwide, unlike a genuine regional service, which
// points to it being a data-aggregation artifact rather than a curated
// catalog someone actually subscribes to.
const NOT_A_REAL_SERVICE_IDS = new Set([
  2285, // JustWatch TV
]);

// The same curated top-40 provider list the search page's picker uses
// (src/pages/api/providers.js), factored out so a title's detail page can
// filter its own watch/providers data down to "the services we actually
// show as options" instead of every regional bundle/add-on channel TMDB
// happens to know about.
export async function getCuratedProviders(country, view) {
  const TMB_KEY = process.env.TMB_KEY;
  const mediaType = view === "tv" ? "tv" : "movie";
  const url = `https://api.themoviedb.org/3/watch/providers/${mediaType}?api_key=${TMB_KEY}&watch_region=${country}&language=en-US`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.results || [])
      .filter(
        (item) =>
          item.display_priorities &&
          country in item.display_priorities &&
          !TRANSACTIONAL_ONLY_IDS.has(item.provider_id) &&
          !NOT_A_REAL_SERVICE_IDS.has(item.provider_id)
      )
      .sort(
        (a, b) => a.display_priorities[country] - b.display_priorities[country]
      )
      .slice(0, MAX_PROVIDERS);
  } catch {
    return [];
  }
}
