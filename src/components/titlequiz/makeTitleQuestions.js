const MAX_QUESTIONS = 10;

// Every question must be ABOUT the title the viewer is already looking at
// (named as the subject in the question text) - never a hidden answer
// choice among several movies, since the viewer already knows which
// title's page they're on. That's why e.g. the foreign-title question asks
// "what was THIS movie called in French" rather than "which movie is
// called X in French" (the latter would just be answerable by re-reading
// the page you're on).

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

const DISTRACTOR_COUNTRIES = [
  "Germany",
  "Brazil",
  "South Korea",
  "Canada",
  "India",
  "Mexico",
  "Spain",
  "Sweden",
  "Italy",
  "Japan",
  "Australia",
  "France",
  "United Kingdom",
  "United States of America",
];

const FRANCHISE_NAMES = [
  "Marvel Cinematic Universe",
  "Fast & Furious",
  "James Bond Collection",
  "Harry Potter Collection",
  "Star Wars Collection",
  "Mission: Impossible Collection",
  "Jurassic Park Collection",
  "Toy Story Collection",
  "The Matrix Collection",
  "Shrek Collection",
];

const LANGUAGE_NAMES = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Mandarin",
  cn: "Cantonese",
  ru: "Russian",
  hi: "Hindi",
  pt: "Portuguese",
  sv: "Swedish",
  da: "Danish",
  nl: "Dutch",
  fi: "Finnish",
  no: "Norwegian",
  pl: "Polish",
  tr: "Turkish",
  th: "Thai",
  ar: "Arabic",
  he: "Hebrew",
  el: "Greek",
  cs: "Czech",
  hu: "Hungarian",
  ro: "Romanian",
  uk: "Ukrainian",
  vi: "Vietnamese",
  id: "Indonesian",
  ta: "Tamil",
  te: "Telugu",
  fa: "Persian",
  ur: "Urdu",
  is: "Icelandic",
};

function languageName(code) {
  return LANGUAGE_NAMES[code] || null;
}

