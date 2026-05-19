import React, { useState, useEffect, createContext } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import { apiUsers, apiMetrics, apiPlots } from '../api.js'
import { generateSampleData } from '../sampleData.js'

export const DataContext = createContext(null)

async function fetchFromBackend() {
  const usersRes = await apiUsers({ limit: 200 })
  const users = usersRes.data?.results || usersRes.data || []

  const allMetrics = []
  const fpoSet = new Set()

  for (const user of users) {
    const place = user.place || 'Unknown'
    fpoSet.add(place)

    const plotsRes = await apiPlots(user.id)
    const plots = plotsRes.data?.results || plotsRes.data || []

    for (const plot of plots) {
      const mRes = await apiMetrics(plot.id, { limit: 200 })
      const metrics = mRes.data?.results || mRes.data || []
      metrics.forEach((m) =>
        allMetrics.push({ ...m, fpo: place, plotName: plot.name, farmerName: user.full_name })
      )
    }
  }

  if (allMetrics.length === 0) throw new Error('no_data')
  return { metrics: allMetrics, fpos: [...fpoSet].sort() }
}

export default function Layout() {
  const [data, setData]           = useState({ metrics: [], fpos: [], loading: true, error: '', demo: false })
  const [selectedFpo, setSelectedFpo] = useState('All')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    const { metrics: sampleMetrics, fpos: sampleFpos } = generateSampleData()
    setData({ metrics: sampleMetrics, fpos: sampleFpos, loading: false, error: '', demo: true })

    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000))
    Promise.race([fetchFromBackend(), timeout])
      .then(({ metrics, fpos }) => setData({ metrics, fpos, loading: false, error: '', demo: false }))
      .catch(() => { /* keep sample data */ })
  }, [])

  const filtered = selectedFpo === 'All'
    ? data.metrics
    : data.metrics.filter((m) => m.fpo === selectedFpo)

  return (
    <DataContext.Provider value={{ ...data, filtered, selectedFpo }}>
      <div className={`app-shell${collapsed ? ' sb-collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
        {/* Mobile backdrop */}
        {mobileOpen && <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />}

        <Sidebar collapsed={collapsed} />

        {/* Desktop collapse toggle */}
        <button
          className="sb-toggle sb-toggle-desktop"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            {collapsed
              ? <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              : <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
            }
          </svg>
        </button>

        <main className="main-content">
          <div className="top-bar">
            {/* Hamburger — mobile only */}
            <button className="hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Open menu">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
            <div className="top-bar-left" />
            <div className="top-bar-filter">
              <label className="top-bar-label">Filter by FPO</label>
              <select
                className="top-bar-select"
                value={selectedFpo}
                onChange={(e) => setSelectedFpo(e.target.value)}
              >
                <option value="All">All FPOs</option>
                {data.fpos.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </DataContext.Provider>
  )
}
