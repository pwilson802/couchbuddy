/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Lottie from "lottie-react";
import animationFile from "../../assets/blogquizrightanswer.json";

const colors = {
  light: {
    opacitiy: 1,
  },
  dark: {
    opacity: 1,
  },
};

function QuizRightAnswerAnimation({ mode }) {
  const styles = {
    wrapper: css({
      opacity: colors[mode]["opacity"],
      height: "2rem",
      display: "flex",
      margin: 0,
      padding: 0,
      alignItems: "center",
      justifyContent: "center"
    }),
  };

  return (
    <div css={styles.wrapper}>
      <Lottie
        animationData={animationFile}
              autoplay={true}
        loop={false}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80px",
          flexDirection: "column",
        }}
      />
    </div>
  );
}

export default QuizRightAnswerAnimation;
