const MAX_QUESTIONS = 10;

// A handful of clearly-unrelated keywords used as the "odd one out" in the
// keyword question - filtered per-title against the real keyword list so a
// genuine coincidence (a movie actually about a cooking competition) can't
// accidentally produce a broken question.
const GENERIC_KEYWORDS = [
  "cooking competition",
  "figure skating",
  "spelling bee",
  "knitting circle",
  "beauty pageant",
  "gardening club",
  "chess tournament",
  "ballroom dancing",
  "stand-up comedy",
  "flower arranging",
  "birdwatching",
  "crossword puzzles",
];

function shuffle(data) {
  const arr = [...data];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function uniqueSample(pool, count, exclude = []) {
  const excluded = new Set(exclude.map((item) => String(item).toLowerCase()));
  const seen = new Set();
  const result = [];
  for (const item of shuffle(pool)) {
    if (item == null) continue;
    const key = String(item).toLowerCase();
    if (excluded.has(key) || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
    if (result.length >= count) break;
  }
  return result;
}

function makeQuestionObject(question, correctAnswer, distractorAnswers, imageUrl) {
  const answers = shuffle([
    { answer: correctAnswer, correct: true },
    ...distractorAnswers.map((answer) => ({ answer, correct: false })),
  ]);
  return { question, answers, imageUrl: imageUrl || false };
}

function formatMoney(amount) {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)} billion`;
  }
  if (amount >= 1_000_000) {
    return `$${Math.round(amount / 1_000_000)} million`;
  }
  if (amount >= 1_000) {
    return `$${Math.round(amount / 1_000)} thousand`;
  }
  return `$${amount}`;
}

function distractorTitles(distractors, exclude, count = 3) {
  return uniqueSample(
    distractors.map((item) => item.title).filter(Boolean),
    count,
    exclude
  );
}

function makeForeignTitleQuestion(main, distractors, label) {
  if (!main.translations || main.translations.length === 0) return null;
  const pick = main.translations[Math.floor(Math.random() * main.translations.length)];
  const options = distractorTitles(distractors, [main.title]);
  if (options.length < 3) return null;
  return makeQuestionObject(
    `This ${label} is called "${pick.title}" in ${pick.language}. Which ${label} is it?`,
    main.title,
    options,
    false
  );
}

function makeBackdropQuestion(main, distractors, label) {
  if (!main.backdrops || main.backdrops.length === 0) return null;
  const options = distractorTitles(distractors, [main.title]);
  if (options.length < 3) return null;
  const backdrop = main.backdrops[Math.floor(Math.random() * main.backdrops.length)];
  return makeQuestionObject(
    `Which ${label} is this a scene from?`,
    main.title,
    options,
    `https://image.tmdb.org/t/p/w500${backdrop}`
  );
}

function makeTaglineQuestion(main, distractors, label) {
  if (!main.tagline || !main.tagline.trim()) return null;
  const options = distractorTitles(distractors, [main.title]);
  if (options.length < 3) return null;
  return makeQuestionObject(
    `Which ${label} has the tagline: "${main.tagline}"?`,
    main.title,
    options,
    false
  );
}

function makeBudgetQuestion(main, distractors, label) {
  if (!main.budget || main.budget < 10000) return null;
  const options = uniqueSample(
    distractors.map((item) => item.budget).filter((value) => value >= 10000),
    3,
    [main.budget]
  );
  if (options.length < 3) return null;
  return makeQuestionObject(
    `What was the approximate budget for this ${label}?`,
    formatMoney(main.budget),
    options.map(formatMoney),
    false
  );
}

function makeRevenueQuestion(main, distractors, label) {
  if (!main.revenue || main.revenue < 10000) return null;
  const options = uniqueSample(
    distractors.map((item) => item.revenue).filter((value) => value >= 10000),
    3,
    [main.revenue]
  );
  if (options.length < 3) return null;
  return makeQuestionObject(
    `Approximately how much did this ${label} make at the box office?`,
    formatMoney(main.revenue),
    options.map(formatMoney),
    false
  );
}

function makeYearQuestion(main, distractors, label) {
  if (!main.releaseYear) return null;
  const options = uniqueSample(
    distractors.map((item) => item.releaseYear).filter(Boolean),
    3,
    [main.releaseYear]
  );
  if (options.length < 3) return null;
  return makeQuestionObject(
    `What year did this ${label} first come out?`,
    main.releaseYear,
    options,
    false
  );
}

function makeRuntimeQuestion(main, distractors, label, type) {
  if (!main.runtime) return null;
  const options = uniqueSample(
    distractors.map((item) => item.runtime).filter(Boolean),
    3,
    [main.runtime]
  );
  if (options.length < 3) return null;
  const questionText =
    type === "tv"
      ? `How many episodes does this show have?`
      : `How long is this movie (in minutes)?`;
  const format = (value) => (type === "tv" ? `${value} episodes` : `${value} min`);
  return makeQuestionObject(questionText, format(main.runtime), options.map(format), false);
}

function makeSeasonsQuestion(main, distractors) {
  if (!main.seasons) return null;
  const options = uniqueSample(
    distractors.map((item) => item.seasons).filter(Boolean),
    3,
    [main.seasons]
  );
  if (options.length < 3) return null;
  const format = (value) => `${value} season${value === 1 ? "" : "s"}`;
  return makeQuestionObject(
    "How many seasons does this show have?",
    format(main.seasons),
    options.map(format),
    false
  );
}

function makeKeywordQuestion(main, distractors, label) {
  if (!main.keywords || main.keywords.length < 3) return null;
  const realKeywords = uniqueSample(main.keywords, 3);
  if (realKeywords.length < 3) return null;
  const realLower = new Set(main.keywords.map((k) => k.toLowerCase()));
  const fake = shuffle(GENERIC_KEYWORDS).find((k) => !realLower.has(k.toLowerCase()));
  if (!fake) return null;
  return makeQuestionObject(
    `Which of these does NOT describe this ${label}?`,
    fake,
    realKeywords,
    false
  );
}

function makeCollectionQuestion(main) {
  if (!main.collection || !main.collection.count || main.collection.count < 2) {
    return null;
  }
  const correct = main.collection.count;
  const candidates = [correct - 1, correct + 1, correct + 2, correct - 2, correct + 3]
    .filter((value) => value >= 2 && value !== correct);
  const options = uniqueSample(candidates, 3, [correct]);
  if (options.length < 3) return null;
  return makeQuestionObject(
    `How many films are in the ${main.collection.name}?`,
    String(correct),
    options.map(String),
    false
  );
}

export function makeTitleQuestions(main, distractors, type) {
  if (!main) return [];
  const label = type === "tv" ? "show" : "movie";

  const candidates = [
    makeForeignTitleQuestion(main, distractors, label),
    makeBackdropQuestion(main, distractors, label),
    makeBackdropQuestion(main, distractors, label),
    makeTaglineQuestion(main, distractors, label),
    makeBudgetQuestion(main, distractors, label),
    makeRevenueQuestion(main, distractors, label),
    makeYearQuestion(main, distractors, label),
    type === "tv"
      ? makeSeasonsQuestion(main, distractors)
      : makeRuntimeQuestion(main, distractors, label, type),
    type === "tv" ? makeRuntimeQuestion(main, distractors, label, type) : null,
    makeKeywordQuestion(main, distractors, label),
    makeCollectionQuestion(main),
  ].filter(Boolean);

  return shuffle(candidates).slice(0, MAX_QUESTIONS);
}
