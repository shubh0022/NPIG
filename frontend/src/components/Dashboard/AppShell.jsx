import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardSidebar from './DashboardSidebar'
import DashboardTopbar from './DashboardTopbar'
import NexusDrawer from './NexusDrawer'
import useStore from '../../store/useStore'

export default function AppShell({ children }) {
  const { theme } = useStore()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [nexusDrawerOpen, setNexusDrawerOpen] = useState(false)

  // Theme class synchronization on document root
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div
      className={`flex h-screen overflow-hidden font-sans transition-colors duration-200 ${
        theme === 'light' ? 'bg-[#F4F6F9] text-slate-900' : 'bg-[#080F1A] text-[#F8FAFC]'
      }`}
    >
      {/* ── Mobile Sidebar Drawer Overlay ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <DashboardSidebar
                onOpenNexus={() => {
                  setMobileSidebarOpen(false)
                  setNexusDrawerOpen(true)
                }}
                onCloseMobile={() => setMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Fixed 240px Left Sidebar matching Reference ── */}
      <div className="hidden lg:block flex-shrink-0">
        <DashboardSidebar
          onOpenNexus={() => setNexusDrawerOpen(true)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar: 64px height with Search, Status, Profile */}
        <DashboardTopbar onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

        {/* Scrollable Page Body */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6"
          style={{
            backgroundColor: theme === 'light' ? '#F4F6F9' : '#080F1A',
          }}
        >
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* ── Interactive Right-Sliding NEXUS AI Drawer ── */}
      <NexusDrawer
        isOpen={nexusDrawerOpen}
        onClose={() => setNexusDrawerOpen(false)}
      />
    </div>
  )
}
