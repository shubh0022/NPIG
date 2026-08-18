import React, { useState, useEffect, useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  Polygon,
  ZoomControl,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Maximize2,
  Minimize2,
  RefreshCw,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Radio,
  Eye,
  SlidersHorizontal,
  Compass,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import useStore from '../../store/useStore'
import toast from 'react-hot-toast'

// ── Geographically Accurate Telemetry Nodes Across India ───────────
const INTELLIGENCE_LOCATIONS = [
  {
    id: 'loc-mumbai',
    name: 'Mumbai Coastal Sector 7 (Worli - Bandra)',
    lat: 18.9894,
    lng: 72.8258,
    category: 'CLIMATE',
    severity: 'CRITICAL',
    color: '#EF4444', // Red
    riskScore: 96,
    confidence: 96.4,
    affectedPop: '85,000',
    telemetry: 'Ultrasonic sensor: Water rising at 4.2 cm/min. Surge peak expected at high tide.',
    recommendation: 'Trigger automated flood barrier gates & pre-route Western Coastal elevated lanes.',
    forecast: '+15 cm in next 90 mins',
  },
  {
    id: 'loc-bengaluru',
    name: 'Bengaluru Tech Corridor (NH48 - Electronic City)',
    lat: 12.9352,
    lng: 77.6245,
    category: 'TRAFFIC',
    severity: 'HIGH',
    color: '#F97316', // Orange
    riskScore: 84,
    confidence: 92.8,
    affectedPop: '42,000',
    telemetry: 'Mean velocity 11.4 km/h across 6.2 km bottleneck. Secondary queue on arterial ramps.',
    recommendation: 'Activate dynamic variable message signage & re-route commercial freight.',
    forecast: 'Congestion clears in 45 mins after detour',
  },
  {
    id: 'loc-delhi',
    name: 'Delhi-NCR Central Transit (Connaught Place - Ring Rd)',
    lat: 28.6315,
    lng: 77.2167,
    category: 'PUBLIC SAFETY',
    severity: 'MEDIUM',
    color: '#38BDF8', // Cyan/Sky
    riskScore: 68,
    confidence: 88.5,
    affectedPop: '12,500',
    telemetry: 'Optical crowd density algorithm flagged 84% capacity threshold near metro hub concourse.',
    recommendation: 'Notify municipal transit police & synchronize escalators to disperse crowd.',
    forecast: 'Density stabilizing post-rush hour',
  },
  {
    id: 'loc-yamunanagar',
    name: 'Northern Power Grid Relay 4 (Yamunanagar)',
    lat: 30.129,
    lng: 77.2674,
    category: 'POWER & CNI',
    severity: 'LOW',
    color: '#818CF8', // Indigo
    riskScore: 35,
    confidence: 95.2,
    affectedPop: '120,000',
    telemetry: 'Phase balance telemetry detected 4.8% harmonic distortion. Auxiliary relay switched.',
    recommendation: 'Log telemetry to CNI security audit ledger.',
    forecast: 'Grid nominal, thermal dissipation normal',
  },
  {
    id: 'loc-kolkata',
    name: 'Kolkata Port & Hooghly Logistics Channel',
    lat: 22.5448,
    lng: 88.3426,
    category: 'CLIMATE',
    severity: 'HIGH',
    color: '#F97316',
    riskScore: 78,
    confidence: 91.0,
    affectedPop: '64,000',
    telemetry: 'Doppler radar indicates monsoon squall gusting at 55 km/h. Siltation telemetry active.',
    recommendation: 'Issue harbor pilot advisory & secure container cranes.',
    forecast: 'Squall passing within 2 hours',
  },
  {
    id: 'loc-hyderabad',
    name: 'Hyderabad Cyberabad Autonomous Corridor',
    lat: 17.4399,
    lng: 78.3908,
    category: 'TRAFFIC',
    severity: 'OPTIMAL',
    color: '#10B981', // Emerald
    riskScore: 18,
    confidence: 97.6,
    affectedPop: '95,000',
    telemetry: 'Adaptive traffic AI signals operating at 99.2% efficiency. Zero backlog detected.',
    recommendation: 'Maintain green-wave synchronization.',
    forecast: 'Optimal flow projected through peak hours',
  },
  {
    id: 'loc-chennai',
    name: 'Chennai Adyar River Drainage Siphon',
    lat: 13.0012,
    lng: 80.2565,
    category: 'CLIMATE',
    severity: 'MEDIUM',
    color: '#EAB308', // Yellow
    riskScore: 58,
    confidence: 89.4,
    affectedPop: '38,000',
    telemetry: 'River water level at 62% channel capacity. Inflow steady from upstream catchment.',
    recommendation: 'Keep automated dewatering pumps in standby mode.',
    forecast: 'Tide receding over next 3 hours',
  },
  {
    id: 'loc-ahmedabad',
    name: 'Ahmedabad Sabarmati Multi-Modal Terminal',
    lat: 23.0225,
    lng: 72.5714,
    category: 'HEALTHCARE',
    severity: 'OPTIMAL',
    color: '#10B981',
    riskScore: 22,
    confidence: 94.1,
    affectedPop: '50,000',
    telemetry: 'Air quality index 58 (Good). Hospital ICU bed occupancy at nominal 42%.',
    recommendation: 'Continue routine environmental telemetry sampling.',
    forecast: 'AQI forecast stable',
  },
]

// ── Strategic Corridors (Delhi-Mumbai, Delhi-Kolkata, Golden Quadrilateral) ──
const STRATEGIC_CORRIDORS = [
  // Delhi to Mumbai
  [
    [28.6315, 77.2167],
    [26.9124, 75.7873], // Jaipur
    [23.0225, 72.5714], // Ahmedabad
    [21.1702, 72.8311], // Surat
    [18.9894, 72.8258], // Mumbai
  ],
  // Mumbai to Bengaluru
  [
    [18.9894, 72.8258],
    [18.5204, 73.8567], // Pune
    [12.9352, 77.6245], // Bengaluru
  ],
  // Bengaluru to Chennai
  [
    [12.9352, 77.6245],
    [13.0012, 80.2565], // Chennai
  ],
  // Chennai to Hyderabad
  [
    [13.0012, 80.2565],
    [17.4399, 78.3908], // Hyderabad
  ],
  // Hyderabad to Delhi
  [
    [17.4399, 78.3908],
    [21.1458, 79.0882], // Nagpur
    [28.6315, 77.2167], // Delhi
  ],
]

// ── Map Viewport Controller Helper ────────────────────────────────
function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1.2 })
  }, [center, zoom, map])
  return null
}

