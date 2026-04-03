import { useState, useEffect, useCallback } from "react";
import { TimerRing } from "./TimerRing";

const ANSWER_LABELS = ["A", "B", "C", "D"];

export const Quiz = ({
  questions,
  questionIndex,
  setQuestionIndex,
  score,
  setScore,
  mistakes,
  setWrong,
  streak,
  setStreak,
  highestStreak,
  setHighestStreak,
  onGameOver,
}) => {
  const [timeLeft, setTimeLeft] = useState(15);
  // Track per-button feedback: null | 'correct' | 'wrong'
  const [feedback, setFeedback] = useState(null); // { index, type }
  const [locked, setLocked] = useState(false);

  const isOver = questionIndex >= questions.length || mistakes >= 3;

  // ─── Game Over Detection ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOver) onGameOver();
  }, [isOver, onGameOver]);

  // ─── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOver || locked) return;

    if (timeLeft === 0) {
      handleWrongAnswer(-1); // -1 = timeout, no specific button
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isOver, locked]);

  // ─── Answer Handlers ──────────────────────────────────────────────────────
  const handleCorrectAnswer = useCallback(
    (btnIndex) => {
      setFeedback({ index: btnIndex, type: "correct" });
      setLocked(true);

      setTimeout(() => {
        setScore((prev) => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > highestStreak) setHighestStreak(newStreak);
        setFeedback(null);
        setLocked(false);
        setTimeLeft(15);
        setQuestionIndex((prev) => prev + 1);
      }, 400);
    },
    [streak, highestStreak, setScore, setStreak, setHighestStreak, setQuestionIndex]
  );

  const handleWrongAnswer = useCallback(
    (btnIndex) => {
      setFeedback({ index: btnIndex, type: "wrong" });
      setLocked(true);

      setTimeout(() => {
        setWrong((prev) => prev + 1);
        setStreak(0);
        setFeedback(null);
        setLocked(false);
        setTimeLeft(15);
        setQuestionIndex((prev) => prev + 1);
      }, 500);
    },
    [setWrong, setStreak, setQuestionIndex]
  );

  const handleAnswerClick = (choice, correctAnswer, btnIndex) => {
    if (locked) return;
    if (choice === correctAnswer) {
      handleCorrectAnswer(btnIndex);
    } else {
      handleWrongAnswer(btnIndex);
    }
  };

  if (isOver) return null;

  const currentQuestion = questions[questionIndex];

  return (
    <main
      className="panel-rise"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "clamp(24px, 5vw, 64px) clamp(16px, 4vw, 48px)",
        gap: "32px",
        maxWidth: "760px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* ── Top Row: Shot-Clock + Question Counter ───────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <TimerRing timeLeft={timeLeft} maxTime={15} />

        {/* Question progress */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "52px",
              lineHeight: 1,
              color: "var(--chalk-white)",
            }}
          >
            {questionIndex + 1}
            <span
              style={{
                fontSize: "24px",
                color: "var(--chalk-dim)",
                marginLeft: "4px",
              }}
            >
              / {questions.length}
            </span>
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--chalk-dim)",
              marginTop: "2px",
            }}
          >
            Question
          </div>
        </div>
      </div>

      {/* LED divider */}
      <div className="led-divider" style={{ margin: 0, width: "100%" }} />

      {/* ── Question Panel ───────────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          padding: "28px 32px",
          background: "var(--court-surface)",
          border: "1px solid var(--surface-rim)",
          borderLeft: "4px solid var(--nba-orange)",
          borderRadius: "var(--radius-lg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative large "?" in background */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "140px",
            color: "rgba(248, 115, 32, 0.04)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          ?
        </span>

        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(24px, 4vw, 36px)",
            letterSpacing: "0.02em",
            lineHeight: 1.15,
            color: "var(--chalk-white)",
            maxWidth: "80%",
            position: "relative",
          }}
        >
          {currentQuestion.question}
        </h2>
      </div>

      {/* ── Answer Grid ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          width: "100%",
        }}
      >
        {currentQuestion.choices.map((choice, i) => {
          const isThisButton = feedback?.index === i;
          const feedbackClass = isThisButton
            ? feedback.type === "correct"
              ? "btn-answer--correct"
              : "btn-answer--wrong"
            : "";

          return (
            <button
              key={`${questionIndex}-${i}`}
              className={`btn-answer ${feedbackClass}`}
              onClick={() =>
                handleAnswerClick(choice, currentQuestion.answer, i)
              }
              disabled={locked}
              aria-label={`Answer ${ANSWER_LABELS[i]}: ${choice}`}
            >
              <span className="btn-answer__prefix">{ANSWER_LABELS[i]}</span>
              <span className="btn-answer__text">{choice}</span>
              <span className="btn-answer__letter" aria-hidden="true">
                {ANSWER_LABELS[i]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Streak badge (appears when streak ≥ 3) */}
      {streak >= 3 && (
        <div
          className="badge badge--fire"
          style={{ alignSelf: "flex-start" }}
        >
          🔥 {streak} answer streak
        </div>
      )}
    </main>
  );
};
