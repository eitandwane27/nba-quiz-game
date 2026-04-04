import { useState } from "react";
import { GameHeader } from "./components/GameHeader";
import { Quiz } from "./components/Quiz";
import { ModeSelector } from "./components/ModeSelector";
import { fetchDynamicQuestions } from "./services/quizService";

export default function App() {
  const [gameState, setGameState] = useState("menu"); // 'menu', 'mode_select', 'loading', 'playing', 'game_over'
  const [gameMode, setGameMode] = useState("random");  // 'legends' | 'modern' | 'random'
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);

  const handleModeSelect = async (mode) => {
    setGameMode(mode);
    setGameState("loading");
    setScore(0);
    setWrong(0);
    setStreak(0);
    setHighestStreak(0);
    setQuestionIndex(0);

    const fetchedQuestions = await fetchDynamicQuestions(4, mode);
    setQuestions(fetchedQuestions);
    setGameState("playing");
  };

  const handleGameOver = () => {
    setGameState("game_over");
  };

  const goToModeSelect = () => {
    setGameState("mode_select");
  };

  return (
    <>
      <GameHeader
        score={score}
        mistakes={wrong}
        streak={streak}
        gameState={gameState}
      />
      
      {gameState === "menu" && (
        <main className="panel-rise" style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "var(--space-2xl) var(--space-lg)",
          gap: "var(--space-xl)",
          maxWidth: "760px", margin: "0 auto", width: "100%",
          textAlign: "center"
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(64px, 12vw, 120px)",
              color: "var(--chalk-white)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              textTransform: "uppercase"
            }}>
              Hardwood<br/>
              <span style={{ color: "var(--nba-orange)" }}>IQ</span>
            </h2>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              letterSpacing: "0.2em",
              color: "var(--chalk-dim)",
              textTransform: "uppercase",
              marginTop: "24px"
            }}>
              The Ultimate NBA Quiz
            </div>
          </div>

          <div className="led-divider" style={{ width: "100%", maxWidth: "300px" }} />

          <button id="btn-enter-court" className="btn-primary" onClick={goToModeSelect}>
            ENTER COURT
          </button>
        </main>
      )}

      {gameState === "mode_select" && (
        <ModeSelector onModeSelect={handleModeSelect} />
      )}

      {gameState === "loading" && (
        <main className="panel-rise" style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "var(--space-2xl) var(--space-lg)",
          gap: "var(--space-xl)",
          maxWidth: "760px", margin: "0 auto", width: "100%",
          textAlign: "center"
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 8vw, 64px)",
              color: "var(--chalk-white)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              textTransform: "uppercase"
            }}>
              Scouting<br/>
              <span style={{ color: "var(--nba-orange)" }}>Players...</span>
            </h2>
          </div>
          <div className="led-divider" style={{ width: "100%", maxWidth: "300px" }} />
        </main>
      )}

      {gameState === "playing" && (
        <Quiz
          questions={questions}
          questionIndex={questionIndex}
          setQuestionIndex={setQuestionIndex}
          score={score}
          setScore={setScore}
          mistakes={wrong}
          setWrong={setWrong}
          streak={streak}
          setStreak={setStreak}
          highestStreak={highestStreak}
          setHighestStreak={setHighestStreak}
          onGameOver={handleGameOver}
        />
      )}

      {gameState === "game_over" && (
        <main className="panel-rise" style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "var(--space-2xl) var(--space-lg)",
          gap: "var(--space-xl)",
          maxWidth: "760px", margin: "0 auto", width: "100%",
        }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 10vw, 84px)",
              color: "var(--nba-red)",
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}>
              Buzzer<br/>Beater
            </h2>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              letterSpacing: "0.2em",
              color: "var(--chalk-dim)",
              marginTop: "24px",
              textTransform: "uppercase"
            }}>
              Final Stats
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: "var(--space-md)",
            justifyContent: "center",
            flexWrap: "wrap",
            width: "100%"
          }}>
            <div className="stat-block stat-block--orange" style={{ padding: "var(--space-md) var(--space-lg)" }}>
              <span className="stat-block__label">Score</span>
              <span className="stat-block__value">{score}</span>
            </div>
            <div className="stat-block stat-block--red" style={{ padding: "var(--space-md) var(--space-lg)" }}>
              <span className="stat-block__label">Errors</span>
              <span className="stat-block__value">{wrong}/3</span>
            </div>
            <div className="stat-block stat-block--gold" style={{ padding: "var(--space-md) var(--space-lg)" }}>
              <span className="stat-block__label">Streak</span>
              <span className="stat-block__value">{highestStreak}</span>
            </div>
          </div>

          <div className="led-divider" style={{ width: "100%", maxWidth: "300px" }} />

          <button id="btn-play-again" className="btn-primary" onClick={goToModeSelect}>
            PLAY AGAIN
          </button>
        </main>
      )}
    </>
  );
}
