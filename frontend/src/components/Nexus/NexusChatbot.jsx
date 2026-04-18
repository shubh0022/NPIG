import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import axios from 'axios'
import clsx from 'clsx'

const NEXUS_API = `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8006/nexus/chat`

const QUICK_PROMPTS = [
  { label: '🚗 Traffic risk',       text: 'What is the current traffic risk level?' },
  { label: '🔫 Crime hotspot',      text: 'Show me crime hotspot analysis for tonight' },
  { label: '🌊 Flood risk',         text: 'What is the flood risk for riverside areas?' },
  { label: '🚨 Active alerts',      text: 'Show all currently active alerts' },
  { label: '💻 Cyber threats',      text: 'Current cyber threat level and status' },
  { label: '📊 System stats',       text: 'Show me live system statistics' },
]

function MarkdownText({ text }) {
  // Basic markdown rendering
  const rendered = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded text-xs">$1</code>')
    .replace(/→/g, '→')
    .replace(/\n/g, '<br />')
    .replace(/## (.*?)(<br|$)/g, '<p class="font-bold text-white mt-2 mb-1">$1</p>')
    .replace(/### (.*?)(<br|$)/g, '<p class="font-semibold text-brand-300 mt-1">$1</p>')
    .replace(/• /g, '• ')

  return <span dangerouslySetInnerHTML={{ __html: rendered }} />
}

export default function NexusChatbot() {
  const { nexusOpen, toggleNexus, nexusMessages, addNexusMessage, clearNexusMessages, user } = useStore()
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const messagesRef = useRef(null)
  const inputRef    = useRef(null)

  useEffect(() => {
    if (nexusOpen && nexusMessages.length === 0) {
      addNexusMessage({
        id: Date.now(),
        role: 'assistant',
        content: `👋 **Hello ${user?.full_name?.split(' ')[0] || 'Officer'}!** I'm **NPIG AI** — your National Intelligence Assistant.\n\nI'm connected to live city data. Ask me about traffic, crime, floods, cyber threats, or type \`help\` for all commands.`,
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

    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date().toISOString() }
    addNexusMessage(userMsg)
    setLoading(true)
    setIsTyping(true)

    // Simulate typing delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800))

    try {
      const history = [...useStore.getState().nexusMessages, userMsg]
        .slice(-12)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await axios.post(NEXUS_API, {
        messages: history,
        user_role: user?.role || 'VIEWER',
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
      // Fallback local responses
      const localResponses = {
        traffic: '🚗 **Traffic Analysis**: Current congestion level is **67/100 (HIGH)**. NH-48 showing peak loads. Recommend activating alternate routes. Confidence: 89%',
        crime: '🔫 **Crime Hotspot**: 3 zones flagged. Sector 17 highest risk (72%). Deploy patrol units during 10PM–2AM window.',
        flood: '🌊 **Flood Risk**: 65mm projected rainfall in 48h. Riverside District at **HIGH** risk. NDRF pre-positioning recommended.',
        cyber: '💻 **Cyber Threat Level: MEDIUM**. 47 blocked intrusion attempts past hour. Power grid SCADA under elevated monitoring.',
        alert: '🚨 **Active Alerts**: 5 CRITICAL, 8 HIGH, 12 MEDIUM currently active. 2 incidents being managed by field teams.',
        default: `🤖 **NPIG AI** (offline mode): I can still help! Try asking about *traffic*, *crime*, *floods*, *cyber threats*, or *active alerts*. For full AI responses, ensure the NPIG AI service is running on port 8006.`
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

  // FAB button
  if (!nexusOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleNexus}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-[0_8px_32px_rgba(37,99,235,0.5)] flex items-center justify-center border border-brand-400/30 overflow-hidden bg-[#0a1628]"
        title="Open NPIG AI Assistant"
      >
        <img src="/npig-logo.png" alt="NPIG AI" className="w-12 h-12 object-cover" />
      </motion.button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="nexus-bubble"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.08] bg-gradient-to-r from-brand-900/50 to-indigo-900/50">
          <div className="relative">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-brand-400/30">
              <img src="/npig-logo.png" alt="NPIG AI" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-void" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">NPIG AI</div>
            <div className="text-[10px] text-slate-400">National Intelligence Assistant · Online</div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={clearNexusMessages} className="btn-ghost px-2 py-1 text-xs" title="Clear chat">🗑️</button>
            <button onClick={() => setMinimized(!minimized)} className="btn-ghost px-2 py-1 text-xs">{minimized ? '□' : '▭'}</button>
            <button onClick={toggleNexus} className="btn-ghost px-2 py-1 text-xs">✕</button>
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
              {/* Messages */}
              <div
                ref={messagesRef}
                className="h-72 overflow-y-auto scroll-y p-4 flex flex-col gap-3"
              >
                {nexusMessages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      'flex gap-2.5 max-w-[94%]',
                      msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-brand-400/20 flex-shrink-0 mt-0.5">
                        <img src="/npig-logo.png" alt="NPIG AI" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={clsx(
                      'rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-white/[0.06] border border-white/[0.08] text-slate-200 rounded-tl-none'
                    )}>
                      <MarkdownText text={msg.content} />
                      <div className="text-[9px] opacity-40 mt-1 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-brand-400/20 flex-shrink-0">
                      <img src="/npig-logo.png" alt="NPIG AI" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex gap-1.5 items-center">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-waveform"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quick prompts */}
              {nexusMessages.length <= 1 && (
                <div className="px-4 pb-2">
                  <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider">Quick Queries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.slice(0, 4).map(p => (
                      <button
                        key={p.label}
                        onClick={() => sendMessage(p.text)}
                        className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:border-brand-500/40 hover:text-brand-300 transition-all"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/[0.06] flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px' }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask NPIG AI anything..."
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none resize-none focus:border-brand-500/50"
                  style={{ height: 36, minHeight: 36 }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="btn-primary px-3 py-2 text-xs flex-shrink-0 disabled:opacity-40"
                >
                  {loading ? '⏳' : '→'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
