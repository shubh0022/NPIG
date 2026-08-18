import React from 'react'
import { motion } from 'framer-motion'
import { Globe2, ShieldCheck, Activity, MapPin } from 'lucide-react'
import { INTELLIGENCE_NODES } from '../../data/intelligenceGlobeData'

/**
 * High-Aesthetic Geospatial Vector Fallback
 * Rendered when WebGL is unsupported or when reduced motion / fallback mode is triggered.
 */
export default function GlobeFallback({
  onSelectNode = () => {},
  theme = 'dark',
}) {
  const isLight = theme === 'light'

  return (
    <div
      className="relative w-full h-[450px] sm:h-[540px] lg:h-[620px] rounded-3xl overflow-hidden border flex flex-col items-center justify-center p-6 text-center"
      style={{
        backgroundColor: isLight ? '#FFFFFF' : '#0B1020',
        borderColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)',
      }}
      role="region"
      aria-label="Interactive global intelligence visualization"
    >
      {/* Screen Reader Semantic Announcement */}
      <span className="sr-only">
        Global intelligence network showing simulated traffic, climate, security, healthcare, and infrastructure events across major geographic sectors.
      </span>

      {/* Decorative Radial Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
        }}
      />

      {/* Stylized Vector Globe Illustration */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-indigo-500/30 flex items-center justify-center bg-gradient-to-b from-indigo-500/10 to-transparent shadow-2xl">
        <div className="absolute inset-4 rounded-full border border-sky-500/20 animate-pulse" />
        <div className="absolute inset-12 rounded-full border border-white/10" />
        <Globe2 className="w-32 h-32 text-indigo-400 opacity-60" />

        {/* Dynamic Static Node Anchors */}
        {INTELLIGENCE_NODES.slice(0, 5).map((node, i) => (
          <button
            key={node.id}
            onClick={() => onSelectNode(node)}
            className="absolute p-2 rounded-full hover:scale-125 transition-transform focus:outline-none"
            style={{
              top: `${25 + (i * 15)}%`,
              left: `${20 + ((i * 18) % 65)}%`,
            }}
            title={`${node.name} (${node.category})`}
          >
            <span
              className="w-3 h-3 rounded-full block animate-ping absolute inset-0 opacity-75"
              style={{ backgroundColor: node.color }}
            />
            <span
              className="w-3 h-3 rounded-full block relative"
              style={{ backgroundColor: node.color }}
            />
          </button>
        ))}
      </div>

      <div className="mt-6 z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Vector Intelligence Engine Active</span>
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          National Predictive Grid Synchronized
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Displaying geographic telemetry across monitored nodes in optimized 2D mode.
        </p>
      </div>
    </div>
  )
}