/**
 * NPIG Master Interactive Geospatial Intelligence Map Component
 */
export default function InteractiveMap({
  isExpanded = false,
  onToggleExpand,
  className = '',
}) {
  const { theme } = useStore()
  const isLight = theme === 'light'

  const [mapStyle, setMapStyle] = useState('dark') // 'dark' | 'satellite' | 'voyager'
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [viewCenter, setViewCenter] = useState([22.5, 79.0])
  const [viewZoom, setViewZoom] = useState(5)

  // Map Tile Providers
  const tileUrl = useMemo(() => {
    if (mapStyle === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    }
    if (mapStyle === 'voyager' || (isLight && mapStyle !== 'dark')) {
      return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    }
    // Default Dark Matter
    return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  }, [mapStyle, isLight])

  const attribution = useMemo(() => {
    if (mapStyle === 'satellite') {
      return 'Tiles &copy; Esri &mdash; National Geographic, GIS User Community'
    }
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
  }, [mapStyle])

  const categories = ['ALL', 'CLIMATE', 'TRAFFIC', 'PUBLIC SAFETY', 'POWER & CNI', 'HEALTHCARE']

  const filteredLocations = useMemo(() => {
    if (activeCategory === 'ALL') return INTELLIGENCE_LOCATIONS
    return INTELLIGENCE_LOCATIONS.filter(l => l.category === activeCategory)
  }, [activeCategory])

  const handleResetView = () => {
    setViewCenter([22.5, 79.0])
    setViewZoom(5)
    setSelectedLocation(null)
  }

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc)
    setViewCenter([loc.lat, loc.lng])
    setViewZoom(7)
  }

  const handleActionDispatch = (loc) => {
    toast.success(`Autonomous Protocol Dispatched to ${loc.name}!`)
  }

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
        isExpanded ? 'h-[85vh] sm:h-[88vh]' : 'h-full min-h-[380px]'
      } ${className}`}
      style={{
        backgroundColor: isLight ? '#FFFFFF' : '#0B1020',
        borderColor: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)',
        boxShadow: isLight ? '0 10px 30px rgba(0,0,0,0.06)' : '0 16px 48px rgba(0,0,0,0.6)',
      }}
    >
      {/* ── Top Floating Intelligence Controls Bar ── */}
      <div className="absolute top-3 inset-x-3 z-[450] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Domain Filter Badges */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/85 dark:bg-[#0B1020]/90 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right: Map Style & Expand Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Map Layer Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/85 dark:bg-[#0B1020]/90 backdrop-blur-md border border-white/10 shadow-lg">
            <button
              onClick={() => setMapStyle(mapStyle === 'dark' ? 'satellite' : mapStyle === 'satellite' ? 'voyager' : 'dark')}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              title="Toggle Map Style (Dark / Satellite / Voyager)"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="capitalize">{mapStyle}</span>
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors ml-1"
              title="Reset View to National Center"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>

          {/* Fullscreen Expand Trigger */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="p-2 rounded-xl bg-slate-900/85 dark:bg-[#0B1020]/90 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white shadow-lg transition-transform hover:scale-105"
              title={isExpanded ? 'Collapse Map' : 'Expand to Fullscreen'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-indigo-400" />}
            </button>
          )}

        </div>

      </div>

      {/* ── Main Leaflet Map Canvas ── */}
      <div className="w-full flex-1 relative z-0">
        <MapContainer
          center={viewCenter}
          zoom={viewZoom}
          zoomControl={false}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapController center={viewCenter} zoom={viewZoom} />
          
          <ZoomControl position="bottomright" />

          {/* Base Tile Layer */}
          <TileLayer
            key={tileUrl}
            url={tileUrl}
            attribution={attribution}
            maxZoom={18}
          />

          {/* Strategic National Transport & Power Corridors */}
          {STRATEGIC_CORRIDORS.map((corridor, idx) => (
            <Polyline
              key={idx}
              positions={corridor}
              pathOptions={{
                color: '#6366F1',
                weight: 2,
                opacity: 0.6,
                dashArray: '6, 8',
              }}
            />
          ))}

          {/* Geographically Accurate Intelligence Beacons */}
          {filteredLocations.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id

            return (
              <CircleMarker
                key={loc.id}
                center={[loc.lat, loc.lng]}
                radius={isSelected ? 10 : loc.severity === 'CRITICAL' ? 8 : 6}
                pathOptions={{
                  color: loc.color,
                  fillColor: loc.color,
                  fillOpacity: 0.85,
                  weight: isSelected ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => handleSelectLocation(loc),
                }}
              >
                <Popup className="npig-leaflet-popup">
                  <div className="p-4 w-72 max-w-sm text-white">
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0"
                          style={{ backgroundColor: loc.color }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                          {loc.category}
                        </span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase"
                        style={{
                          backgroundColor: `${loc.color}25`,
                          color: loc.color,
                          border: `1px solid ${loc.color}50`,
                        }}
                      >
                        {loc.severity}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white leading-snug mb-1">
                      {loc.name}
                    </h4>

                    <p className="text-[11px] text-slate-300 font-light mb-3 leading-relaxed">
                      {loc.telemetry}
                    </p>

                    <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-white/5 border border-white/8 text-center text-xs mb-3 font-mono">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase">Risk Level</div>
                        <div className="font-bold text-emerald-400">{loc.riskScore}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase">Confidence</div>
                        <div className="font-bold text-sky-400">{loc.confidence}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleActionDispatch(loc)}
                        className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-all shadow-md"
                      >
                        Mitigate Incident →
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      {/* ── Bottom Live Telemetry HUD Strip ── */}
      <div className="p-3.5 bg-slate-900/90 dark:bg-[#0B1020]/95 backdrop-blur-md border-t border-white/10 z-[450] flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Active Threat Indicator */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="font-semibold text-white font-mono text-[11px]">
            {filteredLocations.length} Active Intelligence Nodes Monitored
          </span>
          <span className="text-slate-500 hidden sm:inline">·</span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">
            National Grid Telemetry Synchronized
          </span>
        </div>

        {/* Right: Selected Node Details or Quick Action */}
        {selectedLocation ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-indigo-400 font-medium">
              Selected: <strong className="text-white">{selectedLocation.name.split('(')[0]}</strong>
            </span>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-[10px] text-slate-400 hover:text-white underline"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical (1)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> High (2)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Optimal (3)</span>
          </div>
        )}

      </div>

    </div>
  )
}
