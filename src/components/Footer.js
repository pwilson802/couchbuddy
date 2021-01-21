/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Link from "next/link";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function Footer({ setPage, mode }) {
  const styles = {
    footerWrap: css({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 50,
    }),
    about: css({
      display: "inline",
      color: colors[mode]["text"],
      cursor: "pointer",
    }),
    blogLink: css({
      display: "inline",
      color: colors[mode]["text"],
      cursor: "pointer",
      marginLeft: "30px",
    }),
  };
  return (
    <div css={styles.footerWrap}>
      <div css={styles.about} onClick={() => setPage("about")}>
        About & Settings
      </div>
      <Link href={"/blog"}>
        <div css={styles.blogLink}>Blog</div>
      </Link>
    </div>
  );
}

export default Footer;
