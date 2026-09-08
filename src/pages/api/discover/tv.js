import { runDiscoverTv } from "../../../lib/discover";

export default async function handler(req, res) {
  const { seasonsMin, seasonsMax } = req.query;
  const needsSeasonFilter =
    seasonsMin && seasonsMax && (Number(seasonsMin) > 1 || Number(seasonsMax) < 50);

  const data = await runDiscoverTv(req.query);
  res.setHeader(
    "Cache-Control",
    needsSeasonFilter ? "no-store" : "public, s-maxage=1800, stale-while-revalidate=3600"
  );
  res.status(200).json(data);
}
