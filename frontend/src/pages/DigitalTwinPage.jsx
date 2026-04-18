import React, { useState, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { twinAPI } from '../utils/api'
import toast from 'react-hot-toast'

const SCENARIO_TYPES = [
  { value: 'MAJOR_FLOOD',        label: '🌊 Major Flood',           color: '#06b6d4' },
  { value: 'EARTHQUAKE',         label: '🌍 Earthquake',            color: '#f59e0b' },
  { value: 'PANDEMIC_SURGE',     label: '🦠 Pandemic Surge',        color: '#10b981' },
  { value: 'POWER_OUTAGE',       label: '⚡ Power Outage',          color: '#f43f5e' },
  { value: 'CYBER_ATTACK',       label: '💻 Cyber Attack',          color: '#7c3aed' },
  { value: 'MASS_EVENT',         label: '👥 Mass Event',            color: '#2563eb' },
  { value: 'INDUSTRIAL_ACCIDENT',label: '🏭 Industrial Accident',   color: '#f97316' },
  { value: 'TERRORIST_THREAT',   label: '⚠️ Terrorist Threat',     color: '#ff2d6b' },
]

const ZONE_COLORS = {
  COMMERCIAL:   '#2563eb',
  TRANSIT:      '#7c3aed',
  INDUSTRIAL:   '#f97316',
  RESIDENTIAL:  '#22c55e',
  HEALTHCARE:   '#06b6d4',
  EDUCATION:    '#f59e0b',
  LOGISTICS:    '#8b5cf6',
  RECREATIONAL: '#10b981',
  GOVERNMENT:   '#3b82f6',
}

function getRiskColor(risk) {
  if (risk > 0.8) return '#ff2d6b'
  if (risk > 0.6) return '#f97316'
  if (risk > 0.4) return '#f59e0b'
  if (risk > 0.2) return '#3b82f6'
  return '#22c55e'
}

function CityGrid({ zones, selectedZones, onToggleZone }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 8,
      padding: 8,
    }}>
      {zones.map(zone => {
        const riskMax = Math.max(zone.traffic_load, zone.crime_risk, zone.climate_risk, zone.health_risk)
        const riskColor = getRiskColor(riskMax)
        const isSelected = selectedZones.includes(zone.zone_id)

        return (
          <div
            key={zone.zone_id}
            onClick={() => onToggleZone(zone.zone_id)}
            style={{
              padding: '10px',
              borderRadius: 10,
              background: isSelected
                ? `rgba(37,99,235,0.25)`
                : `${riskColor}12`,
              border: isSelected
                ? '2px solid var(--accent-blue)'
                : `1px solid ${riskColor}30`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: riskColor,
                ...(riskMax > 0.7 ? { animation: 'pulse-glow 1s infinite' } : {}),
              }} />
              <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{zone.zone_id}</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'white', marginBottom: 4, lineHeight: 1.2 }}>{zone.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>{zone.type}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {[
                { label: 'TRF', val: zone.traffic_load },
                { label: 'CRM', val: zone.crime_risk },
                { label: 'CLM', val: zone.climate_risk },
                { label: 'HLT', val: zone.health_risk },
              ].map(({ label, val }) => (
                <div key={label} style={{ fontSize: 9 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
                  <span style={{ color: getRiskColor(val), fontFamily: 'JetBrains Mono' }}>
                    {Math.round(val * 100)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function DigitalTwinPage() {
  const { twinSnapshot, setTwinSnapshot, activeScenarios, setActiveScenarios } = useStore()
  const [zones, setZones] = useState([])
  const [infrastructure, setInfrastructure] = useState(null)
  const [selectedZones, setSelectedZones] = useState([])
  const [selectedScenario, setSelectedScenario] = useState('')
  const [intensity, setIntensity] = useState(1.0)
  const [duration, setDuration] = useState(2)
  const [showScenarioPanel, setShowScenarioPanel] = useState(false)
  const [cityMetrics, setCityMetrics] = useState(null)
  const wsRef = useRef(null)

  const loadData = async () => {
    try {
      const [snapRes] = await Promise.allSettled([twinAPI.getSnapshot()])
      if (snapRes.status === 'fulfilled') {
        const snap = snapRes.value.data
        setZones(snap.zones || [])
        setInfrastructure(snap.infrastructure)
        setCityMetrics(snap.city_metrics)
        setActiveScenarios(snap.active_scenarios || [])
      }
    } catch {}
  }

  useEffect(() => {
    loadData()
    
    // WebSocket for live twin updates
    const connect = () => {
      try {
        const ws = new WebSocket(`ws://${window.location.hostname}:8005/ws/twin`)
        ws.onmessage = (e) => {
          const data = JSON.parse(e.data)
          if (data.type === 'TICK' || data.type === 'INIT') {
            setZones(data.data.zones || [])
            setInfrastructure(data.data.infrastructure)
            setCityMetrics(data.data.city_metrics)
            setActiveScenarios(data.data.active_scenarios || [])
          }
        }
        wsRef.current = ws
        return ws
      } catch { return null }
    }
    const ws = connect()
    const fallback = setInterval(loadData, 5000)
    return () => { ws?.close(); clearInterval(fallback) }
  }, [])

  const toggleZone = (id) => {
    setSelectedZones(prev => prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id])
  }

  const runScenario = async () => {
    if (!selectedScenario) return toast.error('Select a scenario type')
    if (selectedZones.length === 0) return toast.error('Select at least one zone')

    try {
      await twinAPI.simulate({
        scenario_type: selectedScenario,
        affected_zone_ids: selectedZones,
        intensity, duration_hours: duration,
      })
      toast.success(`🔬 Scenario "${selectedScenario}" injected into simulation`)
      setShowScenarioPanel(false)
      setSelectedZones([])
      loadData()
    } catch {
      toast.error('Failed to run scenario')
    }
  }

  const applyIntervention = async (zone_id, intervention_type) => {
    try {
      const res = await twinAPI.intervene({ zone_id, intervention_type, parameters: { count: 5, beds: 200 } })
      toast.success(`✅ Intervention applied: ${intervention_type}`)
      loadData()
    } catch {
      toast.error('Failed to apply intervention')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>Digital Twin</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            Real-time city simulation — {zones.length} zones active · What-if scenario modeling
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={loadData}>🔄 Sync</button>
          <button
            className="btn btn-primary"
            onClick={() => setShowScenarioPanel(!showScenarioPanel)}
          >
            🔬 Run Scenario
          </button>
        </div>
      </div>

      {/* Active Scenarios Banner */}
      {activeScenarios.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {activeScenarios.map(s => (
            <div key={s.id} style={{
              padding: '6px 14px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 9999,
              fontSize: 11, color: '#f43f5e',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span className="status-dot critical" style={{ width: 6, height: 6 }} />
              {s.type} — {s.affected_zones?.length} zones — intensity: {s.intensity}x
            </div>
          ))}
        </div>
      )}

      {/* Scenario Panel */}
      {showScenarioPanel && (
        <div className="card" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.2)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--accent-cyan)' }}>
            🔬 What-If Scenario Builder
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>SCENARIO TYPE</label>
              <select className="input" value={selectedScenario} onChange={e => setSelectedScenario(e.target.value)} style={{ fontSize: 12 }}>
                <option value="">Select scenario...</option>
                {SCENARIO_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>INTENSITY ({intensity}x)</label>
              <input type="range" min="0.5" max="3" step="0.5" value={intensity}
                onChange={e => setIntensity(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-blue)' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>DURATION ({duration}h)</label>
              <input type="range" min="1" max="24" step="1" value={duration}
                onChange={e => setDuration(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-blue)' }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
            SELECT ZONES ({selectedZones.length} selected) — Click zones in the grid below
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={runScenario}>▶ Execute Simulation</button>
            <button className="btn btn-ghost" onClick={() => { setShowScenarioPanel(false); setSelectedZones([]) }}>Cancel</button>
          </div>
        </div>
      )}

      {/* City Metrics */}
      {cityMetrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { label: 'Avg Traffic Load', val: cityMetrics.avg_traffic_load, color: '#2563eb' },
            { label: 'Avg Crime Risk', val: cityMetrics.avg_crime_risk, color: '#f43f5e' },
            { label: 'Avg Climate Risk', val: cityMetrics.avg_climate_risk, color: '#06b6d4' },
            { label: 'High Risk Zones', val: cityMetrics.zones_at_high_risk, color: '#f97316', isCount: true },
          ].map(m => (
            <div key={m.label} style={{
              padding: '12px 14px',
              background: `${m.color}10`,
              border: `1px solid ${m.color}25`,
              borderRadius: 12,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: m.color, fontFamily: 'JetBrains Mono' }}>
                {m.isCount ? m.val : Math.round(m.val * 100) + '%'}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Zone Grid */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>City Zone Matrix</h3>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live simulation · Updates every 3s</span>
          </div>
          <CityGrid zones={zones} selectedZones={selectedZones} onToggleZone={toggleZone} />
        </div>

        {/* Infrastructure + Interventions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Infrastructure Status */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Infrastructure Status</h3>
            {infrastructure && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '⚡ Power Grid', status: infrastructure.power_grid?.status, val: `${Math.round((infrastructure.power_grid?.capacity_pct || 0) * 100)}%` },
                  { label: '💧 Water Supply', status: infrastructure.water_supply?.status, val: `${infrastructure.water_supply?.pressure_bar?.toFixed(1)} bar` },
                  { label: '📡 Telecom', status: infrastructure.telecom?.status, val: `${infrastructure.telecom?.uptime_pct}% uptime` },
                  { label: '🚇 Metro', status: infrastructure.transport?.metro_lines?.status, val: `+${infrastructure.transport?.metro_lines?.delay_min}min delay` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{item.val}</span>
                      <div className={`status-dot ${item.status === 'OPERATIONAL' ? 'operational' : 'degraded'}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Services */}
          {infrastructure?.emergency_services && (
            <div className="card">
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Emergency Services</h3>
              {[
                { label: '🚓 Police', data: infrastructure.emergency_services.police, color: '#2563eb' },
                { label: '🚒 Fire', data: infrastructure.emergency_services.fire, color: '#f97316' },
                { label: '🚑 Ambulance', data: infrastructure.emergency_services.ambulance, color: '#10b981' },
              ].map(({ label, data, color }) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontSize: 11, color, fontFamily: 'JetBrains Mono' }}>
                      {data?.units_active} units · {data?.response_time_min?.toFixed(1)}min resp.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Interventions */}
          {selectedZones.length > 0 && (
            <div className="card" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.2)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--accent-cyan)' }}>
                Quick Interventions — {selectedZones[0]}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { type: 'DEPLOY_POLICE', label: '🚓 Deploy Police Units' },
                  { type: 'REROUTE_TRAFFIC', label: '🚗 Reroute Traffic' },
                  { type: 'EVACUATE', label: '🏃 Evacuate Population' },
                  { type: 'MEDICAL_SURGE', label: '🏥 Medical Surge Capacity' },
                ].map(({ type, label }) => (
                  <button
                    key={type}
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'flex-start', fontSize: 12 }}
                    onClick={() => applyIntervention(selectedZones[0], type)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
