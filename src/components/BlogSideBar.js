/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import CouchBuddyAd from "./CouchBuddyAd";
import TwitterFollow from "./TwitterFollow";
import FakeAd from "./FakeAd";

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
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      height: "100%",
    }),
  };
  return (
    <div css={styles.wrapper}>
      <CouchBuddyAd mode={mode} />
      <TwitterFollow mode={mode} />
      <FakeAd num={1} />
    </div>
  );
}

export default BlogSideBar;
