import React from "react";

/**
 * TimerRing — SVG shot-clock ring.
 * The single most iconic element: a depleting arc around a countdown number,
 * shifting from orange → amber → red as urgency builds.
 */
export const TimerRing = ({ timeLeft, maxTime = 15 }) => {
  const size = 120;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = timeLeft / maxTime;
  const offset = circumference * (1 - ratio);

  // Color logic: orange → amber → red
  let ringColor = "#f87320"; // nba-orange
  let glowColor = "rgba(248, 115, 32, 0.4)";
  if (timeLeft <= 8 && timeLeft > 4) {
    ringColor = "#f59e0b"; // amber
    glowColor = "rgba(245, 158, 11, 0.4)";
  }
  if (timeLeft <= 4) {
    ringColor = "#c8102e"; // nba-red
    glowColor = "rgba(200, 16, 46, 0.5)";
  }

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        {/* Track ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* Depleting arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.9s linear, stroke 0.3s ease",
            filter: `drop-shadow(0 0 6px ${glowColor})`,
          }}
        />
      </svg>

      {/* Countdown number in center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: timeLeft >= 10 ? "36px" : "42px",
            lineHeight: 1,
            color: ringColor,
            transition: "color 0.3s ease, font-size 0.1s ease",
          }}
        >
          {timeLeft}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(245, 240, 232, 0.4)",
          }}
        >
          SEC
        </span>
      </div>
    </div>
  );
};
