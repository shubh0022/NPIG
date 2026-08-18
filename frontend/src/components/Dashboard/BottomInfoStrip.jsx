import React, { useState } from 'react'
import { Box, Share2, Users, RefreshCw } from 'lucide-react'
import useStore from '../../store/useStore'
import toast from 'react-hot-toast'

export default function BottomInfoStrip() {
  const { theme } = useStore()
  const isLight = theme === 'light'
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('2 min ago')

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      setLastUpdated('Just now')
      toast.success('Telemetry synchronized with National Grid nodes')
    }, 600)
  }

  const items = [
    {
      icon: Box,
      value: '23.8M+',
      label: 'Data Points Processed',
    },
    {
      icon: Share2,
      value: '350+',
      label: 'Data Sources Integrated',
    },
    {
      icon: Users,
      value: '120+',
      label: 'Govt. & Enterprise Users',
    },
  ]

  return (
    <div
      className="p-4 sm:p-5 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300"
      style={{
        backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
        borderColor: isLight ? '#E2E8F0' : '#1E2436',
      }}
    >
      {/* ── 3 Main Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 w-full md:w-auto">
        {items.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 flex-shrink-0">
                <Icon className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <p className="font-sans font-black text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                  {item.value}
                </p>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  {item.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Right: Last Updated with Refresh Button ── */}
      <div className="flex items-center gap-3 self-end md:self-auto text-xs text-slate-400">
        <span className="font-mono text-[11px]">
          Last Updated: <strong className="text-slate-300 font-semibold">{lastUpdated}</strong>
        </span>
        <button
          onClick={handleRefresh}
          className={`p-1.5 rounded-lg border transition-all ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
          }`}
          title="Refresh Telemetry"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
      </div>

    </div>
  )
}
