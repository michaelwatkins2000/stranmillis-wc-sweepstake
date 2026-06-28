// Fetches match data from football-data.org and patches src/data/fixtures.js
// and src/data/knockout.js in place.
//
// Group stage:   patches scores when FINISHED.
// Knockout stage: patches team names as they become known (even mid-tournament),
//                 and patches scores when FINISHED.
//
// Run: FOOTBALL_DATA_API_KEY=<key> node scripts/sync.js

const fs   = require('fs')
const path = require('path')

const API_KEY = process.env.FOOTBALL_DATA_API_KEY
const API_URL = 'https://api.football-data.org/v4/competitions/WC/matches'

// Normalise API team names to the exact strings used in our sweepstake.js / fixtures.js.
const NAME_MAP = {
  'United States':          'USA',
  'Korea Republic':         'South Korea',
  "Côte d'Ivoire":         'Ivory Coast',
  'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
  'Bosnia-Herzegovina':     'Bosnia & Herzegovina',
  'Congo DR':               'DR Congo',
  'Cape Verde Islands':     'Cape Verde',
  'Curacao':                'Curaçao',
}

function normalizeName(name) {
  if (!name) return null
  return NAME_MAP[name] || name
}

async function main() {
  if (!API_KEY) {
    console.error('Error: FOOTBALL_DATA_API_KEY environment variable is not set')
    process.exit(1)
  }

  console.log('Fetching matches from football-data.org...')
  const res = await fetch(API_URL, { headers: { 'X-Auth-Token': API_KEY } })

  if (!res.ok) {
    console.error(`API responded ${res.status}: ${res.statusText}`)
    process.exit(1)
  }

  const { matches } = await res.json()
  console.log(`Received ${matches.length} matches`)

  const fixturesPath = path.join(__dirname, '../src/data/fixtures.js')
  const knockoutPath = path.join(__dirname, '../src/data/knockout.js')
  let fixturesContent = fs.readFileSync(fixturesPath, 'utf8')
  let knockoutContent = fs.readFileSync(knockoutPath, 'utf8')
  let fixturesChanged = 0
  let knockoutChanged = 0

  for (const match of matches) {
    const isKnockout = match.stage !== 'GROUP_STAGE'
    const homeTeam   = normalizeName(match.homeTeam?.name)
    const awayTeam   = normalizeName(match.awayTeam?.name)

    // ── Score patch (all stages, FINISHED only) ────────────────────────────

    if (match.status === 'FINISHED') {
      const home = match.score.fullTime.home
      const away = match.score.fullTime.away

      if (home !== null && away !== null) {
        // fixtures.js — match by fixture ID
        const before = fixturesContent
        fixturesContent = fixturesContent.replace(
          new RegExp(`(\\{ id: ${match.id},[^\\n]*?)homeScore: (?:null|\\d+), awayScore: (?:null|\\d+)`),
          `$1homeScore: ${home}, awayScore: ${away}`
        )
        if (fixturesContent !== before) {
          console.log(`  Score fixtures.js  #${match.id}: ${home}–${away}`)
          fixturesChanged++
        }

        // knockout.js — match by apiId
        if (isKnockout) {
          const before2 = knockoutContent
          knockoutContent = knockoutContent.replace(
            new RegExp(`(apiId: ${match.id},[^\\n]*?)homeScore: (?:null|\\d+), awayScore: (?:null|\\d+)`),
            `$1homeScore: ${home}, awayScore: ${away}`
          )
          if (knockoutContent !== before2) {
            console.log(`  Score knockout.js  apiId ${match.id}: ${home}–${away}`)
            knockoutChanged++
          }
        }
      }
    }

    // ── Team name patch (knockout only, as soon as teams are known) ─────────

    if (isKnockout) {
      if (homeTeam) {
        // fixtures.js
        const before = fixturesContent
        fixturesContent = fixturesContent.replace(
          new RegExp(`(\\{ id: ${match.id},[^\\n]*?), home: null`),
          `$1, home: "${homeTeam}"`
        )
        if (fixturesContent !== before) {
          console.log(`  Home fixtures.js   #${match.id}: ${homeTeam}`)
          fixturesChanged++
        }

        // knockout.js — match by apiId (word boundary handles variable spacing before home:)
        const before2 = knockoutContent
        knockoutContent = knockoutContent.replace(
          new RegExp(`(apiId: ${match.id},[^\\n]*?\\bhome: )null`),
          `$1"${homeTeam}"`
        )
        if (knockoutContent !== before2) {
          console.log(`  Home knockout.js   apiId ${match.id}: ${homeTeam}`)
          knockoutChanged++
        }
      }

      if (awayTeam) {
        // fixtures.js
        const before = fixturesContent
        fixturesContent = fixturesContent.replace(
          new RegExp(`(\\{ id: ${match.id},[^\\n]*?), away: null`),
          `$1, away: "${awayTeam}"`
        )
        if (fixturesContent !== before) {
          console.log(`  Away fixtures.js   #${match.id}: ${awayTeam}`)
          fixturesChanged++
        }

        // knockout.js — match by apiId (word boundary handles variable spacing before away:)
        const before2 = knockoutContent
        knockoutContent = knockoutContent.replace(
          new RegExp(`(apiId: ${match.id},[^\\n]*?\\baway: )null`),
          `$1"${awayTeam}"`
        )
        if (knockoutContent !== before2) {
          console.log(`  Away knockout.js   apiId ${match.id}: ${awayTeam}`)
          knockoutChanged++
        }
      }
    }
  }

  if (fixturesChanged > 0) {
    fs.writeFileSync(fixturesPath, fixturesContent, 'utf8')
    console.log(`fixtures.js — updated ${fixturesChanged} field(s)`)
  } else {
    console.log('fixtures.js — no changes')
  }

  if (knockoutChanged > 0) {
    fs.writeFileSync(knockoutPath, knockoutContent, 'utf8')
    console.log(`knockout.js — updated ${knockoutChanged} field(s)`)
  } else {
    console.log('knockout.js — no changes')
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
