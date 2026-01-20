import { useState } from "react";
import { GameHeader } from "./components/GameHeader";
import { Quiz } from "./components/Quiz";

export default function App() {
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const questions = [
    {
      question: "Who won the NBA finals in 2023",
      choices: ["Lakers", "Heat", "Nuggets", "Bucks"],
      answer: "Nuggets",
    },

    {
      question: "Who is the greatest 3 pt. shooter",
      choices: ["Curry", "Heat", "Nuggets", "Bucks"],
      answer: "Curry",
    },
  ];

  return (
    <>
      {/* for the ui */}
      <GameHeader
        score={score}
        setScore={setScore}
        mistakes={wrong}
        questions={questionIndex}
        setQuestionIndex={setQuestionIndex}
      />
      {/* for the logic */}
      <Quiz
        questions={questions}
        setQuestionIndex={setQuestionIndex}
        questionIndex={questionIndex}
        score={score}
        setScore={setScore}
        setWrong={setWrong}
      />
    </>
  );
}
