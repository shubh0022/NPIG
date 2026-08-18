import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Building2, 
  Car, 
  ShieldCheck, 
  HeartPulse, 
  CloudRain, 
  Lock, 
  ArrowRight, 
  X, 
  Activity, 
  TrendingUp, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react'
import useStore from '../../store/useStore'
import { SOLUTIONS_DATA } from '../../data/solutionsData'

export default function SolutionsSection({ isStandalonePage = false }) {
  const { theme } = useStore()
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedSolution, setSelectedSolution] = useState(null)

  const categories = ['All', 'Government', 'Enterprise', 'Infrastructure', 'Security', 'Healthcare']

  const filteredSolutions = activeFilter === 'All'
    ? SOLUTIONS_DATA
    : SOLUTIONS_DATA.filter((s) => s.category.toLowerCase() === activeFilter.toLowerCase())

  return (
    <section className={`relative ${isStandalonePage ? 'py-12' : 'py-24 sm:py-32'} px-4 sm:px-6 lg:px-8`}>
      
      <div className="max-w-7xl mx-auto">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500 mb-3">
            Domain-Specific AI Capabilities
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Intelligence Solutions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            Domain-specific intelligence to predict, prevent and respond effectively.
          </p>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeFilter === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : theme === 'light'
                    ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    : 'bg-[#0B1020] text-slate-400 border border-white/8 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── 6-Card Solutions Grid (2x3 Layout matching reference image) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredSolutions.map((solution, i) => {
            const Icon = solution.icon
            return (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedSolution(solution)}
                className="group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between"
                style={{
                  backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
                  borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: theme === 'light' ? '0 4px 20px rgba(0,0,0,0.04)' : '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                {/* Image Area with 16:9 ratio */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent opacity-80" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {solution.category}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                        {solution.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light mb-4">
                      {solution.description}
                    </p>
                  </div>

                  {/* Explore Link */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-indigo-500 group-hover:text-indigo-400">
                    <span>Explore Capability</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── View All Solutions CTA ── */}
        {!isStandalonePage && (
          <div className="mt-14 text-center">
            <Link
              to="/solutions"
              className="btn-primary !px-8 !py-3.5 !rounded-2xl !text-sm !font-bold"
            >
              View All Solutions →
            </Link>
          </div>
        )}

      </div>

      {/* ── Interactive Solution Deep-Dive Modal ── */}
      <AnimatePresence>
        {selectedSolution && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${
                theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B1020] border-white/15 text-white'
              }`}
            >
              {/* Header Image */}
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <img src={selectedSolution.image} alt={selectedSolution.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-black/40 to-transparent" />
                <button
                  onClick={() => setSelectedSolution(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white">
                    {selectedSolution.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">{selectedSolution.title}</h2>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Platform Overview</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">
                    {selectedSolution.fullDescription}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Demonstrated Impact Metrics</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedSolution.metrics.map((m) => (
                      <div key={m.label} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                        <div className="text-lg sm:text-xl font-display font-black text-indigo-400">{m.value}</div>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase font-medium">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Capabilities */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Core Algorithmic Modules</h4>
                  <div className="space-y-2">
                    {selectedSolution.features.map((f) => (
                      <div key={f} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setSelectedSolution(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                  <Link
                    to="/dashboard"
                    className="btn-primary !px-6 !py-2.5 !rounded-xl !text-xs !font-bold"
                  >
                    Open in Command Center →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
