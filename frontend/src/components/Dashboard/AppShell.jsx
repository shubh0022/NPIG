import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import { alertsAPI, predictionAPI } from '../../utils/api'
import NexusChatbot from '../Nexus/NexusChatbot'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const NAV_SECTIONS = [
  {
    label: 'Intelligence',
    items: [
      { to: '/dashboard',    icon: '⬡',  label: 'Command Center'  },
      { to: '/alerts',       icon: '🚨',  label: 'Active Alerts',  badge: 'alerts' },
      { to: '/predictions',  icon: '🧠',  label: 'AI Predictions'  },
      { to: '/digital-twin', icon: '🌐',  label: 'Digital Twin'    },
    ]
  },
  {
    label: 'Operations',
    items: [
      { to: '/analytics',    icon: '📊',  label: 'Analytics'       },
      { to: '/reports',      icon: '📄',  label: 'Reports'         },
    ]
  },
  {
    label: 'Management',
    items: [
      { to: '/admin',        icon: '🛡️',  label: 'Admin Panel',    adminOnly: true },
      { to: '/profile',      icon: '👤',  label: 'Profile'         },
    ]
  }
]

export default function AppShell({ children }) {
  const {
    user, logout, alertStats, sidebarCollapsed, toggleSidebarCollapse,
    nexusOpen, toggleNexus, theme, toggleTheme, setAlerts, updateAlertStats,
    setPredictions, unreadCount, setUnreadCount, addNotification,
  } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [time, setTime] = useState(new Date())
  const [wsConnected, setWsConnected] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Theme init on mount
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        const [ar, sr, pr] = await Promise.allSettled([
          alertsAPI.list({ limit: 100 }),
          alertsAPI.stats(),
          predictionAPI.getDashboardSnapshot(),
        ])
        if (ar.status === 'fulfilled') setAlerts(ar.value.data.alerts || [])
        if (sr.status === 'fulfilled') {
          updateAlertStats(sr.value.data.by_severity || {})
          const count = sr.value.data.by_severity?.CRITICAL || 0
          setUnreadCount(count)
        }
        if (pr.status === 'fulfilled') setPredictions(pr.value.data.predictions || [])
      } catch {}
    }
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  // WebSocket alert feed
  useEffect(() => {
    let ws
    const connect = () => {
      try {
        ws = new WebSocket(`ws://${window.location.hostname}:8004/ws/alerts`)
        ws.onopen = () => setWsConnected(true)
        ws.onclose = () => { setWsConnected(false); setTimeout(connect, 5000) }
        ws.onmessage = (e) => {
          const data = JSON.parse(e.data)
          if (data.type === 'ALERT' && data.alert) {
            useStore.getState().addAlert(data.alert)
            if (data.alert.severity === 'CRITICAL') {
              toast.error(`🚨 ${data.alert.title}`, { duration: 8000 })
              addNotification({ id: Date.now(), text: data.alert.title, sev: 'CRITICAL', time: new Date() })
            }
          }
        }
      } catch {}
    }
    connect()
    return () => ws?.close()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Signed out securely')
  }

  const criticalCount   = alertStats?.CRITICAL || 0
  const isCollapsed     = sidebarCollapsed
  const isAdmin         = user?.role === 'ADMIN'

  return (
    <div className={clsx('flex h-screen overflow-hidden relative', theme === 'light' ? 'bg-slate-100' : 'bg-[#020714]')}>

      {/* Dark mode: ambient grid background */}
      {theme === 'dark' && (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
      )}
      {/* Dark mode: ambient corner orbs */}
      {theme === 'dark' && (
        <>
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #1d4ed8, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-8 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        </>
      )}
      {/* ── Mobile Backdrop ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: isCollapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={clsx(
          'fixed lg:relative inset-y-0 left-0 z-50 flex flex-col',
          'border-r overflow-hidden flex-shrink-0',
          theme === 'light'
            ? 'bg-white border-slate-200'
            : 'border-white/[0.06]',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'transition-transform lg:transition-none duration-300'
        )}
        style={{
          width: isCollapsed ? 64 : 240,
          ...(theme === 'dark' ? {
            background: 'linear-gradient(180deg, rgba(8,12,28,0.98) 0%, rgba(6,9,22,0.99) 100%)',
            boxShadow: '4px 0 32px rgba(0,0,0,0.4), inset -1px 0 0 rgba(37,99,235,0.08)',
          } : {})
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 h-16 border-b border-white/[0.06] flex-shrink-0">
          <img
            src="/npig-logo.png"
            alt="NPIG"
            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
          />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="font-display font-extrabold text-white text-sm tracking-widest leading-none">NPIG</div>
                <div className="text-[9px] text-slate-500 tracking-widest">INTELLIGENCE GRID</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto scroll-y">
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="mb-2">
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-3 py-2"
                  >
                    {section.label}
                  </motion.p>
                )}
              </AnimatePresence>
              {section.items.map(item => {
                if (item.adminOnly && !isAdmin) return null
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      clsx(
                        'nav-link mb-0.5',
                        isCollapsed && 'justify-center px-2',
                        isActive && 'active'
                      )
                    }
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 truncate text-[13px]">
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {!isCollapsed && item.badge === 'alerts' && criticalCount > 0 && (
                      <span className="ml-auto text-[10px] font-bold bg-severity-critical text-white rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {criticalCount > 9 ? '9+' : criticalCount}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom: NEXUS + Status + Collapse */}
        <div className="border-t border-white/[0.06] p-2 flex flex-col gap-1.5">
          {/* NPIG AI button */}
          <button
            onClick={toggleNexus}
            title="Open NPIG AI Assistant"
            className={clsx(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
              nexusOpen
                ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <img src="/npig-logo.png" alt="NPIG AI" className="w-5 h-5 rounded object-cover flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>NPIG AI</motion.span>}
            </AnimatePresence>
          </button>

          {/* Connection & Collapse */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1">
                <div className={wsConnected ? 'status-dot-ok' : 'status-dot-critical'} />
                <span className="text-[10px] text-slate-500">{wsConnected ? 'Live feed active' : 'Connecting...'}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleSidebarCollapse}
            className={clsx('btn-ghost py-2 rounded-xl text-xs', isCollapsed && 'justify-center')}
          >
            {isCollapsed ? '→' : '← Collapse'}
          </button>
        </div>
      </motion.aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className={clsx(
          'h-16 flex items-center px-4 gap-3 flex-shrink-0 relative z-10',
          'border-b backdrop-blur-2xl',
          theme === 'light'
            ? 'bg-white/95 border-slate-200'
            : 'border-white/[0.06]'
        )}
          style={theme === 'dark' ? {
            background: 'rgba(4, 7, 18, 0.92)',
            boxShadow: '0 1px 0 rgba(37,99,235,0.15), 0 4px 32px rgba(0,0,0,0.3)',
          } : {}}
        >
          {/* Mobile menu */}
          <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="btn-icon lg:hidden">☰</button>

          {/* Alert severity strip */}
          <div className="hidden sm:flex items-center gap-3 ml-2">
            {[
              { lbl: 'CRITICAL', count: alertStats?.CRITICAL || 0, cls: 'text-severity-critical' },
              { lbl: 'HIGH',     count: alertStats?.HIGH || 0,     cls: 'text-orange-400' },
              { lbl: 'MEDIUM',   count: alertStats?.MEDIUM || 0,   cls: 'text-amber-400' },
            ].map(item => (
              <div key={item.lbl} className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/alerts')}>
                <div className={`w-1.5 h-1.5 rounded-full ${item.cls.replace('text', 'bg')}`} />
                <span className={`text-xs font-semibold ${item.cls} font-mono`}>{item.lbl}</span>
                <span className="text-xs font-bold text-white font-mono">{item.count}</span>
              </div>
            ))}
          </div>

          <div className="flex-1" />

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="btn-icon" title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Notifications */}
          <button className="btn-icon relative" onClick={() => navigate('/alerts')}>
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-severity-critical text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Clock */}
          <div className="hidden md:block text-right">
            <div className="text-sm font-mono font-bold text-neon-blue tabular-nums">
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[9px] text-slate-500 font-mono">
              {time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · IST
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white leading-none">{user?.full_name || 'Admin'}</div>
              <div className="text-[10px] text-brand-400 font-mono">{user?.role || 'ADMIN'}</div>
            </div>
            <button onClick={handleLogout} className="btn-icon text-xs ml-1" title="Sign out">🚪</button>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto scroll-y p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── NEXUS Chatbot ── */}
      <NexusChatbot />
    </div>
  )
}
