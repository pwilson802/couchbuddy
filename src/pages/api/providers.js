export default async function handler(req, res) {
  const TMB_KEY = process.env.TMB_KEY;
  const { country = "AU", view = "movie" } = req.query;
  const mediaType = view === "tv" ? "tv" : "movie";
  const url = `https://api.themoviedb.org/3/watch/providers/${mediaType}?api_key=${TMB_KEY}&watch_region=${country}&language=en-US`;

  const response = await fetch(url);
  if (!response.ok) {
    res.status(200).json({});
    return;
  }
  const data = await response.json();

  const ranked = (data.results || [])
    .filter((item) => item.display_priorities && country in item.display_priorities)
    .sort(
      (a, b) => a.display_priorities[country] - b.display_priorities[country]
    );

  const providers = {};
  ranked.forEach((item, index) => {
    providers[item.provider_id] = {
      name: item.provider_name,
      logo: "https://image.tmdb.org/t/p/w185" + item.logo_path,
      priority: index,
    };
  });

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800"
  );
  res.status(200).json(providers);
}
