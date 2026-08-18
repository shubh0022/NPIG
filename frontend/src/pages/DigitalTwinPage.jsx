import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  Layers, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Sliders 
} from 'lucide-react'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const SCENARIOS = [
  { id: 'MAJOR_FLOOD', label: '🌊 Major Flood Inundation', color: '#38BDF8', defaultSeverity: 0.85 },
  { id: 'POWER_OUTAGE', label: '⚡ Regional Grid Blackout', color: '#F43F5E', defaultSeverity: 0.90 },
  { id: 'CYBER_ATTACK', label: '💻 SCADA Cyber Anomaly', color: '#818CF8', defaultSeverity: 0.75 },
  { id: 'TRAFFIC_GRIDLOCK', label: '🚗 Express Corridor Gridlock', color: '#F59E0B', defaultSeverity: 0.80 },
  { id: 'HEATWAVE', label: '☀️ Extreme Heatwave Stress', color: '#FB923C', defaultSeverity: 0.65 },
]

const DEFAULT_ZONES = [
  { zone_id: 'Z-01', name: 'Downtown Financial Hub', type: 'Commercial', trf: 82, crm: 35, clm: 20, pwr: 95 },
  { zone_id: 'Z-02', name: 'Coastal Worli Lowlands', type: 'Coastal Res.', trf: 60, crm: 25, clm: 88, pwr: 90 },
  { zone_id: 'Z-03', name: 'NH48 Logistics Junction', type: 'Transit', trf: 92, crm: 40, clm: 30, pwr: 85 },
  { zone_id: 'Z-04', name: 'Substation 4 Grid Terminal', type: 'Infrastructure', trf: 25, crm: 15, clm: 45, pwr: 98 },
  { zone_id: 'Z-05', name: 'Central Hospital District', type: 'Healthcare', trf: 45, crm: 20, clm: 15, pwr: 99 },
  { zone_id: 'Z-06', name: 'Northern Academic Corridor', type: 'Education', trf: 50, crm: 30, clm: 25, pwr: 92 },
]

export default function DigitalTwinPage() {
  const { theme } = useStore()
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0].id)
  const [severity, setSeverity] = useState(75)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulatedResults, setSimulatedResults] = useState(null)

  const activeScenarioObj = SCENARIOS.find(s => s.id === selectedScenario) || SCENARIOS[0]

  const handleRunSimulation = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setSimulatedResults({
        scenario: activeScenarioObj.label,
        impactScore: Math.round(severity * 1.15),
        displacedEstimate: (severity * 1250).toLocaleString(),
        affectedInfrastructure: ['Substation Relay 4', 'Western Express Arterial', 'Storm Drain Pump 3'],
        estimatedRecoveryTime: `${Math.round(severity / 12)} Hours`,
        recommendations: [
          'Pre-position diesel generators at Central Hospital District',
          'Deploy mobile traffic detours along Outer Ring Corridor',
          'Activate municipal flood surge barrier sequence #4',
        ],
      })
      toast.success(`Simulation completed for ${activeScenarioObj.label}`)
    }, 1200)
  }

  const handleReset = () => {
    setSimulatedResults(null)
    toast('Simulation parameters reset', { icon: '🔄' })
  }

  return (
    <div className="space-y-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Digital City Twin & Spatial Simulator</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Digital Twin Simulation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light mt-0.5">
            What-if emergency scenario modeling and crisis resilience stress-testing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="btn-secondary !px-4 !py-2 !rounded-xl !text-xs !font-semibold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="btn-primary !px-5 !py-2 !rounded-xl !text-xs !font-bold flex items-center gap-2"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating Dynamic Mesh...' : 'Execute What-If Scenario'}</span>
          </button>
        </div>
      </div>

      {/* ── Scenario Configuration ── */}
      <div 
        className="npig-card p-6"
        style={{
          backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
          borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
        }}
      >
        <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white mb-4">
          Select Stress-Test Scenario & Intensity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${
                selectedScenario === sc.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border-indigo-500'
                  : theme === 'light'
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-500 font-semibold uppercase tracking-wider">Scenario Severity Level</span>
            <span className="font-mono font-bold text-indigo-400">{severity}% Intensity</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* ── Grid Zones & Simulation Output ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Spatial Zone Mesh (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className="npig-card p-6"
            style={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
              borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5 mb-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Live Zone Telemetry Matrix
              </h3>
              <span className="text-xs font-mono text-slate-400">6 Sectors Monitored</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEFAULT_ZONES.map((zone) => (
                <div key={zone.zone_id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{zone.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{zone.zone_id} · {zone.type}</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="p-1.5 rounded bg-black/20 text-slate-300">Traffic: <span className="text-indigo-400 font-bold">{zone.trf}%</span></div>
                    <div className="p-1.5 rounded bg-black/20 text-slate-300">Climate: <span className="text-sky-400 font-bold">{zone.clm}%</span></div>
                    <div className="p-1.5 rounded bg-black/20 text-slate-300">Crime: <span className="text-rose-400 font-bold">{zone.crm}%</span></div>
                    <div className="p-1.5 rounded bg-black/20 text-slate-300">Grid Pwr: <span className="text-emerald-400 font-bold">{zone.pwr}%</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What-If Output Panel (Right 5 cols) */}
        <div className="lg:col-span-5">
          <div
            className="npig-card p-6 flex flex-col justify-between h-full"
            style={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1020',
              borderColor: theme === 'light' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.08)',
            }}
          >
            {simulatedResults ? (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Simulation Output
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-2">
                    {simulatedResults.scenario}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Impact Score</p>
                    <p className="text-xl font-bold font-mono text-rose-400 mt-1">{simulatedResults.impactScore}/100</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Recovery Time</p>
                    <p className="text-xl font-bold font-mono text-indigo-400 mt-1">{simulatedResults.estimatedRecoveryTime}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Affected Nodes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {simulatedResults.affectedInfrastructure.map((inf) => (
                      <span key={inf} className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-mono">
                        {inf}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Direct Action Directives</p>
                  <div className="space-y-2 text-xs text-slate-300">
                    {simulatedResults.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-72 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Activity className="w-7 h-7" />
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Simulation Ready
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs font-light">
                  Select an emergency stress-test scenario and click "Execute What-If Scenario" to simulate impact vectors.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
