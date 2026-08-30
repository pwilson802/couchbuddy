// Static genre name -> TMDB genre id maps. TMDB's genre lists rarely change,
// so these are hardcoded rather than fetched, removing a network round trip
// from every search page load. Source: GET /genre/movie/list and
// GET /genre/tv/list.

export const movieGenres = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Science Fiction": 878,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

export const tvGenres = {
  Animation: 16,
  Comedy: 35,
  Kids: 10762,
  "Action & Adventure": 10759,
  "Sci-Fi & Fantasy": 10765,
  Reality: 10764,
  Drama: 18,
  Crime: 80,
  Mystery: 9648,
  Soap: 10766,
  Family: 10751,
  Documentary: 99,
  News: 10763,
  Talk: 10767,
  "War & Politics": 10768,
  Western: 37,
  // TMDB has no TV "Romance" genre; kept as a no-op entry so the existing
  // UI toggle (which never matched anything even under the old S3 index)
  // doesn't throw when building query params.
  Romance: null,
};
