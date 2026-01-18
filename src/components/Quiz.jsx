export const Quiz = ({ questions, setScore, setWrong }) => {
  function handleAnswerClick(ch, index, rightAnswer) {
    console.log(ch, index);

    if (ch === rightAnswer) {
      console.log("correct");

      setScore((prev) => prev + 1);
    } else {
      setWrong((prev) => prev + 1);
    }
  }

  return (
    <>
      <div className="main-container">
        {questions.map((box, index) => (
          <div key={index}>
            {box.question}
            <div>
              {box.choices.map((ch, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(ch, index, box.answer)}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
