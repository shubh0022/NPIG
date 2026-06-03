import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
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

// ── Premium Sub-Components ───────────────────────────────────────
function StatCard({ label, value, unit, icon, colorHex, trend, subtitle, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 280, damping: 22, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="metric-card cursor-default relative overflow-hidden"
      style={{ 
        boxShadow: `0 0 0 1px ${colorHex}15, 0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Premium gradient accent stripe */}
      <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-2xl overflow-hidden">
        <div style={{ background: `linear-gradient(90deg, transparent, ${colorHex}, transparent)` }} className="w-full h-full" />
      </div>
      {/* Multi-layer ambient glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-3xl rounded-tr-2xl blur-3xl opacity-25 pointer-events-none"
        style={{ background: colorHex }} />
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-tr-3xl rounded-bl-2xl blur-2xl opacity-15 pointer-events-none"
        style={{ background: colorHex }} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">{label}</p>
          <div className="text-4xl font-display font-black text-white leading-none tabular-nums mb-1">
            {value}<span className="text-sm text-slate-500 font-sans ml-1">{unit}</span>
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-2 font-light">{subtitle}</p>}
        </div>
        <motion.div
          whileHover={{ rotate: 12, scale: 1.15 }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ml-4"
          style={{
            background: `linear-gradient(135deg, ${colorHex}20 0%, ${colorHex}10 100%)`,
            border: `1px solid ${colorHex}40`,
            boxShadow: `0 0 24px ${colorHex}30`,
          }}
        >
          {icon}
        </motion.div>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-2 text-xs font-bold mt-3 px-3 py-1.5 rounded-xl ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
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
    <motion.div
      onClick={onClick}
      whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 border border-white/[0.06] hover:border-white/[0.12]"
    >
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ 
        background: color,
        boxShadow: `0 0 12px ${color}60`,
        ...(alert.severity === 'CRITICAL' ? { animation: 'pulse 1s infinite' } : {}) 
      }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white truncate">{icon} {alert.title}</p>
        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
          {alert.category} · {new Date(alert.created_at).toLocaleTimeString()}
        </p>
      </div>
      <span className={clsx('badge flex-shrink-0', `badge-${alert.severity?.toLowerCase()}`)}>{alert.severity}</span>
    </motion.div>
  )
}

function ZoneTile({ zone }) {
  const risk = Math.max(zone.traffic_risk, zone.crime_risk, zone.health_risk, zone.climate_risk)
  const c    = getRiskColor(risk)
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      className="p-4 rounded-2xl cursor-pointer relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${c.hex}15 0%, ${c.hex}08 100%)`,
        border: `1px solid ${c.hex}40`,
        boxShadow: `0 0 0 1px ${c.hex}20, 0 4px 16px ${c.hex}15`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300" style={{
        background: `radial-gradient(circle at center, ${c.hex}20 0%, transparent 70%)`,
      }} />
      
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5`}
          style={{ background: c.hex, boxShadow: `0 0 10px ${c.hex}80` }} />
        <span className="text-[10px] font-mono font-bold text-slate-400">{Math.round(risk * 100)}</span>
      </div>
      <div className="text-xs font-bold text-white leading-tight mb-1 truncate relative z-10">{zone.zone}</div>
      <div className={`text-[10px] font-bold ${c.cls} relative z-10`}>{zone.risk_level}</div>
    </motion.div>
  )
}

/* ─── AI Insights Card ──────────────────────────────────────── */
const AI_INSIGHTS = [
  { id: 1, priority: 'high', text: 'Traffic congestion predicted to peak on NH-48 between 17:00–19:00. Recommend diverting to alternate routes.', domain: 'Traffic', time: '2 min ago' },
  { id: 2, priority: 'critical', text: 'Anomalous cyber activity detected on SCADA endpoints in Eastern Grid. Immediate investigation advised.', domain: 'Cyber', time: '5 min ago' },
  { id: 3, priority: 'medium', text: 'Monsoon intensity increasing 23% above seasonal average. Pre-position NDRF units in riverside districts.', domain: 'Climate', time: '12 min ago' },
  { id: 4, priority: 'low', text: 'Crime pattern analysis suggests 15% reduction in nighttime incidents following enhanced patrol deployment.', domain: 'Crime', time: '18 min ago' },
]

function AIInsightsCard() {
  const [activeInsight, setActiveInsight] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveInsight(p => (p + 1) % AI_INSIGHTS.length), 6000)
    return () => clearInterval(t)
  }, [])

  const priorityColors = {
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-500', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
    high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' },
    medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-500', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
    low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-500', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-card p-6 relative overflow-hidden"
      style={{
        boxShadow: '0 0 0 1px rgba(139,92,246,0.1), 0 8px 32px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Premium ambient AI glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-violet-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center text-lg shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            🧠
          </div>
          <div>
            <p className="section-title text-base">AI Insights</p>
            <p className="text-[10px] text-violet-400 font-mono tracking-wider">NEXUS Neural Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
          <span className="text-[10px] text-slate-500 font-mono tracking-wider">Live Analysis</span>
        </div>
      </div>

      <div className="space-y-3">
        {AI_INSIGHTS.map((insight, idx) => {
          const pc = priorityColors[insight.priority]
          return (
            <motion.div
              key={insight.id}
              animate={{
                opacity: idx === activeInsight ? 1 : 0.5,
                scale: idx === activeInsight ? 1 : 0.97,
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => setActiveInsight(idx)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                idx === activeInsight ? `${pc.bg} ${pc.border} ${pc.glow}` : 'border-transparent hover:border-white/8 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${pc.dot} shadow-[0_0_8px_currentColor]`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${pc.text}`}>{insight.domain}</span>
                    <span className="text-[10px] text-slate-600 font-mono">{insight.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{insight.text}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ─── Layout Selector ────────────────────────────────────────── */
const LAYOUTS = [
  { id: 'default', label: 'Default', icon: '▦' },
  { id: 'compact', label: 'Compact', icon: '▤' },
  { id: 'wide', label: 'Wide', icon: '▥' },
]

// ── Main Dashboard ─────────────────────────────────────────────
export default function DashboardPage() {
  const { alerts, alertStats, predictions } = useStore()
  const navigate = useNavigate()
  const [chartData, setChartData] = useState(generateChartData(24))
  const [ticker, setTicker]       = useState(24381)
  const [layout, setLayout]       = useState('default')
  const [widgetOrder, setWidgetOrder] = useState(['trend', 'insights', 'alerts', 'zones', 'events'])

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

  /* Widget render map */
  const widgetMap = {
    trend: (
      <motion.div key="trend" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-5 col-span-full xl:col-span-2">
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
    ),

    insights: (
      <div key="insights" className="col-span-full xl:col-span-1">
        <AIInsightsCard />
      </div>
    ),

    alerts: (
      <motion.div key="alerts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-5 col-span-full xl:col-span-1">
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
    ),

    zones: (
      <motion.div key="zones" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-card p-5 col-span-full xl:col-span-1">
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
    ),

    events: (
      <motion.div key="events" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-5 col-span-full">
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
    ),
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Premium Header */}
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight"
          >
            Executive Command Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm mt-2 font-light tracking-wide"
          >
            Real-time national intelligence overview · AI-powered insights
          </motion.p>
        </div>
        <div className="flex items-center gap-4">
          {/* Premium layout switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-1.5">
            {LAYOUTS.map(l => (
              <motion.button
                key={l.id}
                onClick={() => setLayout(l.id)}
                title={l.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                  'px-3 py-2 rounded-xl text-xs font-bold transition-all',
                  layout === l.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-white border border-white/10 shadow-[0_0_16px_rgba(59,130,246,0.2)]'
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                {l.icon}
              </motion.button>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <span className="status-dot-ok" />
            All Systems Operational
          </motion.div>
        </div>
      </div>

      {/* Premium KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Active Alerts"       value={activeAlerts.length} icon="🚨" colorHex="#ff2d6b" subtitle={`${alertStats?.CRITICAL||0} critical`} trend={-12} delay={0}    />
        <StatCard label="Events Processed"    value={ticker.toLocaleString()}        icon="⚡" colorHex="#3B82F6" subtitle="Rolling 24hr total"         trend={8}   delay={0.05} />
        <StatCard label="Zones Monitored"     value="12"                  icon="🌐" colorHex="#8B5CF6" subtitle="Full national coverage"                       delay={0.1}  />
        <StatCard label="AI Accuracy"         value="91.3" unit="%"       icon="🧠" colorHex="#06B6D4" subtitle="Avg across 5 models"            trend={0.5}  delay={0.15} />
      </div>

      {/* Premium Alert Distribution strip */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="glass-card p-5 relative overflow-hidden"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Severity Distribution</p>
          <motion.button 
            onClick={() => navigate('/alerts')} 
            whileHover={{ x: 4 }}
            className="text-[10px] text-blue-400 hover:text-blue-300 font-bold transition-colors tracking-wider"
          >
            View All →
          </motion.button>
        </div>
        <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-white/[0.06]">
          {[
            { sev: 'CRITICAL', count: alertStats?.CRITICAL || 0, color: '#ff2d6b' },
            { sev: 'HIGH',     count: alertStats?.HIGH     || 0, color: '#f97316' },
            { sev: 'MEDIUM',   count: alertStats?.MEDIUM   || 0, color: '#f59e0b' },
            { sev: 'LOW',      count: alertStats?.LOW      || 0, color: '#3b82f6' },
            { sev: 'INFO',     count: alertStats?.INFO     || 0, color: '#818cf8' },
          ].map(item => (
            <motion.div
              key={item.sev}
              initial={{ width: 0 }}
              animate={{ width: `${totalBySev > 0 ? (item.count / totalBySev) * 100 : 0}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full rounded-full"
              style={{ background: item.color, boxShadow: `0 0 12px ${item.color}50` }}
              title={`${item.sev}: ${item.count}`}
            />
          ))}
        </div>
        <div className="flex gap-5 mt-3">
          {[
            { sev: 'CRITICAL', count: alertStats?.CRITICAL || 0, color: '#ff2d6b' },
            { sev: 'HIGH',     count: alertStats?.HIGH     || 0, color: '#f97316' },
            { sev: 'MEDIUM',   count: alertStats?.MEDIUM   || 0, color: '#f59e0b' },
            { sev: 'LOW',      count: alertStats?.LOW      || 0, color: '#3b82f6' },
          ].map(item => (
            <div key={item.sev} className="flex items-center gap-2 text-[10px]">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}60` }} />
              <span style={{ color: item.color }} className="font-bold">{item.sev}</span>
              <span className="text-white font-mono font-bold">{item.count}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Premium Draggable Widget Grid */}
      <Reorder.Group axis="y" values={widgetOrder} onReorder={setWidgetOrder} className={clsx(
        'grid gap-5',
        layout === 'compact' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-2' : layout === 'wide' ? 'grid-cols-1 xl:grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
      )}>
        {widgetOrder.map(wid => (
          <Reorder.Item key={wid} value={wid} id={wid} dragListener={false} style={{ cursor: 'grab' }}>
            <motion.div
              whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.1}
              className="relative"
            >
              {/* Drag handle indicator */}
              <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-white/[0.1] transition-colors" role="button" aria-label="Drag to reorder" tabIndex="0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400" aria-hidden="true">
                    <circle cx="9" cy="12" r="1"/>
                    <circle cx="9" cy="5" r="1"/>
                    <circle cx="9" cy="19" r="1"/>
                    <circle cx="15" cy="12" r="1"/>
                    <circle cx="15" cy="5" r="1"/>
                    <circle cx="15" cy="19" r="1"/>
                  </svg>
                </div>
              </div>
              {widgetMap[wid]}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
}
