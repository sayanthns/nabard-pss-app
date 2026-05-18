import { useContext } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
  Title, PointElement, LineElement,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { DataContext } from '../components/Layout.jsx'
import StatCard from '../components/StatCard.jsx'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend, Title,
  PointElement, LineElement,
)

function avg(arr, key) {
  const vals = arr.map(m => m[key]).filter(v => v != null)
  if (!vals.length) return null
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
}

function groupByFpo(metrics, key) {
  const groups = {}
  metrics.forEach((m) => {
    if (!groups[m.fpo]) groups[m.fpo] = []
    if (m[key] != null) groups[m.fpo].push(m[key])
  })
  return groups
}

const CHART_COLORS = ['#2E7D52', '#52A874', '#7DC49A', '#A8D9BB', '#C9E8D4', '#E4F4EB']
const ACCENT_COLORS = {
  ph: '#2E7D52', ec: '#C9820F', n: '#4A90D9', p: '#E05C5C', k: '#8B5CF6', temp: '#F59E0B', moist: '#06B6D4',
}

export default function Overview() {
  const { filtered, fpos, loading, error, selectedFpo } = useContext(DataContext)

  if (loading) return <div className="page-loader"><div className="loader-spin" /><p>Loading data…</p></div>
  if (error) return <div className="page-error">{error}</div>

  const totalRecords = filtered.length
  const fpoCount = selectedFpo === 'All' ? fpos.length : 1

  // Stats
  const avgPh    = avg(filtered, 'soil_ph')
  const avgEc    = avg(filtered, 'soil_electricity_conductivity')
  const avgN     = avg(filtered, 'nitrogen')
  const avgP     = avg(filtered, 'phosphorus')
  const avgK     = avg(filtered, 'potassium')
  const avgTemp  = avg(filtered, 'soil_temperature')
  const avgMoist = avg(filtered, 'soil_humidity')

  // pH acidic vs neutral
  const phVals = filtered.map(m => m.soil_ph).filter(v => v != null)
  const acidic  = phVals.filter(v => v < 6).length
  const neutral = phVals.filter(v => v >= 6 && v <= 7).length
  const alkaline = phVals.filter(v => v > 7).length

  // Bar: avg pH by FPO
  const fpoGroups = groupByFpo(filtered, 'soil_ph')
  const fpoLabels = Object.keys(fpoGroups)
  const fpoPhAvgs = fpoLabels.map(f => {
    const vals = fpoGroups[f]
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : 0
  })

  // EC by FPO
  const fpoEcGroups = groupByFpo(filtered, 'soil_electricity_conductivity')
  const fpoEcAvgs = fpoLabels.map(f => {
    const vals = fpoEcGroups[f] || []
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : 0
  })

  // NPK by FPO
  const fpoNpk = fpoLabels.map(f => {
    const ms = filtered.filter(m => m.fpo === f)
    return {
      n: avg(ms, 'nitrogen') ?? 0,
      p: avg(ms, 'phosphorus') ?? 0,
      k: avg(ms, 'potassium') ?? 0,
    }
  })

  const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${c.parsed.y}` } } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#6B7280' } },
      y: { grid: { color: '#F0EDE6' }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#6B7280' } },
    },
  }

  const donutOpts = {
    responsive: true, maintainAspectRatio: false,
    cutout: '68%',
    plugins: { legend: { position: 'bottom', labels: { font: { family: 'Plus Jakarta Sans', size: 12 }, padding: 16, usePointStyle: true } } },
  }

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-sub">Summary stats and charts</p>
        </div>
        <div className="page-badge">{totalRecords.toLocaleString()} records · {selectedFpo}</div>
      </div>

      {/* Stat grid */}
      <div className="stat-grid">
        <StatCard label="AVG PH" value={avgPh} unit="" accent={ACCENT_COLORS.ph}
          sub={`${acidic} acidic · ${neutral} neutral`} />
        <StatCard label="AVG EC" value={avgEc} unit="μS/cm" accent={ACCENT_COLORS.ec}
          sub="Electrical conductivity" />
        <StatCard label="NITROGEN" value={avgN} unit="kg/ha" accent={ACCENT_COLORS.n}
          sub="Avg available N" />
        <StatCard label="PHOSPHORUS" value={avgP} unit="kg/ha" accent={ACCENT_COLORS.p}
          sub="Avg available P" />
        <StatCard label="POTASSIUM" value={avgK} unit="kg/ha" accent={ACCENT_COLORS.k}
          sub="Avg available K" />
        <StatCard label="TEMPERATURE" value={avgTemp} unit="°C" accent={ACCENT_COLORS.temp}
          sub="Avg soil temp" />
        <StatCard label="MOISTURE" value={avgMoist} unit="%" accent={ACCENT_COLORS.moist}
          sub="Avg soil moisture" />
        <StatCard label="TOTAL RECORDS" value={totalRecords.toLocaleString()} accent="#1A3829"
          sub={`${fpoCount} FPO region${fpoCount !== 1 ? 's' : ''}`} />
      </div>

      {/* Charts row 1 */}
      <div className="chart-row">
        <div className="chart-card wide">
          <div className="chart-card-header">
            <h3>Average pH by FPO</h3>
            <p>Optimal range 6.0–7.0 for most crops</p>
          </div>
          <div className="chart-body">
            {fpoLabels.length ? (
              <Bar
                data={{
                  labels: fpoLabels,
                  datasets: [{
                    data: fpoPhAvgs,
                    backgroundColor: CHART_COLORS,
                    borderRadius: 6,
                    borderSkipped: false,
                  }],
                }}
                options={{
                  ...barOpts,
                  scales: {
                    ...barOpts.scales,
                    y: { ...barOpts.scales.y, min: 4, max: 9,
                      ticks: { ...barOpts.scales.y.ticks, callback: v => v.toFixed(1) } },
                  },
                  plugins: {
                    ...barOpts.plugins,
                    annotation: {
                      annotations: {
                        line1: { type: 'line', yMin: 6, yMax: 6, borderColor: 'rgba(46,125,82,0.3)', borderDash: [4, 4] },
                        line2: { type: 'line', yMin: 7, yMax: 7, borderColor: 'rgba(46,125,82,0.3)', borderDash: [4, 4] },
                      },
                    },
                  },
                }}
              />
            ) : <div className="no-chart">No data</div>}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3>pH Distribution</h3>
            <p>Acidic vs Neutral vs Alkaline</p>
          </div>
          <div className="chart-body">
            <Doughnut
              data={{
                labels: ['Acidic (<6)', 'Neutral (6–7)', 'Alkaline (>7)'],
                datasets: [{
                  data: [acidic, neutral, alkaline],
                  backgroundColor: ['#E05C5C', '#2E7D52', '#C9820F'],
                  borderWidth: 0,
                  hoverOffset: 6,
                }],
              }}
              options={donutOpts}
            />
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="chart-row">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>EC Distribution (μS/cm)</h3>
            <p>Electrical conductivity across samples</p>
          </div>
          <div className="chart-body">
            {fpoLabels.length ? (
              <Bar
                data={{
                  labels: fpoLabels,
                  datasets: [{
                    data: fpoEcAvgs,
                    backgroundColor: '#C9820F',
                    borderRadius: 6,
                    borderSkipped: false,
                    opacity: 0.8,
                  }],
                }}
                options={barOpts}
              />
            ) : <div className="no-chart">No data</div>}
          </div>
        </div>

        <div className="chart-card wide">
          <div className="chart-card-header">
            <h3>Nutrients by FPO</h3>
            <p>Avg N, P, K per region (kg/ha)</p>
          </div>
          <div className="chart-body">
            {fpoLabels.length ? (
              <Bar
                data={{
                  labels: fpoLabels,
                  datasets: [
                    { label: 'N', data: fpoNpk.map(f => f.n), backgroundColor: '#4A90D9', borderRadius: 4 },
                    { label: 'P', data: fpoNpk.map(f => f.p), backgroundColor: '#E05C5C', borderRadius: 4 },
                    { label: 'K', data: fpoNpk.map(f => f.k), backgroundColor: '#8B5CF6', borderRadius: 4 },
                  ],
                }}
                options={{
                  ...barOpts,
                  plugins: { legend: { display: true, labels: { font: { family: 'Plus Jakarta Sans', size: 12 }, usePointStyle: true, padding: 16 } } },
                }}
              />
            ) : <div className="no-chart">No data</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
