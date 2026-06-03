import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Line, Preload, Float, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Bot, Mail, Smartphone, Globe, Shield, RefreshCw, ShieldAlert, ShieldCheck, Zap, Lock, Fingerprint, ScanEye, Cpu, ChevronRight, X, PhoneCall } from 'lucide-react';

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
    const particleCount = Math.floor((width * height) / 14000);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    let animationFrameId;

    function render() {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;

          if (dist < 10000) {
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
      className="absolute inset-0 pointer-events-none z-0 opacity-30"
    />
  );
}

/* ─── 3D Globe Component ─────────────────────────────────────── */
function EarthGlobe() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.08;
    }
  });

  return (
    <group>
      {/* Outer atmospheric halo */}
      <Sphere args={[2.8, 64, 64]} scale={1.08}>
        <meshBasicMaterial color="#1e40af" transparent opacity={0.06} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      {/* Core wireframe */}
      <Sphere ref={meshRef} args={[2.8, 48, 48]}>
        <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.2} />
      </Sphere>

      {/* Solid dark core */}
      <Sphere args={[2.7, 32, 32]}>
        <meshLambertMaterial color="#020617" transparent opacity={0.92} />
      </Sphere>

      {/* Data nodes */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        {Array.from({ length: 25 }).map((_, i) => {
          const lat = (Math.random() - 0.5) * Math.PI;
          const lon = (Math.random() - 0.5) * Math.PI * 2;
          const r = 2.82;
          const x = r * Math.cos(lat) * Math.cos(lon);
          const y = r * Math.sin(lat);
          const z = r * Math.cos(lat) * Math.sin(lon);
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color={i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#a78bfa' : '#34d399'} toneMapped={false} />
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#3b82f6" />
      <pointLight position={[-10, -10, -5]} intensity={0.6} color="#7c3aed" />
      <Stars radius={120} depth={50} count={1200} factor={3} saturation={0} fade speed={0.3} />
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
    <div className="flex flex-col gap-1.5 relative z-10 w-full mb-4">
      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Premium Biometric Simulation ────────────────────────────── */
function BiometricOverlay({ onComplete, onSkip }) {
  const [phase, setPhase] = useState('scanning')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(t)
          setTimeout(() => {
            setPhase('verified')
            setTimeout(onComplete, 800)
          }, 300)
          return 100
        }
        return p + 3
      })
    }, 50)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-[#030712]/95 backdrop-blur-3xl flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="text-center"
      >
        {/* Premium fingerprint scanner */}
        <div className="relative w-40 h-40 mx-auto mb-10">
          {/* Multi-layer scanning rings */}
          {[1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2.5, delay: i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: i % 2 === 0 ? 'rgba(59,130,246,0.3)' : 'rgba(139,92,246,0.3)',
                boxShadow: '0 0 20px rgba(59,130,246,0.1)',
              }}
            />
          ))}
          {/* Core icon with glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={phase === 'verified' ? { scale: [1, 1.3, 1] } : { rotate: 360 }}
              transition={phase === 'verified' ? { duration: 0.6, ease: 'easeOut' } : { duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              {phase === 'verified' ? (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 border-2 border-emerald-500/50 flex items-center justify-center shadow-[0 0 40px_rgba(16,185,129,0.4)]">
                  <span className="text-3xl">✓</span>
                </div>
              ) : (
                <div className="relative">
                  <Fingerprint className="w-16 h-16 text-blue-400" style={{ filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.6))' }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-full blur-xl" />
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <motion.p 
          animate={{ opacity: phase === 'verified' ? [1, 1, 1] : [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: phase === 'verified' ? 0 : Infinity }}
          className="text-sm font-black uppercase tracking-[0.3em] text-white mb-3"
        >
          {phase === 'verified' ? 'Identity Confirmed' : 'Biometric Verification'}
        </motion.p>
        <p className="text-[11px] text-slate-500 font-mono mb-8 tracking-wider">
          {phase === 'verified' ? 'ACCESS GRANTED · CLEARANCE VERIFIED' : 'Scanning neural-biometric signature...'}
        </p>

        {/* Premium progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-[4px] rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: phase === 'verified'
                  ? 'linear-gradient(90deg, #10b981, #06B6D4)'
                  : 'linear-gradient(90deg, #3B82F6, #8B5CF6, #06B6D4)',
                boxShadow: phase === 'verified' ? '0 0 20px rgba(16,185,129,0.5)' : '0 0 20px rgba(59,130,246,0.5)',
              }}
            />
          </div>
          <p className="text-[10px] font-mono text-slate-600 mt-3 tracking-wider">{progress}% complete</p>
        </div>

        <motion.button
          onClick={onSkip}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 text-[11px] text-slate-600 hover:text-white transition-colors font-bold tracking-wider"
        >
          Skip Biometric →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

/* ─── Premium MFA Verification Overlay ───────────────────────────── */
function MFAOverlay({ onComplete, onSkip, userEmail }) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [method, setMethod] = useState('otp') // otp, biometric, push
  const inputRefs = useRef([])

  const handleInputChange = (index, value) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    setVerifying(true)
    setTimeout(() => {
      setVerified(true)
      setTimeout(onComplete, 1000)
    }, 1500)
  }

  const handleBiometric = () => {
    setMethod('biometric')
    setTimeout(() => {
      setVerified(true)
      setTimeout(onComplete, 1000)
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-[#030712]/98 backdrop-blur-3xl flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md p-8 rounded-3xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(3,7,18,0.95) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Premium gradient accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-500/60 via-blue-500/60 to-cyan-500/60" />
        {/* Ambient glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(59,130,246,0.15)' }} />

        <div className="relative z-10">
          {method === 'otp' && !verified && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0 0 24px_rgba(139,92,246,0.3)]">
                  <Shield className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mb-2">Two-Factor Authentication</h3>
                <p className="text-xs text-slate-400">Enter the 6-digit code sent to</p>
                <p className="text-sm text-blue-400 font-mono mt-1">{userEmail}</p>
              </div>

              <div className="flex gap-3 mb-6 justify-center">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleInputChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-12 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center text-2xl font-black text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                ))}
              </div>

              <div className="flex gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerify}
                  disabled={verifying || code.join('').length !== 6}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-400 hover:to-blue-400 transition-all disabled:opacity-50 shadow-[0_4px 20px_rgba(139,92,246,0.3)]"
                >
                  {verifying ? 'Verifying...' : 'Verify Code'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBiometric}
                  className="px-4 py-3 rounded-2xl text-xs font-bold bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  Use Biometric
                </motion.button>
              </div>

              <div className="text-center">
                <button className="text-[10px] text-slate-500 hover:text-blue-400 transition-colors font-medium">
                  Resend Code (30s)
                </button>
              </div>
            </>
          )}

          {method === 'biometric' && !verified && (
            <div className="text-center py-8">
              <div className="relative w-32 h-32 mx-auto mb-6">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor: 'rgba(139,92,246,0.4)',
                      boxShadow: '0 0 20px rgba(139,92,246,0.2)',
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                    <Fingerprint className="w-16 h-16 text-violet-400" style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.6))' }} />
                  </motion.div>
                </div>
              </div>
              <h3 className="text-lg font-black text-white mb-2">Biometric Verification</h3>
              <p className="text-xs text-slate-400">Touch your fingerprint sensor to verify</p>
            </div>
          )}

          {verified && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 shadow-[0 0 32px_rgba(16,185,129,0.3)]"
              >
                <span className="text-3xl">✓</span>
              </motion.div>
              <h3 className="text-white font-black mb-2 tracking-tight">Authentication Successful</h3>
              <p className="text-xs text-slate-500 mb-6">Your identity has been verified</p>
              
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Device Remembered</p>
                    <p className="text-[10px] text-slate-500">This device is now trusted for 30 days</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="px-8 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-[0_4px 20px_rgba(16,185,129,0.3)]"
              >
                Continue to Dashboard
              </motion.button>
            </div>
          )}

          {!verified && (
            <motion.button
              onClick={onSkip}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 text-[10px] text-slate-600 hover:text-white transition-colors font-bold tracking-wider block mx-auto"
            >
              Skip MFA (Not Recommended)
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Demo Data ──────────────────────────────────────────────── */
const ROLES = [
  { id: 'admin', title: 'Director General', level: 'Level 5', icon: <ShieldAlert className="w-5 h-5 text-red-400" />, desc: 'Full system command', email: 'admin@npig.gov.in', pass: 'npig@2024', color: '#ff2d6b' },
  { id: 'officer', title: 'Field Operative', level: 'Level 3', icon: <Zap className="w-5 h-5 text-amber-400" />, desc: 'Regional sector access', email: 'officer@npig.gov.in', pass: 'npig@2024', color: '#f59e0b' },
  { id: 'analyst', title: 'Data Analyst', level: 'Level 2', icon: <ScanEye className="w-5 h-5 text-cyan-400" />, desc: 'Analytics & insights', email: 'analyst@npig.gov.in', pass: 'npig@2024', color: '#06b6d4' },
  { id: 'viewer', title: 'Observer', level: 'Level 1', icon: <Lock className="w-5 h-5 text-emerald-400" />, desc: 'Read-only viewer', email: 'viewer@npig.gov.in', pass: 'npig@2024', color: '#10b981' }
];

/* ─── Main Component ─────────────────────────────────────────── */
export default function LoginPage() {
  const { setUser, setToken, isAuthenticated } = useStore();
  const navigate = useNavigate();

  const [method, setMethod] = useState('email');
  const [email, setEmail] = useState('admin@npig.gov.in');
  const [pass, setPass] = useState('npig@2024');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['','','','','','']);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(null);
  
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMsgs, setAiMsgs] = useState([{ sender: 'ai', text: 'Welcome back. System ready. Identify yourself.' }]);

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
    toast.success(`Access Granted: Welcome ${user.full_name}`, {
      icon: '🟢',
      style: { borderRadius: '12px', background: '#020617', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
    });
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
      // Show biometric simulation before demo login
      setPendingEmail(email);
      setLoading(false);
      setShowBiometric(true);
    }
  };

  const handleBiometricComplete = () => {
    setShowBiometric(false);
    // Trigger MFA after biometric verification
    setShowMFA(true);
  };

  const handleMFAComplete = () => {
    setShowMFA(false);
    demoLogin(pendingEmail || email);
  };

  const handleMFASkip = () => {
    setShowMFA(false);
    demoLogin(pendingEmail || email);
  };

  const handleOtp = (e) => {
    e.preventDefault();
    if (!otpSent) {
      setLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
        toast('OTP Sent via Encrypted Channel', { icon: '📡', style: { borderRadius: '12px', background: '#020617', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' } });
      }, 1000);
      return;
    }
    setLoading(true);
    setPendingEmail(`phone.${phone}@npig.gov.in`);
    setLoading(false);
    setShowBiometric(true);
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
    <div className="relative min-h-screen w-full bg-[#030712] text-white flex overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Environment */}
      <NeuralBackground />
      <Scene />

      {/* Biometric overlay */}
      <AnimatePresence>
        {showBiometric && (
          <BiometricOverlay
            onComplete={handleBiometricComplete}
            onSkip={() => { setShowBiometric(false); demoLogin(pendingEmail || email); }}
          />
        )}
      </AnimatePresence>

      {/* MFA overlay */}
      <AnimatePresence>
        {showMFA && (
          <MFAOverlay
            onComplete={handleMFAComplete}
            onSkip={handleMFASkip}
            userEmail={pendingEmail || email}
          />
        )}
      </AnimatePresence>
      
      {/* Scan line (subtle) */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden mix-blend-overlay opacity-[0.04]">
        <motion.div 
          animate={{ y: ['-10%', '110%'] }} 
          transition={{ duration: 8, ease: "linear", repeat: Infinity }}
          className="w-full h-24 bg-gradient-to-b from-transparent via-blue-400 to-transparent blur-md"
        />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-40 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center backdrop-blur-xl">
             <img src="/npig-logo.png" alt="NPIG" className="w-6 h-6 z-10" style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.5))' }} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] text-white">NPIG</h1>
            <p className="text-[9px] text-slate-500 font-mono tracking-widest">PREDICTIVE INTELLIGENCE</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-semibold text-emerald-400 tracking-wider">ONLINE</span>
          </div>
          <div className="text-[9px] font-mono text-slate-600 text-right hidden sm:block">
            <span>{new Date().toLocaleTimeString('en-US', { hour12: false })} UTC+5:30</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex h-full min-h-screen px-6 py-24 relative z-20">
        
        {/* LEFT COLUMN - LOGIN */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Security notice */}
            <div className="mb-8 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/[0.03] border border-red-500/10">
              <Shield className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-red-400 uppercase tracking-[0.15em] mb-0.5">Classified Access Point</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">All authentication attempts are logged, monitored, and audited.</p>
              </div>
            </div>

            {/* Premium Login Card */}
            <motion.div 
               className="relative rounded-3xl overflow-hidden backdrop-blur-3xl"
               style={{
                background: 'linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(3,7,18,0.8) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)',
               }}
            >
              {/* Premium top accent */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"></div>
              {/* Subtle glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="p-9 relative z-10">
                {/* Premium Method Selector */}
                <div className="flex gap-2 mb-8 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
                  {[
                    { id: 'email', label: 'Credentials', icon: <Fingerprint className="w-4 h-4" /> },
                    { id: 'phone', label: 'OTP', icon: <Smartphone className="w-4 h-4" /> },
                    { id: 'sso',   label: 'SSO', icon: <Shield className="w-4 h-4" /> }
                  ].map(tab => (
                    <motion.button
                      key={tab.id}
                      onClick={() => { setMethod(tab.id); setOtpSent(false); }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                        method === tab.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-white border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                          : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {/* Email Login */}
                  {method === 'email' && (
                    <motion.form 
                      key="email"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleLogin}
                    >
                      <Field label="Operator ID" icon={<Mail className="w-3 h-3" />}>
                        <div className="relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-blue-500/40 focus:bg-white/[0.05] font-mono placeholder:text-slate-600"
                            placeholder="operator@npig.gov.in"
                            required
                          />
                        </div>
                      </Field>
                      <Field label="Authorization Key" icon={<Lock className="w-3 h-3" />}>
                         <div className="relative">
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-blue-500/40 focus:bg-white/[0.05] font-mono tracking-widest placeholder:text-slate-600 pr-12"
                            placeholder="••••••••••••"
                            required
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} aria-label={showPass ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                            <ScanEye className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </Field>

                      <motion.button
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full mt-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 bg-white text-[#030712] hover:bg-slate-200 shadow-[0_4px_24px_rgba(255,255,255,0.08)]"
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Fingerprint className="w-4 h-4" />
                            Authenticate
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}

                  {/* Phone OTP */}
                  {method === 'phone' && (
                    <motion.form 
                      key="phone"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleOtp}
                    >
                      <Field label="Secure Communication Link" icon={<PhoneCall className="w-3 h-3" />}>
                        <div className="flex gap-2">
                           <div className="bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 rounded-xl text-blue-400 font-mono font-semibold text-sm flex items-center justify-center">
                             +91
                           </div>
                           <input
                             type="tel"
                             value={phone}
                             onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                             className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-blue-500/40 focus:bg-white/[0.05] font-mono tracking-widest placeholder:text-slate-600"
                             placeholder="98765 43210"
                             required
                           />
                        </div>
                      </Field>
                      
                      {otpSent && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                           <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2 block">Enter OTP</label>
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
                                  className="w-full aspect-square text-center bg-white/[0.03] border border-white/[0.08] rounded-lg text-lg font-mono text-white focus:border-blue-500/50 focus:bg-white/[0.05] transition-all outline-none"
                               />
                             ))}
                           </div>
                        </motion.div>
                      )}

                      <motion.button
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full mt-6 py-3.5 rounded-xl font-semibold text-sm bg-white text-[#030712] hover:bg-slate-200 transition-all shadow-[0_4px_24px_rgba(255,255,255,0.08)] flex items-center justify-center"
                      >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : otpSent ? 'Verify OTP' : 'Send OTP'}
                      </motion.button>
                    </motion.form>
                  )}

                  {/* Premium SSO with Google & Microsoft */}
                  {method === 'sso' && (
                    <motion.div key="sso" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex flex-col items-center py-10 text-center">
                       <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/15 to-blue-500/15 border border-violet-500/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                         <ShieldAlert className="w-10 h-10 text-violet-400" />
                       </div>
                       <h3 className="text-lg font-black text-white mb-2 tracking-tight">Government SSO Gateway</h3>
                       <p className="text-xs text-slate-500 mb-8 max-w-[280px] leading-relaxed font-light">Routing through National Informatics Centre secure infrastructure.</p>
                       
                       {/* OAuth Providers */}
                       <div className="w-full space-y-3">
                         <motion.button
                            onClick={() => { setLoading(true); setPendingEmail('admin@npig.gov.in'); setLoading(false); setShowBiometric(true); }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-5 py-4 bg-white text-[#030712] font-bold text-sm rounded-2xl hover:bg-slate-100 transition-all shadow-[0_4px 24px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
                         >
                            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            Continue with Google
                         </motion.button>
                         <motion.button
                            onClick={() => { setLoading(true); setPendingEmail('admin@npig.gov.in'); setLoading(false); setShowBiometric(true); }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-5 py-4 bg-white text-[#030712] font-bold text-sm rounded-2xl hover:bg-slate-100 transition-all shadow-[0_4px 24px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
                         >
                            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/></svg>
                            Continue with Microsoft
                         </motion.button>
                         <motion.button
                            onClick={() => { setLoading(true); setPendingEmail('admin@npig.gov.in'); setLoading(false); setShowBiometric(true); }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-5 py-4 bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-white/10 text-white font-bold text-sm rounded-2xl hover:bg-white/10 transition-all shadow-[0_4px 24px_rgba(139,92,246,0.15)] flex items-center justify-center gap-3"
                         >
                            <ShieldAlert className="w-5 h-5 text-violet-400" />
                            Government SSO
                         </motion.button>
                       </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
              
              {/* Bottom footer */}
              <div className="px-8 py-3 border-t border-white/[0.04] flex justify-between items-center">
                 <span className="text-[9px] font-mono text-slate-600">v4.1.0 · AES-256</span>
                 <span className="text-[9px] font-mono text-slate-600">E2E ENCRYPTED</span>
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN - ROLES & TELEMETRY */}
        <div className="hidden lg:flex w-[55%] flex-col justify-end items-end pb-8">
          
          <motion.div 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, delay: 0.2 }}
             className="w-full max-w-lg"
          >
            {/* Live Stats */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
               <h3 className="text-[9px] font-semibold text-slate-500 tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                 <Globe className="w-3 h-3" /> Live Telemetry
               </h3>
               <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'THREATS', value: '142', color: '#ff2d6b' },
                    { label: 'DEPLOYED', value: '8,409', color: '#10b981' },
                    { label: 'PREDICTIONS', value: '32.4K', color: '#3b82f6' },
                  ].map(stat => (
                    <div key={stat.label} className="pl-3" style={{ borderLeft: `2px solid ${stat.color}20` }}>
                      <p className="text-[9px] text-slate-500 font-mono mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-white">{stat.value}</p>
                    </div>
                  ))}
               </div>
            </div>

            <p className="text-[9px] font-semibold text-slate-600 tracking-[0.2em] uppercase mb-3 pl-1">Demo Roles</p>
            <div className="grid grid-cols-2 gap-2.5">
              {ROLES.map((role, idx) => (
                <motion.div
                  key={role.id}
                  whileHover={{ y: -3, scale: 1.02 }}
                  onClick={() => { setEmail(role.email); setPass(role.pass); setMethod('email'); }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  className="rounded-xl p-4 cursor-pointer group transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                   <div className="flex justify-between items-start mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: `${role.color}10`, border: `1px solid ${role.color}25` }}>
                        {role.icon}
                      </div>
                      <span className="text-[8px] px-2 py-0.5 rounded-md font-mono text-slate-400" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>{role.level}</span>
                   </div>
                   <h4 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors">{role.title}</h4>
                   <p className="text-[10px] text-slate-500 mt-0.5">{role.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* Floating AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
           {aiOpen && (
             <motion.div 
               initial={{ opacity: 0, y: 20, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 20, scale: 0.95 }}
               className="absolute bottom-18 right-0 w-[320px] overflow-hidden rounded-2xl flex flex-col"
               style={{
                 background: 'rgba(3,7,18,0.95)',
                 border: '1px solid rgba(255,255,255,0.06)',
                 boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
                 backdropFilter: 'blur(24px)',
               }}
             >
                <div className="px-4 py-3 border-b border-white/[0.04] flex justify-between items-center">
                   <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                         <Cpu className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">NEXUS AI</h4>
                        <p className="text-[8px] text-emerald-400 font-mono">ONLINE</p>
                      </div>
                   </div>
                   <button onClick={() => setAiOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                     <X className="w-4 h-4" />
                   </button>
                </div>
                
                <div className="p-4 h-[220px] overflow-y-auto flex flex-col gap-2.5 text-xs">
                   {aiMsgs.map((m, i) => (
                     <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-3 py-2.5 rounded-xl ${
                          m.sender === 'user'
                            ? 'bg-white/[0.06] text-white'
                            : 'bg-violet-500/[0.06] border border-violet-500/10 text-slate-300'
                        }`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-3 border-t border-white/[0.04]">
                   <input type="text" placeholder="Ask NEXUS..." onKeyDown={handleAIQuery} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500/30 transition-colors placeholder:text-slate-600" />
                </div>
             </motion.div>
           )}
        </AnimatePresence>

        <motion.button 
           onClick={() => setAiOpen(!aiOpen)}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center relative hover:bg-white/[0.08] transition-all"
           style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
        >
           <span className="absolute w-2 h-2 rounded-full bg-violet-400 top-2.5 right-2.5 animate-pulse" />
           <Bot className="w-5 h-5 text-slate-300" />
        </motion.button>
      </div>

    </div>
  );
}
