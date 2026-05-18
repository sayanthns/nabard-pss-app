import { useLang } from '../contexts/LangContext.jsx'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'ml', label: 'മ' },
]

export default function LanguageToggle() {
  const { lang, switchLang } = useLang()

  return (
    <div className="lang-toggle">
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={`lang-btn${lang === l.code ? ' active' : ''}`}
          onClick={() => switchLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
