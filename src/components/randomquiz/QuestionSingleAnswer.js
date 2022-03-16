/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState } from "react"
import QuizAnswer from "./QuizAnswer"

const colors = {
  light: {
    text: "black",
    heading: "black",
  },
  dark: {
    text: "white",
    heading: "rgba(150,208,211, 1)",
  },
};

function QuestionSingleAnswer({ questionDetails, handleQuestion, mode }) {
    const [isFinished, setIsFinished] = useState(false)
    const [isLocked, setIsLocked] = useState(false)

    const question = questionDetails.question
    const answers = questionDetails.answers

    const resetQuestion = (correct, answer) => {
        const answers = [answer]
        handleQuestion(correct, answers)
        setIsFinished(false)
        setIsLocked(false)
    }

    const handleAnswered = (isAnswered, correct, answer) => {
        setIsLocked(true)
        if (!isAnswered) {
            setTimeout(function () {
                setIsFinished(true)
                setTimeout(function () {
                    resetQuestion(correct, answer)
            }, 3000)
            }, 1300)
        }
    }

    const styles = {
        textImage: css({
            color: colors[mode]["text"],
        }),
        text: css({
            color: colors[mode]["text"],
            marginBottom: "2rem",
            marginTop: "1rem",
        }),
        imageWrapper: css({
            display: "flex",
            alignItems: "center", 
            justifyContent: "center",
            marginTop: "15px",
            borderRadius: 10,
            minHeight: "160px",
        }),
        image: css({
            borderRadius: 10,
        })
    }

    return <div>
        <div css={questionDetails.imageUrl ? styles.textImage : styles.text}>{question}</div>
        {questionDetails.imageUrl && <div css={styles.imageWrapper}><img css={styles.image } src={questionDetails.imageUrl} alt="question hint" /></div>} 
        {answers.map((item, index) => {
            return <QuizAnswer answer={item} handleAnswered={handleAnswered} key={index} finished={isFinished} locked={isLocked} mode={mode }/>
        })}
    </div>
}

export default QuestionSingleAnswer