import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLang } from '../contexts/LangContext.jsx'
import { apiRegister, apiVerifyOtp, apiLogin } from '../api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { DeepflowLogo, NabardLogo } from '../components/Logo.jsx'
import LanguageToggle from '../components/LanguageToggle.jsx'

export default function Register() {
  const { t } = useLang()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('form') // 'form' | 'otp'
  const [form, setForm] = useState({ full_name: '', username: '', place: '', password: '' })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiRegister(form)
      setStep('otp')
    } catch (err) {
      const data = err
      const msg = data?.username?.[0] || data?.detail || data?.non_field_errors?.[0] || 'Registration failed.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiVerifyOtp({ username: form.username, otp })
      const res = await apiLogin({ username: form.username, password: form.password })
      const { access, refresh } = res.data
      login({ username: form.username, full_name: form.full_name }, access, refresh)
      navigate('/dashboard')
    } catch (err) {
      const msg = err?.detail || err?.non_field_errors?.[0] || 'Invalid OTP.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <div className="auth-shell">
        <div className="auth-top-bar"><LanguageToggle /></div>
        <div className="auth-hero">
          <div className="auth-logos">
            <DeepflowLogo size={40} />
            <div className="logo-divider" />
            <NabardLogo size={40} />
          </div>
          <h1 className="auth-title">{t('verifyOtp')}</h1>
          <p className="auth-subtitle">{t('otpSent')} +91 {form.username}</p>
        </div>

        <div className="auth-card">
          {error && <div className="alert alert-error">{error}</div>}
          <p className="otp-instruction">{t('otpInstruction')}</p>
          <form onSubmit={handleVerify} className="auth-form">
            <input
              className="field-input otp-input"
              type="text"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              inputMode="numeric"
              required
            />
            <button className="btn-primary" type="submit" disabled={loading || otp.length < 4}>
              {loading ? t('loading') : t('verify')}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setStep('form')}>
              {t('back')}
            </button>
          </form>
        </div>
        <div className="auth-footer"><p>{t('inAssocWith')}</p><NabardLogo size={28} /></div>
      </div>
    )
  }

  return (
    <div className="auth-shell">
      <div className="auth-top-bar"><LanguageToggle /></div>
      <div className="auth-hero">
        <div className="auth-logos">
          <DeepflowLogo size={40} />
          <div className="logo-divider" />
          <NabardLogo size={40} />
        </div>
        <h1 className="auth-title">{t('createAccount')}</h1>
        <p className="auth-subtitle">{t('appSubtitle')}</p>
      </div>

      <div className="auth-card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleRegister} className="auth-form">
          <div className="field-group">
            <label className="field-label">{t('fullName')}</label>
            <input className="field-input" type="text" placeholder="Ramesh Kumar" value={form.full_name} onChange={set('full_name')} required />
          </div>
          <div className="field-group">
            <label className="field-label">{t('mobileNumber')}</label>
            <input className="field-input" type="tel" placeholder={t('enterMobile')} value={form.username} onChange={set('username')} maxLength={10} inputMode="numeric" required />
          </div>
          <div className="field-group">
            <label className="field-label">{t('place')}</label>
            <input className="field-input" type="text" placeholder="Patna, Bihar" value={form.place} onChange={set('place')} required />
          </div>
          <div className="field-group">
            <label className="field-label">{t('password')}</label>
            <input className="field-input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? t('loading') : t('register')}
          </button>
        </form>
        <p className="auth-switch">
          {t('haveAccount')}{' '}
          <Link to="/" className="link">{t('signIn')}</Link>
        </p>
      </div>
      <div className="auth-footer"><p>{t('inAssocWith')}</p><NabardLogo size={28} /></div>
    </div>
  )
}
