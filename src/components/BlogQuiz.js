/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import BlogSocials from "./BlogSocials";
import BlogQuizQuestion from "./BlogQuizQuestion";
import BlogQuizSocials from "./BlogQuizSocials";
import { Adsense } from "@ctrl/react-adsense";
import CouchBuddyAd from "./CouchBuddyAd";

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

function BlogQuiz({
  heading,
  slug,
  introduction,
  pageDetails,
  mode,
  location,
}) {
  const [score, setScore] = useState(0);
  const styles = {
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
      fontSize: "22px",
    }),
    rank: css({
      margin: 0,
      padding: 0,
      fontSize: "22px",
    }),
    adWrap: css({
      marginTop: "3rem",
    }),
  };
  const {
    rankOne,
    rankTwo,
    rankThree,
    rankFour,
    rankFive,
  } = pageDetails.ranks[0].fields;

  return (
    <div>
      <h1 css={styles.heading}>{heading}</h1>
      <div css={styles.socials}>
        <BlogSocials slug={slug} />
      </div>
      <p css={styles.introduction}>{introduction}</p>
      {pageDetails.questions.length > 0
        ? pageDetails.questions.map((p, index) => (
            <BlogQuizQuestion
              details={p}
              key={index}
              questionNumber={index}
              score={score}
              setScore={setScore}
              mode={mode}
            />
          ))
        : null}
      <div css={styles.results}>
        <p css={styles.score}>
          {score} / {pageDetails.questions.length}
        </p>
        <p css={styles.rank}>
          {score < 4
            ? rankFive
            : score < 7
            ? rankFour
            : score < 10
            ? rankThree
            : score < 13
            ? rankTwo
            : rankOne}
        </p>
        <p>Share Your results</p>
        <BlogQuizSocials
          slug={slug}
          score={score}
          rank={
            score < 4
              ? rankFive
              : score < 7
              ? rankFour
              : score < 10
              ? rankThree
              : score < 13
              ? rankTwo
              : rankOne
          }
        />
      </div>
      <div css={styles.adWrap}>
        <Adsense
          client="ca-pub-9245347946008848"
          slot="5327454859"
          style={{ display: "block" }}
          responsive={true}
        />
      </div>
      <CouchBuddyAd mode={mode} />
    </div>
  );
}

export default BlogQuiz;
