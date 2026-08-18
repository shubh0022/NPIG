import React from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Bell,
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  FileText,
  Database,
  Layers,
  Users,
  Sliders,
  Menu,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'
import useStore from '../../store/useStore'
import NpigLogo from '../Brand/NpigLogo'

export default function DashboardSidebar({ onOpenNexus, onCloseMobile }) {
  const location = useLocation()
  const { theme } = useStore()
  const isLight = theme === 'light'

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/alerts', label: 'Alerts', icon: Bell },
    { to: '/incidents', label: 'Incidents', icon: AlertTriangle },
    { to: '/analytics', label: 'Analytics', icon: TrendingUp },
    { to: '/predictions', label: 'Predictive Insights', icon: BrainCircuit },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/data-center', label: 'Integrations', icon: Layers },
    { to: '/users', label: 'Users & Teams', icon: Users },
    { to: '/settings', label: 'Settings', icon: Sliders },
  ]

  const isActive = (path) => {
    if (path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname === '/platform')) {
      return true
    }
    return location.pathname === path
  }

  return (
    <aside
      className={`w-60 flex flex-col justify-between h-screen border-r flex-shrink-0 transition-all duration-300 select-none overflow-y-auto ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#080F1A] border-[#1E2436]'
      }`}
    >
      {/* ── Top Header: NPIG Logo + Hamburger Menu Icon ── */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 focus:outline-none">
            <NpigLogo height={24} theme={theme} showTagline={false} />
          </Link>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
            title="Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* ── 10 Navigation Items matching Reference ── */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.to)

            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-[#5B4DFF] text-white shadow-md shadow-indigo-500/20'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* ── Bottom Section: NEXUS AI Card & Copyright ── */}
      <div className="p-3 space-y-3">
        
        {/* NEXUS AI Dedicated Card matching Reference */}
        <div
          className="p-4 rounded-xl border flex flex-col items-center text-center relative overflow-hidden group transition-all"
          style={{
            backgroundColor: isLight ? '#F8FAFC' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          {/* Luminous 3D AI Sphere / Orb in Center */}
          <div className="relative w-16 h-16 my-1 flex items-center justify-center">
            {/* Pulsing ambient glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/40 via-blue-500/30 to-cyan-400/40 blur-md animate-pulse" />
            {/* Sphere graphic */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-indigo-600 via-blue-700 to-slate-900 border border-cyan-400/40 shadow-inner flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-cyan-400/30 via-transparent to-white/30 opacity-75" />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 blur-[1px] animate-ping" />
            </div>
          </div>

          <h4 className="font-sans font-bold text-xs text-white mt-1">
            NEXUS <span className="text-cyan-400">AI</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-light mt-0.5 mb-3">
            Your Intelligence Assistant
          </p>

          <button
            onClick={onOpenNexus}
            className="w-full py-2 px-3 rounded-lg bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 group-hover:scale-[1.02]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask NEXUS</span>
            <ArrowRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Copyright notice at bottom matching Reference */}
        <div className="px-2 pt-1 text-[10px] text-slate-500 font-sans leading-tight">
          <p>© 2025 NPIG</p>
          <p className="opacity-75">All rights reserved</p>
        </div>

      </div>
    </aside>
  )
}
