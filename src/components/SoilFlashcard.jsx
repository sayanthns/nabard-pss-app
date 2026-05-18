import { useLang } from '../contexts/LangContext.jsx'

const MetricTile = ({ label, value, unit, accent }) => (
  <div className="metric-tile" style={{ '--accent': accent }}>
    <span className="metric-label">{label}</span>
    <span className="metric-value">
      {value != null ? `${value}` : '—'}
    </span>
    {unit && <span className="metric-unit">{unit}</span>}
  </div>
)

export default function SoilFlashcard({ metric }) {
  const { t } = useLang()

  if (!metric) {
    return (
      <div className="soil-flashcard empty">
        <div className="no-data-icon">🌱</div>
        <p>{t('noData')}</p>
      </div>
    )
  }

  const tiles = [
    { key: 'soil_ph', label: t('ph'), value: metric.soil_ph, unit: '', accent: '#52B788' },
    { key: 'soil_humidity', label: t('moisture'), value: metric.soil_humidity, unit: '%', accent: '#4EA8DE' },
    { key: 'nitrogen', label: t('nitrogen'), value: metric.nitrogen, unit: 'mg/kg', accent: '#80B918' },
    { key: 'phosphorus', label: t('phosphorus'), value: metric.phosphorus, unit: 'mg/kg', accent: '#F4A261' },
    { key: 'potassium', label: t('potassium'), value: metric.potassium, unit: 'mg/kg', accent: '#E9C46A' },
    { key: 'soil_electricity_conductivity', label: 'EC', value: metric.soil_electricity_conductivity, unit: 'mS/cm', accent: '#C77DFF' },
    { key: 'soil_temperature', label: t('temperature'), value: metric.soil_temperature, unit: '°C', accent: '#FF6B6B' },
  ]

  return (
    <div className="soil-flashcard">
      <div className="flashcard-time">
        {metric.time
          ? new Date(metric.time).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })
          : ''}
      </div>
      <div className="metric-grid">
        {tiles.map((tile) => (
          <MetricTile key={tile.key} {...tile} />
        ))}
      </div>
    </div>
  )
}
