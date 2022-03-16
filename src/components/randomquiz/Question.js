import QuestionSingleAnswer from "./QuestionSingleAnswer"
import QuestionDoubleAnswer from "./QuestionDoubleAnswer"
import QuestionImage from "./QuestionImage"

function getQuestionType(questionDetails) {
    if (questionDetails.numCorrect === 2) {
        return "double"
    }
    if (questionDetails.imageUrl !== false) {
        return "image"
    }
    return "single"
}

function Question({ questionDetails, handleQuestion, mode }) {
    const questionType = getQuestionType(questionDetails)
    
    return (<div>
        {questionType === "single" && <QuestionSingleAnswer questionDetails={questionDetails} handleQuestion={handleQuestion} mode={mode} />}
        {questionType === "double" && <QuestionDoubleAnswer questionDetails={questionDetails} handleQuestion={handleQuestion} mode={mode} />}
        {questionType === "image" && <QuestionSingleAnswer questionDetails={questionDetails} handleQuestion={handleQuestion} mode={mode} />}
    </div>)
}

export default Question