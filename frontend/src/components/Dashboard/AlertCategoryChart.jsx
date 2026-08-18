import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import useStore from '../../store/useStore'

const CATEGORY_DATA = [
  { name: 'Crime', value: 2450, percent: '29%', color: '#38BDF8' },    // Cyan
  { name: 'Traffic', value: 1980, percent: '24%', color: '#10B981' },  // Green
  { name: 'Disaster', value: 1450, percent: '17%', color: '#F59E0B' }, // Amber
  { name: 'Health', value: 1120, percent: '13%', color: '#EF4444' },   // Red
  { name: 'Cyber', value: 850, percent: '10%', color: '#8B5CF6' },    // Purple
  { name: 'Other', value: 470, percent: '7%', color: '#64748B' },     // Gray
]

export default function AlertCategoryChart() {
  const { theme } = useStore()
  const isLight = theme === 'light'

  return (
    <div
      className="p-5 sm:p-6 rounded-xl border flex flex-col justify-between transition-all duration-300 relative h-full min-h-[220px]"
      style={{
        backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
        borderColor: isLight ? '#E2E8F0' : '#1E2436',
      }}
    >
      {/* ── Header ── */}
      <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight mb-2">
        Alerts by Category
      </h3>

      {/* ── Donut Chart & Legend Split Row ── */}
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Donut Chart with Center Text */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={3}
                dataKey="value"
                stroke={isLight ? '#FFFFFF' : '#0F1524'}
                strokeWidth={2}
              >
                {CATEGORY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Stat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="font-sans font-black text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
              8,320
            </span>
            <span className="text-[9px] text-slate-400 font-medium">
              Total
            </span>
          </div>
        </div>

        {/* Right: Legend Items List matching Reference */}
        <div className="flex-1 space-y-1.5 min-w-0">
          {CATEGORY_DATA.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-300 dark:text-slate-300 text-[11px] font-medium truncate">
                  {item.name}
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-400 ml-2 whitespace-nowrap">
                <strong className="text-white">{item.value.toLocaleString()}</strong> ({item.percent})
              </span>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
