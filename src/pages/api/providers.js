import { getCuratedProviders } from "../../lib/providers";

export default async function handler(req, res) {
  const { country = "AU", view = "movie" } = req.query;
  const ranked = await getCuratedProviders(country, view);

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
