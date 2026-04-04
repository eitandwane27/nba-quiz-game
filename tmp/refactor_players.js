import fs from 'fs';
const players = JSON.parse(fs.readFileSync('src/data/players.json', 'utf8'));

const updatedPlayers = players.map(p => {
  const teams = p.team.split(',').map(t => t.trim());
  const { team, ...rest } = p;
  // Reorder to have name first, then teams, then era, then position
  return { 
    name: p.name,
    teams,
    era: p.era,
    position: p.position 
  };
});

fs.writeFileSync('src/data/players.json', JSON.stringify(updatedPlayers, null, 2));
console.log('Successfully updated players.json');
