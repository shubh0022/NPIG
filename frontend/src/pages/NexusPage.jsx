import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Send,
  Mic,
  Trash2,
  MapPin,
  FileText,
  HelpCircle,
  ArrowRight,
  Shield,
  Bot,
  RefreshCw,
} from 'lucide-react'
import useStore from '../store/useStore'
import { NpigIcon } from '../components/Brand/NpigLogo'
import toast from 'react-hot-toast'

export default function NexusPage() {
  const { theme } = useStore()
  const isLight = theme === 'light'
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'user',
      text: "Show today's high risk areas",
      time: '10:30 AM',
    },
    {
      id: 'm2',
      sender: 'nexus',
      text: `Here are the high risk areas identified for today:\n1. Mumbai, India – Flood Risk\n2. Delhi, India – Traffic Congestion\n3. Kerala, India – Heavy Rainfall\n4. Assam, India – Flood Risk\n5. Global – Cyber Attack Risk\n\nWould you like me to generate a detailed report?`,
      time: '10:30 AM',
    },
  ])

  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const quickActions = [
    { label: 'Generate detailed report', icon: FileText },
    { label: 'Show in map', icon: MapPin },
    { label: 'Why are these areas high risk?', icon: HelpCircle },
  ]

  const handleSend = (textToSend) => {
    const query = textToSend || input
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

      if (q.includes('report') || q.includes('generate')) {
        reply = 'Generated National Intelligence Executive Brief #EB-2025-0518:\n• Cross-referenced 350+ data sources and 120 connected agencies.\n• Prediction accuracy confidence: 98.6%.\n• Ready for PDF download in Reports section.'
      } else if (q.includes('map') || q.includes('show')) {
        reply = 'Displaying high-risk spatial beacons on Live Intelligence Map: Mumbai Sector 7 (Flood Risk 92%), NH48 Arterial (Congestion 94%), Kerala Coastal (Precipitation 78%).'
      } else if (q.includes('why') || q.includes('risk')) {
        reply = 'Risk Factor Breakdown:\n1. Mumbai: High spring tide (4.8m) coinciding with localized convective rainfall.\n2. Delhi NH48: Heavy freight corridor shockwave combined with construction lane closure.\n3. Kerala: Doppler radar indicates monsoon low-pressure trough.'
      } else {
        reply = `Cross-referencing telemetry for "${query}". Grid telemetry streams are operating normally with 98.6% system confidence.`
      }

      const botMsg = {
        id: `n-${Date.now()}`,
        sender: 'nexus',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
      setIsThinking(false)
    }, 850)
  }

  const handleClear = () => {
    setMessages([])
    toast.success('Chat history cleared')
  }

  return (
    <div
      className="max-w-5xl mx-auto h-[85vh] rounded-2xl border flex flex-col justify-between overflow-hidden shadow-2xl transition-all"
      style={{
        backgroundColor: isLight ? '#FFFFFF' : '#080F1A',
        borderColor: isLight ? '#E2E8F0' : '#1E2436',
      }}
    >
      {/* ── Top Header matching Screen 6 ── */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between flex-shrink-0 bg-black/20">
        <div>
          <h1 className="font-sans font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
            Ask NEXUS AI
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Your AI Intelligence Assistant
          </p>
        </div>

        <button
          onClick={handleClear}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* ── Messages Stream matching Screen 6 ── */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'nexus' && (
              <div className="relative w-8 h-8 rounded-full bg-slate-900 border border-cyan-400/40 flex items-center justify-center shadow-lg flex-shrink-0 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-300 animate-pulse" />
              </div>
            )}

            <div
              className={`p-4 rounded-2xl max-w-[80%] text-xs sm:text-sm leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-[#5B4DFF] text-white rounded-tr-none'
                  : isLight
                    ? 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-none'
                    : 'bg-[#0F1524] text-slate-200 border border-[#1E2436] rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line font-light">{msg.text}</p>
              <span className="text-[10px] opacity-60 block text-right mt-2 font-mono">
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-400/40 flex items-center justify-center shadow-lg flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping" />
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span>NEXUS synthesizing spatial telemetry...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Suggested Action Buttons & Input Box matching Screen 6 ── */}
      <div className="p-4 sm:p-5 border-t border-white/10 bg-black/25 space-y-3 flex-shrink-0">
        
        {/* 3 Quick Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                onClick={() => handleSend(action.label)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-[#0F1524] hover:bg-[#1E2436] border-[#1E2436] text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
                <span>{action.label}</span>
              </button>
            )
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="relative flex items-center"
        >
          <button
            type="button"
            onClick={() => toast('Voice transmission mode activated', { icon: '🎙️' })}
            className="absolute left-3 p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <Mic className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
          </button>

          <input
            type="text"
            placeholder="Ask anything about intelligence..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full pl-11 pr-12 py-3 rounded-xl text-xs sm:text-sm outline-none border transition-all ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500'
                : 'bg-[#0F1524] border-[#1E2436] text-white placeholder-slate-500 focus:border-indigo-500/60'
            }`}
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 rounded-lg bg-[#5B4DFF] hover:bg-[#4E3FE6] disabled:opacity-40 text-white transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  )
}
