/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useEffect, useState } from "react";
import { MakeMoviesList, MakeQuestionsList, MakeQuestion } from "./MakeQuiz";
import Question from "./Question";
import QuizEnd from "./QuizEnd";
import RandomQuizButton from "./RandomQuizButton";
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

function Quiz({
  mode,
  setStartRequested,
  heading,
  introduction,
  setEndPage,
  slug,
}) {
  const [introVisibility, setIntroVisibility] = useState("visible");
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [loadedQuestions, setLoadedQuestions] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [restarting, setRestarting] = useState(false);

  async function setupQuiz() {
    setEndPage(false);
    let internalData = {
      tagline: [],
      characterInMovie: [],
      whoPlayedCharacter: [],
      whoDidActorPlay: [],
      WhoDidntDirect: [],
      movieFromPicture: [],
      movieStaringPerson: [],
    };
    setIntroVisibility("hidden");
    setRestarting(true);
    let movies, extraMovies;
    [movies, extraMovies] = await MakeMoviesList(slug);
    const questionsList = MakeQuestionsList(slug);
    const tempQuestions = [];
    for (let i = 0; i < 15; i++) {
      extraMovies = extraMovies.slice(i);
      let newQuestion = await MakeQuestion(
        questionsList[i],
        movies[i],
        extraMovies,
        i,
        internalData
      );
      internalData = newQuestion[1];
      tempQuestions.push(newQuestion[0]);
      setQuestions(tempQuestions);
      setLoadedQuestions(i);
    }
  }

  async function resetQuiz() {
    setLoadedQuestions(0);
    setEndPage(false);
    setRestarting(true);
    setQuestions([]);
    setActiveQuestion(0);
    setIsFinished(false);
    setScore(0);
    await setupQuiz();
  }

  const handleQuestion = (correct, answers) => {
    questions[activeQuestion]["answered"] = answers;
    if (correct) {
      setScore(score + 1);
      questions[activeQuestion]["correct"] = true;
    } else {
      questions[activeQuestion]["correct"] = false;
    }
    if (activeQuestion === 14) {
      setIsFinished(true);
      setEndPage(true);
      // console.log(questions)
    }
    setActiveQuestion(activeQuestion + 1);
  };

  const styles = {
    wrapper: css({
      height: "100%",
    }),
    heading: css({
      textAlign: "center",
      margin: "20px 0 0 0",
      color: colors[mode]["heading"],
      visibility: introVisibility,
    }),
    introduction: css({
      color: colors[mode]["text"],
      visibility: introVisibility,
    }),
    numbers: css({
      color: colors[mode]["text"],
      position: "absolute",
      top: "5px",
      left: "10px",
      fontFamily: "CorbenBold",
      fontSize: "1.2rem",
    }),
  };
  // console.log(activeQuestion)
  // console.log(questions)
  return (
    <div css={styles.wrapper}>
      {questions[activeQuestion] ? (
        <div>
          {!isFinished && (
            <div>
              <div css={styles.numbers}>{activeQuestion + 1} / 15</div>
              <Question
                questionDetails={questions[activeQuestion]}
                handleQuestion={handleQuestion}
                mode={mode}
                slug={slug}
              />
            </div>
          )}
        </div>
      ) : isFinished ? (
        <QuizEnd
          score={score}
          resetQuiz={resetQuiz}
          questions={questions}
          mode={mode}
          setEndPage={setEndPage}
          slug={slug}
        />
      ) : (
        <div>
          <h1 css={styles.heading}>{heading}</h1>
          <p css={styles.introduction}>{introduction}</p>
          {restarting ? (
            <RandomQuizSpinner mode={mode} />
          ) : (
            <RandomQuizButton setupQuiz={setupQuiz} mode={mode} />
          )}
        </div>
      )}
    </div>
  );
}

export default Quiz;
