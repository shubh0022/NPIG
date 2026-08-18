import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BrainCircuit,
  AlertTriangle,
  Target,
  Database,
  Filter,
  Zap,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const PREDICTIONS_TABLE = [
  {
    id: 'PRD-01',
    prediction: 'Traffic Congestion',
    category: 'Traffic',
    riskLevel: 'High',
    riskColor: 'bg-red-500/15 text-red-400 border border-red-500/30',
    confidence: '92%',
    confidenceNum: 92,
    impactArea: 'Mumbai',
    timeWindow: 'Next 6 hrs',
  },
  {
    id: 'PRD-02',
    prediction: 'Heavy Rainfall',
    category: 'Climate',
    riskLevel: 'Medium',
    riskColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    confidence: '78%',
    confidenceNum: 78,
    impactArea: 'Kerala',
    timeWindow: 'Next 24 hrs',
  },
  {
    id: 'PRD-03',
    prediction: 'Power Outage Risk',
    category: 'Infrastructure',
    riskLevel: 'Medium',
    riskColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    confidence: '64%',
    confidenceNum: 64,
    impactArea: 'Chennai',
    timeWindow: 'Next 12 hrs',
  },
  {
    id: 'PRD-04',
    prediction: 'Disease Outbreak Risk',
    category: 'Health',
    riskLevel: 'Low',
    riskColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    confidence: '35%',
    confidenceNum: 35,
    impactArea: 'Delhi',
    timeWindow: 'Next 7 days',
  },
  {
    id: 'PRD-05',
    prediction: 'Cyber Attack Risk',
    category: 'Cyber',
    riskLevel: 'High',
    riskColor: 'bg-red-500/15 text-red-400 border border-red-500/30',
    confidence: '89%',
    confidenceNum: 89,
    impactArea: 'Global',
    timeWindow: 'Next 24 hrs',
  },
  {
    id: 'PRD-06',
    prediction: 'Heatwave Conditions',
    category: 'Climate',
    riskLevel: 'Medium',
    riskColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    confidence: '71%',
    confidenceNum: 71,
    impactArea: 'Rajasthan',
    timeWindow: 'Next 48 hrs',
  },
  {
    id: 'PRD-07',
    prediction: 'Flood Risk',
    category: 'Climate',
    riskLevel: 'High',
    riskColor: 'bg-red-500/15 text-red-400 border border-red-500/30',
    confidence: '85%',
    confidenceNum: 85,
    impactArea: 'Assam',
    timeWindow: 'Next 24 hrs',
  },
]

export default function PredictionsPage() {
  const { theme } = useStore()
  const isLight = theme === 'light'
  const [filterTab, setFilterTab] = useState('All Predictions')
  const [selectedPrediction, setSelectedPrediction] = useState(null)

  const tabs = ['All Predictions', 'High Risk', 'Traffic', 'Climate', 'Security', 'Health']

  const filteredPredictions = PREDICTIONS_TABLE.filter((item) => {
    if (filterTab === 'All Predictions') return true
    if (filterTab === 'High Risk') return item.riskLevel === 'High'
    if (filterTab === 'Traffic') return item.category === 'Traffic'
    if (filterTab === 'Climate') return item.category === 'Climate'
    if (filterTab === 'Security') return item.category === 'Security' || item.category === 'Cyber'
    if (filterTab === 'Health') return item.category === 'Health'
    return true
  })

  return (
    <div className="space-y-5 pb-8">
      
      {/* ── Top Header matching Screen 3 ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Predictive Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5">
            AI/ML powered predictive intelligence and forecasts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toast('Configuring ML inference threshold filter', { icon: '⚙️' })}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0F1524] hover:bg-[#1E2436] border-[#1E2436] text-slate-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => toast.success('Running live STGCN prediction model synthesis...')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4" />
            <span>Generate Insight</span>
          </button>
        </div>
      </div>

      {/* ── 4 KPI Cards matching Screen 3 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Active Predictions */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">↑ 10.2%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Predictions</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">156</h2>
          </div>
        </div>

        {/* High Risk Predictions */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-rose-400">↓ 5.1%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">High Risk Predictions</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">23</h2>
          </div>
        </div>

        {/* Model Accuracy */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">↑ 2.3%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Model Accuracy</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">92.4%</h2>
          </div>
        </div>

        {/* Data Points Analyzed */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">↑ 15.3%</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Data Points Analyzed</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">23.8M</h2>
          </div>
        </div>

      </div>

      {/* ── Main Predictions Container matching Screen 3 ── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
          borderColor: isLight ? '#E2E8F0' : '#1E2436',
        }}
      >
        {/* Filter Pills Bar */}
        <div className="p-4 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterTab === tab
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

        {/* Predictions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Prediction</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Impact Area</th>
                <th className="py-3 px-4">Time Window</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPredictions.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedPrediction(row)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{row.prediction}</td>
                  <td className="py-3.5 px-4 text-slate-300">{row.category}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.riskColor}`}>
                      {row.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{row.confidence}</td>
                  <td className="py-3.5 px-4 text-slate-300">{row.impactArea}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">{row.timeWindow}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1 rounded text-slate-400 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Strip */}
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-40">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#5B4DFF] text-white font-bold text-xs flex items-center justify-center">
              1
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium text-xs flex items-center justify-center">
              2
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium text-xs flex items-center justify-center">
              3
            </button>
            <span className="px-1 text-slate-600">...</span>
            <button className="w-7 h-7 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white font-medium text-xs flex items-center justify-center">
              16
            </button>
            <button className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px]">
              Showing 1 to {filteredPredictions.length} of 156
            </span>
            <select
              className={`px-2 py-1 rounded-lg text-xs outline-none border cursor-pointer ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-[#0B1020] border-[#1E2436] text-white'
              }`}
            >
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  )
}
