/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import animation from "../assets/quiz-correct.json";
import React, { useState, useRef, useEffect } from "react";

const opacity = {
  notAnswered: "1",
  correct: "1",
  incorrect: "0.3",
};

function BlogQuizCorrect({ updateScore, correct }) {
  const [active, setActive] = useState(false);
  const player = useRef();
  const styles = {
    wrapper: css({
      width: "50px",
      cursor: "pointer",
      opacity: opacity[correct],
    }),
  };

  useEffect(() => {
    if (correct === "correct") {
      player.current.setSpeed(1);
      player.current.setDirection(1);
      player.current.play();
      setTimeout(() => setActive(true), 1500);
    }
  }, [correct]);

  return (
    <div css={styles.wrapper} onClick={() => updateScore(true)}>
      <Lottie
        animationData={animation}
        autoplay={false}
        loop={false}
        initialSegment={active ? [121, 121] : [66, 121]}
        lottieRef={player}
      />
    </div>
  );
}

export default BlogQuizCorrect;
