import React from 'react'
import IntelligenceGlobe from '../intelligence-globe/IntelligenceGlobe'

/**
 * InteractiveGlobeHero Component
 * Serves as the primary 3D Hero visualization on the NPIG Landing Page.
 * Delegates rendering and interaction to the modular IntelligenceGlobe architecture.
 */
export default function InteractiveGlobeHero(props) {
  return (
    <div className="w-full flex items-center justify-center">
      <IntelligenceGlobe {...props} />
    </div>
  )
}
