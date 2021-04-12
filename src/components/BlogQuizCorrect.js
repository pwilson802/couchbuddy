/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import animation from "../assets/quiz-correct.json";
import React, { useState, useRef } from "react";

const opacity = {
  notAnswered: "1",
  correct: "1",
  incorrect: "0.3",
};

function BlogQuizCorrect({ updateScore, answered, correct }) {
  const player = useRef();
  const activeSegments =
    answered && correct == "correct" ? [121, 121] : [66, 121];
  const styles = {
    wrapper: css({
      width: "50px",
      cursor: "pointer",
      opacity: opacity[correct],
    }),
  };

  const handleClick = () => {
    if (answered == true) {
      return;
    }
    player.current.setSpeed(1);
    player.current.setDirection(1);
    player.current.play();
    setTimeout(() => {
      updateScore();
    }, 1500);
  };

  return (
    <div css={styles.wrapper} onClick={handleClick}>
      <Lottie
        animationData={animation}
        autoplay={false}
        loop={false}
        initialSegment={activeSegments}
        lottieRef={player}
      />
    </div>
  );
}

export default BlogQuizCorrect;
