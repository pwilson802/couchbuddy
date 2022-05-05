import QuestionSingleAnswer from "./QuestionSingleAnswer";
import QuestionDoubleAnswer from "./QuestionDoubleAnswer";
import QuestionImage from "./QuestionImage";

function getQuestionType(questionDetails) {
  if (questionDetails.numCorrect === 2) {
    return "double";
  }
  if (questionDetails.imageUrl !== false) {
    return "image";
  }
  return "single";
}

function Question({ questionDetails, handleQuestion, mode, slug }) {
  const questionType = getQuestionType(questionDetails);

  return (
    <div>
      {questionType === "single" && (
        <QuestionSingleAnswer
          questionDetails={questionDetails}
          handleQuestion={handleQuestion}
          mode={mode}
          slug={slug}
        />
      )}
      {questionType === "double" && (
        <QuestionDoubleAnswer
          questionDetails={questionDetails}
          handleQuestion={handleQuestion}
          mode={mode}
        />
      )}
      {questionType === "image" && (
        <QuestionSingleAnswer
          questionDetails={questionDetails}
          handleQuestion={handleQuestion}
          mode={mode}
          slug={slug}
        />
      )}
    </div>
  );
}

export default Question;
