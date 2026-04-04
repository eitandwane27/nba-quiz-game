import { useState } from "react";

/**
 * ModeSelector — Pre-game screen where the user picks their era.
 *
 * Aesthetic Anchor: Two massive, asymmetric era cards with a year-stamp
 * watermark and a single sharp accent strip, so each card reads as a
 * scoreboard era tag, not a generic product card.
 */
export function ModeSelector({ onModeSelect }) {
  const [hovered, setHovered] = useState(null); // 'legends' | 'modern' | 'random'

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
        maxWidth: "820px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* ── Header ── */}
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 9vw, 96px)",
            color: "var(--chalk-white)",
            lineHeight: 0.9,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          Choose Your
          <br />
          <span style={{ color: "var(--nba-orange)" }}>Era</span>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: "0.22em",
            color: "var(--chalk-dim)",
            textTransform: "uppercase",
            marginTop: "var(--space-md)",
          }}
        >
          Select your player pool to begin
        </p>
      </div>

      {/* ── Era Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-md)",
          width: "100%",
        }}
      >
        <EraCard
          mode="legends"
          label="Legends Era"
          yearStamp="'84 — '10"
          tagline="Jordan · Kobe · Shaq · Bird"
          accentColor="var(--gold)"
          accentDim="var(--gold-dim)"
          hovered={hovered}
          setHovered={setHovered}
          onModeSelect={onModeSelect}
        />
        <EraCard
          mode="modern"
          label="Modern Era"
          yearStamp="'11 — Now"
          tagline="LeBron · Steph · Jokic · Luka"
          accentColor="var(--led-blue)"
          accentDim="rgba(0,180,216,0.25)"
          hovered={hovered}
          setHovered={setHovered}
          onModeSelect={onModeSelect}
        />
      </div>

      {/* ── Divider ── */}
      <div className="led-divider" style={{ width: "100%", maxWidth: "300px" }} />

      {/* ── Random Mode (ghost) ── */}
      <button
        id="mode-random"
        className="btn-ghost"
        onClick={() => onModeSelect("random")}
        style={{ fontSize: "12px", letterSpacing: "0.18em", opacity: 0.7 }}
      >
        ◈ RANDOM DRAFT — FULL ROSTER
      </button>
    </main>
  );
}

// ─── Era Card Sub-Component ───────────────────────────────────────────────────

function EraCard({ mode, label, yearStamp, tagline, accentColor, accentDim, hovered, setHovered, onModeSelect }) {
  const isHovered = hovered === mode;

  return (
    <button
      id={`mode-${mode}`}
      onClick={() => onModeSelect(mode)}
      onMouseEnter={() => setHovered(mode)}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "var(--space-lg)",
        paddingTop: "var(--space-3xl)",
        background: isHovered ? "var(--surface-lift)" : "var(--surface-rim)",
        border: `1px solid ${isHovered ? accentColor : "rgba(255,255,255,0.07)"}`,
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        overflow: "hidden",
        textAlign: "left",
        transition: "background 0.2s ease, border-color 0.2s ease, transform 0.15s var(--ease-snap), box-shadow 0.2s ease",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: isHovered ? `0 12px 40px ${accentDim}` : "none",
        // ensure no default button styles bleed through
        fontFamily: "inherit",
        color: "inherit",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",
      }}
    >
      {/* Accent strip — top edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: isHovered ? accentColor : "rgba(255,255,255,0.08)",
          transition: "background 0.2s ease",
        }}
      />

      {/* Year watermark — oversized, sits behind text */}
      <div
        style={{
          position: "absolute",
          top: "var(--space-md)",
          right: "var(--space-sm)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 6vw, 56px)",
          color: isHovered ? accentColor : "rgba(255,255,255,0.05)",
          lineHeight: 1,
          letterSpacing: "0.04em",
          transition: "color 0.2s ease",
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {yearStamp}
      </div>

      {/* Card content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.2em",
            color: isHovered ? accentColor : "var(--chalk-dim)",
            textTransform: "uppercase",
            marginBottom: "var(--space-xs)",
            transition: "color 0.2s ease",
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 4vw, 36px)",
            color: "var(--chalk-white)",
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </div>
      </div>

      {/* CTA row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-xs)",
          marginTop: "var(--space-md)",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: isHovered ? accentColor : "var(--chalk-dim)",
          transition: "color 0.2s ease",
        }}
      >
        <span>Select</span>
        <span
          style={{
            display: "inline-block",
            transform: isHovered ? "translateX(4px)" : "translateX(0)",
            transition: "transform 0.15s var(--ease-snap)",
          }}
        >
          →
        </span>
      </div>
    </button>
  );
}
