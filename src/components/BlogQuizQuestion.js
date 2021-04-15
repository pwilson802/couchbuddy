/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import DropDownButton from "./DropDownButton";
import BlogQuizCorrect from "./BlogQuizCorrect";
import BlogQuizIncorrect from "./BlogQuizIncorrect";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Adsense } from "@ctrl/react-adsense";

const colors = {
  light: {
    text: "black",
    border: "rgba(150,208,211,1)",
    background: "rgba(150,208,211,0.4)",
    notAnswered: "rgba(150,208,211,0.4)",
    answerBackground: "rgba(254,244,225, 0.4)",
    answerBorder: "rgba(254,244,225, 1)",
    correct: "#39B54A",
    incorrect: "#A01701",
  },
  dark: {
    text: "white",
    border: "rgba(150,208,211,0.3)",
    answerBorder: "rgba(150,208,211,0.3)",
    background: "rgba(150,208,211,0.1)",
    answerBackground: "rgba(150,208,211,0.2)",
    notAnswered: "rgba(150,208,211,0.1)",
    correct: "#39B54A",
    incorrect: "#A01701",
  },
};

function BlogQuizQuestion({ details, questionNumber, score, setScore, mode }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState("notAnswered");
  const styles = {
    wrapper: css({
      margin: "40px 0",
    }),
    scoreButtons: css({
      display: "flex",
    }),
    number: css({
      fontSize: "1rem",
      color: colors[mode]["text"],
      borderColor: colors[mode][correct],
      borderStyle: "solid",
      borderWidth: 2,
      borderBottom: "none",
      display: "inline-block",
      padding: "3px 8px",
      borderRadius: "40% 40% 0 0",
      background: colors[mode][correct],
    }),
    questionBlock: css({
      color: colors[mode]["text"],
      borderColor: colors[mode]["border"],
      borderStyle: "solid",
      borderWidth: 2,
      padding: "5px 10px 0 10px",
      borderRadius: "0 5px 0px 0px",
      background: colors[mode]["background"],
      cursor: "pointer",
    }),
    showAnswerWrapper: css({
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    }),
    showAnswer: css({
      display: "flex",
      alignItems: "center",
      color: colors[mode]["text"],
      marginTop: "-7px",
      marginBottom: "-5px",
    }),
    answerWrapper: css({
      borderColor: colors[mode]["answerBorder"],
      borderStyle: "solid",
      borderWidth: 2,
      padding: "10px 10px",
      borderRadius: "0 0 5px 5px",
      borderTop: "none",
      background: colors[mode]["answerBackground"],
      color: colors[mode]["text"],
    }),
    answerWrapperHide: css({
      display: "none",
    }),
    scoreButtons: css({
      display: "flex",
      justifyContent: "center",
    }),
    adWrap: css({
      marginTop: "3rem",
      paddingBottom: "40px",
    }),
  };

  const updateCorrect = (correct) => {
    if (correct == true) {
      setCorrect("correct");
    } else {
      setCorrect("incorrect");
    }
  };

  const updateScore = (correct) => {
    if (answered == true) {
      return;
    }
    if (correct == true) {
      setScore(score + 1);
    }
    updateCorrect(correct);
    setAnswered(true);
  };

  return (
    <div>
      <div css={styles.wrapper}>
        <div css={styles.number}>{questionNumber + 1}</div>
        <div
          css={styles.questionBlock}
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <div>{documentToReactComponents(details.question)}</div>
          <div css={styles.showAnswerWrapper}>
            <div css={styles.showAnswer}>
              <span>{showAnswer ? "Hide Answer" : "Show Answer"}</span>
              <DropDownButton show={showAnswer} mode={mode} menu={"genres"} />
            </div>
          </div>
        </div>
        <div css={showAnswer ? styles.answerWrapper : styles.answerWrapperHide}>
          <div>{details.answer}</div>
          <div css={styles.scoreButtons}>
            <BlogQuizCorrect updateScore={updateScore} correct={correct} />
            <BlogQuizIncorrect
              updateScore={updateScore}
              answered={answered}
              correct={correct}
            />
          </div>
        </div>
      </div>
      {questionNumber == 7 && (
        <div css={styles.adWrap}>
          <Adsense
            client="ca-pub-9245347946008848"
            slot="5327454859"
            style={{ display: "block" }}
            responsive={true}
          />
        </div>
      )}
    </div>
  );
}

export default BlogQuizQuestion;
