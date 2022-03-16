/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/spinnerrandomquizretake.json";

const colors = {
  light: {
    opacitiy: 1,
  },
  dark: {
    opacity: 0.6,
  },
};

function RandomQuizSpinner({ view, mode }) {
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
      width: "70%",
    }),
  };
  return (
      <div css={styles.wrapper}>
          <div css={styles.lottieWrapper}>
              <Lottie
              animationData={animationData}
      />
       
          
          </div>
    </div>
  );
}

export default RandomQuizSpinner;
