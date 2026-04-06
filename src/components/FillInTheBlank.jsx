import { useState, useEffect, useRef } from "react";

/**
 * FillInTheBlank — Phase 2 of Classic mode.
 *
 * Shows a team clue. Player types the NBA player's name.
 * Case-insensitive, trims whitespace, accepts partial last-name match as fallback.
 *
 * Props:
 *   players      {Player[]} – array of { name, teams, position, era }
 *   playerIndex  {number}   – current index into players array
 *   score        {number}   – current score (read-only display)
 *   mistakes     {number}   – current mistakes (shared pool)
 *   maxMistakes  {number}   – 3 for Classic
 *   onCorrect    {fn}       – called on correct submission
 *   onWrong      {fn}       – called on wrong submission
 *   onPhaseEnd   {fn}       – called when all FITB players are exhausted
 */
export const FillInTheBlank = ({
  players,
  playerPool = [],
  playerIndex,
  score,
  mistakes,
  maxMistakes = 3,
  onCorrect,
  onWrong,
  onPhaseEnd,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong' | 'close'
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [locked, setLocked] = useState(false);
  const inputRef = useRef(null);

  const currentPlayer = players[playerIndex];

  // Focus input on each new player
  useEffect(() => {
    if (!locked) {
      inputRef.current?.focus();
    }
  }, [playerIndex, locked]);

  // Reset state on new question
  useEffect(() => {
    setInputValue("");
    setFeedback(null);
    setRevealAnswer(false);
    setLocked(false);
  }, [playerIndex]);

  if (!currentPlayer) return null;

  // ─── Answer Validation ──────────────────────────────────────────────────────
  const normalize = (str) => str.trim().toLowerCase().replace(/[.\-']/g, "");

  const checkAnswer = (raw) => {
    const input = normalize(raw);
    const correct = normalize(currentPlayer.name);

    // 1. First check against the "intended" correct player
    if (input === correct) return "correct";
    const lastName = normalize(currentPlayer.name.split(" ").pop());
    if (input.length >= 3 && input === lastName) return "correct";

    // 2. CURATION FIX: Check against the full pool for any player who fits the EXACT criteria shown
    // This handles cases like Durant vs Green where both fit "Warriors Forward"
    const alternateMatch = playerPool.find(p => {
      const pCurrentTeam = p.teams[p.teams.length - 1];
      const targetTeam = teamClue;
      
      // Check if this player fits the shown criteria:
      // a) Their current team matches the clue (or they played for it)
      // b) Their position matches
      // c) Their era matches
      const teamMatch = pCurrentTeam === targetTeam;
      const posMatch = p.position.split('/').some(pos => currentPlayer.position.includes(pos)) ||
                       currentPlayer.position.split('/').some(pos => p.position.includes(pos));
      const eraMatch = p.era === currentPlayer.era;

      if (teamMatch && posMatch && eraMatch) {
        const pFull = normalize(p.name);
        const pLast = normalize(p.name.split(" ").pop());
        return input === pFull || (input.length >= 3 && input === pLast);
      }
      return false;
    });

    if (alternateMatch) return "correct";

    return "wrong";
  };

  // ─── Submit Handler ──────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (locked || !inputValue.trim()) return;

    const result = checkAnswer(inputValue);
    const isLastPlayer = playerIndex + 1 >= players.length;
    setLocked(true);

    if (result === "correct") {
      setFeedback("correct");
      setTimeout(() => {
        onCorrect();
        if (isLastPlayer) onPhaseEnd();
      }, 700);
    } else {
      setFeedback("wrong");
      setRevealAnswer(true);
      setTimeout(() => {
        onWrong();
        if (isLastPlayer) onPhaseEnd();
      }, 1200);
    }
  };

  // ─── Accent ─────────────────────────────────────────────────────────────────
  const accentColor = "var(--led-blue)";
  const glowColor = "rgba(0, 180, 216, 0.35)";

  // Use the player's MOST RECENT team as the basis for the clue
  const teamClue = currentPlayer.teams[currentPlayer.teams.length - 1];

  // ─── Feedback Border Color ───────────────────────────────────────────────────
  const borderColor =
    feedback === "correct"
      ? "var(--nba-green)"
      : feedback === "wrong"
      ? "var(--nba-red)"
      : locked
      ? "rgba(255,255,255,0.15)"
      : accentColor;

  return (
    <main
      className="panel-rise"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "clamp(24px, 5vw, 64px) clamp(16px, 4vw, 48px)",
        gap: "28px",
        maxWidth: "760px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* ── Phase Header ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Phase indicator pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 12px",
            background: "rgba(0, 180, 216, 0.08)",
            border: "1px solid rgba(0, 180, 216, 0.25)",
            borderRadius: "100px",
          }}
        >
          <span style={{ fontSize: "14px" }}>✍️</span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: accentColor,
              fontWeight: 500,
            }}
          >
            Phase 2 — Fill in the Blank
          </span>
        </div>

        {/* Question counter */}
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "52px",
              lineHeight: 1,
              color: "var(--chalk-white)",
            }}
          >
            {playerIndex + 1}
            <span
              style={{
                fontSize: "24px",
                color: "var(--chalk-dim)",
                marginLeft: "4px",
              }}
            >
              / {players.length}
            </span>
          </span>
          <div
            style={{
              fontFamily: "var(--font-mono)",
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
      <div
        className="led-divider"
        style={{
          margin: 0,
          width: "100%",
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 30%, ${accentColor} 70%, transparent 100%)`,
        }}
      />

      {/* ── Clue Panel ─────────────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          padding: "28px 32px",
          background: "var(--court-surface)",
          border: "1px solid var(--surface-rim)",
          borderLeft: `4px solid ${accentColor}`,
          borderRadius: "var(--radius-lg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative watermark */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-display)",
            fontSize: "140px",
            color: "rgba(0, 180, 216, 0.04)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          ?
        </span>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--chalk-dim)",
            marginBottom: "12px",
          }}
        >
          This player suited up for
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 5vw, 44px)",
            letterSpacing: "0.03em",
            lineHeight: 1.1,
            color: accentColor,
            filter: `drop-shadow(0 0 12px ${glowColor})`,
            maxWidth: "80%",
            position: "relative",
          }}
        >
          {teamClue}
        </h2>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--chalk-dim)",
            marginTop: "10px",
          }}
        >
          Position: {currentPlayer.position} · Era:{" "}
          {currentPlayer.era === "legends" ? "Legends" : "Modern"}
        </div>
      </div>

      {/* ── Input Form ─────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div style={{ position: "relative" }}>
          <input
            ref={inputRef}
            id="fitb-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={locked}
            placeholder="Type the player's name..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            style={{
              width: "100%",
              padding: "18px 24px",
              background: "var(--court-surface)",
              border: `2px solid ${borderColor}`,
              borderRadius: "var(--radius-md)",
              color:
                feedback === "correct"
                  ? "var(--nba-green)"
                  : feedback === "wrong"
                  ? "var(--nba-red)"
                  : "var(--chalk-white)",
              fontFamily: "var(--font-mono)",
              fontSize: "18px",
              letterSpacing: "0.05em",
              outline: "none",
              transition: "border-color 0.2s ease, color 0.2s ease",
              boxShadow:
                feedback === "correct"
                  ? "0 0 16px rgba(22, 163, 74, 0.3)"
                  : feedback === "wrong"
                  ? "0 0 16px rgba(200, 16, 46, 0.3)"
                  : `0 0 0px transparent`,
            }}
          />

          {/* Inline feedback icon */}
          {feedback && (
            <span
              style={{
                position: "absolute",
                right: "18px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "22px",
                pointerEvents: "none",
                animation: "panel-rise 0.2s ease both",
              }}
            >
              {feedback === "correct" ? "✅" : "❌"}
            </span>
          )}
        </div>

        {/* Reveal correct answer after wrong */}
        {revealAnswer && (
          <div
            style={{
              padding: "10px 16px",
              background: "rgba(200, 16, 46, 0.08)",
              border: "1px solid rgba(200, 16, 46, 0.2)",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--chalk-dim)",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <span style={{ color: "var(--chalk-dim)" }}>Correct answer:</span>
            <span
              style={{
                color: "var(--chalk-white)",
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              {currentPlayer.name}
            </span>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={locked || !inputValue.trim()}
          style={{
            background: accentColor,
            boxShadow: `0 4px 24px ${glowColor}`,
            opacity: locked || !inputValue.trim() ? 0.45 : 1,
            cursor: locked || !inputValue.trim() ? "not-allowed" : "pointer",
            transition: "opacity 0.15s ease",
          }}
        >
          SUBMIT
        </button>
      </form>

      {/* ── Bottom hint ────────────────────────────────────────────────── */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--chalk-dim)",
          opacity: 0.6,
        }}
      >
        Last name accepted · Case insensitive
      </div>
    </main>
  );
};
