import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const REPORT_TEMPLATES = [
  {
    id: 'traffic', icon: '🚗', title: 'Traffic Intelligence Report',
    desc: 'Congestion analysis, accident predictions, and route optimization insights.',
    tags: ['ARIMA', 'Real-time', 'PDF/CSV'],
    color: 'from-blue-600 to-cyan-600', hex: '#3b82f6',
    fields: ['Zone', 'Time Range', 'Incident Types'],
  },
  {
    id: 'crime', icon: '🔫', title: 'Crime Hotspot Analysis',
    desc: 'KDE-based crime density mapping with temporal patterns and patrol recommendations.',
    tags: ['KDE', 'Predictive', 'Interactive'],
    color: 'from-rose-600 to-pink-600', hex: '#ff2d6b',
    fields: ['District', 'Crime Type', 'Severity Level'],
  },
  {
    id: 'health', icon: '🦠', title: 'Health Risk Assessment',
    desc: 'Disease surveillance, outbreak probability, and hospital capacity analysis.',
    tags: ['SIR Model', 'WHO Format', 'Confidential'],
    color: 'from-emerald-600 to-teal-600', hex: '#10b981',
    fields: ['Region', 'Disease Code', 'Population'],
  },
  {
    id: 'climate', icon: '🌊', title: 'Climate Risk Report',
    desc: 'Flood probability, heatwave analysis, and disaster management recommendations.',
    tags: ['NDRF', '48h Forecast', 'Alert Ready'],
    color: 'from-cyan-600 to-blue-600', hex: '#06b6d4',
    fields: ['Zones', 'Risk Type', 'Authority'],
  },
  {
    id: 'cyber', icon: '💻', title: 'Cyber Threat Summary',
    desc: 'Infrastructure threat synopsis, blocked attacks, and CERT-In ready format.',
    tags: ['CERT-In', 'Classified', 'Incident Report'],
    color: 'from-violet-600 to-purple-600', hex: '#8b5cf6',
    fields: ['Systems', 'Threat Level', 'Assets'],
  },
  {
    id: 'executive', icon: '📊', title: 'Executive Intelligence Brief',
    desc: 'High-level cross-domain risk summary for senior administration.',
    tags: ['All Domains', 'Auto-AI', 'PDF Only'],
    color: 'from-amber-600 to-orange-600', hex: '#f59e0b',
    fields: ['Classification', 'Distribution', 'Period'],
  },
]

const GENERATED_REPORTS = [
  { id: 'r1', title: 'Traffic Analysis — National Capital Region', type: 'TRAFFIC', created: '2024-04-14 08:30', size: '2.4 MB', format: 'PDF', status: 'READY', pages: 24 },
  { id: 'r2', title: 'Crime Hotspot Report — Q1 2024', type: 'CRIME', created: '2024-04-13 16:15', size: '1.8 MB', format: 'PDF', status: 'READY', pages: 18 },
  { id: 'r3', title: 'Disease Surveillance — Weekly Brief', type: 'HEALTH', created: '2024-04-13 09:00', size: '890 KB', format: 'CSV', status: 'READY', pages: null },
  { id: 'r4', title: 'Executive Intelligence Brief — April 2024', type: 'EXECUTIVE', created: '2024-04-12 20:45', size: '3.1 MB', format: 'PDF', status: 'GENERATING', pages: 32 },
  { id: 'r5', title: 'Cyber Threat Summary — Last 7 Days', type: 'CYBER', created: '2024-04-11 14:00', size: '1.2 MB', format: 'PDF', status: 'READY', pages: 15 },
]

const TYPE_COLORS = {
  TRAFFIC: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  CRIME: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  HEALTH: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  EXECUTIVE: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  CYBER: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  CLIMATE: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
}

const FORMAT_ICONS = { PDF: '📄', CSV: '📊', JSON: '🔗', XLSX: '📋', PPTX: '📽️' }

