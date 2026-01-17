import { GameHeader } from "./components/GameHeader";
import { Quiz } from "./components/Quiz";

export default function App() {
  const questions = [
    {
      question: "Who won the NBA finals in 2023",
      choices: ["Lakers", "Heat", "Nuggets", "Bucks"],
      answer: "Nuggets",
    },
  ];

  return (
    <>
      <GameHeader score={6} mistakes={1} questions={0} />
      <Quiz questions={questions} />
    </>
  );
}
