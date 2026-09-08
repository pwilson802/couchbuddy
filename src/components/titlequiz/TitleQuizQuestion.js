/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/react";
import React, { useState } from "react";
import QuizAnswer from "../randomquiz/QuizAnswer";
import ConfettiBurst from "./ConfettiBurst";

const colors = {
  light: { text: "black" },
  dark: { text: "white" },
};

const CELEBRATIONS = ["Nice!", "Correct!", "You got it!", "Boom!", "Nailed it!"];

const popIn = keyframes`
  0% { transform: scale(0.3); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

// Reveal-then-advance timing matches the existing randomquiz engine
// (QuestionSingleAnswer.js) - answers lock immediately, correct/incorrect
// reveals after a beat, then the question advances.
function TitleQuizQuestion({ questionDetails, handleQuestion, mode }) {
  const [isFinished, setIsFinished] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [celebration, setCelebration] = useState(null);

  const correctAnswer = questionDetails.answers.find((a) => a.correct);

  const styles = {
    question: css({
      color: colors[mode]["text"],
      textAlign: "center",
      fontSize: "1.15rem",
      marginTop: "1rem",
      marginBottom: "1.5rem",
    }),
    // Reserved while a question is finished (both right and wrong reveals)
    // so the celebration/answer banner popping in never shifts the
    // question text - only its own contents change.
    celebrationSlot: css({
      position: "relative",
      minHeight: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "0 8px",
      pointerEvents: "none",
    }),
    celebrationText: css({
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: "1.4rem",
      color: "rgba(150,208,211,1)",
      textShadow: "0 2px 8px rgba(0,0,0,0.25)",
      animation: `${popIn} 500ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
    }),
    correctAnswerBanner: css({
      fontFamily: "Kanit",
      fontWeight: "bold",
      fontSize: "1rem",
      color: "rgba(150,208,211,1)",
      textShadow: "0 1px 4px rgba(0,0,0,0.2)",
    }),
  };

  const handleAnswered = (isAnswered, correct, answer) => {
    if (isAnswered) return;
    setIsLocked(true);
    setTimeout(() => {
      setIsFinished(true);
      setWasCorrect(correct);
      if (correct) {
        setCelebration(
          CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)]
        );
      }
      // Wrong answers stay revealed longer - enough time to actually read
      // which answer was correct, not just flash past it.
      setTimeout(() => {
        handleQuestion(correct, [answer]);
        setIsFinished(false);
        setWasCorrect(false);
        setIsLocked(false);
        setCelebration(null);
      }, correct ? 1800 : 3200);
    }, 700);
  };

  return (
    <div>
      {isFinished && (
        <div css={styles.celebrationSlot}>
          {wasCorrect ? (
            <React.Fragment>
              <ConfettiBurst key={celebration + questionDetails.question} />
              <span css={styles.celebrationText}>{celebration} 🎉</span>
            </React.Fragment>
          ) : (
            <span css={styles.correctAnswerBanner}>
              ✅ Correct answer: {correctAnswer?.answer}
            </span>
          )}
        </div>
      )}
      <div css={styles.question}>{questionDetails.question}</div>
      {questionDetails.answers.map((item, index) => (
        <div key={index} data-testid="quiz-answer">
          <QuizAnswer
            answer={item}
            handleAnswered={handleAnswered}
            finished={isFinished}
            locked={isLocked}
            mode={mode}
          />
        </div>
      ))}
    </div>
  );
}

export default TitleQuizQuestion;
