import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const DEEPFLOW_LOGO = 'https://nabard-soil-monitor.vercel.app/images/Logo_Long.png'
const NABARD_LOGO   = 'https://nabard-soil-monitor.vercel.app/images/1303194734NABARD-ENG-logo-big.png'

const NAV = [
  {
    to: '/dashboard', label: 'Overview',
    icon: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333a1 1 0 011-1h1a1 1 0 011 1v6.334a1 1 0 01-1 1H7a1 1 0 01-1-1v-6.334zm5-6a1 1 0 011-1h1a1 1 0 011 1v12.334a1 1 0 01-1 1h-1a1 1 0 01-1-1V4.333z"/></svg>,
  },
  {
    to: '/analysis', label: 'Analysis',
    icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd"/></svg>,
  },
  {
    to: '/data', label: 'Data Table',
    icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"/></svg>,
  },
]

export default function Sidebar({ fpos, selectedFpo, onFpoChange, collapsed, onToggle }) {
  const { logout } = useAuth()

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Collapse toggle */}
      <button className="sb-toggle" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          {collapsed
            ? <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            : <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
          }
        </svg>
      </button>

      {/* Deepflow brand */}
      <div className="sb-brand">
        {collapsed
          ? <div className="sb-icon-sm">
              <svg viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="rgba(255,255,255,0.1)"/>
                <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12" stroke="rgba(255,255,255,0.45)" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="16" cy="16" r="3" fill="white"/>
              </svg>
            </div>
          : <img src={DEEPFLOW_LOGO} alt="Deepflow" className="sb-deepflow-logo" />
        }
      </div>

      {/* NABARD logo strip */}
      {!collapsed && (
        <div className="sb-nabard">
          <img src={NABARD_LOGO} alt="NABARD" className="sb-nabard-logo" />
        </div>
      )}

      {!collapsed && <div className="sb-org">KERALA FPO NETWORK</div>}

      <nav className="sb-nav">
        {!collapsed && <div className="sb-nav-label">Navigation</div>}
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`} title={collapsed ? item.label : undefined}>
            <span className="sb-link-icon">{item.icon}</span>
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="sb-filter">
          <div className="sb-nav-label">Filter by FPO</div>
          <select className="sb-select" value={selectedFpo} onChange={(e) => onFpoChange(e.target.value)}>
            <option value="All">All</option>
            {fpos.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      )}

      <div className="sb-footer">
        <button className="sb-logout" onClick={logout} title="Sign out">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" style={{flexShrink:0}}>
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
          </svg>
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  )
}
