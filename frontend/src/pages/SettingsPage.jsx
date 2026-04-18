import React from 'react'
import useStore from '../store/useStore'

export default function SettingsPage() {
  const { user } = useStore()

  const SECTIONS = [
    {
      title: 'Account Information',
      items: [
        { label: 'Full Name', value: user?.full_name || 'Administrator' },
        { label: 'Email', value: user?.email || 'admin@npig.gov.in' },
        { label: 'Role', value: user?.role || 'ADMIN' },
        { label: 'Security Clearance', value: `Level ${user?.clearance_level || 5}` },
      ]
    },
    {
      title: 'System Configuration',
      items: [
        { label: 'Alert Polling Interval', value: '30 seconds' },
        { label: 'WebSocket Feed', value: 'Active' },
        { label: 'Data Retention', value: '90 days' },
        { label: 'Encryption', value: 'AES-256-GCM' },
      ]
    },
    {
      title: 'AI Model Configuration',
      items: [
        { label: 'Traffic Model', value: 'ARIMA v2.1 — Active' },
        { label: 'Crime Model', value: 'KDE v1.5 — Active' },
        { label: 'Disease Model', value: 'SIR v3.0 — Active' },
        { label: 'Climate Model', value: 'Hybrid v2.0 — Active' },
        { label: 'Anomaly Model', value: 'Z+IQR v1.3 — Active' },
      ]
    },
    {
      title: 'Integration Status',
      items: [
        { label: 'Kafka Broker', value: '✅ Connected', color: '#22c55e' },
        { label: 'PostgreSQL', value: '✅ Connected', color: '#22c55e' },
        { label: 'MongoDB', value: '✅ Connected', color: '#22c55e' },
        { label: 'Redis Cache', value: '✅ Connected', color: '#22c55e' },
        { label: 'Prometheus', value: '✅ Active', color: '#22c55e' },
        { label: 'Grafana', value: '✅ Connected', color: '#22c55e' },
      ]
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
      <div>
        <h1 style={{ fontSize: 22, fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
          System configuration and account management
        </p>
      </div>

      {/* Classification Banner */}
      <div style={{
        padding: '10px 16px',
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 10,
        fontSize: 12, color: 'var(--danger)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        ⚠ CLASSIFIED ENVIRONMENT — Changes are logged and audited · Clearance Level {user?.clearance_level || 5} access granted
      </div>

      {SECTIONS.map(section => (
        <div key={section.title} className="card">
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-accent)', marginBottom: 14, letterSpacing: '0.06em' }}>
            {section.title.toUpperCase()}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {section.items.map(item => (
              <div key={item.label} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: item.color || 'white', fontFamily: item.color ? 'inherit' : 'JetBrains Mono' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Permissions */}
      <div className="card">
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-accent)', marginBottom: 14, letterSpacing: '0.06em' }}>
          ACTIVE PERMISSIONS
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(user?.permissions || ['read', 'write', 'manage_users', 'view_classified']).map(perm => (
            <span key={perm} style={{
              padding: '4px 12px',
              background: 'rgba(37,99,235,0.1)',
              border: '1px solid rgba(37,99,235,0.25)',
              borderRadius: 9999,
              fontSize: 11, color: 'var(--text-accent)',
              fontFamily: 'JetBrains Mono',
            }}>{perm}</span>
          ))}
        </div>
      </div>

      {/* Version info */}
      <div style={{ textAlign: 'center', padding: 16, color: 'var(--text-muted)', fontSize: 11, fontFamily: 'JetBrains Mono' }}>
        NPIG v1.0.0 · National Predictive Intelligence Grid · © 2024 Government of India
        <br />Build: production · Classification: RESTRICTED · All access logged
      </div>
    </div>
  )
}
