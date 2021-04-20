/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
import Link from "next/link";
import LocationSelectSmall from "./LocationSelectSmall";

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

function Footer({ activePage, mode, setPage, location, handleLocation }) {
  const styles = {
    footerWrap: css({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      marginRight: "10px",
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
      margin: "0 0",
      fontSize: "0.8rem",
      color: colors[mode]["text"],
    }),
    seperator: css({
      // textDecoration: "none",
      // cursor: "pointer",
      // display: "inline",
      margin: "0 20px",
      fontSize: "0.8rem",
      color: colors[mode]["text"],
    }),
    textSelected: css({
      textDecoration: "none",
      cursor: "pointer",
      display: "inline",
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
    locationWrapper: css({
      textAlign: "center",
      "@media(min-width: 700px)": {
        display: "none",
      },
    }),
    wrapper: css({
      margin: "20px 0",
    }),
  };
  return (
    <div css={styles.wrapper}>
      <div css={styles.locationWrapper}>
        <LocationSelectSmall
          mode={mode}
          location={location}
          handleLocation={handleLocation}
        />
      </div>
      <div css={styles.footerWrap}>
        {activePage == "app" ? (
          <div css={styles.text}>
            <span
              onClick={() => setPage("SearchPage")}
              css={activePage === "app" ? styles.linkSelected : styles.link}
            >
              SEARCH
            </span>
          </div>
        ) : (
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
        )}
        <p css={styles.seperator}>|</p>
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
        <p css={styles.seperator}>|</p>
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
