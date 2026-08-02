import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Globe, 
  Cpu, 
  ArrowRight, 
  ChevronRight, 
  Terminal, 
  Activity, 
  Lock, 
  FileText, 
  Eye, 
  ExternalLink,
  Bot,
  X
} from 'lucide-react';

const Github = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Twitter = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const Youtube = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);
import GlobeHero from './GlobeHero';
import NexusCoreWave from './NexusCoreWave';
import PremiumBadge from './PremiumBadge';
import { useNavigate } from 'react-router-dom';

// Platform capabilities definitions
const PLATFORMS = [
  {
    title: 'Traffic Intelligence',
    description: 'Dynamic transit mapping, bottleneck forecasting, and automated lane signal routing.',
    image: '/images/traffic_intelligence.png',
    color: 'from-blue-600 to-cyan-500'
  },
  {
    title: 'Healthcare Intelligence',
    description: 'Predictive bio-telemetry, epidemic outbreak tracking, and clinical resource optimization.',
    image: '/images/healthcare_intelligence.png',
    color: 'from-violet-600 to-fuchsia-500'
  },
  {
    title: 'Crime Intelligence',
    description: 'Spatial risk hotspot simulation, patrol response routing, and threat analytics.',
    image: '/images/crime_intelligence.png',
    color: 'from-rose-600 to-pink-500'
  },
  {
    title: 'Climate Intelligence',
    description: 'Atmospheric predictive analytics, disaster vector mapping, and real-time alerts.',
    image: '/images/climate_intelligence.png',
    color: 'from-emerald-600 to-teal-500'
  },
  {
    title: 'Cyber Intelligence',
    description: 'Zero-trust perimeter auditing, neural cryptography threat defense, and live monitoring.',
    image: '/images/cyber_intelligence.png',
    color: 'from-indigo-600 to-blue-500'
  }
];

// Solutions and Hub lists
const GOV_SOLUTIONS = [
  { name: 'Smart Cities', desc: 'Unified urban telemetry grids' },
  { name: 'Disaster Management', desc: 'Predictive evacuation routing' },
  { name: 'Public Safety', desc: 'Automated threat response grids' },
  { name: 'Transportation', desc: 'Multi-modal transit orchestration' }
];

const ENT_SOLUTIONS = [
  { name: 'Business Intelligence', desc: 'Predictive enterprise insights' },
  { name: 'Risk Management', desc: 'Continuous hazard simulation' },
  { name: 'Predictive Analytics', desc: 'ML-powered demand forecasting' },
  { name: 'Security Operations', desc: 'Threat detection and remediation' }
];

const DEV_HUB = [
  { name: 'API Documentation', desc: 'GraphQL & REST references' },
  { name: 'SDK Downloads', desc: 'Pre-compiled binaries & source' },
  { name: 'Webhooks', desc: 'Real-time subscription streams' },
  { name: 'Developer Community', desc: 'Open-source contributions' }
];

