import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, Mail, HelpCircle, Sun, Moon, Menu } from 'lucide-react'
import useStore from '../../store/useStore'
import toast from 'react-hot-toast'

export default function DashboardTopbar({ onOpenMobileMenu }) {
  const { theme, toggleTheme, user, unreadCount } = useStore()
  const isLight = theme === 'light'
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const q = searchQuery.toLowerCase()
    setSearchQuery('')
    if (q.includes('alert')) navigate('/alerts')
    else if (q.includes('predict')) navigate('/predictions')
    else if (q.includes('report')) navigate('/reports')
    else toast(`Searching telemetry for "${q}"`, { icon: '🔍' })
  }

  return (
    <header
      className={`h-16 px-4 sm:px-6 border-b flex items-center justify-between flex-shrink-0 transition-colors duration-200 ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#080F1A] border-[#1E2436]'
      }`}
    >
      {/* ── Left Side: Mobile Menu Button & Search Field ── */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden border border-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Field matching Reference */}
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-xs outline-none transition-all ${
              isLight
                ? 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500'
                : 'bg-[#0F1524] border border-[#1E2436] text-white placeholder-slate-500 focus:border-indigo-500/60'
            }`}
          />
        </form>
      </div>

      {/* ── Right Side Cluster matching Reference ── */}
      <div className="flex items-center gap-3 sm:gap-5">
        
        {/* System Status: ● Online */}
        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-[10px] text-slate-400 font-medium">System Status</span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981] animate-pulse" />
            Online
          </span>
        </div>

        {/* Icon Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 text-slate-400">
          
          {/* Notifications with Badge '4' */}
          <Link
            to="/alerts"
            className="p-2 rounded-lg hover:bg-white/5 hover:text-white relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              4
            </span>
          </Link>

          {/* Messages */}
          <button
            onClick={() => toast('No unread agency transmissions', { icon: '✉️' })}
            className="p-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
            title="Messages"
          >
            <Mail className="w-4 h-4" />
          </button>

          {/* Help */}
          <button
            onClick={() => toast('NPIG Command Center Documentation & SOPs', { icon: '❓' })}
            className="p-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

        </div>

        {/* User Profile Card matching Reference ("Anand Kumar - Administrator") */}
        <Link
          to="/profile"
          className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200 dark:border-white/10 group cursor-pointer"
        >
          {/* Circular Photo Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-600 border border-white/20 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Anand Kumar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <span className="hidden group-hover:inline">A</span>
          </div>

          {/* Name and Role */}
          <div className="hidden sm:flex flex-col leading-tight min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors truncate">
              {user?.name || 'Anand Kumar'}
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              Administrator
            </span>
          </div>
        </Link>

      </div>
    </header>
  )
}
