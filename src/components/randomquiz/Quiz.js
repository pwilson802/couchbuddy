/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useEffect, useState } from "react";
import { MakeMoviesList, MakeQuestionsList, MakeQuestion } from "./MakeQuiz"
import Question from "./Question"
import QuizEnd from "./QuizEnd"
import RandomQuizButton from "./RandomQuizButton"
import RandomQuizSpinner from "./RandomQuizSpinner";

const colors = {
  light: {
    text: "black",
    heading: "black",
  },
  dark: {
    text: "white",
    heading: "#FDD782",
  },
};

// const quizData = {
//   tagline: [],
//   characterInMovie: [],
//   whoPlayedCharacter: [],
//   whoDidActorPlay: [],
//   WhoDidntDirect: [],
//   movieFromPicture: [],
//   movieStaringPerson: []
// }


function Quiz({ mode, setStartRequested, heading, introduction }) {
  const [introVisibility, setIntroVisibility] = useState("visible")
  const [questions, setQuestions] = useState([])
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isFinished, setIsFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [restarting, setRestarting] = useState(false)
  // const [internalData, setInternalData] = useState(quizData)

  async function setupQuiz() {
    let internalData = {
      tagline: [],
      characterInMovie: [],
      whoPlayedCharacter: [],
      whoDidActorPlay: [],
      WhoDidntDirect: [],
      movieFromPicture: [],
      movieStaringPerson: []
    }
    setIntroVisibility("hidden")
    setRestarting(true)
    let movies, extraMovies
    [movies, extraMovies] = await MakeMoviesList()
    const questionsList = MakeQuestionsList()
    const tempQuestions = []
    for (let i = 0; i < 15; i++){
      let newQuestion = await MakeQuestion(questionsList[i], movies[i], extraMovies, i, internalData)
      internalData = newQuestion[1]
      tempQuestions.push(newQuestion[0])
      setQuestions(tempQuestions)
      console.log("internal Data", internalData)
  }
  }
  
  async function resetQuiz() {
    setRestarting(true)
    setQuestions([])
    setActiveQuestion(0)
    setIsFinished(false)
    setScore(0)
    await setupQuiz()    
  }

  const handleQuestion = (correct, answers) => {
    questions[activeQuestion]["answered"] = answers
    if (correct) {
      setScore(score + 1);
      questions[activeQuestion]["correct"] = true
    } else {
      questions[activeQuestion]["correct"] = false
    }
      if (activeQuestion === 14) {
        setIsFinished(true);
        console.log(questions)
    }
      setActiveQuestion(activeQuestion + 1);
  };
   
  const styles = {
    heading: css({
      textAlign: "center",
      margin: "20px 0 0 0",
      color: colors[mode]["heading"],
      visibility: introVisibility
    }),
    introduction: css({
      color: colors[mode]["text"],
      visibility: introVisibility
    }),
  };
  return (
    <div>
      {questions[activeQuestion] ?
        <div>
          {!isFinished && <Question
            questionDetails={questions[activeQuestion]}
            handleQuestion={handleQuestion}
            mode={mode }
          />}
        </div> :
        isFinished ?
          <QuizEnd score={score} resetQuiz={resetQuiz} questions={questions} mode={mode} /> :
          (
          <div>
            <h1 css={styles.heading}>{heading}</h1>
              <p css={styles.introduction}>{introduction}</p>
              { restarting ? <RandomQuizSpinner mode={mode } /> :
                <RandomQuizButton setupQuiz={setupQuiz} mode={mode}/>
              }
          </div>
          )
      
      
      }
    </div>
  )
}

export default Quiz