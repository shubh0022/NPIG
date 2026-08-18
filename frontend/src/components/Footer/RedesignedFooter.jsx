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
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import NpigLogo from '../Brand/NpigLogo';
import GlobeHero from './GlobeHero';
import NexusCoreWave from './NexusCoreWave';

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

const PLATFORMS = [
  {
    title: 'Traffic Intelligence',
    description: 'Dynamic transit mapping, bottleneck forecasting, and automated lane signal routing.',
    image: '/images/traffic_intelligence.png',
    color: 'from-blue-600 to-cyan-500',
    path: '/solutions'
  },
  {
    title: 'Healthcare Intelligence',
    description: 'Predictive bio-telemetry, epidemic outbreak tracking, and clinical resource optimization.',
    image: '/images/healthcare_intelligence.png',
    color: 'from-violet-600 to-fuchsia-500',
    path: '/solutions'
  },
  {
    title: 'Crime Intelligence',
    description: 'Spatial risk hotspot simulation, patrol response routing, and threat analytics.',
    image: '/images/crime_intelligence.png',
    color: 'from-rose-600 to-pink-500',
    path: '/solutions'
  },
  {
    title: 'Climate Intelligence',
    description: 'Atmospheric predictive analytics, disaster vector mapping, and real-time alerts.',
    image: '/images/climate_intelligence.png',
    color: 'from-emerald-600 to-teal-500',
    path: '/solutions'
  },
  {
    title: 'Cyber Intelligence',
    description: 'Zero-trust perimeter auditing, neural cryptography threat defense, and live monitoring.',
    image: '/images/cyber_intelligence.png',
    color: 'from-indigo-600 to-blue-500',
    path: '/solutions'
  }
];

const GOV_SOLUTIONS = [
  { name: 'Smart Cities', desc: 'Unified urban telemetry grids', path: '/solutions' },
  { name: 'Disaster Management', desc: 'Predictive evacuation routing', path: '/solutions' },
  { name: 'Public Safety', desc: 'Automated threat response grids', path: '/solutions' },
  { name: 'Transportation', desc: 'Multi-modal transit orchestration', path: '/solutions' }
];

const ENT_SOLUTIONS = [
  { name: 'Command Center', desc: 'Real-time operational awareness', path: '/dashboard' },
  { name: 'Risk Management', desc: 'Continuous hazard simulation', path: '/predictions' },
  { name: 'Predictive Analytics', desc: 'ML-powered demand forecasting', path: '/analytics' },
  { name: 'Security Operations', desc: 'Threat detection and audit logs', path: '/security' }
];

const DEV_HUB = [
  { name: 'Report Center', desc: 'Executive intelligence briefs', path: '/reports' },
  { name: 'Data Center', desc: 'Connected APIs & streaming Kafka', path: '/data-center' },
  { name: 'Research Library', desc: 'Whitepapers & methodologies', path: '/resources' },
  { name: 'Agency Contact', desc: 'Official governance inquiries', path: '/contact' }
];

