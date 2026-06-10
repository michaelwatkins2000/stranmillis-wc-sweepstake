// Fetches completed match scores from football-data.org and patches src/data/fixtures.js in place.
// Matches by fixture ID so no team-name mapping is needed.
// Run: FOOTBALL_DATA_API_KEY=<key> node scripts/sync.js

const fs   = require('fs')
const path = require('path')

const API_KEY = process.env.FOOTBALL_DATA_API_KEY
const API_URL = 'https://api.football-data.org/v4/competitions/WC/matches'

async function main() {
  if (!API_KEY) {
    console.error('Error: FOOTBALL_DATA_API_KEY environment variable is not set')
    process.exit(1)
  }

  console.log('Fetching matches from football-data.org...')
  const res = await fetch(API_URL, {
    headers: { 'X-Auth-Token': API_KEY }
  })

  if (!res.ok) {
    console.error(`API responded ${res.status}: ${res.statusText}`)
    process.exit(1)
  }

  const { matches } = await res.json()
  console.log(`Received ${matches.length} matches`)

  const fixturesPath = path.join(__dirname, '../src/data/fixtures.js')
  let content = fs.readFileSync(fixturesPath, 'utf8')
  let changed = 0

  for (const match of matches) {
    // Only patch scores for fully completed matches
    if (match.status !== 'FINISHED') continue

    const home = match.score.fullTime.home
    const away = match.score.fullTime.away
    if (home === null || away === null) continue

    const before = content
    content = content.replace(
      new RegExp(`(\\{ id: ${match.id},[^\\n]*?)homeScore: (?:null|\\d+), awayScore: (?:null|\\d+)`),
      `$1homeScore: ${home}, awayScore: ${away}`
    )
    if (content !== before) {
      console.log(`  Updated fixture ${match.id}: ${home}–${away}`)
      changed++
    }
  }

  if (changed > 0) {
    fs.writeFileSync(fixturesPath, content, 'utf8')
    console.log(`Done — updated ${changed} fixture(s)`)
  } else {
    console.log('Done — no score changes')
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
