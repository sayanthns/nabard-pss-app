import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { apiLogin } from '../api.js'

const DEEPFLOW_LOGO = 'https://nabard-soil-monitor.vercel.app/images/Logo_Long.png'
const NABARD_LOGO   = 'https://nabard-soil-monitor.vercel.app/images/1303194734NABARD-ENG-logo-big.png'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiLogin(form)
      login({ username: form.username }, res.data.access, res.data.refresh)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.detail || err?.non_field_errors?.[0] || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      {/* Brand header */}
      <div className="login-header">
        <img src={DEEPFLOW_LOGO} alt="Deepflow Technologies" className="login-deepflow-logo" />
        <div className="login-header-divider" />
        <img src={NABARD_LOGO} alt="NABARD" className="login-nabard-logo" />
      </div>

      {/* Hero text */}
      <div className="login-hero">
        <h1 className="login-hero-title">Soil Assessment</h1>
        <p className="login-hero-sub">Portable Soil Sensor Device</p>
      </div>

      {/* Card */}
      <div className="login-card">
        <h2 className="login-card-title">Admin Sign In</h2>
        <p className="login-card-sub">Dashboard access for authorised officials</p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={submit} className="login-form">
          <div className="lf-group">
            <label>Username</label>
            <input type="text" value={form.username} onChange={set('username')} placeholder="admin" required autoFocus />
          </div>
          <div className="lf-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="login-footer">
        <span>In Association with</span>
        <img src={NABARD_LOGO} alt="NABARD" className="login-footer-nabard" />
        <span className="login-footer-dot">·</span>
        <img src={DEEPFLOW_LOGO} alt="Deepflow" className="login-footer-deepflow" />
      </div>
    </div>
  )
}
