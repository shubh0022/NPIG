import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import clsx from 'clsx'

// ── Helpers ──────────────────────────────────────────────────
function getRiskColor(r) {
  if (r > 0.8) return { hex: '#ff2d6b', cls: 'text-severity-critical', bg: 'bg-severity-critical' }
  if (r > 0.6) return { hex: '#f97316', cls: 'text-orange-400',         bg: 'bg-orange-400' }
  if (r > 0.4) return { hex: '#f59e0b', cls: 'text-amber-400',          bg: 'bg-amber-400' }
  if (r > 0.2) return { hex: '#3b82f6', cls: 'text-brand-400',          bg: 'bg-brand-400' }
  return              { hex: '#22c55e', cls: 'text-emerald-400',         bg: 'bg-emerald-400' }
}

const SEV_COLORS = { CRITICAL: '#ff2d6b', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#3b82f6', INFO: '#818cf8' }
const CAT_ICONS  = { TRAFFIC: '🚗', CRIME: '🔫', HEALTH: '🏥', CLIMATE: '🌊', CYBER: '💻', EMERGENCY: '🚨' }

function generateChartData(n = 24) {
  return Array.from({ length: n }, (_, i) => {
    const h = new Date(Date.now() - (n - 1 - i) * 3600000)
    return {
      time:    h.getHours().toString().padStart(2, '0') + ':00',
      traffic: Math.round(25 + 45 * Math.sin(i / 5) + Math.random() * 20),
      crime:   Math.round(8  + 18 * Math.sin(i / 8 + 1) + Math.random() * 12),
      health:  Math.round(12 + 10 * Math.sin(i / 10 + 2) + Math.random() * 8),
      climate: Math.round(20 + 25 * Math.sin(i / 7 + 0.5) + Math.random() * 15),
      events:  Math.round(800 + Math.random() * 3500),
    }
  })
}

// ── Sub-Components ────────────────────────────────────────────
function StatCard({ label, value, unit, icon, colorHex, trend, subtitle, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="metric-card cursor-default"
      style={{ boxShadow: `0 0 0 1px ${colorHex}12, 0 4px 24px rgba(0,0,0,0.2)` }}
    >
      {/* Top accent stripe with shimmer */}
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-xl overflow-hidden">
        <div style={{ background: `linear-gradient(90deg, transparent, ${colorHex}, transparent)` }} className="w-full h-full" />
      </div>
      {/* Ambient corner glow */}
      <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-3xl rounded-tr-xl blur-2xl opacity-20 pointer-events-none"
        style={{ background: colorHex }} />
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
          <div className="text-3xl font-display font-extrabold text-white leading-none tabular-nums">
            {value}<span className="text-sm text-slate-500 font-sans ml-1">{unit}</span>
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-1.5">{subtitle}</p>}
        </div>
        <motion.div
          whileHover={{ rotate: 8, scale: 1.1 }}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ml-3"
          style={{
            background: `${colorHex}18`,
            border: `1px solid ${colorHex}30`,
            boxShadow: `0 0 16px ${colorHex}25`,
          }}
        >
          {icon}
        </motion.div>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-semibold mt-2 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          <span>{trend >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend)}% from last hour</span>
        </div>
      )}
    </motion.div>
  )
}

function AlertFeedItem({ alert, onClick }) {
  const color = SEV_COLORS[alert.severity] || '#3b82f6'
  const icon  = CAT_ICONS[alert.category] || '📋'
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]"
    >
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color,
        ...(alert.severity === 'CRITICAL' ? { animation: 'pulse 1s infinite' } : {}) }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate">{icon} {alert.title}</p>
        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
          {alert.category} · {new Date(alert.created_at).toLocaleTimeString()}
        </p>
      </div>
      <span className={clsx('badge flex-shrink-0', `badge-${alert.severity?.toLowerCase()}`)}>{alert.severity}</span>
    </div>
  )
}

