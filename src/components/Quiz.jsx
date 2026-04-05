import { useState, useEffect, useCallback, useRef } from "react";
import { TimerRing } from "./TimerRing";

const ANSWER_LABELS = ["A", "B", "C", "D"];
const TIME_ATTACK_DURATION = 60; // seconds

// ── Global Countdown Bar (Time Attack) ────────────────────────────────────────
const GlobalCountdownBar = ({ timeLeft, maxTime }) => {
  const ratio = timeLeft / maxTime;
  const isUrgent = timeLeft <= 15;
  const isCritical = timeLeft <= 8;

  const barColor = isCritical
    ? "var(--nba-red)"
    : isUrgent
    ? "var(--amber)"
    : "var(--led-blue)";

  const glowColor = isCritical
    ? "rgba(200,16,46,0.5)"
    : isUrgent
    ? "rgba(245,158,11,0.4)"
    : "rgba(0,180,216,0.35)";

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px" }}>
      {/* Label row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--chalk-dim)",
          }}
        >
          ⏱ Time Attack
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            lineHeight: 1,
            color: barColor,
            transition: "color 0.3s ease",
            filter: `drop-shadow(0 0 8px ${glowColor})`,
          }}
        >
          {timeLeft}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--chalk-dim)",
              marginLeft: "4px",
            }}
          >
            sec
          </span>
        </span>
      </div>

      {/* Progress bar track */}
      <div
        style={{
          width: "100%",
          height: "6px",
          background: "var(--surface-rim)",
          borderRadius: "100px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            background: barColor,
            borderRadius: "100px",
            transition: "width 1s linear, background 0.3s ease",
            boxShadow: `0 0 8px ${glowColor}`,
          }}
        />
      </div>
    </div>
  );
};

// ── Sudden Death Skull Indicator ────────────────────────────────────────────
const SuddenDeathIndicator = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 14px",
      background: "rgba(200, 16, 46, 0.08)",
      border: "1px solid rgba(200, 16, 46, 0.25)",
      borderRadius: "100px",
    }}
  >
    <span style={{ fontSize: "16px" }}>💀</span>
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--nba-red)",
        fontWeight: 500,
      }}
    >
      Sudden Death — One Wrong & It's Over
    </span>
  </div>
);

// ── Main Quiz Component ────────────────────────────────────────────────────────
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
  gameType = "classic",
  onGameOver,
}) => {
  // Per-question timer (Classic & Sudden Death only)
  const [timeLeft, setTimeLeft] = useState(15);
  // Global countdown for Time Attack
  const [globalTime, setGlobalTime] = useState(TIME_ATTACK_DURATION);

  const [feedback, setFeedback] = useState(null); // { index, type }
  const [locked, setLocked] = useState(false);

  const isTimeAttack = gameType === "time_attack";
  const isSuddenDeath = gameType === "sudden_death";

  // Game-over conditions differ per mode
  const isOver =
    (isTimeAttack && (globalTime <= 0 || questionIndex >= questions.length)) ||
    (!isTimeAttack &&
      (questionIndex >= questions.length ||
        (isSuddenDeath ? mistakes >= 1 : mistakes >= 3)));

  // ─── Game Over Detection ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOver) onGameOver();
  }, [isOver, onGameOver]);

  // ─── Global Timer (Time Attack only) ─────────────────────────────────────
  useEffect(() => {
    if (!isTimeAttack || isOver) return;
    if (globalTime <= 0) return;

    const timer = setInterval(() => {
      setGlobalTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [globalTime, isTimeAttack, isOver]);

  // ─── Per-Question Timer (Classic & Sudden Death) ──────────────────────────
  useEffect(() => {
    if (isTimeAttack || isOver || locked) return;

    if (timeLeft === 0) {
      handleWrongAnswer(-1); // -1 = timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimeAttack, isOver, locked]);

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
        if (!isTimeAttack) setTimeLeft(15); // reset per-question timer only for non-TA
        setQuestionIndex((prev) => prev + 1);
      }, 400);
    },
    [streak, highestStreak, isTimeAttack, setScore, setStreak, setHighestStreak, setQuestionIndex]
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
        if (!isTimeAttack) setTimeLeft(15);
        setQuestionIndex((prev) => prev + 1);
      }, 500);
    },
    [isTimeAttack, setWrong, setStreak, setQuestionIndex]
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

  // Accent color based on game type
  const accentColor = isTimeAttack
    ? "var(--led-blue)"
    : isSuddenDeath
    ? "var(--nba-red)"
    : "var(--nba-orange)";

  const questionBorderColor = isTimeAttack
    ? "var(--led-blue)"
    : isSuddenDeath
    ? "var(--nba-red)"
    : "var(--nba-orange)";

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
      {/* ── Top Row ─────────────────────────────────────────────────────── */}
      {isTimeAttack ? (
        // Time Attack: Full-width global countdown bar
        <GlobalCountdownBar timeLeft={globalTime} maxTime={TIME_ATTACK_DURATION} />
      ) : (
        // Classic / Sudden Death: Shot-clock ring + Question counter
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
      )}

      {/* Time Attack: Question counter (separate row) */}
      {isTimeAttack && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
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
              <span style={{ fontSize: "24px", color: "var(--chalk-dim)", marginLeft: "4px" }}>
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
      )}

      {/* Sudden Death warning badge */}
      {isSuddenDeath && <SuddenDeathIndicator />}

      {/* LED divider */}
      <div
        className="led-divider"
        style={{
          margin: 0,
          width: "100%",
          background: `linear-gradient(90deg, transparent 0%, ${questionBorderColor} 30%, ${questionBorderColor} 70%, transparent 100%)`,
        }}
      />

      {/* ── Question Panel ─────────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          padding: "28px 32px",
          background: "var(--court-surface)",
          border: "1px solid var(--surface-rim)",
          borderLeft: `4px solid ${questionBorderColor}`,
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
            color: isSuddenDeath
              ? "rgba(200, 16, 46, 0.05)"
              : isTimeAttack
              ? "rgba(0, 180, 216, 0.05)"
              : "rgba(248, 115, 32, 0.04)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {isSuddenDeath ? "💀" : "?"}
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
              style={
                // Tint prefix color to match mode accent when not in feedback state
                !feedbackClass
                  ? { "--mode-accent": accentColor }
                  : undefined
              }
            >
              <span
                className="btn-answer__prefix"
                style={!feedbackClass ? { color: accentColor } : undefined}
              >
                {ANSWER_LABELS[i]}
              </span>
              <span className="btn-answer__text">{choice}</span>
              <span className="btn-answer__letter" aria-hidden="true">
                {ANSWER_LABELS[i]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Bottom Badges ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {/* Streak badge */}
        {streak >= 3 && (
          <div className="badge badge--fire" style={{ alignSelf: "flex-start" }}>
            🔥 {streak} answer streak
          </div>
        )}

        {/* Time Attack: score-so-far badge */}
        {isTimeAttack && (
          <div
            className="badge"
            style={{
              background: "rgba(0, 180, 216, 0.1)",
              color: "var(--led-blue)",
              border: "1px solid rgba(0, 180, 216, 0.3)",
              marginLeft: "auto",
            }}
          >
            ✅ {score} correct
          </div>
        )}
      </div>
    </main>
  );
};
