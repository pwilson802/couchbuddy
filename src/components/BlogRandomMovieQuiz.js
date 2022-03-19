/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import BlogSocials from "./BlogSocials";
import BlogQuizSocials from "./BlogQuizSocials";
import RandomQuizButton from "./randomquiz/RandomQuizButton"
import Quiz from "./randomquiz/Quiz"
import BlogPreviewScroll  from "./BlogPreviewScroll"

const colors = {
  light: {
    text: "black",
    author: "#878787",
    heading: "black",
  },
  dark: {
    text: "white",
    author: "rgba(225,44,134, 0.8)",
    heading: "rgba(150,208,211, 1)",
  },
};

function BlogRandomMovieQuiz({
  heading,
  slug,
  introduction,
  pageDetails,
  mode,
  location,
  previews,
}) {
  const [endPage, setEndPage] = useState(false)
  const styles = {
    text: css({
      color: colors[mode]["heading"],
    }),
    heading: css({
      textAlign: "center",
      margin: 0,
      color: colors[mode]["heading"],
    }),
    socials: css({
      display: "flex",
      justifyContent: "flex-end",
    }),
    introduction: css({
      color: colors[mode]["text"],
    }),
    results: css({
      color: colors[mode]["text"],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }),
    score: css({
      margin: 0,
      padding: 0,
      fontSize: "26px",
      fontFamily: "CorbenBold",
    }),
    rank: css({
      margin: 0,
      padding: 0,
      fontSize: "22px",
      fontFamily: "CorbenRegular",
    }),
    adWrap: css({
      marginTop: "3rem",
      paddingBottom: "40px",
    }),
    // Background needs to change width and height for multiple screen sizes
    background: css({
      backgroundColor: "rgba(150, 208, 211, 0.3)",
      borderRadius: "25px",
      width: "100%",
      height: "80vh",
      padding: "30px",
      position: "relative",
      minHeight: "400px"
    }),
    logo: css({
      width: "25%",
      position: "absolute",
      top: "5px",
      right: "10px"
    })
  };

  return (
    <div css={styles.background}>
      <img css={styles.logo} src={"/CouchBuddyLogo.png"} alt="CouchBuddy Logo" />
      <Quiz heading={heading} introduction={introduction} mode={mode} setEndPage={setEndPage} />
      {/* {!endPage && (
        <div>
          <h5 css={styles.text}>More from Couch Buddy...</h5>
          <BlogPreviewScroll mode={mode} previews={previews} />
        </div>
      )} */}
    </div>
  );
}

export default BlogRandomMovieQuiz;
