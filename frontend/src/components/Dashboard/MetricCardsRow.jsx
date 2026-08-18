import React from 'react'
import { motion } from 'framer-motion'
import { Bell, AlertTriangle, TrendingUp, Clock, Sliders } from 'lucide-react'
import useStore from '../../store/useStore'
import toast from 'react-hot-toast'

const KPIS = [
  {
    id: 'kpi-alerts',
    label: 'Total Alerts',
    value: '8,320',
    trend: '12.5%',
    isUp: true,
    trendColor: 'text-emerald-400',
    icon: Bell,
    iconBg: 'bg-indigo-600/20 text-indigo-400',
  },
  {
    id: 'kpi-incidents',
    label: 'Active Incidents',
    value: '142',
    trend: '8.3%',
    isUp: false,
    trendColor: 'text-rose-400',
    icon: AlertTriangle,
    iconBg: 'bg-rose-500/20 text-rose-400',
  },
  {
    id: 'kpi-predictions',
    label: 'Predictions Today',
    value: '23,890',
    trend: '15.3%',
    isUp: true,
    trendColor: 'text-emerald-400',
    icon: TrendingUp,
    iconBg: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'kpi-response',
    label: 'Average Response Time',
    value: '02:35',
    trend: '5.6%',
    isUp: false,
    trendColor: 'text-emerald-400',
    icon: Clock,
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
]

export default function MetricCardsRow() {
  const { theme } = useStore()
  const isLight = theme === 'light'

  const handleCustomize = () => {
    toast('Customizing KPI metrics grid', { icon: '⚙️' })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {KPIS.map((kpi, idx) => {
        const Icon = kpi.icon
        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="p-5 rounded-xl border flex flex-col justify-between transition-all duration-300 relative group hover:border-indigo-500/30"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
              borderColor: isLight ? '#E2E8F0' : '#1E2436',
            }}
          >
            {/* Top row: Icon Badge + (Optional Customize on last card) */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
              
              {idx === 3 && (
                <button
                  onClick={handleCustomize}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                  }`}
                  title="Customize Dashboard"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Customize</span>
                </button>
              )}
            </div>

            {/* Middle: Metric Value and Label */}
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">
                {kpi.label}
              </p>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                {kpi.value}
              </h2>
            </div>

            {/* Bottom: Trend Indicator */}
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <span className={`font-mono font-bold flex items-center ${kpi.trendColor}`}>
                {kpi.isUp ? '↑' : '↓'} {kpi.trend}
              </span>
              <span className="text-slate-500 text-[11px]">
                vs yesterday
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
