import { fetchWatchInfo } from "../../../lib/watchInfo";

// Lets a movie/tv detail page refresh just its certification + streaming
// providers when the viewer changes country after the page has already
// loaded, without re-fetching the whole detail payload (cast, similar
// titles, etc. don't vary by country).
export default async function handler(req, res) {
  const { id, view = "movie", country = "US" } = req.query;
  const info = await fetchWatchInfo(id, view, country.toUpperCase());
  if (!info) {
    res.status(200).json({ certification: null, providers: { flatrate: [], link: null } });
    return;
  }
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1800, stale-while-revalidate=86400"
  );
  res.status(200).json(info);
}
