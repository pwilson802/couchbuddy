/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
// import Lottie from "react-lottie";
import Lottie from "lottie-react";
import animationData from "../assets/spinnermovie-dark.json";

function SpinnerMovie() {
  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData.default,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };
  const styles = {
    wrapper: css({
      width: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }),
  };
  return (
    <div css={styles.wrapper}>
      <Lottie animationData={animationData} />
    </div>
  );
}

export default SpinnerMovie;
