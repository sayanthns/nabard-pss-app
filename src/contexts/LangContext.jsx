import { createContext, useContext, useState } from 'react'
import { translations } from '../i18n.js'

const LangCtx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key

  const switchLang = (l) => {
    setLang(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangCtx.Provider value={{ lang, t, switchLang }}>
      {children}
    </LangCtx.Provider>
  )
}

export const useLang = () => useContext(LangCtx)
