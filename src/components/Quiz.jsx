export const Quiz = ({ questions }) => {
  return (
    <>
      <div className="main-container">
        {questions.map((box, index) => (
          <div key={index}>
            {box.question}
            <div>
              {box.choices.map((ch, index) => (
                <button key={index}>{ch}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
