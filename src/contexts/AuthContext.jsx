import { createContext, useContext, useState, useEffect } from 'react'

const AuthCtx = createContext(null)

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

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
