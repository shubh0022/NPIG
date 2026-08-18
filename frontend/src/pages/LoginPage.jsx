import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Key, 
  RefreshCw,
  UserCheck,
  Building,
  Sparkles
} from 'lucide-react'
import useStore from '../store/useStore'
import NpigLogo from '../components/Brand/NpigLogo'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { theme, setUser, setToken, isAuthenticated } = useStore()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'forgot' | 'otp'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
    if (searchParams.get('mode') === 'demo') {
      handleDemoLogin('ADMIN')
    }
  }, [isAuthenticated, searchParams])

  const handleSignIn = (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setUser({
        name: 'Anand Kumar',
        email: email,
        role: 'ADMIN',
        organization: 'Ministry of Home Affairs',
        agency: 'NPIG Secretariat',
        mfaEnabled: true,
      })
      setToken('npig_jwt_secure_session_token_' + Date.now())
      setLoading(false)
      toast.success('Authenticated securely. Welcome to NPIG Command Center!')
      navigate('/dashboard')
    }, 900)
  }

  const handleDemoLogin = (role = 'ADMIN') => {
    setLoading(true)
    setTimeout(() => {
      const persona = role === 'ADMIN' 
        ? { name: 'Anand Kumar', role: 'ADMIN', email: 'anand.kumar@npig.gov.in', organization: 'NPIG Command' }
        : role === 'ANALYST'
        ? { name: 'Dr. Priya Sharma', role: 'ANALYST', email: 'priya.s@isro.gov.in', organization: 'ISRO Geospatial Cell' }
        : { name: 'Inspector R. Verma', role: 'OFFICER', email: 'r.verma@delhipolice.gov.in', organization: 'Delhi Police Telemetry' }

      setUser({
        ...persona,
        agency: 'NPIG Sovereign Grid',
        mfaEnabled: true,
      })
      setToken('demo_token_' + Date.now())
      setLoading(false)
      toast.success(`Logged in as ${persona.name} (${persona.role})`)
      navigate('/dashboard')
    }, 600)
  }

  const handleSSO = (provider) => {
    setLoading(true)
    setTimeout(() => {
      setUser({
        name: provider === 'Google' ? 'Sovereign Officer (Google SSO)' : 'National Administrator (Microsoft SSO)',
        email: `official@${provider.toLowerCase()}.sso.npig.gov.in`,
        role: 'ADMIN',
        organization: 'National Intelligence Grid',
        mfaEnabled: true,
      })
      setToken('sso_token_' + Date.now())
      setLoading(false)
      toast.success(`Signed in via ${provider} Sovereign SSO`)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between ${theme === 'light' ? 'bg-[#F8FAFC]' : 'bg-[#05070D]'}`}>
      
      {/* ── Top Bar with NPIG Logo ── */}
      <div className="p-6 sm:p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-3 focus:outline-none">
          <NpigLogo height={28} theme={theme} showTagline={true} />
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-500 hover:text-indigo-500 transition-colors"
        >
          ← Return to Home
        </Link>
      </div>

      {/* ── Center Authentication Card matching Panel 8 ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 sm:p-10 rounded-3xl border shadow-2xl transition-all"
          style={{
            backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
            borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
            boxShadow: theme === 'light' ? '0 10px 40px rgba(0,0,0,0.06)' : '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header matching Panel 8 */}
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {mode === 'signin' && 'Welcome Back!'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'otp' && 'Two-Factor Verification'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1.5">
              {mode === 'signin' && 'Sign in to continue to NPIG Platform'}
              {mode === 'signup' && 'Register official credentials for grid access'}
              {mode === 'forgot' && 'Enter your verified work email to receive recovery instructions'}
              {mode === 'otp' && 'Enter the 6-digit cryptographic token sent to your device'}
            </p>
          </div>

          {/* Form matching Panel 8 */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="npig-input !py-3 !rounded-xl text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-indigo-500 hover:text-indigo-400 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="npig-input !py-3 !rounded-xl !pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Sign In Button matching Panel 8 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary !py-3.5 !rounded-xl !text-sm !font-bold mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              {/* Divider matching Panel 8 */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-white/10" />
                </div>
                <span className="relative px-3 text-xs text-slate-400 bg-white dark:bg-[#0B1020] uppercase font-semibold tracking-wider">
                  or continue with
                </span>
              </div>

              {/* SSO Buttons (Google & Microsoft) matching Panel 8 */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Google SSO */}
                <button
                  type="button"
                  onClick={() => handleSSO('Google')}
                  className={`flex items-center justify-center gap-2.5 py-3 rounded-xl border text-xs font-semibold transition-all ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                {/* Microsoft SSO */}
                <button
                  type="button"
                  onClick={() => handleSSO('Microsoft')}
                  className={`flex items-center justify-center gap-2.5 py-3 rounded-xl border text-xs font-semibold transition-all ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span>Microsoft</span>
                </button>

              </div>

              {/* Bottom Sign up link matching Panel 8 */}
              <div className="text-center pt-4">
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-indigo-500 font-bold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              {/* Quick Persona Demo Selector */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center mb-2">
                  Instant Demo Persona Launch:
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('ADMIN')}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-400 hover:bg-indigo-500/20"
                  >
                    Administrator
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('ANALYST')}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[10px] font-semibold text-sky-400 hover:bg-sky-500/20"
                  >
                    Analyst
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('OFFICER')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400 hover:bg-emerald-500/20"
                  >
                    Officer
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* Registration Mode */}
          {mode === 'signup' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Official Name</label>
                <input type="text" placeholder="Full name" className="npig-input !py-3 !rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Work Email (gov / nic.in)</label>
                <input type="email" placeholder="official@agency.gov.in" className="npig-input !py-3 !rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Agency / Department</label>
                <input type="text" placeholder="Department of Telecommunications" className="npig-input !py-3 !rounded-xl text-sm" />
              </div>
              <button
                type="button"
                onClick={() => {
                  toast.success('Registration request submitted for security clearance.')
                  setMode('signin')
                }}
                className="w-full btn-primary !py-3.5 !rounded-xl !text-sm !font-bold"
              >
                Submit Credentials
              </button>
              <p className="text-center text-xs text-slate-500 pt-2">
                Already registered? <button type="button" onClick={() => setMode('signin')} className="text-indigo-500 font-bold">Sign In</button>
              </p>
            </div>
          )}

          {/* Forgot Password Mode */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Registered Email</label>
                <input type="email" placeholder="official@agency.gov.in" className="npig-input !py-3 !rounded-xl text-sm" />
              </div>
              <button
                type="button"
                onClick={() => {
                  toast.success('Password recovery link transmitted.')
                  setMode('signin')
                }}
                className="w-full btn-primary !py-3.5 !rounded-xl !text-sm !font-bold"
              >
                Send Recovery Instructions
              </button>
              <p className="text-center text-xs text-slate-500 pt-2">
                Remember your credentials? <button type="button" onClick={() => setMode('signin')} className="text-indigo-500 font-bold">Sign In</button>
              </p>
            </div>
          )}

        </motion.div>
      </div>

      {/* ── Footer ── */}
      <div className="p-6 text-center text-xs text-slate-500">
        <p>National Predictive Intelligence Grid · Classification: Sovereign Restricted · AES-256 Encrypted</p>
      </div>

    </div>
  )
}
