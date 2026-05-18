import { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const login = (userData, access, refresh) => {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => { localStorage.clear(); setUser(null) }

  return (
    <Ctx.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
