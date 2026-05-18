import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

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

// NABARD official logo colours: deep blue #003087, gold #C9A84C
function NabardLogo() {
  return (
    <svg viewBox="0 0 120 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="nabard-logo-svg">
      {/* Emblem */}
      <circle cx="22" cy="22" r="18" fill="rgba(255,255,255,0.92)"/>
      {/* Stylised leaf / drops */}
      <path d="M22 10 C18 14 14 18 14 22 C14 26 18 30 22 30 C26 30 30 26 30 22 C30 18 26 14 22 10Z" fill="#003087" opacity="0.15"/>
      <path d="M22 10 C22 10 28 16 28 22 C28 27.5 25.3 30 22 30" stroke="#003087" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M22 10 C22 10 16 16 16 22 C16 27.5 18.7 30 22 30" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="22" cy="22" r="3" fill="#003087"/>
      {/* NABARD text */}
      <text x="46" y="18" fontFamily="Georgia, serif" fontWeight="700" fontSize="13" fill="white" letterSpacing="1.5">NABARD</text>
      <line x1="46" y1="22" x2="118" y2="22" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
      <text x="46" y="33" fontFamily="sans-serif" fontWeight="400" fontSize="7" fill="rgba(255,255,255,0.55)" letterSpacing="0.3">National Bank for Agriculture</text>
      <text x="46" y="42" fontFamily="sans-serif" fontWeight="400" fontSize="7" fill="rgba(255,255,255,0.55)" letterSpacing="0.3">and Rural Development</text>
    </svg>
  )
}

export default function Sidebar({ fpos, selectedFpo, onFpoChange, demo }) {
  const { logout } = useAuth()

  return (
    <aside className="sidebar">
      {/* Deepflow brand at top */}
      <div className="sb-brand">
        <div className="sb-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="rgba(255,255,255,0.1)"/>
            <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12" stroke="rgba(255,255,255,0.45)" strokeWidth="2.2" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="3" fill="white"/>
          </svg>
        </div>
        <div>
          <div className="sb-name">Soil Sensor</div>
          <div className="sb-name-2">Dashboard</div>
        </div>
      </div>

      {/* NABARD logo strip */}
      <div className="sb-nabard">
        <NabardLogo />
      </div>

      <div className="sb-org">KERALA FPO NETWORK</div>

      <nav className="sb-nav">
        <div className="sb-nav-label">Navigation</div>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
            <span className="sb-link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sb-filter">
        <div className="sb-nav-label">Filter by FPO</div>
        <select className="sb-select" value={selectedFpo} onChange={(e) => onFpoChange(e.target.value)}>
          <option value="All">All</option>
          {fpos.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="sb-footer">
        <button className="sb-logout" onClick={logout}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  )
}
