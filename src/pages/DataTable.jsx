import { useContext, useState, useMemo } from 'react'
import { DataContext } from '../components/Layout.jsx'

function fmt(v) { return v != null ? Number(v).toFixed(2) : '—' }

const PAGE = 50

export default function DataTable() {
  const { filtered, loading, error } = useContext(DataContext)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('fpo')
  const [sortDir, setSortDir] = useState('desc')

  const rows = useMemo(() => {
    let r = [...filtered]
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(m => m.fpo?.toLowerCase().includes(q) || m.plotName?.toLowerCase().includes(q) || m.farmerName?.toLowerCase().includes(q))
    }
    r.sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
    return r
  }, [filtered, search, sortKey, sortDir])

  const totalPages = Math.ceil(rows.length / PAGE)
  const paged = rows.slice(page * PAGE, (page + 1) * PAGE)

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(0)
  }

  const arrow = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''


  if (loading) return <div className="page-loader"><div className="loader-spin" /><p>Loading data…</p></div>
  if (error)   return <div className="page-error">{error}</div>

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Table</h1>
          <p className="page-sub">{rows.length.toLocaleString()} records</p>
        </div>
      </div>

      <div className="dt-toolbar">
        <input
          className="dt-search"
          type="text"
          placeholder="Search FPO, farmer, plot…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
        />
      </div>

      <div className="dt-wrap">
        <table className="dt">
          <thead>
            <tr>
              <th onClick={() => handleSort('fpo')} className="sortable">FPO{arrow('fpo')}</th>
              <th>Farmer</th>
              <th>Plot</th>
              <th onClick={() => handleSort('soil_ph')} className="sortable">pH{arrow('soil_ph')}</th>
              <th>Moisture%</th>
              <th>N</th>
              <th>P</th>
              <th>K</th>
              <th>EC μS/cm</th>
              <th>Temp °C</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr><td colSpan={11} className="dt-empty">No records found</td></tr>
            )}
            {paged.map((row, i) => (
              <tr key={i}>
                <td><span className="fpo-chip">{row.fpo}</span></td>
                <td>{row.farmerName || '—'}</td>
                <td>{row.plotName || '—'}</td>
                <td className={row.soil_ph < 6 ? 'val-warn' : row.soil_ph > 7 ? 'val-hi' : 'val-ok'}>{fmt(row.soil_ph)}</td>
                <td>{fmt(row.soil_humidity)}</td>
                <td>{fmt(row.nitrogen)}</td>
                <td>{fmt(row.phosphorus)}</td>
                <td>{fmt(row.potassium)}</td>
                <td>{fmt(row.soil_electricity_conductivity)}</td>
                <td>{fmt(row.soil_temperature)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="dt-pagination">
          <button className="pg-btn" disabled={page === 0} onClick={() => setPage(0)}>«</button>
          <button className="pg-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
          <span className="pg-info">Page {page + 1} of {totalPages}</span>
          <button className="pg-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
          <button className="pg-btn" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>»</button>
        </div>
      )}
    </div>
  )
}
