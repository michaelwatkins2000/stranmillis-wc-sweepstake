# World Cup Sweepstake — Claude Code Context

## Project Overview
A sweepstake companion web app for the 2026 World Cup, built for ~16 friends.
Each user has 3 teams. The app is a static site hosted on GitHub Pages.

## Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Plain CSS (CSS variables for theming), no CSS framework
- **Hosting**: GitHub Pages (via `gh-pages` branch / GitHub Actions)
- **Phase 2 (Post-it board)**: Supabase (not yet implemented — see below)

## Features (4 tabs)
1. **Fixtures** — Upcoming/past matches, user filter, flags, scores
2. **Groups** — Group stage standings tables (P/W/D/L/GD/Pts), team owners shown
3. **Knockout** — Visual bracket tree (R16 → QF → SF → Final)
4. **Post-it Board** *(Phase 2 — not yet built)* — Supabase-backed sticky note challenges between users

## Project Structure
```
sweepstake/
├── public/
│   ├── flags/          ← SVG/PNG flag images, named by ISO country code e.g. "br.svg"
│   └── avatars/        ← Friend photos, named by user slug e.g. "michael.jpg"
├── src/
│   ├── data/
│   │   ├── sweepstake.js   ← team → user assignments (edit once, stays static)
│   │   ├── users.js        ← user display names + avatar filenames
│   │   ├── fixtures.js     ← all matches: date, teams, scores, group/round
│   │   ├── groups.js       ← group standings (manually updated after each matchday)
│   │   └── knockout.js     ← bracket state (teams fill in as group stage resolves)
│   ├── components/
│   │   ├── Fixtures.jsx
│   │   ├── Groups.jsx
│   │   ├── Knockout.jsx
│   │   └── PostItBoard.jsx     ← Phase 2, stub only for now
│   ├── hooks/
│   │   └── useFilter.js    ← shared user filter state
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── CLAUDE.md               ← this file
```

## Data Conventions

### sweepstake.js
Maps team name → user slug. Team names must match exactly across all data files.
```js
export const assignments = {
  "Brazil": "michael",
  "France": "sarah",
  // ...
}
```

### users.js
```js
export const users = [
  { slug: "michael", name: "Michael", avatar: "michael.jpg" },
  // ...
]
```

### fixtures.js
```js
export const fixtures = [
  {
    id: 1,
    date: "2026-06-11",      // ISO date string
    time: "19:00",           // local kick-off time
    stage: "group",          // "group" | "r16" | "qf" | "sf" | "final"
    group: "A",              // null for knockout matches
    home: "Brazil",
    away: "France",
    homeScore: null,         // number once played, null if upcoming
    awayScore: null,
  },
]
```

### groups.js
```js
export const groups = {
  A: [
    { team: "Brazil", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0 },
    // gd and pts are computed in the component
  ],
  // B through H...
}
```

### knockout.js
```js
export const bracket = {
  r16:   [ { id: "r16_1", home: null, away: null, homeScore: null, awayScore: null }, /* x8 */ ],
  qf:    [ { id: "qf_1",  home: null, away: null, homeScore: null, awayScore: null }, /* x4 */ ],
  sf:    [ { id: "sf_1",  home: null, away: null, homeScore: null, awayScore: null }, /* x2 */ ],
  final: [ { id: "final", home: null, away: null, homeScore: null, awayScore: null } ],
}
```
Fill in `home`/`away` team name strings as teams qualify.

## Build & Deploy

```bash
npm install
npm run dev          # local dev server
npm run build        # production build → dist/
npm run deploy       # push to gh-pages branch (requires gh-pages package)
```

For GitHub Pages: set Pages source to `gh-pages` branch in repo settings,
or use the provided GitHub Actions workflow.

## Phase 2 — Post-it Board (Supabase)
When ready to implement:
1. Create a Supabase project at supabase.com
2. Add a `challenges` table: `id, author, message, accepted_by, response, created_at`
3. Add `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Install `@supabase/supabase-js`
5. Build out `PostItBoard.jsx` with real-time subscription

## Style Notes
- CSS variables defined in `App.css` under `:root`
- Each team has an ISO 3166-1 alpha-2 country code for flag lookup
- User avatars are in `public/avatars/`, referenced by slug
- Colour theme: dark football-pitch green with gold accents
- Fonts: loaded from Google Fonts in index.html

## Important
- Team names must be consistent across ALL data files (sweepstake.js, fixtures.js, groups.js, knockout.js)
- Scores are `null` (not 0) when a match hasn't been played — components use this to distinguish upcoming vs completed
- The app has no backend — all data is in src/data/ files, edited manually
