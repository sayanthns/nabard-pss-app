import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../contexts/LangContext.jsx'
import { apiCreatePlot, apiUpdatePlot, apiGetPlots } from '../api.js'
import { CROPS } from '../i18n.js'

export default function AddPlot() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const isEdit = !!id

  const [form, setForm] = useState({ name: '', location: '', latitude: '', longitude: '' })
  const [selectedCrops, setSelectedCrops] = useState([])
  const [otherCrop, setOtherCrop] = useState('')
  const [showCropDrop, setShowCropDrop] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      apiGetPlots().then((r) => {
        const list = r.data?.results || r.data || []
        const plot = list.find((p) => String(p.id) === String(id))
        if (plot) {
          setForm({
            name: plot.name || '',
            location: plot.location || '',
            latitude: plot.latitude || '',
            longitude: plot.longitude || '',
          })
          setSelectedCrops(plot.crops?.map((c) => c.crop_name) || [])
        }
      }).catch(() => {})
    }
  }, [id])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const fetchGps = () => {
    if (!navigator.geolocation) { setError('GPS not supported'); return }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6)
        const lng = pos.coords.longitude.toFixed(6)
        setForm((f) => ({
          ...f,
          latitude: lat,
          longitude: lng,
          location: `${lat}, ${lng}`,
        }))
        setGpsLoading(false)
      },
      () => { setError('Could not fetch GPS location'); setGpsLoading(false) }
    )
  }

  const toggleCrop = (crop) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    )
  }

  const allCrops = selectedCrops.includes('Others') && otherCrop
    ? [...selectedCrops.filter((c) => c !== 'Others'), otherCrop]
    : selectedCrops

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = {
      ...form,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      crops: allCrops,
    }
    try {
      if (isEdit) {
        await apiUpdatePlot(id, payload)
      } else {
        await apiCreatePlot(payload)
      }
      navigate('/dashboard')
    } catch (err) {
      const msg = err?.name?.[0] || err?.detail || 'Failed to save plot.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="top-bar">
        <button className="icon-btn" onClick={() => navigate('/dashboard')}>{t('back')}</button>
        <span className="top-bar-title">{isEdit ? t('editPlotTitle') : t('addPlotTitle')}</span>
        <span />
      </header>

      <div className="page-content">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="field-group">
            <label className="field-label">{t('plotName')}</label>
            <input className="field-input" type="text" placeholder="e.g. North Field" value={form.name} onChange={set('name')} required />
          </div>

          <div className="field-group">
            <label className="field-label">{t('gpsLocation')}</label>
            <div className="gps-row">
              <input className="field-input" type="text" placeholder="Lat, Long or address" value={form.location} onChange={set('location')} />
              <button type="button" className="btn-gps" onClick={fetchGps} disabled={gpsLoading}>
                {gpsLoading ? '...' : t('fetchGps')}
              </button>
            </div>
          </div>

          <div className="field-row">
            <div className="field-group half">
              <label className="field-label">{t('latitude')}</label>
              <input className="field-input" type="number" step="0.000001" placeholder="12.9716" value={form.latitude} onChange={set('latitude')} />
            </div>
            <div className="field-group half">
              <label className="field-label">{t('longitude')}</label>
              <input className="field-input" type="number" step="0.000001" placeholder="77.5946" value={form.longitude} onChange={set('longitude')} />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">{t('cropName')}</label>
            <div className="crop-selector" onClick={() => setShowCropDrop((v) => !v)}>
              {selectedCrops.length === 0
                ? <span className="placeholder">{t('selectCrops')}</span>
                : <div className="selected-crops">{selectedCrops.map((c) => (
                    <span key={c} className="crop-tag selected">{c}</span>
                  ))}</div>
              }
              <span className="drop-arrow">{showCropDrop ? '▲' : '▼'}</span>
            </div>
            {showCropDrop && (
              <div className="crop-dropdown">
                {CROPS.map((crop) => (
                  <label key={crop} className="crop-option">
                    <input
                      type="checkbox"
                      checked={selectedCrops.includes(crop)}
                      onChange={() => toggleCrop(crop)}
                    />
                    <span>{crop}</span>
                  </label>
                ))}
              </div>
            )}
            {selectedCrops.includes('Others') && (
              <input
                className="field-input"
                type="text"
                placeholder={t('enterOtherCrop')}
                value={otherCrop}
                onChange={(e) => setOtherCrop(e.target.value)}
                style={{ marginTop: 8 }}
              />
            )}
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? t('loading') : t('save')}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/dashboard')}>
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
