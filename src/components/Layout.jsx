import React, { useState, useEffect, createContext } from 'react'
import { Outlet } from 'react-router-dom'
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
  const [data, setData]     = useState({ metrics: [], fpos: [], loading: true, error: '', demo: false })
  const [selectedFpo, setSelectedFpo] = useState('All')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    // Load sample data immediately; swap to live data if backend responds within 4s
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
      <div className={`app-shell${collapsed ? ' sb-collapsed' : ''}`}>
        <Sidebar fpos={data.fpos} selectedFpo={selectedFpo} onFpoChange={setSelectedFpo} demo={data.demo} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        <main className="main-content">
          {data.demo && (
            <div className="demo-banner">
              📊 Showing sample data — connect to live backend to view real sensor readings
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </DataContext.Provider>
  )
}
