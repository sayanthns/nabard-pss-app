import axios from 'axios'

const BASE = 'https://api.soil.nabard.deepflow.in/api/'

export const http = axios.create({ baseURL: BASE, headers: { Accept: 'application/json' } })
export const pub = axios.create({ baseURL: BASE, headers: { Accept: 'application/json' } })

http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('access')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/'
    }
    return Promise.reject(err?.response?.data || err)
  }
)

// Auth
export const apiLogin = (data) => pub.post('auth/login/', data)
export const apiRegister = (data) => pub.post('auth/register/', data)
export const apiVerifyOtp = (data) => pub.post('auth/verify/', data)

// Plots
export const apiGetPlots = () => http.get('user/plots/')
export const apiCreatePlot = (data) => http.post('user/plot/create/', data)
export const apiUpdatePlot = (id, data) => http.patch(`user/plot/manage/${id}/`, data)

// Metrics
export const apiGetMetrics = (plotId, params = {}) =>
  http.get(`user/plot/${plotId}/data/`, { params })

// Recommendations
export const apiGetRecommendations = (plotId) =>
  http.get(`user/plot/recommends/${plotId}/`)
