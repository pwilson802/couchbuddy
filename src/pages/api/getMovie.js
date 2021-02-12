export default async function getMovieDetails(id) {
  let TMB_KEY = process.env.TMB_KEY;
  let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMB_KEY}&language=en-US`;
  const response = await fetch(url);
  const movieDetails = await response.json();
  return movieDetails;
}
