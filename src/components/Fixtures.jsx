import { useState, useMemo } from 'react'
import { fixtures } from '../data/fixtures'
import { assignments } from '../data/sweepstake'
import { users } from '../data/users'

// Helper: format ISO date to readable string
function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })
}

// Helper: group fixtures by date
function groupByDate(fixtureList) {
  return fixtureList.reduce((acc, f) => {
    if (!acc[f.date]) acc[f.date] = []
    acc[f.date].push(f)
    return acc
  }, {})
}

function TeamChip({ team }) {
  const info = assignments[team]
  const user = info ? users.find(u => u.slug === info.user) : null
  const flagSrc = info ? `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${info.flag}.svg` : null

  return (
    <div className="team-chip">
      {flagSrc && (
        <img
          src={flagSrc}
          alt={`${team} flag`}
          className="team-flag"
          onError={e => { e.target.style.display = 'none' }}
        />
      )}
      <span className="team-name">{team}</span>
      {user && (
        <span
          className="team-owner-badge"
          style={{ backgroundColor: user.colour + '33', color: user.colour, borderColor: user.colour + '66' }}
        >
          {user.name}
        </span>
      )}
    </div>
  )
}

function MatchCard({ fixture, highlightUsers }) {
  const homeInfo = assignments[fixture.home]
  const awayInfo = assignments[fixture.away]
  const homeUser = homeInfo ? users.find(u => u.slug === homeInfo.user) : null
  const awayUser = awayInfo ? users.find(u => u.slug === awayInfo.user) : null

  const isHighlighted =
    !highlightUsers ||
    (homeUser && highlightUsers.includes(homeUser.slug)) ||
    (awayUser && highlightUsers.includes(awayUser.slug))

  const isPlayed = fixture.homeScore !== null && fixture.awayScore !== null

  return (
    <div className={`match-card ${!isHighlighted ? 'match-card--dim' : ''} ${isPlayed ? 'match-card--played' : ''}`}>
      <div className="match-card__stage">
        {fixture.group ? `Group ${fixture.group}` : fixture.stage.toUpperCase()} · {fixture.time}
      </div>
      <div className="match-card__teams">
        <TeamChip team={fixture.home} />
        <div className="match-card__score">
          {isPlayed
            ? <span className="score">{fixture.homeScore} – {fixture.awayScore}</span>
            : <span className="score score--upcoming">vs</span>
          }
        </div>
        <TeamChip team={fixture.away} />
      </div>
    </div>
  )
}

export function Fixtures({ selectedUser }) {
  const [stageFilter, setStageFilter] = useState('all')

  const filtered = useMemo(() => {
    return fixtures.filter(f => {
      if (stageFilter === 'upcoming') return f.homeScore === null
      if (stageFilter === 'played') return f.homeScore !== null
      return true
    })
  }, [stageFilter])

  const byDate = groupByDate(filtered)
  const sortedDates = Object.keys(byDate).sort()

  const highlightUsers = selectedUser ? [selectedUser] : null

  return (
    <div className="tab-content">
      {/* Stage filter pills */}
      <div className="filter-pills">
        {['all', 'upcoming', 'played'].map(f => (
          <button
            key={f}
            className={`pill ${stageFilter === f ? 'pill--active' : ''}`}
            onClick={() => setStageFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {sortedDates.length === 0 && (
        <p className="empty-state">No fixtures to show.</p>
      )}

      {sortedDates.map(date => (
        <div key={date} className="date-group">
          <h3 className="date-group__label">{formatDate(date)}</h3>
          <div className="match-list">
            {byDate[date].map(f => (
              <MatchCard key={f.id} fixture={f} highlightUsers={highlightUsers} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
