import { useState } from 'react'
import './App.css'

import { users } from './data/users'
import { Fixtures } from './components/Fixtures'
import { Groups } from './components/Groups'
import { Knockout } from './components/Knockout'
import { PostItBoard } from './components/PostItBoard'

const TABS = [
  { id: 'fixtures',  label: '🗓 Fixtures' },
  { id: 'groups',    label: '📊 Groups' },
  { id: 'knockout',  label: '🏆 Knockout' },
  { id: 'postit',    label: '📌 Challenges' },
]

function UserChip({ user, isActive, onClick }) {
  return (
    <button
      className={`user-chip ${isActive ? 'user-chip--active' : ''}`}
      onClick={onClick}
      style={isActive ? { borderColor: user.colour, color: user.colour } : {}}
      title={user.name}
    >
      <img
        src={`/sweepstake/avatars/${user.avatar}`}
        alt={user.name}
        className="user-chip__avatar"
        onError={e => {
          e.target.style.display = 'none'
          // Show initial fallback
          const span = document.createElement('span')
          span.className = 'user-chip__avatar--placeholder'
          span.textContent = user.name[0]
          e.target.parentNode.insertBefore(span, e.target)
        }}
      />
      {user.name}
    </button>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('fixtures')
  const [selectedUser, setSelectedUser] = useState(null)

  const toggleUser = (slug) => {
    setSelectedUser(prev => (prev === slug ? null : slug))
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <h1 className="app-header__title">World Cup Sweepstake</h1>
        <p className="app-header__subtitle">2026 · Canada · Mexico · USA</p>
      </header>

      {/* ── User Filter ── */}
      <div className="user-filter">
        <p className="user-filter__label">Filter by participant</p>
        <div className="user-filter__chips">
          {users.map(user => (
            <UserChip
              key={user.slug}
              user={user}
              isActive={selectedUser === user.slug}
              onClick={() => toggleUser(user.slug)}
            />
          ))}
        </div>
      </div>

      {/* ── Tab Nav ── */}
      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Tab Content ── */}
      {activeTab === 'fixtures' && <Fixtures selectedUser={selectedUser} />}
      {activeTab === 'groups'   && <Groups   selectedUser={selectedUser} />}
      {activeTab === 'knockout' && <Knockout selectedUser={selectedUser} />}
      {activeTab === 'postit'   && <PostItBoard />}
    </div>
  )
}
