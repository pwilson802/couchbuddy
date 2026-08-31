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
  "-", // stray placeholder value in TMDB's own TV data for Thailand
]);

// A handful of specific, verified per-country/media-type exclusions that
// the generic rules above and below can't catch, each verified individually
// rather than inferred from a pattern - deliberately NOT a generic rule
// (e.g. a generic "collapse prefix matches" rule to catch Portugal's "P"
// duplicate below would also incorrectly merge India's "U" and "UA", which
// are genuinely different ratings, not duplicates). Keyed by "country:view"
// since a code can mean different things between a country's movie and TV
// schemes.
const PER_COUNTRY_EXCLUSIONS = {
  // Same general-audience tier as "Públicos", just abbreviated - the
  // digit-based dedupe below can't catch this since neither code has a
  // number in it.
  "PT:movie": new Set(["P"]),
  // "P" and "C" are AU free-to-air scheduling classifications for
  // children's timeslots (when a show may air, not a maturity rating like
  // G/PG/M), and are almost never actually applied to titles in TMDB's TV
  // data (verified: 5 and 9 results respectively across the *entire*
  // catalog, vs. 971 for "G") - combined with any real search they
  // practically always return nothing, so they're confusing dead ends
  // rather than a useful filter.
  "AU:tv": new Set(["P", "C"]),
};

// Several countries' schemes carry two parallel codes for the same
// underlying age tier - e.g. NZ's "R13" and "RP13", GB's "12" and "12A",
// Turkey's "6+" and "6A" - which TMDB tracks as distinct certification
// values but which are indistinguishable to someone just trying to filter
// by age. Group entries that share the same embedded age number and keep
// only the one TMDB itself ranks first (lowest `order`) as the
// representative, rather than showing every near-duplicate variant.
function ageNumber(certification) {
  const match = certification.match(/\d+/);
  return match ? match[0] : null;
}

function dedupeByAgeTier(entries) {
  const groups = new Map();
  const singles = [];
  for (const item of entries) {
    const key = ageNumber(item.certification);
    if (key === null) {
      singles.push(item);
      continue;
    }
    const existing = groups.get(key);
    if (!existing || (item.order ?? 0) < (existing.order ?? 0)) {
      groups.set(key, item);
    }
  }
  return [...singles, ...groups.values()];
}

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
  const perCountryExclusions = PER_COUNTRY_EXCLUSIONS[`${country}:${mediaType}`];

  const filtered = entries.filter(
    (item) =>
      !EXCLUDED.has(item.certification.toUpperCase()) &&
      !perCountryExclusions?.has(item.certification)
  );
  const certifications = dedupeByAgeTier(filtered)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => item.certification);

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );
  res.status(200).json(certifications);
}
