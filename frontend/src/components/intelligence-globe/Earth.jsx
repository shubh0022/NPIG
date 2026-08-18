import React, { useMemo, useEffect } from 'react'
import * as THREE from 'three'

/**
 * High-accuracy Continental Polygonal Data (Equirectangular normalized coordinates)
 * [lon (-180..180), lat (-90..90)]
 */
const CONTINENTS = [
  // Indian Subcontinent & South Asia
  [
    [68, 24], [70, 21], [72.8, 19], [74, 15], [75, 12], [77.5, 8], [79, 9.5], 
    [80.3, 13], [82, 17], [85, 19.5], [88.3, 22], [90, 22], [91, 24], [92, 21],
    [92.5, 26], [88, 27.5], [85, 28], [80, 30], [75, 35], [72, 36], [68, 30], [68, 24]
  ],
  // Sri Lanka
  [
    [79.8, 9.8], [81.8, 8.5], [81.5, 6.5], [80.2, 6.0], [79.6, 7.5], [79.8, 9.8]
  ],
  // Eurasia / Europe / Middle East / North & Central Asia
  [
    [-9, 36], [-9, 43], [0, 43], [4, 48], [-4, 48], [-5, 54], [0, 58], [8, 55],
    [10, 58], [24, 60], [30, 70], [60, 75], [100, 78], [140, 75], [170, 68],
    [180, 65], [170, 60], [142, 53], [130, 42], [122, 38], [120, 32], [118, 24],
    [108, 21], [105, 10], [100, 14], [98, 8], [104, 1.3], [100, 4], [96, 17],
    [92, 21], [90, 24], [88, 22], [82, 17], [77, 8], [72, 19], [68, 24],
    [60, 25], [55, 25], [51, 25], [44, 13], [43, 12], [35, 28], [35, 36],
    [26, 40], [15, 40], [12, 45], [-3, 40], [-9, 36]
  ],
  // Japan
  [
    [130, 31], [132, 34], [136, 35], [140, 40], [141, 44], [145, 44], [140, 36], [131, 31], [130, 31]
  ],
  // Southeast Asia & Indonesia / Philippines / Malaysia
  [
    [95, 5], [105, -6], [115, -8], [125, -9], [130, -5], [120, 0], [117, 7], [108, 2], [95, 5]
  ],
  [
    [120, 18], [125, 14], [126, 7], [122, 6], [120, 12], [120, 18]
  ],
  // Africa
  [
    [-17, 15], [-17, 21], [-5, 36], [10, 37], [25, 32], [32, 31], [35, 28],
    [43, 12], [51, 11], [42, -5], [40, -15], [35, -24], [32, -28], [28, -33],
    [18, -34], [12, -17], [9, -4], [4, 4], [-4, 5], [-12, 8], [-17, 15]
  ],
  // Madagascar
  [
    [49, -12], [50, -16], [47, -25], [43, -25], [44, -18], [49, -12]
  ],
  // Australia & New Zealand
  [
    [113, -22], [115, -34], [122, -34], [135, -35], [146, -39], [151, -34],
    [153, -28], [146, -19], [142, -11], [136, -12], [130, -13], [125, -15], [113, -22]
  ],
  [
    [166, -46], [174, -41], [178, -38], [173, -35], [166, -46]
  ],
  // North America
  [
    [-168, 65], [-160, 71], [-130, 70], [-90, 70], [-80, 60], [-60, 50],
    [-65, 44], [-75, 35], [-80, 25], [-82, 23], [-90, 30], [-97, 26],
    [-98, 19], [-88, 16], [-83, 9], [-77, 8], [-80, 15], [-105, 20],
    [-110, 24], [-117, 32], [-124, 40], [-125, 50], [-140, 60], [-168, 65]
  ],
  // South America
  [
    [-77, 8], [-72, 11], [-60, 10], [-50, 0], [-35, -5], [-35, -12],
    [-40, -22], [-50, -30], [-55, -40], [-65, -54], [-75, -50], [-73, -40],
    [-71, -30], [-80, -5], [-80, 2], [-77, 8]
  ],
  // United Kingdom & Ireland
  [
    [-5, 50], [1.5, 51], [0, 54], [-2, 58], [-5, 58], [-5, 54], [-5, 50]
  ],
  [
    [-10, 51], [-6, 52], [-6, 55], [-10, 54], [-10, 51]
  ],
  // Scandinavia
  [
    [5, 58], [12, 58], [18, 60], [28, 70], [24, 71], [15, 68], [5, 62], [5, 58]
  ],
]

