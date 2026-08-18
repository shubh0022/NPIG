import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Network Layer Component
 * Generates restrained, thin latitude/longitude graticule lines and key regional corridor boundaries.
 */
export default function NetworkLayer({ radius = 2.5, theme = 'dark' }) {
  const isLight = theme === 'light'

  const { graticuleGeometry, equatorGeometry, regionalCorridorsGeometry } = useMemo(() => {
    const r = radius * 1.003 // Floating slightly above surface to prevent z-fighting
    const graticulePoints = []
    const equatorPoints = []
    const corridorPoints = []

    // 1. Latitude parallels (every 30 degrees, plus tropics ±23.5)
    const latitudes = [-60, -30, -23.5, 30, 23.5, 60]
    latitudes.forEach(lat => {
      const phi = (90 - lat) * (Math.PI / 180)
      const segments = 72
      for (let i = 0; i < segments; i++) {
        const theta1 = (i / segments) * Math.PI * 2
        const theta2 = ((i + 1) / segments) * Math.PI * 2

        const x1 = -(r * Math.sin(phi) * Math.sin(theta1))
        const y1 = r * Math.cos(phi)
        const z1 = r * Math.sin(phi) * Math.cos(theta1)

        const x2 = -(r * Math.sin(phi) * Math.sin(theta2))
        const y2 = r * Math.cos(phi)
        const z2 = r * Math.sin(phi) * Math.cos(theta2)

        graticulePoints.push(x1, y1, z1, x2, y2, z2)
      }
    })

    // 2. Equator (Highlight line)
    const eqPhi = 90 * (Math.PI / 180)
    for (let i = 0; i < 90; i++) {
      const theta1 = (i / 90) * Math.PI * 2
      const theta2 = ((i + 1) / 90) * Math.PI * 2

      const x1 = -(r * Math.sin(eqPhi) * Math.sin(theta1))
      const y1 = r * Math.cos(eqPhi)
      const z1 = r * Math.sin(eqPhi) * Math.cos(theta1)

      const x2 = -(r * Math.sin(eqPhi) * Math.sin(theta2))
      const y2 = r * Math.cos(eqPhi)
      const z2 = r * Math.sin(eqPhi) * Math.cos(theta2)

      equatorPoints.push(x1, y1, z1, x2, y2, z2)
    }

    // 3. Longitude meridians (every 45 degrees for low network density)
    for (let lng = -180; lng < 180; lng += 45) {
      const theta = (lng + 180) * (Math.PI / 180)
      const segments = 60
      for (let i = 0; i < segments; i++) {
        const phi1 = (i / segments) * Math.PI
        const phi2 = ((i + 1) / segments) * Math.PI

        const x1 = -(r * Math.sin(phi1) * Math.sin(theta))
        const y1 = r * Math.cos(phi1)
        const z1 = r * Math.sin(phi1) * Math.cos(theta)

        const x2 = -(r * Math.sin(phi2) * Math.sin(theta))
        const y2 = r * Math.cos(phi2)
        const z2 = r * Math.sin(phi2) * Math.cos(theta)

        graticulePoints.push(x1, y1, z1, x2, y2, z2)
      }
    }

    // 4. Regional Strategic Corridor Circles (e.g. Indian Ocean & Maritime Corridor)
    const corridors = [
      { centerLat: 20, centerLng: 78, radiusDeg: 14 }, // Indian National Core Corridor
      { centerLat: 1.3, centerLng: 103.8, radiusDeg: 8 }, // Malacca Straits / Indo-Pacific Hub
      { centerLat: 25, centerLng: 55, radiusDeg: 9 },   // Arabian Gulf Gateway
    ]

    corridors.forEach(({ centerLat, centerLng, radiusDeg }) => {
      const phiCenter = (90 - centerLat) * (Math.PI / 180)
      const thetaCenter = (centerLng + 180) * (Math.PI / 180)
      const centerVec = new THREE.Vector3(
        -(r * Math.sin(phiCenter) * Math.sin(thetaCenter)),
        r * Math.cos(phiCenter),
        r * Math.sin(phiCenter) * Math.cos(thetaCenter)
      ).normalize()

      // Create tangent ring
      const up = Math.abs(centerVec.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
      const tangent1 = new THREE.Vector3().crossVectors(centerVec, up).normalize()
      const tangent2 = new THREE.Vector3().crossVectors(centerVec, tangent1).normalize()

      const ringRadius = Math.sin(radiusDeg * (Math.PI / 180)) * r
      const ringDist = Math.cos(radiusDeg * (Math.PI / 180)) * r
      const ringCenter = centerVec.clone().multiplyScalar(ringDist)

      const segments = 36
      for (let i = 0; i < segments; i++) {
        const a1 = (i / segments) * Math.PI * 2
        const a2 = ((i + 1) / segments) * Math.PI * 2

        const p1 = ringCenter.clone()
          .addScaledVector(tangent1, Math.cos(a1) * ringRadius)
          .addScaledVector(tangent2, Math.sin(a1) * ringRadius)

        const p2 = ringCenter.clone()
          .addScaledVector(tangent1, Math.cos(a2) * ringRadius)
          .addScaledVector(tangent2, Math.sin(a2) * ringRadius)

        corridorPoints.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z)
      }
    })

    const gGeo = new THREE.BufferGeometry()
    gGeo.setAttribute('position', new THREE.Float32BufferAttribute(graticulePoints, 3))

    const eqGeo = new THREE.BufferGeometry()
    eqGeo.setAttribute('position', new THREE.Float32BufferAttribute(equatorPoints, 3))

    const corrGeo = new THREE.BufferGeometry()
    corrGeo.setAttribute('position', new THREE.Float32BufferAttribute(corridorPoints, 3))

    return {
      graticuleGeometry: gGeo,
      equatorGeometry: eqGeo,
      regionalCorridorsGeometry: corrGeo,
    }
  }, [radius])

  return (
    <group>
      {/* Standard Graticule Lines */}
      <lineSegments geometry={graticuleGeometry}>
        <lineBasicMaterial
          color={isLight ? '#94A3B8' : '#38BDF8'}
          transparent
          opacity={isLight ? 0.18 : 0.12}
          depthWrite={false}
        />
      </lineSegments>

      {/* Subtle Equator Reference Line */}
      <lineSegments geometry={equatorGeometry}>
        <lineBasicMaterial
          color={isLight ? '#6366F1' : '#60A5FA'}
          transparent
          opacity={isLight ? 0.35 : 0.22}
          depthWrite={false}
        />
      </lineSegments>

      {/* Strategic Regional Intelligence Corridors */}
      <lineSegments geometry={regionalCorridorsGeometry}>
        <lineBasicMaterial
          color={isLight ? '#4F46E5' : '#818CF8'}
          transparent
          opacity={isLight ? 0.3 : 0.25}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}
