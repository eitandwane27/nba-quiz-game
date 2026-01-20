export const Quiz = ({
  questions,
  setScore,
  setWrong,
  questionIndex,
  setQuestionIndex,
}) => {
  function handleAnswerClick(ch, index, rightAnswer) {
    console.log(ch, index);

    if (ch === currentQuestion.answer) {
      console.log("correct");

      setScore((prev) => prev + 1);
      setQuestionIndex((prev) => prev + 1);
    } else {
      setWrong((prev) => prev + 1);
      setQuestionIndex((prev) => prev + 1);
    }
  }

  const currentQuestion = questions[questionIndex]; //questions[0]

  return (
    <>
      <div className="main-container">
        <h2>{currentQuestion.question}</h2>

        {currentQuestion.choices.map((ch, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(ch, currentQuestion.answer)}
          >
            {ch}
          </button>
        ))}
      </div>
    </>
  );
};
