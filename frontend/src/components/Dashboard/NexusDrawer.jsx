import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Mic, Sparkles, MessageSquare, Bot, ArrowRight, Download, RefreshCw } from 'lucide-react'
import useStore from '../../store/useStore'
import { NpigIcon } from '../Brand/NpigLogo'
import toast from 'react-hot-toast'

export default function NexusDrawer({ isOpen, onClose }) {
  const { theme } = useStore()
  const isLight = theme === 'light'
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'msg-0',
      sender: 'nexus',
      text: 'NEXUS Sovereign AI online. Connected to National Grid telemetry feeds, satellite radar, and predictive scenario models.',
      time: 'Just now',
    },
  ])

  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const quickPrompts = [
    "Summarize today's alerts",
    'Show high-risk regions',
    "Generate today's report",
    'Explain this prediction',
  ]

  const handleSend = (text) => {
    const query = text || input
    if (!query.trim()) return

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    setTimeout(() => {
      let reply = ''
      const q = query.toLowerCase()

      if (q.includes('alert') || q.includes('summarize')) {
        reply = 'Summary of Current Grid Alerts:\n• Total Events Processed: 8,320\n• Active Critical Events: 3 (Mumbai Zone 7 Flood Surge, NH48 Congestion, Northern Grid Substation Relay)\n• Threat Severity Index: Moderate / Stable.'
      } else if (q.includes('region') || q.includes('high-risk') || q.includes('risk')) {
        reply = 'High-Risk Regions Identified:\n1. Mumbai Coastal Sector 7 — Flood probability 92% (High Tide peak at 18:45)\n2. Delhi-NCR NH48 Arterial — Bottleneck delay 45 mins\n3. Kerala Coastal Strip — Precipitation 78% above baseline.'
      } else if (q.includes('report') || q.includes('generate')) {
        reply = 'Generated Executive Brief #NPIG-EB-2025:\n• Cross-referenced 350+ data sources and 120 connected agencies.\n• Prediction accuracy confidence: 98.6%.\n• Ready for PDF / CSV download in Report Center.'
      } else if (q.includes('prediction') || q.includes('explain')) {
        reply = 'Prediction Model Rationale:\n• Model: HydroDynamic-STGCN v3.2\n• Input Telemetry: Ultrasonic drainage rise (4.2 cm/min) + Doppler precipitation radar.\n• Confidence: 96.4% probability.'
      } else {
        reply = `Cross-referencing query "${query}" across SCADA sensors and satellite telemetry. Grid parameters remain nominal.`
      }

      const botMsg = {
        id: `n-${Date.now()}`,
        sender: 'nexus',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
      setIsThinking(false)
    }, 900)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Right Sliding Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-md shadow-2xl flex flex-col border-l transition-colors duration-200 ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B1020] border-[#1E2436] text-white'
            }`}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-md">
                  <NpigIcon size={20} theme="dark" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">NEXUS AI</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Your Intelligence Assistant</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 bg-white/[0.02] border-b border-white/5 flex gap-1.5 overflow-x-auto">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 whitespace-nowrap transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'nexus' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <NpigIcon size={14} theme="dark" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#5B4DFF] text-white rounded-tr-none'
                        : isLight
                          ? 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-none'
                          : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line font-light">{msg.text}</p>
                    <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-2.5 items-center text-xs text-slate-400">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <NpigIcon size={14} theme="dark" />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                    <span>Analyzing grid telemetry...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask NEXUS anything about predictions, alerts..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-[#5B4DFF] hover:bg-[#4E3FE6] disabled:opacity-50 text-white transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
