/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { TwitterIcon } from "react-share";

const colors = {
  light: {
    text: "#96D0D3",
  },
  dark: {
    text: "white",
  },
};

function TwitterFollow({ mode }) {
  const styles = {
    wrapper: css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderTopStyle: "solid",
      borderWidth: 1,
      borderColor: "#F1888F",
      marginTop: "1rem",
    }),
    text: css({
      color: colors[mode]["text"],
      marginRight: "1rem",
    }),
  };
  return (
    <div css={styles.wrapper}>
      <p css={styles.text}>
        Follow us for new articles and cool movie suggestions
      </p>
      <div>
        <TwitterIcon size={28} />
      </div>
    </div>
  );
}

export default TwitterFollow;
