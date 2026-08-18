import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Globe as GlobeIcon, 
  Menu, 
  X, 
  Shield, 
  ChevronDown, 
  User, 
  LogOut,
  ExternalLink,
  Zap,
  Activity
} from 'lucide-react'
import useStore from '../../store/useStore'
import NpigLogo from '../Brand/NpigLogo'

export default function GlobalNavbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme, isAuthenticated, user, logout } = useStore()
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('EN')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
    setNotificationsOpen(false)
    setProfileDropdownOpen(false)
  }, [location.pathname])

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Platform', path: '/dashboard' },
    { name: 'Resources', path: '/resources' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const query = searchQuery.toLowerCase()
    setSearchOpen(false)
    if (query.includes('traffic') || query.includes('smart') || query.includes('cyber')) {
      navigate(`/solutions?q=${encodeURIComponent(query)}`)
    } else if (query.includes('predict') || query.includes('risk')) {
      navigate(`/predictions`)
    } else if (query.includes('report')) {
      navigate(`/reports`)
    } else {
      navigate(`/dashboard?q=${encodeURIComponent(query)}`)
    }
    setSearchQuery('')
  }

  return (
    <>
      <nav className="global-navbar fixed top-0 inset-x-0 z-50 transition-colors duration-200 backdrop-blur-xl border-b"
        style={{
          backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.94)' : 'rgba(5, 7, 13, 0.88)',
          borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* ── Brand Logo matching Reference Image 2 ── */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none py-1">
            <NpigLogo height={28} theme={theme} showTagline={false} />
            <div className="hidden sm:flex flex-col border-l border-slate-300 dark:border-white/15 pl-2.5 ml-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-indigo-500 leading-tight">
                Predictive Grid
              </span>
              <span className="text-[8px] font-mono text-slate-500 leading-none mt-0.5">
                Sovereign AI
              </span>
            </div>
          </Link>

          {/* ── Center Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    active 
                      ? theme === 'light' ? 'text-indigo-600 font-semibold' : 'text-white font-semibold'
                      : theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-indigo-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* ── Right Controls ── */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs ${
                theme === 'light' 
                  ? 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-600' 
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300'
              }`}
              title="Search Grid (Cmd + K)"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden xl:inline text-slate-400 text-xs">Search...</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/20 dark:bg-white/10 rounded border border-current/20 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2.5 rounded-xl border relative transition-all ${
                  theme === 'light'
                    ? 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-700'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300'
                }`}
                title="Telemetry Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              </button>

              {/* Notification Popover */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border p-4 z-50 backdrop-blur-2xl ${
                      theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B1020] border-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Grid Alerts</span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">3 New</span>
                    </div>
                    <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                      <div className="py-2.5 flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">High-Flood Risk in Zone 7</p>
                          <p className="text-[10px] text-slate-400">Mumbai Coastal Sector · 2m ago</p>
                        </div>
                      </div>
                      <div className="py-2.5 flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">Traffic Anomaly on NH48</p>
                          <p className="text-[10px] text-slate-400">Bengaluru corridor · 14m ago</p>
                        </div>
                      </div>
                      <div className="py-2.5 flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">Power Grid Load Normalized</p>
                          <p className="text-[10px] text-slate-400">Northern Regional Grid · 30m ago</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/alerts"
                      className="block text-center mt-3 pt-2 text-xs font-semibold text-indigo-500 hover:text-indigo-400 border-t border-white/5"
                    >
                      View All Alerts →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                  theme === 'light'
                    ? 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-700'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300'
                }`}
              >
                <GlobeIcon className="w-3.5 h-3.5" />
                <span>{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-28 rounded-xl shadow-xl border p-1 z-50 ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0B1020] border-white/10'
                }`}>
                  {['EN (English)', 'HI (हिंदी)', 'KA (ಕನ್ನಡ)', 'MR (मराठी)'].map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setCurrentLang(l.slice(0, 2))
                        setLangDropdownOpen(false)
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-400 transition-colors"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${
                theme === 'light'
                  ? 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-amber-600'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-indigo-400'
              }`}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Authentication / Platform Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/20 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.[0] || 'A'}
                  </div>
                  <span>{user?.name || 'Commander'}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {profileDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border p-2 z-50 ${
                    theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0B1020] border-white/10 text-white'
                  }`}>
                    <div className="px-3 py-2 border-b border-white/10 text-xs">
                      <p className="font-semibold">{user?.name || 'Administrator'}</p>
                      <p className="text-[10px] text-slate-400">{user?.role || 'SUPER_ADMIN'}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400">
                      <Activity className="w-3.5 h-3.5" /> Command Center
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400">
                      <User className="w-3.5 h-3.5" /> Security Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-red-400 hover:bg-red-500/10 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${
                    theme === 'light' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/login?mode=demo"
                  className="btn-primary !px-5 !py-2.5 !rounded-xl !text-xs !font-bold"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>

          {/* ── Mobile Hamburger Button ── */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${
                theme === 'light' ? 'bg-slate-100 border-slate-200 text-amber-600' : 'bg-white/[0.04] border-white/10 text-indigo-400'
              }`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl border transition-all ${
                theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-white/[0.04] border-white/10 text-white'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* ── Mobile Navigation Drawer ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-b px-6 py-6 ${
                theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-[#05070D]/95 border-white/10'
              }`}
            >
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive(link.path)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px bg-white/10 my-2" />
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="w-full text-center py-3 rounded-xl text-sm font-semibold border border-white/15 hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?mode=demo"
                    className="w-full text-center py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Global Search Modal (Cmd+K) ── */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden ${
                theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B1020] border-white/15 text-white'
              }`}
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-indigo-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search NPIG telemetry, intelligence domains, models, cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-2 py-1 rounded text-xs text-slate-400 hover:text-white bg-white/5"
                >
                  ESC
                </button>
              </form>

              <div className="p-4 max-h-80 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-2">Quick Navigation</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/10 border border-white/5 transition-colors"
                  >
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <div>
                      <p className="text-xs font-semibold">Command Center</p>
                      <p className="text-[10px] text-slate-400">Live operational overview</p>
                    </div>
                  </Link>
                  <Link
                    to="/predictions"
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/10 border border-white/5 transition-colors"
                  >
                    <Zap className="w-4 h-4 text-sky-400" />
                    <div>
                      <p className="text-xs font-semibold">Predictive Models</p>
                      <p className="text-[10px] text-slate-400">AI scenario forecasting</p>
                    </div>
                  </Link>
                  <Link
                    to="/solutions"
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/10 border border-white/5 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs font-semibold">Intelligence Solutions</p>
                      <p className="text-[10px] text-slate-400">6 core national pillars</p>
                    </div>
                  </Link>
                  <Link
                    to="/reports"
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/10 border border-white/5 transition-colors"
                  >
                    <GlobeIcon className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs font-semibold">Report Center</p>
                      <p className="text-[10px] text-slate-400">AI executive briefs</p>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
