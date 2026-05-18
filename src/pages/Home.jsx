import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLang } from '../contexts/LangContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { apiLogin, apiVerifyOtp } from '../api.js'
import { DeepflowLogo, NabardLogo } from '../components/Logo.jsx'
import LanguageToggle from '../components/LanguageToggle.jsx'

export default function Home() {
  const { t } = useLang()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('login') // 'login' | 'otp'
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!mobile || !password) return
    setLoading(true)
    try {
      const res = await apiLogin({ username: mobile, password })
      const { access, refresh } = res.data
      const user = { username: mobile, full_name: res.data.full_name || mobile }
      login(user, access, refresh)
      navigate('/dashboard')
    } catch (err) {
      const msg = err?.detail || err?.non_field_errors?.[0] || 'Login failed. Check credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-top-bar">
        <LanguageToggle />
      </div>

      <div className="auth-hero">
        <div className="auth-logos">
          <DeepflowLogo size={44} />
          <div className="logo-divider" />
          <NabardLogo size={44} />
        </div>

        <div className="auth-badge">PSS</div>
        <h1 className="auth-title">{t('appTitle')}</h1>
        <p className="auth-subtitle">{t('appSubtitle')}</p>
      </div>

      <div className="auth-card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="field-group">
            <label className="field-label">{t('mobileNumber')}</label>
            <input
              className="field-input"
              type="tel"
              placeholder={t('enterMobile')}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
              inputMode="numeric"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">{t('password')}</label>
            <input
              className="field-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? t('loading') : t('signIn')}
          </button>
        </form>

        <p className="auth-switch">
          {t('noAccount')}{' '}
          <Link to="/register" className="link">{t('registerNow')}</Link>
        </p>
      </div>

      <div className="auth-footer">
        <p>{t('inAssocWith')}</p>
        <NabardLogo size={28} />
      </div>
    </div>
  )
}