/* ─── Premium AI Summary ───────────────────────────────────────── */
function AISummaryCard() {
  const [generating, setGenerating] = useState(false)
  const [summary, setSummary] = useState(null)

  const generateSummary = () => {
    setGenerating(true)
    setTimeout(() => {
      setSummary({
        headline: 'Cross-Domain Risk Assessment — Last 24 Hours',
        insights: [
          { domain: 'Traffic', severity: 'HIGH', text: 'NH-48 corridor congestion 23% above baseline. 3 predicted accident hotspots identified.', color: '#3b82f6' },
          { domain: 'Cyber', severity: 'CRITICAL', text: 'SCADA endpoint anomaly detected on Eastern Grid. 47 intrusion attempts blocked.', color: '#8b5cf6' },
          { domain: 'Climate', severity: 'MEDIUM', text: 'Monsoon intensity 15% above seasonal average. Riverside districts on flood watch.', color: '#06b6d4' },
        ],
        confidence: 91.3,
        dataPoints: '2.4M',
        generatedAt: new Date().toLocaleTimeString(),
      })
      setGenerating(false)
    }, 2500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-3xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(59,130,246,0.06) 100%)',
        border: '1px solid rgba(139,92,246,0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(139,92,246,0.1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Premium gradient accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-500/60 via-blue-500/60 to-cyan-500/60" />
      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              🧠
            </motion.div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">AI Intelligence Summary</h3>
              <p className="text-[9px] text-violet-400 font-mono tracking-wider">NEXUS Neural Engine</p>
            </div>
          </div>
          {!summary && (
            <motion.button
              onClick={generateSummary}
              disabled={generating}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-400 hover:to-blue-400 transition-all disabled:opacity-50 shadow-[0_4px 20px_rgba(139,92,246,0.3)]"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⏳</motion.span>
                  Analyzing...
                </span>
              ) : 'Generate Summary'}
            </motion.button>
          )}
        </div>

        {generating && (
          <div className="py-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-violet-400"
                    style={{ boxShadow: '0 0 8px rgba(139,92,246,0.6)' }}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-medium">Analyzing 2.4M data points across 5 domains...</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500"
                style={{ boxShadow: '0 0 16px rgba(139,92,246,0.6)' }}
              />
            </div>
          </div>
        )}

        {summary && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
            <p className="text-sm font-black text-white tracking-tight">{summary.headline}</p>
            {summary.insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4, backgroundColor: `${insight.color}12` }}
                className="flex items-start gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all"
                style={{ background: `${insight.color}08`, border: `1px solid ${insight.color}20` }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: insight.color, boxShadow: `0 0 10px ${insight.color}60` }}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: insight.color }}>{insight.domain}</span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-md font-mono font-bold ${
                      insight.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : insight.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>{insight.severity}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-light">{insight.text}</p>
                </div>
              </motion.div>
            ))}
            <div className="flex items-center gap-5 pt-3 text-[9px] text-slate-500 font-mono font-bold tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Confidence: {summary.confidence}%
              </span>
              <span>Data: {summary.dataPoints} points</span>
              <span>Generated: {summary.generatedAt}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Premium Report Card ───────────────────────────────────────── */
