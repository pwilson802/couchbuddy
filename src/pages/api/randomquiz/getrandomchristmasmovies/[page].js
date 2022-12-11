export default async function handler(req, res) {
  let TMB_KEY = process.env.TMB_KEY;
  const {
    query: { page },
  } = req;
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMB_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${page}&vote_count.gte=200&vote_average.gte=4&without_genres=99&with_keywords=207317&with_original_language=en&with_watch_monetization_types=flatrate&with_runtime.gte=75`
  let retry = 0;
  while (true) {
    const response = await fetchRetry(url, 3);
    if (response.ok) {
      const movieDetails = await response.json();
      res.status(200).json(JSON.stringify(movieDetails));
      return;
    } else {
      retry += 1;
      console.log("retry number", retry);
      if (retry > 3) {
        res.status(200).json({ response: "Error connecting to tmb api" });
        return;
      }
    }
  }
}

const fetchRetry = async (url, n) => {
  try {
    return await fetch(url);
  } catch (err) {
    if (n === 1) throw err;
    return await fetchRetry(url, n - 1);
  }
};