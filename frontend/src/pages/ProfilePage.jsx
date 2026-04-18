import React, { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const CLEARANCE_LABELS = { 1: 'Basic', 2: 'Standard', 3: 'Enhanced', 4: 'Top Secret', 5: 'Maximum' }

const ACTIVITY_LOG = [
  { time: '2 min ago',  action: 'Viewed Traffic Prediction Dashboard', icon: '🚗' },
  { time: '15 min ago', action: 'Acknowledged CRITICAL Flood Alert',   icon: '🌊' },
  { time: '1 hr ago',   action: 'Generated Crime Hotspot Report',      icon: '📄' },
  { time: '3 hr ago',   action: 'Ran Disease Outbreak Prediction',     icon: '🦠' },
  { time: '5 hr ago',   action: 'Logged in via Email + 2FA',           icon: '🔐' },
  { time: '1 day ago',  action: 'Updated security passphrase',         icon: '🔑' },
]

export default function ProfilePage() {
  const { user, theme, toggleTheme } = useStore()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({
    full_name:  user?.full_name  || 'Administrator',
    department: user?.department || 'National Operations',
    phone:      '+91 98765 43210',
    location:   'New Delhi, India',
  })

  const [security, setSecurity] = useState({
    twoFA: true,
    emailAlerts: true,
    smsAlerts: false,
    sessionTimeout: '60',
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    setEditing(false)
    toast.success('Profile updated successfully!')
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-extrabold text-white">Profile & Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account, security, and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-3xl font-bold text-white shadow-glow-blue">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-void flex items-center justify-center">
              <span className="text-[10px]">✓</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{user?.full_name || 'Admin'}</h2>
                <p className="text-slate-400 text-sm">{user?.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="badge-critical">{user?.role || 'ADMIN'}</span>
                  <span className="badge-info">CL-{user?.clearance_level || 5} {CLEARANCE_LABELS[user?.clearance_level || 5]}</span>
                  <span className="badge-minimal">ACTIVE</span>
                </div>
              </div>
              <button onClick={() => setEditing(!editing)} className="btn-secondary text-xs px-3 py-1.5">
                {editing ? '✕ Cancel' : '✏️ Edit'}
              </button>
            </div>

            {/* Department / Phone */}
            {editing ? (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Full Name', key: 'full_name' },
                  { label: 'Department', key: 'department' },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Location', key: 'location' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="input-label">{f.label}</label>
                    <input className="input py-2 text-sm" value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div className="col-span-2">
                  <button className="btn-primary py-2 px-6" onClick={handleSave} disabled={saving}>
                    {saving ? '⏳ Saving...' : '✅ Save Changes'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  { label: 'Department', val: form.department },
                  { label: 'Phone', val: form.phone },
                  { label: 'Location', val: form.location },
                  { label: 'Joined', val: 'March 2024' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="text-xs text-slate-500">{item.label}</div>
                    <div className="text-sm text-white font-medium">{item.val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="glass-card p-5">
          <h3 className="section-title mb-4">🔐 Security</h3>
          <div className="flex flex-col gap-3">
            {[
              { key: 'twoFA', label: '2-Factor Authentication', desc: 'OTP via email on every login' },
              { key: 'emailAlerts', label: 'Email Alert Notifications', desc: 'Critical alerts sent to email' },
              { key: 'smsAlerts', label: 'SMS Alerts', desc: 'CRITICAL alerts via SMS' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div>
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                <button
                  onClick={() => { setSecurity(s => ({ ...s, [item.key]: !s[item.key] })); toast.success('Setting updated') }}
                  className={clsx(
                    'relative w-11 h-6 rounded-full transition-all duration-300',
                    security[item.key] ? 'bg-brand-600' : 'bg-white/10'
                  )}
                >
                  <div className={clsx('absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300', security[item.key] ? 'left-6' : 'left-1')} />
                </button>
              </div>
            ))}

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <label className="text-sm font-medium text-white block mb-2">Session Timeout</label>
              <select className="input py-1.5 text-sm" value={security.sessionTimeout} onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))}>
                {['30', '60', '120', '240'].map(v => <option key={v} value={v}>{v} minutes</option>)}
              </select>
            </div>

            <button onClick={() => toast.success('Password reset email sent!')} className="btn-danger w-full py-2 text-sm">
              🔑 Change Password
            </button>
          </div>
        </div>

        {/* Preferences + Permissions */}
        <div className="flex flex-col gap-4">
          {/* Preferences */}
          <div className="glass-card p-5">
            <h3 className="section-title mb-4">⚙️ Preferences</h3>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div>
                <div className="text-sm font-medium text-white">Interface Theme</div>
                <div className="text-xs text-slate-500">{theme === 'dark' ? 'Dark mode active' : 'Light mode active'}</div>
              </div>
              <button onClick={toggleTheme} className="btn-secondary px-3 py-1.5 text-xs">
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>

          {/* Permissions */}
          <div className="glass-card p-5">
            <h3 className="section-title mb-3">🛡️ Permissions</h3>
            <div className="flex flex-wrap gap-2">
              {(user?.permissions || ['read', 'write', 'manage_users', 'view_classified']).map(p => (
                <span key={p} className="badge-info font-mono text-[11px]">{p}</span>
              ))}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="glass-card p-5">
            <h3 className="section-title mb-3">📱 Active Sessions</h3>
            {[
              { device: '💻 Desktop — Chrome', location: 'New Delhi', current: true },
              { device: '📱 Mobile — Safari', location: 'Mumbai', current: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div>
                  <div className="text-xs font-medium text-white">{s.device}</div>
                  <div className="text-[10px] text-slate-500">{s.location}</div>
                </div>
                {s.current
                  ? <span className="badge-minimal text-[9px]">CURRENT</span>
                  : <button onClick={() => toast.success('Session terminated')} className="text-[10px] text-red-400 hover:text-red-300">Revoke</button>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="glass-card p-5">
        <h3 className="section-title mb-4">📋 Recent Activity</h3>
        <div className="flex flex-col divide-y divide-white/[0.04]">
          {ACTIVITY_LOG.map((log, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <span className="text-lg">{log.icon}</span>
              <div className="flex-1">
                <div className="text-xs text-white">{log.action}</div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
