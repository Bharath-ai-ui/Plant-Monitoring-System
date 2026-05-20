import { useState } from 'react';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'camera',    label: 'Live Feed',  icon: '📹' },
  { id: 'analytics', label: 'Analytics',  icon: '📈' },
  { id: 'history',   label: 'History',    icon: '🕰️' },
  { id: 'settings',  label: 'Settings',   icon: '⚙️' },
];

export default function Sidebar({ isDetecting, connectionStatus }) {
  const [active, setActive] = useState('dashboard');

  return (
    <aside className="sidebar" id="sidebar-nav">
      {/* ── Brand ──────────────────────────────────────────── */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">🌿</span>
        </div>
        <div className="sidebar__brand-text">
          <h1 className="sidebar__title">AgriSense</h1>
          <span className="sidebar__subtitle">Smart Agriculture</span>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className="sidebar__nav">
        <span className="sidebar__nav-label">MENU</span>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`sidebar__link ${active === item.id ? 'sidebar__link--active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            <span className="sidebar__link-label">{item.label}</span>
            {active === item.id && <span className="sidebar__link-indicator" />}
          </button>
        ))}
      </nav>

      {/* ── Status ─────────────────────────────────────────── */}
      <div className="sidebar__status">
        <div className="sidebar__status-item">
          <span className={`sidebar__status-dot ${connectionStatus === 'connected' ? 'sidebar__status-dot--live' : 'sidebar__status-dot--off'}`} />
          <span className="sidebar__status-text">
            {connectionStatus === 'connected' ? 'ESP32 Connected' : 'ESP32 Offline'}
          </span>
        </div>
        <div className="sidebar__status-item">
          <span className={`sidebar__status-dot ${isDetecting ? 'sidebar__status-dot--active' : 'sidebar__status-dot--off'}`} />
          <span className="sidebar__status-text">
            {isDetecting ? 'AI Active' : 'AI Idle'}
          </span>
        </div>
      </div>
    </aside>
  );
}
