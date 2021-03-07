/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import animationFile from "../assets/moviecard-loading.json";

const colors = {
  light: {
    opacitiy: 1,
  },
  dark: {
    opacity: 0.6,
  },
};

function MovieCardLoading({ mode }) {
  const styles = {
    wrapper: css({
      opacity: colors[mode]["opacity"],
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "185px",
    }),
  };

  return (
    <div css={styles.wrapper}>
      <Lottie
        animationData={animationFile}
        autoplay={true}
        loop={true}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "200px",
          flexDirection: "column",
        }}
      />
    </div>
  );
}

export default MovieCardLoading;
