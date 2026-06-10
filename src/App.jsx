import { useState, useRef } from 'react'
import './App.css'

import { users } from './data/users'
import { Fixtures } from './components/Fixtures'
import { Groups } from './components/Groups'
import { Knockout } from './components/Knockout'
import { PostItBoard } from './components/PostItBoard'

const TABS = [
  { id: 'fixtures',   label: '🗓 Fixtures' },
  { id: 'groups',     label: '📊 Groups' },
  { id: 'knockout',   label: '🥊 Knockout' },
  { id: 'postit',     label: '📌 Challenges' },
  { id: 'champions',  label: '🏆 Champions', href: 'https://www.youtube.com/watch?v=RJqimlFcJsM' },
]


const TAB_IDS = TABS.filter(t => !t.href).map(t => t.id)

export default function App() {
  const [activeTab, setActiveTab] = useState('fixtures')
  const [selectedUser, setSelectedUser] = useState(null)
  const [animKey, setAnimKey] = useState(0)
  const activeTabRef = useRef('fixtures')
  const slideDirRef = useRef('right')

  const toggleUser = (slug) => {
    setSelectedUser(prev => (prev === slug ? null : slug))
  }

  const handleTabChange = (tabId) => {
    const currentIdx = TAB_IDS.indexOf(activeTabRef.current)
    const newIdx = TAB_IDS.indexOf(tabId)
    slideDirRef.current = newIdx >= currentIdx ? 'right' : 'left'
    activeTabRef.current = tabId
    setAnimKey(k => k + 1)
    setActiveTab(tabId)
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__title-row">
          <h1 className="app-header__title">World Cup Sweepstake</h1>
        </div>
        <p className="app-header__subtitle">
          <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/ca.svg" alt="Canada" className="host-flag" />
          Canada
          <span className="host-sep">·</span>
          <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/mx.svg" alt="Mexico" className="host-flag" />
          Mexico
          <span className="host-sep">·</span>
          <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/us.svg" alt="USA" className="host-flag" />
          USA
        </p>
        <div className="app-header__divider" />
        <p className="app-header__crew-label">The Crew</p>
        <div className="app-header__crew">
          {users.map(user => (
            <div
              key={user.slug}
              className={`crew-avatar ${selectedUser === user.slug ? 'crew-avatar--active' : ''}`}
              style={{ '--colour': user.colour }}
              title={user.name}
              onClick={() => toggleUser(user.slug)}
            >
              <img
                src={`${import.meta.env.BASE_URL}avatars/${user.avatar}`}
                alt={user.name}
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          ))}
        </div>
      </header>

      {/* ── User Filter ── */}
      <div className="user-filter">
        <select
          className="user-filter__select"
          value={selectedUser || ''}
          onChange={e => setSelectedUser(e.target.value || null)}
        >
          <option value="">All participants</option>
          {users.map(user => (
            <option key={user.slug} value={user.slug}>{user.name}</option>
          ))}
        </select>
      </div>

      {/* ── Tab Nav ── */}
      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
            onClick={() => {
              if (tab.href) {
                window.open(tab.href, '_blank', 'noopener,noreferrer')
              } else {
                handleTabChange(tab.id)
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Tab Content ── */}
      <div className="tab-content-clip">
        <div key={animKey} className={`tab-slide-${slideDirRef.current}`}>
          {activeTab === 'fixtures' && <Fixtures selectedUser={selectedUser} />}
          {activeTab === 'groups'   && <Groups   selectedUser={selectedUser} />}
          {activeTab === 'knockout' && <Knockout selectedUser={selectedUser} />}
          {activeTab === 'postit'   && <PostItBoard selectedUser={selectedUser} />}
        </div>
      </div>
    </div>
  )
}
