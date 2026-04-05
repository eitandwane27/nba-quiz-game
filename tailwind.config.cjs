/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "nba-orange": "#f87320",
        "nba-red": "#c8102e",
        "court-black": "#0a0a0f",
        "court-surface": "#111118",
        "led-blue": "#00b4d8",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "Impact", "sans-serif"],
        mono: ['"DM Mono"', "Courier New", "monospace"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss-animate"),
  ],
};
