import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MetricCardsRow from '../components/Dashboard/MetricCardsRow'
import WorldIntelligenceMap from '../components/Dashboard/WorldIntelligenceMap'
import IncidentTrendsChart from '../components/Dashboard/IncidentTrendsChart'
import AlertCategoryChart from '../components/Dashboard/AlertCategoryChart'
import RecentAlertsCard from '../components/Dashboard/RecentAlertsCard'
import PredictionOverviewCard from '../components/Dashboard/PredictionOverviewCard'
import SystemHealthCard from '../components/Dashboard/SystemHealthCard'
import BottomInfoStrip from '../components/Dashboard/BottomInfoStrip'
import InteractiveMap from '../components/Map/InteractiveMap'
import useStore from '../store/useStore'

export default function DashboardPage() {
  const { theme } = useStore()
  const [fullMapModalOpen, setFullMapModalOpen] = useState(false)

  return (
    <div className="space-y-5 pb-8">
      
      {/* ══════════════════════════════════════════════════════════════
          ROW 1: 4 KPI CARDS (Total Alerts, Active Incidents, Predictions Today, Response Time)
          ══════════════════════════════════════════════════════════════ */}
      <MetricCardsRow />

      {/* ══════════════════════════════════════════════════════════════
          ROW 2: LIVE INTELLIGENCE MAP (Left) & CHARTS STACK (Right)
          ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Live Intelligence World Map (7 cols / 58% width) */}
        <div className="lg:col-span-7 flex flex-col">
          <WorldIntelligenceMap
            onViewFullMap={() => setFullMapModalOpen(true)}
          />
        </div>

        {/* Right Column: Incident Trends & Alerts by Category (5 cols / 42% width) */}
        <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
          <IncidentTrendsChart />
          <AlertCategoryChart />
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          ROW 3: THREE EQUAL CARDS (Recent Alerts | Prediction Overview | System Health)
          ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        <RecentAlertsCard />
        <PredictionOverviewCard />
        <SystemHealthCard />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ROW 4: BOTTOM INFORMATION STRIP (23.8M+ Data Points, 350+ Sources, 120+ Users, Last Updated)
          ══════════════════════════════════════════════════════════════ */}
      <BottomInfoStrip />

      {/* ══════════════════════════════════════════════════════════════
          FULLSCREEN GIS LEAFLET MAP MODAL (Triggered by 'View Full Map')
          ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {fullMapModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-7xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
            >
              <InteractiveMap
                isExpanded={true}
                onToggleExpand={() => setFullMapModalOpen(false)}
                className="w-full h-full"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
