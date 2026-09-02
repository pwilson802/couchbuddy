function keysWhereTrue(obj) {
  return Object.keys(obj || {}).filter((key) => obj[key]);
}

function firstValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function splitPipe(value) {
  const raw = firstValue(value);
  if (!raw) return [];
  return raw.split("|").filter(Boolean);
}

function boolMap(list) {
  return list.reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});
}

function splitRange(value, fallback) {
  const raw = firstValue(value);
  if (!raw) return fallback;
  const parts = raw.split("-").map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) return fallback;
  return parts;
}

// Encodes a SearchPage submission into a shareable/refreshable URL query -
// only the fields that actually change the discover query, using the same
// "selected key" shapes the components already work with (not TMDB ids/
// labels - those get resolved from these at fetch time same as before).
// allProviderData is deliberately excluded: it's large, purely derived, and
// re-fetched independently on restore (see searchDetailsFromQuery callers).
export function searchDetailsToQuery(searchData) {
  const query = { view: searchData.view };

  const genres = keysWhereTrue(searchData.selectedGenres);
  if (genres.length) query.genres = genres.join("|");

  const providers = keysWhereTrue(searchData.selectedProviders);
  if (providers.length) query.providers = providers.join("|");

  const certifications = keysWhereTrue(searchData.selectedCertifications);
  if (certifications.length) query.certifications = certifications.join("|");

  if (searchData.sortByVote) query.sortByVote = "true";

  if (
    searchData.dateRange &&
    (searchData.dateRange[0] !== 1950 || searchData.dateRange[1] !== 2030)
  ) {
    query.dateRange = `${searchData.dateRange[0]}-${searchData.dateRange[1]}`;
  }
  if (searchData.dateFilter === "releaseDate") {
    query.dateFilter = "releaseDate";
  }

  if (searchData.view === "movie") {
    if (searchData.duration != null && searchData.duration !== 400) {
      query.duration = String(searchData.duration);
    }
  } else {
    if (
      searchData.seasons &&
      (searchData.seasons[0] !== 1 || searchData.seasons[1] !== 50)
    ) {
      query.seasons = `${searchData.seasons[0]}-${searchData.seasons[1]}`;
    }
    if (searchData.onlyfinishedTv) query.onlyfinishedTv = "true";
  }

  return query;
}

// Reverses searchDetailsToQuery. Returns null when the query doesn't
// describe a search (e.g. a bare "/" visit) so the caller knows to show
// SearchPage instead.
export function searchDetailsFromQuery(query) {
  const view = firstValue(query.view);
  if (view !== "movie" && view !== "tv") return null;

  const details = {
    view,
    selectedGenres: boolMap(splitPipe(query.genres)),
    selectedProviders: boolMap(splitPipe(query.providers)),
    selectedCertifications: boolMap(splitPipe(query.certifications)),
    sortByVote: firstValue(query.sortByVote) === "true",
    dateRange: splitRange(query.dateRange, [1950, 2030]),
    dateFilter: firstValue(query.dateFilter) === "releaseDate" ? "releaseDate" : "anytime",
  };

  if (view === "movie") {
    const duration = firstValue(query.duration);
    details.duration = duration ? Number(duration) : 400;
  } else {
    details.seasons = splitRange(query.seasons, [1, 50]);
    details.onlyfinishedTv = firstValue(query.onlyfinishedTv) === "true";
  }

  return details;
}
