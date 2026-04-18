import React, { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const REPORT_TEMPLATES = [
  {
    id: 'traffic', icon: '🚗', title: 'Traffic Intelligence Report',
    desc: 'Congestion analysis, accident predictions, and route optimization insights.',
    tags: ['ARIMA', 'Real-time', 'PDF/CSV'],
    color: 'from-blue-600 to-cyan-600',
    fields: ['Zone', 'Time Range', 'Incident Types'],
  },
  {
    id: 'crime', icon: '🔫', title: 'Crime Hotspot Analysis',
    desc: 'KDE-based crime density mapping with temporal patterns and patrol recommendations.',
    tags: ['KDE', 'Predictive', 'Interactive'],
    color: 'from-rose-600 to-pink-600',
    fields: ['District', 'Crime Type', 'Severity Level'],
  },
  {
    id: 'health', icon: '🦠', title: 'Health Risk Assessment',
    desc: 'Disease surveillance, outbreak probability, and hospital capacity analysis.',
    tags: ['SIR Model', 'WHO Format', 'Confidential'],
    color: 'from-emerald-600 to-teal-600',
    fields: ['Region', 'Disease Code', 'Population'],
  },
  {
    id: 'climate', icon: '🌊', title: 'Climate Risk Report',
    desc: 'Flood probability, heatwave analysis, and disaster management recommendations.',
    tags: ['NDRF', '48h Forecast', 'Alert Ready'],
    color: 'from-cyan-600 to-blue-600',
    fields: ['Zones', 'Risk Type', 'Authority'],
  },
  {
    id: 'cyber', icon: '💻', title: 'Cyber Threat Summary',
    desc: 'Infrastructure threat synopsis, blocked attacks, and CERT-In ready format.',
    tags: ['CERT-In', 'Classified', 'Incident Report'],
    color: 'from-violet-600 to-purple-600',
    fields: ['Systems', 'Threat Level', 'Assets'],
  },
  {
    id: 'executive', icon: '📊', title: 'Executive Intelligence Brief',
    desc: 'High-level cross-domain risk summary for senior administration.',
    tags: ['All Domains', 'Auto-AI', 'PDF Only'],
    color: 'from-amber-600 to-orange-600',
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
  TRAFFIC: 'badge-info',
  CRIME: 'badge-critical',
  HEALTH: 'badge-minimal',
  EXECUTIVE: 'badge-medium',
  CYBER: 'badge-info',
  CLIMATE: 'badge-low',
}

function ReportCard({ template, onGenerate }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="glass-card p-5 relative overflow-hidden cursor-pointer group"
      onClick={() => onGenerate(template)}
    >
      <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${template.color}`} />
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center text-2xl mb-4`}>
        {template.icon}
      </div>
      <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-brand-300 transition-colors">{template.title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-3">{template.desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {template.tags.map(t => (
          <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.05] border border-white/[0.08] text-slate-400">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-xs text-slate-500">Click to generate</span>
        <span className="text-brand-400 text-xs font-semibold group-hover:translate-x-1 transition-transform">Generate →</span>
      </div>
    </motion.div>
  )
}

function GenerateModal({ template, onClose }) {
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const [config, setConfig] = useState({ period: '24h', format: 'PDF', classification: 'RESTRICTED' })
  const { addReport } = useStore()

  const handleGenerate = async () => {
    setGenerating(true)
    // Simulate progress
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
    toast.success(`${template.title} generated successfully!`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-strong w-full max-w-md rounded-2xl overflow-hidden"
      >
        <div className={`h-1.5 bg-gradient-to-r ${template.color}`} />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center text-xl`}>{template.icon}</div>
            <div>
              <h3 className="text-base font-bold text-white">{template.title}</h3>
              <p className="text-xs text-slate-400">Configure and generate report</p>
            </div>
          </div>

          {!done ? (
            <>
              <div className="flex flex-col gap-3 mb-5">
                {[
                  { label: 'Time Period', key: 'period', options: ['1h', '24h', '7d', '30d', '90d'] },
                  { label: 'Format', key: 'format', options: ['PDF', 'CSV', 'JSON', 'XLSX'] },
                  { label: 'Classification', key: 'classification', options: ['UNCLASSIFIED', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET'] },
                ].map(f => (
                  <div key={f.key}>
                    <label className="input-label">{f.label}</label>
                    <select className="input" value={config[f.key]} onChange={e => setConfig(c => ({ ...c, [f.key]: e.target.value }))}>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {generating && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Generating AI insights...</span>
                    <span className="font-mono">{progress}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${template.color} rounded-full`}
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-mono">
                    {progress < 30 ? 'Fetching real-time data...' : progress < 60 ? 'Running AI analysis...' : progress < 90 ? 'Generating insights...' : 'Compiling report...'}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button className="btn-secondary flex-1" onClick={onClose} disabled={generating}>Cancel</button>
                <button className="btn-primary flex-1" onClick={handleGenerate} disabled={generating}>
                  {generating ? '⏳ Generating...' : '📄 Generate Report'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">✅</div>
              <h4 className="text-white font-bold mb-1">Report Ready!</h4>
              <p className="text-xs text-slate-400 mb-5">Your report has been generated and added to the library.</p>
              <div className="flex gap-3">
                <button className="btn-secondary flex-1" onClick={onClose}>Close</button>
                <button className="btn-primary flex-1" onClick={() => { toast.success('Download started!'); onClose() }}>
                  ⬇️ Download {config.format}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function ReportsPage() {
  const { reports } = useStore()
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)

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
    toast.success(`Dataset "${file.name}" uploaded and analyzed!`)
  }

  const handleDownload = (report) => {
    toast.success(`Downloading: ${report.title}`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-extrabold text-white">Reports & Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">AI-generated reports with insights from all data domains</p>
        </div>
        <div className="flex gap-2">
          <label className={`btn-secondary cursor-pointer text-sm ${uploading ? 'opacity-50' : ''}`}>
            {uploading ? '⏳ Analyzing...' : '📤 Upload Dataset'}
            <input type="file" accept=".csv,.xlsx,.json" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Reports Generated', value: allReports.length, icon: '📄', color: 'text-brand-400' },
          { label: 'Ready to Download', value: allReports.filter(r => r.status === 'READY').length, icon: '✅', color: 'text-emerald-400' },
          { label: 'Generating', value: allReports.filter(r => r.status === 'GENERATING').length, icon: '⏳', color: 'text-amber-400' },
          { label: 'Total Pages', value: allReports.reduce((s, r) => s + (r.pages || 0), 0), icon: '📑', color: 'text-violet-400' },
        ].map(m => (
          <div key={m.label} className="glass-card p-4 flex items-center gap-3">
            <span className="text-2xl">{m.icon}</span>
            <div>
              <div className={`text-2xl font-display font-extrabold ${m.color}`}>{m.value}</div>
              <div className="text-xs text-slate-500">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Section */}
      <div>
        <h2 className="section-title mb-4">Generate New Report</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TEMPLATES.map((tpl, i) => (
            <motion.div key={tpl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ReportCard template={tpl} onGenerate={setSelectedTemplate} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Report Library */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Report Library</h2>
          <input
            className="input w-56 py-1.5 text-xs"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_80px_90px_90px] gap-3 px-4 py-3 border-b border-white/[0.06] text-xs text-slate-500 uppercase tracking-wider font-semibold">
            <span>Report</span>
            <span>Type</span>
            <span>Format</span>
            <span>Size</span>
            <span>Actions</span>
          </div>
          <div className="max-h-96 overflow-y-auto scroll-y">
            {filteredReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-[1fr_100px_80px_90px_90px] gap-3 px-4 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors items-center"
              >
                <div>
                  <div className="text-sm font-medium text-white truncate">{report.title}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{report.created}</div>
                </div>
                <span className={TYPE_COLORS[report.type] || 'badge-info'}>{report.type}</span>
                <span className="text-xs font-mono text-slate-300">{report.format}</span>
                <span className="text-xs font-mono text-slate-400">{report.size}</span>
                <div className="flex gap-1.5">
                  {report.status === 'READY' ? (
                    <button onClick={() => handleDownload(report)} className="btn-ghost px-2 py-1 text-xs">⬇️</button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Gen...</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <GenerateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
