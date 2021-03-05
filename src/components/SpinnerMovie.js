/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/spinnermovie-dark.json";

function SpinnerMovie() {
  const styles = {
    wrapper: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }),
  };
  return (
    <div css={styles.wrapper}>
      <Lottie
        animationData={animationData}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "350px",
          flexDirection: "column",
        }}
      />
    </div>
  );
}

export default SpinnerMovie;
