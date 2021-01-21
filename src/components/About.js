/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React from "react";
// import tmdLogo from "../assets/tmd-block.svg";
import Logo from "./Logo";
import LightModes from "./LightModes";
import Image from "next/image";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function About({ setPage, mode, changeMode }) {
  const styles = {
    text: css({
      color: colors[mode]["text"],
      fontSize: 14,
    }),
    nav: css({
      display: "flex",
      margin: 10,
      flexDirection: "row",
      "@media(min-width: 700px)": {
        justifyContent: "center",
      },
    }),
    aboutWrapper: css({
      margin: "0 10%",
      "@media(min-width: 700px)": {
        margin: "0 20%",
      },
    }),
    tmdImage: css({
      width: "70px",
      marginTop: 0,
    }),
    mailLink: css({
      color: "#E12C86",
    }),
  };
  return (
    <div>
      <div css={styles.nav}>
        <Logo setPage={setPage} />
      </div>
      <div css={styles.aboutWrapper}>
        <p css={styles.text}>
          CouchBuddy was created to help you choose a movie to watch when you
          don’t know what to watch. Filter by the streaming providers you have,
          what you’re interested in and how much time you’ve got then let
          CouchBuddy do the searching.
        </p>
        <p css={styles.text}>
          All data and images on this website are sourced from The Movie
          Database. This product uses the TMDb API but is not endorsed or
          certified by TMDb.
        </p>
        <div css={styles.tmdImage}>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/tmd-block.svg"
              alt="The Movie Database Logo"
              width={70}
              height={70}
            />
            {/* <img src={tmdLogo} alt="The Movie Database" /> */}
          </a>
        </div>
        <p css={styles.text}>
          CouchBuddy does not contain an exhaustive list of every movie on all
          streaming providers, just the good ones so you can jump off the
          endless scroll and watch a damn movie.
          <br />
          <br />
          CouchBuddy’s got your back.
          <br />
          <br /> Send any inquiries or comments to{" "}
          <a css={styles.mailLink} href="mailto:info@couchbuddy.info">
            info@couchbuddy.info
          </a>{" "}
          or via{" "}
          <a css={styles.mailLink} href="https://twitter.com/couch_buddy">
            twitter
          </a>
        </p>
        <LightModes mode={mode} changeMode={changeMode} />
      </div>
    </div>
  );
}

export default About;
