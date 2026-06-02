# World Cup Sweepstake 2026

A companion web app for a 16-person sweepstake — fixtures, group standings, and knockout bracket.

## Getting Started

### Prerequisites
- Node.js 18+
- A GitHub account

### Install & Run Locally
```bash
npm install
npm run dev
```
Open `http://localhost:5173/sweepstake/` in your browser.

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```
Then in your GitHub repo → Settings → Pages → set source to `gh-pages` branch.

Your app will be live at: `https://yourusername.github.io/sweepstake/`

---

## Updating Data

All data lives in `src/data/`. No backend, no database — just edit the files and redeploy.

### Setting Up Users (`src/data/users.js`)
Replace the placeholder users with your 16 friends. Each user needs:
- A unique `slug` (lowercase, no spaces) used as their ID everywhere
- A `name` for display
- An `avatar` filename matching a photo in `public/avatars/`
- A `colour` hex code for their accent colour

### Setting Up Teams (`src/data/sweepstake.js`)
Map each team to the user slug who drew them. Also set the `flag` ISO code for each country.
Flag SVGs go in `public/flags/` — grab them free from https://flagicons.lipis.dev/

### Updating Scores (`src/data/fixtures.js`)
Change `homeScore: null` and `awayScore: null` to numbers as matches are played.

### Updating Standings (`src/data/groups.js`)
Manually update W/D/L/GF/GA after each matchday. Goal difference and points are computed automatically.

### Updating the Bracket (`src/data/knockout.js`)
Fill in `home` and `away` team name strings as teams qualify. Add scores as they're played.

---

## Adding Avatars & Flags

```
public/
  avatars/
    michael.jpg    ← named by user slug
    sarah.jpg
    ...
  flags/
    br.svg         ← named by ISO 3166-1 alpha-2 code (lowercase)
    fr.svg
    gb-eng.svg     ← England uses this special code
    ...
```

Flag SVG pack: https://flagicons.lipis.dev/ — download and drop into `public/flags/`

---

## Phase 2: Challenge Board

The "Challenges" tab is currently a placeholder. When ready to add it:
1. Create a free Supabase project at https://supabase.com
2. Follow the instructions in `src/components/PostItBoard.jsx`

---

## Tech Stack
- React 18 + Vite
- Plain CSS (no framework)
- GitHub Pages (free hosting)
- Optional: Supabase (Phase 2 only)
