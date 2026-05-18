import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { apiLogin } from '../api.js'

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
      <div className="login-brand">
        <div className="login-brand-icon">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="#2E7D52" opacity="0.12"/>
            <path d="M20 8C13.4 8 8 13.4 8 20s5.4 12 12 12" stroke="#2E7D52" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M20 8c6.6 0 12 5.4 12 12s-5.4 12-12 12" stroke="#1A3829" strokeWidth="2.2" strokeLinecap="round"/>
            <circle cx="20" cy="20" r="3.5" fill="#1A3829"/>
          </svg>
        </div>
        <div>
          <h1 className="login-title">Soil Sensor Dashboard</h1>
          <p className="login-org">NABARD · Kerala FPO Network</p>
        </div>
      </div>

      <div className="login-card">
        <h2 className="login-card-title">Sign in</h2>
        <p className="login-card-sub">Admin access required</p>

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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="login-footer">In association with NABARD · Deepflow Technologies</p>
    </div>
  )
}
