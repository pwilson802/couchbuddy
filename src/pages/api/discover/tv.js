import { certificationQueryValue } from "../../../data/certifications";

const MAX_BACKFILL_PAGES = 3;

function buildParams({
  genres,
  providers,
  certifications,
  country,
  dateStart,
  dateEnd,
  status,
  sortByVote,
  page,
}) {
  const params = new URLSearchParams({
    api_key: process.env.TMB_KEY,
    language: "en-US",
    include_adult: "false",
    page: String(page),
    sort_by: sortByVote === "true" ? "vote_average.desc" : "popularity.desc",
  });
  if (sortByVote === "true") {
    params.set("vote_count.gte", "14");
  }
  if (genres) params.set("with_genres", genres);
  if (providers) {
    params.set("with_watch_providers", providers);
    params.set("watch_region", country);
    params.set("with_watch_monetization_types", "flatrate");
  }
  if (certifications) {
    const mapped = certifications
      .split("|")
      .map((label) => certificationQueryValue(country, label))
      .join("|");
    params.set("certification_country", country);
    params.set("certification", mapped);
  }
  if (dateStart && Number(dateStart) > 1950) {
    params.set("first_air_date.gte", `${dateStart}-01-01`);
  }
  if (dateEnd && Number(dateEnd) < 2030) {
    params.set("first_air_date.lte", `${dateEnd}-12-31`);
  }
  if (status === "finished") {
    params.set("with_status", "3|4");
  }
  return params;
}

async function fetchDiscoverPage(args) {
  const params = buildParams(args);
  const url = `https://api.themoviedb.org/3/discover/tv?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    return { results: [], page: args.page, total_pages: args.page, total_results: 0 };
  }
  return await response.json();
}

async function filterBySeasons(results, seasonsMin, seasonsMax) {
  const details = await Promise.all(
    results.map(async (item) => {
      try {
        const detailUrl = `https://api.themoviedb.org/3/tv/${item.id}?api_key=${process.env.TMB_KEY}`;
        const detailResponse = await fetch(detailUrl);
        if (!detailResponse.ok) return null;
        const detail = await detailResponse.json();
        return detail.number_of_seasons >= seasonsMin &&
          detail.number_of_seasons <= seasonsMax
          ? item
          : null;
      } catch {
        return null;
      }
    })
  );
  return details.filter(Boolean);
}

export default async function handler(req, res) {
  const {
    seasonsMin,
    seasonsMax,
    page = "1",
  } = req.query;
  const needsSeasonFilter =
    seasonsMin && seasonsMax && (Number(seasonsMin) > 1 || Number(seasonsMax) < 50);

  let currentPage = Number(page);
  let accumulated = [];
  let lastData = null;
  let attempts = 0;

  do {
    lastData = await fetchDiscoverPage({ ...req.query, page: currentPage });
    let pageResults = lastData.results || [];
    if (needsSeasonFilter) {
      pageResults = await filterBySeasons(
        pageResults,
        Number(seasonsMin),
        Number(seasonsMax)
      );
    }
    accumulated = accumulated.concat(pageResults);
    currentPage += 1;
    attempts += 1;
  } while (
    needsSeasonFilter &&
    accumulated.length < 20 &&
    lastData.page < lastData.total_pages &&
    attempts < MAX_BACKFILL_PAGES
  );

  res.setHeader(
    "Cache-Control",
    needsSeasonFilter
      ? "no-store"
      : "public, s-maxage=1800, stale-while-revalidate=3600"
  );
  res.status(200).json({
    results: accumulated,
    nextPage: currentPage,
    total_pages: lastData ? lastData.total_pages : 0,
    total_results: lastData ? lastData.total_results : 0,
  });
}
