/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import BlogSocials from "./BlogSocials";
import BlogQuizQuestion from "./BlogQuizQuestion";

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
    score: css({
      color: colors[mode]["text"],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      flexDirection: "column",
    }),
  };

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
              question={p.question}
              answer={p.answer}
              key={index}
              questionNumber={index}
              score={score}
              setScore={setScore}
              mode={mode}
            />
          ))
        : null}
      <div css={styles.score}>
        <p>
          {score} / {pageDetails.questions.length}
        </p>
        <p>Share Your results</p>
      </div>
    </div>
  );
}

export default BlogQuiz;
