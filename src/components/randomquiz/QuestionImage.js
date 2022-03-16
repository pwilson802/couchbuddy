
function QuestionImage({ questionDetails, handleQuestion }) {
    const question = questionDetails.question
    const answers = questionDetails.answers

    return <div>
        <div><img src={questionDetails.imageUrl} alt="question hint" /></div>
        <div>{question}</div>
        {answers.map((item, index) => {
            return <div onClick={() => handleQuestion(item.correct)} key={index}>{item.answer}</div>
        })}
    </div>
}

export default QuestionImage