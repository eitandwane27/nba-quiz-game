import React from "react";

/**
 * GameHeader — Fixed scoreboard HUD strip.
 * Left: Logo/Title in Bebas Neue.
 * Right: Stat blocks — Score, Streak, Mistakes — styled as LED scoreboard panels.
 */
export const GameHeader = ({ score, mistakes, streak, gameState }) => {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(16px, 4vw, 48px)",
        height: "64px",
        background: "rgba(17, 17, 24, 0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(248, 115, 32, 0.25)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "28px",
            color: "var(--nba-orange)",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          NBA
        </span>
        <span
          style={{
            width: "2px",
            height: "24px",
            background: "rgba(255,255,255,0.15)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "22px",
            color: "var(--chalk-white)",
            letterSpacing: "0.06em",
            lineHeight: 1,
          }}
        >
          TRIVIA
        </span>
      </div>

      {/* Live Stats — only shown while playing */}
      {gameState === "playing" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Score */}
          <div className="stat-block stat-block--orange">
            <span className="stat-block__label">Score</span>
            <span className="stat-block__value">{score}</span>
          </div>

          {/* Streak */}
          <div
            className={`stat-block ${streak >= 3 ? "stat-block--gold" : "stat-block--blue"}`}
          >
            <span className="stat-block__label">Streak 🔥</span>
            <span className="stat-block__value">{streak}</span>
          </div>

          {/* Mistakes */}
          <div className="stat-block stat-block--red">
            <span className="stat-block__label">Lives</span>
            <span
              className="stat-block__value"
              style={{ letterSpacing: "0.05em", fontSize: "20px" }}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    opacity: i < mistakes ? 0.15 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  ❤️
                </span>
              ))}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
