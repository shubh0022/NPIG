import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import {
  Users,
  Building2,
  Server,
  BrainCircuit,
  ShieldAlert,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Radio,
  Lock,
  Key
} from 'lucide-react'

const MOCK_USERS = [
  { id: '1', name: 'Anand Kumar',    email: 'anand.kumar@npig.gov.in',    role: 'SUPER_ADMIN', org: 'National Command', status: 'ACTIVE', lastLogin: 'Just now' },
  { id: '2', name: 'Dr. Priya Sharma', email: 'priya.s@isro.gov.in',      role: 'RESEARCHER',  org: 'ISRO Geospatial',  status: 'ACTIVE', lastLogin: '14 min ago' },
  { id: '3', name: 'Inspector R. Verma', email: 'r.verma@delhipolice.gov.in', role: 'OFFICER', org: 'Delhi Police Ops', status: 'ACTIVE', lastLogin: '32 min ago' },
  { id: '4', name: 'Kavita Reddy',   email: 'kavita.r@nhai.gov.in',       role: 'ANALYST',     org: 'NHAI Corridor Hub', status: 'ACTIVE', lastLogin: '1 hr ago' },
  { id: '5', name: 'Vikram Nair',    email: 'vikram.n@cni.gov.in',        role: 'ORG_ADMIN',   org: 'Power Grid SCADA', status: 'SUSPENDED', lastLogin: '3 days ago' },
  { id: '6', name: 'Sneha Patel',    email: 'sneha.p@ndrf.gov.in',        role: 'VIEWER',      org: 'Disaster Relief',  status: 'PENDING',  lastLogin: 'Never' },
]

const ROLE_BADGES = {
  SUPER_ADMIN: 'bg-red-500/10 text-red-400 border border-red-500/30',
  ORG_ADMIN:   'bg-purple-500/10 text-purple-400 border border-purple-500/30',
  OFFICER:     'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  ANALYST:     'bg-sky-500/10 text-sky-400 border border-sky-500/30',
  RESEARCHER:  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  VIEWER:      'bg-slate-500/10 text-slate-400 border border-slate-500/30',
}

const SYSTEM_SERVICES = [
  { name: 'API Gateway (FastAPI)',        port: 8000, status: 'HEALTHY', cpu: '12%', memory: '256MB', uptime: '99.99%' },
  { name: 'Auth & Sovereign KMS',         port: 8001, status: 'HEALTHY', cpu: '8%',  memory: '180MB', uptime: '100%' },
  { name: 'Kafka Ingestion Pipeline',     port: 9092, status: 'HEALTHY', cpu: '34%', memory: '1.8GB', uptime: '99.95%' },
  { name: 'ST-GCN Traffic Prediction',    port: 8003, status: 'HEALTHY', cpu: '67%', memory: '1.4GB', uptime: '99.92%' },
  { name: 'HydroDynamic Inundation Engine', port: 8004, status: 'HEALTHY', cpu: '45%', memory: '980MB', uptime: '99.96%' },
  { name: 'NEXUS Neural Assistant',       port: 8006, status: 'HEALTHY', cpu: '14%', memory: '420MB', uptime: '99.98%' },
  { name: 'TimescaleDB / PostgreSQL',     port: 5432, status: 'HEALTHY', cpu: '22%', memory: '2.1GB', uptime: '99.99%' },
  { name: 'Redis Telemetry Cache',        port: 6379, status: 'HEALTHY', cpu: '6%',  memory: '310MB', uptime: '100%' },
]

const AI_MODELS = [
  { name: 'ST-GCN Corridor Velocity v3.2', domain: 'Traffic', accuracy: '93.4%', drift: '0.012 PSI', status: 'ACTIVE', latency: '42ms' },
  { name: 'HydroDynamic Basin Simulation', domain: 'Climate', accuracy: '96.1%', drift: '0.008 PSI', status: 'ACTIVE', latency: '110ms' },
  { name: 'KDE Crime Density Cluster', domain: 'Public Safety', accuracy: '88.2%', drift: '0.019 PSI', status: 'ACTIVE', latency: '35ms' },
  { name: 'SCADA Anomaly Isolation Forest', domain: 'Cyber', accuracy: '95.5%', drift: '0.004 PSI', status: 'ACTIVE', latency: '18ms' },
  { name: 'Syndromic Outbreak Forecast', domain: 'Healthcare', accuracy: '91.0%', drift: '0.015 PSI', status: 'ACTIVE', latency: '85ms' },
]

