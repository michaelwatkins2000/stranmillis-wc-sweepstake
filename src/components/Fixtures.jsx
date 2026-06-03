import { useState, useMemo } from 'react'
import { fixtures } from '../data/fixtures'
import { assignments } from '../data/sweepstake'
import { users } from '../data/users'

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })
}

function groupByDate(fixtureList) {
  return fixtureList.reduce((acc, f) => {
    if (!acc[f.date]) acc[f.date] = []
    acc[f.date].push(f)
    return acc
  }, {})
}

function AvatarBubble({ user }) {
  return (
    <div
      className="avatar-bubble"
      style={{ '--colour': user?.colour || 'var(--border)' }}
    >
      {user
        ? <img
            src={`${import.meta.env.BASE_URL}avatars/${user.avatar}`}
            alt={user.name}
            className="avatar-bubble__img"
            onError={e => { e.target.style.display = 'none' }}
          />
        : <span className="avatar-bubble__placeholder">?</span>
      }
    </div>
  )
}

function TeamSide({ team, user, align }) {
  const info = team ? assignments[team] : null
  const flagSrc = info
    ? `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${info.flag}.svg`
    : null

  return (
    <div className={`team-side team-side--${align}`}>
      <AvatarBubble user={user} />
      <div className="team-side__info">
        {flagSrc && (
          <img
            src={flagSrc}
            alt=""
            className="team-flag team-flag--md"
            onError={e => { e.target.style.display = 'none' }}
          />
        )}
        <span className="team-side__name">{team || 'TBD'}</span>
      </div>
    </div>
  )
}

function MatchCard({ fixture, highlightUsers }) {
  const homeInfo = fixture.home ? assignments[fixture.home] : null
  const awayInfo = fixture.away ? assignments[fixture.away] : null
  const homeUser = homeInfo ? users.find(u => u.slug === homeInfo.user) : null
  const awayUser = awayInfo ? users.find(u => u.slug === awayInfo.user) : null

  const isHighlighted =
    !highlightUsers ||
    (homeUser && highlightUsers.includes(homeUser.slug)) ||
    (awayUser && highlightUsers.includes(awayUser.slug))

  const isPlayed = fixture.homeScore !== null && fixture.awayScore !== null
  const stageLabel = fixture.group ? `Group ${fixture.group}` : fixture.stage.toUpperCase()

  return (
    <div className={`match-card ${!isHighlighted ? 'match-card--dim' : ''} ${isPlayed ? 'match-card--played' : ''}`}>
      <div className="match-card__body">
        <TeamSide team={fixture.home} user={homeUser} align="left" />
        <div className="match-card__centre">
          <span className="match-card__meta">{stageLabel} · {fixture.time} BST</span>
          <div className="match-card__versus">
            <span className="match-card__username" style={{ color: homeUser?.colour }}>
              {homeUser?.name || '—'}
            </span>
            {isPlayed
              ? <span className="score">{fixture.homeScore} – {fixture.awayScore}</span>
              : <span className="score score--upcoming">vs</span>
            }
            <span className="match-card__username" style={{ color: awayUser?.colour }}>
              {awayUser?.name || '—'}
            </span>
          </div>
        </div>
        <TeamSide team={fixture.away} user={awayUser} align="right" />
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
