import React from 'react'
import { Link } from 'react-router-dom'
import { Car, CloudRain, Zap, HeartPulse, ShieldAlert } from 'lucide-react'
import useStore from '../../store/useStore'

const PREDICTIONS_DATA = [
  {
    id: 1,
    title: 'Traffic Congestion (Next 6 hrs)',
    location: 'Mumbai, India',
    percent: 92,
    riskLabel: 'High Risk',
    barColor: 'bg-red-500',
    textColor: 'text-red-400',
    icon: Car,
  },
  {
    id: 2,
    title: 'Heavy Rainfall (Next 24 hrs)',
    location: 'Kerala, India',
    percent: 78,
    riskLabel: 'Medium Risk',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-400',
    icon: CloudRain,
  },
  {
    id: 3,
    title: 'Power Outage Risk (Next 12 hrs)',
    location: 'Chennai, India',
    percent: 64,
    riskLabel: 'Medium Risk',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-400',
    icon: Zap,
  },
  {
    id: 4,
    title: 'Disease Outbreak Risk (Next 7 days)',
    location: 'Delhi, India',
    percent: 35,
    riskLabel: 'Low Risk',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-400',
    icon: HeartPulse,
  },
  {
    id: 5,
    title: 'Cyber Attack Risk (Next 24 hrs)',
    location: 'Global',
    percent: 89,
    riskLabel: 'High Risk',
    barColor: 'bg-red-500',
    textColor: 'text-red-400',
    icon: ShieldAlert,
  },
]

export default function PredictionOverviewCard() {
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
          Prediction Overview
        </h3>
        <Link
          to="/predictions"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View All Predictions
        </Link>
      </div>

      {/* ── Predictions List matching Reference ── */}
      <div className="space-y-4 flex-1">
        {PREDICTIONS_DATA.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              to="/predictions"
              className="block group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {item.location}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-mono font-bold ${item.textColor}`}>
                    {item.percent}%
                  </span>
                  <p className={`text-[9px] font-semibold ${item.textColor}`}>
                    {item.riskLabel}
                  </p>
                </div>
              </div>

              {/* Horizontal Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.barColor}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
