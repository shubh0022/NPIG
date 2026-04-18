import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

const STATS = [
  { value: '2.4M+', label: 'Events Processed Daily' },
  { value: '12',    label: 'City Zones Monitored' },
  { value: '91.3%', label: 'Prediction Accuracy' },
  { value: '<2min', label: 'Avg Alert Response' },
]

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI-Powered Predictions',
    desc: 'Multi-domain ML models predict accidents, crime hotspots, disease outbreaks, and climate risks hours before they occur.',
    color: 'from-blue-600 to-violet-600',
  },
  {
    icon: '🌐',
    title: 'Digital City Twin',
    desc: 'Real-time simulation of the entire city with what-if scenario modeling for any emergency situation.',
    color: 'from-cyan-600 to-blue-600',
  },
  {
    icon: '🚨',
    title: 'Intelligent Alert Routing',
    desc: 'AI-driven alerts automatically routed to the right authority via SMS, email, radio — within seconds.',
    color: 'from-rose-600 to-orange-600',
  },
  {
    icon: '🤖',
    title: 'NEXUS AI Assistant',
    desc: 'Conversational intelligence for every officer. Ask anything about predictions, risk scores, or generate reports instantly.',
    color: 'from-violet-600 to-purple-600',
  },
  {
    icon: '📊',
    title: 'Enterprise Analytics',
    desc: 'Real-time dashboards with heatmaps, time-series forecasting, and drill-down analysis across all domains.',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    icon: '🔐',
    title: 'Government-Grade Security',
    desc: 'Zero-trust architecture with JWT, 2FA, biometric-ready auth and role-based access control across all tiers.',
    color: 'from-amber-600 to-yellow-600',
  },
]

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 3,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 4,
}))

function Particle({ x, y, size, delay, duration }) {
  return (
    <motion.div
      className="absolute rounded-full bg-brand-500/30"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const isAuthenticated = useStore(s => s.isAuthenticated)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, -60])

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-void text-white overflow-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-void/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-base shadow-glow-blue">
              ⬡
            </div>
            <span className="font-display font-bold text-white tracking-widest text-sm">NPIG</span>
          </div>

          {/* Live clock */}
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="status-dot-ok" />
            <span>{currentTime.toLocaleTimeString('en-IN')} IST</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="btn-ghost text-sm">Sign In</button>
            <button onClick={() => navigate('/login')} className="btn-primary text-sm px-5 py-2">
              Get Access →
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-dark bg-grid opacity-100" />

        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-brand-600/10 via-violet-600/5 to-transparent pointer-events-none" />

        {/* Particles */}
        {PARTICLES.map(p => <Particle key={p.id} {...p} />)}

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-8"
          >
            <span className="status-dot-ok" />
            System Operational · Classification: RESTRICTED
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
          >
            National{' '}
            <span className="text-gradient">Predictive</span>
            <br />Intelligence Grid
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            AI-powered national intelligence platform that integrates real-time data from
            smart cities, healthcare, traffic, and climate systems to prevent critical events
            before they occur.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto"
            >
              🔓 Access Command Center
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto"
            >
              Explore Features ↓
            </button>
          </motion.div>

          {/* Warning badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono"
          >
            ⚠ CLASSIFIED SYSTEM — AUTHORIZED PERSONNEL ONLY — All access is logged & monitored
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-slate-600 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-slate-400 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.02] py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-gradient mb-1">{s.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Core Capabilities</p>
            <h2 className="font-display text-4xl font-extrabold text-white mb-4">
              Predict. Prevent. Protect.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Six AI-powered intelligence pillars working in real-time to secure every citizen.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card p-6 relative overflow-hidden group cursor-default"
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feat.color}`} />

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} bg-opacity-20 flex items-center justify-center text-2xl mb-4 shadow-inner`}>
                  {feat.icon}
                </div>

                <h3 className="text-white font-bold text-base mb-2 group-hover:text-brand-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/30 via-violet-900/20 to-brand-900/30" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-extrabold mb-4">
              Ready to Protect the Nation?
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Join 2,400+ government officials already using NPIG to prevent emergencies before they happen.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-lg px-10 py-4"
            >
              🔓 Access Secure Portal
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-xs">⬡</div>
            <span className="font-display font-bold text-sm text-white">NPIG</span>
          </div>
          <p className="text-xs text-slate-500 font-mono text-center">
            © 2024 Government of India · Classification: RESTRICTED · All access logged · NPIG v1.0.0
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
