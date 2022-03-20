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

    let [questionType, question] = questionDetails.question.split("!!!")
    const answers = questionDetails.answers
    let tagline = ""
    console.log("questionType:", questionType)
    if (questionType == "tagline") {
        [question, tagline] = question.split("\n")
        console.log(question.split("\n"))
    }

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
            textAlign: "center",
            marginTop: "5px",
        }),
        text: css({
            color: colors[mode]["text"],
            marginBottom: "2rem",
            marginTop: "1.5rem",
            textAlign: "center",
        }),
        textTagline: css({
            color: colors[mode]["text"],
            textAlign: "center",
            marginTop: "1rem",
            marginBottom: "1rem"
        }),
        tagline: css({
            fontFamily: "MaliRegular",
            textAlign: "center",
            fontSize: "1.4rem",
            color: "#FDD782",
            marginBottom: "2rem",
        }),
        imageWrapper: css({
            display: "flex",
            alignItems: "center", 
            justifyContent: "center",
            marginTop: "15px",
            borderRadius: 10,
            minHeight: "160px",
            "@media(min-width: 768px)": {
                marginTop: 0,
      },
        }),
        image: css({
            borderRadius: 10,
        })
    }

    return <div>
        {questionDetails.imageUrl && <div css={styles.imageWrapper}><img css={styles.image } src={questionDetails.imageUrl} alt="question hint" /></div>} 
        <div css={questionDetails.imageUrl ? styles.textImage : questionType == "tagline" ? styles.textTagline : styles.text}>{question}</div>
        {questionType == "tagline" && <div css={styles.tagline}>{tagline}</div> }
        {answers.map((item, index) => {
            return <QuizAnswer answer={item} handleAnswered={handleAnswered} key={index} finished={isFinished} locked={isLocked} mode={mode }/>
        })}
    </div>
}

export default QuestionSingleAnswer