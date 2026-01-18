import { useState } from "react";
import { GameHeader } from "./components/GameHeader";
import { Quiz } from "./components/Quiz";

export default function App() {
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);

  const questions = [
    {
      question: "Who won the NBA finals in 2023",
      choices: ["Lakers", "Heat", "Nuggets", "Bucks"],
      answer: "Nuggets",
    },
  ];

  return (
    <>
      <GameHeader
        score={score}
        setScore={setScore}
        mistakes={wrong}
        questions={0}
      />
      <Quiz
        questions={questions}
        score={score}
        setScore={setScore}
        setWrong={setWrong}
      />
    </>
  );
}
