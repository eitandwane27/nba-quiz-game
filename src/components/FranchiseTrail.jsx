import { useState, useEffect } from "react";

/**
 * FranchiseTrail — Phase 3 of Classic mode.
 *
 * Given a player's name and position, the user taps their NBA teams
 * in chronological career order (Option A: click-to-sequence).
 *
 * Interaction model:
 *   - Teams are displayed as shuffled "source" tiles
 *   - Each tap moves the tile into the "sequence" slot in order
 *   - "Undo" removes any last-placed tile back to source
 *   - "Submit" locks the answer and evaluates it
 *
 * Props:
 *   players      {Player[]}  – array of { name, teams, position, era }
 *   playerIndex  {number}    – current index
 *   mistakes     {number}    – current shared mistake count
 *   maxMistakes  {number}    – 3
 *   onCorrect    {fn}        – called on correct submission
 *   onWrong      {fn}        – called on wrong submission
 *   onPhaseEnd   {fn}        – called when all trail players are exhausted
 */

function shuffle(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

export const FranchiseTrail = ({
  players,
  playerIndex,
  mistakes,
  maxMistakes = 3,
  onCorrect,
  onWrong,
  onPhaseEnd,
}) => {
  const currentPlayer = players[playerIndex];

  // Shuffled source tiles (teams not yet placed)
  const [sourceTiles, setSourceTiles] = useState([]);
  // The player's built sequence
  const [sequence, setSequence] = useState([]);
  // null | 'correct' | 'wrong'
  const [feedback, setFeedback] = useState(null);
  const [locked, setLocked] = useState(false);
  const [wrongPositions, setWrongPositions] = useState([]);

  // Reset on new player
  useEffect(() => {
    if (!currentPlayer) return;
    setSourceTiles(shuffle(currentPlayer.teams));
    setSequence([]);
    setFeedback(null);
    setLocked(false);
    setWrongPositions([]);
  }, [playerIndex]);

  if (!currentPlayer) return null;

  const totalTeams = currentPlayer.teams.length;
  const isComplete = sequence.length === totalTeams;

  // ─── Tile Interaction ──────────────────────────────────────────────────────
  const handleTilePick = (team) => {
    if (locked) return;
    setSourceTiles((prev) => prev.filter((t) => t !== team));
    setSequence((prev) => [...prev, team]);
  };

  const handleUndo = () => {
    if (locked || sequence.length === 0) return;
    const last = sequence[sequence.length - 1];
    setSequence((prev) => prev.slice(0, -1));
    setSourceTiles((prev) => [...prev, last]);
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!isComplete || locked) return;
    setLocked(true);

    const correctOrder = currentPlayer.teams;
    const isLastPlayer = playerIndex + 1 >= players.length;
    const wrong = sequence
      .map((team, i) => (team !== correctOrder[i] ? i : null))
      .filter((i) => i !== null);

    if (wrong.length === 0) {
      setFeedback("correct");
      setTimeout(() => {
        onCorrect();
        if (isLastPlayer) onPhaseEnd();
      }, 900);
    } else {
      setFeedback("wrong");
      setWrongPositions(wrong);
      setTimeout(() => {
        onWrong();
        if (isLastPlayer) onPhaseEnd();
      }, 1400);
    }
  };

  // ─── Styles ────────────────────────────────────────────────────────────────
  const accentColor = "var(--gold)";
  const glowColor = "rgba(255, 215, 0, 0.35)";

  const getTileStyle = (team, sequenceIndex = null) => {
    const isWrong = sequenceIndex !== null && wrongPositions.includes(sequenceIndex);
    const isCorrect = feedback === "correct" && sequenceIndex !== null;

    return {
      padding: "12px 18px",
      background: isCorrect
        ? "rgba(22, 163, 74, 0.15)"
        : isWrong
        ? "rgba(200, 16, 46, 0.15)"
        : "var(--surface-lift)",
      border: `1px solid ${
        isCorrect
          ? "var(--nba-green)"
          : isWrong
          ? "var(--nba-red)"
          : "rgba(255, 255, 255, 0.1)"
      }`,
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-mono)",
      fontSize: "13px",
      color: isCorrect
        ? "var(--nba-green)"
        : isWrong
        ? "var(--nba-red)"
        : "var(--chalk-white)",
      cursor: locked ? "default" : "pointer",
      transition: "all 0.2s ease",
      textAlign: "center",
      letterSpacing: "0.02em",
      userSelect: "none",
    };
  };

  return (
    <main
      className="panel-rise"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "clamp(24px, 5vw, 64px) clamp(16px, 4vw, 48px)",
        gap: "24px",
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
        {/* Phase pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 12px",
            background: "rgba(255, 215, 0, 0.08)",
            border: "1px solid rgba(255, 215, 0, 0.25)",
            borderRadius: "100px",
          }}
        >
          <span style={{ fontSize: "14px" }}>🗺️</span>
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
            Phase 3 — Franchise Trail
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
            <span style={{ fontSize: "24px", color: "var(--chalk-dim)", marginLeft: "4px" }}>
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
            Player
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

      {/* ── Player Identity Panel ───────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          padding: "24px 32px",
          background: "var(--court-surface)",
          border: "1px solid var(--surface-rim)",
          borderLeft: `4px solid ${accentColor}`,
          borderRadius: "var(--radius-lg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Watermark */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-display)",
            fontSize: "120px",
            color: "rgba(255, 215, 0, 0.04)",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          🗺️
        </span>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--chalk-dim)",
            marginBottom: "10px",
          }}
        >
          Rank their career stops in order
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 6vw, 54px)",
            letterSpacing: "0.03em",
            color: accentColor,
            filter: `drop-shadow(0 0 12px ${glowColor})`,
            lineHeight: 1,
            position: "relative",
          }}
        >
          {currentPlayer.name}
        </h2>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--chalk-dim)",
            marginTop: "8px",
          }}
        >
          Position: {currentPlayer.position}
        </div>
      </div>

      {/* ── Sequence Slots ──────────────────────────────────────────────── */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--chalk-dim)",
          }}
        >
          Your Sequence
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minHeight: `${totalTeams * 52}px`,
          }}
        >
          {Array.from({ length: totalTeams }).map((_, i) => {
            const placedTeam = sequence[i];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {/* Position number */}
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    color: placedTeam ? accentColor : "var(--surface-rim)",
                    minWidth: "32px",
                    transition: "color 0.2s ease",
                    filter: placedTeam ? `drop-shadow(0 0 6px ${glowColor})` : "none",
                  }}
                >
                  {i + 1}
                </span>

                {/* Tile or empty slot */}
                {placedTeam ? (
                  <div style={{ ...getTileStyle(placedTeam, i), flex: 1 }}>
                    {placedTeam}
                    {feedback === "correct" && (
                      <span style={{ marginLeft: "8px" }}>✅</span>
                    )}
                    {feedback === "wrong" && wrongPositions.includes(i) && (
                      <span style={{ marginLeft: "8px" }}>❌</span>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      padding: "12px 18px",
                      background: "transparent",
                      border: "1px dashed var(--surface-rim)",
                      borderRadius: "var(--radius-md)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      color: "var(--surface-lift)",
                      textTransform: "uppercase",
                    }}
                  >
                    — Tap a team below —
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Source Tiles ────────────────────────────────────────────────── */}
      {sourceTiles.length > 0 && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--chalk-dim)",
            }}
          >
            Available Teams
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {sourceTiles.map((team) => (
              <button
                key={team}
                onClick={() => handleTilePick(team)}
                disabled={locked}
                style={{
                  ...getTileStyle(team),
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  background: "rgba(255, 215, 0, 0.05)",
                  color: "var(--chalk-white)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  padding: "10px 16px",
                  borderRadius: "var(--radius-md)",
                  cursor: locked ? "not-allowed" : "pointer",
                  transition: "all 0.15s ease",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  if (!locked) {
                    e.currentTarget.style.background = "rgba(255, 215, 0, 0.12)";
                    e.currentTarget.style.borderColor = accentColor;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!locked) {
                    e.currentTarget.style.background = "rgba(255, 215, 0, 0.05)";
                    e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {team}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Reveal correct order after wrong ───────────────────────────── */}
      {feedback === "wrong" && (
        <div
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "rgba(200, 16, 46, 0.08)",
            border: "1px solid rgba(200, 16, 46, 0.2)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--chalk-dim)",
            }}
          >
            Correct career order
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
            {currentPlayer.teams.map((team, i) => (
              <span
                key={team}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "var(--chalk-white)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    color: accentColor,
                  }}
                >
                  {i + 1}.
                </span>
                {team}
                {i < currentPlayer.teams.length - 1 && (
                  <span style={{ color: "var(--chalk-dim)", marginLeft: "2px" }}>→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Action Buttons ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        {/* Undo */}
        {sequence.length > 0 && !locked && (
          <button
            className="btn-ghost"
            onClick={handleUndo}
            style={{ alignSelf: "center" }}
          >
            ← Undo
          </button>
        )}

        {/* Submit */}
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!isComplete || locked}
          style={{
            background: accentColor,
            color: "var(--court-black)",
            boxShadow: `0 4px 24px ${glowColor}`,
            opacity: !isComplete || locked ? 0.45 : 1,
            cursor: !isComplete || locked ? "not-allowed" : "pointer",
            transition: "opacity 0.15s ease",
          }}
        >
          {isComplete ? "LOCK IT IN" : `${sequence.length} / ${totalTeams}`}
        </button>
      </div>
    </main>
  );
};
