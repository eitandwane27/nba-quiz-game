import { useEffect, useState } from "react";

/**
 * PhaseTransition — Full-screen interstitial between Classic mode phases.
 * Shows phase number, title, description, and auto-advances after a delay.
 *
 * Props:
 *   phase       {number}   – incoming phase number (2 or 3)
 *   onComplete  {fn}       – called when transition ends
 */

const PHASE_CONFIG = {
  2: {
    number: "02",
    label: "Phase 2",
    title: "Fill in the Blank",
    subtitle: "No hints. Just memory.",
    description: "Type the player's name based on a team clue. Watch your spelling.",
    icon: "✍️",
    accentColor: "var(--led-blue)",
    glowColor: "rgba(0, 180, 216, 0.35)",
  },
  3: {
    number: "03",
    label: "Phase 3",
    title: "Franchise Trail",
    subtitle: "Know their journey.",
    description: "Tap their NBA stops in career order — first team to last.",
    icon: "🗺️",
    accentColor: "var(--gold)",
    glowColor: "rgba(255, 215, 0, 0.35)",
  },
};

const COUNTDOWN_DURATION = 2800; // ms

export const PhaseTransition = ({ phase, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const config = PHASE_CONFIG[phase];

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / COUNTDOWN_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        onComplete();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!config) return null;

  return (
    <main
      className="panel-rise"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(24px, 5vw, 64px)",
        gap: "32px",
        maxWidth: "760px",
        margin: "0 auto",
        width: "100%",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Phase badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          border: `1px solid ${config.accentColor}`,
          borderRadius: "100px",
          opacity: 0.7,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: config.accentColor,
          }}
        >
          {config.label} Unlocked
        </span>
      </div>

      {/* Big icon */}
      <div style={{ fontSize: "72px", lineHeight: 1 }}>{config.icon}</div>

      {/* Title block */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 10vw, 80px)",
            color: config.accentColor,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight: 1,
            filter: `drop-shadow(0 0 24px ${config.glowColor})`,
          }}
        >
          {config.title}
        </h2>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--chalk-dim)",
          }}
        >
          {config.subtitle}
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "14px",
          color: "var(--chalk-dim)",
          maxWidth: "360px",
          lineHeight: 1.6,
        }}
      >
        {config.description}
      </p>

      {/* LED divider */}
      <div
        className="led-divider"
        style={{
          width: "100%",
          maxWidth: "300px",
          background: `linear-gradient(90deg, transparent 0%, ${config.accentColor} 30%, ${config.accentColor} 70%, transparent 100%)`,
        }}
      />

      {/* Auto-advance progress bar */}
      <div style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div
          style={{
            width: "100%",
            height: "3px",
            background: "var(--surface-rim)",
            borderRadius: "100px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: config.accentColor,
              borderRadius: "100px",
              transition: "background 0.3s ease",
              boxShadow: `0 0 8px ${config.glowColor}`,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--chalk-dim)",
            textAlign: "center",
          }}
        >
          Starting in a moment...
        </span>
      </div>
    </main>
  );
};
