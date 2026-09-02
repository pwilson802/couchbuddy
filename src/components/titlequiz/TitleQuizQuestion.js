/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import QuizAnswer from "../randomquiz/QuizAnswer";
import TitleQuizImageAnswer from "./TitleQuizImageAnswer";

const colors = {
  light: { text: "black" },
  dark: { text: "white" },
};

// Reveal-then-advance timing matches the existing randomquiz engine
// (QuestionSingleAnswer.js) - answers lock immediately, correct/incorrect
// reveals after a beat, then the question advances.
function TitleQuizQuestion({ questionDetails, handleQuestion, mode }) {
  const [isFinished, setIsFinished] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const styles = {
    question: css({
      color: colors[mode]["text"],
      textAlign: "center",
      fontSize: "1.15rem",
      marginTop: "1rem",
      marginBottom: "1.5rem",
    }),
    imageWrapper: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1rem",
    }),
    image: css({
      borderRadius: 10,
      maxWidth: "100%",
      maxHeight: 260,
    }),
    imageGrid: css({
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 10,
    }),
  };

  const handleAnswered = (isAnswered, correct, answer) => {
    if (isAnswered) return;
    setIsLocked(true);
    setTimeout(() => {
      setIsFinished(true);
      setTimeout(() => {
        handleQuestion(correct, [answer]);
        setIsFinished(false);
        setIsLocked(false);
      }, 1800);
    }, 700);
  };

  return (
    <div>
      {questionDetails.imageUrl && (
        <div css={styles.imageWrapper}>
          <img css={styles.image} src={questionDetails.imageUrl} alt="quiz hint" />
        </div>
      )}
      <div css={styles.question}>{questionDetails.question}</div>
      {questionDetails.isImageChoice ? (
        <div css={styles.imageGrid}>
          {questionDetails.answers.map((item, index) => (
            <div key={index} data-testid="quiz-answer">
              <TitleQuizImageAnswer
                answer={item}
                handleAnswered={handleAnswered}
                finished={isFinished}
                locked={isLocked}
              />
            </div>
          ))}
        </div>
      ) : (
        questionDetails.answers.map((item, index) => (
          <div key={index} data-testid="quiz-answer">
            <QuizAnswer
              answer={item}
              handleAnswered={handleAnswered}
              finished={isFinished}
              locked={isLocked}
              mode={mode}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default TitleQuizQuestion;
