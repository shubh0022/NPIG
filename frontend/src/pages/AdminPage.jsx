import React, { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const MOCK_USERS = [
  { id: '1', name: 'Arjun Sharma',   email: 'arjun.sharma@npig.gov.in',   role: 'ADMIN',   clearance: 5, status: 'ACTIVE',    lastLogin: '2024-04-14 08:12', department: 'National Ops' },
  { id: '2', name: 'Priya Mehta',    email: 'priya.mehta@npig.gov.in',    role: 'OFFICER', clearance: 3, status: 'ACTIVE',    lastLogin: '2024-04-14 07:45', department: 'Crime Analytics' },
  { id: '3', name: 'Rahul Singh',    email: 'rahul.singh@npig.gov.in',    role: 'ANALYST', clearance: 3, status: 'ACTIVE',    lastLogin: '2024-04-13 22:30', department: 'Health Surveillance' },
  { id: '4', name: 'Kavita Reddy',   email: 'kavita.reddy@npig.gov.in',   role: 'VIEWER',  clearance: 1, status: 'ACTIVE',    lastLogin: '2024-04-13 18:00', department: 'Traffic Ops' },
  { id: '5', name: 'Vikram Nair',    email: 'vikram.nair@npig.gov.in',    role: 'OFFICER', clearance: 3, status: 'SUSPENDED', lastLogin: '2024-04-10 14:20', department: 'Cyber Security' },
  { id: '6', name: 'Sneha Patel',    email: 'sneha.patel@npig.gov.in',    role: 'ANALYST', clearance: 3, status: 'ACTIVE',    lastLogin: '2024-04-14 06:30', department: 'Climate Risk' },
  { id: '7', name: 'Deep Sen',       email: 'deep.sen@npig.gov.in',       role: 'VIEWER',  clearance: 1, status: 'PENDING',   lastLogin: 'Never',             department: 'Disaster Mgmt' },
]

const ROLE_COLORS = {
  ADMIN:   'badge-critical',
  OFFICER: 'badge-medium',
  ANALYST: 'badge-info',
  VIEWER:  'badge-minimal',
}

const STATUS_COLORS = {
  ACTIVE:    'text-emerald-400',
  SUSPENDED: 'text-severity-critical',
  PENDING:   'text-amber-400',
}

const SYSTEM_SERVICES = [
  { name: 'API Gateway',           port: 8000, status: 'HEALTHY', cpu: '12%', memory: '256MB', uptime: '99.97%' },
  { name: 'Auth Service',          port: 8001, status: 'HEALTHY', cpu: '8%',  memory: '180MB', uptime: '99.99%' },
  { name: 'Ingestion Service',     port: 8002, status: 'HEALTHY', cpu: '34%', memory: '512MB', uptime: '99.95%' },
  { name: 'Prediction Engine',     port: 8003, status: 'HEALTHY', cpu: '67%', memory: '1.2GB', uptime: '99.91%' },
  { name: 'Alert Service',         port: 8004, status: 'HEALTHY', cpu: '18%', memory: '340MB', uptime: '99.98%' },
  { name: 'Digital Twin',          port: 8005, status: 'HEALTHY', cpu: '24%', memory: '680MB', uptime: '99.93%' },
  { name: 'NEXUS Chatbot',         port: 8006, status: 'HEALTHY', cpu: '9%',  memory: '200MB', uptime: '99.96%' },
  { name: 'Kafka Broker',          port: 9092, status: 'HEALTHY', cpu: '21%', memory: '1.8GB', uptime: '99.94%' },
  { name: 'MongoDB',               port: 27017,status: 'HEALTHY', cpu: '14%', memory: '890MB', uptime: '99.99%' },
  { name: 'Redis Cache',           port: 6379, status: 'HEALTHY', cpu: '5%',  memory: '256MB', uptime: '100%' },
]

function UserRow({ u, onToggleStatus, onChangeRole }) {
  return (
    <tr className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {u.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{u.name}</div>
            <div className="text-xs text-slate-500 font-mono">{u.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <select
          value={u.role}
          onChange={e => onChangeRole(u.id, e.target.value)}
          className={clsx('badge cursor-pointer border-0 bg-transparent', ROLE_COLORS[u.role])}
        >
          {['ADMIN','OFFICER','ANALYST','VIEWER'].map(r => <option key={r} value={r} className="bg-void text-white">{r}</option>)}
        </select>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < u.clearance ? 'bg-brand-500' : 'bg-white/10'}`} />
          ))}
        </div>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-400">{u.department}</td>
      <td className="px-4 py-3.5">
        <span className={`text-xs font-bold ${STATUS_COLORS[u.status]}`}>{u.status}</span>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">{u.lastLogin}</td>
      <td className="px-4 py-3.5">
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleStatus(u.id)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'ACTIVE' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}
          >
            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
          </button>
          <button className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400 hover:bg-brand-500/30">
            Edit
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminPage() {
  const { user } = useStore()
  const [users, setUsers] = useState(MOCK_USERS)
  const [activeTab, setActiveTab] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleStatus = (id) => {
    setUsers(u => u.map(user => user.id === id
      ? { ...user, status: user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
      : user
    ))
    toast.success('User status updated')
  }

  const changeRole = (id, role) => {
    setUsers(u => u.map(user => user.id === id ? { ...user, role } : user))
    toast.success('Role updated successfully')
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const TABS = [
    { id: 'users',   label: '👥 Users',    count: users.length },
    { id: 'system',  label: '⚙️ System',   count: SYSTEM_SERVICES.length },
    { id: 'audit',   label: '📋 Audit Log', count: null },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-display font-extrabold text-white">Admin Panel</h1>
            <span className="badge-critical">ADMIN ONLY</span>
          </div>
          <p className="text-slate-400 text-sm">User management, system monitoring, and audit logs</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Logged in as</div>
          <div className="text-sm font-bold text-white">{user?.full_name}</div>
          <div className="text-xs text-severity-critical font-mono">CL-{user?.clearance_level || 5} ADMIN</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', val: users.length, icon: '👥', color: 'text-brand-400' },
          { label: 'Active', val: users.filter(u => u.status === 'ACTIVE').length, icon: '🟢', color: 'text-emerald-400' },
          { label: 'Suspended', val: users.filter(u => u.status === 'SUSPENDED').length, icon: '🔴', color: 'text-severity-critical' },
          { label: 'Pending', val: users.filter(u => u.status === 'PENDING').length, icon: '🟡', color: 'text-amber-400' },
        ].map(m => (
          <div key={m.label} className="glass-card p-4 flex items-center gap-3">
            <span className="text-xl">{m.icon}</span>
            <div>
              <div className={`text-2xl font-display font-extrabold ${m.color}`}>{m.val}</div>
              <div className="text-xs text-slate-500">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              activeTab === tab.id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            )}
          >
            {tab.label}
            {tab.count !== null && <span className="ml-2 text-xs font-mono opacity-60">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex gap-3 mb-4">
            <input
              className="input flex-1"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button className="btn-primary" onClick={() => toast.success('User creation form coming soon!')}>
              + Add User
            </button>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    {['User', 'Role', 'Clearance', 'Department', 'Status', 'Last Login', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white">{u.name.charAt(0)}</div>
                          <div>
                            <div className="text-sm font-semibold text-white">{u.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                          className={clsx('badge cursor-pointer border bg-transparent text-[10px]', ROLE_COLORS[u.role])}>
                          {['ADMIN','OFFICER','ANALYST','VIEWER'].map(r => <option key={r} value={r} className="bg-void text-white">{r}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=>(
                          <div key={i} className={`w-3 h-3 rounded-full ${i<u.clearance?'bg-brand-500':'bg-white/10'}`}/>
                        ))}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-400">{u.department}</td>
                      <td className="px-4 py-3.5"><span className={`text-xs font-bold ${STATUS_COLORS[u.status]}`}>{u.status}</span></td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">{u.lastLogin}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={()=>toggleStatus(u.id)} className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status==='ACTIVE'?'bg-red-500/20 text-red-400':'bg-emerald-500/20 text-emerald-400'}`}>
                            {u.status==='ACTIVE'?'Suspend':'Activate'}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYSTEM_SERVICES.map((svc, i) => (
            <motion.div key={svc.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-sm text-white">{svc.name}</div>
                <div className={`status-dot-ok`} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Port', val: svc.port, cls: 'font-mono text-brand-400' },
                  { label: 'CPU', val: svc.cpu, cls: 'text-white' },
                  { label: 'Memory', val: svc.memory, cls: 'text-white' },
                  { label: 'Uptime', val: svc.uptime, cls: 'text-emerald-400 font-bold' },
                ].map(m => (
                  <div key={m.label} className="bg-white/[0.03] rounded-lg px-3 py-2">
                    <div className="text-slate-500 mb-0.5">{m.label}</div>
                    <div className={m.cls}>{m.val}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Recent Audit Events
          </div>
          {[
            { time: '09:47:23', user: 'arjun.sharma', action: 'LOGIN', detail: 'Authenticated via Email+2FA', sev: 'INFO' },
            { time: '09:32:11', user: 'arjun.sharma', action: 'USER_SUSPEND', detail: 'Suspended user vikram.nair', sev: 'WARN' },
            { time: '09:15:00', user: 'priya.mehta', action: 'REPORT_GENERATE', detail: 'Generated Crime Hotspot Report', sev: 'INFO' },
            { time: '08:55:42', user: 'rahul.singh', action: 'ALERT_RESOLVE', detail: 'Resolved CRITICAL flood alert #CR-4821', sev: 'INFO' },
            { time: '08:30:00', user: 'SYSTEM', action: 'MODEL_RETRAIN', detail: 'Traffic ARIMA model retrained (acc: 91.8%)', sev: 'INFO' },
            { time: '07:45:12', user: 'kavita.reddy', action: 'LOGIN_FAIL', detail: 'Failed login attempt (wrong password)', sev: 'WARN' },
            { time: '07:20:00', user: 'SYSTEM', action: 'ALERT_CREATE', detail: 'AUTO: CRITICAL cyber alert generated', sev: 'CRIT' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02]">
              <span className="text-xs font-mono text-slate-500 w-20 flex-shrink-0">{log.time}</span>
              <span className={clsx('badge text-[9px] flex-shrink-0',
                log.sev === 'CRIT' ? 'badge-critical' : log.sev === 'WARN' ? 'badge-medium' : 'badge-info'
              )}>{log.action}</span>
              <span className="text-xs font-mono text-brand-400 w-32 flex-shrink-0 truncate">{log.user}</span>
              <span className="text-xs text-slate-400 truncate">{log.detail}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
