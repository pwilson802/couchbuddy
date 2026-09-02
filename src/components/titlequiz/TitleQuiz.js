/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import RandomQuizButton from "../randomquiz/RandomQuizButton";
import RandomQuizSpinner from "../randomquiz/RandomQuizSpinner";
import TitleQuizQuestion from "./TitleQuizQuestion";
import TitleQuizEnd from "./TitleQuizEnd";
import { makeTitleQuestions } from "./makeTitleQuestions";

const colors = {
  light: { text: "black", heading: "black" },
  dark: { text: "white", heading: "rgba(150,208,211,1)" },
};

// Data is fetched once, lazily, only when the viewer actually starts the
// quiz (see loadAndStart) - avoids costing every detail-page visitor a
// handful of extra TMDB calls (keywords/translations/images/recommendation
// details) for a feature most won't click into. "Play Again" reshuffles
// from that same fetched payload instead of re-fetching.
function TitleQuiz({ type, id, title, href, mode }) {
  const [stage, setStage] = useState("intro");
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [score, setScore] = useState(0);

  async function loadAndStart() {
    setStage("loading");
    let data = quizData;
    try {
      if (!data) {
        const response = await fetch(`/api/titlequiz/${id}?view=${type}`);
        data = await response.json();
        setQuizData(data);
      }
      const built = makeTitleQuestions(data.main, data.distractors, type);
      setQuestions(built);
      setActiveQuestion(0);
      setScore(0);
      setStage(built.length > 0 ? "playing" : "error");
    } catch {
      setStage("error");
    }
  }

  function replay() {
    const built = makeTitleQuestions(quizData.main, quizData.distractors, type);
    setQuestions(built);
    setActiveQuestion(0);
    setScore(0);
    setStage(built.length > 0 ? "playing" : "error");
  }

  function handleQuestion(correct) {
    if (correct) setScore((current) => current + 1);
    if (activeQuestion + 1 >= questions.length) {
      setStage("end");
    } else {
      setActiveQuestion((current) => current + 1);
    }
  }

  const styles = {
    wrapper: css({
      position: "relative",
      borderRadius: 16,
      backgroundColor:
        mode === "light" ? "rgba(150,208,211,0.3)" : "rgba(150,208,211,0.08)",
      padding: "24px 16px",
      minHeight: 220,
    }),
    heading: css({
      textAlign: "center",
      margin: "0 0 8px 0",
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: 20,
      color: colors[mode]["heading"],
    }),
    intro: css({
      textAlign: "center",
      color: colors[mode]["text"],
      marginBottom: 16,
    }),
    numbers: css({
      color: colors[mode]["text"],
      opacity: 0.7,
      textAlign: "center",
      marginBottom: 8,
      fontSize: 13,
    }),
    errorText: css({
      color: colors[mode]["text"],
      textAlign: "center",
    }),
  };

  return (
    <div css={styles.wrapper}>
      <h2 css={styles.heading}>Test Your Knowledge</h2>
      {stage === "intro" && (
        <div data-testid="quiz-start">
          <p css={styles.intro}>How well do you really know {title}?</p>
          <RandomQuizButton mode={mode} setupQuiz={loadAndStart} />
        </div>
      )}
      {stage === "loading" && <RandomQuizSpinner mode={mode} />}
      {stage === "playing" && questions[activeQuestion] && (
        <div>
          <div css={styles.numbers}>
            {activeQuestion + 1} / {questions.length}
          </div>
          <TitleQuizQuestion
            questionDetails={questions[activeQuestion]}
            handleQuestion={handleQuestion}
            mode={mode}
          />
        </div>
      )}
      {stage === "end" && (
        <TitleQuizEnd
          score={score}
          total={questions.length}
          title={title}
          href={href}
          resetQuiz={replay}
          mode={mode}
        />
      )}
      {stage === "error" && (
        <p css={styles.errorText}>
          Not enough info on {title} yet for a quiz - check back later!
        </p>
      )}
    </div>
  );
}

export default TitleQuiz;
