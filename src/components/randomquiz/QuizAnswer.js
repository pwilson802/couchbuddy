/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react"
import QuizRightAnswerAnimation from "./QuizRightAnswerAnimation";
import QuizWrongAnswerAnimation from "./QuizWrongAnswerAnimation";

const colors = {
  light: {
    text: "black",
  },
  dark: {
    text: "white",
  },
};

function QuizAnswer({ answer, handleAnswered, finished, locked, mode}) {
    // need to remove the hand pointer once the question is locked
  const [answered, setAnswered] = useState(false)
  const [show, setShow] = useState(false)

    useEffect(() => {
        setAnswered(false)
        // handleAnswered(true, false)
    }, [answer])

    function handleClick() {
        setAnswered(!answered)
        handleAnswered(answered, answer.correct, answer.answer)
  }
  
    const styles = {
    selected: css({
      backgroundColor: "rgba(225, 44, 134, 0.5)",
      color: colors[mode]["text"],
      padding: "10px",
      fontFamily: "Arial",
      margin: "20px",
      border: "2px solid #FEF4E1",
      cursor: "pointer",
      height: "2.8rem",
      }),
    unselected: css({
      color: colors[mode]["text"],
      padding: "10px",
      fontFamily: "Arial",
      margin: "20px",
      border: "2px solid #FEF4E1",
      height: "2.8rem", ursor: "pointer",
      cursor: "pointer",
      
      }),
    wrongAnswer: css({
      padding: "10px",
      fontFamily: "Arial",
      margin: "20px",
      border: "2px solid rgba(242, 226, 206, 0.3)",
      opacity: "0.7",
      display: "flex",
      height: "2.8rem",
      }),
    rightAnswer: css({
      backgroundColor: "rgba(253, 215, 130, 0.5)",
      padding: "10px",
      fontFamily: "Arial",
      margin: "20px",
      border: "2px solid rgba(253, 215, 130)",
      color: colors[mode]["text"],
      display: "flex",
      height: "2.8rem",
    }),
      animation: css({
        marginLeft: "1rem",
        padding: 0,
    })
      
  };

    return (
        <div>
        {finished &&
          <div css={answer.correct ? styles.rightAnswer : styles.wrongAnswer} >
            <div>{answer.answer}</div>
            {/* {answered && !answer.correct && (
              <div css={styles.animation }>
              <QuizWrongAnswerAnimation mode={mode} />
            </div>
            )}
            {answered && answer.correct && (
              <div css={styles.animation }>
              <QuizRightAnswerAnimation mode={mode} />
            </div>
            )} */}

          </div>
        }
        {!finished && <div css={answered ? styles.selected : styles.unselected} onClick={locked ? () => { } : handleClick}>{answer.answer}</div>}
        </div>
    )
}

export default QuizAnswer