/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import CouchBuddyAd2 from "../CouchBuddyAd2";
import FakeAd from "../FakeAd";
import QuizSocials from "./QuizSocials";
import { Adsense } from "@ctrl/react-adsense";
import CopyAnimation from "./CopyAnimation";
import CopyButton from "./CopyButton";
import CopyConfirmation from "./CopyConfirmation";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function QuizEnd({ score, resetQuiz, questions, mode, setEndPage, slug }) {
  const [showCopy, setShowCopy] = useState(false);
  const styles = {
    wrapper: css({
      display: "flex",
      justifyContent: "center",
      fontSize: "1.1rem",
      alignItems: "center",
      flexDirection: "column",
      height: "100%",
      textAlign: "center",
      marginTop: "20px",
      "@media(min-width: 768px)": {
        flexDirection: "row",
        alignItems: "center",
      },
    }),
    score: css({
      color: colors[mode]["text"],
      fontSize: "2.5rem",
      fontFamily: "CorbenBold",
      textAlign: "center",
      letterSpacing: 4,
    }),
    button: css({
      color: colors[mode]["text"],
      padding: "25px 23px",
      fontFamily: "Arial",
      margin: "10px",
      border: "1px solid #E12C86",
      cursor: "pointer",
      borderRadius: "10px",
      fontWeight: "bold",
      backgroundColor: "#E12C86",
      height: "42px",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    buttonwrap: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    socials: css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: "10px",
      left: "20px",
    }),
    left: css({
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      "@media(min-width: 768px)": {
        marginRight: "40px",
      },
    }),
    adWrap: css({
      marginTop: "2rem",
    }),
  };

  const handleShowCopy = () => {
    setShowCopy(true);
    setTimeout(() => {
      setShowCopy(false);
    }, 2000);
  };

  function copyText() {
    // console.log("questions", questions)
    handleShowCopy();
    const entryText = makeQuestionClip(questions);
    navigator.clipboard.writeText(entryText);
  }

  const questionsText = makeQuestionClip(questions);
  useState(() => {
    setEndPage(true);
  }, []);

  return (
    <div css={styles.wrapper}>
      {showCopy && <CopyConfirmation mode={mode} />}
      <div css={styles.socials}>
        <QuizSocials score={score} slug={slug} />
      </div>
      <div css={styles.left}>
        <div css={styles.score}>{score}/15</div>
        <div>
          <div css={styles.buttonwrap}>
            <div css={styles.button} onClick={() => resetQuiz()}>
              Start Again
            </div>
            {/* <CopyButton handleClick={copyText} mode={mode} /> */}
            <div css={styles.button} onClick={() => copyText()}>
              Copy 📋
            </div>
          </div>
        </div>
      </div>
      <div css={styles.right}>
        <CouchBuddyAd2 mode={mode} />
        <div css={styles.adWrap}>
          <Adsense
            client="ca-pub-9245347946008848"
            slot="5327454859"
            style={{ width: 300, height: 100 }}
            format=""
          />
        </div>
      </div>
    </div>
  );
}

function makeQuestionClip(questions) {
  let response = "QUIZ\n\n";
  // console.log(questions.length)
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    // console.log(question)
    response =
      response +
      `${i + 1}: ${question.question.split("!!!")[1]} 
    ${question.imageUrl ? question.imageUrl : ""}
    a: ${question.answers[0]["answer"]}
    b: ${question.answers[1]["answer"]}
    c: ${question.answers[2]["answer"]}
    d: ${question.answers[3]["answer"]}\n\n`;
  }
  const correctAnswers = questions.map((item) =>
    item.answers.filter((item) => item.correct)
  );
  let answers = "CORRECT ANSWERS\n\n";
  for (let i = 0; i < correctAnswers.length; i++) {
    let answersString = correctAnswers[i].map((item) => item.answer).join(", ");
    answers = answers + `${i + 1}: ${answersString} | `;
  }
  let yourAnswers = "\n\nYOUR ANSWERS\n\n";
  // console.log(questions)
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    let questionAnswers = question.answered;
    let correct = question.correct ? "✔️" : "❌";
    let answersString = questionAnswers.join(", ");
    yourAnswers = yourAnswers + `${i + 1}: ${answersString} ${correct} | `;
  }
  response = response + answers + yourAnswers;
  return response;
}

export default QuizEnd;
