// Certification rating lists per country, in display order, plus a
// label -> TMDB query-string map. TMDB's actual release_dates data for AU
// uses "MA 15+" / "R 18+" (with a space) even though the classification
// board's own short names (and this UI's button labels) omit it, so the
// query value can differ from the display label. Verified against a live
// title's /movie/{id}/release_dates response.
export const certifications = {
  AU: [
    { label: "G", query: "G" },
    { label: "PG", query: "PG" },
    { label: "M", query: "M" },
    { label: "MA15+", query: "MA 15+" },
    { label: "R18+", query: "R 18+" },
  ],
};

export function getCertificationList(country) {
  return certifications[country] || [];
}

export function certificationQueryValue(country, label) {
  const entry = (certifications[country] || []).find(
    (item) => item.label === label
  );
  return entry ? entry.query : label;
}
