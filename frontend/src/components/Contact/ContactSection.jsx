import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield } from 'lucide-react'
import useStore from '../../store/useStore'
import toast from 'react-hot-toast'

export default function ContactSection({ isStandalonePage = false }) {
  const { theme } = useStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: 'Government Partnership',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      const ticketId = `NPIG-${Math.floor(100000 + Math.random() * 900000)}`
      setSubmittedTicket({
        id: ticketId,
        name: formData.name,
        email: formData.email,
        org: formData.organization,
        time: new Date().toLocaleString(),
      })
      setSubmitting(false)
      toast.success(`Inquiry registered successfully! Reference: ${ticketId}`)
      setFormData({
        name: '',
        email: '',
        organization: '',
        inquiryType: 'Government Partnership',
        message: '',
      })
    }, 1000)
  }

  return (
    <section className={`relative ${isStandalonePage ? 'py-12' : 'py-24 sm:py-32'} px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* ── Left Column: Contact Details matching Panel 6 ── */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500 mb-3">
                Official Agency Communication
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                We'd love to hear from you. Reach out to our sovereign intelligence deployment and technical governance team.
              </p>
            </div>

            {/* Contact Items */}
            <div className="space-y-6">
              
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email</p>
                  <a href="mailto:info@npig.gov.in" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-500 transition-colors">
                    info@npig.gov.in
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Phone</p>
                  <a href="tel:+911234567890" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-500 transition-colors">
                    +91 1234 567 890
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Address</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    NPIG Secretariat, New Delhi, India
                  </p>
                </div>
              </div>

            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Follow Us</p>
              <div className="flex items-center gap-3">
                
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500/40 transition-all bg-white dark:bg-[#0B1020] border-slate-200 dark:border-white/10"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.63 1.63 0 1 0 0-3.26 1.63 1.63 0 0 0 0 3.26m1.4 9.74V9.93H5.06v8.57h2.8z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500/40 transition-all bg-white dark:bg-[#0B1020] border-slate-200 dark:border-white/10"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500/40 transition-all bg-white dark:bg-[#0B1020] border-slate-200 dark:border-white/10"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl border flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500/40 transition-all bg-white dark:bg-[#0B1020] border-slate-200 dark:border-white/10"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

              </div>
            </div>

          </div>

          {/* ── Right Column: Enterprise Contact Form ── */}
          <div className="lg:col-span-7">
            <div
              className="p-6 sm:p-10 rounded-3xl border transition-all duration-300"
              style={{
                backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
                borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
                boxShadow: theme === 'light' ? '0 10px 30px rgba(0,0,0,0.04)' : '0 16px 48px rgba(0,0,0,0.4)',
              }}
            >
              <AnimatePresence mode="wait">
                {submittedTicket ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Transmission Confirmed
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                      Your inquiry has been encrypted and assigned to the sovereign onboarding office.
                    </p>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono max-w-sm mx-auto space-y-1 text-slate-300">
                      <div>Ticket ID: <span className="text-indigo-400 font-bold">{submittedTicket.id}</span></div>
                      <div>Sender: {submittedTicket.name} ({submittedTicket.org || 'Official'})</div>
                      <div>Logged: {submittedTicket.time}</div>
                    </div>
                    <button
                      onClick={() => setSubmittedTicket(null)}
                      className="btn-secondary !px-6 !py-2.5 !rounded-xl !text-xs"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="npig-input"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. anand.kumar@nic.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="npig-input"
                      />
                    </div>

                    {/* Organization */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Organization / Agency
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ministry of Road Transport / Smart Cities Mission"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="npig-input"
                      />
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="npig-input cursor-pointer"
                      >
                        <option value="Government Partnership">Government Partnership & Governance</option>
                        <option value="Enterprise Solution">Enterprise Telemetry & Critical Infrastructure</option>
                        <option value="Research Collaboration">Academic & Research Collaboration</option>
                        <option value="Technical Support">Technical Support & API Integration</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Your Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe your predictive grid requirements, data feeds, or agency scale..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="npig-input resize-none"
                      />
                    </div>

                    {/* CTA Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary !py-3.5 !rounded-xl !text-sm !font-bold flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>Encrypting & Transmitting...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send Message
                        </>
                      )}
                    </button>

                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
