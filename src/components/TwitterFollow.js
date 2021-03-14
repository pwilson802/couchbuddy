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
      justifyContent: "space-around",
      alignItems: "center",
      borderBottomStyle: "solid",
      borderWidth: 1,
      borderColor: "#96D0D3",
      margin: "1rem 0",
      padding: "1rem",
      cursor: "pointer",
      textDecoration: "none",
      "@media(min-width: 768px)": {
        borderTopStyle: "solid",
      },
    }),
    text: css({
      color: colors[mode]["text"],
      marginRight: "0.5rem",
    }),
    link: css({
      textDecoration: "none",
    }),
  };
  return (
    <a css={styles.link} href="https://twitter.com/couch_buddy" target="_blank">
      <div css={styles.wrapper}>
        <p css={styles.text}>
          Follow us for new articles and cool movie suggestions
        </p>
        <div>
          <TwitterIcon size={28} />
        </div>
      </div>
    </a>
  );
}

export default TwitterFollow;
