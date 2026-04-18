import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────────
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, alerts: [], predictions: [] }),

      // ── Theme ─────────────────────────────────────────────
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        document.documentElement.classList.toggle('light', next === 'light')
        document.documentElement.classList.toggle('dark', next === 'dark')
      },

      // ── UI State ──────────────────────────────────────────
      sidebarOpen: true,
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
      sidebarCollapsed: false,
      toggleSidebarCollapse: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // ── NEXUS Chatbot ─────────────────────────────────────
      nexusOpen: false,
      toggleNexus: () => set(s => ({ nexusOpen: !s.nexusOpen })),
      nexusMessages: [],
      addNexusMessage: (msg) => set(s => ({ nexusMessages: [...s.nexusMessages, msg] })),
      clearNexusMessages: () => set({ nexusMessages: [] }),

      // ── Alerts ────────────────────────────────────────────
      alerts: [],
      alertStats: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 },
      setAlerts: (alerts) => set({ alerts }),
      addAlert: (alert) => set(s => ({ alerts: [alert, ...s.alerts].slice(0, 500) })),
      updateAlertStats: (stats) => set({ alertStats: stats }),
      dismissAlert: (id) => set(s => ({ alerts: s.alerts.filter(a => a.alert_id !== id) })),

      // ── Predictions ───────────────────────────────────────
      predictions: [],
      setPredictions: (predictions) => set({ predictions }),

      // ── Live Events (WebSocket feed) ──────────────────────
      liveEvents: [],
      addLiveEvent: (ev) => set(s => ({ liveEvents: [ev, ...s.liveEvents].slice(0, 200) })),
      eventsProcessed: 0,
      incrementEvents: (n = 1) => set(s => ({ eventsProcessed: s.eventsProcessed + n })),

      // ── Digital Twin ──────────────────────────────────────
      twinSnapshot: null,
      setTwinSnapshot: (snap) => set({ twinSnapshot: snap }),
      activeScenarios: [],
      setActiveScenarios: (sc) => set({ activeScenarios: sc }),

      // ── Reports ───────────────────────────────────────────
      reports: [],
      addReport: (r) => set(s => ({ reports: [r, ...s.reports] })),
      setReports: (reports) => set({ reports }),

      // ── System Stats ──────────────────────────────────────
      systemStats: {
        eventsProcessed: 0,
        activeAlerts: 0,
        zonesMonitored: 12,
        modelsAccuracy: 91.3,
        uptime: '99.97%',
      },
      setSystemStats: (stats) => set(s => ({ systemStats: { ...s.systemStats, ...stats } })),

      // ── Notifications ─────────────────────────────────────
      notifications: [],
      addNotification: (n) => set(s => ({ notifications: [n, ...s.notifications].slice(0, 50) })),
      clearNotifications: () => set({ notifications: [] }),
      unreadCount: 0,
      setUnreadCount: (n) => set({ unreadCount: n }),
    }),
    {
      name: 'npig-store',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        sidebarCollapsed: state.sidebarCollapsed,
        nexusMessages: state.nexusMessages.slice(-50),
      }),
    }
  )
)

export default useStore
