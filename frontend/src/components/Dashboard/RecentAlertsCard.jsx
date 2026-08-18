import React from 'react'
import { Bell, Car, Users, Shield, Sun, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import useStore from '../../store/useStore'

const RECENT_ALERTS_DATA = [
  {
    id: 1,
    title: 'High Flood Risk Detected in Zone 7',
    location: 'Mumbai, India',
    time: '2 min ago',
    severity: 'High',
    badgeClass: 'bg-red-500/15 text-red-400 border border-red-500/30',
    icon: Bell,
    iconBg: 'bg-red-500/15 text-red-400',
  },
  {
    id: 2,
    title: 'Traffic Congestion Predicted on NH48',
    location: 'Delhi, India',
    time: '15 min ago',
    severity: 'Medium',
    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    icon: Car,
    iconBg: 'bg-amber-500/15 text-amber-400',
  },
  {
    id: 3,
    title: 'Unusual Crowd Gathering Detected',
    location: 'Bengaluru, India',
    time: '32 min ago',
    severity: 'Low',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    icon: Users,
    iconBg: 'bg-emerald-500/15 text-emerald-400',
  },
  {
    id: 4,
    title: 'Cyber Threat Activity Increased',
    location: 'Global',
    time: '45 min ago',
    severity: 'Info',
    badgeClass: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
    icon: Shield,
    iconBg: 'bg-sky-500/15 text-sky-400',
  },
  {
    id: 5,
    title: 'Heatwave Conditions Expected',
    location: 'Rajasthan, India',
    time: '1 hr ago',
    severity: 'Medium',
    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    icon: Sun,
    iconBg: 'bg-amber-500/15 text-amber-400',
  },
]

export default function RecentAlertsCard() {
  const { theme } = useStore()
  const isLight = theme === 'light'

  return (
    <div
      className="p-5 sm:p-6 rounded-xl border flex flex-col justify-between transition-all duration-300 relative h-full min-h-[360px]"
      style={{
        backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
        borderColor: isLight ? '#E2E8F0' : '#1E2436',
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
          Recent Alerts
        </h3>
        <Link
          to="/alerts"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* ── Alerts List matching Reference ── */}
      <div className="space-y-3.5 flex-1">
        {RECENT_ALERTS_DATA.map((alert) => {
          const Icon = alert.icon
          return (
            <Link
              key={alert.id}
              to="/alerts"
              className="flex items-center justify-between gap-3 group cursor-pointer p-1 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              {/* Left: Icon + Title & Location */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg ${alert.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors truncate">
                    {alert.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {alert.location}
                  </p>
                </div>
              </div>

              {/* Right: Timestamp & Severity Badge */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className="text-[10px] text-slate-400 font-mono">
                  {alert.time}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${alert.badgeClass}`}>
                  {alert.severity}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
