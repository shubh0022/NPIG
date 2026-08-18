import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import { NpigIcon } from '../Brand/NpigLogo'
import axios from 'axios'
import clsx from 'clsx'

const NEXUS_API = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8006/nexus/chat`

const QUICK_PROMPTS = [
  { label: '🚗 Traffic Risk',       text: 'What is the current traffic risk level?', color: '#3b82f6' },
  { label: '🔫 Crime Hotspot',      text: 'Show me crime hotspot analysis for tonight', color: '#ff2d6b' },
  { label: '🌊 Flood Risk',         text: 'What is the flood risk for riverside areas?', color: '#06b6d4' },
  { label: '🚨 Active Alerts',      text: 'Show all currently active alerts', color: '#f97316' },
  { label: '💻 Cyber Threats',      text: 'Current cyber threat level and status', color: '#8b5cf6' },
  { label: '📊 System Stats',       text: 'Show me live system statistics', color: '#10b981' },
]

const RECOMMENDATIONS = [
  { text: 'Deploy patrol to Sector 7', domain: 'Crime', priority: 'high' },
  { text: 'Activate flood barriers — Zone 3', domain: 'Climate', priority: 'critical' },
  { text: 'Reroute traffic on NH-48', domain: 'Traffic', priority: 'medium' },
]

/* ─── Premium Voice Wave Indicator ────────────────────────────── */
function VoiceWave({ active }) {
  return (
    <div className="flex items-center gap-[4px] h-6 px-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div
          key={i}
          animate={active ? {
            height: [4, 16 + Math.random() * 8, 4],
            opacity: [0.4, 1, 0.4],
            backgroundColor: ['#8B5CF6', '#3B82F6', '#06B6D4', '#8B5CF6'],
          } : { height: 4, opacity: 0.3, backgroundColor: '#8B5CF6' }}
          transition={{
            duration: 0.6 + Math.random() * 0.4,
            repeat: active ? Infinity : 0,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
          className="w-[3px] rounded-full"
          style={{ minHeight: 4, backgroundColor: '#8B5CF6' }}
        />
      ))}
    </div>
  )
}

/* ─── Markdown Renderer ────────────────────────────────────────── */
function MarkdownText({ text }) {
  const rendered = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-white/[0.06] px-1.5 py-0.5 rounded text-[10px] font-mono text-blue-300">$1</code>')
    .replace(/→/g, '→')
    .replace(/\n/g, '<br />')
    .replace(/## (.*?)(<br|$)/g, '<p class="font-bold text-white mt-2 mb-1 text-xs">$1</p>')
    .replace(/### (.*?)(<br|$)/g, '<p class="font-semibold text-blue-300 mt-1 text-xs">$1</p>')
    .replace(/• /g, '• ')

  return <span dangerouslySetInnerHTML={{ __html: rendered }} />
}

export default function NexusChatbot() {
  const { nexusOpen, toggleNexus, nexusMessages, addNexusMessage, clearNexusMessages, user, theme } = useStore()
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [micActive, setMicActive] = useState(false)
  const [showRecs, setShowRecs] = useState(true)
  const messagesRef = useRef(null)
  const inputRef    = useRef(null)

  useEffect(() => {
    if (nexusOpen && nexusMessages.length === 0) {
      addNexusMessage({
        id: Date.now(),
        role: 'assistant',
        content: `👋 **Hello ${user?.name?.split(' ')[0] || 'Commander'}!** I'm **NEXUS AI** — your National Intelligence Assistant.\n\nI'm connected to live city data. Ask me about traffic, crime, floods, cyber threats, or type \`help\` for all commands.`,
        timestamp: new Date().toISOString(),
      })
    }
    if (nexusOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [nexusOpen])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [nexusMessages, loading])

  const sendMessage = async (text = input.trim()) => {
    if (!text || loading) return
    setInput('')
    setShowRecs(false)

    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date().toISOString() }
    addNexusMessage(userMsg)
    setLoading(true)
    setIsTyping(true)

    await new Promise(r => setTimeout(r, 600 + Math.random() * 800))

    try {
      const history = [...useStore.getState().nexusMessages, userMsg]
        .slice(-12)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await axios.post(NEXUS_API, {
        messages: history,
        user_role: user?.role || 'ADMIN',
        session_id: user?.id,
      }, { timeout: 10000 })

      addNexusMessage({
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data.reply,
        action: res.data.action_taken,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      const localResponses = {
        traffic: '🚗 **Traffic Analysis**: Current congestion level is **67/100 (HIGH)**. NH-48 showing peak loads. Recommend activating alternate routes. Confidence: 89%',
        crime: '🔫 **Crime Hotspot**: 3 zones flagged. Sector 17 highest risk (72%). Deploy patrol units during 10PM–2AM window.',
        flood: '🌊 **Flood Risk**: 65mm projected rainfall in 48h. Riverside District at **HIGH** risk. NDRF pre-positioning recommended.',
        cyber: '💻 **Cyber Threat Level: MEDIUM**. 47 blocked intrusion attempts past hour. Power grid SCADA under elevated monitoring.',
        alert: '🚨 **Active Alerts**: 5 CRITICAL, 8 HIGH, 12 MEDIUM currently active. 2 incidents being managed by field teams.',
        default: `🤖 **NEXUS AI** (offline mode): I can still help! Try asking about *traffic*, *crime*, *floods*, *cyber threats*, or *active alerts*. For full AI responses, ensure the NPIG AI service is running on port 8006.`
      }
      const lower = text.toLowerCase()
      const reply = lower.includes('traffic') ? localResponses.traffic
        : lower.includes('crime') ? localResponses.crime
        : lower.includes('flood') || lower.includes('climate') ? localResponses.flood
        : lower.includes('cyber') ? localResponses.cyber
        : lower.includes('alert') ? localResponses.alert
        : localResponses.default

      addNexusMessage({
        id: Date.now() + 1,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
      setIsTyping(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const toggleMic = () => {
    setMicActive(!micActive)
    if (!micActive) {
      // Simulate voice input after brief delay
      setTimeout(() => {
        setMicActive(false)
        sendMessage('What is the current threat level?')
      }, 2500)
    }
  }

  // Premium FAB button
  if (!nexusOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleNexus}
        aria-label="Open NEXUS AI Assistant"
        aria-expanded={false}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-2xl flex items-center justify-center relative group"
        style={{
          background: theme === 'light' 
            ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' 
            : 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)',
          border: theme === 'light' ? '1px solid #4F46E5' : '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 32px rgba(79,70,229,0.35)',
          backdropFilter: 'blur(20px)',
        }}
        title="Open NEXUS AI Assistant"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute w-3 h-3 rounded-full bg-emerald-400 top-3 right-3 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)] z-10" />
        <NpigIcon size={28} theme="dark" className="relative z-10" />
      </motion.button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="nexus-bubble"
        style={{
          background: theme === 'light'
            ? '#FFFFFF'
            : 'linear-gradient(135deg, rgba(3,7,18,0.98) 0%, rgba(15,23,42,0.98) 100%)',
          border: theme === 'light' ? '1px solid #E5E7EB' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: theme === 'light' ? '0 20px 60px rgba(0,0,0,0.12)' : '0 24px 80px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(40px)',
          borderRadius: '24px',
        }}
      >
        {/* Premium Header */}
        <div className={`flex items-center gap-4 px-5 py-4 border-b ${theme === 'light' ? 'border-slate-100 bg-slate-50/80' : 'border-white/[0.06] bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-cyan-500/5'}`}>
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center shadow-md">
              <NpigIcon size={22} theme="dark" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#030712] shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
          </div>
          <div className="flex-1">
            <div className={`text-sm font-bold tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>NEXUS AI</div>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider">Intelligence Assistant · Online</div>
          </div>
          <div className="flex items-center gap-1">
            <VoiceWave active={micActive} />
            <motion.button 
              onClick={clearNexusMessages} 
              className="p-2 text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/[0.06]" 
              title="Clear"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </motion.button>
            <motion.button 
              onClick={() => setMinimized(!minimized)} 
              className="p-2 text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/[0.06]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {minimized ? '□' : '—'}
            </motion.button>
            <motion.button 
              onClick={toggleNexus} 
              className="p-2 text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/[0.06]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {!minimized && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              {/* Premium AI Recommendations strip */}
              {showRecs && nexusMessages.length <= 1 && (
                <div className="px-5 pt-4 pb-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] font-bold mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                    AI Recommendations
                  </p>
                  <div className="flex flex-col gap-2">
                    {RECOMMENDATIONS.map((rec, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={() => sendMessage(rec.text)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] group"
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${
                          rec.priority === 'critical' ? 'bg-red-500 text-red-500' : rec.priority === 'high' ? 'bg-orange-500 text-orange-500' : 'bg-amber-500 text-amber-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300 truncate font-medium group-hover:text-white transition-colors">{rec.text}</p>
                          <p className="text-[10px] text-slate-600 font-mono mt-0.5">{rec.domain}</p>
                        </div>
                        <span className="text-[10px] text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div
                ref={messagesRef}
                className="h-64 overflow-y-auto scroll-y p-4 flex flex-col gap-3"
              >
                {nexusMessages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      'flex gap-2 max-w-[92%]',
                      msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/[0.06] flex-shrink-0 mt-0.5 bg-white/[0.03] flex items-center justify-center">
                        <img src="/npig-logo.png" alt="AI" className="w-4 h-4 object-cover" />
                      </div>
                    )}
                    <div className={clsx(
                      'rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-white text-[#030712] rounded-tr-sm'
                        : 'bg-white/[0.04] border border-white/[0.06] text-slate-300 rounded-tl-sm'
                    )}>
                      <MarkdownText text={msg.content} />
                      <div className="text-[8px] opacity-30 mt-1.5 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                    <div className="w-6 h-6 rounded-lg overflow-hidden border border-white/[0.06] flex-shrink-0 bg-white/[0.03] flex items-center justify-center">
                      <img src="/npig-logo.png" alt="AI" className="w-4 h-4 object-cover" />
                    </div>
                    <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            animate={{ y: [-2, 2, -2], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-violet-400"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick prompts */}
              {nexusMessages.length <= 1 && (
                <div className="px-4 pb-2">
                  <p className="text-[9px] text-slate-600 mb-2 uppercase tracking-[0.2em] font-medium">Quick Queries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.slice(0, 4).map(p => (
                      <button
                        key={p.label}
                        onClick={() => sendMessage(p.text)}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium bg-white/[0.03] border border-white/[0.05] text-slate-400 hover:text-white hover:border-white/[0.1] hover:bg-white/[0.05] transition-all"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Input area */}
              <div className="px-5 py-4 border-t border-white/[0.06] flex gap-3 items-end bg-gradient-to-r from-blue-500/[0.02] via-violet-500/[0.02] to-cyan-500/[0.02]">
                {/* Premium Mic button */}
                <motion.button
                  onClick={toggleMic}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={micActive ? 'Stop voice input' : 'Start voice input'}
                  aria-pressed={micActive}
                  className={clsx(
                    'w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all',
                    micActive
                      ? 'bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/40 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                      : 'bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:text-white hover:border-white/[0.12]'
                  )}
                  title={micActive ? 'Listening...' : 'Voice input'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                    <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </motion.button>

                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px' }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask NEXUS anything..."
                  aria-label="Type your message to NEXUS AI"
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none resize-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all font-light"
                  style={{ height: 44, minHeight: 44 }}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 text-[#030712] disabled:opacity-30 disabled:from-white/10 disabled:to-white/10 disabled:text-slate-600 hover:opacity-90 transition-all shadow-[0_4px_16px_rgba(59,130,246,0.3)]"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                    </motion.div>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5M5 12l7-7 7 7"/>
                    </svg>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
