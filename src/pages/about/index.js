/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Logo from "../../components/Logo";
import LightModes from "../../components/LightModes";
import Image from "next/image";

function changeBackground(mode) {
  if (mode === "dark") {
    document.body.style = "background: #15202A";
  } else {
    document.body.style = "background: white";
  }
}

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function About() {
  const [mode, setMode] = useState("dark");

  const changeMode = (mode) => {
    localStorage.setItem("mode", mode);
    changeBackground(mode);
    setMode(mode);
  };

  useEffect(() => {
    const currentMode = localStorage.getItem("mode") || "dark";
    changeMode(currentMode);
  }, []);

  const styles = {
    text: css({
      color: colors[mode]["text"],
      fontSize: 14,
    }),
    nav: css({
      display: "flex",
      margin: 10,
      flexDirection: "row",
      justifyContent: "space-evenly",
    }),
    aboutWrapper: css({
      margin: "0 5%",
      display: "flex",
      alignItems: "flex-start",
      flexDirection: "column",
      "@media(min-width: 778px)": {
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
    logoWrap: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    }),
  };
  return (
    <div>
      <div css={styles.aboutWrapper}>
        <div css={styles.logoWrap}>
          <Logo logo={"main"} width={250} />
        </div>
        <p css={styles.text}>
          Adding a test field to test out the dev pushing to vercel
        </p>
        <p css={styles.text}>
          CouchBuddy was created to help you choose a movie to watch when you
          don’t know what to watch. Filter by the streaming providers you have,
          what you’re interested in and how much time you’ve got then let
          CouchBuddy do the searching..
        </p>
        <div css={styles.logoWrap}>
          <Logo logo={"blog"} width={250} />
        </div>
        <p css={styles.text}>
          CouchBuddy blog was created to help you choose a movie if your feeling
          in a particular mode, or for some light reading on a cool winters day.
        </p>
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
            <img
              src="/tmd-block.svg"
              alt="The Movie Database Logo"
              width={70}
              height={70}
            />
          </a>
        </div>
        <p css={styles.text}>
          Streaming provider data is sourced from JustWatch, check them out to
          find where to watch your favourite movies and shows
        </p>
        <a
          href="http://justwatch.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/justwatch.png"
            alt="Just Watch"
            width={152}
            height={23}
          />
        </a>
        <p css={styles.text}>
          Some on the animations on tihs site are sources from Lottie, check
          them out for cool animations:
        </p>
        <a
          href="https://lottiefiles.com/47047-dark-mode-button"
          target="_blank"
        >
          Animation by Mohammad Turk on LottieFiles
        </a>
      </div>
    </div>
  );
}

export default About;
