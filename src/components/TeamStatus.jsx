import { useState } from 'react'
import { users } from '../data/users'
import { assignments } from '../data/sweepstake'
import { fixtures } from '../data/fixtures'
import { groups } from '../data/groups'

// Returns all teams assigned to a user as [{ team, flagCode }]
function getUserTeams(slug) {
  return Object.entries(assignments)
    .filter(([, info]) => info.user === slug)
    .map(([team, info]) => ({ team, flagCode: info.flag }))
}

// Derive standings for a group purely from fixture results
function getGroupStandings(groupLetter) {
  const teamNames = groups[groupLetter] || []
  const stats = Object.fromEntries(
    teamNames.map(t => [t, { pts: 0, played: 0, gd: 0, gf: 0 }])
  )

  fixtures
    .filter(f => f.stage === 'group' && f.group === groupLetter && f.homeScore !== null)
    .forEach(f => {
      if (!stats[f.home] || !stats[f.away]) return
      const [h, a] = [f.homeScore, f.awayScore]
      stats[f.home].played++; stats[f.away].played++
      stats[f.home].gf += h;  stats[f.away].gf += a
      stats[f.home].gd += h - a; stats[f.away].gd += a - h
      if (h > a)        { stats[f.home].pts += 3 }
      else if (h === a) { stats[f.home].pts += 1; stats[f.away].pts += 1 }
      else              { stats[f.away].pts += 3 }
    })

  return Object.entries(stats)
    .map(([team, s]) => ({ team, ...s }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
}

// Find which group a team belongs to
function teamGroup(team) {
  return Object.entries(groups).find(([, teams]) => teams.includes(team))?.[0] ?? null
}

// --- Elimination logic ---
// A team is eliminated when they can no longer qualify. Two routes:
//   1. Group stage: played all 3 games and finished 3rd or 4th in their group
//   2. Knockout stage: appeared in a knockout match and lost

function isGroupEliminated(team) {
  const groupLetter = teamGroup(team)
  if (!groupLetter) return false

  const groupSize = (groups[groupLetter] || []).length
  const gamesPerTeam = groupSize - 1

  const standings = getGroupStandings(groupLetter)
  const row = standings.find(s => s.team === team)
  if (!row) return false

  const maxPts = row.pts + (gamesPerTeam - row.played) * 3

  // Returns true if otherTeam won the head-to-head match against `team`
  function beatenBy(otherTeam) {
    const match = fixtures.find(f =>
      f.stage === 'group' && f.group === groupLetter && f.homeScore !== null &&
      ((f.home === team && f.away === otherTeam) || (f.home === otherTeam && f.away === team))
    )
    if (!match) return false
    return match.home === otherTeam
      ? match.homeScore > match.awayScore
      : match.awayScore > match.homeScore
  }

  // WC 2026: 8 of 12 third-placed teams advance, so 3rd is not guaranteed eliminated.
  // A team is only out when all 3 others are guaranteed above them (locking in 4th place).
  //
  // Team X is guaranteed above T if:
  //   - X.pts > T.maxPts (unreachable even if T wins everything), OR
  //   - X.pts === T.maxPts AND X already beat T head-to-head
  //     (if T maxes out and ties X on points, X wins the tiebreaker)
  const others = standings.filter(s => s.team !== team)
  const guaranteedAbove = others.filter(s =>
    s.pts > maxPts || (s.pts === maxPts && beatenBy(s.team))
  )
  if (guaranteedAbove.length >= 3) return true

  // After all group games are played: 4th place is eliminated.
  // 3rd place may still qualify as one of the 8 best third-placed teams.
  if (row.played >= gamesPerTeam) {
    return standings.indexOf(row) + 1 > 3
  }

  return false
}

function isKnockoutEliminated(team) {
  const knockoutStages = ['r32', 'r16', 'qf', 'sf', 'final']
  return fixtures.some(f => {
    if (!knockoutStages.includes(f.stage)) return false
    if (f.homeScore === null) return false
    if (f.home === team) return f.awayScore > f.homeScore
    if (f.away === team) return f.homeScore > f.awayScore
    return false
  })
}

function isEliminated(team) {
  return isGroupEliminated(team) || isKnockoutEliminated(team)
}

// --- Components ---

function TeamChip({ team, flagCode, out }) {
  const flagUrl = `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${flagCode}.svg`
  return (
    <div className={`team-chip${out ? ' team-chip--out' : ''}`}>
      <img src={flagUrl} alt="" className="team-chip__flag" onError={e => { e.target.style.display = 'none' }} />
      <span className="team-chip__name">{team}</span>
    </div>
  )
}

function TeamCard({ user, teams, out }) {
  return (
    <div className={`team-status-card${out ? ' team-status-card--out' : ''}`}
         style={{ '--colour': user.colour }}>
      <div className="team-status-card__header">
        <img
          src={`${import.meta.env.BASE_URL}avatars/${user.avatar}`}
          alt={user.name}
          className="team-status-card__avatar"
          style={{ borderColor: user.colour }}
          onError={e => { e.target.src = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${user.colour}"/><text x="50" y="50" text-anchor="middle" dominant-baseline="central" fill="white" font-family="sans-serif" font-size="42" font-weight="700">${user.name.charAt(0)}</text></svg>`)}` ; e.target.onerror = null }}
        />
        <span className="team-status-card__name" style={{ color: user.colour }}>{user.name}</span>
      </div>
      <div className="team-status-card__teams">
        {teams.map(({ team, flagCode }) => (
          <TeamChip key={team} team={team} flagCode={flagCode} out={out} />
        ))}
      </div>
    </div>
  )
}

const STATUS_FILTERS = ['all', 'competing', 'eliminated']

export function TeamStatus({ selectedUser }) {
  const [filter, setFilter] = useState('all')

  const visible = selectedUser ? users.filter(u => u.slug === selectedUser) : users

  const competing = []
  const eliminated = []

  visible.forEach(user => {
    const teams = getUserTeams(user.slug)
    const active = teams.filter(t => !isEliminated(t.team))
    const out    = teams.filter(t =>  isEliminated(t.team))
    if (active.length > 0) competing.push({ user, teams: active })
    if (out.length   > 0) eliminated.push({ user, teams: out })
  })

  return (
    <div className="tab-content">
      <div className="filter-pills">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            className={`pill ${f !== 'all' ? `pill--${f}` : ''} ${filter === f ? 'pill--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {(filter === 'all' || filter === 'competing') && (
        <section className="status-section">
          <h2 className="status-section__title">⚽ Competing</h2>
          {competing.length > 0 ? (
            <div className="status-grid">
              {competing.map(({ user, teams }) => (
                <TeamCard key={user.slug} user={user} teams={teams} out={false} />
              ))}
            </div>
          ) : (
            <p className="empty-state">All teams eliminated.</p>
          )}
        </section>
      )}

      {(filter === 'all' || filter === 'eliminated') && eliminated.length > 0 && (
        <section className="status-section">
          <h2 className="status-section__title">❌ Eliminated</h2>
          <div className="status-grid">
            {eliminated.map(({ user, teams }) => (
              <TeamCard key={user.slug} user={user} teams={teams} out />
            ))}
          </div>
        </section>
      )}

      {filter === 'eliminated' && eliminated.length === 0 && (
        <p className="empty-state">No teams eliminated yet.</p>
      )}
    </div>
  )
}
