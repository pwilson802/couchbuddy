/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";

// Mirrors randomquiz/QuizAnswer.js's selected/locked/finished states, but
// renders an image tile instead of a text row - used for the backdrop
// question, where the answer choices are images, not movie titles (see
// makeBackdropQuestion in makeTitleQuestions.js for why).
function TitleQuizImageAnswer({ answer, handleAnswered, finished, locked }) {
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setAnswered(false);
  }, [answer]);

  function handleClick() {
    setAnswered(!answered);
    handleAnswered(answered, answer.correct, answer.answer);
  }

  const styles = {
    wrapper: css({
      position: "relative",
      borderRadius: 10,
      overflow: "hidden",
      cursor: "pointer",
      border: "3px solid transparent",
    }),
    selected: css({
      borderColor: "rgba(225, 44, 134, 0.8)",
    }),
    correct: css({
      borderColor: "#39B54A",
    }),
    incorrect: css({
      borderColor: "#A01701",
      opacity: 0.55,
    }),
    image: css({
      width: "100%",
      aspectRatio: "16 / 9",
      objectFit: "cover",
      display: "block",
    }),
  };

  let stateStyle = null;
  if (finished) {
    stateStyle = answer.correct ? styles.correct : styles.incorrect;
  } else if (answered) {
    stateStyle = styles.selected;
  }

  return (
    <div
      css={[styles.wrapper, stateStyle]}
      onClick={locked ? () => {} : handleClick}
    >
      <img css={styles.image} src={answer.answer} alt="quiz option" />
    </div>
  );
}

export default TitleQuizImageAnswer;
