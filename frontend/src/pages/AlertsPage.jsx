import React, { useState, useEffect } from 'react'
import useStore from '../store/useStore'
import { alertsAPI } from '../utils/api'
import toast from 'react-hot-toast'

const SEV_COLORS = { CRITICAL: '#ff2d6b', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#3b82f6', INFO: '#818cf8' }
const CAT_ICONS = { TRAFFIC: '🚗', CRIME: '🔫', HEALTH: '🏥', CLIMATE: '🌊', CYBER: '💻', EMERGENCY: '🚨', SYSTEM: '⚙️' }

function AlertDetailPanel({ alert, onClose, onAcknowledge, onResolve }) {
  if (!alert) return null
  const color = SEV_COLORS[alert.severity] || '#3b82f6'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(3,7,18,0.8)', backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div
        className="glass-strong"
        style={{
          width: 520, maxWidth: '90%', borderRadius: 20,
          boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px ${color}40`,
          padding: 28, position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Severity stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '20px 20px 0 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className={`badge badge-${alert.severity?.toLowerCase()}`}>{alert.severity}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                {alert.alert_id?.slice(0, 16)}...
              </span>
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'white', lineHeight: 1.3 }}>{alert.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, padding: '0 4px' }}>✕</button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{alert.description}</p>

        {/* Metadata grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Category', value: `${CAT_ICONS[alert.category] || '📋'} ${alert.category}` },
            { label: 'Status', value: alert.status },
            { label: 'Confidence', value: `${Math.round((alert.confidence || 0) * 100)}%` },
            { label: 'Affected Zone', value: alert.affected_zone || 'N/A' },
            { label: 'Population', value: alert.affected_population?.toLocaleString() || 'N/A' },
            { label: 'Source', value: alert.source_service || 'system' },
          ].map(item => (
            <div key={item.label} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Recommended Actions */}
        {alert.recommended_actions?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.08em' }}>RECOMMENDED ACTIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {alert.recommended_actions.map((action, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ color: color, flexShrink: 0 }}>▸</span>
                  {action}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Channels */}
        {alert.channels_notified?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>NOTIFIED VIA</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {alert.channels_notified.map(ch => (
                <span key={ch} style={{ padding: '3px 10px', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 9999, fontSize: 10, color: 'var(--text-accent)' }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {alert.status === 'ACTIVE' && (
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={onAcknowledge} style={{ flex: 1, justifyContent: 'center' }}>
              ✓ Acknowledge
            </button>
            <button className="btn btn-primary" onClick={onResolve} style={{ flex: 1, justifyContent: 'center' }}>
              ✅ Mark Resolved
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AlertsPage() {
  const { alerts, setAlerts, updateAlertStats } = useStore()
  const [filter, setFilter] = useState({ severity: 'ALL', category: 'ALL', status: 'ALL' })
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadAlerts = async () => {
    setLoading(true)
    try {
      const [alertsRes, statsRes] = await Promise.all([
        alertsAPI.list({ limit: 100 }),
        alertsAPI.stats()
      ])
      setAlerts(alertsRes.data.alerts || [])
      updateAlertStats(statsRes.data.by_severity || {})
    } catch (err) {
      toast.error('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAlerts() }, [])

  const filtered = alerts.filter(a => {
    if (filter.severity !== 'ALL' && a.severity !== filter.severity) return false
    if (filter.category !== 'ALL' && a.category !== filter.category) return false
    if (filter.status !== 'ALL' && a.status !== filter.status) return false
    return true
  })

  const handleAcknowledge = async () => {
    if (!selectedAlert) return
    try {
      await alertsAPI.update(selectedAlert.alert_id, { status: 'ACKNOWLEDGED', assigned_to: 'Current User' })
      toast.success('Alert acknowledged')
      setSelectedAlert(null)
      loadAlerts()
    } catch {
      toast.error('Failed to acknowledge')
    }
  }

  const handleResolve = async () => {
    if (!selectedAlert) return
    try {
      await alertsAPI.update(selectedAlert.alert_id, { status: 'RESOLVED', resolution_notes: 'Resolved by operator' })
      toast.success('Alert resolved')
      setSelectedAlert(null)
      loadAlerts()
    } catch {
      toast.error('Failed to resolve')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>Active Alerts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            {filtered.length} alerts matching current filters
          </p>
        </div>
        <button className="btn btn-ghost" onClick={loadAlerts} disabled={loading}>
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[
          { key: 'severity', options: ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] },
          { key: 'category', options: ['ALL', 'TRAFFIC', 'CRIME', 'HEALTH', 'CLIMATE', 'CYBER', 'EMERGENCY'] },
          { key: 'status',   options: ['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'ESCALATED'] },
        ].map(({ key, options }) => (
          <select
            key={key}
            value={filter[key]}
            onChange={e => setFilter(f => ({ ...f, [key]: e.target.value }))}
            className="input"
            style={{ width: 'auto', padding: '6px 30px 6px 10px', fontSize: 12 }}
          >
            {options.map(o => <option key={o} value={o}>{key.toUpperCase()}: {o}</option>)}
          </select>
        ))}
      </div>

      {/* Alerts Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '24px 1fr 100px 100px 120px 100px', gap: 12 }}>
          <span></span>
          <span>ALERT</span>
          <span>CATEGORY</span>
          <span>SEVERITY</span>
          <span>STATUS</span>
          <span>TIME</span>
        </div>

        <div className="scroll-panel" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 14 }}>No alerts match current filters</div>
            </div>
          ) : filtered.map(alert => {
            const color = SEV_COLORS[alert.severity] || '#3b82f6'
            return (
              <div
                key={alert.alert_id}
                onClick={() => setSelectedAlert(alert)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '24px 1fr 100px 100px 120px 100px',
                  gap: 12,
                  padding: '12px 18px',
                  borderBottom: '1px solid rgba(96,165,250,0.06)',
                  cursor: 'pointer',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,99,235,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color,
                  ...(alert.severity === 'CRITICAL' ? { animation: 'pulse-glow 1s infinite' } : {}) }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    {alert.affected_zone || alert.source_service}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {CAT_ICONS[alert.category]} {alert.category}
                </div>
                <span className={`badge badge-${alert.severity?.toLowerCase()}`}>{alert.severity}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: alert.status === 'ACTIVE' ? '#22c55e' : alert.status === 'ESCALATED' ? '#f97316' : 'var(--text-muted)'
                }}>{alert.status}</span>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                  {new Date(alert.created_at).toLocaleTimeString()}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedAlert && (
        <AlertDetailPanel
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
        />
      )}
    </div>
  )
}