/**
 * Major urban center coordinates for realistic night city-light clusters
 */
const CITY_LIGHTS = [
  // India & South Asia
  { lng: 77.2, lat: 28.6, r: 10, i: 1.0 },    // Delhi NCR
  { lng: 72.8, lat: 19.0, r: 9, i: 0.95 },   // Mumbai
  { lng: 77.6, lat: 12.9, r: 9, i: 0.95 },   // Bengaluru
  { lng: 78.5, lat: 17.4, r: 8, i: 0.9 },    // Hyderabad
  { lng: 80.3, lat: 13.1, r: 8, i: 0.85 },   // Chennai
  { lng: 88.4, lat: 22.6, r: 8, i: 0.85 },   // Kolkata
  { lng: 72.6, lat: 23.0, r: 7, i: 0.8 },    // Ahmedabad
  { lng: 73.8, lat: 18.5, r: 7, i: 0.8 },    // Pune
  { lng: 67.0, lat: 24.8, r: 8, i: 0.8 },    // Karachi
  { lng: 74.3, lat: 31.5, r: 7, i: 0.75 },   // Lahore
  { lng: 90.4, lat: 23.8, r: 7, i: 0.75 },   // Dhaka
  { lng: 79.8, lat: 6.9, r: 6, i: 0.7 },     // Colombo

  // Southeast Asia & East Asia
  { lng: 103.8, lat: 1.3, r: 9, i: 0.95 },   // Singapore
  { lng: 100.5, lat: 13.7, r: 8, i: 0.85 },  // Bangkok
  { lng: 101.7, lat: 3.1, r: 7, i: 0.8 },    // Kuala Lumpur
  { lng: 106.8, lat: -6.2, r: 8, i: 0.8 },   // Jakarta
  { lng: 121.5, lat: 31.2, r: 10, i: 0.95 }, // Shanghai
  { lng: 116.4, lat: 39.9, r: 10, i: 0.95 }, // Beijing
  { lng: 113.2, lat: 23.1, r: 9, i: 0.9 },   // Shenzhen
  { lng: 114.1, lat: 22.3, r: 9, i: 0.95 },  // Hong Kong
  { lng: 139.7, lat: 35.7, r: 11, i: 1.0 },  // Tokyo
  { lng: 135.5, lat: 34.7, r: 9, i: 0.9 },   // Osaka
  { lng: 127.0, lat: 37.5, r: 9, i: 0.95 },  // Seoul

  // Middle East
  { lng: 55.3, lat: 25.2, r: 10, i: 0.95 },  // Dubai
  { lng: 54.4, lat: 24.5, r: 7, i: 0.8 },    // Abu Dhabi
  { lng: 46.7, lat: 24.7, r: 8, i: 0.85 },   // Riyadh
  { lng: 51.5, lat: 25.3, r: 7, i: 0.8 },    // Doha

  // Europe
  { lng: -0.1, lat: 51.5, r: 10, i: 0.95 },  // London
  { lng: 2.3, lat: 48.8, r: 9, i: 0.9 },     // Paris
  { lng: 13.4, lat: 52.5, r: 8, i: 0.85 },   // Berlin
  { lng: 4.9, lat: 52.4, r: 8, i: 0.85 },    // Amsterdam

  // North America
  { lng: -74.0, lat: 40.7, r: 11, i: 1.0 },  // New York
  { lng: -118.2, lat: 34.0, r: 10, i: 0.95 },// Los Angeles
  { lng: -122.4, lat: 37.8, r: 9, i: 0.9 },  // San Francisco
  { lng: -87.6, lat: 41.8, r: 9, i: 0.9 },   // Chicago
]

