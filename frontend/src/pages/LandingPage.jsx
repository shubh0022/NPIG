import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../store/useStore'
import RedesignedFooter from '../components/Footer/RedesignedFooter'

/* ─── 3D Hero Globe (Enhanced Premium) ─────────────────────────── */
function HeroGlobe() {
  const meshRef = useRef()
  const nodesRef = useRef()
  const [hoveredNode, setHoveredNode] = useState(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.03
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.06) * 0.06
    }
  })

  const nodes = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const lat = (Math.random() - 0.5) * Math.PI
      const lon = (Math.random() - 0.5) * Math.PI * 2
      const r = 2.6
      return {
        position: [
          r * Math.cos(lat) * Math.cos(lon),
          r * Math.sin(lat),
          r * Math.cos(lat) * Math.sin(lon),
        ],
        color: i % 4 === 0 ? '#3B82F6' : i % 4 === 1 ? '#8B5CF6' : i % 4 === 2 ? '#06B6D4' : '#10B981',
        size: 0.02 + Math.random() * 0.03,
        pulseSpeed: 1 + Math.random() * 2,
      }
    })
  }, [])

  return (
    <group ref={meshRef}>
      {/* Premium atmospheric glow with gradient */}
      <mesh scale={1.15}>
        <sphereGeometry args={[2.6, 64, 64]} />
        <meshBasicMaterial 
          color="#0F172A" 
          transparent 
          opacity={0.12} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh scale={1.08}>
        <sphereGeometry args={[2.6, 48, 48]} />
        <meshBasicMaterial 
          color="#3B82F6" 
          transparent 
          opacity={0.04} 
          side={THREE.BackSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* Premium wireframe with subtle glow */}
      <mesh>
        <sphereGeometry args={[2.6, 48, 48]} />
        <meshStandardMaterial 
          color="#1E293B" 
          wireframe 
          transparent 
          opacity={0.15}
          emissive="#3B82F6"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Solid premium core with depth */}
      <mesh>
        <sphereGeometry args={[2.55, 32, 32]} />
        <meshStandardMaterial 
          color="#030712" 
          transparent 
          opacity={0.95} 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Data nodes with pulse animation */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        {nodes.map((node, i) => (
          <mesh key={i} position={node.position}>
            <sphereGeometry args={[node.size, 16, 16]} />
            <meshBasicMaterial 
              color={node.color} 
              toneMapped={false}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </Float>

      {/* Data connection lines */}
      {nodes.slice(0, 20).map((node, i) => {
        const nextNode = nodes[(i + 1) % nodes.length]
        return (
          <line key={`line-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...node.position, ...nextNode.position])}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#3B82F6" 
              transparent 
              opacity={0.08}
              linewidth={1}
            />
          </line>
        )
      })}
    </group>
  )
}

function HeroScene() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 7], fov: 50 }} 
      className="absolute inset-0 z-0 pointer-events-none" 
      style={{ position: 'absolute' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.0} color="#3B82F6" />
      <pointLight position={[-8, -8, -4]} intensity={0.5} color="#8B5CF6" />
      <pointLight position={[0, 8, 4]} intensity={0.4} color="#06B6D4" />
      <Stars radius={150} depth={60} count={1200} factor={4} saturation={0} fade speed={0.4} />
      <group position={[2.8, -0.3, 0]}>
        <HeroGlobe />
      </group>
    </Canvas>
  )
}

/* ─── Animated Counter ────────────────────────────────────────── */
function AnimatedStat({ value, label, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className="text-center group"
    >
      <div className="text-4xl sm:text-5xl font-display font-black text-white mb-2 tracking-tight group-hover:text-gradient transition-all duration-300">
        {value}
      </div>
      <div className="text-xs text-slate-500 uppercase tracking-[0.2em] font-medium">{label}</div>
    </motion.div>
  )
}

/* ─── Premium Feature Card (Glass Effect) ─────────────────────── */
function FeatureCard({ icon, title, desc, color, image, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="relative group cursor-default rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.7) 0%, rgba(3,7,18,0.9) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.05)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Premium gradient accent bar */}
      <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${color} opacity-80`} />

      {/* Hover glow effect */}
      <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.08] blur-3xl transition-opacity duration-700 pointer-events-none`} />

      {/* Image area with premium overlay */}
      {image && (
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-110 opacity-70 group-hover:opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-transparent" />
        </div>
      )}

      <div className="p-7">
        {/* Premium icon container */}
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-5 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        <h3 className="text-white font-bold text-lg mb-3 tracking-tight group-hover:text-gradient transition-all duration-300">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed font-light">{desc}</p>
      </div>
    </motion.div>
  )
}

/* ─── Trust / Partner Strip ───────────────────────────────────── */
function TrustStrip() {
  const partners = ['Ministry of Home Affairs', 'ISRO', 'DRDO', 'NIC', 'CERT-In', 'NITI Aayog']

  return (
    <section className="py-16 border-y border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-slate-600 mb-8 font-medium">
          Trusted by India's Critical Infrastructure
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {partners.map((name) => (
            <motion.span
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs text-slate-500 font-semibold tracking-widest uppercase hover:text-slate-300 transition-colors duration-300 cursor-default"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Data ────────────────────────────────────────────────────── */
const STATS = [
  { value: '2.4M+', label: 'Events Processed Daily' },
  { value: '12', label: 'City Zones Monitored' },
  { value: '91.3%', label: 'Prediction Accuracy' },
  { value: '<2min', label: 'Avg Alert Response' },
]

const FEATURES = [
  {
    icon: '🧠', title: 'AI-Powered Predictions',
    desc: 'Multi-domain ML models predict accidents, crime hotspots, disease outbreaks, and climate risks hours before they occur.',
    color: 'from-blue-600 to-violet-600',
    image: '/images/traffic_intelligence.png',
  },
  {
    icon: '🌐', title: 'Digital City Twin',
    desc: 'Real-time simulation of the entire city with what-if scenario modeling for any emergency situation.',
    color: 'from-cyan-600 to-blue-600',
    image: '/images/climate_intelligence.png',
  },
  {
    icon: '🚨', title: 'Intelligent Alert Routing',
    desc: 'AI-driven alerts automatically routed to the right authority via SMS, email, radio — within seconds.',
    color: 'from-rose-600 to-orange-600',
    image: '/images/crime_intelligence.png',
  },
  {
    icon: '🤖', title: 'NEXUS AI Assistant',
    desc: 'Conversational intelligence for every officer. Ask anything about predictions, risk scores, or generate reports instantly.',
    color: 'from-violet-600 to-purple-600',
    image: '/images/cyber_intelligence.png',
  },
  {
    icon: '📊', title: 'Enterprise Analytics',
    desc: 'Real-time dashboards with heatmaps, time-series forecasting, and drill-down analysis across all domains.',
    color: 'from-emerald-600 to-teal-600',
    image: '/images/healthcare_intelligence.png',
  },
  {
    icon: '🔐', title: 'Government-Grade Security',
    desc: 'Zero-trust architecture with JWT, 2FA, biometric-ready auth and role-based access control across all tiers.',
    color: 'from-amber-600 to-yellow-600',
  },
]

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2.5,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 4,
}))

/* ─── Main Component ──────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])
  const heroY = useTransform(scrollY, [0, 500], [0, -80])
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.96])

  const [currentTime, setCurrentTime] = useState(new Date())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">

      {/* ── Premium Apple-Style Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-3xl bg-[#030712]/80" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-500 flex items-center justify-center text-base sm:text-lg font-bold text-white shadow-[0_0_32px_rgba(59,130,246,0.4)] animate-pulse-glow">
              ⬡
            </div>
            <div>
              <span className="font-display font-black text-white tracking-[0.2em] text-sm sm:text-base block leading-none">NPIG</span>
              <span className="text-[8px] sm:text-[9px] text-slate-500 tracking-[0.3em] font-medium uppercase block mt-0.5 sm:mt-1 hidden sm:block">Intelligence Grid</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>}
          </motion.button>

          {/* Center nav links with magnetic effect */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {['Platform', 'Intelligence', 'Security', 'Developers'].map((item, i) => (
              <motion.button
                key={item}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs text-slate-400 hover:text-white transition-colors duration-300 font-medium tracking-wider relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 group-hover:w-full transition-all duration-300" />
              </motion.button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] text-slate-500 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span>{currentTime.toLocaleTimeString('en-IN')} IST</span>
            </div>
            <motion.button
              onClick={() => navigate('/login')}
              className="text-xs text-slate-400 hover:text-white transition-colors duration-300 font-medium px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:bg-white/[0.05]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={() => navigate('/login')}
              className="text-xs font-semibold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 text-white hover:opacity-90 transition-all duration-300 shadow-[0_4px_24px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.6)]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">Launch Platform →</span>
              <span className="sm:hidden">Launch</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden px-4 pb-4"
              style={{
                background: 'rgba(3,7,18,0.95)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex flex-col gap-2 pt-4">
                {['Platform', 'Intelligence', 'Security', 'Developers'].map((item, i) => (
                  <motion.button
                    key={item}
                    onClick={() => {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                      setMobileMenuOpen(false)
                    }}
                    className="text-left px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all font-medium"
                    whileTap={{ scale: 0.98 }}
                  >
                    {item}
                  </motion.button>
                ))}
                <div className="h-px bg-white/[0.06] my-2" />
                <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{currentTime.toLocaleTimeString('en-IN')} IST</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <motion.button
                    onClick={() => { navigate('/login'); setMobileMenuOpen(false) }}
                    className="flex-1 py-3 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white transition-all"
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => { navigate('/login'); setMobileMenuOpen(false) }}
                    className="flex-1 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-500 to-violet-500 text-white transition-all"
                    whileTap={{ scale: 0.98 }}
                  >
                    Launch
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Premium Immersive Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Premium background grid with subtle animation */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          animation: 'gridMove 20s linear infinite',
        }} />

        {/* Multi-layer radial ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-[1200px] h-[1200px] rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.04) 40%, rgba(6,182,212,0.02) 70%, transparent 100%)',
          filter: 'blur(80px)',
        }} />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, rgba(6,182,212,0.03) 50%, transparent 80%)',
          filter: 'blur(60px)',
        }} />

        {/* Premium floating particles with varied sizes */}
        {PARTICLES.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`, 
              width: p.size * 1.5, 
              height: p.size * 1.5,
              background: `radial-gradient(circle, ${p.id % 3 === 0 ? 'rgba(59,130,246,0.4)' : p.id % 3 === 1 ? 'rgba(139,92,246,0.4)' : 'rgba(6,182,212,0.4)'} 0%, transparent 70%)`,
            }}
            animate={{ opacity: [0, 0.8, 0], scale: [0, 1.2, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* 3D Globe Scene */}
        <HeroScene />

        {/* Hero Content with premium typography */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="relative z-10 px-6 max-w-5xl mx-auto lg:ml-[10%] lg:mr-auto"
        >
          {/* Premium status chip with glow */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 backdrop-blur-xl text-blue-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-10 shadow-[0_0_24px_rgba(59,130,246,0.2)]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            System Operational · Classification: Restricted
          </motion.div>

          {/* Premium headline with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-6xl sm:text-7xl lg:text-8xl font-black leading-[1.02] tracking-tight mb-8"
          >
            National{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 animate-gradient bg-300% bg-gradient-animate">
              Predictive
            </span>
            <br />Intelligence Grid
          </motion.h1>

          {/* Premium subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-slate-400 text-xl sm:text-2xl max-w-2xl leading-relaxed mb-12 font-light tracking-wide"
          >
            Transforming data into intelligent decisions. AI-powered national 
            intelligence that predicts, prevents, and protects — in real time.
          </motion.p>

          {/* Premium CTAs with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row items-start gap-5"
          >
            <motion.button
              onClick={() => navigate('/login')}
              className="group flex items-center gap-3 text-base font-bold px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 text-white hover:opacity-90 transition-all duration-300 shadow-[0_8px 32px_rgba(59,130,246,0.4)] hover:shadow-[0_12px 48px_rgba(59,130,246,0.6)]"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              Launch Platform
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </motion.button>
            <motion.button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-base font-semibold px-8 py-4 rounded-2xl border border-white/15 text-slate-300 hover:text-white hover:border-white/25 hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              View Demo
            </motion.button>
          </motion.div>

          {/* Premium security badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-14 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-xl text-[10px] text-slate-500 font-mono tracking-widest"
          >
            <span className="text-emerald-400">🔒</span> AES-256 Encrypted · Zero-Trust Architecture · All Access Logged
          </motion.div>
        </motion.div>

        {/* Premium scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 rounded-2xl border border-white/15 flex items-start justify-center pt-2 backdrop-blur-sm bg-white/[0.02]">
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-3 rounded-full bg-gradient-to-b from-blue-400 to-violet-400"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="relative py-20 border-y border-white/[0.04] bg-[#030712]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {STATS.map((s, i) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <TrustStrip />

      {/* ── Features ── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-blue-400 text-[11px] font-semibold uppercase tracking-[0.3em] mb-3">Core Capabilities</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight">
              Predict. Prevent. Protect.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
              Six AI-powered intelligence pillars working in real-time to secure every citizen.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <FeatureCard key={feat.title} {...feat} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Premium CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 60%)',
        }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-400 text-[11px] font-semibold uppercase tracking-[0.3em] mb-4">Join the Grid</p>
            <h2 className="font-display text-4xl sm:text-5xl font-black mb-6 tracking-tight">
              Ready to Protect
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">the Nation?</span>
            </h2>
            <p className="text-slate-400 mb-10 text-lg max-w-lg mx-auto leading-relaxed">
              Join 2,400+ government officials already using NPIG to prevent emergencies before they happen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="group flex items-center gap-2 text-base font-semibold px-10 py-4 rounded-2xl bg-white text-[#030712] hover:bg-slate-100 transition-all duration-200 shadow-[0_4px_32px_rgba(255,255,255,0.1)]"
              >
                Access Secure Portal
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-6 py-4">
                Schedule a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Redesigned Footer & Information Architecture ── */}
      <RedesignedFooter />
    </div>
  )
}
