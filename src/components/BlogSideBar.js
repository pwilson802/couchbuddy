/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import CouchBuddyAd from "./CouchBuddyAd";
import TwitterFollow from "./TwitterFollow";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function BlogSideBar({ mode }) {
  const styles = {
    wrapper: css({
      //   borderStyle: "solid",
      //   borderWidth: 1,
      //   padding: "1rem",
      //   backgroundColor: "#FEF4E1",
      //   borderColor: "#FEF4E1",
    }),
  };
  return (
    <div css={styles.wrapper}>
      <CouchBuddyAd mode={mode} />
      <TwitterFollow mode={mode} />
    </div>
  );
}

export default BlogSideBar;
