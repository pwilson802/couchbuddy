/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import CouchBuddyAd from "./CouchBuddyAd";
import CouchBuddyAd2 from "./CouchBuddyAd2";
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
      <CouchBuddyAd2 mode={mode} />
      <FakeAd num={1} />
      <TwitterFollow mode={mode} />
    </div>
  );
}

export default BlogSideBar;
