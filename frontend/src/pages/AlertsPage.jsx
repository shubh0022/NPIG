import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import { alertsAPI } from '../utils/api'
import toast from 'react-hot-toast'
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  X,
  ShieldAlert,
  ArrowRight,
  Radio,
  Plus,
} from 'lucide-react'
import GenerateAlertDrawer from '../components/Alerts/GenerateAlertDrawer'

const SEV_COLORS = { 
  CRITICAL: 'bg-red-500/10 text-red-500 border-red-500/30', 
  HIGH: 'bg-red-500/10 text-red-400 border-red-500/30', 
  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30', 
  LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', 
  INFO: 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
}

const CAT_ICONS = { 
  TRAFFIC: '🚗', 
  CRIME: '🔫', 
  HEALTH: '🏥', 
  CLIMATE: '🌊', 
  CYBER: '💻', 
  EMERGENCY: '🚨', 
  SYSTEM: '⚙️',
  INFRASTRUCTURE: '⚡'
}

export default function AlertsPage() {
  const { theme, alerts, setAlerts } = useStore()
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [filterSeverity, setFilterSeverity] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [generateDrawerOpen, setGenerateDrawerOpen] = useState(false)

  // Default sample fallback alerts if store is empty
  const defaultAlerts = [
    {
      alert_id: 'alt-9901',
      title: 'High Flood Risk Detected in Zone 7',
      description: 'Ultrasonic storm drain sensors indicate water level rising at 4.2 cm/min. High probability of inundation along Worli coastal lowlands.',
      severity: 'HIGH',
      category: 'CLIMATE',
      status: 'ACTIVE',
      confidence: 0.96,
      affected_zone: 'Mumbai Sector 7',
      affected_population: 85000,
      timestamp: '2 min ago',
      recommended_actions: ['Trigger flood barrier gates at Sector 7', 'Pre-route municipal transit via Western Elevated', 'Broadcast SMS advisory to residential ward'],
    },
    {
      alert_id: 'alt-9902',
      title: 'Traffic Congestion Predicted on NH48',
      description: 'Vehicle velocity dropped below 12 km/h across 6.4 km stretch near Electronic City junction. Secondary bottleneck forming on arterial ramps.',
      severity: 'MEDIUM',
      category: 'TRAFFIC',
      status: 'ACTIVE',
      confidence: 0.92,
      affected_zone: 'Delhi NH48 Corridor',
      affected_population: 42000,
      timestamp: '15 min ago',
      recommended_actions: ['Activate variable message signage for toll exit', 'Deploy quick reaction traffic marshals'],
    },
    {
      alert_id: 'alt-9903',
      title: 'Unusual Crowd Gathering Detected',
      description: 'Optical density telemetry flagged anomalous crowd clustering near metro transit concourse exceeding safe capacity limits.',
      severity: 'LOW',
      category: 'CRIME',
      status: 'ACTIVE',
      confidence: 0.88,
      affected_zone: 'Bengaluru Metro Station',
      affected_population: 12500,
      timestamp: '32 min ago',
      recommended_actions: ['Notify transit police squad', 'Adjust escalator direction to clear platform congestion'],
    },
    {
      alert_id: 'alt-9904',
      title: 'Cyber Threat Activity Increased',
      description: 'Distributed scan signatures identified against power grid SCADA telemetry relays across Northern Regional Load Despatch Centre.',
      severity: 'INFO',
      category: 'CYBER',
      status: 'ACTIVE',
      confidence: 0.95,
      affected_zone: 'Global / Northern CNI Gateway',
      affected_population: 120000,
      timestamp: '45 min ago',
      recommended_actions: ['Isolate external subnet 192.168.10.x', 'Activate encrypted telemetry failover bus'],
    },
    {
      alert_id: 'alt-9905',
      title: 'Heatwave Conditions Expected',
      description: 'Thermal infrared satellite observation projects ambient wet-bulb temperature exceeding 44.5°C over northern desert corridor.',
      severity: 'MEDIUM',
      category: 'CLIMATE',
      status: 'ACTIVE',
      confidence: 0.91,
      affected_zone: 'Rajasthan, India',
      affected_population: 94000,
      timestamp: '1 hr ago',
      recommended_actions: ['Pre-position emergency hydration units', 'Alert grid dispatchers for cooling load surge'],
    },
  ]

  const activeList = alerts && alerts.length > 0 ? alerts : defaultAlerts

  const filteredAlerts = activeList.filter((a) => {
    const matchCat = filterCategory === 'ALL' || a.category === filterCategory
    const matchSev = filterSeverity === 'ALL' || a.severity === filterSeverity
    const matchSearch = searchQuery === '' || 
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.affected_zone?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSev && matchSearch
  })

  const handleAlertCreated = (newAlert) => {
    setAlerts([newAlert, ...activeList])
  }

  const handleResolve = (id) => {
    setAlerts(activeList.map(a => a.alert_id === id ? { ...a, status: 'RESOLVED' } : a))
    toast.success('Alert resolved and archived to incident log')
    setSelectedAlert(null)
  }

  const handleAcknowledge = (id) => {
    setAlerts(activeList.map(a => a.alert_id === id ? { ...a, status: 'ACKNOWLEDGED' } : a))
    toast.success('Alert acknowledged. Dispatch team notified.')
  }

  return (
    <div className="space-y-6">
      
      {/* ── Header with Generate Alert CTA ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5" />
            <span>National Telemetry Dispatch Feed</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Active Alerts & Incident Feed
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Real-time multi-agency notifications, anomaly dispatches, and emergency routing.
          </p>
        </div>

        {/* Generate Alert CTA matching Reference */}
        <button
          onClick={() => setGenerateDrawerOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Alert</span>
        </button>
      </div>

      {/* ── Filters & Search ── */}
      <div 
        className="npig-card p-4 sm:p-5"
        style={{
          backgroundColor: theme === 'light' ? '#FFFFFF' : '#0F1524',
          borderColor: theme === 'light' ? '#E5E7EB' : '#1E2436',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-3.5 py-2 rounded-lg text-xs outline-none border cursor-pointer ${
                theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-[#0B1020] border-[#1E2436] text-white'
              }`}
            >
              <option value="ALL">All Categories</option>
              <option value="TRAFFIC">Traffic</option>
              <option value="CLIMATE">Climate & Disaster</option>
              <option value="CRIME">Public Safety</option>
              <option value="CYBER">Cyber Threat</option>
              <option value="HEALTH">Health</option>
            </select>

            {/* Severity Filter */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className={`px-3.5 py-2 rounded-lg text-xs outline-none border cursor-pointer ${
                theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-[#0B1020] border-[#1E2436] text-white'
              }`}
            >
              <option value="ALL">All Severities</option>
              <option value="HIGH">High Severity</option>
              <option value="MEDIUM">Medium Severity</option>
              <option value="LOW">Low Severity</option>
              <option value="INFO">Info</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search alerts, zones, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-xs outline-none border ${
                theme === 'light'
                  ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400'
                  : 'bg-[#0B1020] border-[#1E2436] text-white placeholder-slate-500'
              }`}
            />
          </div>

        </div>
      </div>

      {/* ── Alerts Grid List ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAlerts.map((alert) => (
          <motion.div
            key={alert.alert_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-xl border flex flex-col justify-between transition-all hover:border-indigo-500/40 cursor-pointer ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0F1524] border-[#1E2436]'
            }`}
            onClick={() => setSelectedAlert(alert)}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{CAT_ICONS[alert.category] || '⚠️'}</span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {alert.title}
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${SEV_COLORS[alert.severity] || SEV_COLORS.INFO}`}>
                  {alert.severity}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                {alert.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-400 font-mono">
              <span>📍 {alert.affected_zone || alert.location}</span>
              <span>⏱ {alert.timestamp}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Selected Alert Drilldown Modal ── */}
      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-xl p-6 rounded-2xl border shadow-2xl space-y-4 ${
                theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B1020] border-white/15 text-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${SEV_COLORS[selectedAlert.severity]}`}>
                    {selectedAlert.severity} SEVERITY
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                    {selectedAlert.title}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">ID: {selectedAlert.alert_id} · Zone: {selectedAlert.affected_zone}</p>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="p-1 rounded-lg hover:bg-white/5">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedAlert.description}
              </p>

              {selectedAlert.recommended_actions && (
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                  <p className="text-xs font-bold text-indigo-400">Recommended SOP Actions:</p>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {selectedAlert.recommended_actions.map((act, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => handleAcknowledge(selectedAlert.alert_id)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white"
                >
                  Acknowledge Alert
                </button>
                <button
                  onClick={() => handleResolve(selectedAlert.alert_id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Resolve Incident
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Generate Alert Drawer Component matching Reference Image ── */}
      <GenerateAlertDrawer
        isOpen={generateDrawerOpen}
        onClose={() => setGenerateDrawerOpen(false)}
        onAlertCreated={handleAlertCreated}
      />

    </div>
  )
}
