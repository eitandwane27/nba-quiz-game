import { useState } from "react";
import { GameHeader } from "./components/GameHeader";
import { Quiz } from "./components/Quiz";
import { ModeSelector } from "./components/ModeSelector";
import { GameTypeSelector } from "./components/GameTypeSelector";
import { fetchDynamicQuestions } from "./services/quizService";

export default function App() {
  const [gameState, setGameState] = useState("menu"); // 'menu', 'mode_select', 'game_type_select', 'loading', 'playing', 'game_over'
  const [gameMode, setGameMode] = useState("random"); // 'legends' | 'modern' | 'random' (Elite Journeyman)
  const [gameType, setGameType] = useState("classic"); // 'classic' | 'time_attack' | 'sudden_death'
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    setGameState("game_type_select");
  };

  const handleGameTypeSelect = async (type) => {
    setGameType(type);
    setGameState("loading");
    setScore(0);
    setWrong(0);
    setStreak(0);
    setHighestStreak(0);
    setQuestionIndex(0);

    const numToFetch = type === "time_attack" ? 100 : 10;
    const fetchedQuestions = await fetchDynamicQuestions(numToFetch, gameMode);
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
        gameType={gameType}
      />

      {gameState === "menu" && (
        <main
          className="panel-rise"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-2xl) var(--space-lg)",
            gap: "var(--space-xl)",
            maxWidth: "760px",
            margin: "0 auto",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(64px, 12vw, 120px)",
                color: "var(--chalk-white)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Hardwood
              <br />
              <span style={{ color: "var(--nba-orange)" }}>IQ</span>
            </h2>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                letterSpacing: "0.2em",
                color: "var(--chalk-dim)",
                textTransform: "uppercase",
                marginTop: "24px",
              }}
            >
              The Ultimate NBA Quiz
            </div>
          </div>

          <div
            className="led-divider"
            style={{ width: "100%", maxWidth: "300px" }}
          />

          <button
            id="btn-enter-court"
            className="btn-primary"
            onClick={goToModeSelect}
          >
            ENTER COURT
          </button>
        </main>
      )}

      {gameState === "mode_select" && (
        <ModeSelector onModeSelect={handleModeSelect} />
      )}

      {gameState === "game_type_select" && (
        <GameTypeSelector
          gameMode={gameMode}
          onGameTypeSelect={handleGameTypeSelect}
          onBack={() => setGameState("mode_select")}
        />
      )}

      {gameState === "loading" && (
        <main
          className="panel-rise"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-2xl) var(--space-lg)",
            gap: "var(--space-xl)",
            maxWidth: "760px",
            margin: "0 auto",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 8vw, 64px)",
                color: "var(--chalk-white)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Scouting
              <br />
              <span style={{ color: "var(--nba-orange)" }}>Players...</span>
            </h2>
          </div>
          <div
            className="led-divider"
            style={{ width: "100%", maxWidth: "300px" }}
          />
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
          gameType={gameType}
          onGameOver={handleGameOver}
        />
      )}

      {gameState === "game_over" && (
        <main
          className="panel-rise"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-2xl) var(--space-lg)",
            gap: "var(--space-xl)",
            maxWidth: "760px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(48px, 10vw, 84px)",
                color:
                  gameType === "time_attack"
                    ? "var(--led-blue)"
                    : gameType === "sudden_death"
                      ? "var(--nba-red)"
                      : "var(--nba-red)",
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {gameType === "time_attack" ? (
                <>
                  Times
                  <br />
                  <span style={{ color: "var(--led-blue)" }}>Up!</span>
                </>
              ) : gameType === "sudden_death" ? (
                <>
                  💀
                  <br />
                  <span style={{ fontSize: "0.65em" }}>Eliminated</span>
                </>
              ) : (
                <>
                  Buzzer
                  <br />
                  Beater
                </>
              )}
            </h2>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                letterSpacing: "0.2em",
                color: "var(--chalk-dim)",
                marginTop: "24px",
                textTransform: "uppercase",
              }}
            >
              {gameType === "time_attack"
                ? "Time Attack Final Stats"
                : gameType === "sudden_death"
                  ? "Sudden Death Final Stats"
                  : "Final Stats"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "var(--space-md)",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {/* Score — always shown */}
            <div
              className="stat-block stat-block--orange"
              style={{ padding: "var(--space-md) var(--space-lg)" }}
            >
              <span className="stat-block__label">
                {gameType === "time_attack" ? "Questions Answered" : "Score"}
              </span>
              <span className="stat-block__value">{score}</span>
            </div>

            {/* Errors — hidden for Time Attack (no lives concept) */}
            {gameType !== "time_attack" && (
              <div
                className="stat-block stat-block--red"
                style={{ padding: "var(--space-md) var(--space-lg)" }}
              >
                <span className="stat-block__label">Errors</span>
                <span className="stat-block__value">
                  {wrong}/{gameType === "sudden_death" ? "1" : "3"}
                </span>
              </div>
            )}

            {/* Best Streak — always shown */}
            <div
              className="stat-block stat-block--gold"
              style={{ padding: "var(--space-md) var(--space-lg)" }}
            >
              <span className="stat-block__label">Best Streak</span>
              <span className="stat-block__value">{highestStreak}</span>
            </div>
          </div>

          <div
            className="led-divider"
            style={{ width: "100%", maxWidth: "300px" }}
          />

          <button
            id="btn-play-again"
            className="btn-primary"
            onClick={goToModeSelect}
          >
            PLAY AGAIN
          </button>
        </main>
      )}
    </>
  );
}
