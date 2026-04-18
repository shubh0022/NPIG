import axios from 'axios'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const BASE = `http://${window.location.hostname}:8000`

const api = axios.create({ baseURL: BASE, timeout: 10000 })

api.interceptors.request.use(cfg => {
  const token = useStore.getState().token
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      useStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  login:   (email, password) => api.post('/auth/login',   { email, password }),
  signup:  (data)            => api.post('/auth/register', data),
  refresh: ()                => api.post('/auth/refresh'),
  me:      ()                => api.get('/auth/me'),
  logout:  ()                => api.post('/auth/logout'),
}

// ── Alerts ────────────────────────────────────────────────────
export const alertsAPI = {
  list:   (params = {}) => axios.get(`http://${window.location.hostname}:8004/alerts`, { params }),
  stats:  ()              => axios.get(`http://${window.location.hostname}:8004/alerts/stats`),
  get:    (id)            => axios.get(`http://${window.location.hostname}:8004/alerts/${id}`),
  update: (id, data)      => axios.patch(`http://${window.location.hostname}:8004/alerts/${id}`, data),
  create: (data)          => axios.post(`http://${window.location.hostname}:8004/alerts`, data),
}

// ── Predictions ───────────────────────────────────────────────
export const predictionAPI = {
  getDashboardSnapshot: async () => {
    // Build synthetic zone snapshot for dashboard
    const zones = ['Downtown', 'Airport', 'Industrial Hub', 'North Residential', 'Medical District',
      'Port Zone', 'Tech Corridor', 'Old City', 'Riverside', 'University Zone', 'Market District', 'Government Sector']
    return {
      data: {
        predictions: zones.map(zone => ({
          zone,
          traffic_risk: Math.random(),
          crime_risk:   Math.random(),
          health_risk:  Math.random() * 0.6,
          climate_risk: Math.random(),
          risk_level: ['CRITICAL','HIGH','MEDIUM','LOW'][Math.floor(Math.random() * 4)],
        }))
      }
    }
  },
  predictTraffic: (data) => axios.post(`http://${window.location.hostname}:8003/predict/traffic`, data),
  predictCrime:   (data) => axios.post(`http://${window.location.hostname}:8003/predict/crime`,   data),
  predictDisease: (data) => axios.post(`http://${window.location.hostname}:8003/predict/disease`, data),
  predictClimate: (data) => axios.post(`http://${window.location.hostname}:8003/predict/climate`, data),
  detectAnomaly:  (data) => axios.post(`http://${window.location.hostname}:8003/detect/anomaly`,  data),
}

// ── Digital Twin ──────────────────────────────────────────────
export const twinAPI = {
  getSnapshot: () => axios.get(`http://${window.location.hostname}:8005/twin/snapshot`),
  simulate:    (data) => axios.post(`http://${window.location.hostname}:8005/twin/simulate`, data),
  intervene:   (data) => axios.post(`http://${window.location.hostname}:8005/twin/intervene`, data),
}

// ── NEXUS ─────────────────────────────────────────────────────
export const nexusAPI = {
  chat: (messages, user_role, session_id) =>
    axios.post(`http://${window.location.hostname}:8006/nexus/chat`, { messages, user_role, session_id }, { timeout: 15000 }),
  health: () => axios.get(`http://${window.location.hostname}:8006/nexus/health`),
}

// ── Reports ───────────────────────────────────────────────────
export const reportsAPI = {
  generate: (data) => api.post('/reports/generate', data),
  list:     ()     => api.get('/reports'),
  get:      (id)   => api.get(`/reports/${id}`),
  download: (id)   => api.get(`/reports/${id}/download`, { responseType: 'blob' }),
}

export default api
