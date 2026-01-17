export const GameHeader = ({ score, mistakes, questions }) => {
  return (
    <>
      <h1>Welcome to the NBA Trivia Game!</h1>
      <p>Score: {score}</p>
      <p>Mistakes:{mistakes} </p>
      <p>Questions: {questions}</p>
    </>
  );
};
