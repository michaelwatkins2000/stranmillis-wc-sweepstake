// ------------------------------------------------------------
// EDIT THIS FILE as knockout rounds are played.
// Fill in `home` and `away` with team name strings once teams qualify.
// Fill in scores once matches are played.
// Leave as null for upcoming/unknown slots.
//
// The bracket follows standard World Cup structure:
// 32 teams → R32 → R16 → QF → SF → Final
// (2026 has 48 teams: adjust rounds as the format is confirmed)
// ------------------------------------------------------------

export const bracket = {
  r16: [
    { id: "r16_1", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_2", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_3", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_4", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_5", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_6", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_7", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_8", home: null, away: null, homeScore: null, awayScore: null },
  ],
  qf: [
    { id: "qf_1", home: null, away: null, homeScore: null, awayScore: null },
    { id: "qf_2", home: null, away: null, homeScore: null, awayScore: null },
    { id: "qf_3", home: null, away: null, homeScore: null, awayScore: null },
    { id: "qf_4", home: null, away: null, homeScore: null, awayScore: null },
  ],
  sf: [
    { id: "sf_1", home: null, away: null, homeScore: null, awayScore: null },
    { id: "sf_2", home: null, away: null, homeScore: null, awayScore: null },
  ],
  final: [
    { id: "final", home: null, away: null, homeScore: null, awayScore: null },
  ],
}

// Round display labels
export const roundLabels = {
  r16:   "Round of 16",
  qf:    "Quarter Finals",
  sf:    "Semi Finals",
  final: "Final",
}
