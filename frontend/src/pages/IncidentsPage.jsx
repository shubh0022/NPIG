import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Shield,
  Radio,
  X,
} from 'lucide-react'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const INCIDENTS_DATA = [
  {
    id: 'INC-2025-0142',
    title: 'High Flood Risk Detected in Zone 7',
    category: 'Climate',
    severity: 'High',
    severityColor: 'bg-red-500/15 text-red-400 border border-red-500/30',
    status: 'Active',
    statusColor: 'text-emerald-400',
    location: 'Mumbai, India',
    time: '2 min ago',
  },
  {
    id: 'INC-2025-0141',
    title: 'Traffic Congestion on NH48',
    category: 'Traffic',
    severity: 'Medium',
    severityColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    status: 'Active',
    statusColor: 'text-emerald-400',
    location: 'Delhi, India',
    time: '15 min ago',
  },
  {
    id: 'INC-2025-0140',
    title: 'Unusual Crowd Gathering',
    category: 'Security',
    severity: 'Low',
    severityColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    status: 'Investigating',
    statusColor: 'text-sky-400',
    location: 'Bengaluru, India',
    time: '32 min ago',
  },
  {
    id: 'INC-2025-0139',
    title: 'Power Outage in Sector 12',
    category: 'Infrastructure',
    severity: 'Medium',
    severityColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    status: 'Investigating',
    statusColor: 'text-sky-400',
    location: 'Chennai, India',
    time: '45 min ago',
  },
  {
    id: 'INC-2025-0138',
    title: 'Cyber Threat Activity Increased',
    category: 'Cyber',
    severity: 'High',
    severityColor: 'bg-red-500/15 text-red-400 border border-red-500/30',
    status: 'Active',
    statusColor: 'text-emerald-400',
    location: 'Global',
    time: '1 hr ago',
  },
  {
    id: 'INC-2025-0137',
    title: 'Heatwave Conditions Expected',
    category: 'Climate',
    severity: 'Medium',
    severityColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    status: 'Monitoring',
    statusColor: 'text-amber-400',
    location: 'Rajasthan, India',
    time: '2 hrs ago',
  },
  {
    id: 'INC-2025-0136',
    title: 'Disease Outbreak Risk',
    category: 'Health',
    severity: 'Low',
    severityColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    status: 'Monitoring',
    statusColor: 'text-amber-400',
    location: 'Kerala, India',
    time: '3 hrs ago',
  },
]

export default function IncidentsPage() {
  const { theme } = useStore()
  const isLight = theme === 'light'
  const [filterTab, setFilterTab] = useState('All Incidents')
  const [searchQuery, setSearchQuery] = useState('')
  const [newIncidentModalOpen, setNewIncidentModalOpen] = useState(false)
  const [incidents, setIncidents] = useState(INCIDENTS_DATA)

  // New incident form state
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Security')
  const [newSeverity, setNewSeverity] = useState('High')
  const [newLocation, setNewLocation] = useState('')

  const filterTabs = ['All Incidents', 'Active', 'Critical', 'High', 'Medium', 'Low']

  const filteredIncidents = incidents.filter((inc) => {
    const matchSearch =
      searchQuery === '' ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchSearch) return false
    if (filterTab === 'All Incidents') return true
    if (filterTab === 'Active') return inc.status === 'Active'
    if (filterTab === 'Critical') return inc.severity === 'Critical'
    if (filterTab === 'High') return inc.severity === 'High'
    if (filterTab === 'Medium') return inc.severity === 'Medium'
    if (filterTab === 'Low') return inc.severity === 'Low'
    return true
  })

  const handleCreateIncident = (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newLocation.trim()) {
      toast.error('Please enter Title and Location')
      return
    }

    const created = {
      id: `INC-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      category: newCategory,
      severity: newSeverity,
      severityColor:
        newSeverity === 'High'
          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      status: 'Active',
      statusColor: 'text-emerald-400',
      location: newLocation,
      time: 'Just now',
    }

    setIncidents([created, ...incidents])
    setNewTitle('')
    setNewLocation('')
    setNewIncidentModalOpen(false)
    toast.success(`Incident Created: ${created.id}`)
  }

  return (
    <div className="space-y-5 pb-8">
      
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Incidents
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5">
            Monitor and manage all security and operational incidents.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs outline-none border transition-all ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  : 'bg-[#0F1524] border-[#1E2436] text-white placeholder-slate-500 focus:border-indigo-500/60'
              }`}
            />
          </div>

          {/* Filters */}
          <button
            onClick={() => toast('Applying advanced telemetry filters', { icon: '⚙️' })}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0F1524] hover:bg-[#1E2436] border-[#1E2436] text-slate-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* + New Incident Button */}
          <button
            onClick={() => setNewIncidentModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New Incident</span>
          </button>
        </div>
      </div>

      {/* ── 4 KPI Cards matching Screen 1 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Incidents */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-rose-400 flex items-center gap-0.5">
              ↓ 8.3% <span className="text-slate-500 font-normal text-[10px]">vs yesterday</span>
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Incidents</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">142</h2>
          </div>
        </div>

        {/* Card 2: Active Incidents */}
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
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
              ↑ 4.6% <span className="text-slate-500 font-normal text-[10px]">vs yesterday</span>
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Incidents</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">28</h2>
          </div>
        </div>

        {/* Card 3: Resolved */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
              ↑ 12.5% <span className="text-slate-500 font-normal text-[10px]">vs yesterday</span>
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Resolved</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">114</h2>
          </div>
        </div>

        {/* Card 4: Critical */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-rose-400 flex items-center gap-0.5">
              ↓ 2.1% <span className="text-slate-500 font-normal text-[10px]">vs yesterday</span>
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Critical</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">12</h2>
          </div>
        </div>

      </div>

      {/* ── Main Incidents Container ── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
          borderColor: isLight ? '#E2E8F0' : '#1E2436',
        }}
      >
        {/* Filter Pills Bar matching Screen 1 */}
        <div className="p-4 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
          {filterTabs.map((tab) => (
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

        {/* Data Table matching Screen 1 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{inc.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                    {inc.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{inc.category}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inc.severityColor}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold flex items-center gap-1.5 ${inc.statusColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{inc.location}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">{inc.time}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toast(`Opening details for ${inc.id}`, { icon: '📋' })}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Strip matching Screen 1 */}
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          {/* Page numbers */}
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
              15
            </button>
            <button className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Records count & page dropdown */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px]">
              Showing 1 to {filteredIncidents.length} of 142
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

      {/* ── New Incident Modal ── */}
      <AnimatePresence>
        {newIncidentModalOpen && (
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
                <h3 className="font-bold text-base text-white">Create New Incident</h3>
                <button onClick={() => setNewIncidentModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateIncident} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Incident Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Critical Grid Surge in Substation 4"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-white/10 text-white text-xs"
                    >
                      <option value="Security">Security</option>
                      <option value="Traffic">Traffic</option>
                      <option value="Climate">Climate</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Health">Health</option>
                      <option value="Cyber">Cyber</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Severity</label>
                    <select
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-white/10 text-white text-xs"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, India"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setNewIncidentModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white"
                  >
                    Create Incident
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
