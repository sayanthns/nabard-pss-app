import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { LangProvider } from './contexts/LangContext.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PlotHistory from './pages/PlotHistory.jsx'
import AddPlot from './pages/AddPlot.jsx'

function Protected({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/" replace />
}

function Public({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Public><Home /></Public>} />
            <Route path="/register" element={<Public><Register /></Public>} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/plot/add" element={<Protected><AddPlot /></Protected>} />
            <Route path="/plot/:id/edit" element={<Protected><AddPlot /></Protected>} />
            <Route path="/plot/:id/history" element={<Protected><PlotHistory /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </AuthProvider>
  )
}
