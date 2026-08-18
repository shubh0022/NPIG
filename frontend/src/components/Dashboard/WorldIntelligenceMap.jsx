import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, Shield, Activity, Radio, Info } from 'lucide-react'
import useStore from '../../store/useStore'

// ── Global Intelligence Hub Coordinates (Percentage-based SVG projection) ──
const INTELLIGENCE_HUBS = [
  {
    id: 'hub-india',
    name: 'South Asia National Grid (Delhi / Mumbai)',
    x: 69.5,
    y: 43.5,
    severity: 'HIGH',
    color: '#EF4444', // Crimson Red Epicenter
    glowColor: 'rgba(239, 68, 68, 0.6)',
    riskScore: 94,
    status: 'High Risk (Active Inundation & Congestion)',
    isEpicenter: true,
  },
  {
    id: 'hub-na-east',
    name: 'North America East Hub (New York / DC)',
    x: 27.5,
    y: 33.0,
    severity: 'MEDIUM',
    color: '#F59E0B', // Amber
    glowColor: 'rgba(245, 158, 11, 0.5)',
    riskScore: 68,
    status: 'Medium Risk (Severe Storm Telemetry)',
  },
  {
    id: 'hub-na-west',
    name: 'North America West (Silicon Valley)',
    x: 17.5,
    y: 35.0,
    severity: 'LOW',
    color: '#10B981', // Green
    glowColor: 'rgba(16, 185, 129, 0.4)',
    riskScore: 24,
    status: 'Low Risk (Optimal Transit Flow)',
  },
  {
    id: 'hub-europe',
    name: 'European Intelligence Hub (London / Frankfurt)',
    x: 48.5,
    y: 28.0,
    severity: 'INFO',
    color: '#38BDF8', // Cyan/Blue
    glowColor: 'rgba(56, 189, 248, 0.5)',
    riskScore: 45,
    status: 'Info (Data Relay Active)',
  },
  {
    id: 'hub-east-asia',
    name: 'East Asia Corridor (Tokyo / Singapore)',
    x: 82.5,
    y: 38.0,
    severity: 'LOW',
    color: '#10B981', // Green
    glowColor: 'rgba(16, 185, 129, 0.4)',
    riskScore: 32,
    status: 'Low Risk (Nominal SCADA telemetry)',
  },
  {
    id: 'hub-singapore',
    name: 'SE Asia Maritime Hub (Singapore)',
    x: 77.5,
    y: 58.0,
    severity: 'INFO',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    riskScore: 18,
    status: 'Info (Maritime Port Flow Optimal)',
  },
  {
    id: 'hub-australia',
    name: 'Oceania Grid (Sydney / Melbourne)',
    x: 88.0,
    y: 75.0,
    severity: 'INFO',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    riskScore: 15,
    status: 'Info (Synchronized)',
  },
  {
    id: 'hub-sa',
    name: 'Latin America Relay (São Paulo)',
    x: 35.0,
    y: 70.0,
    severity: 'INFO',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    riskScore: 28,
    status: 'Info (Telemetry Online)',
  },
]

// ── Global Network Arc Routes ──
const NETWORK_ARCS = [
  { from: { x: 27.5, y: 33.0 }, to: { x: 48.5, y: 28.0 }, cx: 38, cy: 16 }, // NA -> Europe
  { from: { x: 48.5, y: 28.0 }, to: { x: 69.5, y: 43.5 }, cx: 58, cy: 22 }, // Europe -> India
  { from: { x: 69.5, y: 43.5 }, to: { x: 82.5, y: 38.0 }, cx: 76, cy: 28 }, // India -> East Asia
  { from: { x: 69.5, y: 43.5 }, to: { x: 77.5, y: 58.0 }, cx: 74, cy: 50 }, // India -> Singapore
  { from: { x: 77.5, y: 58.0 }, to: { x: 88.0, y: 75.0 }, cx: 84, cy: 64 }, // Singapore -> Australia
  { from: { x: 27.5, y: 33.0 }, to: { x: 35.0, y: 70.0 }, cx: 28, cy: 52 }, // NA -> SA
  { from: { x: 17.5, y: 35.0 }, to: { x: 27.5, y: 33.0 }, cx: 22, cy: 30 }, // NA West -> East
]

