import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLang } from '../contexts/LangContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { apiGetPlots, apiGetMetrics, apiGetRecommendations } from '../api.js'
import { DeepflowLogo, NabardLogo } from '../components/Logo.jsx'
import LanguageToggle from '../components/LanguageToggle.jsx'
import SoilFlashcard from '../components/SoilFlashcard.jsx'
import Spinner from '../components/Spinner.jsx'

function greeting(name, t) {
  const h = new Date().getHours()
  const greet = h < 12 ? t('goodMorning') : h < 17 ? t('goodAfternoon') : t('goodEvening')
  return `${greet}, ${name}`
}

function PlotCard({ plot }) {
  const { t } = useLang()
  const navigate = useNavigate()
  const [metric, setMetric] = useState(null)
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      apiGetMetrics(plot.id, { limit: 1 }),
      apiGetRecommendations(plot.id),
    ]).then(([mRes, rRes]) => {
      const results = mRes.data?.results || mRes.data
      setMetric(Array.isArray(results) ? results[0] : results)
      setRecs(rRes.data?.results || rRes.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [plot.id])

  return (
    <div className="plot-card">
      <div className="plot-card-header" onClick={() => setOpen((o) => !o)}>
        <div className="plot-card-info">
          <h3 className="plot-name">{plot.name || `Plot ${plot.id}`}</h3>
          {plot.location && <p className="plot-location">📍 {plot.location}</p>}
          {plot.crops?.length > 0 && (
            <div className="crop-tags">
              {plot.crops.slice(0, 3).map((c) => (
                <span key={c.id} className="crop-tag">{c.crop_name}</span>
              ))}
            </div>
          )}
        </div>
        <div className="plot-actions">
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); navigate(`/plot/${plot.id}/edit`) }} title="Edit">✏️</button>
          <span className="chevron">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div className="plot-card-body">
          {loading ? <Spinner size={24} /> : (
            <>
              <p className="section-label">{t('soilReading')}</p>
              <SoilFlashcard metric={metric} />

              {recs.length > 0 && (
                <div className="rec-section">
                  <p className="section-label">{t('recommendations')}</p>
                  <ul className="rec-list">
                    {recs.map((r, i) => (
                      <li key={i} className="rec-item">
                        <span className="rec-bullet">🌿</span>
                        <span>{r.content}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className="btn-outline history-btn"
                onClick={() => navigate(`/plot/${plot.id}/history`)}
              >
                {t('viewHistory')} →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { t } = useLang()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [plots, setPlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGetPlots()
      .then((r) => setPlots(r.data?.results || r.data || []))
      .catch(() => setError(t('error')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <header className="top-bar">
        <div className="top-bar-left">
          <DeepflowLogo size={30} />
        </div>
        <div className="top-bar-center">
          <LanguageToggle />
        </div>
        <div className="top-bar-right">
          <button className="icon-btn logout-btn" onClick={logout} title={t('logout')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      <div className="page-content">
        <div className="greeting-section">
          <h2 className="greeting">{greeting(user?.full_name || user?.username, t)}</h2>
          <p className="greeting-sub">{t('myPlots')}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="plots-list">
              {plots.map((p) => <PlotCard key={p.id} plot={p} />)}
              {plots.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">🌱</div>
                  <p>No plots yet. Add your first plot!</p>
                </div>
              )}
            </div>

            <button className="btn-fab" onClick={() => navigate('/plot/add')}>
              +
            </button>
          </>
        )}
      </div>
    </div>
  )
}
