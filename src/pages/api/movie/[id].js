export default async function handler(req, res) {
  let TMB_KEY = process.env.TMB_KEY;
  const {
    query: { id, providers, country = "AU" },
  } = req;
  let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMB_KEY}&language=en-US`;
  const watchUrl = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${TMB_KEY}`;
  let retry = 0;
  while (true) {
    const response = await fetchRetry(url, 3);
    if (response.ok) {
      const movieDetails = await response.json();
      movieDetails.matchedProviders = await getMatchedProviders(
        watchUrl,
        providers,
        country
      );
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=3600, stale-while-revalidate=86400"
      );
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

async function getMatchedProviders(watchUrl, providers, country) {
  if (!providers) return [];
  const selected = providers.split("|");
  try {
    const response = await fetch(watchUrl);
    if (!response.ok) return [];
    const data = await response.json();
    const flatrate = data.results?.[country]?.flatrate || [];
    return flatrate
      .map((item) => String(item.provider_id))
      .filter((providerId) => selected.includes(providerId));
  } catch {
    return [];
  }
}

const fetchRetry = async (url, n) => {
  try {
    return await fetch(url);
  } catch (err) {
    console.log("failed to fetch", n);
    if (n === 1) throw err;
    return await fetchRetry(url, n - 1);
  }
};
