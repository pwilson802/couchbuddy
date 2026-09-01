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

export function movieHref(id, title) {
  return `/movie/${id}-${slugify(title)}`;
}

export function tvHref(id, title) {
  return `/tv/${id}-${slugify(title)}`;
}
