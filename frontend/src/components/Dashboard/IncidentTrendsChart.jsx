import React, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChevronDown } from 'lucide-react'
import useStore from '../../store/useStore'

const TREND_DATA_THIS_WEEK = [
  { day: 'Mon', incidents: 52 },
  { day: 'Tue', incidents: 142 },
  { day: 'Wed', incidents: 88 },
  { day: 'Thu', incidents: 215 },
  { day: 'Fri', incidents: 168 },
  { day: 'Sat', incidents: 310 },
  { day: 'Sun', incidents: 245 },
]

const TREND_DATA_LAST_WEEK = [
  { day: 'Mon', incidents: 45 },
  { day: 'Tue', incidents: 110 },
  { day: 'Wed', incidents: 95 },
  { day: 'Thu', incidents: 180 },
  { day: 'Fri', incidents: 190 },
  { day: 'Sat', incidents: 280 },
  { day: 'Sun', incidents: 210 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl bg-[#0B1020]/95 backdrop-blur-md border border-white/15 text-xs shadow-2xl">
        <p className="text-slate-400 font-mono text-[10px] mb-0.5">{label}</p>
        <p className="text-white font-bold font-mono">
          <span className="text-indigo-400 font-extrabold">{payload[0].value}</span> Incidents
        </p>
      </div>
    )
  }
  return null
}

export default function IncidentTrendsChart() {
  const { theme } = useStore()
  const isLight = theme === 'light'
  const [timeframe, setTimeframe] = useState('This Week')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const data = timeframe === 'This Week' ? TREND_DATA_THIS_WEEK : TREND_DATA_LAST_WEEK

  return (
    <div
      className="p-5 sm:p-6 rounded-xl border flex flex-col justify-between transition-all duration-300 relative h-full min-h-[220px]"
      style={{
        backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
        borderColor: isLight ? '#E2E8F0' : '#1E2436',
      }}
    >
      {/* ── Header Row ── */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
          Incident Trends
        </h3>

        {/* Dropdown Filter */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                : 'bg-[#1E2436] hover:bg-[#283149] text-slate-200 border border-white/10 hover:text-white'
            }`}
          >
            <span>{timeframe}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-1 w-32 rounded-xl shadow-xl border p-1 z-30 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B1020] border-white/15 text-white'
              }`}
            >
              {['This Week', 'Last Week'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf)
                    setDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    timeframe === tf
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recharts Smooth Area Chart matching Reference ── */}
      <div className="w-full h-[150px] sm:h-[160px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incident-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818CF8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#818CF8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#E2E8F0' : '#1E293B'} vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 400]}
              ticks={[0, 100, 200, 300, 400]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="incidents"
              stroke="#818CF8"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incident-grad)"
              dot={{ r: 3, fill: '#818CF8', strokeWidth: 1, stroke: '#FFFFFF' }}
              activeDot={{ r: 5, fill: '#FFFFFF', stroke: '#818CF8', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
