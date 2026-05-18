import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Layout from './components/Layout.jsx'
import Overview from './pages/Overview.jsx'
import Analysis from './pages/Analysis.jsx'
import DataTable from './pages/DataTable.jsx'

function Protected({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Protected><Layout /></Protected>}>
            <Route path="dashboard" element={<Overview />} />
            <Route path="analysis"  element={<Analysis />} />
            <Route path="data"      element={<DataTable />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
