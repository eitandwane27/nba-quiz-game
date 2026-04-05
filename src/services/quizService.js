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

// ─── Question Builder ─────────────────────────────────────────────────────────

function buildQuestions(selectedPlayers, allTeams) {
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
        era: player.era
      }
    };
  });
}
