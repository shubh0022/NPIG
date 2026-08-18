import React, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import {
  Calendar,
  Download,
  Activity,
  Layers,
  MapPin,
  TrendingDown,
  TrendingUp,
  ChevronDown,
} from 'lucide-react'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const TREND_DATA = [
  { day: 'Mon', incidents: 60 },
  { day: 'Tue', incidents: 145 },
  { day: 'Wed', incidents: 90 },
  { day: 'Thu', incidents: 220 },
  { day: 'Fri', incidents: 175 },
  { day: 'Sat', incidents: 320 },
  { day: 'Sun', incidents: 250 },
]

const CATEGORY_DONUT_DATA = [
  { name: 'Traffic', value: 6.2, count: '6.2M', percent: '26%', color: '#38BDF8' },
  { name: 'Climate', value: 5.4, count: '5.4M', percent: '23%', color: '#10B981' },
  { name: 'Security', value: 4.8, count: '4.8M', percent: '20%', color: '#F59E0B' },
  { name: 'Infrastructure', value: 3.7, count: '3.7M', percent: '16%', color: '#EF4444' },
  { name: 'Health', value: 2.1, count: '2.1M', percent: '9%', color: '#8B5CF6' },
  { name: 'Others', value: 1.7, count: '1.7M', percent: '7%', color: '#64748B' },
]

const REGIONS_DATA = [
  { name: 'Mumbai', value: 4.2, label: '4.2M' },
  { name: 'Delhi', value: 3.6, label: '3.6M' },
  { name: 'Bengaluru', value: 3.1, label: '3.1M' },
  { name: 'Chennai', value: 2.6, label: '2.6M' },
  { name: 'Kolkata', value: 1.8, label: '1.8M' },
]

export default function AnalyticsPage() {
  const { theme } = useStore()
  const isLight = theme === 'light'
  const [activeTab, setActiveTab] = useState('Overview')
  const tabs = ['Overview', 'Trends', 'Geospatial', 'Categories', 'Risk Analysis']

  const handleExport = () => {
    toast.success('Exporting Analytics Dataset (CSV/PDF) ...')
  }

  return (
    <div className="space-y-5 pb-8">
      
      {/* ── Top Header matching Screen 2 ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5">
            Deep insights and intelligence analytics.
          </p>
        </div>

        {/* Date Range Selector & Export Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toast('Date range filter: May 12 – May 18, 2025', { icon: '📅' })}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0F1524] hover:bg-[#1E2436] border-[#1E2436] text-slate-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>May 12 - May 18, 2025</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={handleExport}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0F1524] hover:bg-[#1E2436] border-[#1E2436] text-slate-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ── 4 KPI Cards matching Screen 2 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Events */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">↑ 15.3%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Events</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">23.8M</h2>
          </div>
        </div>

        {/* Unique Incidents */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">↑ 8.6%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Unique Incidents</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">1,920</h2>
          </div>
        </div>

        {/* Affected Regions */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">↑ 12.1%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Affected Regions</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">142</h2>
          </div>
        </div>

        {/* Avg. Risk Score */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-rose-400">↓ 4.2%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Avg. Risk Score</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">68.4</h2>
          </div>
        </div>

      </div>

      {/* ── Sub Navigation Tabs matching Screen 2 ── */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-[#5B4DFF] text-white shadow-md shadow-indigo-600/20'
                : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Top Chart: Incident Trend Line Chart matching Screen 2 ── */}
      <div
        className="p-5 sm:p-6 rounded-xl border flex flex-col justify-between"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
          borderColor: isLight ? '#E2E8F0' : '#1E2436',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Incident Trend
          </h3>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
            This Week ▾
          </span>
        </div>

        <div className="w-full h-48 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="analytics-inc-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#E2E8F0' : '#1E293B'} vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} domain={[0, 400]} ticks={[0, 100, 200, 300, 400]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="px-3 py-1.5 rounded-lg bg-[#0B1020] border border-white/15 text-xs text-white">
                        <span className="text-indigo-400 font-bold">{payload[0].value}</span> Incidents ({label})
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area type="monotone" dataKey="incidents" stroke="#818CF8" strokeWidth={2.5} fillOpacity={1} fill="url(#analytics-inc-grad)" dot={{ r: 3, fill: '#818CF8' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom Row (2 Cards: Incidents by Category + Top 5 Affected Regions) matching Screen 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Card 1: Incidents by Category */}
        <div
          className="p-5 sm:p-6 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-4">
            Incidents by Category
          </h3>

          <div className="flex items-center justify-between gap-4">
            {/* Donut Chart */}
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DONUT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={64}
                    paddingAngle={3}
                    dataKey="value"
                    stroke={isLight ? '#FFFFFF' : '#0F1524'}
                    strokeWidth={2}
                  >
                    {CATEGORY_DONUT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">23.8M</span>
                <span className="text-[9px] text-slate-400">Total</span>
              </div>
            </div>

            {/* Breakdown List matching Screen 2 */}
            <div className="flex-1 space-y-1.5 min-w-0">
              {CATEGORY_DONUT_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 text-[11px] font-medium truncate">{item.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 ml-2 whitespace-nowrap">
                    <strong className="text-white">{item.count}</strong> ({item.percent})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Top 5 Affected Regions */}
        <div
          className="p-5 sm:p-6 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Top 5 Affected Regions
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">This Week ▾</span>
          </div>

          {/* Horizontal Progress Bars matching Screen 2 */}
          <div className="space-y-3 flex-1 justify-center flex flex-col">
            {REGIONS_DATA.map((reg) => (
              <div key={reg.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium text-[11px]">{reg.name}</span>
                  <span className="font-mono font-bold text-white text-[11px]">{reg.label}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-400"
                    style={{ width: `${(reg.value / 4.2) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
