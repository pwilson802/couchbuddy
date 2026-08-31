export default async function handler(req, res) {
  let TMB_KEY = process.env.TMB_KEY;
  const {
    query: { id },
  } = req;
  let url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMB_KEY}&language=en-US`;
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  // A transient TMDB failure here must never 500 - the client's Promise.all
  // with the movie-detail fetch would reject and the card would spin
  // forever, since it has no error handling of its own. Degrade to "no
  // trailer" instead.
  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(200).json(JSON.stringify({ result: false, id: "" }));
      return;
    }
    const allMovieResponse = await response.json();
    const trailers = (allMovieResponse.results || []).filter(
      (item) => item.type === "Trailer" && item.site === "YouTube"
    );
    const httpResponse =
      trailers.length === 0
        ? { result: false, id: "" }
        : { result: true, id: trailers[0].key };
    res.status(200).json(JSON.stringify(httpResponse));
  } catch {
    res.status(200).json(JSON.stringify({ result: false, id: "" }));
  }
}
