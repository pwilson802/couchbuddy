// Shared between server-only party.js and client party/* components -
// deliberately has zero other imports so it's always safe to pull into
// client bundles (unlike party.js/db.js/movieStack.js, which drag in `pg`
// and TMDB fetch helpers that have no business in browser code).
export const MAX_PLAYERS = 6;