function ZoneTile({ zone }) {
  const risk = Math.max(zone.traffic_risk, zone.crime_risk, zone.health_risk, zone.climate_risk)
  const c    = getRiskColor(risk)
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-3 rounded-xl cursor-pointer"
      style={{
        background: `${c.hex}0e`,
        border: `1px solid ${c.hex}30`,
        boxShadow: `0 0 12px ${c.hex}10`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5`}
          style={{ background: c.hex, boxShadow: `0 0 6px ${c.hex}` }} />
        <span className="text-[9px] font-mono text-slate-500">{Math.round(risk * 100)}</span>
      </div>
      <div className="text-xs font-semibold text-white leading-tight mb-0.5 truncate">{zone.zone}</div>
      <div className={`text-[10px] font-bold ${c.cls}`}>{zone.risk_level}</div>
    </motion.div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function DashboardPage() {
  const { alerts, alertStats, predictions } = useStore()
  const navigate = useNavigate()
  const [chartData, setChartData] = useState(generateChartData(24))
  const [ticker, setTicker]       = useState(24381)

  useEffect(() => {
    const id = setInterval(() => {
      setChartData(prev => {
        const h   = new Date()
        const nxt = {
          time: h.getHours().toString().padStart(2,'0') + ':' + h.getMinutes().toString().padStart(2,'0'),
          traffic: Math.round(25 + Math.random() * 70),
          crime: Math.round(5 + Math.random() * 35),
          health: Math.round(10 + Math.random() * 25),
          climate: Math.round(15 + Math.random() * 45),
          events: Math.round(600 + Math.random() * 3800),
        }
        return [...prev.slice(1), nxt]
      })
      setTicker(c => c + Math.floor(50 + Math.random() * 350))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE')
  const totalBySev   = Object.values(alertStats).reduce((s, v) => s + (v || 0), 0)

  const customTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="glass-strong p-3 rounded-xl text-xs border border-brand-500/20">
        <p className="text-slate-400 mb-2 font-mono">{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-extrabold text-white">Command Center</h1>
          <p className="text-slate-400 text-sm mt-0.5">Real-time national intelligence overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <span className="status-dot-ok" />
            All Systems Operational
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Active Alerts"       value={activeAlerts.length} icon="🚨" colorHex="#ff2d6b" subtitle={`${alertStats?.CRITICAL||0} critical`} trend={-12} delay={0}    />
        <StatCard label="Events Processed"    value={ticker.toLocaleString()}        icon="⚡" colorHex="#2563eb" subtitle="Rolling 24hr total"         trend={8}   delay={0.05} />
        <StatCard label="Zones Monitored"     value="12"                  icon="🌐" colorHex="#7c3aed" subtitle="Full national coverage"                       delay={0.1}  />
        <StatCard label="AI Accuracy"         value="91.3" unit="%"       icon="🧠" colorHex="#10b981" subtitle="Avg across 5 models"            trend={0.5}  delay={0.15} />
      </div>

      {/* Row 2: Chart + Alert Distribution */}
      <div className="grid xl:grid-cols-3 gap-4">
        {/* 24hr Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-title">Risk Index — 24h Trend</p>
              <p className="section-subtitle">Live rolling window</p>
            </div>
            <div className="flex gap-3">
              {[['Traffic','#2563eb'], ['Crime','#ff2d6b'], ['Health','#10b981'], ['Climate','#f59e0b']].map(([l,c]) => (
                <div key={l} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <div className="w-3 h-0.5 rounded" style={{ background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
              <defs>
                {[['gT','#2563eb'], ['gC','#ff2d6b']].map(([id, c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569' }} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
              <Tooltip content={customTooltip} />
              <Area type="monotone" dataKey="traffic" stroke="#2563eb" strokeWidth={2} fill="url(#gT)" name="Traffic" />
              <Area type="monotone" dataKey="crime"   stroke="#ff2d6b" strokeWidth={2} fill="url(#gC)" name="Crime" />
              <Line  type="monotone" dataKey="health"  stroke="#10b981" strokeWidth={2} dot={false}      name="Health" />
              <Line  type="monotone" dataKey="climate" stroke="#f59e0b" strokeWidth={2} dot={false}      name="Climate" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Alert Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card p-5">
          <p className="section-title mb-4">Alert Distribution</p>
          <div className="flex flex-col gap-3">
            {[
              { sev: 'CRITICAL', count: alertStats?.CRITICAL || 0, color: '#ff2d6b' },
              { sev: 'HIGH',     count: alertStats?.HIGH     || 0, color: '#f97316' },
              { sev: 'MEDIUM',   count: alertStats?.MEDIUM   || 0, color: '#f59e0b' },
              { sev: 'LOW',      count: alertStats?.LOW      || 0, color: '#3b82f6' },
              { sev: 'INFO',     count: alertStats?.INFO     || 0, color: '#818cf8' },
            ].map(item => (
              <div key={item.sev}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: item.color }} className="font-semibold">{item.sev}</span>
                  <span className="text-white font-mono font-bold">{item.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalBySev > 0 ? (item.count / totalBySev) * 100 : 0}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: item.color, boxShadow: `0 0 8px ${item.color}60` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <button onClick={() => navigate('/alerts')} className="btn-secondary w-full text-xs py-2">
              View All Alerts →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Live Feed + Zone Heatmap */}
      <div className="grid xl:grid-cols-2 gap-4">
        {/* Live Alerts Feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="section-title">Live Alert Feed</p>
            <div className="flex items-center gap-2">
              <span className="status-dot-ok" />
              <span className="text-[10px] text-slate-500">Real-time</span>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto scroll-y flex flex-col gap-0.5">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm">No active alerts</div>
              </div>
            ) : activeAlerts.slice(0, 8).map(alert => (
              <AlertFeedItem key={alert.alert_id} alert={alert} onClick={() => navigate('/alerts')} />
            ))}
          </div>
        </motion.div>

        {/* Zone Risk Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="section-title">Zone Risk Heatmap</p>
            <span className="text-[10px] text-slate-500">Score /100</span>
          </div>
          {predictions?.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {predictions.slice(0, 12).map((pred, i) => (
                <motion.div key={pred.zone} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + i * 0.03 }}>
                  <ZoneTile zone={pred} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Events volume chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-5">
        <p className="section-title mb-4">Event Ingestion Volume (last 24h)</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569' }} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
            <Tooltip content={customTooltip} />
            <Bar dataKey="events" fill="#2563eb" radius={[3, 3, 0, 0]} fillOpacity={0.75} name="Events" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
