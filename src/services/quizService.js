const API_URL = "https://api.balldontlie.io/v1";
const API_KEY = import.meta.env.VITE_BALLDONTLIE_API_KEY;

export async function fetchDynamicQuestions(numQuestions = 4, attempt = 1) {
  try {
    if (!API_KEY) {
      throw new Error("Missing VITE_BALLDONTLIE_API_KEY. Check your .env file.");
    }

    // Lower the max random cursor so we are more likely to hit active players with teams
    // First 1000 IDs are usually more well-known or have complete data
    const maxCursor = attempt === 1 ? 1000 : 0; 
    const randomCursor = Math.floor(Math.random() * maxCursor); 

    const response = await fetch(`${API_URL}/players?per_page=100&cursor=${randomCursor}`, {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch players from balldontlie API.");
    }

    const json = await response.json();
    const players = json.data.filter((p) => p.team && p.team.full_name); 

    if (players.length < numQuestions) {
      if (attempt === 1) {
         // Retry one time with cursor=0 (guarantees players)
         return fetchDynamicQuestions(numQuestions, 2);
      }
      throw new Error("Not enough players returned, try again.");
    }

    // Shuffle the players so we get random ones
    const shuffledPlayers = players.sort(() => 0.5 - Math.random());
    const selectedPlayers = shuffledPlayers.slice(0, numQuestions);

    // Get a unique list of all teams from the fetched players to generate fake answers
    const allTeams = [...new Set(players.map((p) => p.team.full_name))];

    const questions = selectedPlayers.map((player) => {
      const correctTeam = player.team.full_name;

      // Filter out the correct team from our list of dummy answers
      let wrongTeams = allTeams.filter((t) => t !== correctTeam);
      
      // Shuffle wrong teams and pick 3
      wrongTeams = wrongTeams.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      // If the API didn't return enough unique teams in the batch, fallback
      while (wrongTeams.length < 3) {
        wrongTeams.push("Free Agent"); // Fallback guarantee
      }

      const choices = [correctTeam, ...wrongTeams].sort(() => 0.5 - Math.random());

      return {
        question: `Which team does ${player.first_name} ${player.last_name} play for?`,
        choices: choices,
        answer: correctTeam,
      };
    });

    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    // If it fails, return a safe fallback to prevent breaking the game
    return [
      {
        question: "API Error: Who won the NBA finals in 2023",
        choices: ["Lakers", "Heat", "Nuggets", "Bucks"],
        answer: "Nuggets",
      }
    ];
  }
}