export default function RedesignedFooter() {
  const navigate = useNavigate();
  const { theme } = useStore();
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
    <footer className={`relative border-t pt-24 pb-12 px-6 overflow-hidden ${
      theme === 'light' ? 'bg-[#F8FAFC] border-slate-200 text-slate-900' : 'bg-[#030712] border-white/[0.08] text-white'
    }`}>
      <div className="absolute inset-0 bg-grid-dark bg-grid opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-900/15 to-violet-900/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* ── SECTION 1: Intelligence Globe Hero ── */}
        <section className="w-full">
          <GlobeHero />
        </section>

        {/* ── SECTION 2: Platform Capabilities ── */}
        <section className="space-y-10">
          <div className="text-center md:text-left">
            <h3 className="text-xs font-black text-indigo-400 tracking-[0.3em] uppercase mb-3">Core Pillars</h3>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Multi-Domain Predictive Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {PLATFORMS.map((platform, idx) => (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => navigate(platform.path)}
                className="group relative rounded-3xl border border-white/[0.08] bg-[#0B1020] overflow-hidden flex flex-col cursor-pointer transition-all duration-300 shadow-xl"
              >
                <div className="relative w-full aspect-video overflow-hidden bg-slate-950">
                  <img 
                    src={platform.image} 
                    alt={platform.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent" />
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${platform.color}`} />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-wide mb-2 group-hover:text-indigo-400 transition-colors">
                      {platform.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-2">
                      {platform.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center gap-1.5 text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                    Explore Pillar <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: Information Architecture Links ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pt-8 border-t border-white/[0.08]">
          
          {/* Gov Solutions */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 border border-blue-500/30">
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="text-white font-black text-sm tracking-wider uppercase font-display">
                Government Solutions
              </h4>
            </div>
            <ul className="space-y-4">
              {GOV_SOLUTIONS.map((sol) => (
                <li 
                  key={sol.name} 
                  onClick={() => navigate(sol.path)}
                  className="group cursor-pointer"
                >
                  <span className="text-slate-300 text-xs font-bold group-hover:text-indigo-400 transition-colors block">
                    {sol.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block font-light">
                    {sol.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Enterprise Solutions */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400 border border-violet-500/30">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-white font-black text-sm tracking-wider uppercase font-display">
                Enterprise Operations
              </h4>
            </div>
            <ul className="space-y-4">
              {ENT_SOLUTIONS.map((sol) => (
                <li 
                  key={sol.name} 
                  onClick={() => navigate(sol.path)}
                  className="group cursor-pointer"
                >
                  <span className="text-slate-300 text-xs font-bold group-hover:text-violet-400 transition-colors block">
                    {sol.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block font-light">
                    {sol.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer & Platform Hub */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <Terminal className="w-4 h-4" />
              </div>
              <h4 className="text-white font-black text-sm tracking-wider uppercase font-display">
                Platform & Data Hub
              </h4>
            </div>
            <ul className="space-y-4">
              {DEV_HUB.map((hub) => (
                <li 
                  key={hub.name} 
                  onClick={() => navigate(hub.path)}
                  className="group cursor-pointer"
                >
                  <span className="text-slate-300 text-xs font-bold group-hover:text-emerald-400 transition-colors block">
                    {hub.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block font-light">
                    {hub.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        {/* ── SECTION 4: Security & Compliance Certifications ── */}
        <section className="space-y-6 pt-8 border-t border-white/[0.08]">
          <div className="text-center md:text-left">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Security & Compliance</h4>
            <p className="text-slate-500 text-xs mt-1 font-light">Government-scale certification and sovereign infrastructure standards.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'ISO 27001', desc: 'Information Security', icon: <ShieldCheck className="w-5 h-5" />, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
              { title: 'SOC2 TYPE II', desc: 'Security Trust Audited', icon: <Lock className="w-5 h-5" />, color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30' },
              { title: 'GDPR / DPDP', desc: 'Sovereign Privacy', icon: <FileText className="w-5 h-5" />, color: 'from-emerald-500/20 to-cyan-500/20', border: 'border-emerald-500/30' },
              { title: 'CERT-In', desc: 'National Directive Align', icon: <Eye className="w-5 h-5" />, color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
            ].map((badge) => (
              <div
                key={badge.title}
                className="p-4 rounded-2xl border border-white/[0.08] bg-[#0B1020] transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${badge.color} border ${badge.border} flex items-center justify-center mb-2.5 shadow-lg text-indigo-300`}>
                  {badge.icon}
                </div>
                <h5 className="text-white font-black text-xs tracking-wide">{badge.title}</h5>
                <p className="text-slate-500 text-[11px] font-light mt-0.5">{badge.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5: Copyright & Bottom Links ── */}
        <section className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <NpigLogo height={22} theme="dark" showTagline={false} />
            <p className="text-xs text-slate-500 font-mono pl-2 border-l border-white/10">
              © 2027 National Predictive Intelligence Grid. Predict. Prevent. Protect.
            </p>
          </div>

          <div className="flex gap-6 text-xs text-slate-400 font-medium">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link to="/security" className="hover:text-white transition-colors">Security</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </section>

      </div>
    </footer>
  );
}
