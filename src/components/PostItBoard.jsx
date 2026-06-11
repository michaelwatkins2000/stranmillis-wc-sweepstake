import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { users } from '../data/users'
import { fixtures } from '../data/fixtures'
import { assignments } from '../data/sweepstake'

const FILTERS = ['all', 'open', 'accepted', 'completed', 'rejected']

const UPCOMING = fixtures.filter(f =>
  f.home && f.away && f.homeScore === null && f.awayScore === null
)

function flagUrl(team) {
  const code = assignments[team]?.flag
  return code ? `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${code}.svg` : null
}

function formatFixtureLabel(f) {
  const d = new Date(f.date + 'T00:00:00')
  const day = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${f.home} vs ${f.away} · ${day}, ${f.time}`
}

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function getUser(slug) {
  return users.find(u => u.slug === slug) || null
}

function Avatar({ slug, size = 28 }) {
  const user = getUser(slug)
  if (!user) return null
  return (
    <img
      src={`${import.meta.env.BASE_URL}avatars/${user.avatar}`}
      alt={user.name}
      className="post-card__avatar"
      style={{ width: size, height: size, borderColor: user.colour }}
      onError={e => { e.target.style.display = 'none' }}
    />
  )
}

function PostCard({ post }) {
  const [respondAs, setRespondAs]         = useState('')
  const [responding, setResponding]       = useState(false)
  const [showCounter, setShowCounter]     = useState(false)
  const [counterAs, setCounterAs]         = useState('')
  const [counterText, setCounterText]     = useState('')
  const [submittingCounter, setSubmittingCounter] = useState(false)

  const author        = getUser(post.author_slug)
  const recipient     = post.recipient_slug          ? getUser(post.recipient_slug)          : null
  const responder     = post.responder_slug           ? getUser(post.responder_slug)           : null
  const counterAuthor = post.counteroffer_author_slug ? getUser(post.counteroffer_author_slug) : null
  const isOpen        = post.status === 'open'
  const hasTarget     = !!post.recipient_slug
  const hasCounter    = !!post.counteroffer_message

  // When a counteroffer exists, the original post author responds (they're known — no dropdown needed).
  // Otherwise fall back to the target, or the "respond as" selection for open posts.
  const needsRespondAs = !hasCounter && !hasTarget

  async function respond(accepted) {
    const slug = hasCounter
      ? post.author_slug
      : hasTarget ? post.recipient_slug : respondAs
    if (!slug) return
    setResponding(true)
    await supabase
      .from('posts')
      .update({ status: accepted ? 'accepted' : 'rejected', responder_slug: slug })
      .eq('id', post.id)
    setResponding(false)
  }

  async function submitCounter(e) {
    e.preventDefault()
    if (!counterAs || !counterText.trim()) return
    setSubmittingCounter(true)
    await supabase
      .from('posts')
      .update({
        counteroffer_message:     counterText.trim(),
        counteroffer_author_slug: counterAs,
      })
      .eq('id', post.id)
    setSubmittingCounter(false)
    setShowCounter(false)
    setCounterAs('')
    setCounterText('')
  }

  return (
    <div
      className="post-card"
      style={{ '--author-colour': author?.colour || 'var(--border)' }}
    >
      {/* Header */}
      <div className="post-card__header">
        <div className="post-card__author">
          <Avatar slug={post.author_slug} />
          <span className="post-card__name" style={{ color: author?.colour }}>
            {author?.name || post.author_slug}
          </span>
        </div>
        <span className="post-card__time">{relativeTime(post.created_at)}</span>
      </div>

      {/* Recipient tag */}
      {recipient && (
        <div className="post-card__recipient">
          <span className="post-card__recipient-label">→</span>
          <Avatar slug={post.recipient_slug} size={20} />
          <span style={{ color: recipient?.colour }}>{recipient?.name}</span>
        </div>
      )}

      {/* Match reference */}
      {post.fixture_id && (() => {
        const f = fixtures.find(x => x.id === post.fixture_id)
        if (!f) return null
        const homeFlagUrl = flagUrl(f.home)
        const awayFlagUrl = flagUrl(f.away)
        const day = new Date(f.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        return (
          <div className="post-card__fixture">
            {homeFlagUrl && <img src={homeFlagUrl} className="post-card__fixture-flag" alt="" />}
            {f.home} vs {f.away}
            {awayFlagUrl && <img src={awayFlagUrl} className="post-card__fixture-flag" alt="" />}
            <span className="post-card__fixture-date">· {day}, {f.time}</span>
          </div>
        )
      })()}

      {/* Message */}
      <p className="post-card__message">{post.message}</p>

      {/* Counteroffer bubble */}
      {hasCounter && (
        <div className="post-card__counteroffer">
          <div className="post-card__counteroffer-header">
            <Avatar slug={post.counteroffer_author_slug} size={20} />
            <span
              className="post-card__counteroffer-name"
              style={{ color: counterAuthor?.colour }}
            >
              {counterAuthor?.name || post.counteroffer_author_slug}
            </span>
            <span className="post-card__counteroffer-label">countered</span>
          </div>
          <p className="post-card__counteroffer-message">{post.counteroffer_message}</p>
        </div>
      )}

      {/* Response area */}
      {isOpen ? (
        <div className="post-card__respond">
          {showCounter ? (
            <form className="post-card__counter-form" onSubmit={submitCounter}>
              <select
                className="post-card__respond-select"
                value={counterAs}
                onChange={e => setCounterAs(e.target.value)}
                required
              >
                <option value="">Counter as...</option>
                {users
                  .filter(u => u.slug !== post.author_slug)
                  .map(u => <option key={u.slug} value={u.slug}>{u.name}</option>)
                }
              </select>
              <textarea
                className="post-card__counter-textarea"
                placeholder="Your counter proposal..."
                value={counterText}
                onChange={e => setCounterText(e.target.value)}
                rows={2}
                maxLength={280}
                required
              />
              <div className="post-card__respond-btns">
                <button
                  type="submit"
                  className="post-card__btn post-card__btn--counter"
                  disabled={submittingCounter || !counterAs || !counterText.trim()}
                >
                  {submittingCounter ? 'Sending...' : '⟳ Send Counter'}
                </button>
                <button
                  type="button"
                  className="post-card__btn post-card__btn--reject"
                  onClick={() => { setShowCounter(false); setCounterAs(''); setCounterText('') }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {needsRespondAs && (
                <select
                  className="post-card__respond-select"
                  value={respondAs}
                  onChange={e => setRespondAs(e.target.value)}
                >
                  <option value="">Respond as...</option>
                  {users
                    .filter(u => u.slug !== post.author_slug)
                    .map(u => <option key={u.slug} value={u.slug}>{u.name}</option>)
                  }
                </select>
              )}
              <div className="post-card__respond-btns">
                <button
                  className="post-card__btn post-card__btn--accept"
                  onClick={() => respond(true)}
                  disabled={responding || (needsRespondAs && !respondAs)}
                >✓ Accept</button>
                {!hasCounter && (
                  <button
                    className="post-card__btn post-card__btn--counter"
                    onClick={() => setShowCounter(true)}
                    disabled={responding}
                  >⟳ Counter</button>
                )}
                <button
                  className="post-card__btn post-card__btn--reject"
                  onClick={() => respond(false)}
                  disabled={responding || (needsRespondAs && !respondAs)}
                >✗ Reject</button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="post-card__status-row">
          <div className={`post-card__status post-card__status--${post.status}`}>
            <Avatar slug={post.responder_slug} size={22} />
            <span>
              {post.status === 'accepted'  && `✓ Accepted${responder ? ` by ${responder.name}` : ''}`}
              {post.status === 'completed' && `★ Completed${responder ? ` by ${responder.name}` : ''}`}
              {post.status === 'rejected'  && `✗ Rejected${responder ? ` by ${responder.name}` : ''}`}
            </span>
          </div>
          {post.status === 'accepted' && (
            <button
              className="post-card__btn post-card__btn--complete"
              onClick={async () => {
                await supabase.from('posts').update({ status: 'completed' }).eq('id', post.id)
              }}
            >★ Complete</button>
          )}
        </div>
      )}
    </div>
  )
}

export function PostItBoard({ selectedUser }) {
  const [posts, setPosts]                   = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)
  const [filter, setFilter]                 = useState('all')
  const [authorSlug, setAuthorSlug]         = useState('')
  const [recipientSlug, setRecipientSlug]   = useState('')
  const [fixtureId, setFixtureId]           = useState('')
  const [message, setMessage]               = useState('')
  const [submitting, setSubmitting]         = useState(false)

  useEffect(() => {
    if (!supabase) {
      setError('Challenges board is not configured (missing environment variables).')
      setLoading(false)
      return
    }

    fetchPosts()

    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
        setPosts(prev => [payload.new, ...prev])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, payload => {
        setPosts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setPosts(data)
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!authorSlug || !message.trim()) return
    setSubmitting(true)

    const { error } = await supabase.from('posts').insert({
      author_slug:    authorSlug,
      recipient_slug: recipientSlug || null,
      fixture_id:     fixtureId ? Number(fixtureId) : null,
      message:        message.trim(),
      status:         'open',
    })

    if (error) setError(error.message)
    else { setMessage(''); setRecipientSlug(''); setFixtureId('') }
    setSubmitting(false)
  }

  const visible = posts.filter(p => {
    const matchesStatus = filter === 'all' || p.status === filter
    const matchesUser   = !selectedUser
      || p.author_slug === selectedUser
      || p.recipient_slug === selectedUser
      || p.responder_slug === selectedUser
      || p.counteroffer_author_slug === selectedUser
    return matchesStatus && matchesUser
  })

  const filterUserName = selectedUser ? getUser(selectedUser)?.name : null

  return (
    <div className="tab-content">

      {/* ── Compose ── */}
      <form className="post-compose" onSubmit={handleSubmit}>
        <div className="post-compose__row">
          <select
            className="post-compose__select"
            value={authorSlug}
            onChange={e => setAuthorSlug(e.target.value)}
            required
          >
            <option value="">Post as...</option>
            {users.map(u => <option key={u.slug} value={u.slug}>{u.name}</option>)}
          </select>
          <select
            className="post-compose__select"
            value={recipientSlug}
            onChange={e => setRecipientSlug(e.target.value)}
          >
            <option value="">To everyone</option>
            {users
              .filter(u => u.slug !== authorSlug)
              .map(u => <option key={u.slug} value={u.slug}>→ {u.name}</option>)
            }
          </select>
        </div>
        <select
          className="post-compose__select post-compose__select--full"
          value={fixtureId}
          onChange={e => setFixtureId(e.target.value)}
        >
          <option value="">No specific match</option>
          {UPCOMING.map(f => (
            <option key={f.id} value={f.id}>{formatFixtureLabel(f)}</option>
          ))}
        </select>
        <textarea
          className="post-compose__textarea"
          placeholder="💰 Write your Challenge here... 🍻"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          maxLength={280}
          required
        />
        <div className="post-compose__footer">
          <span className="post-compose__count">{message.length}/280</span>
          <button
            className="post-compose__submit"
            type="submit"
            disabled={submitting || !authorSlug || !message.trim()}
          >
            {submitting ? 'Posting...' : 'Post 📌'}
          </button>
        </div>
      </form>

      {error && <p className="post-error">{error}</p>}

      {/* ── Status filter pills ── */}
      <div className="filter-pills">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`pill ${f !== 'all' ? `pill--${f}` : ''} ${filter === f ? 'pill--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Board ── */}
      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : visible.length === 0 ? (
        <p className="empty-state">
          {filter === 'all' && !selectedUser
            ? 'No posts yet — be the first to post a challenge!'
            : `No ${filter === 'all' ? '' : filter + ' '}challenges${filterUserName ? ` involving ${filterUserName}` : ''}.`
          }
        </p>
      ) : (
        <div className="post-grid">
          {visible.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}

    </div>
  )
}
