import { useState } from "react";

const GAME_TYPES = [
  {
    id: "classic",
    label: "Classic",
    tagline: "3 lives. Pure hoops.",
    description: "Three strikes and you're out. Answer as many as you can before the buzzer.",
    icon: "🏀",
    accentColor: "var(--nba-orange)",
    accentDim: "rgba(248, 115, 32, 0.08)",
    borderHover: "rgba(248, 115, 32, 0.4)",
    glowColor: "rgba(248, 115, 32, 0.25)",
    labelColor: "var(--nba-orange)",
  },
  {
    id: "time_attack",
    label: "Time Attack",
    tagline: "60 seconds. Clock is ticking.",
    description: "One global countdown. Answer as many questions as possible before time runs out.",
    icon: "⚡",
    accentColor: "var(--led-blue)",
    accentDim: "rgba(0, 180, 216, 0.08)",
    borderHover: "rgba(0, 180, 216, 0.4)",
    glowColor: "rgba(0, 180, 216, 0.25)",
    labelColor: "var(--led-blue)",
  },
  {
    id: "sudden_death",
    label: "Sudden Death",
    tagline: "One wrong. Game over.",
    description: "No mercy. No second chances. One mistake ends your run.",
    icon: "💀",
    accentColor: "var(--nba-red)",
    accentDim: "rgba(200, 16, 46, 0.08)",
    borderHover: "rgba(200, 16, 46, 0.5)",
    glowColor: "rgba(200, 16, 46, 0.3)",
    labelColor: "var(--nba-red)",
  },
];

const ERA_LABELS = {
  legends: "Legends",
  modern: "Modern Era",
  random: "Elite Journeyman",
};

export function GameTypeSelector({ gameMode, onGameTypeSelect, onBack }) {
  const [hovered, setHovered] = useState(null);

  return (
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
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "var(--chalk-dim)",
            textTransform: "uppercase",
            marginBottom: "var(--space-sm)",
          }}
        >
          Era: {ERA_LABELS[gameMode] ?? gameMode}
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 8vw, 72px)",
            color: "var(--chalk-white)",
            lineHeight: 0.9,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          Pick Your
          <br />
          <span style={{ color: "var(--nba-orange)" }}>Mode</span>
        </h2>
      </div>

      <div className="led-divider" style={{ width: "100%", maxWidth: "300px" }} />

      {/* Mode Cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-md)",
          width: "100%",
        }}
      >
        {GAME_TYPES.map((type) => {
          const isHovered = hovered === type.id;
          return (
            <button
              key={type.id}
              id={`btn-game-type-${type.id}`}
              onClick={() => onGameTypeSelect(type.id)}
              onMouseEnter={() => setHovered(type.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-lg)",
                width: "100%",
                padding: "var(--space-lg)",
                background: isHovered ? type.accentDim : "var(--surface-rim)",
                border: `1px solid ${isHovered ? type.borderHover : "rgba(255,255,255,0.07)"}`,
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s var(--ease-snap)",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                boxShadow: isHovered ? `0 8px 32px ${type.glowColor}` : "none",
                overflow: "hidden",
              }}
            >
              {/* Watermark icon */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: "var(--space-lg)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "72px",
                  lineHeight: 1,
                  opacity: isHovered ? 0.12 : 0.05,
                  transition: "opacity 0.2s ease",
                  pointerEvents: "none",
                  userSelect: "none",
                  filter: "grayscale(0.3)",
                }}
              >
                {type.icon}
              </span>

              {/* Left accent bar */}
              <div
                style={{
                  width: "3px",
                  alignSelf: "stretch",
                  borderRadius: "2px",
                  background: isHovered ? type.accentColor : "rgba(255,255,255,0.06)",
                  flexShrink: 0,
                  transition: "background 0.2s ease",
                }}
              />

              {/* Text content */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-md)" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "32px",
                      lineHeight: 1,
                      color: isHovered ? type.labelColor : "var(--chalk-white)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {type.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: isHovered ? type.accentColor : "var(--chalk-dim)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {type.tagline}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: "var(--chalk-dim)",
                    lineHeight: 1.5,
                    maxWidth: "480px",
                  }}
                >
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Back link */}
      <button
        id="btn-game-type-back"
        className="btn-ghost"
        onClick={onBack}
        style={{ marginTop: "var(--space-sm)" }}
      >
        ← Back to Era
      </button>
    </main>
  );
}
