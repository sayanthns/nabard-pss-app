import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLang } from '../contexts/LangContext.jsx'
import { apiGetMetrics, apiGetPlots } from '../api.js'
import Spinner from '../components/Spinner.jsx'

function fmt(val) { return val != null ? val : '—' }
function fmtTime(t) {
  if (!t) return '—'
  return new Date(t).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function PlotHistory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const printRef = useRef()

  const [plot, setPlot] = useState(null)
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(true)

  const LIMIT = 20

  useEffect(() => {
    apiGetPlots().then((r) => {
      const list = r.data?.results || r.data || []
      setPlot(list.find((p) => String(p.id) === String(id)))
    }).catch(() => {})
  }, [id])

  useEffect(() => {
    setLoading(true)
    const params = { limit: LIMIT, offset: page * LIMIT }
    if (from) params.from_date = from
    if (to) params.to_date = to
    apiGetMetrics(id, params)
      .then((r) => {
        setData(r.data?.results || r.data || [])
        setCount(r.data?.count || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, page, from, to])

  const handlePrint = () => window.print()

  const clearFilter = () => { setFrom(''); setTo(''); setPage(0) }

  const totalPages = Math.ceil(count / LIMIT)

  return (
    <div className="page">
      <header className="top-bar">
        <button className="icon-btn" onClick={() => navigate('/dashboard')}>{t('back')}</button>
        <span className="top-bar-title">{t('soilHistory')}</span>
        <button className="btn-outline btn-sm print-hide" onClick={handlePrint}>
          📄 {t('downloadPdf')}
        </button>
      </header>

      <div className="page-content" ref={printRef}>
        {plot && (
          <div className="history-plot-name print-show">
            <strong>{plot.name}</strong>
            {plot.location && <span> — {plot.location}</span>}
          </div>
        )}

        <div className="filter-bar print-hide">
          <div className="filter-field">
            <label>{t('from')}</label>
            <input type="date" value={from} max={to || undefined}
              onChange={(e) => { setFrom(e.target.value); setPage(0) }} />
          </div>
          <div className="filter-field">
            <label>{t('to')}</label>
            <input type="date" value={to} min={from || undefined}
              onChange={(e) => { setTo(e.target.value); setPage(0) }} />
          </div>
          {(from || to) && (
            <button className="btn-ghost btn-sm" onClick={clearFilter}>{t('clearFilter')}</button>
          )}
        </div>

        {loading ? <Spinner /> : (
          <>
            {data.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p>{t('noHistory')}</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('timestamp')}</th>
                      <th>{t('ph')}</th>
                      <th>{t('moisture')}</th>
                      <th>N</th>
                      <th>P</th>
                      <th>K</th>
                      <th>EC</th>
                      <th>{t('temperature')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={row.id || i}>
                        <td className="td-time">{fmtTime(row.time)}</td>
                        <td>{fmt(row.soil_ph)}</td>
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
            )}

            {totalPages > 1 && (
              <div className="pagination print-hide">
                <button className="btn-page" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
                <span>{page + 1} / {totalPages}</span>
                <button className="btn-page" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
