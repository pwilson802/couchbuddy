/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import DropDownButton from "./DropDownButton";

const colors = {
  light: {
    text: "black",
    border: "rgba(150,208,211,1)",
    background: "rgba(150,208,211,0.4)",
    answerBackground: "rgba(150,208,211,0.5)",
    notAnswered: "rgba(150,208,211,0.4)",
    correct: "green",
    incorrect: "red",
  },
  dark: {
    text: "white",
    border: "rgba(150,208,211,0.3)",
    background: "rgba(150,208,211,0.1)",
    answerBackground: "rgba(150,208,211,0.2)",
    notAnswered: "rgba(150,208,211,0.1)",
    correct: "green",
    incorrect: "red",
  },
};

function BlogQuizQuestion({
  question,
  answer,
  questionNumber,
  score,
  setScore,
  mode,
}) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState("notAnswered");
  console.log("question", question);
  const styles = {
    wrapper: css({
      margin: "40px 0",
    }),
    scoreButtons: css({
      display: "flex",
    }),
    number: css({
      fontSize: "1rem",
      color: colors[mode]["text"],
      borderColor: colors[mode]["border"],
      borderStyle: "solid",
      borderWidth: 2,
      borderBottom: "none",
      display: "inline-block",
      padding: "3px 8px",
      borderRadius: "40% 40% 0 0",
      background: colors[mode][correct],
    }),
    questionBlock: css({
      color: colors[mode]["text"],
      borderColor: colors[mode]["border"],
      borderStyle: "solid",
      borderWidth: 2,
      padding: "10px 10px",
      borderRadius: "0 5px 0px 0px",
      background: colors[mode]["background"],
    }),
    showAnswerWrapper: css({
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    }),
    showAnswer: css({
      display: "flex",
      cursor: "pointer",
      alignItems: "center",
      color: colors[mode]["text"],
    }),
    answerWrapper: css({
      borderColor: colors[mode]["border"],
      borderStyle: "solid",
      borderWidth: 2,
      padding: "10px 10px",
      borderRadius: "0 0 5px 5px",
      borderTop: "none",
      background: colors[mode]["answerBackground"],
      color: colors[mode]["text"],
    }),
    scoreButtons: css({
      display: "flex",
      justifyContent: "center",
    }),
  };

  const updateScore = (correct) => {
    if (answered == true) {
      return;
    }
    if (correct == true) {
      setScore(score + 1);
      setCorrect("correct");
    } else {
      setCorrect("incorrect");
    }
    setAnswered(true);
  };
  return (
    <div css={styles.wrapper}>
      <div css={styles.number}>{questionNumber + 1}</div>
      <div css={styles.questionBlock}>
        <div>{question}</div>
        <div css={styles.showAnswerWrapper}>
          <div
            css={styles.showAnswer}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <span>{showAnswer ? "Hide Answer" : "Show Answer"}</span>
            <DropDownButton show={showAnswer} mode={mode} menu={"genres"} />
          </div>
        </div>
      </div>
      {showAnswer && (
        <div css={styles.answerWrapper}>
          <div>{answer}</div>
          <div css={styles.scoreButtons}>
            <button onClick={() => updateScore(true)}>Correct</button>
            <button onClick={() => updateScore(false)}>Incorrect</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogQuizQuestion;
