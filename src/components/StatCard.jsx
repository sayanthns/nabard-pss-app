export default function StatCard({ label, value, unit, sub, accent = '#2E7D52' }) {
  return (
    <div className="stat-card">
      <div className="stat-accent" style={{ background: accent }} />
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value ?? '—'}
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}
