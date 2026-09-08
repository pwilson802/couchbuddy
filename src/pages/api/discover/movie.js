import { runDiscoverMovie } from "../../../lib/discover";

export default async function handler(req, res) {
  const data = await runDiscoverMovie(req.query);
  res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");
  res.status(200).json(data);
}
