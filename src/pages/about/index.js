/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Logo from "../../components/Logo";
import Image from "next/image";
import Footer from "../../components/Footer";

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
    text: "rgba(255,255,255,0.8)",
  },
};

function About({ setConsent }) {
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

  const resetConsent = () => {
    setConsent("new");
    localStorage.clear();
  };

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
    policies: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: colors[mode]["text"],
      marginTop: "4rem",
      width: "100%",
    }),
    policy: css({
      margin: "0 50px",
      fontSize: "0.8rem",
      textDecoration: "none",
    }),
    policyLink: css({
      textDecoration: "none",
      color: colors[mode]["text"],
    }),
    clearButton: css({
      background: "#E12C86",
      border: "0",
      color: "f5f6fa",
      padding: "8px 24px",
      fontSize: "14px",
      borderRadius: "8px",
      cursor: "pointer",
      textAlign: "center",
      outline: "none",
    }),
  };
  return (
    <>
      <Head>
        <title>Couch Buddy / About</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Find a movie to watch when you don’t know what to watch. Filter by streaming providers, genre, age classification and duration, then let us do the searching"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="Not sure what to watch? CouchBuddy's got you sorted"
        />
        <meta name="twitter:title" content="CouchBuddy" />
        <meta name="twitter:site" content="@couch_buddy" />
        <meta
          name="twitter:image"
          content="https://couchbuddy-images.s3.amazonaws.com/twitter-card-main.png"
        />
        <meta property="og:title" content="CouchBuddy" />
        <meta
          property="og:description"
          content="Not sure what to watch? CouchBuddy's got you sorted"
        />
        <meta
          property="og:image"
          content="https://couchbuddy-images.s3.amazonaws.com/twitter-card-main.png"
        />
      </Head>
      <main css={styles.aboutWrapper}>
        <div css={styles.logoWrap}>
          <Logo logo={"main"} width={250} />
        </div>
        <p css={styles.text}>
          CouchBuddy was created to help you choose a movie to watch when you
          don’t know what to watch. Filter by the streaming providers you have,
          what you’re interested in and how much time you’ve got, then let
          CouchBuddy do the searching.
        </p>
        <div css={styles.logoWrap}>
          <Logo logo={"blog"} width={250} />
        </div>
        <p css={styles.text}>
          CouchBuddy blog exists to help you choose a movie based on a
          particular mood or hankering (and as an excuse for us to write silly
          things about movies we watch).
        </p>
        <p css={styles.text}>
          CouchBuddy does not contain an exhaustive list of every movie on all
          streaming providers, just the good ones, so you can jump off the
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
          <a
            css={styles.mailLink}
            href="https://twitter.com/couch_buddy"
            target="_blank"
          >
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
        <br />
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
        <br />
        <p css={styles.text}>
          Some on the animations on this site are sourced from Lottie, check
          them out for cool animations:
        </p>
        <a
          css={styles.mailLink}
          href="https://lottiefiles.com/47047-dark-mode-button"
          target="_blank"
        >
          Animation by Mohammad Turk on LottieFiles
        </a>
        <a
          css={styles.mailLink}
          href="https://lottiefiles.com/25321-plus-to-minus"
          target="_blank"
        >
          Animation by Naokure on LottieFiles
        </a>
        <a
          css={styles.mailLink}
          href="https://lottiefiles.com/21496-basic-dropdown"
          target="_blank"
        >
          Animation by Heymarcoh on LottieFiles
        </a>
        <p css={styles.text}>
          To clear any saved preferences made on this website saved on your
          device, click the below button. You will be prompted for consent again
          after this.
        </p>
        <button css={styles.clearButton} onClick={resetConsent}>
          Clear
        </button>
        <div css={styles.policies}>
          <a
            css={styles.policyLink}
            href="/about/privacy-policy"
            target="_blank"
          >
            <div css={styles.policy}>PRIVACY POLICY</div>
          </a>
          <a
            css={styles.policyLink}
            href="/about/cookie-policy"
            target="_blank"
          >
            <div css={styles.policy}>COOKIE POLICY</div>
          </a>
        </div>
      </main>
      <footer>
        <Footer activePage="about" mode={mode} />
      </footer>
    </>
  );
}

export default About;
