import { useContext, useMemo } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Scatter } from 'react-chartjs-2'
import { DataContext } from '../components/Layout.jsx'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler)

const CHART_COLORS = ['#2E7D52', '#C9820F', '#4A90D9', '#E05C5C', '#8B5CF6', '#06B6D4']

const barOpts = (yLabel) => ({
  responsive: true, maintainAspectRatio: false, animation: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#6B7280' } },
    y: {
      grid: { color: '#F0EDE6' },
      ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#6B7280' },
      title: { display: !!yLabel, text: yLabel, font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#6B7280' },
    },
  },
})

export default function Analysis() {
  const { filtered, loading, error } = useContext(DataContext)

  const fpoStats = useMemo(() => {
    const map = {}
    filtered.forEach((m) => {
      if (!map[m.fpo]) map[m.fpo] = { ph:[], ec:[], n:[], p:[], k:[], temp:[], moist:[] }
      if (m.soil_ph != null)                      map[m.fpo].ph.push(m.soil_ph)
      if (m.soil_electricity_conductivity != null) map[m.fpo].ec.push(m.soil_electricity_conductivity)
      if (m.nitrogen != null)                      map[m.fpo].n.push(m.nitrogen)
      if (m.phosphorus != null)                    map[m.fpo].p.push(m.phosphorus)
      if (m.potassium != null)                     map[m.fpo].k.push(m.potassium)
      if (m.soil_temperature != null)              map[m.fpo].temp.push(m.soil_temperature)
      if (m.soil_humidity != null)                 map[m.fpo].moist.push(m.soil_humidity)
    })
    const labels = Object.keys(map).sort()
    const mean = (arr) => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(2) : 0
    return {
      labels,
      ph:    labels.map(f => mean(map[f].ph)),
      ec:    labels.map(f => mean(map[f].ec)),
      n:     labels.map(f => mean(map[f].n)),
      p:     labels.map(f => mean(map[f].p)),
      k:     labels.map(f => mean(map[f].k)),
      temp:  labels.map(f => mean(map[f].temp)),
      moist: labels.map(f => mean(map[f].moist)),
    }
  }, [filtered])

  const scatterData = useMemo(() =>
    filtered
      .filter(m => m.soil_ph != null && m.soil_electricity_conductivity != null)
      .slice(0, 500)
      .map(m => ({ x: m.soil_ph, y: m.soil_electricity_conductivity }))
  , [filtered])

  const mkBar = (data, yLabel) => ({
    data: { labels: fpoStats.labels, datasets: [{ data, backgroundColor: CHART_COLORS, borderRadius: 6, borderSkipped: false }] },
    options: barOpts(yLabel),
  })

  if (loading) return <div className="page-loader"><div className="loader-spin" /><p>Loading data…</p></div>
  if (error)   return <div className="page-error">{error}</div>

  const tiles = [
    { title: 'Average pH by FPO',         sub: 'Soil pH per region',              ...mkBar(fpoStats.ph,    'pH') },
    { title: 'Average EC by FPO',          sub: 'Electrical conductivity (μS/cm)', ...mkBar(fpoStats.ec,    'μS/cm') },
    { title: 'Average Nitrogen by FPO',    sub: 'Available nitrogen (mg/kg)',      ...mkBar(fpoStats.n,     'mg/kg') },
    { title: 'Average Phosphorus by FPO',  sub: 'Available phosphorus (mg/kg)',    ...mkBar(fpoStats.p,     'mg/kg') },
    { title: 'Average Potassium by FPO',   sub: 'Available potassium (mg/kg)',     ...mkBar(fpoStats.k,     'mg/kg') },
    { title: 'Average Temperature by FPO', sub: 'Soil temperature (°C)',           ...mkBar(fpoStats.temp,  '°C') },
    { title: 'Average Moisture by FPO',    sub: 'Soil moisture (%)',               ...mkBar(fpoStats.moist, '%') },
  ]

  return (
    <div className="page-inner">
      <div className="page-header">
        <div><h1 className="page-title">Analysis</h1><p className="page-sub">Per-FPO averages and correlations</p></div>
      </div>

      <div className="analysis-grid">
        {tiles.map((tile) => (
          <div key={tile.title} className="chart-card">
            <div className="chart-card-header"><h3>{tile.title}</h3><p>{tile.sub}</p></div>
            <div className="chart-body">
              {fpoStats.labels.length
                ? <Bar data={tile.data} options={tile.options} />
                : <div className="no-chart">No data</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card" style={{ marginTop: 24 }}>
        <div className="chart-card-header">
          <h3>pH vs EC Correlation</h3>
          <p>Scatter plot — up to 500 readings</p>
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
          ) : <div className="no-chart">No data</div>}
        </div>
      </div>
    </div>
  )
}
