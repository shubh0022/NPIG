import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Sparkles, Bot, User, Download, RefreshCw, BarChart2, ShieldAlert, CheckCircle2 } from 'lucide-react'
import useStore from '../../store/useStore'
import { NpigIcon } from '../Brand/NpigLogo'
import toast from 'react-hot-toast'

export default function NexusAssistantSection({ isStandalonePage = false }) {
  const { theme } = useStore()
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'nexus',
      text: 'Greetings. I am NEXUS, the National Predictive Intelligence Grid AI Assistant. I can analyze real-time alerts, project traffic bottlenecks, evaluate climate anomalies, or synthesize cross-agency executive briefs.',
      timestamp: 'Just now',
    },
  ])

  const chatEndRef = useRef(null)

  const quickPrompts = [
    "Summarize today's alerts",
    'Predict traffic tomorrow',
    'Generate report',
    'Compare this week\'s incidents',
  ]

  const handleSend = (queryText) => {
    const textToSend = queryText || input
    if (!textToSend.trim()) return

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)

    setTimeout(() => {
      let reply = ''
      let extra = null

      const q = textToSend.toLowerCase()
      if (q.includes('alert') || q.includes('summarize')) {
        reply = 'Summary of Current National Alert Status:\n• 8,320 total data points processed in the last 24h\n• 3 Critical active events (Zone 7 flood surge, NH48 bottleneck, Substation 4 load anomaly)\n• Overall grid risk index: 24.8% (MODERATE/STABLE).'
        extra = { type: 'metrics', items: [{ l: 'Critical', v: '3' }, { l: 'High', v: '18' }, { l: 'Normal', v: '8,299' }] }
      } else if (q.includes('traffic')) {
        reply = 'Predictive Traffic Outlook (Next 24 Hours):\n• NH48 Bengaluru corridor: 84% probability of 45-minute congestion delay between 17:30 - 20:00.\n• Delhi-Gurugram Expressway: Optimal flow predicted.\n• Recommendation: Re-route freight transit via Western Peripheral Expressway.'
      } else if (q.includes('report') || q.includes('generate')) {
        reply = 'Generated Executive Brief #NPIG-EX-8821.\n• Synthesizing 350+ data sources across 12 smart city zones.\n• Prediction confidence score: 98.6%.\n• Click below to download the official briefing package.'
        extra = { type: 'download', title: 'Executive_Intelligence_Brief_2026.pdf' }
      } else {
        reply = `Analysis for "${textToSend}": Cross-referenced across active municipal feeds and satellite telemetry. Grid parameters remain within nominal threshold. No sovereign anomalies detected.`
      }

      const botMsg = {
        id: `nexus-${Date.now()}`,
        sender: 'nexus',
        text: reply,
        extra,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
      setThinking(false)
    }, 1200)
  }

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true)
      toast('Listening to speech input...', { icon: '🎙️' })
      setTimeout(() => {
        setInput('Summarize today\'s highest-risk alerts')
        setIsListening(false)
        toast.success('Voice transcription captured')
      }, 2500)
    } else {
      setIsListening(false)
    }
  }

  return (
    <section className={`relative ${isStandalonePage ? 'py-12' : 'py-24 sm:py-32'} px-4 sm:px-6 lg:px-8 overflow-hidden`}>
      
      {/* Background Subtle Gradient Orb */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, #6366F1 0%, #38BDF8 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* ── Header matching Panel 7 ── */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500 mb-3">
            Conversational Neural Core
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
            Your AI Intelligence Assistant
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-light">
            Ask anything. Get intelligent answers.
          </p>
        </div>

        {/* ── Central Neural Orb Visual matching Panel 7 ── */}
        <div className="flex items-center justify-center my-8">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
            {/* Outer Pulsing Ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-500 to-sky-400 blur-xl"
            />
            {/* Inner Neural Sphere */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 shadow-2xl flex items-center justify-center"
              style={{
                background: 'conic-gradient(from 0deg, #4F46E5, #38BDF8, #818CF8, #4F46E5)',
                boxShadow: '0 0 40px rgba(99,102,241,0.5)',
              }}
            >
              <div className="w-full h-full rounded-full bg-[#05070D] flex items-center justify-center relative overflow-hidden">
                {/* Fluid animated ripples inside */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500/40 via-violet-600/30 to-sky-400/20 backdrop-blur-sm animate-pulse" />
                <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-300 relative z-10" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Chat Container ── */}
        <div
          className="rounded-3xl border shadow-2xl overflow-hidden p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300"
          style={{
            backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(11, 16, 32, 0.85)',
            borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.1)',
            boxShadow: theme === 'light' ? '0 12px 36px rgba(0,0,0,0.06)' : '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          {/* Conversation Stream */}
          <div className="max-h-72 sm:max-h-80 overflow-y-auto space-y-4 pr-2 mb-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'nexus' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-md">
                    <NpigIcon size={16} theme="dark" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : theme === 'light'
                        ? 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-none'
                        : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-light">{msg.text}</p>
                  
                  {/* Extra interactive blocks */}
                  {msg.extra?.type === 'metrics' && (
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
                      {msg.extra.items.map((it) => (
                        <div key={it.l} className="p-2 rounded-lg bg-black/20 text-center">
                          <div className="text-sm font-bold text-indigo-400">{it.v}</div>
                          <div className="text-[9px] text-slate-400">{it.l}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.extra?.type === 'download' && (
                    <button
                      onClick={() => toast.success('Executive intelligence PDF briefing downloaded.')}
                      className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/50 text-[11px] font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Briefing ({msg.extra.title})
                    </button>
                  )}

                  <span className="block text-[9px] text-slate-400 mt-2 text-right opacity-70">
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {thinking && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>Synthesizing cross-domain models...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ── Input Bar matching Panel 7 ── */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="relative flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ask NEXUS anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="npig-input !pr-20 !py-3.5 !rounded-2xl !text-sm"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2 rounded-xl transition-all ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-indigo-400 hover:bg-white/5'
                  }`}
                  title="Speech Input"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-md shadow-indigo-600/30"
                  title="Transmit"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* ── Quick Action Pills matching Panel 7 ── */}
          <div className="flex items-center flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Suggestions:
            </span>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all duration-200 ${
                  theme === 'light'
                    ? 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                    : 'bg-white/5 text-slate-300 hover:bg-indigo-500/15 hover:text-indigo-300 border border-white/10'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
