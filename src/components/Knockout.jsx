import { bracket, roundLabels } from '../data/knockout'
import { assignments } from '../data/sweepstake'
import { users } from '../data/users'

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

function MatchSlot({ match, selectedUser }) {
  if (!match) return <div className="bracket-slot bracket-slot--empty" />

  const homeUser = getUser(match.home)
  const awayUser = getUser(match.away)
  const isHighlighted =
    !selectedUser ||
    (homeUser && homeUser.slug === selectedUser) ||
    (awayUser && awayUser.slug === selectedUser)

  const isPlayed = match.homeScore !== null && match.awayScore !== null
  const homeWin = isPlayed && match.homeScore > match.awayScore
  const awayWin = isPlayed && match.awayScore > match.homeScore

  function TeamRow({ team, user, score, isWinner }) {
    const flagSrc = getFlag(team)
    return (
      <div className={`bracket-team ${isWinner ? 'bracket-team--winner' : ''} ${!team ? 'bracket-team--tbd' : ''}`}>
        <div className="bracket-team__info">
          {flagSrc && (
            <img
              src={flagSrc}
              alt=""
              className="team-flag team-flag--sm"
              onError={e => { e.target.style.display = 'none' }}
            />
          )}
          <span className="bracket-team__name">{team || 'TBD'}</span>
          {user && (
            <span
              className="bracket-team__owner"
              style={{ color: user.colour }}
            >
              {user.name}
            </span>
          )}
        </div>
        <span className="bracket-team__score">
          {score !== null && score !== undefined ? score : ''}
        </span>
      </div>
    )
  }

  return (
    <div className={`bracket-slot ${!isHighlighted ? 'bracket-slot--dim' : ''}`}>
      <TeamRow team={match.home} user={homeUser} score={match.homeScore} isWinner={homeWin} />
      <div className="bracket-slot__divider" />
      <TeamRow team={match.away} user={awayUser} score={match.awayScore} isWinner={awayWin} />
    </div>
  )
}

export function Knockout({ selectedUser }) {
  const rounds = ['r16', 'qf', 'sf', 'final']

  return (
    <div className="tab-content">
      <div className="bracket-container">
        {rounds.map(round => (
          <div key={round} className="bracket-round">
            <h3 className="bracket-round__label">{roundLabels[round]}</h3>
            <div className="bracket-round__matches">
              {bracket[round].map(match => (
                <MatchSlot key={match.id} match={match} selectedUser={selectedUser} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {Object.values(bracket).every(round => round.every(m => m.home === null)) && (
        <p className="empty-state">Knockout bracket will populate once the group stage is complete.</p>
      )}
    </div>
  )
}