export default function WorldIntelligenceMap({ onViewFullMap }) {
  const { theme } = useStore()
  const isLight = theme === 'light'
  const [hoveredHub, setHoveredHub] = useState(null)

  return (
    <div
      className="p-5 sm:p-6 rounded-xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
      style={{
        backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
        borderColor: isLight ? '#E2E8F0' : '#1E2436',
      }}
    >
      {/* ── Header Row ── */}
      <div className="flex items-center justify-between mb-3 z-10">
        <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
          Live Intelligence Map
        </h3>
        <button
          onClick={onViewFullMap}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              : 'bg-[#1E2436] hover:bg-[#283149] text-slate-200 border border-white/10 hover:text-white'
          }`}
        >
          View Full Map
        </button>
      </div>

      {/* ── Main High-Tech World Vector Canvas Map ── */}
      <div className="relative w-full h-[240px] sm:h-[280px] lg:h-[300px] rounded-lg overflow-hidden bg-[#070C16] border border-white/5 flex items-center justify-center select-none">
        
        {/* Subtle Background Graticule Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="world-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#38BDF8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#world-grid)" />
        </svg>

        {/* High-Precision World Continents Vector (Dark stylized vector silhouettes) */}
        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glowing filter for nodes and arcs */}
            <filter id="hub-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Arc Gradient */}
            <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#818CF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Continental Silhouettes with Subtle Neon Cyan Borders matching reference */}
          <g fill="#0D1629" stroke="#1E2F4D" strokeWidth="1" opacity="0.95">
            {/* North America */}
            <path d="M120 70 Q160 50 240 60 Q280 80 270 140 Q250 170 290 190 Q300 240 250 250 Q210 240 200 210 Q160 210 130 150 Q110 120 120 70 Z" />
            <path d="M220 50 Q260 30 300 45 Q310 70 270 80 Z" /> {/* Greenland */}
            
            {/* Central America & Caribbean */}
            <path d="M230 250 Q260 270 270 300 Q260 310 240 280 Z" />

            {/* South America */}
            <path d="M260 290 Q330 300 370 350 Q380 410 330 460 Q300 470 280 430 Q270 360 260 290 Z" />

            {/* Europe */}
            <path d="M460 70 Q510 65 540 90 Q560 130 520 160 Q480 170 450 140 Q440 100 460 70 Z" />
            <path d="M430 90 Q450 80 450 110 Q430 120 430 90 Z" /> {/* UK */}

            {/* Africa */}
            <path d="M460 170 Q540 165 570 230 Q580 320 520 370 Q470 360 450 270 Q430 210 460 170 Z" />
            <path d="M575 310 Q595 310 590 350 Q575 350 575 310 Z" /> {/* Madagascar */}

            {/* Asia & Middle East */}
            <path d="M540 80 Q640 60 780 70 Q870 90 890 160 Q860 240 800 250 Q750 240 730 200 Q680 250 630 210 Q600 240 570 200 Q540 180 540 80 Z" />
            
            {/* India Subcontinent (Enhanced Detail & Prominence) */}
            <path d="M650 190 Q720 190 730 230 Q720 280 690 320 Q660 280 650 230 Z" fill="#13203A" stroke="#2563EB" strokeWidth="1.2" />

            {/* Japan / East Asia Islands */}
            <path d="M860 140 Q880 130 875 170 Q855 170 860 140 Z" />
            
            {/* Southeast Asia Islands & Indonesia */}
            <path d="M740 270 Q790 270 810 300 Q780 320 740 290 Z" />
            <path d="M780 310 Q830 300 850 330 Q800 340 780 310 Z" />

            {/* Australia & New Zealand */}
            <path d="M790 350 Q880 340 900 390 Q890 440 820 440 Q780 410 790 350 Z" />
            <path d="M910 420 Q930 420 925 450 Q905 450 910 420 Z" />
          </g>

          {/* Network Great-Circle Arcs */}
          {NETWORK_ARCS.map((arc, i) => (
            <g key={i}>
              <path
                d={`M ${arc.from.x * 10} ${arc.from.y * 5} Q ${arc.cx * 10} ${arc.cy * 5} ${arc.to.x * 10} ${arc.to.y * 5}`}
                fill="none"
                stroke="url(#arc-grad)"
                strokeWidth="1.2"
                strokeDasharray="4, 4"
                opacity="0.75"
              />
              {/* Traveling Photon Energy Packet */}
              <circle r="2.5" fill="#38BDF8" filter="url(#hub-glow)">
                <animateMotion
                  path={`M ${arc.from.x * 10} ${arc.from.y * 5} Q ${arc.cx * 10} ${arc.cy * 5} ${arc.to.x * 10} ${arc.to.y * 5}`}
                  dur={`${3.5 + (i % 3)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}

          {/* Geographically Accurate Intelligence Beacons */}
          {INTELLIGENCE_HUBS.map((hub) => {
            const hx = hub.x * 10
            const hy = hub.y * 5
            const isHovered = hoveredHub?.id === hub.id

            return (
              <g
                key={hub.id}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredHub(hub)}
                onMouseLeave={() => setHoveredHub(null)}
              >
                {/* Expanding Concentric Pulse Waves */}
                <circle
                  cx={hx}
                  cy={hy}
                  r="12"
                  fill="none"
                  stroke={hub.color}
                  strokeWidth="1"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values={hub.isEpicenter ? "6;28;36" : "4;16;22"}
                    dur={hub.isEpicenter ? "2s" : "3s"}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.8;0.3;0"
                    dur={hub.isEpicenter ? "2s" : "3s"}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Secondary Ripple for Epicenter (India) */}
                {hub.isEpicenter && (
                  <circle
                    cx={hx}
                    cy={hy}
                    r="18"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="r"
                      values="10;36;48"
                      dur="2s"
                      begin="0.7s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0.2;0"
                      dur="2s"
                      begin="0.7s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Soft Ambient Glow Halo */}
                <circle
                  cx={hx}
                  cy={hy}
                  r={hub.isEpicenter ? "10" : isHovered ? "8" : "6"}
                  fill={hub.color}
                  opacity={hub.isEpicenter ? "0.85" : "0.75"}
                  filter="url(#hub-glow)"
                />

                {/* Center Core Point */}
                <circle
                  cx={hx}
                  cy={hy}
                  r={hub.isEpicenter ? "4.5" : "3"}
                  fill="#FFFFFF"
                  stroke={hub.color}
                  strokeWidth="1.5"
                />
              </g>
            )
          })}
        </svg>

        {/* ── Hover Tooltip Card ── */}
        <AnimatePresence>
          {hoveredHub && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute top-3 left-3 z-30 px-3.5 py-2 rounded-xl bg-black/90 backdrop-blur-md border border-white/15 text-xs text-white shadow-2xl pointer-events-none"
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredHub.color }} />
                <span className="font-bold">{hoveredHub.name}</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                {hoveredHub.status} · Risk: {hoveredHub.riskScore}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom Legend Strip matching Reference Image ── */}
        <div className="absolute bottom-2 left-3 right-3 sm:right-auto px-3 py-1.5 rounded-lg bg-[#0B1020]/90 backdrop-blur-md border border-white/10 flex items-center justify-between sm:justify-start gap-3 sm:gap-4 text-[10px] text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444]" /> High Risk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B]" /> Medium Risk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" /> Low Risk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38BDF8]" /> Info
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500" /> Offline
          </span>
        </div>

      </div>

    </div>
  )
}
