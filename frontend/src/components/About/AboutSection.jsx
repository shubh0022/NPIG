import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Eye, Award, CheckCircle, Server, Lock, Cpu, Globe } from 'lucide-react'
import useStore from '../../store/useStore'

export default function AboutSection({ isStandalonePage = false }) {
  const { theme } = useStore()

  const pillars = [
    {
      icon: Shield,
      title: 'Our Mission',
      desc: 'Empower government and enterprises with predictive intelligence for a better tomorrow.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      desc: 'Be the world\'s leading AI-powered intelligence platform for proactive governance.',
      color: 'from-violet-500 to-indigo-500',
    },
    {
      icon: Award,
      title: 'Our Values',
      desc: 'Integrity, Innovation, Collaboration, Excellence.',
      color: 'from-sky-500 to-indigo-500',
    },
  ]

  const specs = [
    { label: 'Latency SLA', value: '< 250ms' },
    { label: 'Data Ingestion', value: '45 GB/s' },
    { label: 'Model Retraining', value: 'Continuous' },
    { label: 'Encryption', value: 'AES-256 GCM' },
  ]

  return (
    <section className={`relative ${isStandalonePage ? 'py-12' : 'py-24 sm:py-32'} px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── Left Column: Editorial Information & Pillars ── */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500 mb-3">
                Sovereign AI Infrastructure
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-5">
                About NPIG
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                NPIG is a mission-driven initiative to harness the power of data, AI and advanced analytics for building a proactive and intelligent nation. Built on zero-trust sovereign architecture, it connects municipal, state, and national telemetry into a single unified predictive nervous system.
              </p>
            </div>

            {/* 3 Structured Pillars */}
            <div className="space-y-4">
              {pillars.map((p, idx) => {
                const Icon = p.icon
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4"
                    style={{
                      backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
                      borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
                      boxShadow: theme === 'light' ? '0 2px 10px rgba(0,0,0,0.03)' : '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                        {p.desc}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* ── Right Column: Operations Command Center Visual ── */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border p-2"
              style={{
                backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
                borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
                boxShadow: theme === 'light' ? '0 12px 36px rgba(0,0,0,0.08)' : '0 16px 48px rgba(0,0,0,0.5)',
              }}
            >
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src="/images/crime_intelligence.png"
                  alt="NPIG High-Tech Operations Command Center"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent opacity-90" />

                {/* Operations Badge Overlay */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                    NPIG National Operation Center · Delhi
                  </span>
                </div>

                {/* Bottom Telemetry Overlay */}
                <div className="absolute bottom-4 inset-x-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {specs.map((s) => (
                    <div key={s.label} className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-center">
                      <div className="text-xs font-mono font-bold text-indigo-400">{s.value}</div>
                      <div className="text-[9px] text-slate-400 uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
