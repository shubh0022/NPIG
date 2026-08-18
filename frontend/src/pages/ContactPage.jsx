import React from 'react'
import GlobalNavbar from '../components/Navigation/GlobalNavbar'
import ContactSection from '../components/Contact/ContactSection'
import RedesignedFooter from '../components/Footer/RedesignedFooter'
import useStore from '../store/useStore'

export default function ContactPage() {
  const { theme } = useStore()

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#05070D] text-white'}`}>
      <GlobalNavbar />
      <div className="pt-24 pb-12">
        <ContactSection isStandalonePage={true} />
      </div>
      <RedesignedFooter />
    </div>
  )
}
