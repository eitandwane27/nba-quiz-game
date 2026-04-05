# 🏀 Hardwood IQ — Project Progress

> **The Ultimate NBA Quiz** — A fully client-side React quiz game with multiple game modes, era selection, and a polished scoreboard-inspired design system.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [App State Machine (App.jsx)](#app-state-machine-appjsx)
3. [Components](#components)
   - [GameHeader](#gamheaderjsx)
   - [ModeSelector](#modeselectorjsx)
   - [GameTypeSelector](#gametypeselectorjsx)
   - [Quiz](#quizjsx)
   - [TimerRing](#timerringjsx)
4. [Game Modes](#game-modes)
5. [Data & Services](#data--services)
6. [Design System](#design-system)

---

## Project Overview

**Hardwood IQ** is a React + Vite NBA trivia game. Players answer multiple-choice questions about NBA players sourced from **local static JSON files** (no external API). The app supports three eras and three distinct game modes with different win/loss conditions.

**Tech Stack:** React 18 · Vite · Vanilla CSS (custom design tokens)

---

## App State Machine (`App.jsx`)

`App.jsx` is the root orchestrator. It manages a linear state machine using a single `gameState` string:

```
menu → mode_select → game_type_select → loading → playing → game_over
```

### State Values

| State              | Description                                        |
| ------------------ | -------------------------------------------------- |
| `menu`             | Landing screen with the "ENTER COURT" CTA          |
| `mode_select`      | Era picker (`ModeSelector`)                        |
| `game_type_select` | Game mode picker (`GameTypeSelector`)              |
| `loading`          | Async question fetch (shows "Scouting Players...") |
| `playing`          | Active quiz (`Quiz` component)                     |
| `game_over`        | Final stats screen with mode-aware messaging       |

### Key State Variables

| Variable        | Type   | Purpose                                            |
| --------------- | ------ | -------------------------------------------------- |
| `gameMode`      | string | `'legends'` \| `'modern'` \| `'random'`            |
| `gameType`      | string | `'classic'` \| `'time_attack'` \| `'sudden_death'` |
| `score`         | number | Correct answers this session                       |
| `wrong`         | number | Mistakes made this session                         |
| `streak`        | number | Current consecutive correct streak                 |
| `highestStreak` | number | Best streak for the session                        |
| `questions`     | array  | Fetched question objects                           |
| `questionIndex` | number | Pointer into the questions array                   |

### Question Fetching Logic

- **Time Attack** → fetches **100 questions** (needs a large pool for the 60s window)
- **Classic / Sudden Death** → fetches **10 questions**

### Game Over Screen

The game over screen is **mode-aware**:

- `time_attack` → "Times Up!" in blue
- `sudden_death` → "💀 Eliminated" in red
- `classic` → "Buzzer Beater" in red

The **Errors** stat block is **hidden for Time Attack** (no lives concept). The score label changes to "Questions Answered" for Time Attack.

---

## Components

### `GameHeader.jsx`

**Fixed sticky HUD** strip at the top of every screen.

- **Left:** "NBA | TRIVIA" logo text in Bebas Neue
- **Right:** Live stat blocks — only visible during `gameState === 'playing'`

#### Live Stat Blocks (playing only)

| Block      | Always shown       | Notes                                                                     |
| ---------- | ------------------ | ------------------------------------------------------------------------- |
| Score      | ✅                 | Orange accent                                                             |
| Streak 🔥  | ✅                 | Turns gold when streak ≥ 3, blue otherwise                                |
| Lives/Life | ❌ for Time Attack | Shows `❤️` hearts; **1 heart** for Sudden Death, **3 hearts** for Classic |

> **Sudden Death** enforces exactly **1 heart** in the UI. Hearts dim (opacity 0.15) as mistakes accumulate.

---

### `ModeSelector.jsx`

**Era selection screen.** Players choose the player pool before picking a game type.

#### Era Cards (grid layout, 2 columns)

| Mode ID   | Label       | Year Stamp  | Tagline                       | Accent   |
| --------- | ----------- | ----------- | ----------------------------- | -------- |
| `legends` | Legends Era | `'84 — '10` | Jordan · Kobe · Shaq · Bird   | Gold     |
| `modern`  | Modern Era  | `'11 — Now` | LeBron · Steph · Jokic · Luka | LED Blue |

#### Hard Mode Entry Point

Below the era grid is a special **"◈ ELITE JOURNEYMAN DRAFT — HARD MODE"** ghost button:

- Styled in **NBA Red**
- Sets `gameMode = 'random'` and advances to `game_type_select`
- Represents the hardest player pool (mixed eras, journeyman players)

#### Sub-Component: `EraCard`

Each era card has:

- Top **accent strip** (3px, lights up on hover)
- **Year watermark** (oversized, renders behind text, lights up on hover)
- **Tagline** (monospace, player names)
- **Label** (display font)
- **"Select →"** CTA with animated arrow

---

### `GameTypeSelector.jsx`

**Game mode picker screen.** Rendered after the era is chosen, shows the selected era label as context.

#### Game Type Cards (vertical list)

| ID             | Label        | Tagline                       | Icon | Accent     |
| -------------- | ------------ | ----------------------------- | ---- | ---------- |
| `classic`      | Classic      | 3 lives. Pure hoops.          | 🏀   | NBA Orange |
| `time_attack`  | Time Attack  | 60 seconds. Clock is ticking. | ⚡   | LED Blue   |
| `sudden_death` | Sudden Death | One wrong. Game over.         | 💀   | NBA Red    |

Each card features:

- **Left accent bar** (vertical, 3px) that lights up on hover
- **Large watermark icon** (72px, subtle opacity) in the background
- Mode label in display font + tagline in monospace
- Full card hover: tinted background + glow shadow + slight Y-lift

Has a **"← Back to Era"** ghost button to return to `ModeSelector`.

---

### `Quiz.jsx`

The **core gameplay component.** Handles all question rendering, answer processing, timer logic, and game-over detection.

#### Props

| Prop                                 | Type      | Purpose                                            |
| ------------------------------------ | --------- | -------------------------------------------------- |
| `questions`                          | array     | The question pool                                  |
| `questionIndex`                      | number    | Current question pointer                           |
| `setQuestionIndex`                   | fn        | Advance to next question                           |
| `score`                              | number    | Live score                                         |
| `setScore`                           | fn        | Increment score                                    |
| `mistakes`                           | number    | Wrong answer count                                 |
| `setWrong`                           | fn        | Increment mistakes                                 |
| `streak` / `setStreak`               | number/fn | Current streak                                     |
| `highestStreak` / `setHighestStreak` | number/fn | Best streak                                        |
| `gameType`                           | string    | `'classic'` \| `'time_attack'` \| `'sudden_death'` |
| `onGameOver`                         | fn        | Callback to transition `App` to `game_over`        |

#### Timer Logic

**Per-question timer** (Classic & Sudden Death only):

- 15 seconds per question
- Timeout triggers `handleWrongAnswer(-1)` (index -1 = timeout)
- Timer resets on each question advance

**Global countdown** (Time Attack only):

- 60-second global clock
- Counts down independently of question navigation
- When it hits 0 → game over

#### Game-Over Conditions

| Mode         | Condition                                        |
| ------------ | ------------------------------------------------ |
| Classic      | `mistakes >= 3` OR all questions exhausted       |
| Sudden Death | `mistakes >= 1` OR all questions exhausted       |
| Time Attack  | `globalTime <= 0` OR all 100 questions exhausted |

#### Answer Feedback

- **Correct:** Button flashes green (`btn-answer--correct`), 400ms delay, then advances
- **Wrong:** Button flashes red (`btn-answer--wrong`), 500ms delay, then advances
- All buttons **lock** (`disabled`) during feedback window

#### Mode-Specific UI

- **Time Attack:** Shows `GlobalCountdownBar` (full-width progress bar with color urgency states) instead of `TimerRing`
- **Sudden Death:** Shows `SuddenDeathIndicator` badge ("💀 Sudden Death — One Wrong & It's Over")
- **Accent colors** per mode: Orange (Classic) · Blue (Time Attack) · Red (Sudden Death)
- Question panel **left border** and answer prefix letters change color per mode

#### Sub-Components (internal)

**`GlobalCountdownBar`**

- Shows "⏱ Time Attack" label + large seconds counter
- Bar color shifts: Blue → Amber (≤15s) → Red (≤8s)
- Matching glow on bar and number

**`SuddenDeathIndicator`**

- Pill badge: `💀 Sudden Death — One Wrong & It's Over`
- Red border, subtle red background

---

### `TimerRing.jsx`

**SVG shot-clock ring** used in Classic and Sudden Death modes.

- 120×120px SVG with a depleting arc (stroke-dashoffset animation)
- Color shifts as urgency builds:
  - `> 8s` → **NBA Orange** `#f87320`
  - `5–8s` → **Amber** `#f59e0b`
  - `≤ 4s` → **NBA Red** `#c8102e`
- Center displays the countdown number in Bebas Neue
- Smooth 0.9s linear transition on the arc

---

## Game Modes

| Mode             | Lives        | Timer            | Pool Size | End Condition                    |
| ---------------- | ------------ | ---------------- | --------- | -------------------------------- |
| **Classic**      | 3 ❤️❤️❤️     | 15s per question | 10        | 3 mistakes OR out of questions   |
| **Time Attack**  | ∞ (no lives) | 60s global       | 100       | Timer hits 0 OR out of questions |
| **Sudden Death** | 1 ❤️         | 15s per question | 10        | 1 mistake OR out of questions    |

---

## Data & Services

### Player Pools (`src/data/`)

| File             | Era         | Notes                                          |
| ---------------- | ----------- | ---------------------------------------------- |
| `legends.json`   | `'84 – '10` | Legends-era players (Jordan, Kobe, Shaq, etc.) |
| `hard-mode.json` | Mixed       | Elite Journeyman pool — toughest player set    |

> Modern era player data is also part of the pool (handled by `quizService.js`).

### `quizService.js` (`src/services/`)

- `fetchDynamicQuestions(count, gameMode)` — main entry point called by `App.jsx`
- Loads the appropriate JSON based on `gameMode` (`legends`, `modern`, `random`)
- Generates multiple-choice question objects with distractors
- Returns a shuffled array of question objects shaped as:
  ```js
  { question: string, choices: string[], answer: string }
  ```

---

## Design System

The app uses a custom CSS design token system (`index.css`) with an NBA scoreboard aesthetic:

### Color Tokens

| Token                   | Usage                          |
| ----------------------- | ------------------------------ |
| `--nba-orange`          | Primary accent, Classic mode   |
| `--nba-red`             | Errors, Sudden Death mode      |
| `--led-blue`            | Time Attack mode               |
| `--gold` / `--gold-dim` | Streak highlights, Legends era |
| `--chalk-white`         | Primary text                   |
| `--chalk-dim`           | Secondary/muted text           |

### Typography

| Token            | Font       | Usage                           |
| ---------------- | ---------- | ------------------------------- |
| `--font-display` | Bebas Neue | Headings, scores, large numbers |
| `--font-mono`    | DM Mono    | Labels, taglines, metadata      |
| Body             | Inter      | General text                    |

### Key CSS Classes

| Class                               | Description                                           |
| ----------------------------------- | ----------------------------------------------------- |
| `.panel-rise`                       | Fade-in + slide-up entrance animation for main panels |
| `.stat-block`                       | Small scoreboard tile (label + value)                 |
| `.stat-block--orange/red/blue/gold` | Color variants of stat tiles                          |
| `.btn-primary`                      | Large orange CTA button                               |
| `.btn-ghost`                        | Transparent bordered button                           |
| `.btn-answer`                       | Multiple-choice answer button                         |
| `.btn-answer--correct`              | Green flash feedback state                            |
| `.btn-answer--wrong`                | Red flash feedback state                              |
| `.led-divider`                      | Horizontal orange gradient rule                       |
| `.badge`                            | Small inline badge (e.g., streak fire badge)          |
| `.badge--fire`                      | Orange fire streak badge                              |