export default function RedesignedFooter() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([
    { sender: 'ai', text: 'NEXUS AI Core initialized. Ask me about platform capabilities, security, or API integrations.' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setChatMsgs(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');

    // Simulate futuristic AI response
    setTimeout(() => {
      let response = 'Analyzing grid data... Authorization required for secure databases. Please log in to your NPIG Command Center account for complete operational capability.';
      if (userMsg.toLowerCase().includes('hello') || userMsg.toLowerCase().includes('hi')) {
        response = 'Greetings, Operator. Nexus AI online. How can I assist you with the National Predictive Intelligence Grid today?';
      } else if (userMsg.toLowerCase().includes('traffic')) {
        response = 'Traffic Intelligence: Live flow algorithms currently tracking 1.2M daily transit streams across Delhi, Mumbai, and Bengaluru nodes.';
      } else if (userMsg.toLowerCase().includes('security') || userMsg.toLowerCase().includes('compliance')) {
        response = 'Compliance Status: Fully certified under ISO 27001, SOC2 Type II, GDPR, and CERT-In national regulatory directives.';
      } else if (userMsg.toLowerCase().includes('api') || userMsg.toLowerCase().includes('sdk')) {
        response = 'Developer Hub: SDKs available in Go, Rust, Python, and TypeScript. Rate limit: 10,000 req/min under standard agency key credentials.';
      }
      setChatMsgs(prev => [...prev, { sender: 'ai', text: response }]);
    }, 700);
  };

  return (
    <footer className="relative border-t border-white/[0.08] dark:border-white/[0.08] light:border-slate-200/80 bg-[#030712] dark:bg-[#030712] light:bg-slate-50 pt-24 pb-12 px-6 overflow-hidden">
      {/* Premium background aesthetics */}
      <div className="absolute inset-0 bg-grid-dark bg-grid opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-900/15 to-violet-900/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-cyan-900/10 to-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-violet-900/5 to-cyan-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-28 relative z-10">
        
        {/* ── SECTION 1: Intelligence Globe Hero ── */}
        <section className="w-full">
          <GlobeHero />
        </section>

        {/* ── SECTION 2: Premium Platform Capabilities ── */}
        <section className="space-y-12">
          <div className="text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xs font-black text-cyan-400 tracking-[0.3em] uppercase mb-3">Platform Capabilities</h3>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 tracking-tight leading-tight">
                Visualizing Multi-Domain Analytics
              </h2>
              <p className="text-slate-400 max-w-xl text-sm mt-4 font-light leading-relaxed">
                Advanced machine learning models tracking and predicting real-time intelligence telemetry.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {PLATFORMS.map((platform, idx) => (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative rounded-3xl border border-white/[0.08] bg-white/[0.02] dark:bg-white/[0.02] light:bg-white light:border-slate-200 overflow-hidden flex flex-col cursor-pointer transition-all duration-300"
                style={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* Premium image container with shine effect */}
                <div className="relative w-full aspect-video sm:aspect-square overflow-hidden bg-slate-950/90">
                  <img 
                    src={platform.image} 
                    alt={platform.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-85"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent`} />
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${platform.color}`} />
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-cyan-500/10 to-transparent" />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <h4 className="text-white dark:text-white light:text-slate-900 font-bold text-sm tracking-wide mb-3 group-hover:text-cyan-400 transition-colors">
                      {platform.title}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed font-light">
                      {platform.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Sync Node <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: Premium NEXUS AI Assistant Section ── */}
        <section className="relative rounded-3xl border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200/80 bg-gradient-to-r from-slate-950/95 to-[#030b20]/98 p-10 md:p-14 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12"
          style={{
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)',
          }}
        >
          {/* Premium decorative elements */}
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-cyan-500/15 to-violet-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex-1 space-y-8 text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-black uppercase tracking-[0.2em]">
                🤖 Active AI Core
              </div>

              <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mt-6">
                NEXUS Intelligence Suite
              </h2>

              <p className="text-slate-400 text-sm max-w-xl leading-relaxed font-light mt-4">
                Your conversational gateway to the predictive grid. Command telemetry, generate automated hazard reports, scan active cities, and deploy emergency scripts via secure natural language.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-4">
                <motion.button 
                  onClick={() => setChatOpen(true)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-2.5 text-sm px-8 py-4 rounded-2xl font-bold tracking-wide"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                    boxShadow: '0 8px 32px rgba(59,130,246,0.3)',
                  }}
                >
                  Launch NEXUS Assistant <ArrowRight className="w-4 h-4" />
                </motion.button>
                <div className="flex items-center gap-2.5 text-xs font-mono text-slate-500 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  Live operational status (200 OK)
                </div>
              </div>
            </motion.div>
          </div>

          {/* Animated Avatar / Waveform Wrapper */}
          <div className="w-full md:w-auto flex justify-center md:justify-end flex-shrink-0 relative z-10">
            <NexusCoreWave active={true} />
          </div>
        </section>

        {/* ── SECTION 4, 5, 6: Premium Information Architecture Links ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 pt-8 border-t border-white/[0.08]">
          {/* Gov Solutions */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-white dark:text-white light:text-slate-900 font-black text-sm tracking-wider uppercase font-display">
                  Government Solutions
                </h4>
              </div>
            </motion.div>
            <ul className="space-y-5">
              {GOV_SOLUTIONS.map((sol, idx) => (
                <motion.li 
                  key={sol.name} 
                  className="group cursor-pointer"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <span className="text-slate-300 dark:text-slate-300 light:text-slate-800 text-sm font-bold group-hover:text-blue-400 transition-colors block">
                    {sol.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 block mt-1 font-light">
                    {sol.desc}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Enterprise Solutions */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/15 to-purple-500/15 flex items-center justify-center text-violet-400 border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-white dark:text-white light:text-slate-900 font-black text-sm tracking-wider uppercase font-display">
                  Enterprise Solutions
                </h4>
              </div>
            </motion.div>
            <ul className="space-y-5">
              {ENT_SOLUTIONS.map((sol, idx) => (
                <motion.li 
                  key={sol.name} 
                  className="group cursor-pointer"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
                >
                  <span className="text-slate-300 dark:text-slate-300 light:text-slate-800 text-sm font-bold group-hover:text-violet-400 transition-colors block">
                    {sol.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 block mt-1 font-light">
                    {sol.desc}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Developer Hub */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Terminal className="w-5 h-5" />
                </div>
                <h4 className="text-white dark:text-white light:text-slate-900 font-black text-sm tracking-wider uppercase font-display">
                  Developer Hub
                </h4>
              </div>
            </motion.div>
            <ul className="space-y-5">
              {DEV_HUB.map((hub, idx) => (
                <motion.li 
                  key={hub.name} 
                  className="group cursor-pointer"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                >
                  <span className="text-slate-300 dark:text-slate-300 light:text-slate-800 text-sm font-bold group-hover:text-emerald-400 transition-colors block">
                    {hub.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 block mt-1 font-light">
                    {hub.desc}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── SECTION 7: Premium Security & Compliance ── */}
        <section className="space-y-8 pt-8 border-t border-white/[0.08]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Security & Compliance</h4>
            <p className="text-slate-500 text-xs mt-2 font-light">Government-scale certification and sovereign infrastructure standards.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { title: 'ISO 27001', desc: 'Information Security', icon: <ShieldCheck className="w-6 h-6" />, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
              { title: 'SOC2 TYPE II', desc: 'Security Trust Audited', icon: <Lock className="w-6 h-6" />, color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30' },
              { title: 'GDPR', desc: 'Data Privacy Compliance', icon: <FileText className="w-6 h-6" />, color: 'from-emerald-500/20 to-cyan-500/20', border: 'border-emerald-500/30' },
              { title: 'CERT-In', desc: 'National Advisory Align', icon: <Eye className="w-6 h-6" />, color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
            ].map((badge, idx) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl cursor-pointer transition-all duration-300"
                style={{
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} border ${badge.border} flex items-center justify-center mb-3 shadow-lg`}>
                  {badge.icon}
                </div>
                <h5 className="text-white font-black text-sm tracking-wide mb-1">{badge.title}</h5>
                <p className="text-slate-500 text-xs font-light">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SECTION 8: Premium Social Presence & Bottom Copyright ── */}
        <section className="pt-12 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Brand Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start gap-5"
          >
            <div className="flex items-center gap-4">
              <img
                src="/npig-logo.png"
                alt="NPIG Logo"
                className="w-11 h-11 rounded-2xl object-contain drop-shadow-[0_0_16px_rgba(59,130,246,0.5)]"
              />
              <span className="font-display font-black text-white dark:text-white light:text-slate-900 tracking-[0.2em] text-base">
                NPIG
              </span>
            </div>
            
            <p className="text-xs text-slate-500 font-mono text-center md:text-left leading-relaxed font-light">
              © 2027 National Predictive Intelligence Grid. Classification: RESTRICTED.<br />
              All actions monitored and logged under Central Command protocols.
            </p>
          </motion.div>

          {/* Premium Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            {[
              { href: 'https://github.com', icon: <Github className="w-4 h-4" />, color: 'hover:bg-white/10 hover:border-white/20' },
              { href: 'https://linkedin.com', icon: <Linkedin className="w-4 h-4" />, color: 'hover:bg-blue-500/10 hover:border-blue-500/30' },
              { href: 'https://twitter.com', icon: <Twitter className="w-4 h-4" />, color: 'hover:bg-cyan-500/10 hover:border-cyan-500/30' },
              { href: 'https://youtube.com', icon: <Youtube className="w-4 h-4" />, color: 'hover:bg-red-500/10 hover:border-red-500/30' }
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`w-11 h-11 rounded-2xl border border-white/[0.08] bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-200/50 light:border-slate-300 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 ${social.color}`}
                style={{
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Premium Apple-style bottom links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center md:items-end gap-3 text-right"
          >
            <div className="flex gap-6 text-xs font-bold text-slate-500">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Security</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            </div>
            <div className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Powered by AI Core v4
            </div>
          </motion.div>
        </section>

      </div>

      {/* ── NEXUS Live Chat Drawer Preview ── */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
            onClick={() => setChatOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-[#080d1a] border-l border-white/[0.08] shadow-2xl flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0d152a] to-[#040813] p-5 border-b border-cyan-500/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                    <Bot className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">NEXUS AI Portal</h4>
                    <p className="text-[10px] text-cyan-400 font-mono">CONNECTION: ENCRYPTED</p>
                  </div>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-xs flex flex-col">
                {chatMsgs.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] p-3.5 rounded-2xl ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50' 
                          : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-950/80 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a predictive query..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500 transition-colors font-mono"
                />
                <button 
                  type="submit" 
                  className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold uppercase rounded-xl transition-all"
                >
                  Send
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
