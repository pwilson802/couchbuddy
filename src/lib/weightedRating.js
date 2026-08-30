// IMDB-style Bayesian weighted rating: blends an item's own average with the
// candidate pool's average, weighted by how many votes back it up, so a
// title with a handful of enthusiastic votes can't outrank one with tens of
// thousands just because its plain average happens to be a bit higher.
//
//   weighted = (v / (v + m)) * R + (m / (v + m)) * C
//
// v = the item's vote_count, R = the item's vote_average
// m = minimum votes to be trusted at close to face value
// C = the mean vote_average across the candidate pool
//
// Unlike IMDB's own fixed, globally-calibrated m and C, both are computed
// per search from the fetched candidate pool, since a niche genre/provider
// combination can have a vote-count distribution wildly different from a
// mainstream one - a fixed global threshold would either crush every niche
// result toward the mean or do nothing at all for a huge mainstream pool.

function median(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function rankByWeightedRating(items) {
  if (items.length === 0) return items;

  const meanVoteAverage =
    items.reduce((sum, item) => sum + item.vote_average, 0) / items.length;
  const minVotes = median(items.map((item) => item.vote_count));

  const scored = items.map((item) => {
    const v = item.vote_count;
    const weighted =
      (v / (v + minVotes)) * item.vote_average +
      (minVotes / (v + minVotes)) * meanVoteAverage;
    return { ...item, weighted_rating: weighted };
  });

  scored.sort((a, b) => b.weighted_rating - a.weighted_rating);
  return scored;
}
