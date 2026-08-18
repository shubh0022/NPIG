import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Activity, ShieldCheck, Info } from 'lucide-react'

import Earth from './Earth'
import Atmosphere from './Atmosphere'
import NetworkLayer from './NetworkLayer'
import IntelligenceNodes from './IntelligenceNodes'
import DataRoutes from './DataRoutes'
import AlertMarkers from './AlertMarkers'
import GlobeControls from './GlobeControls'
import GlobeFallback from './GlobeFallback'
import IntelligenceModal from './IntelligenceModal'

import {
  INTELLIGENCE_NODES,
  DATA_ROUTES,
  FLOATING_ALERTS,
  INTELLIGENCE_CATEGORIES,
} from '../../data/intelligenceGlobeData'
import useStore from '../../store/useStore'

const GLOBE_RADIUS = 2.1

/**
 * Root 3D Scene within the Canvas
 */
function GlobeScene({
  nodes,
  routes,
  hoveredNode,
  selectedNode,
  onNodeHover,
  onNodeSelect,
  isHovered,
  isInteractingModal,
  theme,
  radius = GLOBE_RADIUS,
}) {
  return (
    <GlobeControls
      isHovered={isHovered}
      isInteractingModal={isInteractingModal}
    >
      {/* 3D Atmospheric Fresnel Glow */}
      <Atmosphere radius={radius} theme={theme} />

      {/* Realistic Stylized Earth with Landmasses, Dark Ocean, and Night Lights */}
      <Earth radius={radius} theme={theme} />

      {/* Thin Latitude/Longitude Graticule & Strategic Corridor Rings */}
      <NetworkLayer radius={radius} theme={theme} />

      {/* Animated 3D Great-Circle Bezier Data Routes */}
      <DataRoutes
        routes={routes}
        nodes={nodes}
        radius={radius}
        theme={theme}
      />

      {/* Interactive Intelligence Beacons & Halos */}
      <IntelligenceNodes
        nodes={nodes}
        radius={radius}
        hoveredNode={hoveredNode}
        selectedNode={selectedNode}
        onNodeHover={onNodeHover}
        onNodeSelect={onNodeSelect}
        theme={theme}
      />
    </GlobeControls>
  )
}

/**
 * NPIG Global Intelligence Visualization Master Component
 */
export default function IntelligenceGlobe({
  nodes = INTELLIGENCE_NODES,
  routes = DATA_ROUTES,
  alerts = FLOATING_ALERTS,
  className = '',
}) {
  const { theme } = useStore()
  const isLight = theme === 'light'

  const [hoveredNode, setHoveredNode] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isCanvasHovered, setIsCanvasHovered] = useState(false)
  const [webglError, setWebglError] = useState(false)

  // Check if WebGL is supported
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setWebglError(true)
    } catch {
      setWebglError(true)
    }
  }, [])

  const handleNodeHover = useCallback((node) => {
    setHoveredNode(node)
  }, [])

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node)
  }, [])

  const handleAlertSelect = useCallback((nodeId) => {
    const target = nodes.find(n => n.id === nodeId)
    if (target) setSelectedNode(target)
  }, [nodes])

  const handleCloseModal = useCallback(() => {
    setSelectedNode(null)
  }, [])

  if (webglError) {
    return (
      <GlobeFallback
        onSelectNode={handleNodeSelect}
        theme={theme}
      />
    )
  }

  return (
    <div
      className={`relative w-full h-[460px] sm:h-[540px] lg:h-[600px] flex items-center justify-center select-none overflow-visible ${className}`}
      onMouseEnter={() => setIsCanvasHovered(true)}
      onMouseLeave={() => setIsCanvasHovered(false)}
      role="region"
      aria-label="Interactive global intelligence visualization"
    >
      {/* Screen Reader Alternative */}
      <span className="sr-only">
        Global intelligence network showing simulated traffic, climate, and security events across major hubs.
      </span>

      {/* Seamless Ambient Radial Lighting Glow (no square box clipping) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: isLight
            ? 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.06) 0%, rgba(56, 189, 248, 0.02) 60%, transparent 80%)'
            : 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.12) 0%, rgba(56, 189, 248, 0.03) 60%, transparent 80%)',
        }}
      />

      {/* ── Top Status Bar: Live Network & Simulation Mode ── */}
      <div className="absolute top-0 sm:top-2 right-2 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-30 flex items-center gap-2 pointer-events-auto">
        <div
          className="px-3 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-mono shadow-lg transition-all duration-300"
          style={{
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(11, 16, 32, 0.88)',
            borderColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.12)',
            boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.05)' : '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm flex-shrink-0" />
          <span
            className="font-semibold hidden xs:inline sm:inline"
            style={{ color: isLight ? '#1E293B' : '#E2E8F0' }}
          >
            Global Intelligence Online
          </span>
          <span className="text-slate-400 hidden xs:inline sm:inline">·</span>
          <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 text-[8px] sm:text-[9px]">
            SIMULATION MODE
          </span>
        </div>
      </div>

      {/* ── 3D WebGL Canvas ── */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 44 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          <ambientLight intensity={isLight ? 0.8 : 0.45} />
          <directionalLight
            position={[6, 4, 3]}
            intensity={isLight ? 1.3 : 1.2}
            color={isLight ? '#FFFFFF' : '#818CF8'}
          />
          <pointLight
            position={[-6, -4, -3]}
            intensity={isLight ? 0.4 : 0.6}
            color={isLight ? '#93C5FD' : '#38BDF8'}
          />

          {!isLight && (
            <Stars
              radius={100}
              depth={40}
              count={350}
              factor={3}
              saturation={0}
              fade
              speed={0.25}
            />
          )}

          <GlobeScene
            nodes={nodes}
            routes={routes}
            hoveredNode={hoveredNode}
            selectedNode={selectedNode}
            onNodeHover={handleNodeHover}
            onNodeSelect={handleNodeSelect}
            isHovered={isCanvasHovered}
            isInteractingModal={!!selectedNode}
            theme={theme}
            radius={GLOBE_RADIUS}
          />
        </Canvas>
      </div>

      {/* ── 3 Visible Floating Intelligence Alerts ── */}
      <AlertMarkers
        alerts={alerts}
        onSelectAlert={handleAlertSelect}
        theme={theme}
      />

      {/* ── Dynamic Bottom Hover Inspector Pill ── */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
          >
            <div
              onClick={() => handleNodeSelect(hoveredNode)}
              className="px-4 py-1.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-200"
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(11, 16, 32, 0.92)',
                borderColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.15)',
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0"
                style={{ backgroundColor: hoveredNode.color }}
              />
              <div className="flex items-center gap-2 text-xs font-mono">
                <span
                  className="font-bold"
                  style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}
                >
                  {hoveredNode.name}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-indigo-400 capitalize font-medium">
                  {hoveredNode.category}
                </span>
                <span className="text-slate-400">·</span>
                <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-[10px] text-emerald-400 font-bold">
                  Risk: {hoveredNode.riskLevel}
                </span>
                <span className="text-[10px] text-slate-400">
                  ({hoveredNode.confidence}% conf)
                </span>
              </div>
              <span className="text-[10px] text-indigo-400 font-semibold underline">
                Details →
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Compact Intelligence Drilldown Modal ── */}
      <IntelligenceModal
        node={selectedNode}
        isOpen={!!selectedNode}
        onClose={handleCloseModal}
        theme={theme}
      />
    </div>
  )
}
