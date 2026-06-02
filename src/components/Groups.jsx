import { groups } from '../data/groups'
import { assignments } from '../data/sweepstake'
import { users } from '../data/users'

function getUser(team) {
  const info = assignments[team]
  if (!info) return null
  return users.find(u => u.slug === info.user) || null
}

function getFlag(team) {
  const info = assignments[team]
  return info ? `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${info.flag}.svg` : null
}

function GroupTable({ letter, teams, selectedUser }) {
  const rows = teams.map(t => ({
    ...t,
    gd: t.gf - t.ga,
    pts: t.won * 3 + t.drawn,
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
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
            <th className="col-owner">Owner</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isHighlighted = !selectedUser || (row.user && row.user.slug === selectedUser)
            const isQualify = i < 2 // top 2 qualify (adjust for 2026 format)
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
                    <span>{row.team}</span>
                  </div>
                </td>
                <td>{row.played}</td>
                <td>{row.won}</td>
                <td>{row.drawn}</td>
                <td>{row.lost}</td>
                <td>{row.gf}</td>
                <td>{row.ga}</td>
                <td className={row.gd > 0 ? 'gd--pos' : row.gd < 0 ? 'gd--neg' : ''}>
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td className="col-pts">{row.pts}</td>
                <td className="col-owner">
                  {row.user && (
                    <span
                      className="owner-chip"
                      style={{ backgroundColor: row.user.colour + '33', color: row.user.colour }}
                    >
                      {row.user.name}
                    </span>
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
