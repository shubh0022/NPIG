import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Smartphone, 
  Laptop, 
  History, 
  AlertOctagon, 
  CheckCircle2, 
  RefreshCw, 
  Copy,
  Plus
} from 'lucide-react'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

export default function SecurityPage() {
  const { theme, user } = useStore()
  const [apiKeyCopied, setApiKeyCopied] = useState(false)

  const activeSessions = [
    {
      id: 'sess-1',
      device: 'Apple MacBook Pro 16" (macOS 15.4)',
      icon: Laptop,
      ip: '103.21.124.52 (New Delhi)',
      status: 'Current Active Session',
      isCurrent: true,
      lastActive: 'Now',
    },
    {
      id: 'sess-2',
      device: 'iPhone 16 Pro (iOS 19.1)',
      icon: Smartphone,
      ip: '103.21.124.89 (New Delhi)',
      status: 'Authenticated (Biometric)',
      isCurrent: false,
      lastActive: '24 min ago',
    },
    {
      id: 'sess-3',
      device: 'Secure Ops Terminal (Debian Linux)',
      icon: Laptop,
      ip: '10.240.12.1 (Gov Intranet)',
      status: 'Air-gapped Session',
      isCurrent: false,
      lastActive: '2 hrs ago',
    },
  ]

  const auditLogs = [
    { time: '10:14:22', event: 'MFA Verification Successful', actor: 'Anand Kumar', ip: '103.21.124.52', status: 'SUCCESS' },
    { time: '09:48:10', event: 'Predictive Model Parameter Adjusted (ARIMA-ST)', actor: 'Anand Kumar', ip: '103.21.124.52', status: 'LOGGED' },
    { time: '08:30:15', event: 'API Key Rotated: National Dispatch Gateway', actor: 'System Auto-KMS', ip: '10.240.0.1', status: 'ROTATED' },
    { time: '06:12:00', event: 'Blocked Unauthorized Probing on Port 8004', actor: 'Threat Hunter AI', ip: '198.51.100.44', status: 'BLOCKED' },
  ]

  const copyApiKey = () => {
    navigator.clipboard.writeText('npig_sec_live_9921_f7b2a9e144c8913b')
    setApiKeyCopied(true)
    toast.success('Production API Key copied to clipboard')
    setTimeout(() => setApiKeyCopied(false), 3000)
  }

  return (
    <div className="space-y-6">
      
      {/* ── Header ── */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Trust Security & Sovereign Audit Center</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Security Command Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light mt-0.5">
          Active sessions, cryptographic credentials, and real-time sovereign audit logs.
        </p>
      </div>

      {/* ── Security Posture Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'MFA Status', v: 'Enforced', s: 'FIDO2 / Hardware Token', c: 'text-emerald-400' },
          { l: 'Encryption Level', v: 'AES-256', s: 'Post-Quantum Prepared', c: 'text-indigo-400' },
          { l: 'Active Sessions', v: '3 Devices', s: 'All IP Verified', c: 'text-sky-400' },
          { l: 'Threat Defense SLA', v: '100% CNI', s: 'Zero Compromise', c: 'text-emerald-400' },
        ].map((c) => (
          <div
            key={c.l}
            className="npig-card p-5"
            style={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
              borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{c.l}</p>
            <p className={`font-display text-2xl font-black ${c.c} mt-1`}>{c.v}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{c.s}</p>
          </div>
        ))}
      </div>

      {/* ── Active Sessions & API Credentials ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Sessions */}
        <div className="lg:col-span-6">
          <div
            className="npig-card p-6 flex flex-col justify-between h-full"
            style={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
              borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Active Sessions & Devices
                </h3>
                <span className="text-xs text-indigo-400 font-semibold font-mono">3 Live Relays</span>
              </div>

              <div className="space-y-3">
                {activeSessions.map((s) => {
                  const Icon = s.icon
                  return (
                    <div key={s.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {s.device}
                            {s.isCurrent && <span className="text-[9px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Current</span>}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{s.ip} · {s.lastActive}</p>
                        </div>
                      </div>
                      {!s.isCurrent && (
                        <button
                          onClick={() => toast.success('Terminated remote session')}
                          className="text-[10px] font-bold text-red-400 hover:bg-red-500/10 px-2 py-1 rounded"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
              <button
                onClick={() => toast.success('All other sessions revoked successfully')}
                className="w-full btn-secondary !py-2.5 !rounded-xl !text-xs"
              >
                Terminate All Other Sessions
              </button>
            </div>
          </div>
        </div>

        {/* API Credentials & KMS */}
        <div className="lg:col-span-6">
          <div
            className="npig-card p-6 flex flex-col justify-between h-full"
            style={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
              borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-4">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Sovereign API Keys
                </h3>
                <span className="text-[10px] uppercase font-bold text-emerald-400">HSM Protected</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-900 dark:text-white">Production Dispatch Key</span>
                    <span className="text-[10px] font-mono text-slate-400">Created Jan 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      readOnly
                      value="npig_sec_live_9921_f7b2a9e144c8913b"
                      className="npig-input !py-2 !text-xs font-mono"
                    />
                    <button
                      onClick={copyApiKey}
                      className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex-shrink-0"
                      title="Copy Key"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-900 dark:text-white">Read-Only Telemetry Streaming Key</span>
                    <span className="text-[10px] font-mono text-slate-400">Auto-Rotates in 14d</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      readOnly
                      value="npig_ro_stream_5514_e81c009a224d"
                      className="npig-input !py-2 !text-xs font-mono"
                    />
                    <button
                      onClick={() => toast.success('Read-only key copied')}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <button
                onClick={() => toast.success('New API Key Generated and logged to audit trail')}
                className="btn-primary !px-4 !py-2 !rounded-xl !text-xs !font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Generate Key
              </button>
              <button
                onClick={() => toast.success('Cryptographic keys rotated successfully')}
                className="btn-secondary !px-4 !py-2 !rounded-xl !text-xs"
              >
                Rotate All KMS Keys
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Real-Time Audit Logs ── */}
      <div
        className="npig-card p-6"
        style={{
          backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
          borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-4">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
            Immutable Audit Trail
          </h3>
          <span className="text-xs text-slate-400 font-mono">SAIF & ISO 27001 Certified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 uppercase font-semibold">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Event Type</th>
                <th className="pb-3">Actor</th>
                <th className="pb-3">Source IP</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {auditLogs.map((log, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="py-3 font-mono text-slate-400">{log.time}</td>
                  <td className="py-3 font-medium text-slate-900 dark:text-white">{log.event}</td>
                  <td className="py-3 text-slate-400">{log.actor}</td>
                  <td className="py-3 font-mono text-slate-400">{log.ip}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'SUCCESS' || log.status === 'BLOCKED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
