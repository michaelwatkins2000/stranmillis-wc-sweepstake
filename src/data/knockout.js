// Fill in home/away with team name strings as teams qualify.
// Fill in scores once matches are played. Leave null for unknown/upcoming.
// homeLabel/awayLabel: shown when team is not yet known (R32 only).

export const bracket = {
  r32: [
    { id: "r32_1",  date: "2026-06-28", time: "20:00", homeLabel: "2nd Group A", awayLabel: "2nd Group B", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_2",  date: "2026-06-29", time: "18:00", homeLabel: "1st Group E", awayLabel: "3rd A/B/C/D/F", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_3",  date: "2026-06-29", time: "21:30", homeLabel: "1st Group F", awayLabel: "2nd Group C", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_4",  date: "2026-06-30", time: "02:00", homeLabel: "1st Group C", awayLabel: "2nd Group F", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_5",  date: "2026-06-30", time: "18:00", homeLabel: "1st Group I", awayLabel: "3rd C/D/F/G/H", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_6",  date: "2026-06-30", time: "22:00", homeLabel: "2nd Group E", awayLabel: "2nd Group I", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_7",  date: "2026-07-01", time: "02:00", homeLabel: "1st Group A", awayLabel: "3rd C/E/F/H/I", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_8",  date: "2026-07-01", time: "17:00", homeLabel: "1st Group L", awayLabel: "3rd E/H/I/J/K", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_9",  date: "2026-07-01", time: "21:00", homeLabel: "1st Group D", awayLabel: "3rd B/E/F/I/J", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_10", date: "2026-07-02", time: "01:00", homeLabel: "1st Group G", awayLabel: "3rd A/E/H/I/J", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_11", date: "2026-07-02", time: "20:00", homeLabel: "2nd Group K", awayLabel: "2nd Group L", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_12", date: "2026-07-03", time: "00:00", homeLabel: "1st Group H", awayLabel: "2nd Group J", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_13", date: "2026-07-03", time: "04:00", homeLabel: "1st Group B", awayLabel: "3rd E/F/G/I/J", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_14", date: "2026-07-03", time: "19:00", homeLabel: "1st Group J", awayLabel: "2nd Group H", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_15", date: "2026-07-03", time: "23:00", homeLabel: "1st Group K", awayLabel: "3rd D/E/I/J/L", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r32_16", date: "2026-07-04", time: "02:30", homeLabel: "2nd Group D", awayLabel: "2nd Group G", home: null, away: null, homeScore: null, awayScore: null },
  ],
  r16: [
    { id: "r16_1", date: "2026-07-04", time: "18:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_2", date: "2026-07-04", time: "22:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_3", date: "2026-07-05", time: "21:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_4", date: "2026-07-06", time: "01:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_5", date: "2026-07-06", time: "20:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_6", date: "2026-07-07", time: "01:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_7", date: "2026-07-07", time: "17:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "r16_8", date: "2026-07-07", time: "21:00", home: null, away: null, homeScore: null, awayScore: null },
  ],
  qf: [
    { id: "qf_1", date: "2026-07-09", time: "21:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "qf_2", date: "2026-07-10", time: "20:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "qf_3", date: "2026-07-11", time: "22:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "qf_4", date: "2026-07-12", time: "02:00", home: null, away: null, homeScore: null, awayScore: null },
  ],
  sf: [
    { id: "sf_1", date: "2026-07-14", time: "20:00", home: null, away: null, homeScore: null, awayScore: null },
    { id: "sf_2", date: "2026-07-15", time: "20:00", home: null, away: null, homeScore: null, awayScore: null },
  ],
  final: [
    { id: "final", date: "2026-07-19", time: "20:00", home: null, away: null, homeScore: null, awayScore: null },
  ],
}

export const roundLabels = {
  r32:   "Round of 32",
  r16:   "Round of 16",
  qf:    "Quarter Finals",
  sf:    "Semi Finals",
  final: "Final",
}
