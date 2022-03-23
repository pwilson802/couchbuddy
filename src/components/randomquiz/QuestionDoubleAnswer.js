/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react"
import QuizAnswer from "./QuizAnswer"

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


function QuestionDoubleAnswer({ questionDetails, handleQuestion, mode }) {
    const [answered, setAnswered] = useState(0)
    const [numCorrect, setNumCorrect] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [isLocked, setIsLocked] = useState(false)
    const [myAnswers, setMyAnswers] = useState([])

    const resetQuestion = (correct, answers) => {
        handleQuestion(correct, answers)
        setNumCorrect(0)
        setIsCorrect(false)
        setIsFinished(false)
        setIsLocked(false)
        setMyAnswers([])
    }


    const handleAnswered = (isAnswered, correct, answer) => {
        if (!isAnswered && answered === 1) {
            const answers = [...myAnswers, answer]
            setIsLocked(true)
            setTimeout(function () {
                if (correct && numCorrect === 1) {

                setAnswered(0)
                setNumCorrect(0)
                setIsFinished(true)
                setIsCorrect(true)
                setTimeout(function () {
                    resetQuestion(true, answers)
                },2200)
            } else {
                setAnswered(0)
                setIsFinished(true)
                setIsCorrect(false)
                setTimeout(function () {
                    resetQuestion(false, answers)
                },2200)
            }
            }, 1200)
        } else {
            if (isAnswered) {
                setMyAnswers([])
                setAnswered(0)
                setNumCorrect(0)
            } else {
                setMyAnswers([answer])
                setAnswered(1)
                if (correct) {
                    setNumCorrect(1)
                }
            }
        }
  
        
    }
    const question = questionDetails.question.split("!!!")[1]
    const answers = questionDetails.answers
    const styles = {
        text: css({
            color: colors[mode]["text"],
            marginBottom: "2rem",
            marginTop: "1.5rem",
            textAlign: "center",
        }),
    }

    // need a way to shuffle the answers, maybe move it higher?
    return <div>
        <div css={styles.text}>{question}</div>
        {answers.map((item, index) => {
            return <QuizAnswer answer={item} handleAnswered={handleAnswered} key={index} finished={isFinished} locked={isLocked} mode={mode} />
        })}
    </div>
}

export default QuestionDoubleAnswer