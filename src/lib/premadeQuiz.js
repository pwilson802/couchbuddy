// Pre-made, hand/LLM-researched quiz files for popular titles live in the
// couchbuddy-data S3 bucket, served through CloudFront - see
// couchbuddy-data-upload/titlequiz. The old TMDB-metadata-generated quiz
// (budget/year/country guessing games) has been retired: the "Test Your
// Knowledge" section only shows up on a detail page at all when a real
// pre-made quiz exists for that title, so this is a cheap existence check
// done at page-render time, not a full quiz fetch.
const PREMADE_QUIZ_BASE_URL = "https://d1jby5x0ota8zi.cloudfront.net/titlequiz";

const fetchRetry = async (url, options, attemptsLeft) => {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (attemptsLeft <= 1) throw err;
    return fetchRetry(url, options, attemptsLeft - 1);
  }
};

export async function hasPremadeQuiz(type, id) {
  try {
    const response = await fetchRetry(
      `${PREMADE_QUIZ_BASE_URL}/${type}/${id}.json`,
      { method: "HEAD" },
      2
    );
    return response.ok;
  } catch {
    return false;
  }
}
