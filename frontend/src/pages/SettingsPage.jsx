import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Globe,
  Clock,
  Calendar,
  Sun,
  Moon,
  Layout,
  RefreshCw,
  Save,
  Database,
  Bell,
  Activity,
  User,
  Shield,
  FileText,
  Trash2,
  AlertTriangle,
  ChevronDown,
  Lock,
  Key,
  Sliders,
} from 'lucide-react'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { theme, toggleTheme } = useStore()
  const isLight = theme === 'light'

  const [activeTab, setActiveTab] = useState('General')
  const [language, setLanguage] = useState('English (US)')
  const [timezone, setTimezone] = useState('(GMT+05:30) Asia/Kolkata')
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY')
  const [timeFormat, setTimeFormat] = useState('24-Hour (14:30)')
  const [sidebarMode, setSidebarMode] = useState('Expanded')
  const [refreshInterval, setRefreshInterval] = useState('5 Minutes')

  // System Preferences Toggles
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showHints, setShowHints] = useState(true)
  const [enableAnimations, setEnableAnimations] = useState(true)

  const tabs = [
    'General',
    'Profile',
    'Security',
    'Notifications',
    'Preferences',
    'Integrations',
    'API Keys',
    'Audit Logs',
  ]

  const handleSaveChanges = () => {
    toast.success('Platform and general settings saved successfully!')
  }

  const handleClearCache = () => {
    toast.success('Local browser telemetry cache cleared')
  }

  const handleResetPreferences = () => {
    toast.success('All system preferences reset to default')
  }

  return (
    <div className="space-y-5 pb-8">
      
      {/* ── Top Header matching Screenshot 2 ── */}
      <div>
        <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light mt-0.5">
          Manage your preferences, account settings and system configuration.
        </p>
      </div>

      {/* ── Sub Tabs matching Screenshot 2 ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#5B4DFF] text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Two-Column Main Layout (Left 8 cols, Right 4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ── Left Column: General Settings + System Preferences (8 cols) ── */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Card 1: General Settings */}
          <div
            className="p-5 sm:p-6 rounded-xl border flex flex-col justify-between shadow-sm"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
              borderColor: isLight ? '#E2E8F0' : '#1E2436',
            }}
          >
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white mb-4">
              General Settings
            </h3>

            <div className="space-y-4">
              
              {/* Language */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Language</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose your preferred language for the platform.</p>
                  </div>
                </div>
                <div className="relative min-w-[200px]">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                    <option value="English (UK)">English (UK)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Time Zone */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Time Zone</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Select your current time zone.</p>
                  </div>
                </div>
                <div className="relative min-w-[200px]">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="(GMT+05:30) Asia/Kolkata">(GMT+05:30) Asia/Kolkata</option>
                    <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                    <option value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Date Format */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Date Format</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose how dates are displayed.</p>
                  </div>
                </div>
                <div className="relative min-w-[200px]">
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="DD MMM YYYY">DD MMM YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Time Format */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Time Format</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose how time is displayed.</p>
                  </div>
                </div>
                <div className="relative min-w-[200px]">
                  <select
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="24-Hour (14:30)">24-Hour (14:30)</option>
                    <option value="12-Hour (02:30 PM)">12-Hour (02:30 PM)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Theme Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Theme</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Select light or dark theme.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      theme === 'dark'
                        ? 'bg-[#5B4DFF] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      theme === 'light'
                        ? 'bg-[#5B4DFF] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                </div>
              </div>

              {/* Sidebar Mode */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Layout className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Sidebar Mode</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose your preferred sidebar behavior.</p>
                  </div>
                </div>
                <div className="relative min-w-[200px]">
                  <select
                    value={sidebarMode}
                    onChange={(e) => setSidebarMode(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Expanded">Expanded</option>
                    <option value="Collapsed">Collapsed</option>
                    <option value="Auto">Auto</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Data Refresh Interval */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Data Refresh Interval</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Set how often data is automatically refreshed.</p>
                  </div>
                </div>
                <div className="relative min-w-[200px]">
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="1 Minute">1 Minute</option>
                    <option value="5 Minutes">5 Minutes</option>
                    <option value="15 Minutes">15 Minutes</option>
                    <option value="Real-time (WebSocket)">Real-time (WebSocket)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* Save Changes Button on bottom right matching Screenshot 2 */}
            <div className="flex justify-end pt-4 mt-2 border-t border-slate-100 dark:border-white/5">
              <button
                onClick={handleSaveChanges}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-[#5B4DFF] hover:bg-[#4E3FE6] text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>

          </div>

          {/* Card 2: System Preferences */}
          <div
            className="p-5 sm:p-6 rounded-xl border flex flex-col justify-between shadow-sm"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
              borderColor: isLight ? '#E2E8F0' : '#1E2436',
            }}
          >
            <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white mb-4">
              System Preferences
            </h3>

            <div className="space-y-4">
              
              {/* Auto Data Refresh */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Auto Data Refresh</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Automatically refresh dashboard data.</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    autoRefresh ? 'bg-[#5B4DFF]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      autoRefresh ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show System Hints */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Show System Hints</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Display helpful hints and tips in the platform.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    showHints ? 'bg-[#5B4DFF]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      showHints ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Enable Animations */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">Enable Animations</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Enable interface animations and transitions.</p>
                  </div>
                </div>
                <button
                  onClick={() => setEnableAnimations(!enableAnimations)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    enableAnimations ? 'bg-[#5B4DFF]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      enableAnimations ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ── Right Column: Account Summary + Platform Info + Danger Zone (4 cols) ── */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card 1: Account Summary */}
          <div
            className="p-5 rounded-xl border flex flex-col justify-between shadow-sm"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
              borderColor: isLight ? '#E2E8F0' : '#1E2436',
            }}
          >
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">
              Account Summary
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Anand Kumar"
                className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-white/15 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Anand Kumar</p>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/40">
                    Super Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">anand.kumar@npig.gov.in</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 dark:border-white/5 pt-3 mb-4 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Organization</span>
                <span className="font-bold text-slate-900 dark:text-white text-[11px]">NPIG</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Role</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">Super Administrator</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Member Since</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">15 May, 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Last Login</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">15 May, 2025 10:30 AM</span>
              </div>
            </div>

            <button
              onClick={() => toast('Opening central Gov IAM account management profile')}
              className="w-full py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/10 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Manage Account</span>
            </button>
          </div>

          {/* Card 2: Platform Information */}
          <div
            className="p-5 rounded-xl border flex flex-col justify-between shadow-sm"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
              borderColor: isLight ? '#E2E8F0' : '#1E2436',
            }}
          >
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">
              Platform Information
            </h3>

            <div className="space-y-2 text-xs mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Platform Version</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">v2.4.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Build Version</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">2025.05.15.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Release Date</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">15 May, 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Environment</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Production
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Uptime</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">29d 14h 32m 18s</span>
              </div>
            </div>

            <button
              onClick={() => toast('Viewing Sovereign Platform Release Changelog v2.4.1')}
              className="w-full py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/10 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Changelog</span>
            </button>
          </div>

          {/* Card 3: Danger Zone */}
          <div
            className="p-5 rounded-xl border flex flex-col justify-between shadow-sm"
            style={{
              backgroundColor: isLight ? '#FFFFFF' : '#0F1524',
              borderColor: isLight ? '#E2E8F0' : '#1E2436',
            }}
          >
            <h3 className="font-sans font-bold text-sm text-red-600 dark:text-red-400 mb-3">
              Danger Zone
            </h3>

            <div className="space-y-3 mb-4">
              
              {/* Clear Cache */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Clear Cache</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Clear local cache and temporary data.</p>
                </div>
                <button
                  onClick={handleClearCache}
                  className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Reset Preferences */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Reset Preferences</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Reset all preferences to default.</p>
                </div>
                <button
                  onClick={handleResetPreferences}
                  className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Deactivate Account */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Deactivate Account</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Temporarily disable your account.</p>
                </div>
                <button
                  onClick={() => toast.error('Account deactivation requires Gov Security Officer approval')}
                  className="px-3 py-1 rounded-md text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  Deactivate
                </button>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Delete Account</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Permanently delete your account.</p>
                </div>
                <button
                  onClick={() => toast.error('Account deletion is locked by administrative compliance')}
                  className="px-3 py-1 rounded-md text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </div>

            </div>

            {/* Bottom Caution Banner matching Screenshot 2 */}
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-[10px] text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <span>This action cannot be undone. Please proceed with caution.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
