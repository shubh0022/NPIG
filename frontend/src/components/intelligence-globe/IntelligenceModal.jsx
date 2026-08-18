import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  X, 
  MapPin, 
  Droplets, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { INTELLIGENCE_CATEGORIES } from '../../data/intelligenceGlobeData'

const ICON_MAP = {
  traffic: MapPin,
  climate: Droplets,
  security: ShieldAlert,
  infrastructure: Cpu,
  healthcare: Activity,
}

/**
 * Compact Intelligence Drilldown Modal
 * Opened on node click or alert selection.
 */
export default function IntelligenceModal({
  node = null,
  isOpen = false,
  onClose = () => {},
  theme = 'dark',
}) {
  const navigate = useNavigate()
  const isLight = theme === 'light'

  if (!node || !isOpen) return null

  const categoryMeta = INTELLIGENCE_CATEGORIES[node.category.toUpperCase()] || INTELLIGENCE_CATEGORIES.TRAFFIC
  const IconComponent = ICON_MAP[node.category] || MapPin

  const handleNavigateToPredictions = () => {
    onClose()
    navigate('/predictions', { state: { targetNode: node.id, category: node.category } })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden z-10"
          style={{
            backgroundColor: isLight ? '#FFFFFF' : '#0B1020',
            borderColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.12)',
            boxShadow: isLight
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
              : '0 25px 60px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Top Decorative Ambient Accent */}
          <div
            className="absolute top-0 inset-x-0 h-1.5"
            style={{
              background: `linear-gradient(90deg, ${node.color} 0%, #6366F1 50%, #38BDF8 100%)`,
            }}
          />

          {/* Modal Header */}
          <div className="p-6 pb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-inner"
                style={{
                  backgroundColor: `${node.color}15`,
                  borderColor: `${node.color}35`,
                  color: node.color,
                }}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    {categoryMeta.label}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight">
                  {node.name} Intelligence
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {node.region} · {node.country}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close intelligence panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body / Telemetry Grid */}
          <div className="px-6 py-3 space-y-4">
            {/* Risk & Confidence Summary Strip */}
            <div
              className="p-4 rounded-2xl border flex items-center justify-between gap-4"
              style={{
                backgroundColor: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)',
                borderColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.06)',
              }}
            >
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-0.5">
                  Current Status
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                  {node.riskLevel} Risk
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{node.currentMetric}</div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-0.5">
                  AI Model Confidence
                </div>
                <div className="text-base font-extrabold text-indigo-400 flex items-center justify-end gap-1 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  {node.confidence}%
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">Calibrated (Live)</div>
              </div>
            </div>

            {/* Detailed Predictions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-3.5 rounded-xl border"
                style={{
                  backgroundColor: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  Predicted Shift
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {node.predictedRisk}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">High probability trend</p>
              </div>

              <div
                className="p-3.5 rounded-xl border"
                style={{
                  backgroundColor: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  Forecast Window
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {node.predictionWindow}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{node.affectedZones} affected zones</p>
              </div>
            </div>

            {/* Tactical Action Recommendation */}
            <div
              className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-1"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Autonomous Recommendation
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {node.actionRecommendation}
              </p>
            </div>
          </div>

          {/* Modal Footer / Navigation CTA */}
          <div className="p-6 pt-3 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-white/5 mt-2">
            <span className="text-[10px] text-slate-500 font-mono">
              Telemetry updated: {node.updatedAt}
            </span>
            <button
              type="button"
              onClick={handleNavigateToPredictions}
              className="btn-primary !px-5 !py-2.5 !rounded-xl !text-xs !font-bold flex items-center gap-2 group"
            >
              <span>View Detailed Prediction</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