/**
 * Creates high-resolution procedural Earth texture matching Dark or Light mode
 */
function createEarthCanvasTexture(isLightMode) {
  const width = 2048
  const height = 1024
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // 1. Ocean Background Fill
  if (isLightMode) {
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height)
    oceanGrad.addColorStop(0, '#E2E8F0')
    oceanGrad.addColorStop(0.5, '#CBD5E1')
    oceanGrad.addColorStop(1, '#E2E8F0')
    ctx.fillStyle = oceanGrad
    ctx.fillRect(0, 0, width, height)
  } else {
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height)
    oceanGrad.addColorStop(0, '#040816')
    oceanGrad.addColorStop(0.5, '#060D20')
    oceanGrad.addColorStop(1, '#040816')
    ctx.fillStyle = oceanGrad
    ctx.fillRect(0, 0, width, height)
  }

  // 2. Continental Landmasses
  CONTINENTS.forEach(poly => {
    ctx.beginPath()
    poly.forEach(([lng, lat], idx) => {
      const x = ((lng + 180) / 360) * width
      const y = ((90 - lat) / 180) * height
      if (idx === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()

    if (isLightMode) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
      ctx.strokeStyle = '#6366F1'
      ctx.lineWidth = 2.5
      ctx.stroke()
    } else {
      ctx.fillStyle = '#0B132B'
      ctx.fill()
      ctx.strokeStyle = '#38BDF8'
      ctx.lineWidth = 1.6
      ctx.shadowColor = 'rgba(56, 189, 248, 0.5)'
      ctx.shadowBlur = 3
      ctx.stroke()
      ctx.shadowBlur = 0
    }
  })

  // 3. Realistic Urban Night-Light Clusters (especially in dark mode)
  if (!isLightMode) {
    CITY_LIGHTS.forEach(({ lng, lat, r, i }) => {
      const x = ((lng + 180) / 360) * width
      const y = ((90 - lat) / 180) * height

      const radGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.0)
      radGrad.addColorStop(0, `rgba(56, 189, 248, ${0.95 * i})`)
      radGrad.addColorStop(0.3, `rgba(99, 102, 241, ${0.6 * i})`)
      radGrad.addColorStop(0.7, `rgba(56, 189, 248, ${0.15 * i})`)
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = radGrad
      ctx.beginPath()
      ctx.arc(x, y, r * 2.0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * i})`
      ctx.beginPath()
      ctx.arc(x, y, Math.max(1.2, r * 0.22), 0, Math.PI * 2)
      ctx.fill()
    })
  } else {
    CITY_LIGHTS.slice(0, 20).forEach(({ lng, lat, r }) => {
      const x = ((lng + 180) / 360) * width
      const y = ((90 - lat) / 180) * height

      ctx.fillStyle = 'rgba(99, 102, 241, 0.35)'
      ctx.beginPath()
      ctx.arc(x, y, Math.max(2, r * 0.25), 0, Math.PI * 2)
      ctx.fill()
    })
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

/**
 * Earth 3D Mesh Component
 */
export default function Earth({ radius = 2.1, theme = 'dark' }) {
  const isLight = theme === 'light'

  const earthTexture = useMemo(() => {
    return createEarthCanvasTexture(isLight)
  }, [isLight])

  useEffect(() => {
    return () => {
      if (earthTexture) earthTexture.dispose()
    }
  }, [earthTexture])

  return (
    <group>
      {/* Base Earth Sphere */}
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={isLight ? 0.55 : 0.45}
          metalness={isLight ? 0.05 : 0.2}
          emissive={isLight ? new THREE.Color('#000000') : new THREE.Color('#081426')}
          emissiveIntensity={isLight ? 0 : 0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Inner Atmospheric Specular Depth Layer */}
      <mesh scale={1.002}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={isLight ? '#6366F1' : '#38BDF8'}
          transparent
          opacity={isLight ? 0.03 : 0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
          roughness={0.9}
        />
      </mesh>
    </group>
  )
}