export default function AdminPage() {
  const { user, theme } = useStore()
  const [users, setUsers] = useState(MOCK_USERS)
  const [activeTab, setActiveTab] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
        toast.success(`User ${u.name} status updated to ${nextStatus}`)
        return { ...u, status: nextStatus }
      }
      return u
    }))
  }

  const changeRole = (id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))
    toast.success('RBAC Permission level updated')
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.org.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const TABS = [
    { id: 'users',   label: 'Users & RBAC', icon: Users, count: users.length },
    { id: 'models',  label: 'Model Registry', icon: BrainCircuit, count: AI_MODELS.length },
    { id: 'system',  label: 'System Health', icon: Server, count: SYSTEM_SERVICES.length },
    { id: 'audit',   label: 'Audit Trail', icon: ShieldAlert, count: null },
  ]

  return (
    <div className="space-y-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Sovereign Governance & Multi-Tenant RBAC</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light mt-0.5">
            Role-based access control, tenant isolation, model registry, and cluster telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <p className="text-slate-400 font-medium">Logged in as</p>
            <p className="font-bold text-slate-900 dark:text-white">{user?.name || 'Anand Kumar'}</p>
            <span className="text-[10px] text-red-400 font-mono font-bold">SUPER_ADMIN · LEVEL 5</span>
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Authorized Users', val: users.length, icon: '👥', color: 'text-indigo-400' },
          { label: 'Active Sessions', val: users.filter(u => u.status === 'ACTIVE').length, icon: '🟢', color: 'text-emerald-400' },
          { label: 'Deployed Models', val: AI_MODELS.length, icon: '🧠', color: 'text-sky-400' },
          { label: 'System Health SLA', val: '99.98%', icon: '⚡', color: 'text-emerald-400' },
        ].map((m) => (
          <div
            key={m.label}
            className="npig-card p-5"
            style={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
              borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <span className="text-xl">{m.icon}</span>
            <div className={`font-display text-2xl font-black ${m.color} mt-2`}>{m.val}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex items-center flex-wrap gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : theme === 'light'
                    ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    : 'bg-[#0B1020] text-slate-400 border border-white/8 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 font-mono">{tab.count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Tab 1: Users & RBAC ── */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, email or agency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="npig-input !pl-10 !py-2 !text-xs !rounded-xl"
              />
            </div>
            <button
              onClick={() => toast.success('Open New Official Provisioning Modal')}
              className="btn-primary !px-4 !py-2 !rounded-xl !text-xs !font-bold flex items-center gap-1.5 self-end sm:self-center"
            >
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>

          <div
            className="npig-card overflow-hidden"
            style={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
              borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 uppercase font-semibold">
                    <th className="p-4">Official / Email</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Agency / Tenant</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Last Activity</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer outline-none ${ROLE_BADGES[u.role] || 'bg-slate-500/10'}`}
                        >
                          <option value="SUPER_ADMIN">SUPER ADMIN</option>
                          <option value="ORG_ADMIN">ORG ADMIN</option>
                          <option value="OFFICER">OFFICER</option>
                          <option value="ANALYST">ANALYST</option>
                          <option value="RESEARCHER">RESEARCHER</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{u.org}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 font-mono">{u.lastLogin}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            u.status === 'ACTIVE' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Tab 2: Model Registry ── */}
      {activeTab === 'models' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_MODELS.map((model) => (
              <div
                key={model.name}
                className="npig-card p-5 space-y-3"
                style={{
                  backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
                  borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      {model.domain}
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white mt-1.5">
                      {model.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {model.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-center text-xs">
                  <div>
                    <p className="text-[9px] uppercase text-slate-400">Accuracy</p>
                    <p className="font-mono font-bold text-emerald-400 mt-0.5">{model.accuracy}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-slate-400">Drift</p>
                    <p className="font-mono font-bold text-slate-300 mt-0.5">{model.drift}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-slate-400">Inference</p>
                    <p className="font-mono font-bold text-indigo-400 mt-0.5">{model.latency}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => toast.success(`Triggered retraining pipeline for ${model.name}`)}
                    className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retrain Model
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Tab 3: System Health ── */}
      {activeTab === 'system' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SYSTEM_SERVICES.map((svc) => (
            <div
              key={svc.name}
              className="npig-card p-5 space-y-3"
              style={{
                backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
                borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white truncate">
                  {svc.name}
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-[9px] text-slate-400 block">Port</span>
                  <span className="font-mono font-bold text-indigo-400">{svc.port}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-[9px] text-slate-400 block">CPU</span>
                  <span className="font-mono font-bold text-slate-300">{svc.cpu}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-[9px] text-slate-400 block">Memory</span>
                  <span className="font-mono font-bold text-slate-300">{svc.memory}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-[9px] text-slate-400 block">Uptime</span>
                  <span className="font-mono font-bold text-emerald-400">{svc.uptime}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── Tab 4: Audit Trail ── */}
      {activeTab === 'audit' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="npig-card p-6"
          style={{
            backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
            borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Immutable Governance Audit Stream
            </h3>
            <span className="text-xs font-mono text-indigo-400">Cryptographically Chained</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { time: '10:14:22', user: 'Anand Kumar', action: 'ROLE_UPDATE', detail: 'Elevated Dr. Priya Sharma to RESEARCHER', sev: 'INFO' },
              { time: '09:48:10', user: 'Anand Kumar', action: 'MODEL_RETRAIN', detail: 'Triggered ST-GCN v3.2 model optimization', sev: 'INFO' },
              { time: '08:30:15', user: 'System Auto-KMS', action: 'KEY_ROTATE', detail: 'Automatic 14-day cryptographic key rotation', sev: 'LOGGED' },
              { time: '06:12:00', user: 'Threat Hunter AI', action: 'PROBE_BLOCK', detail: 'Blocked unauthorized IP on Port 8004', sev: 'CRIT' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 text-[10px]">{log.time}</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-indigo-500/20 text-indigo-300">{log.action}</span>
                  <span className="text-slate-300 font-medium">{log.detail}</span>
                </div>
                <span className="font-mono text-slate-400 text-[10px]">{log.user}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  )
}
