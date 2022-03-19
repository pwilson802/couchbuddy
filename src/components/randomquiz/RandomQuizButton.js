/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
// import animation from "../assets/24-toggle-switch.json";
import animation from "../../assets/spinnerrandomquiz.json";
import React, { useState, useRef, useEffect } from "react";

const colors = {
  light: {
    opacitiy: 1,
  },
  dark: {
    opacity: 0.6,
  },
};

function RandomQuizButton({ mode, setupQuiz }) {
  const player = useRef();
  const styles = {
    wrapper: css({
      display: "flex",
      color: colors[mode]["text"],
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      width: "100%",
    }),
    lottieWrapper: css({
      "@media(min-width: 768px)": {
        width: "30%",
      },
      opacity: colors[mode]["opacity"],
      width: "40%",
    }),
  };

  const handleClick = () => {
    player.current.setSpeed(1);
    // player.current.setDirection(enabled ? -1 : 1);
    player.current.play();
    setupQuiz()
  };

  return (
      <div css={styles.wrapper} onClick={handleClick}>
        <div css={styles.lottieWrapper}>
          <Lottie
            animationData={animation}
            autoplay={false}
            loop={true}
            lottieRef={player}
          />
        </div>
      </div>

  );
}

export default RandomQuizButton