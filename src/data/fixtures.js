// ------------------------------------------------------------
// EDIT THIS FILE as the tournament progresses:
//   - Set homeScore / awayScore to numbers once a match is played
//   - Leave as null for upcoming matches
//   - Add knockout fixtures once teams are known
//
// date: ISO 8601 (YYYY-MM-DD)
// time: local kick-off time string for display only
// stage: "group" | "r16" | "qf" | "sf" | "final"
// group: group letter (A–L) for group stage; null for knockout
// ------------------------------------------------------------

export const fixtures = [
  // ── GROUP A ──────────────────────────────────────────────
  {
    id: 1, date: "2026-06-11", time: "20:00", stage: "group", group: "A",
    home: "USA", away: "Mexico",
    homeScore: null, awayScore: null,
  },
  {
    id: 2, date: "2026-06-12", time: "17:00", stage: "group", group: "A",
    home: "Canada", away: "USA",
    homeScore: null, awayScore: null,
  },
  {
    id: 3, date: "2026-06-15", time: "20:00", stage: "group", group: "A",
    home: "Mexico", away: "Canada",
    homeScore: null, awayScore: null,
  },

  // ── GROUP B ──────────────────────────────────────────────
  {
    id: 4, date: "2026-06-12", time: "20:00", stage: "group", group: "B",
    home: "Brazil", away: "Argentina",
    homeScore: null, awayScore: null,
  },
  {
    id: 5, date: "2026-06-13", time: "17:00", stage: "group", group: "B",
    home: "Colombia", away: "Brazil",
    homeScore: null, awayScore: null,
  },
  {
    id: 6, date: "2026-06-16", time: "20:00", stage: "group", group: "B",
    home: "Argentina", away: "Colombia",
    homeScore: null, awayScore: null,
  },

  // ── GROUP C ──────────────────────────────────────────────
  {
    id: 7, date: "2026-06-13", time: "20:00", stage: "group", group: "C",
    home: "France", away: "England",
    homeScore: null, awayScore: null,
  },
  {
    id: 8, date: "2026-06-14", time: "17:00", stage: "group", group: "C",
    home: "Germany", away: "France",
    homeScore: null, awayScore: null,
  },
  {
    id: 9, date: "2026-06-17", time: "20:00", stage: "group", group: "C",
    home: "England", away: "Germany",
    homeScore: null, awayScore: null,
  },

  // ── KNOCKOUT (fill in once teams qualify) ─────────────────
  // Round of 16 — add 8 fixtures here once group stage is done
  // {
  //   id: 100, date: "2026-07-04", time: "20:00", stage: "r16", group: null,
  //   home: "Winner Group A", away: "Runner-up Group B",
  //   homeScore: null, awayScore: null,
  // },
]
