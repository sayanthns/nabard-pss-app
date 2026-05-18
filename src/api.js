import axios from 'axios'

const BASE = 'https://api.soil.nabard.deepflow.in/api/'

export const http = axios.create({ baseURL: BASE, headers: { Accept: 'application/json' } })
export const pub  = axios.create({ baseURL: BASE, headers: { Accept: 'application/json' } })

http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('access')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) { localStorage.clear(); window.location.href = '/' }
    return Promise.reject(err?.response?.data || err)
  }
)

export const apiLogin   = (d) => pub.post('auth/login/', d)
export const apiUsers   = (params) => http.get('admin/users/', { params })
export const apiPlots   = (userId) => http.get(`admin/users/${userId}/plots/`)
export const apiMetrics = (plotId, params) => http.get(`admin/plots/${plotId}/metrics/`, { params })
