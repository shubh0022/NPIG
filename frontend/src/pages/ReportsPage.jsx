import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  FileCheck,
} from 'lucide-react'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const REPORTS_DATA = [
  {
    id: 'RPT-01',
    name: 'Daily Intelligence Report',
    type: 'Intelligence',
    generatedBy: 'Anand Kumar',
    date: 'May 18, 2025',
    status: 'Completed',
  },
  {
    id: 'RPT-02',
    name: 'Weekly Security Report',
    type: 'Security',
    generatedBy: 'Anand Kumar',
    date: 'May 18, 2025',
    status: 'Completed',
  },
  {
    id: 'RPT-03',
    name: 'Traffic Analysis Report',
    type: 'Traffic',
    generatedBy: 'Priya Singh',
    date: 'May 17, 2025',
    status: 'Completed',
  },
  {
    id: 'RPT-04',
    name: 'Climate Risk Assessment',
    type: 'Climate',
    generatedBy: 'Rohit Verma',
    date: 'May 17, 2025',
    status: 'Completed',
  },
  {
    id: 'RPT-05',
    name: 'Infrastructure Status Report',
    type: 'Infrastructure',
    generatedBy: 'Neha Sharma',
    date: 'May 16, 2025',
    status: 'Completed',
  },
  {
    id: 'RPT-06',
    name: 'Health Surveillance Report',
    type: 'Health',
    generatedBy: 'Anand Kumar',
    date: 'May 16, 2025',
    status: 'Completed',
  },
  {
    id: 'RPT-07',
    name: 'Cyber Threat Summary',
    type: 'Cyber',
    generatedBy: 'Rohit Verma',
    date: 'May 15, 2025',
    status: 'Completed',
  },
]

export default function ReportsPage() {
  const { theme } = useStore()
  const isLight = theme === 'light'
  const [filterTab, setFilterTab] = useState('All Reports')
  const [searchQuery, setSearchQuery] = useState('')
  const [reports, setReports] = useState(REPORTS_DATA)
  const [newReportModalOpen, setNewReportModalOpen] = useState(false)
  const [reportTitle, setReportTitle] = useState('')
  const [reportType, setReportType] = useState('Intelligence')

  const tabs = ['All Reports', 'Generated', 'Scheduled', 'Shared', 'Archived']

  const filteredReports = reports.filter((rpt) => {
    const matchSearch =
      searchQuery === '' ||
      rpt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rpt.generatedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rpt.type.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchSearch) return false
    if (filterTab === 'All Reports') return true
    if (filterTab === 'Generated') return true
    if (filterTab === 'Scheduled') return false
    if (filterTab === 'Shared') return true
    if (filterTab === 'Archived') return false
    return true
  })

  const handleCreateReport = (e) => {
    e.preventDefault()
    if (!reportTitle.trim()) return

    const newRpt = {
      id: `RPT-0${reports.length + 1}`,
      name: reportTitle,
      type: reportType,
      generatedBy: 'Anand Kumar',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Completed',
    }

    setReports([newRpt, ...reports])
    setReportTitle('')
    setNewReportModalOpen(false)
    toast.success(`Executive Report Generated: "${newRpt.name}"`)
  }

  const handleDownload = (name) => {
    toast.success(`Downloading ${name} (PDF/Encrypted)`)
  }

  return (
    <div className="space-y-5 pb-8">
      
      {/* ── Top Header matching Screen 4 ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5">
            Generate, manage and share intelligence reports.
          </p>
        </div>

        {/* Right Search, Filters, New Report */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs outline-none border transition-all ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  : 'bg-[#0F1524] border-[#1E2436] text-white placeholder-slate-500 focus:border-indigo-500/60'
              }`}
            />
          </div>

          <button
            onClick={() => toast('Applying report filter presets', { icon: '⚙️' })}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0F1524] hover:bg-[#1E2436] border-[#1E2436] text-slate-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => setNewReportModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* ── Main Container matching Screen 4 ── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
          borderColor: isLight ? '#E2E8F0' : '#1E2436',
        }}
      >
        {/* Filter Tabs */}
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

        {/* Reports Table matching Screen 4 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Report Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Generated By</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReports.map((rpt) => (
                <tr key={rpt.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>{rpt.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{rpt.type}</td>
                  <td className="py-3.5 px-4 text-slate-300">{rpt.generatedBy}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">{rpt.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {rpt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button
                        onClick={() => toast(`Opening preview for ${rpt.name}`, { icon: '👁️' })}
                        className="p-1 rounded hover:text-white hover:bg-white/5"
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(rpt.name)}
                        className="p-1 rounded hover:text-white hover:bg-white/5"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded hover:text-white hover:bg-white/5">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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
              10
            </button>
            <button className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px]">
              Showing 1 to {filteredReports.length} of 68
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

      {/* ── New Report Modal ── */}
      <AnimatePresence>
        {newReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B1020] border-white/15 text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white">Generate Intelligence Report</h3>
                <button onClick={() => setNewReportModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Report Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Critical National Infrastructure Synthesis"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Report Domain Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-white/10 text-white text-xs"
                  >
                    <option value="Intelligence">Intelligence</option>
                    <option value="Security">Security</option>
                    <option value="Traffic">Traffic</option>
                    <option value="Climate">Climate</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Health">Health</option>
                    <option value="Cyber">Cyber</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setNewReportModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white"
                  >
                    Generate Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
