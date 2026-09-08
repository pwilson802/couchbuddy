const MAX_QUESTIONS = 10;

function shuffle(data) {
  const arr = [...data];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Pre-made questions come from a hand/LLM-authored JSON file (see
// couchbuddy-data-upload) - just reshuffle question order and each
// question's own answer order (stored files always list the correct answer
// first, for readability while authoring) and cap at MAX_QUESTIONS.
export function preparePremadeQuestions(rawQuestions) {
  if (!rawQuestions || rawQuestions.length === 0) return [];
  return shuffle(rawQuestions)
    .slice(0, MAX_QUESTIONS)
    .map((q) => ({
      question: q.question,
      answers: shuffle(q.answers),
    }));
}
