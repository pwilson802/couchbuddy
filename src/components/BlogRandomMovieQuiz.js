/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import Quiz from "./randomquiz/Quiz";
import BlogPreviewScroll from "./BlogPreviewScroll";
import Footer from "./Footer";

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
  handleLocation,
}) {
  const [endPage, setEndPage] = useState(false);
  const styles = {
    text: css({
      color: colors[mode]["heading"],
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
      minHeight: "500px",
    }),
    logo: css({
      width: "25%",
      position: "absolute",
      top: "5px",
      right: "10px",
    }),
    moreWrapper: css({
      marginTop: "2rem",
    }),
  };

  return (
    <div css={styles.background}>
      <img
        css={styles.logo}
        src={"/CouchBuddyLogo.png"}
        alt="CouchBuddy Logo"
      />
      <Quiz
        heading={heading}
        introduction={introduction}
        mode={mode}
        setEndPage={setEndPage}
        slug={slug}
      />
      {endPage && (
        <div css={styles.moreWrapper}>
          <h5 css={styles.text}>More from Couch Buddy...</h5>
          <BlogPreviewScroll mode={mode} previews={previews} />
          <footer>
            <Footer
              activePage="blog"
              mode={mode}
              location={location}
              handleLocation={handleLocation}
            />
          </footer>
        </div>
      )}
    </div>
  );
}

export default BlogRandomMovieQuiz;
