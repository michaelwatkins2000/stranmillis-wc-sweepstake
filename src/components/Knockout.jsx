import { bracket, roundLabels } from '../data/knockout'
import { assignments } from '../data/sweepstake'
import { users } from '../data/users'

const ROUNDS = ['r32', 'r16', 'qf', 'sf', 'final']

function getUser(team) {
  if (!team) return null
  const info = assignments[team]
  if (!info) return null
  return users.find(u => u.slug === info.user) || null
}

function getFlag(team) {
  if (!team) return null
  const info = assignments[team]
  return info ? `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${info.flag}.svg` : null
}

function TeamRow({ team, user, score, isWinner, isLabel }) {
  const flagSrc = isLabel ? null : getFlag(team)
  return (
    <div className={`bracket-team ${isWinner ? 'bracket-team--winner' : ''} ${isLabel ? 'bracket-team--tbd' : ''}`}>
      <div className="bracket-team__info">
        {user ? (
          <img
            src={`${import.meta.env.BASE_URL}avatars/${user.avatar}`}
            alt={user.name}
            className="bracket-team__avatar"
            style={{ borderColor: user.colour }}
            onError={e => {
              e.target.src = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${user.colour}"/><text x="50" y="50" text-anchor="middle" dominant-baseline="central" fill="white" font-family="sans-serif" font-size="42" font-weight="700">${user.name.charAt(0)}</text></svg>`)}`
              e.target.onerror = null
            }}
          />
        ) : (
          <div className="bracket-team__avatar bracket-team__avatar--empty" />
        )}
        {flagSrc && (
          <img
            src={flagSrc}
            alt=""
            className="team-flag team-flag--sm"
            onError={e => { e.target.style.display = 'none' }}
          />
        )}
        <span className="bracket-team__name">{team || 'TBD'}</span>
      </div>
      <span className="bracket-team__score">
        {score !== null && score !== undefined ? score : ''}
      </span>
    </div>
  )
}

function formatSlotDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function MatchSlot({ match, selectedUser, hasInputArm }) {
  const homeUser = getUser(match?.home)
  const awayUser = getUser(match?.away)
  const isHighlighted =
    !selectedUser ||
    (homeUser && homeUser.slug === selectedUser) ||
    (awayUser && awayUser.slug === selectedUser)

  const isPlayed = match?.homeScore !== null && match?.awayScore !== null
  const homeWin = isPlayed && match.homeScore > match.awayScore
  const awayWin = isPlayed && match.awayScore > match.homeScore

  if (!match) {
    return <div className={`bracket-slot bracket-slot--empty${hasInputArm ? ' bracket-slot--arm' : ''}`} />
  }

  const dateLabel = formatSlotDate(match.date)
  const homeDisplay = match.home || match.homeLabel || 'TBD'
  const awayDisplay = match.away || match.awayLabel || 'TBD'
  const homeIsLabel = !match.home && !!match.homeLabel
  const awayIsLabel = !match.away && !!match.awayLabel

  return (
    <div className={`bracket-slot${!isHighlighted ? ' bracket-slot--dim' : ''}${hasInputArm ? ' bracket-slot--arm' : ''}`}>
      {dateLabel && (
        <div className="bracket-slot__date">{dateLabel} · {match.time}</div>
      )}
      <TeamRow
        team={homeDisplay} user={homeUser}
        score={match.homeScore} isWinner={homeWin} isLabel={homeIsLabel}
      />
      <div className="bracket-slot__divider" />
      <TeamRow
        team={awayDisplay} user={awayUser}
        score={match.awayScore} isWinner={awayWin} isLabel={awayIsLabel}
      />
    </div>
  )
}

// Groups matches into consecutive pairs for connector lines
function pairUp(matches) {
  const pairs = []
  for (let i = 0; i < matches.length; i += 2) {
    pairs.push([matches[i], matches[i + 1] ?? null])
  }
  return pairs
}

export function Knockout({ selectedUser }) {
  const allTbd = Object.values(bracket).every(round =>
    round.every(m => m.home === null && m.away === null)
  )

  return (
    <div className="tab-content">
      <div className="bracket-scroll">
        <div className="bracket-container">
          {ROUNDS.map((roundKey, roundIdx) => {
            const matches = bracket[roundKey]
            const isFinal = roundKey === 'final'
            const hasInputArm = roundIdx > 0
            const pairs = isFinal ? null : pairUp(matches)

            return (
              <div key={roundKey} className="bracket-round">
                <div className="bracket-round__label">{roundLabels[roundKey]}</div>
                <div className="bracket-round__matches">
                  {isFinal
                    ? <MatchSlot match={matches[0]} selectedUser={selectedUser} hasInputArm={hasInputArm} />
                    : pairs.map((pair, i) => (
                        <div key={i} className="bracket-pair">
                          <MatchSlot match={pair[0]} selectedUser={selectedUser} hasInputArm={hasInputArm} />
                          <MatchSlot match={pair[1]} selectedUser={selectedUser} hasInputArm={hasInputArm} />
                        </div>
                      ))
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {allTbd && (
        <p className="empty-state">Knockout bracket will populate once the group stage is complete.</p>
      )}
    </div>
  )
}
