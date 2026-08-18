import React from 'react'
import { Link } from 'react-router-dom'
import useStore from '../../store/useStore'

const SERVICES = [
  { name: 'Data Ingestion', status: 'Operational' },
  { name: 'AI Models', status: 'Operational' },
  { name: 'APIs & Services', status: 'Operational' },
  { name: 'Database', status: 'Operational' },
  { name: 'Integrations', status: 'Operational' },
]

export default function SystemHealthCard() {
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
          System Health
        </h3>
        <Link
          to="/data-center"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View Status
        </Link>
      </div>

      {/* ── Circular Health Gauge matching Reference ── */}
      <div className="flex items-center justify-center my-2">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-slate-800"
              strokeWidth="7"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Active Green Arc (98.6% circumference = 2 * PI * 40 = 251.32 => 247.8) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#10B981"
              strokeWidth="7"
              strokeDasharray="251.32"
              strokeDashoffset="3.5"
              strokeLinecap="round"
              fill="transparent"
              style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' }}
            />
          </svg>

          {/* Center Stat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="font-sans font-black text-xl text-slate-900 dark:text-white leading-tight">
              98.6%
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold mt-0.5">
              Healthy
            </span>
          </div>
        </div>
      </div>

      {/* ── 5 Service Health Items ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
        {SERVICES.map((srv) => (
          <div key={srv.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
              <span className="text-slate-300 dark:text-slate-300 text-[11px] font-medium">
                {srv.name}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">
              {srv.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}
