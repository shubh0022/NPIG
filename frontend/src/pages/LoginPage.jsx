import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Line, Preload, Float, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Bot, Mail, Smartphone, Globe, Shield, RefreshCw, ShieldAlert, Zap, Lock, Fingerprint, ScanEye, Cpu, ChevronRight, X, PhoneCall } from 'lucide-react';

/* ─── Neural Network Canvas Background ────────────────────────── */
function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.floor((width * height) / 12000);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    let animationFrameId;

    function render() {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;

          if (dist < 12000) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    }
    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
    />
  );
}

/* ─── 3D Globe Component ─────────────────────────────────────── */
function EarthGlobe() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group>
      {/* Outer Glow */}
      <Sphere args={[2.8, 64, 64]} scale={1.05}>
        <meshBasicMaterial
          color="#1e3a8a"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Core Wireframe */}
      <Sphere ref={meshRef} args={[2.8, 48, 48]}>
        <meshStandardMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.4}
        />
      </Sphere>

      {/* Solid Core Element */}
      <Sphere args={[2.7, 32, 32]}>
        <meshLambertMaterial color="#020617" transparent opacity={0.9} />
      </Sphere>

      {/* Data Nodes/Arcs (Fake representation) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {Array.from({ length: 30 }).map((_, i) => {
          const lat = (Math.random() - 0.5) * Math.PI;
          const lon = (Math.random() - 0.5) * Math.PI * 2;
          const r = 2.8;
          const x = r * Math.cos(lat) * Math.cos(lon);
          const y = r * Math.sin(lat);
          const z = r * Math.cos(lat) * Math.sin(lon);
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color={Math.random() > 0.5 ? "#2dd4bf" : "#3b82f6"} />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 8] }} className="absolute inset-0 z-0 pointer-events-none">
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#3b82f6" />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#6366f1" />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <group position={[4, 0, -2]}>
        <EarthGlobe />
      </group>
      <Preload all />
    </Canvas>
  );
}

/* ─── Input Field Wrapper ────────────────────────────────────── */
function Field({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-2 relative z-10 w-full mb-4">
      <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-400/80 flex items-center gap-2 mb-1">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Demo Data ──────────────────────────────────────────────── */
const ROLES = [
  { id: 'admin', title: 'Director General', level: 'Level 5 Clearance', icon: <ShieldAlert className="w-6 h-6 text-red-500" />, desc: 'System-wide oversight & command.', email: 'admin@npig.gov.in', pass: 'npig@2024' },
  { id: 'officer', title: 'Field Operative', level: 'Level 3 Clearance', icon: <Zap className="w-6 h-6 text-amber-500" />, desc: 'Division and regional sector access.', email: 'officer@npig.gov.in', pass: 'npig@2024' },
  { id: 'analyst', title: 'Data Analyst', level: 'Level 2 Clearance', icon: <ScanEye className="w-6 h-6 text-cyan-500" />, desc: 'Live telemetrics & threat analytics.', email: 'analyst@npig.gov.in', pass: 'npig@2024' },
  { id: 'viewer', title: 'Read-only Access', level: 'Level 1 Clearance', icon: <Lock className="w-6 h-6 text-emerald-500" />, desc: 'Restricted system viewer scope.', email: 'viewer@npig.gov.in', pass: 'npig@2024' }
];

/* ─── Main Component ─────────────────────────────────────────── */
export default function LoginPage() {
  const { setUser, setToken, isAuthenticated } = useStore();
  const navigate = useNavigate();

  // Form states
  const [method, setMethod] = useState('email'); // email, phone, google, sso
  const [email, setEmail] = useState('admin@npig.gov.in');
  const [pass, setPass] = useState('npig@2024');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['','','','','','']);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  // AI assistant states
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMsgs, setAiMsgs] = useState([{ sender: 'ai', text: 'Welcome back. System ready. Identify yourself.' }]);

  // Background audio
  useEffect(() => {
    // We could add an optional subtle sci-fi hum audio here if requested
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const demoLogin = (emailAddr) => {
    const userRole = {
      'admin@npig.gov.in': { role: 'ADMIN', clearance: 5 },
      'officer@npig.gov.in': { role: 'OFFICER', clearance: 3 },
      'analyst@npig.gov.in': { role: 'ANALYST', clearance: 2 },
      'viewer@npig.gov.in': { role: 'VIEWER', clearance: 1 },
    }[emailAddr] || { role: 'ADMIN', clearance: 5 };

    const user = {
      id: `npig-${Date.now()}`,
      email: emailAddr,
      full_name: emailAddr.split('@')[0].toUpperCase(),
      role: userRole.role,
      department: 'Central Intelligence Command',
    };

    setToken('npig-jwt-auth');
    setUser(user);
    toast.success(`Access Granted: Welcome ${user.full_name}`, { icon: '🟢', style: { borderRadius: '10px', background: '#020617', color: '#10b981', border: '1px solid #10b981' } });
    navigate('/dashboard');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(email, pass);
      setToken(res.data.access_token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch {
      setTimeout(() => { demoLogin(email); }, 1200); // Demo fallback
    }
  };

  const handleOtp = (e) => {
    e.preventDefault();
    if (!otpSent) {
      setLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
        toast('OTP Sent via Encrypted Channel', { icon: '📡' });
      }, 1000);
      return;
    }
    setLoading(true);
    setTimeout(() => { demoLogin(`phone.${phone}@npig.gov.in`); }, 1000);
  };

  const handleAIQuery = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const uMsg = e.target.value;
      setAiMsgs(p => [...p, { sender: 'user', text: uMsg }]);
      e.target.value = '';
      setTimeout(() => {
        setAiMsgs(p => [...p, { sender: 'ai', text: 'Processing authorization query. Identity verification required to proceed.' }]);
      }, 800);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#02040A] text-white flex overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Environment */}
      <NeuralBackground />
      <Scene />
      
      {/* Holographic scanning overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden mix-blend-overlay opacity-10">
        <motion.div 
          animate={{ y: ['-10%', '110%'] }} 
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
          className="w-full h-32 bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-md"
        />
      </div>

      {/* Top Bar for aesthetics */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-40 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-md relative overflow-hidden">
             <img src="/npig-logo.png" alt="NPIG" className="w-8 h-8 z-10 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
             <div className="absolute inset-0 bg-cyan-400/20 mix-blend-color-burn animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 uppercase">
              NPIG
            </h1>
            <p className="text-[10px] text-cyan-500/60 font-mono tracking-widest uppercase">National Predictive Intelligence</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded px-3 py-1 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase">Nodes Active</span>
          </div>
          <div className="text-[10px] font-mono text-blue-300/50 flex flex-col text-right">
            <span>SYS_TIME: {new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
            <span>UPLINK: ENCRYPTED</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-full min-h-screen px-6 py-24 relative z-20">
        
        {/* LEFT COLUMN - LOGIN */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Warning Header */}
            <div className="mb-8 border-l-2 border-red-500/50 pl-4 py-2 bg-gradient-to-r from-red-500/5 to-transparent">
              <h2 className="text-red-400 font-bold text-sm tracking-[0.2em] mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4" /> CLASSIFIED ACCESS
              </h2>
              <p className="text-xs text-red-300/60 font-mono leading-relaxed">
                UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED. ALL ACTIVITIES ARE LOGGED AND MONITORED BY NPIG NEURAL SEC.
              </p>
            </div>

            {/* Login Card */}
            <motion.div 
               className="relative rounded-2xl overflow-hidden backdrop-blur-3xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] group"
               style={{
                background: 'linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(2,6,23,0.8) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.1)'
               }}
               whileHover={{ y: -2 }}
               transition={{ duration: 0.3 }}
            >
              {/* Animated borders */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
              <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-30"></div>

              <div className="p-8">
                {/* Method Selector */}
                <div className="flex gap-2 mb-8 bg-black/40 p-1 rounded-xl border border-white/5">
                  {[
                    { id: 'email', label: 'Identity', icon: <Fingerprint className="w-3.5 h-3.5" /> },
                    { id: 'phone', label: 'Comm Link', icon: <Smartphone className="w-3.5 h-3.5" /> },
                    { id: 'sso',   label: 'Gov SSO', icon: <Shield className="w-3.5 h-3.5" /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { setMethod(tab.id); setOtpSent(false); }}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${method === tab.id ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'}`}
                    >
                      {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {/* Email Login */}
                  {method === 'email' && (
                    <motion.form 
                      key="email"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onSubmit={handleLogin}
                    >
                      <Field label="Operator ID / Email" icon={<Mail className="w-3.5 h-3.5" />}>
                        <div className="relative group">
                          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur-[2px]"></div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0B1121] border border-slate-700/50 rounded-xl px-4 py-3.5 text-sm text-cyan-50 outline-none relative z-10 transition-colors focus:bg-[#0f172a] font-mono"
                            placeholder="operator@npig.gov.in"
                            required
                          />
                        </div>
                      </Field>
                      <Field label="Authorization Key" icon={<Lock className="w-3.5 h-3.5" />}>
                         <div className="relative group">
                          <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur-[2px]"></div>
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full bg-[#0B1121] border border-slate-700/50 rounded-xl px-4 py-3.5 text-sm text-blue-50 outline-none relative z-10 transition-colors focus:bg-[#0f172a] font-mono tracking-widest"
                            placeholder="••••••••••••"
                            required
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-slate-400 hover:text-cyan-400 transition-colors">
                            <ScanEye className="w-4 h-4" />
                          </button>
                        </div>
                      </Field>

                      <motion.button
                        disabled={loading}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-[1px] rounded-xl overflow-hidden relative"
                      >
                        <div className="bg-[#0B1121] px-4 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-transparent transition-colors duration-300">
                          {loading ? (
                            <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                          ) : (
                            <>
                              <Fingerprint className="w-5 h-5 text-cyan-400 group-hover:text-white" />
                              <span className="font-bold uppercase tracking-widest text-sm text-cyan-100">Authenticate</span>
                            </>
                          )}
                        </div>
                      </motion.button>
                    </motion.form>
                  )}

                  {/* Phone OTP */}
                  {method === 'phone' && (
                    <motion.form 
                      key="phone"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onSubmit={handleOtp}
                    >
                      <Field label="Encrypted Link" icon={<PhoneCall className="w-3.5 h-3.5" />}>
                        <div className="flex gap-2">
                           <div className="bg-[#0B1121] border border-slate-700/50 px-4 py-3.5 rounded-xl text-cyan-500 font-mono font-bold flex items-center justify-center">
                             +91
                           </div>
                           <div className="relative group flex-1">
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur-[2px]"></div>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                              className="w-full bg-[#0B1121] border border-slate-700/50 rounded-xl px-4 py-3.5 text-sm text-cyan-50 outline-none relative z-10 transition-colors focus:bg-[#0f172a] font-mono tracking-widest"
                              placeholder="98765 43210"
                              required
                            />
                          </div>
                        </div>
                      </Field>
                      
                      {otpSent && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-2 block">Enter Decoding Sequence (OTP)</label>
                           <div className="flex gap-2">
                             {otp.map((v, i) => (
                               <input key={i} id={`otp-${i}`} maxLength={1} value={v}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if(val && !/\d/.test(val)) return;
                                    const newOtp = [...otp]; newOtp[i] = val; setOtp(newOtp);
                                    if(val && i < 5) document.getElementById(`otp-${i+1}`).focus();
                                  }}
                                  onKeyDown={(e) => {
                                     if(e.key === 'Backspace' && !v && i > 0) document.getElementById(`otp-${i-1}`).focus();
                                  }}
                                  className="w-full aspect-square text-center bg-[#0B1121] border border-slate-600 rounded-lg text-xl font-mono text-cyan-400 focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all outline-none"
                               />
                             ))}
                           </div>
                        </motion.div>
                      )}

                      <motion.button
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm tracking-widest uppercase py-4 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center"
                      >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : otpSent ? 'Verify Sequence' : 'Establish Link'}
                      </motion.button>
                    </motion.form>
                  )}

                  {/* SSO */}
                  {method === 'sso' && (
                    <motion.div key="sso" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-6 text-center">
                       <ShieldAlert className="w-16 h-16 text-indigo-400 mb-4 opacity-80 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                       <h3 className="text-lg font-bold text-white mb-2">Government SSO Gateway</h3>
                       <p className="text-xs text-slate-400 mb-6 max-w-[250px]">Routing through secure intra-net layer via National Informatics infrastructure.</p>
                       <motion.button
                          onClick={() => { setLoading(true); setTimeout(() => demoLogin('admin@npig.gov.in'), 1500) }}
                          whileHover={{ scale: 1.05 }}
                          className="px-6 py-3 border border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-bold tracking-widest text-xs uppercase rounded-lg hover:bg-indigo-500/30 transition-colors"
                       >
                          {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Bridge Connection'}
                       </motion.button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
              
              {/* Bottom Decoration */}
              <div className="bg-[#0f172a]/50 p-4 border-t border-slate-700/30 flex justify-between items-center backdrop-blur-md">
                 <span className="text-[9px] font-mono text-slate-500 tracking-widest">v4.0.9-a SECURE</span>
                 <span className="text-[9px] font-mono text-cyan-600/70">END-TO-END ENCRYPTED</span>
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN - ROLES & DATA PREVIEW */}
        <div className="hidden lg:flex w-[55%] flex-col justify-end items-end pb-8">
          
          <motion.div 
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.3 }}
             className="w-full max-w-lg"
          >
            {/* Live Stats Preview Box */}
            <div className="bg-black/30 border border-white/5 backdrop-blur-md rounded-2xl p-6 mb-6">
               <h3 className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                 <Globe className="w-3.5 h-3.5" /> Regional Live Telemetry
               </h3>
               <div className="grid grid-cols-3 gap-4">
                  <div className="border-l border-red-500/30 pl-3">
                     <p className="text-[10px] text-slate-400 font-mono mb-1">CRITICAL THREATS</p>
                     <p className="text-2xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">142</p>
                  </div>
                  <div className="border-l border-emerald-500/30 pl-3">
                     <p className="text-[10px] text-slate-400 font-mono mb-1">UNITS DEPLOYED</p>
                     <p className="text-2xl font-black text-emerald-400">8,409</p>
                  </div>
                  <div className="border-l border-blue-500/30 pl-3">
                     <p className="text-[10px] text-slate-400 font-mono mb-1">PREDICTIONS GEN</p>
                     <p className="text-2xl font-black text-blue-400">32.4K</p>
                  </div>
               </div>
            </div>

            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mb-4 pl-2">Role Identification (DEMO)</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role, idx) => (
                <motion.div
                  key={role.id}
                  whileHover={{ scale: 1.03, y: -4, borderColor: 'rgba(6, 182, 212, 0.4)' }}
                  onClick={() => { setEmail(role.email); setPass(role.pass); setMethod('email'); }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="bg-[#0B1121]/80 border border-white/5 backdrop-blur-xl rounded-xl p-4 cursor-pointer group"
                >
                   <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
                        {role.icon}
                      </div>
                      <span className="text-[8px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">{role.level}</span>
                   </div>
                   <h4 className="font-bold text-white text-sm mt-3">{role.title}</h4>
                   <p className="text-[10px] text-slate-500 leading-snug mt-1">{role.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* Floating NPIG AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
           {aiOpen && (
             <motion.div 
               initial={{ opacity: 0, y: 20, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 20, scale: 0.9 }}
               className="absolute bottom-20 right-0 w-[320px] bg-black/80 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col"
             >
                <div className="bg-gradient-to-r from-[#0f172a] to-[#1e1b4b] p-4 border-b border-cyan-500/20 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                         <Cpu className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-cyan-50">NPIG AI Core</h4>
                        <p className="text-[9px] text-cyan-400/80 font-mono">STATUS: ONLINE</p>
                      </div>
                   </div>
                   <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-white">
                     <X className="w-4 h-4" />
                   </button>
                </div>
                
                <div className="p-4 h-[240px] overflow-y-auto flex flex-col gap-3 font-mono text-xs scrollbar-thin scrollbar-thumb-cyan-500/30">
                   {aiMsgs.map((m, i) => (
                     <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-2.5 rounded-lg ${m.sender === 'user' ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-200'}`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-3 bg-[#0B1121] border-t border-cyan-500/20">
                   <input type="text" placeholder="Query AI system..." onKeyDown={handleAIQuery} className="w-full bg-black/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500 transition-colors font-mono" />
                </div>
             </motion.div>
           )}
        </AnimatePresence>

        <motion.button 
           onClick={() => setAiOpen(!aiOpen)}
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/50 relative"
        >
           {/* Pulsing ring */}
           <span className="absolute w-full h-full rounded-full border border-cyan-400 animate-ping opacity-50"></span>
           <Bot className="w-6 h-6 text-white" />
        </motion.button>
      </div>

    </div>
  );
}
