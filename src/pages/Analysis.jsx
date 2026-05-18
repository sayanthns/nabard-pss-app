import { useContext, useMemo } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line, Scatter } from 'react-chartjs-2'
import { DataContext } from '../components/Layout.jsx'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const lineOpts = {
  responsive: true, maintainAspectRatio: false, animation: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#9CA3AF', maxTicksLimit: 8 } },
    y: { grid: { color: '#F0EDE6' }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#6B7280' } },
  },
  elements: { point: { radius: 0, hoverRadius: 4 }, line: { tension: 0.35 } },
}

export default function Analysis() {
  const { filtered, loading, error } = useContext(DataContext)

  const trends = useMemo(() => {
    const byDate = {}
    filtered.forEach((m) => {
      if (!m.time) return
      const d = m.time.slice(0, 10)
      if (!byDate[d]) byDate[d] = { ph:[], ec:[], temp:[], moist:[] }
      if (m.soil_ph != null) byDate[d].ph.push(m.soil_ph)
      if (m.soil_electricity_conductivity != null) byDate[d].ec.push(m.soil_electricity_conductivity)
      if (m.soil_temperature != null) byDate[d].temp.push(m.soil_temperature)
      if (m.soil_humidity != null) byDate[d].moist.push(m.soil_humidity)
    })
    const dates = Object.keys(byDate).sort()
    const mean = (arr) => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null
    return {
      labels: dates,
      ph:    dates.map(d => mean(byDate[d].ph)),
      ec:    dates.map(d => mean(byDate[d].ec)),
      temp:  dates.map(d => mean(byDate[d].temp)),
      moist: dates.map(d => mean(byDate[d].moist)),
    }
  }, [filtered])

  const scatterData = useMemo(() =>
    filtered
      .filter(m => m.soil_ph != null && m.soil_electricity_conductivity != null)
      .slice(0, 400)
      .map(m => ({ x: m.soil_ph, y: m.soil_electricity_conductivity }))
  , [filtered])

  const mkLine = (data, color, fill = false) => ({
    labels: trends.labels,
    datasets: [{
      data,
      borderColor: color,
      backgroundColor: fill ? color + '18' : 'transparent',
      fill,
      borderWidth: 2,
    }],
  })

  if (loading) return <div className="page-loader"><div className="loader-spin" /><p>Loading data…</p></div>
  if (error)   return <div className="page-error">{error}</div>

  const tiles = [
    { title: 'pH Over Time',          sub: 'Average daily soil pH',          data: trends.ph,    color: '#2E7D52', fill: true },
    { title: 'EC Over Time',          sub: 'Electrical conductivity trend',   data: trends.ec,    color: '#C9820F', fill: false },
    { title: 'Temperature Over Time', sub: 'Avg soil temperature (°C)',       data: trends.temp,  color: '#F59E0B', fill: false },
    { title: 'Moisture Over Time',    sub: 'Avg soil moisture (%)',           data: trends.moist, color: '#06B6D4', fill: true },
  ]

  return (
    <div className="page-inner">
      <div className="page-header">
        <div><h1 className="page-title">Analysis</h1><p className="page-sub">Trends and correlations across time</p></div>
      </div>

      <div className="analysis-grid">
        {tiles.map((tile) => (
          <div key={tile.title} className="chart-card">
            <div className="chart-card-header"><h3>{tile.title}</h3><p>{tile.sub}</p></div>
            <div className="chart-body">
              {trends.labels.length > 1
                ? <Line data={mkLine(tile.data, tile.color, tile.fill)} options={lineOpts} />
                : <div className="no-chart">Not enough data</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card" style={{ marginTop: 24 }}>
        <div className="chart-card-header">
          <h3>pH vs EC Correlation</h3>
          <p>Scatter plot — 400 recent readings</p>
        </div>
        <div className="chart-body" style={{ height: 300 }}>
          {scatterData.length ? (
            <Scatter
              data={{ datasets: [{ label: 'pH vs EC', data: scatterData, backgroundColor: 'rgba(46,125,82,0.2)', pointRadius: 3 }] }}
              options={{
                responsive: true, maintainAspectRatio: false, animation: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { title: { display: true, text: 'pH', font: { family: 'Plus Jakarta Sans', size: 12 } }, grid: { color: '#F0EDE6' } },
                  y: { title: { display: true, text: 'EC (μS/cm)', font: { family: 'Plus Jakarta Sans', size: 12 } }, grid: { color: '#F0EDE6' } },
                },
              }}
            />
          ) : <div className="no-chart">Not enough data</div>}
        </div>
      </div>
    </div>
  )
}
