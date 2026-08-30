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

export default async function handler(req, res) {
  const TMB_KEY = process.env.TMB_KEY;
  const { country = "AU", view = "movie" } = req.query;
  const mediaType = view === "tv" ? "tv" : "movie";
  const url = `https://api.themoviedb.org/3/watch/providers/${mediaType}?api_key=${TMB_KEY}&watch_region=${country}&language=en-US`;

  const response = await fetch(url);
  if (!response.ok) {
    res.status(200).json({});
    return;
  }
  const data = await response.json();

  const ranked = (data.results || [])
    .filter(
      (item) =>
        item.display_priorities &&
        country in item.display_priorities &&
        !TRANSACTIONAL_ONLY_IDS.has(item.provider_id)
    )
    .sort(
      (a, b) => a.display_priorities[country] - b.display_priorities[country]
    )
    .slice(0, MAX_PROVIDERS);

  const providers = {};
  ranked.forEach((item, index) => {
    providers[item.provider_id] = {
      name: item.provider_name,
      logo: "https://image.tmdb.org/t/p/w185" + item.logo_path,
      priority: index,
    };
  });

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );
  res.status(200).json(providers);
}
