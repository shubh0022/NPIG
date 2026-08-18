import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MapPin,
  Calendar,
  UploadCloud,
  Send,
  ChevronDown,
  Tag,
  Users,
  Radio,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import useStore from '../../store/useStore'
import toast from 'react-hot-toast'

export default function GenerateAlertDrawer({ isOpen, onClose, onAlertCreated }) {
  const { theme, addNotification } = useStore()
  const isLight = theme === 'light'

  // Form State matching the Reference Image
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('TRAFFIC')
  const [severity, setSeverity] = useState('High')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('traffic, congestion, highway')
  const [assignee, setAssignee] = useState('Traffic Command Team')
  const [alertType, setAlertType] = useState('Real-time')
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16))
  const [endTime, setEndTime] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const severityOptions = [
    { label: 'High', color: 'bg-red-500/20 text-red-400 border-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.3)]' },
    { label: 'Medium', color: 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]' },
    { label: 'Low', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]' },
    { label: 'Info', color: 'bg-sky-500/20 text-sky-400 border-sky-500/60 shadow-[0_0_8px_rgba(56,189,248,0.3)]' },
  ]

  const categories = [
    { value: 'TRAFFIC', label: 'Traffic Intelligence' },
    { value: 'CLIMATE', label: 'Climate & Disaster' },
    { value: 'CRIME', label: 'Public Safety & Crime' },
    { value: 'CYBER', label: 'Cyber Threat & CNI' },
    { value: 'HEALTH', label: 'Healthcare & Epidemic' },
    { value: 'INFRASTRUCTURE', label: 'Power & Grid Substation' },
  ]

  const assignees = [
    'Traffic Command Team',
    'National Disaster Response Force (NDRF)',
    'Delhi Police Central Dispatch',
    'CERT-In Cyber Operations',
    'ISRO Geospatial Observation Cell',
    'All Connected Agency Responders',
  ]

  const handleFileDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      toast.success(`Attached: ${e.dataTransfer.files[0].name}`)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      toast.success(`Attached: ${e.target.files[0].name}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !location.trim()) {
      toast.error('Please enter Alert Title and Location')
      return
    }

    setSubmitting(true)

    setTimeout(() => {
      const newAlert = {
        alert_id: 'alt-' + Date.now().toString().slice(-4),
        title,
        description: description || `Operational alert dispatched to ${location}`,
        severity: severity.toUpperCase(),
        category,
        location,
        affected_zone: location,
        status: 'ACTIVE',
        confidence: 0.95,
        timestamp: 'Just now',
        alert_type: alertType,
        assignee,
        tags: tags.split(',').map((t) => t.trim()),
      }

      if (onAlertCreated) onAlertCreated(newAlert)
      setSubmitting(false)
      toast.success(`Alert Generated & Dispatched: "${title}"`)
      onClose()
    }, 700)
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Right Sliding Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`fixed inset-y-0 right-0 z-[9999] w-full max-w-lg shadow-2xl flex flex-col border-l transition-colors duration-200 ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080F1A] border-[#1E2436] text-white'
            }`}
          >
            {/* ── Top Header matching Reference ── */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between flex-shrink-0">
              <div>
                <h2 className="font-sans font-bold text-lg text-slate-900 dark:text-white leading-snug">
                  Generate Alert
                </h2>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Create a new alert to notify relevant teams and systems.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Scrollable Form Body ── */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              
              {/* Alert Title * */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Alert Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter alert title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs outline-none transition-all ${
                    isLight
                      ? 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500'
                      : 'bg-[#0F1524] border border-[#1E2436] text-white placeholder-slate-500 focus:border-indigo-500/60'
                  }`}
                />
              </div>

              {/* Category * */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full appearance-none px-3.5 py-2.5 rounded-lg text-xs outline-none cursor-pointer ${
                      isLight
                        ? 'bg-slate-100 border border-slate-200 text-slate-900'
                        : 'bg-[#0F1524] border border-[#1E2436] text-white'
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value} className="bg-[#0B1020] text-white">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Severity * (4 Segmented Options) */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Severity <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {severityOptions.map((opt) => {
                    const isSelected = severity === opt.label
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSeverity(opt.label)}
                        className={`py-2 rounded-lg font-bold text-xs transition-all border ${
                          isSelected
                            ? opt.color
                            : isLight
                              ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                              : 'bg-[#0F1524] border-[#1E2436] text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Location * */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Location <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full pl-3.5 pr-9 py-2.5 rounded-lg text-xs outline-none transition-all ${
                      isLight
                        ? 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500'
                        : 'bg-[#0F1524] border border-[#1E2436] text-white placeholder-slate-500 focus:border-indigo-500/60'
                    }`}
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Description * */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter detailed description of the alert"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs outline-none resize-none transition-all ${
                    isLight
                      ? 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500'
                      : 'bg-[#0F1524] border border-[#1E2436] text-white placeholder-slate-500 focus:border-indigo-500/60'
                  }`}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Tags
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Add tags (e.g., traffic, flood, security)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-xs outline-none ${
                      isLight
                        ? 'bg-slate-100 border border-slate-200 text-slate-900'
                        : 'bg-[#0F1524] border border-[#1E2436] text-white'
                    }`}
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Assign To */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Assign To
                </label>
                <div className="relative">
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className={`w-full appearance-none px-3.5 py-2.5 rounded-lg text-xs outline-none cursor-pointer ${
                      isLight
                        ? 'bg-slate-100 border border-slate-200 text-slate-900'
                        : 'bg-[#0F1524] border border-[#1E2436] text-white'
                    }`}
                  >
                    {assignees.map((a) => (
                      <option key={a} value={a} className="bg-[#0B1020] text-white">
                        {a}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Alert Type (Radio: Real-time vs Predicted) */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Alert Type
                </label>
                <div className="flex items-center gap-6">
                  {['Real-time', 'Predicted'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="alertType"
                        checked={alertType === type}
                        onChange={() => setAlertType(type)}
                        className="text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                      />
                      <span className="text-slate-300 font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Start Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg text-[11px] outline-none ${
                        isLight
                          ? 'bg-slate-100 border border-slate-200 text-slate-900'
                          : 'bg-[#0F1524] border border-[#1E2436] text-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    End Time <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg text-[11px] outline-none ${
                        isLight
                          ? 'bg-slate-100 border border-slate-200 text-slate-900'
                          : 'bg-[#0F1524] border border-[#1E2436] text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Attachments (Optional) Drag & Drop Zone */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Attachments <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className={`border border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                    selectedFile
                      ? 'border-indigo-500/60 bg-indigo-500/5'
                      : isLight
                        ? 'border-slate-300 hover:border-indigo-500 bg-slate-50'
                        : 'border-white/15 hover:border-indigo-500/50 bg-[#0F1524]/60'
                  }`}
                >
                  <input
                    type="file"
                    id="alert-file-input"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="alert-file-input" className="cursor-pointer">
                    <UploadCloud className="w-7 h-7 text-indigo-400 mx-auto mb-2" />
                    {selectedFile ? (
                      <div>
                        <p className="font-bold text-white text-xs">{selectedFile.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB · Attached
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-slate-300 text-xs">
                          Drag & drop files here
                        </p>
                        <p className="text-[11px] text-indigo-400 underline mt-0.5">
                          or click to upload
                        </p>
                        <p className="text-[9px] text-slate-500 mt-1">
                          Max file size: 10MB (PDF, PNG, JPG, CSV)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

            </form>

            {/* ── Footer Action Buttons matching Reference ── */}
            <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between gap-3 bg-black/20 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-[#1E2436] hover:bg-[#283149] border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Generating...' : 'Generate Alert'}</span>
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
