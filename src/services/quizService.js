import players from "../data/players.json";
import legends from "../data/legends.json";
import hardModePlayers from "../data/hard-mode.json";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

// ─── Mode-Aware Question Fetcher ──────────────────────────────────────────────

/**
 * @param {number} numQuestions - how many questions to generate
 * @param {'legends'|'modern'|'random'} mode - game mode
 */
export async function fetchDynamicQuestions(numQuestions = 4, mode = "random") {
  try {
    // ── Mode routing ─────────────────────────────────────────────────────────
    let pool = [];
    const allPlayers = [...players, ...legends, ...hardModePlayers];

    if (mode === "random") {
      pool = hardModePlayers;
    } else if (mode === "legends") {
      pool = legends;
    } else {
      // "modern" mode: use players list, filtering by era to be safe
      pool = players.filter((p) => p.era === "modern");
    }

    if (pool.length === 0) {
      throw new Error(`No players found for mode: ${mode}`);
    }

    const shuffledPool = shuffle(pool);
    const selected = shuffledPool.slice(0, Math.min(numQuestions, pool.length));
    
    // Get all unique teams from both files for distractors
    const allTeams = [...new Set(allPlayers.flatMap((p) => p.teams))];

    return buildQuestions(selected, allTeams);
  } catch (error) {
    console.error("Error generating questions:", error);
    return [
      {
        question: "Data Error: Who won the NBA Finals in 2023?",
        choices: ["Lakers", "Heat", "Nuggets", "Bucks"],
        answer: "Nuggets",
      },
    ];
  }
}

// ─── Classic Mode: Raw Player Pool Fetcher ────────────────────────────────────

/**
 * Returns a shuffled array of raw player objects for Classic mode.
 * All three phases (MCQ, FITB, Franchise Trail) operate on this same pool.
 * Phases 2 & 3 only use players with >=2 teams (sequencing needs options).
 *
 * @param {number} totalCount  - total players needed across all phases
 * @param {'legends'|'modern'|'random'} mode - game mode
 * @returns {{ mcqPlayers: Player[], fitbPlayers: Player[], trailPlayers: Player[], allTeams: string[] }}
 */
export async function fetchClassicPhaseData(totalCount = 18, mode = "random") {
  try {
    const allPlayers = [...players, ...legends, ...hardModePlayers];
    let pool = [];

    if (mode === "random") {
      pool = hardModePlayers;
    } else if (mode === "legends") {
      pool = legends;
    } else {
      pool = players.filter((p) => p.era === "modern");
    }

    if (pool.length === 0) throw new Error(`No players found for mode: ${mode}`);

    const allTeams = [...new Set(allPlayers.flatMap((p) => p.teams))];
    const shuffled = shuffle(pool);

    // Phase 3 (Franchise Trail) needs players with at least 2 teams to be meaningful
    const trailEligible = shuffled.filter((p) => p.teams.length >= 2);
    const trailPlayers = trailEligible.slice(0, 3);
    const trailNames = new Set(trailPlayers.map((p) => p.name));

    // Remaining pool (excluding trail players) is split between Phase 1 & 2
    const remaining = shuffled.filter((p) => !trailNames.has(p.name));
    const mcqPlayers = remaining.slice(0, 10);  // Phase 1: 10 MCQ
    const fitbPlayers = remaining.slice(10, 15); // Phase 2: 5 FITB

    return { mcqPlayers, fitbPlayers, trailPlayers, allTeams, playerPool: pool };
  } catch (error) {
    console.error("Error generating classic phase data:", error);
    return { mcqPlayers: [], fitbPlayers: [], trailPlayers: [], allTeams: [] };
  }
}

// ─── Question Builder ─────────────────────────────────────────────────────────

/**
 * Builds MCQ question objects from raw player data.
 * Exported so ClassicGame can build Phase 1 questions from the shared player pool.
 */
export function buildMcqFromPlayers(selectedPlayers, allTeams) {
  return selectedPlayers.map((player) => {
    // Pick one random team from the player's teams array as the "correct" answer
    const correctTeam = player.teams[Math.floor(Math.random() * player.teams.length)];

    // Pick 3 random unique teams that aren't *any* of the player's teams
    let wrongTeams = shuffle(allTeams.filter((t) => !player.teams.includes(t))).slice(0, 3);

    // Fallback if not enough teams (shouldn't happen with our curated list)
    while (wrongTeams.length < 3) {
      wrongTeams.push("Free Agent");
    }

    const choices = shuffle([correctTeam, ...wrongTeams]);

    return {
      question: `Which team did ${player.name} play for?`,
      choices,
      answer: correctTeam,
      metadata: {
        position: player.position,
        era: player.era,
      },
    };
  });
}

// Internal alias for existing callers within this file
function buildQuestions(selectedPlayers, allTeams) {
  return buildMcqFromPlayers(selectedPlayers, allTeams);
}
