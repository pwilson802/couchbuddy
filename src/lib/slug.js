export function slugify(text) {
  const slug = (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "title";
}

// The leading digits are the only part actually used to look the title up -
// everything after the first "-" is a cosmetic/SEO slug that's allowed to
// go stale (e.g. after a title change) without breaking the link.
export function parseIdParam(param) {
  const match = /^(\d+)/.exec(param || "");
  return match ? match[1] : null;
}

// country is passed through as a query param so the detail page's
// country-specific data (certification, streaming providers) matches what
// the user was actually searching in, rather than falling back to a guess
// from the request's geo headers (which don't exist on localhost, and
// don't reflect a country the user picked manually rather than lives in).
export function movieHref(id, title, country) {
  const suffix = country ? `?country=${country}` : "";
  return `/movie/${id}-${slugify(title)}${suffix}`;
}

export function tvHref(id, title, country) {
  const suffix = country ? `?country=${country}` : "";
  return `/tv/${id}-${slugify(title)}${suffix}`;
}

export function personHref(id, name) {
  return `/person/${id}-${slugify(name)}`;
}
