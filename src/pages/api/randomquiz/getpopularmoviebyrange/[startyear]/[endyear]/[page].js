export default async function handler(req, res) {
  let TMB_KEY = process.env.TMB_KEY;
  const {
    query: { startyear, endyear, page },
  } = req;
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMB_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&primary_release_date.gte=${startyear}-01-01&primary_release_date.lte=${endyear}-01-01&vote_count.gte=300&vote_average.gte=5&with_runtime.gte=80&with_watch_monetization_types=flatrate&page=${page}`
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