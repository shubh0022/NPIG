import React from 'react'
import GlobalNavbar from '../components/Navigation/GlobalNavbar'
import AboutSection from '../components/About/AboutSection'
import RedesignedFooter from '../components/Footer/RedesignedFooter'
import useStore from '../store/useStore'

export default function AboutPage() {
  const { theme } = useStore()

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#05070D] text-white'}`}>
      <GlobalNavbar />
      <div className="pt-24 pb-12">
        <AboutSection isStandalonePage={true} />
      </div>
      <RedesignedFooter />
    </div>
  )
}
