/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Link from "next/link";

const colors = {
  light: {
    text: "black",
    selected: "#E12C86",
  },
  dark: {
    text: "rgba(255,255,255, 0.8)",
    selected: "#E12C86",
  },
};

function Footer({ activePage, mode }) {
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
    text: css({
      textDecoration: "none",
      cursor: "pointer",
      display: "inline",
      margin: "0 15px 15px 20px",
      fontSize: "0.8rem",
      color: colors[mode]["text"],
    }),
    textSelected: css({
      textDecoration: "none",
      cursor: "pointer",
      display: "inline",
      margin: "0 15px 15px 20px",
      fontSize: "0.8rem",
    }),
    link: css({
      textDecoration: "none",
      margin: 0,
      padding: 0,
      display: "block",
      color: colors[mode]["text"],
    }),
    linkSelected: css({
      textDecoration: "none",
      margin: 0,
      padding: 0,
      display: "block",
      color: colors[mode]["selected"],
    }),
  };
  return (
    <div>
      <div css={styles.footerWrap}>
        <Link href={"/"}>
          <div css={styles.text}>
            <a
              href={"/"}
              css={activePage === "app" ? styles.linkSelected : styles.link}
            >
              SEARCH
            </a>
          </div>
        </Link>
        <p css={styles.text}>|</p>
        <Link href={"/blog"}>
          <div css={styles.text}>
            <a
              href={"/blog"}
              css={activePage === "blog" ? styles.linkSelected : styles.link}
            >
              BLOG
            </a>
          </div>
        </Link>
        <p css={styles.text}>|</p>
        <Link href={"/about"}>
          <div css={styles.text}>
            <a
              href={"/about"}
              css={activePage === "about" ? styles.linkSelected : styles.link}
            >
              ABOUT
            </a>
          </div>
        </Link>
      </div>
      <div css={styles.locationWrapper}></div>
    </div>
  );
}

export default Footer;
