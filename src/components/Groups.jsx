import { groups } from '../data/groups'
import { fixtures } from '../data/fixtures'
import { assignments } from '../data/sweepstake'
import { users } from '../data/users'

const SHORT_NAMES = {
  "Bosnia & Herzegovina": "Bosnia",
  "South Korea":          "S. Korea",
  "South Africa":         "S. Africa",
  "New Zealand":          "N. Zealand",
  "Saudi Arabia":         "S. Arabia",
  "Ivory Coast":          "Ivory Cst",
  "DR Congo":             "DR Congo",
}

function shortName(team) {
  return SHORT_NAMES[team] || team
}

function getUser(team) {
  const info = assignments[team]
  if (!info) return null
  return users.find(u => u.slug === info.user) || null
}

function getFlag(team) {
  const info = assignments[team]
  return info ? `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${info.flag}.svg` : null
}

// For teams tied on points, build a mini-table of only their mutual matches
// and sort by mini-table pts → mini-table gd → mini-table gf → overall gd → overall gf.
function rankByH2H(tied, played) {
  const names = tied.map(t => t.team)
  const h2h = Object.fromEntries(names.map(n => [n, { pts: 0, gd: 0, gf: 0 }]))

  played
    .filter(f => names.includes(f.home) && names.includes(f.away))
    .forEach(f => {
      const [h, a] = [f.homeScore, f.awayScore]
      if (h > a)        { h2h[f.home].pts += 3 }
      else if (h === a) { h2h[f.home].pts += 1; h2h[f.away].pts += 1 }
      else              { h2h[f.away].pts += 3 }
      h2h[f.home].gd += h - a;  h2h[f.away].gd += a - h
      h2h[f.home].gf += h;      h2h[f.away].gf += a
    })

  return [...tied].sort((a, b) => {
    const [ma, mb] = [h2h[a.team], h2h[b.team]]
    if (mb.pts !== ma.pts) return mb.pts - ma.pts
    if (mb.gd  !== ma.gd)  return mb.gd  - ma.gd
    if (mb.gf  !== ma.gf)  return mb.gf  - ma.gf
    if (b.gd   !== a.gd)   return b.gd   - a.gd
    return b.gf - a.gf
  })
}

function computeStandings(groupLetter, teamList) {
  const stats = {}
  teamList.forEach(t => {
    stats[t] = { team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0 }
  })

  const played = fixtures.filter(
    f => f.stage === 'group' && f.group === groupLetter && f.homeScore !== null && f.awayScore !== null
  )

  played.forEach(f => {
    const h = stats[f.home]
    const a = stats[f.away]
    if (!h || !a) return

    h.played++; a.played++
    h.gf += f.homeScore; h.ga += f.awayScore
    a.gf += f.awayScore; a.ga += f.homeScore

    if (f.homeScore > f.awayScore)      { h.won++; a.lost++ }
    else if (f.homeScore < f.awayScore) { a.won++; h.lost++ }
    else                                { h.drawn++; a.drawn++ }
  })

  const rows = Object.values(stats).map(t => ({
    ...t, gd: t.gf - t.ga, pts: t.won * 3 + t.drawn,
  }))

  // Primary sort: pts → overall gd → overall gf
  rows.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)

  // Re-sort any runs of teams tied on points using head-to-head
  let i = 0
  while (i < rows.length) {
    let j = i + 1
    while (j < rows.length && rows[j].pts === rows[i].pts) j++
    if (j - i > 1) rows.splice(i, j - i, ...rankByH2H(rows.slice(i, j), played))
    i = j
  }

  return rows
}

function GroupTable({ letter, teams, selectedUser }) {
  const rows = computeStandings(letter, teams).map(t => ({
    ...t,
    user: getUser(t.team),
    flagSrc: getFlag(t.team),
  }))

  return (
    <div className="group-card">
      <h3 className="group-card__title">Group {letter}</h3>
      <table className="standings-table">
        <thead>
          <tr>
            <th className="col-team">Team</th>
            <th>P</th>
            <th className="col-wdl">W</th>
            <th className="col-wdl">D</th>
            <th className="col-wdl">L</th>
            <th>GD</th>
            <th>Pts</th>
            <th className="col-owner">Owner</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isHighlighted = !selectedUser || (row.user && row.user.slug === selectedUser)
            const isQualify = i < 2
            return (
              <tr
                key={row.team}
                className={[
                  !isHighlighted ? 'row--dim' : '',
                  isQualify ? 'row--qualify' : '',
                ].join(' ')}
              >
                <td className="col-team">
                  <div className="team-inline">
                    {row.flagSrc && (
                      <img
                        src={row.flagSrc}
                        alt=""
                        className="team-flag team-flag--sm"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    )}
                    <span>{shortName(row.team)}</span>
                  </div>
                </td>
                <td>{row.played}</td>
                <td className="col-wdl">{row.won}</td>
                <td className="col-wdl">{row.drawn}</td>
                <td className="col-wdl">{row.lost}</td>
                <td className={row.gd > 0 ? 'gd--pos' : row.gd < 0 ? 'gd--neg' : ''}>
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td className="col-pts">{row.pts}</td>
                <td className="col-owner">
                  {row.user && (
                    <img
                      src={`${import.meta.env.BASE_URL}avatars/${row.user.avatar}`}
                      alt={row.user.name}
                      className="owner-avatar"
                      title={row.user.name}
                      style={{ borderColor: row.user.colour }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function Groups({ selectedUser }) {
  return (
    <div className="tab-content">
      <div className="groups-grid">
        {Object.entries(groups).map(([letter, teams]) => (
          <GroupTable key={letter} letter={letter} teams={teams} selectedUser={selectedUser} />
        ))}
      </div>
      <p className="qualify-legend">
        <span className="qualify-dot" /> Top 2 teams qualify for knockout stage
      </p>
    </div>
  )
}