// Hand/LLM-authored quiz files for popular titles, uploaded to the
// couchbuddy-data S3 bucket by couchbuddy-data-upload and served through the
// same CloudFront distribution that bucket has always sat behind. The old
// TMDB-metadata-generated quiz (budget/year/country guessing games) has been
// retired - the detail page only renders "Test Your Knowledge" at all when
// hasPremadeQuiz (src/lib/premadeQuiz.js) confirmed one of these files
// exists for the title, so this route only ever needs to fetch it.
const PREMADE_QUIZ_BASE_URL = "https://d1jby5x0ota8zi.cloudfront.net/titlequiz";

const fetchRetry = async (url, attemptsLeft) => {
  try {
    return await fetch(url);
  } catch (err) {
    if (attemptsLeft <= 1) throw err;
    return fetchRetry(url, attemptsLeft - 1);
  }
};

export default async function handler(req, res) {
  const { id } = req.query;
  const mediaType = req.query.view === "tv" ? "tv" : "movie";

  let questions = null;
  try {
    const response = await fetchRetry(`${PREMADE_QUIZ_BASE_URL}/${mediaType}/${id}.json`, 2);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        questions = data.questions;
      }
    }
  } catch {
    questions = null;
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.status(200).json({ premade: Boolean(questions), questions: questions || [] });
}
