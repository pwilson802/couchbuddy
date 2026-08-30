// Values that show up across TMDB's certification lists but aren't a real
// content-advisory tier a user would want to filter by - either "no rating
// recorded" markers, or restricted/banned classifications that don't belong
// as a searchable category on a mainstream movie/TV discovery site (mirrors
// what the old pipeline's hand-curated per-country allowlists excluded, e.g.
// AU's "RC" (Refused Classification) and "X 18+"). This is a denylist of
// obviously-not-useful values rather than an allowlist of "correct" ones per
// country, so it doesn't go stale the way a hardcoded per-country value list
// does when a classification board changes its scheme (confirmed several of
// the old pipeline's exact values no longer exist in TMDB's current data for
// FR, ES, NZ, and IT).
const EXCLUDED = new Set([
  "NR",
  "UR",
  "NOT RATED",
  "UNRATED",
  "RC",
  "BANNED",
  "X",
  "XX",
  "X18+",
  "X 18+",
  "RESTRICTED SCREENING",
]);

export default async function handler(req, res) {
  const TMB_KEY = process.env.TMB_KEY;
  const { country = "AU", view = "movie" } = req.query;
  const mediaType = view === "tv" ? "tv" : "movie";
  const url = `https://api.themoviedb.org/3/certification/${mediaType}/list?api_key=${TMB_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    res.status(200).json([]);
    return;
  }
  const data = await response.json();
  const entries = data.certifications?.[country] || [];

  const certifications = entries
    .filter((item) => !EXCLUDED.has(item.certification.toUpperCase()))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => item.certification);

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );
  res.status(200).json(certifications);
}
