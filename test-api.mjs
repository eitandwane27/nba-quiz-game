import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf8');
const key = envFile.split('=')[1].trim();

async function test() {
  const url = "https://api.balldontlie.io/v1/players?per_page=10";
  const res = await fetch(url, { headers: { "Authorization": key } });
  const data = await res.json();
  console.log("No cursor meta:", data.meta);
  
  const urlCursor = "https://api.balldontlie.io/v1/players?per_page=10&cursor=1500";
  const resCursor = await fetch(urlCursor, { headers: { "Authorization": key } });
  const dataCursor = await resCursor.json();
  console.log("Cursor 1500 meta:", dataCursor?.meta);
  console.log("Cursor 1500 length:", dataCursor?.data?.length);
  
  if (dataCursor?.data?.length === 0) {
     console.log("Cursor 1500 returned 0 players.");
  }
}
test();
