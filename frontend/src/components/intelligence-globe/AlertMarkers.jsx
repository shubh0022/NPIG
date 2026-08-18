import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Car, Waves, Shield, ArrowUpRight } from 'lucide-react'

const ICON_MAP = {
  security: AlertTriangle,
  traffic: Car,
  climate: Waves,
  infrastructure: Shield,
}

export default function AlertMarkers({
  alerts = [],
  onSelectAlert = () => {},
  theme = 'dark',
}) {
  const isLight = theme === 'light'

  // Exact 4-corner spatial positions matching reference image
  const getPositionClasses = (position) => {
    switch (position) {
      case 'top-left':
        return 'top-8 sm:top-10 left-1 sm:left-2 lg:left-3'
      case 'top-right':
        return 'top-14 sm:top-16 right-1 sm:right-2 lg:right-3'
      case 'bottom-left':
        return 'bottom-16 sm:bottom-20 left-2 sm:left-4 lg:left-6'
      case 'bottom-right':
        return 'bottom-10 sm:bottom-12 right-2 sm:right-4 lg:right-6'
      default:
        return 'top-8 left-4'
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
      {alerts.map((alert, index) => {
        const IconComponent = ICON_MAP[alert.category] || AlertTriangle
        const posClass = getPositionClasses(alert.position)

        return (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15 + index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`absolute ${posClass} pointer-events-auto`}
          >
            <button
              type="button"
              onClick={() => onSelectAlert(alert.nodeId)}
              className="text-left group transition-all duration-300 transform hover:-translate-y-1 focus:outline-none rounded-xl"
            >
              <div
                className="px-3.5 py-2.5 rounded-xl border backdrop-blur-xl transition-all duration-300 shadow-xl flex items-center gap-2.5"
                style={{
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(11, 16, 32, 0.92)',
                  borderColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: isLight
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)'
                    : '0 14px 34px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* Icon in colored badge */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${alert.color}15`,
                    color: alert.color,
                  }}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Text */}
                <div className="min-w-0 pr-1">
                  <p
                    className="text-[11px] font-bold tracking-tight leading-tight"
                    style={{ color: isLight ? '#0F172A' : '#F8FAFC' }}
                  >
                    {alert.title}
                  </p>
                  <p
                    className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5"
                  >
                    {alert.location}
                  </p>
                </div>
              </div>
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}
