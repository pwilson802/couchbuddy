export default async function handler(req, res) {
  let TMB_KEY = process.env.TMB_KEY;
  const {
    query: { id },
  } = req;
  let url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMB_KEY}&language=en-US`;
  const response = await fetch(url);
  const allMovieResponse = await response.json();
  const trailers = allMovieResponse.results.filter(
    (item) => item.type === "Trailer" && item.site === "YouTube"
  );
  console.log("trailers", trailers);
  if (trailers.length === 0) {
    const httpResponse = { result: false, id: "" };
    res.status(200).json(JSON.stringify(httpResponse));
  } else {
    const httpResponse = { result: true, id: trailers[0].key };
    res.status(200).json(JSON.stringify(httpResponse));
  }
  //   const youtubeTrailer = movieDetails.map((item) => item.site === "YouTube");
}
