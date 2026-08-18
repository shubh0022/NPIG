import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Database, 
  TrendingUp, 
  Layers, 
  Users, 
  ArrowRight, 
  Calendar,
  Building2,
  Car,
  Shield,
  HeartPulse,
  CloudRain,
  Lock,
  Zap,
  Cpu,
  Cloud,
  CheckCircle2
} from 'lucide-react'
import GlobalNavbar from '../components/Navigation/GlobalNavbar'
import InteractiveGlobeHero from '../components/Home/InteractiveGlobeHero'
import AboutSection from '../components/About/AboutSection'
import ResourcesSection from '../components/Resources/ResourcesSection'
import ContactSection from '../components/Contact/ContactSection'
import NexusAssistantSection from '../components/Nexus/NexusAssistantSection'
import RedesignedFooter from '../components/Footer/RedesignedFooter'
import useStore from '../store/useStore'

export default function LandingPage() {
  const { theme } = useStore()
  const isLight = theme === 'light'

  // 4 Metrics matching reference image
  const metrics = [
    {
      value: '23.8M+',
      label: 'Data Points Processed',
      change: '+12.5% vs yesterday',
      icon: Database,
      iconColor: 'text-blue-500',
      iconBg: isLight ? 'bg-blue-50' : 'bg-blue-500/10',
    },
    {
      value: '96.7%',
      label: 'Prediction Accuracy',
      change: '+2.3% vs yesterday',
      icon: TrendingUp,
      iconColor: 'text-indigo-500',
      iconBg: isLight ? 'bg-indigo-50' : 'bg-indigo-500/10',
    },
    {
      value: '350+',
      label: 'Data Sources Integrated',
      change: '+18 vs yesterday',
      icon: Layers,
      iconColor: 'text-purple-500',
      iconBg: isLight ? 'bg-purple-50' : 'bg-purple-500/10',
    },
    {
      value: '120+',
      label: 'Organizations Connected',
      change: '+8 vs yesterday',
      icon: Users,
      iconColor: 'text-cyan-500',
      iconBg: isLight ? 'bg-cyan-50' : 'bg-cyan-500/10',
    },
  ]

  // 6 Solution Areas matching reference image
  const solutions = [
    {
      title: 'Smart City Intelligence',
      description: 'Real-time monitoring and urban analytics',
      icon: Building2,
      color: '#10B981', // green
      iconBg: isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400',
      link: '/solutions',
    },
    {
      title: 'Traffic Intelligence',
      description: 'Predictive traffic management and optimization',
      icon: Car,
      color: '#F59E0B', // amber
      iconBg: isLight ? 'bg-amber-50 text-amber-600' : 'bg-amber-500/10 text-amber-400',
      link: '/solutions',
    },
    {
      title: 'Public Safety Intelligence',
      description: 'Crime prediction and public safety enhancement',
      icon: Shield,
      color: '#EF4444', // red
      iconBg: isLight ? 'bg-red-50 text-red-600' : 'bg-red-500/10 text-red-400',
      link: '/solutions',
    },
    {
      title: 'Healthcare Intelligence',
      description: 'Disease prediction and healthcare analytics',
      icon: HeartPulse,
      color: '#06B6D4', // cyan
      iconBg: isLight ? 'bg-cyan-50 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400',
      link: '/solutions',
    },
    {
      title: 'Climate & Disaster Intelligence',
      description: 'Early warning systems and disaster management',
      icon: CloudRain,
      color: '#3B82F6', // blue
      iconBg: isLight ? 'bg-blue-50 text-blue-600' : 'bg-blue-500/10 text-blue-400',
      link: '/solutions',
    },
    {
      title: 'Cybersecurity Intelligence',
      description: 'Cyber threat detection and security analytics',
      icon: Lock,
      color: '#8B5CF6', // purple
      iconBg: isLight ? 'bg-purple-50 text-purple-600' : 'bg-purple-500/10 text-purple-400',
      link: '/solutions',
    },
  ]

  // 4 Platform Pillars matching reference image
  const platformPillars = [
    {
      title: 'Real-time Analytics',
      description: 'Process and analyze data in real-time for instant insights',
      icon: Zap,
      iconBg: isLight ? 'bg-blue-50 text-blue-600' : 'bg-blue-500/10 text-blue-400',
    },
    {
      title: 'AI & ML Models',
      description: 'Advanced machine learning models for accurate predictions',
      icon: Cpu,
      iconBg: isLight ? 'bg-purple-50 text-purple-600' : 'bg-purple-500/10 text-purple-400',
    },
    {
      title: 'Scalable Architecture',
      description: 'Built on modern cloud infrastructure for unlimited scale',
      icon: Cloud,
      iconBg: isLight ? 'bg-cyan-50 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400',
    },
    {
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with full compliance standards',
      icon: Lock,
      iconBg: isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400',
    },
  ]

  return (
    <div className={`min-h-screen ${isLight ? 'bg-[#FFFFFF] text-slate-900' : 'bg-[#030712] text-white'}`}>
      
      {/* ── Global Unified Header ── */}
      <GlobalNavbar />

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION — Matching Primary Reference Image
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle Ambient Radial Lighting */}
        <div 
          className="absolute top-0 right-1/4 w-[700px] h-[700px] rounded-full pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.05) 50%, transparent 80%)',
            filter: 'blur(100px)',
          }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* ── Left Column: Editorial Typography matching Reference ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 space-y-6"
            >
              {/* Stacked Heading */}
              <h1 className={`font-sans text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                National <br />
                Predictive <br />
                <span className="text-[#2563EB] dark:text-[#38BDF8]">Intelligence Grid</span>
              </h1>

              {/* Subtitle */}
              <p className={`text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-slate-400'} font-normal leading-relaxed max-w-lg`}>
                AI-powered intelligence for safer, smarter and more proactive decisions.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
                >
                  <span>Explore Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Request Demo</span>
                </Link>
              </div>
            </motion.div>

            {/* ── Right Column: 3D Interactive Intelligence Globe ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] sm:min-h-[500px]"
            >
              <InteractiveGlobeHero />
            </motion.div>

          </div>

          {/* ══════════════════════════════════════════════════════════════
              4-METRIC ROW — Matching Reference Image
              ══════════════════════════════════════════════════════════════ */}
          <div className={`mt-12 sm:mt-16 pt-8 border-t ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {metrics.map((m, idx) => {
                const Icon = m.icon
                return (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    className="p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 shadow-sm"
                    style={{
                      backgroundColor: isLight ? '#FFFFFF' : '#0B1020',
                      borderColor: isLight ? '#E2E8F0' : '#1E2436',
                    }}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${m.iconBg}`}>
                      <Icon className={`w-5 h-5 ${m.iconColor}`} />
                    </div>
                    <div>
                      <div className={`font-sans font-black text-2xl ${isLight ? 'text-slate-900' : 'text-white'} leading-tight`}>
                        {m.value}
                      </div>
                      <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} font-medium leading-tight mt-0.5`}>
                        {m.label}
                      </div>
                      <div className={`text-[10px] ${isLight ? 'text-emerald-600' : 'text-emerald-400'} font-bold mt-1`}>
                        {m.change}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: COMPREHENSIVE INTELLIGENCE SOLUTIONS (6 Cards)
          ══════════════════════════════════════════════════════════════ */}
      <section className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t ${isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-transparent border-white/5'}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB] mb-2">
              OUR SOLUTIONS
            </p>
            <h2 className={`font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} mb-2.5`}>
              Comprehensive Intelligence Solutions
            </h2>
            <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'} font-light`}>
              AI-powered solutions for a safer, smarter and more connected world.
            </p>
          </div>

          {/* 6 Solution Cards in a single responsive row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {solutions.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, duration: 0.5 }}
                  className="p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
                    borderColor: isLight ? '#E2E8F0' : '#1E2436',
                  }}
                >
                  <div>
                    {/* Rounded Square Icon Badge */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className={`font-sans font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'} mb-2 leading-snug`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} leading-relaxed font-light mb-4`}>
                      {item.description}
                    </p>
                  </div>

                  <Link
                    to={item.link}
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:text-indigo-400 flex items-center gap-1 mt-auto pt-2"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: THE NPIG PLATFORM (Built for Intelligence. Designed for Impact.)
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB]">
                THE NPIG PLATFORM
              </p>
              <h2 className={`font-sans text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'} leading-tight`}>
                Built for Intelligence. <br />
                Designed for Impact.
              </h2>
              <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'} font-light leading-relaxed`}>
                Our platform integrates advanced AI, machine learning and big data analytics to deliver actionable intelligence.
              </p>
              <div className="pt-2">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white inline-flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02]"
                >
                  <span>Explore Platform</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column (8 cols: 4 Feature Cards) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformPillars.map((feat, idx) => {
                const Icon = feat.icon
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    className="p-5 rounded-2xl border flex flex-col justify-start transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
                      borderColor: isLight ? '#E2E8F0' : '#1E2436',
                    }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 ${feat.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className={`font-sans font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'} mb-1.5`}>
                      {feat.title}
                    </h4>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} font-light leading-relaxed`}>
                      {feat.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ── Section 4: About NPIG ── */}
      <AboutSection />

      {/* ── Section 5: Resources ── */}
      <ResourcesSection />

      {/* ── Section 6: NEXUS AI Assistant ── */}
      <NexusAssistantSection />

      {/* ── Section 7: Contact Us ── */}
      <ContactSection />

      {/* ── Redesigned Footer ── */}
      <RedesignedFooter />

    </div>
  )
}
