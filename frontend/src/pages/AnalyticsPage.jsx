import React, { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'

const COLORS = ['#2563eb', '#f43f5e', '#10b981', '#f59e0b', '#7c3aed', '#06b6d4']

function generateTimeSeriesData(hours = 48) {
  return Array.from({ length: hours }, (_, i) => {
    const h = new Date(Date.now() - (hours - 1 - i) * 3600000)
    return {
      time: h.getHours().toString().padStart(2, '0') + ':00',
      date: h.toLocaleDateString(),
      traffic: Math.round(30 + 40 * Math.sin(i / 6) + Math.random() * 20),
      crime: Math.round(10 + 20 * Math.sin(i / 8 + 1) + Math.random() * 10),
      health: Math.round(15 + 10 * Math.sin(i / 12 + 2) + Math.random() * 8),
      climate: Math.round(25 + 30 * Math.sin(i / 10 + 0.5) + Math.random() * 15),
      events: Math.round(800 + Math.random() * 4000),
    }
  })
}

const CATEGORY_DIST = [
  { name: 'Traffic',   value: 34, color: '#2563eb' },
  { name: 'Crime',     value: 22, color: '#f43f5e' },
  { name: 'Climate',   value: 19, color: '#06b6d4' },
  { name: 'Health',    value: 15, color: '#10b981' },
  { name: 'Cyber',     value: 7,  color: '#7c3aed' },
  { name: 'Emergency', value: 3,  color: '#f59e0b' },
]

const ZONE_PERF = [
  { zone: 'Downtown',     alerts: 47, resolved: 41, accuracy: 0.92 },
  { zone: 'Airport',      alerts: 28, resolved: 25, accuracy: 0.89 },
  { zone: 'Industrial',   alerts: 63, resolved: 52, accuracy: 0.88 },
  { zone: 'North Res.',   alerts: 34, resolved: 31, accuracy: 0.91 },
  { zone: 'Medical Dist.',alerts: 19, resolved: 19, accuracy: 0.95 },
  { zone: 'Port Zone',    alerts: 22, resolved: 18, accuracy: 0.86 },
]

export default function AnalyticsPage() {
  const [data, setData] = useState(generateTimeSeriesData(48))
  const [range, setRange] = useState('48h')

  useEffect(() => {
    const n = range === '24h' ? 24 : range === '48h' ? 48 : 168
    setData(generateTimeSeriesData(n))
  }, [range])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>Analytics Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            Historical intelligence analysis and system performance metrics
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['24h', '48h', '7d'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                background: range === r ? 'var(--accent-blue)' : 'transparent',
                border: `1px solid ${range === r ? 'var(--accent-blue)' : 'var(--border)'}`,
                color: range === r ? 'white' : 'var(--text-secondary)',
              }}
            >{r}</button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid-4">
        {[
          { label: 'Total Events Ingested', value: '2.4M', color: '#2563eb', icon: '⚡', sub: '+18% vs yesterday' },
          { label: 'Predictions Made',      value: '48.3K', color: '#7c3aed', icon: '🧠', sub: '91.3% accuracy' },
          { label: 'Avg Response Time',     value: '4.2', unit: 'min', color: '#10b981', icon: '⏱', sub: 'Emergency dispatch' },
          { label: 'False Positive Rate',  value: '3.8', unit: '%', color: '#f59e0b', icon: '🎯', sub: 'All models combined' },
        ].map(m => (
          <div key={m.label} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: m.color }} />
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'white', fontFamily: 'JetBrains Mono' }}>
              {m.value}<span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: m.color, marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Multi-domain trend */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>Risk Trend — {range} Window</h3>
          <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
            {['traffic', 'crime', 'health', 'climate'].map((d, i) => (
              <span key={d} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                <span style={{ width: 10, height: 3, background: COLORS[i], borderRadius: 2, display: 'inline-block' }} />
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <defs>
              {['traffic', 'crime', 'health', 'climate'].map((key, i) => (
                <linearGradient key={key} id={`g${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(96,165,250,0.06)" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={Math.max(1, Math.floor(data.length / 12))} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0d1632', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 8, fontSize: 11 }} />
            <Area type="monotone" dataKey="traffic" stroke={COLORS[0]} fill={`url(#gtraffic)`} strokeWidth={2} name="Traffic" />
            <Area type="monotone" dataKey="crime" stroke={COLORS[1]} fill={`url(#gcrime)`} strokeWidth={2} name="Crime" />
            <Line type="monotone" dataKey="health" stroke={COLORS[2]} strokeWidth={2} dot={false} name="Health" />
            <Line type="monotone" dataKey="climate" stroke={COLORS[3]} strokeWidth={2} dot={false} name="Climate" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Category distribution */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Alert Category Distribution</h3>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={CATEGORY_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                  paddingAngle={3} dataKey="value">
                  {CATEGORY_DIST.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {CATEGORY_DIST.map(cat => (
                <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{cat.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'white', fontFamily: 'JetBrains Mono' }}>{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zone performance */}
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Zone Performance Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ZONE_PERF} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(96,165,250,0.06)" vertical={false} />
              <XAxis dataKey="zone" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0d1632', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="alerts" name="Total" fill="#2563eb" radius={[3, 3, 0, 0]} fillOpacity={0.6} />
              <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Events volume */}
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Event Ingestion Volume</h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data.slice(-24)} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(96,165,250,0.06)" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={3} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#0d1632', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="events" fill="#7c3aed" radius={[3, 3, 0, 0]} fillOpacity={0.8} name="Events" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
