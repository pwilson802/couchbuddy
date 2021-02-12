export default async function handler(req, res) {
  let TMB_KEY = process.env.TMB_KEY;
  const {
    query: { id },
  } = req;
  let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMB_KEY}&language=en-US`;
  const response = await fetch(url);
  const movieDetails = await response.json();
  res.status(200).json(JSON.stringify(movieDetails));
}
