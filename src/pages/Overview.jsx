import { useContext, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
  Title, PointElement, LineElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { DataContext } from '../components/Layout.jsx'
import StatCard from '../components/StatCard.jsx'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend, Title,
  PointElement, LineElement,
)

const CHART_COLORS = ['#2E7D52', '#52A874', '#7DC49A', '#A8D9BB', '#C9E8D4', '#E4F4EB']
const ACCENT = { ph:'#2E7D52', ec:'#C9820F', n:'#4A90D9', p:'#E05C5C', k:'#8B5CF6', temp:'#F59E0B', moist:'#06B6D4' }

const barOpts = {
  responsive: true, maintainAspectRatio: false, animation: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#6B7280' } },
    y: { grid: { color: '#F0EDE6' }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#6B7280' } },
  },
}

const donutOpts = {
  responsive: true, maintainAspectRatio: false, animation: false,
  cutout: '68%',
  plugins: { legend: { position: 'bottom', labels: { font: { family: 'Plus Jakarta Sans', size: 12 }, padding: 16, usePointStyle: true } } },
}

export default function Overview() {
  const { filtered, fpos, loading, error, selectedFpo } = useContext(DataContext)

  const stats = useMemo(() => {
    const vals = (key) => filtered.map(m => m[key]).filter(v => v != null)
    const avg = (key) => {
      const v = vals(key)
      return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(2) : null
    }
    const phVals = vals('soil_ph')
    return {
      avgPh:    avg('soil_ph'),
      avgEc:    avg('soil_electricity_conductivity'),
      avgN:     avg('nitrogen'),
      avgP:     avg('phosphorus'),
      avgK:     avg('potassium'),
      avgTemp:  avg('soil_temperature'),
      avgMoist: avg('soil_humidity'),
      acidic:   phVals.filter(v => v < 6).length,
      neutral:  phVals.filter(v => v >= 6 && v <= 7).length,
      alkaline: phVals.filter(v => v > 7).length,
    }
  }, [filtered])

  const fpoStats = useMemo(() => {
    const map = {}
    filtered.forEach((m) => {
      if (!map[m.fpo]) map[m.fpo] = { ph: [], ec: [], n: [], p: [], k: [] }
      if (m.soil_ph != null) map[m.fpo].ph.push(m.soil_ph)
      if (m.soil_electricity_conductivity != null) map[m.fpo].ec.push(m.soil_electricity_conductivity)
      if (m.nitrogen != null) map[m.fpo].n.push(m.nitrogen)
      if (m.phosphorus != null) map[m.fpo].p.push(m.phosphorus)
      if (m.potassium != null) map[m.fpo].k.push(m.potassium)
    })
    const labels = Object.keys(map)
    const mean = (arr) => arr.length ? (arr.reduce((a,b) => a+b,0) / arr.length).toFixed(2) : 0
    return {
      labels,
      phAvgs: labels.map(f => mean(map[f].ph)),
      ecAvgs: labels.map(f => mean(map[f].ec)),
      npk: labels.map(f => ({ n: mean(map[f].n), p: mean(map[f].p), k: mean(map[f].k) })),
    }
  }, [filtered])

  if (loading) return <div className="page-loader"><div className="loader-spin" /><p>Loading data…</p></div>
  if (error)   return <div className="page-error">{error}</div>

  const fpoCount = selectedFpo === 'All' ? fpos.length : 1

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-sub">Summary stats and charts</p>
        </div>
        <div className="page-badge">{filtered.length.toLocaleString()} records · {selectedFpo}</div>
      </div>

      <div className="stat-grid">
        <StatCard label="AVG PH"       value={stats.avgPh}    accent={ACCENT.ph}   sub={`${stats.acidic} acidic · ${stats.neutral} neutral`} />
        <StatCard label="AVG EC"       value={stats.avgEc}    unit="μS/cm" accent={ACCENT.ec}   sub="Electrical conductivity" />
        <StatCard label="NITROGEN"     value={stats.avgN}     unit="mg/kg" accent={ACCENT.n}    sub="Avg available N" />
        <StatCard label="PHOSPHORUS"   value={stats.avgP}     unit="mg/kg" accent={ACCENT.p}    sub="Avg available P" />
        <StatCard label="POTASSIUM"    value={stats.avgK}     unit="mg/kg" accent={ACCENT.k}    sub="Avg available K" />
        <StatCard label="TEMPERATURE"  value={stats.avgTemp}  unit="°C"    accent={ACCENT.temp} sub="Avg soil temp" />
        <StatCard label="MOISTURE"     value={stats.avgMoist} unit="%"     accent={ACCENT.moist} sub="Avg soil moisture" />
        <StatCard label="TOTAL RECORDS" value={filtered.length.toLocaleString()} accent="#1A3829"
          sub={`${fpoCount} FPO region${fpoCount !== 1 ? 's' : ''}`} />
      </div>

      <div className="chart-row">
        <div className="chart-card wide">
          <div className="chart-card-header">
            <h3>Average pH by FPO</h3>
            <p>Optimal range 6.0–7.0 for most crops</p>
          </div>
          <div className="chart-body">
            {fpoStats.labels.length ? (
              <Bar
                data={{ labels: fpoStats.labels, datasets: [{ data: fpoStats.phAvgs, backgroundColor: CHART_COLORS, borderRadius: 6, borderSkipped: false }] }}
                options={{ ...barOpts, scales: { ...barOpts.scales, y: { ...barOpts.scales.y, min: 4, max: 9 } } }}
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
              data={{ labels: ['Acidic (<6)', 'Neutral (6–7)', 'Alkaline (>7)'], datasets: [{ data: [stats.acidic, stats.neutral, stats.alkaline], backgroundColor: ['#E05C5C','#2E7D52','#C9820F'], borderWidth: 0, hoverOffset: 6 }] }}
              options={donutOpts}
            />
          </div>
        </div>
      </div>

      <div className="chart-row">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>EC Distribution (μS/cm)</h3>
            <p>Electrical conductivity across FPOs</p>
          </div>
          <div className="chart-body">
            {fpoStats.labels.length ? (
              <Bar
                data={{ labels: fpoStats.labels, datasets: [{ data: fpoStats.ecAvgs, backgroundColor: '#C9820F', borderRadius: 6, borderSkipped: false }] }}
                options={barOpts}
              />
            ) : <div className="no-chart">No data</div>}
          </div>
        </div>

        <div className="chart-card wide">
          <div className="chart-card-header">
            <h3>Nutrients by FPO</h3>
            <p>Avg N, P, K per region (mg/kg)</p>
          </div>
          <div className="chart-body">
            {fpoStats.labels.length ? (
              <Bar
                data={{
                  labels: fpoStats.labels,
                  datasets: [
                    { label: 'N', data: fpoStats.npk.map(f => f.n), backgroundColor: '#4A90D9', borderRadius: 4 },
                    { label: 'P', data: fpoStats.npk.map(f => f.p), backgroundColor: '#E05C5C', borderRadius: 4 },
                    { label: 'K', data: fpoStats.npk.map(f => f.k), backgroundColor: '#8B5CF6', borderRadius: 4 },
                  ],
                }}
                options={{ ...barOpts, plugins: { legend: { display: true, labels: { font: { family: 'Plus Jakarta Sans', size: 12 }, usePointStyle: true, padding: 16 } } } }}
              />
            ) : <div className="no-chart">No data</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
