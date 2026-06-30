// Fill in home/away with team name strings as teams qualify.
// Fill in scores once matches are played. Leave null for unknown/upcoming.
// homeLabel/awayLabel: shown when team is not yet known (R32 only).
// apiId: football-data.org fixture ID — used by sync.js to patch this file.

export const bracket = {
  r32: [
    { id: "r32_1",  apiId: 537417, date: "2026-06-28", time: "20:00", homeLabel: "2nd Group A",   awayLabel: "2nd Group B",     home: "South Africa", away: "Canada", homeScore: 0, awayScore: 1 },
    { id: "r32_2",  apiId: 537423, date: "2026-06-29", time: "18:00", homeLabel: "1st Group E",   awayLabel: "3rd A/B/C/D/F",   home: "Brazil", away: "Japan", homeScore: 2, awayScore: 1 },
    { id: "r32_3",  apiId: 537415, date: "2026-06-29", time: "21:30", homeLabel: "1st Group F",   awayLabel: "2nd Group C",     home: "Germany", away: "Paraguay", homeScore: 4, awayScore: 5 },
    { id: "r32_4",  apiId: 537418, date: "2026-06-30", time: "02:00", homeLabel: "1st Group C",   awayLabel: "2nd Group F",     home: "Netherlands", away: "Morocco", homeScore: 3, awayScore: 4 },
    { id: "r32_5",  apiId: 537424, date: "2026-06-30", time: "18:00", homeLabel: "1st Group I",   awayLabel: "3rd C/D/F/G/H",   home: "Ivory Coast", away: "Norway", homeScore: null, awayScore: null },
    { id: "r32_6",  apiId: 537416, date: "2026-06-30", time: "22:00", homeLabel: "2nd Group E",   awayLabel: "2nd Group I",     home: "France", away: "Sweden", homeScore: null, awayScore: null },
    { id: "r32_7",  apiId: 537425, date: "2026-07-01", time: "02:00", homeLabel: "1st Group A",   awayLabel: "3rd C/E/F/H/I",   home: "Mexico", away: "Ecuador", homeScore: null, awayScore: null },
    { id: "r32_8",  apiId: 537426, date: "2026-07-01", time: "17:00", homeLabel: "1st Group L",   awayLabel: "3rd E/H/I/J/K",   home: "England", away: "DR Congo", homeScore: null, awayScore: null },
    { id: "r32_9",  apiId: 537422, date: "2026-07-01", time: "21:00", homeLabel: "1st Group D",   awayLabel: "3rd B/E/F/I/J",   home: "Belgium", away: "Senegal", homeScore: null, awayScore: null },
    { id: "r32_10", apiId: 537421, date: "2026-07-02", time: "01:00", homeLabel: "1st Group G",   awayLabel: "3rd A/E/H/I/J",   home: "USA", away: "Bosnia & Herzegovina", homeScore: null, awayScore: null },
    { id: "r32_11", apiId: 537420, date: "2026-07-02", time: "20:00", homeLabel: "2nd Group K",   awayLabel: "2nd Group L",     home: "Spain", away: "Austria", homeScore: null, awayScore: null },
    { id: "r32_12", apiId: 537419, date: "2026-07-03", time: "00:00", homeLabel: "1st Group H",   awayLabel: "2nd Group J",     home: "Portugal", away: "Croatia", homeScore: null, awayScore: null },
    { id: "r32_13", apiId: 537429, date: "2026-07-03", time: "04:00", homeLabel: "1st Group B",   awayLabel: "3rd E/F/G/I/J",   home: "Switzerland", away: "Algeria", homeScore: null, awayScore: null },
    { id: "r32_14", apiId: 537428, date: "2026-07-03", time: "19:00", homeLabel: "1st Group J",   awayLabel: "2nd Group H",     home: "Australia", away: "Egypt", homeScore: null, awayScore: null },
    { id: "r32_15", apiId: 537427, date: "2026-07-03", time: "23:00", homeLabel: "1st Group K",   awayLabel: "3rd D/E/I/J/L",   home: "Argentina", away: "Cape Verde", homeScore: null, awayScore: null },
    { id: "r32_16", apiId: 537430, date: "2026-07-04", time: "02:30", homeLabel: "2nd Group D",   awayLabel: "2nd Group G",     home: "Colombia", away: "Ghana", homeScore: null, awayScore: null },
  ],
  r16: [
    { id: "r16_1", apiId: 537376, date: "2026-07-04", time: "18:00", home: "Canada", away: "Morocco", homeScore: null, awayScore: null },
    { id: "r16_2", apiId: 537375, date: "2026-07-04", time: "22:00", home: "Paraguay", away: null, homeScore: null, awayScore: null },
    { id: "r16_3", apiId: 537377, date: "2026-07-05", time: "21:00", home: "Brazil", away: null, homeScore: null, awayScore: null },
    { id: "r16_4", apiId: 537378, date: "2026-07-06", time: "01:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_5", apiId: 537379, date: "2026-07-06", time: "20:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_6", apiId: 537380, date: "2026-07-07", time: "01:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_7", apiId: 537381, date: "2026-07-07", time: "17:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_8", apiId: 537382, date: "2026-07-07", time: "21:00", home: null, away: null, homeScore: null, awayScore: null },
  ],
  qf: [
    { id: "qf_1", apiId: 537383, date: "2026-07-09", time: "21:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "qf_2", apiId: 537384, date: "2026-07-10", time: "20:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "qf_3", apiId: 537385, date: "2026-07-11", time: "22:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "qf_4", apiId: 537386, date: "2026-07-12", time: "02:00", home: null, away: null, homeScore: null, awayScore: null },
  ],
  sf: [
    { id: "sf_1", apiId: 537387, date: "2026-07-14", time: "20:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "sf_2", apiId: 537388, date: "2026-07-15", time: "20:00", home: null, away: null, homeScore: null, awayScore: null },
  ],
  final: [
    { id: "final", apiId: 537390, date: "2026-07-19", time: "20:00", home: null, away: null, homeScore: null, awayScore: null },
  ],
}

export const roundLabels = {
  r32:   "Round of 32",
  r16:   "Round of 16",
  qf:    "Quarter Finals",
  sf:    "Semi Finals",
  final: "Final",
}