function ReportCard({ template, onGenerate }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onGenerate(template)}
      className="rounded-3xl p-6 relative overflow-hidden cursor-pointer group transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(3,7,18,0.8) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Premium gradient accent */}
      <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${template.color}`} />
      
      {/* Multi-layer ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-[0.1] transition-opacity duration-500 pointer-events-none"
        style={{ background: template.hex }} />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none"
        style={{ background: template.hex }} />

      <motion.div
        whileHover={{ rotate: 12, scale: 1.1 }}
        className="w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl mb-4"
        style={{ 
          background: `${template.hex}20`, 
          border: `1px solid ${template.hex}30`,
          boxShadow: `0 0 24px ${template.hex}30`
        }}
      >
        {template.icon}
      </motion.div>
      
      <h3 className="text-sm font-black text-white mb-2 group-hover:text-blue-300 transition-colors tracking-tight">{template.title}</h3>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-4 font-light">{template.desc}</p>
      
      <div className="flex flex-wrap gap-2">
        {template.tags.map(t => (
          <span key={t} className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-white/[0.04] border border-white/[0.08] text-slate-500 uppercase tracking-wider">
            {t}
          </span>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[10px] text-slate-600 font-medium">Click to generate</span>
        <motion.span 
          whileHover={{ x: 4 }}
          className="text-sm font-black text-white transition-transform"
        >
          →
        </motion.span>
      </div>
    </motion.div>
  )
}

/* ─── Premium Generate Modal ───────────────────────────────────── */
function GenerateModal({ template, onClose }) {
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [config, setConfig] = useState({ period: '24h', format: 'PDF', classification: 'RESTRICTED' })
  const { addReport } = useStore()

  const handleGenerate = async () => {
    setGenerating(true)
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200))
      setProgress(i)
    }
    const newReport = {
      id: 'r-' + Date.now(),
      title: `${template.title} — ${new Date().toLocaleDateString('en-IN')}`,
      type: template.id.toUpperCase(),
      created: new Date().toLocaleString('en-IN'),
      size: `${(1 + Math.random() * 3).toFixed(1)} MB`,
      format: config.format,
      status: 'READY',
      pages: Math.floor(12 + Math.random() * 30),
    }
    addReport(newReport)
    setDone(true)
    setGenerating(false)
    toast.success(`${template.title} generated successfully!`, {
      style: { borderRadius: '12px', background: '#020617', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/90 backdrop-blur-2xl p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md rounded-3xl overflow-hidden relative"
        style={{
          background: 'rgba(15,23,42,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Premium gradient accent */}
        <div className={`h-[2px] bg-gradient-to-r ${template.color}`} />
        {/* Ambient glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: `${template.hex}15` }} />
        
        <div className="p-8 relative z-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* NPIG logo watermark */}
              <img src="/npig-logo.png" alt="NPIG" className="w-7 h-7 rounded-lg object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] opacity-70" />
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ 
                  background: `${template.hex}20`, 
                  border: `1px solid ${template.hex}30`,
                  boxShadow: `0 0 24px ${template.hex}30`
                }}
              >
                {template.icon}
              </motion.div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight">{template.title}</h3>
                <p className="text-[10px] text-slate-500 font-medium">Configure and generate</p>
              </div>
            </div>
          </div>

          {!done ? (
            <>
              <div className="flex flex-col gap-4 mb-6">
                {[
                  { label: 'Time Period', key: 'period', options: ['1h', '24h', '7d', '30d', '90d'] },
                  { label: 'Format', key: 'format', options: ['PDF', 'CSV', 'JSON', 'XLSX', 'PPTX'] },
                  { label: 'Classification', key: 'classification', options: ['UNCLASSIFIED', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET'] },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">{f.label}</label>
                    <select
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500/30 transition-all appearance-none cursor-pointer font-medium"
                      style={{ backdropFilter: 'blur(10px)' }}
                      value={config[f.key]}
                      onChange={e => setConfig(c => ({ ...c, [f.key]: e.target.value }))}
                    >
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {generating && (
                <div className="mb-6">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-2 font-medium">
                    <span>Generating AI insights...</span>
                    <span className="font-mono font-bold">{progress}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${template.color} rounded-full`}
                      style={{ width: `${progress}%`, boxShadow: `0 0 16px ${template.hex}50` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-3 font-mono font-medium">
                    {progress < 30 ? 'Fetching real-time data...' : progress < 60 ? 'Running AI analysis...' : progress < 90 ? 'Generating insights...' : 'Compiling report...'}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
                  onClick={onClose}
                  disabled={generating}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-400 hover:to-blue-400 transition-all disabled:opacity-50 shadow-[0_4px 20px_rgba(139,92,246,0.3)]"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? '⏳ Generating...' : `Generate ${config.format}`}
                </motion.button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_32px_rgba(16,185,129,0.3)]"
              >
                <span className="text-3xl">✓</span>
              </motion.div>
              <h4 className="text-white font-black mb-2 tracking-tight">Report Ready</h4>
              <p className="text-[11px] text-slate-500 mb-6 font-light">Your report has been generated and added to the library.</p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold border border-white/[0.08] text-slate-400 hover:text-white transition-all" 
                  onClick={onClose}
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold bg-white text-[#030712] hover:bg-slate-200 transition-all shadow-[0_4px 20px_rgba(255,255,255,0.1)]" 
                  onClick={() => { toast.success('Download started!'); onClose() }}
                >
                  {FORMAT_ICONS[config.format] || '📄'} Download {config.format}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Premium Export Toolbar ───────────────────────────────────── */
function ExportToolbar({ reports }) {
  const formats = [
    { id: 'pdf', label: 'PDF', icon: '📄', color: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30' },
    { id: 'xlsx', label: 'Excel', icon: '📊', color: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30' },
    { id: 'pptx', label: 'PowerPoint', icon: '📽️', color: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/30' },
    { id: 'csv', label: 'CSV', icon: '📋', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
  ]

  return (
    <div className="flex items-center gap-2">
      {formats.map(f => (
        <motion.button
          key={f.id}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toast.success(`Exporting ${reports.length} reports as ${f.label}`, {
            style: { borderRadius: '12px', background: '#020617', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }
          })}
          className={`px-4 py-2.5 rounded-2xl text-[10px] font-bold bg-gradient-to-br ${f.color} ${f.border} text-slate-400 hover:text-white transition-all flex items-center gap-2`}
        >
          <span className="text-sm">{f.icon}</span>
          <span>{f.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function ReportsPage() {
  const { reports } = useStore()
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [view, setView] = useState('grid') // grid or list

  const allReports = [...reports, ...GENERATED_REPORTS]
  const filteredReports = allReports.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 2000))
    setUploading(false)
    toast.success(`Dataset "${file.name}" uploaded and analyzed!`, {
      style: { borderRadius: '12px', background: '#020617', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
    })
  }

  const handleDownload = (report) => {
    toast.success(`Downloading: ${report.title}`, {
      style: { borderRadius: '12px', background: '#020617', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div>
          {/* Official NPIG brand badge on page header */}
          <div className="flex items-center gap-3 mb-3">
            <img src="/npig-logo.png" alt="NPIG" className="w-8 h-8 rounded-xl object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            <span className="text-[10px] font-mono font-bold text-blue-400 tracking-[0.25em] uppercase">NPIG · Intelligence Reports</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight"
          >
            Reports & Intelligence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm mt-2 font-light tracking-wide"
          >
            AI-generated reports with cross-domain intelligence insights
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          <motion.label
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-3 rounded-2xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
              uploading ? 'opacity-50' : ''
            } bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/15`}
            style={{ backdropFilter: 'blur(10px)' }}
          >
            {uploading ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⏳</motion.span>
                Analyzing...
              </>
            ) : (
              <>
                📤 Upload Dataset
              </>
            )}
            <input type="file" accept=".csv,.xlsx,.json" className="hidden" onChange={handleUpload} />
          </motion.label>
        </motion.div>
      </motion.div>

      {/* AI Summary Card */}
      <AISummaryCard />

      {/* Premium Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Reports Generated', value: allReports.length, icon: '📄', color: '#3b82f6', bg: 'from-blue-500/15 to-cyan-500/15', border: 'border-blue-500/30' },
          { label: 'Ready to Download', value: allReports.filter(r => r.status === 'READY').length, icon: '✅', color: '#10b981', bg: 'from-emerald-500/15 to-green-500/15', border: 'border-emerald-500/30' },
          { label: 'Generating', value: allReports.filter(r => r.status === 'GENERATING').length, icon: '⏳', color: '#f59e0b', bg: 'from-amber-500/15 to-orange-500/15', border: 'border-amber-500/30' },
          { label: 'Total Pages', value: allReports.reduce((s, r) => s + (r.pages || 0), 0), icon: '📑', color: '#8b5cf6', bg: 'from-violet-500/15 to-purple-500/15', border: 'border-violet-500/30' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${m.color}08 0%, ${m.color}04 100%)`,
              border: `1px solid ${m.color}20`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px ${m.color}10`,
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Ambient glow */}
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl pointer-events-none"
              style={{ background: `${m.color}15` }} />
            <motion.div
              whileHover={{ rotate: 12, scale: 1.15 }}
              className="text-2xl relative z-10"
            >
              {m.icon}
            </motion.div>
            <div className="relative z-10">
              <div className="text-2xl font-display font-black text-white">{m.value}</div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wider">{m.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Generate Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Generate New Report</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REPORT_TEMPLATES.map((tpl, i) => (
            <motion.div key={tpl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }}>
              <ReportCard template={tpl} onGenerate={setSelectedTemplate} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Report Library */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Report Library</h2>
          <div className="flex items-center gap-4">
            <ExportToolbar reports={filteredReports} />
            <input
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-xs text-white outline-none w-56 focus:border-blue-500/30 transition-all placeholder:text-slate-600 font-medium"
              style={{ backdropFilter: 'blur(10px)' }}
              placeholder="Search reports..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden relative"
          style={{ 
            background: 'rgba(15,23,42,0.4)', 
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Premium table header */}
          <div className="hidden sm:grid grid-cols-[1fr_90px_70px_70px_100px] gap-3 px-6 py-4 border-b border-white/[0.08] text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black bg-white/[0.02]">
            <span>Report</span>
            <span>Type</span>
            <span>Format</span>
            <span>Size</span>
            <span>Actions</span>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {filteredReports.map((report, i) => {
              const tc = TYPE_COLORS[report.type] || TYPE_COLORS.TRAFFIC
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.03 }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_90px_70px_70px_100px] gap-3 sm:gap-4 px-6 py-4 border-b border-white/[0.04] transition-colors items-center"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{report.title}</div>
                    <div className="text-[10px] text-slate-600 font-mono mt-1">{report.created}</div>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg w-fit ${tc.bg} ${tc.text} ${tc.border} border uppercase tracking-wider`}>
                    {report.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">{FORMAT_ICONS[report.format] || '📄'} {report.format}</span>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">{report.size}</span>
                  <div className="flex gap-2">
                    {report.status === 'READY' ? (
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload(report)}
                        className="px-4 py-2 rounded-xl text-[10px] font-bold bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/15 transition-all"
                      >
                        ⬇️ Download
                      </motion.button>
                    ) : (
                      <div className="flex items-center gap-2 text-[10px] text-amber-400 font-bold">
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⏳</motion.span>
                        Generating...
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Generate Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <GenerateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
