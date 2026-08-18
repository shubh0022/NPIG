import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  RefreshCw,
  Settings,
  MoreVertical,
  Radio,
  X,
  Database,
  Cloud,
  Satellite,
  Wifi,
} from 'lucide-react'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const INTEGRATIONS_DATA = [
  {
    id: 'int-01',
    name: 'Weather API',
    type: 'API',
    status: 'Active',
    statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    lastSync: '2 min ago',
    records: '1.2M',
  },
  {
    id: 'int-02',
    name: 'Traffic Sensors',
    type: 'IoT',
    status: 'Active',
    statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    lastSync: '1 min ago',
    records: '2.8M',
  },
  {
    id: 'int-03',
    name: 'Police Database',
    type: 'Database',
    status: 'Active',
    statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    lastSync: '5 min ago',
    records: '3.4M',
  },
  {
    id: 'int-04',
    name: 'Satellite Feed',
    type: 'Satellite',
    status: 'Active',
    statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    lastSync: '10 min ago',
    records: '1.1M',
  },
  {
    id: 'int-05',
    name: 'Social Media Stream',
    type: 'Streaming',
    status: 'Active',
    statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    lastSync: 'Just now',
    records: '5.6M',
  },
  {
    id: 'int-06',
    name: 'Hospital Network',
    type: 'API',
    status: 'Inactive',
    statusBadge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    lastSync: '2 hrs ago',
    records: '0',
  },
  {
    id: 'int-07',
    name: 'Emergency Services',
    type: 'API',
    status: 'Error',
    statusBadge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    lastSync: '1 hr ago',
    records: '0',
  },
]

export default function DataCenterPage() {
  const { theme } = useStore()
  const isLight = theme === 'light'
  const [integrations, setIntegrations] = useState(INTEGRATIONS_DATA)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [intName, setIntName] = useState('')
  const [intType, setIntType] = useState('API')

  const handleSync = (name) => {
    toast.success(`Synchronizing telemetry stream for ${name}...`)
  }

  const handleAddIntegration = (e) => {
    e.preventDefault()
    if (!intName.trim()) return

    const newInt = {
      id: `int-0${integrations.length + 1}`,
      name: intName,
      type: intType,
      status: 'Active',
      statusBadge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      lastSync: 'Just now',
      records: '500K',
    }

    setIntegrations([newInt, ...integrations])
    setIntName('')
    setAddModalOpen(false)
    toast.success(`Connected Integration: ${newInt.name}`)
  }

  return (
    <div className="space-y-5 pb-8">
      
      {/* ── Top Header matching Screen 5 ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Integrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5">
            Manage data source integrations and connections.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Integration</span>
        </button>
      </div>

      {/* ── 4 KPI Cards matching Screen 5 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Integrations */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Integrations</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">48</h2>
          </div>
        </div>

        {/* Active */}
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
            <span className="text-[11px] font-mono font-bold text-emerald-400">↑ 4 this week</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">38</h2>
          </div>
        </div>

        {/* Inactive */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-400">↓ 1 this week</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Inactive</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">6</h2>
          </div>
        </div>

        {/* Error */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
            borderColor: isLight ? '#E2E8F0' : '#1E2436',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold text-rose-400">↑ 1 this week</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Error</p>
            <h2 className="font-sans font-black text-2xl text-slate-900 dark:text-white mt-0.5">4</h2>
          </div>
        </div>

      </div>

      {/* ── Integrations Table matching Screen 5 ── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
          borderColor: isLight ? '#E2E8F0' : '#1E2436',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Integration</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Sync</th>
                <th className="py-3 px-4">Records</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {integrations.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{row.name}</td>
                  <td className="py-3.5 px-4 text-slate-300">{row.type}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.statusBadge}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{row.lastSync}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{row.records}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button
                        onClick={() => toast(`Configuration settings for ${row.name}`, { icon: '⚙️' })}
                        className="p-1 rounded hover:text-white hover:bg-white/5"
                        title="Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSync(row.name)}
                        className="p-1 rounded hover:text-white hover:bg-white/5"
                        title="Sync Telemetry"
                      >
                        <RefreshCw className="w-4 h-4" />
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
      </div>

      {/* ── Add Integration Modal ── */}
      <AnimatePresence>
        {addModalOpen && (
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
                <h3 className="font-bold text-base text-white">Add Integration Pipeline</h3>
                <button onClick={() => setAddModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddIntegration} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Integration Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Municipal SCADA Water Level Feed"
                    value={intName}
                    onChange={(e) => setIntName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Connector Protocol Type</label>
                  <select
                    value={intType}
                    onChange={(e) => setIntType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-white/10 text-white text-xs"
                  >
                    <option value="API">REST / Webhook API</option>
                    <option value="IoT">MQTT / SCADA IoT</option>
                    <option value="Database">PostgreSQL / Oracle CNI</option>
                    <option value="Satellite">ISRO Doppler Radar / Satellite</option>
                    <option value="Streaming">Kafka / Streaming Bus</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white"
                  >
                    Add Connector
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