function shuffle(data) {
  const arr = [...data];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function uniqueSample(pool, count, exclude = []) {
  const excluded = new Set(exclude.filter(Boolean).map((item) => String(item).toLowerCase()));
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
  return { question, answers, imageUrl: imageUrl || false, isImageChoice: false };
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

// "What was this called on its French release?" - tries each language the
// main title has a real translation in until we find one where at least 3
// distractor movies also have a genuine translation, so every wrong answer
// is a real title in that same language rather than a guess.
function makeForeignTitleQuestion(main, distractors, label) {
  if (!main.translations || main.translations.length === 0) return null;
  for (const pick of shuffle(main.translations)) {
    const sameLanguageTitles = distractors
      .map((d) => (d.translations || []).find((t) => t.language === pick.language))
      .filter(Boolean)
      .map((t) => t.title);
    const options = uniqueSample(sameLanguageTitles, 3, [pick.title]);
    if (options.length >= 3) {
      return makeQuestionObject(
        `What was this ${label} called on its ${pick.language} release?`,
        pick.title,
        options,
        false
      );
    }
  }
  return null;
}

// "Which of these is a scene from this movie?" - answer OPTIONS are images
// (one real backdrop from this title, three from other movies), not movie
// titles, so the image-choice UI is needed (see TitleQuizQuestion.js).
function makeBackdropQuestion(main, distractors, label) {
  if (!main.backdrops || main.backdrops.length === 0) return null;
  const distractorBackdrops = distractors
    .filter((item) => item.backdrops && item.backdrops.length > 0)
    .map((item) => item.backdrops[Math.floor(Math.random() * item.backdrops.length)]);
  const options = uniqueSample(distractorBackdrops, 3);
  if (options.length < 3) return null;
  const correctBackdrop = main.backdrops[Math.floor(Math.random() * main.backdrops.length)];
  const toUrl = (path) => `https://image.tmdb.org/t/p/w500${path}`;
  const answers = shuffle([
    { answer: toUrl(correctBackdrop), correct: true },
    ...options.map((path) => ({ answer: toUrl(path), correct: false })),
  ]);
  return {
    question: `Which of these is a scene from this ${label}?`,
    answers,
    imageUrl: false,
    isImageChoice: true,
  };
}

function makeTaglineQuestion(main, distractors, label) {
  if (!main.tagline || !main.tagline.trim()) return null;
  const options = uniqueSample(
    distractors.map((item) => item.tagline).filter((tagline) => tagline && tagline.trim()),
    3,
    [main.tagline]
  );
  if (options.length < 3) return null;
  return makeQuestionObject(
    `What is the tagline for this ${label}?`,
    main.tagline,
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

function makeRuntimeQuestion(main, distractors, type, label) {
  if (!main.runtime) return null;
  const options = uniqueSample(
    distractors.map((item) => item.runtime).filter(Boolean),
    3,
    [main.runtime]
  );
  if (options.length < 3) return null;
  const questionText =
    type === "tv"
      ? "How many episodes does this show have?"
      : `How long is this ${label} (in minutes)?`;
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

function makeCollectionCountQuestion(main) {
  if (!main.collection || !main.collection.count || main.collection.count < 2) {
    return null;
  }
  const correct = main.collection.count;
  const candidates = [correct - 1, correct + 1, correct + 2, correct - 2, correct + 3].filter(
    (value) => value >= 2 && value !== correct
  );
  const options = uniqueSample(candidates, 3, [correct]);
  if (options.length < 3) return null;
  return makeQuestionObject(
    `How many films are in the ${main.collection.name}?`,
    String(correct),
    options.map(String),
    false
  );
}

function makeFranchiseNameQuestion(main, label) {
  if (!main.collection) return null;
  const options = uniqueSample(FRANCHISE_NAMES, 3, [main.collection.name]);
  if (options.length < 3) return null;
  return makeQuestionObject(
    `Which film franchise does this ${label} belong to?`,
    main.collection.name,
    options,
    false
  );
}

function makeOriginalLanguageQuestion(main, distractors, label) {
  const correct = languageName(main.originalLanguage);
  if (!correct) return null;
  const options = uniqueSample(
    distractors.map((item) => languageName(item.originalLanguage)).filter(Boolean),
    3,
    [correct]
  );
  if (options.length < 3) return null;
  return makeQuestionObject(
    `What language was this ${label} originally made in?`,
    correct,
    options,
    false
  );
}

function makeOriginalTitleQuestion(main, distractors, label) {
  if (!main.originalTitle) return null;
  const options = uniqueSample(
    distractors.map((item) => item.title).filter(Boolean),
    3,
    [main.originalTitle, main.title]
  );
  if (options.length < 3) return null;
  return makeQuestionObject(
    `This ${label} was released in English as "${main.title}". What was its original title?`,
    main.originalTitle,
    options,
    false
  );
}

function makeCountryQuestion(main, label) {
  if (!main.productionCountries || main.productionCountries.length === 0) return null;
  const correct = main.productionCountries[0];
  const options = uniqueSample(DISTRACTOR_COUNTRIES, 3, main.productionCountries);
  if (options.length < 3) return null;
  return makeQuestionObject(
    `Which country was this ${label} produced in?`,
    correct,
    options,
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
    type === "tv" ? makeSeasonsQuestion(main, distractors) : null,
    makeRuntimeQuestion(main, distractors, type, label),
    makeKeywordQuestion(main, distractors, label),
    makeCollectionCountQuestion(main),
    makeFranchiseNameQuestion(main, label),
    makeOriginalLanguageQuestion(main, distractors, label),
    makeOriginalTitleQuestion(main, distractors, label),
    makeCountryQuestion(main, label),
  ].filter(Boolean);

  return shuffle(candidates).slice(0, MAX_QUESTIONS);
}
