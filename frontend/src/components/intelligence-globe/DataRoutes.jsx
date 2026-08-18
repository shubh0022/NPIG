import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { latLngToVector3 } from '../../data/intelligenceGlobeData'

/**
 * Calculates elevated 3D great circle Bezier points between two sphere points
 */
function getArcCurve(p1, p2, radius, segments = 48) {
  const v1 = new THREE.Vector3(...p1)
  const v2 = new THREE.Vector3(...p2)

  // Midpoint chord vector
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5)
  const normal = mid.clone().normalize()

  const dist = v1.distanceTo(v2)
  // Subtle elevation proportional to distance (max 0.28 radius)
  const arcHeight = Math.min(dist * 0.28, radius * 0.35)
  const controlPoint = mid.clone().addScaledVector(normal, arcHeight)

  const curve = new THREE.QuadraticBezierCurve3(v1, controlPoint, v2)
  return {
    curve,
    points: curve.getPoints(segments),
  }
}

/**
 * Single Animated Data Route Arc with traveling photon pulse
 */
function SingleDataRoute({ route, nodeMap, radius, theme }) {
  const fromNode = nodeMap[route.from]
  const toNode = nodeMap[route.to]
  const isLight = theme === 'light'
  const photonRef1 = useRef()
  const photonRef2 = useRef()
  const lineRef = useRef()

  const p1 = useMemo(() => {
    return fromNode ? latLngToVector3(fromNode.lat, fromNode.lng, radius * 1.005) : [0, 0, 0]
  }, [fromNode, radius])

  const p2 = useMemo(() => {
    return toNode ? latLngToVector3(toNode.lat, toNode.lng, radius * 1.005) : [0, 0, 0]
  }, [toNode, radius])

  const { curve, points } = useMemo(() => {
    return getArcCurve(p1, p2, radius)
  }, [p1, p2, radius])

  const positions = useMemo(() => {
    const arr = new Float32Array(points.length * 3)
    points.forEach((pt, i) => {
      arr[i * 3] = pt.x
      arr[i * 3 + 1] = pt.y
      arr[i * 3 + 2] = pt.z
    })
    return arr
  }, [points])

  // Animation of traveling photon energy packets
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    // Slow and elegant speed (0.12)
    const t1 = ((elapsed * 0.14) + (route.delay || 0)) % 1.0
    const t2 = ((elapsed * 0.14) + (route.delay || 0) + 0.5) % 1.0

    if (photonRef1.current && curve) {
      const pos1 = curve.getPointAt(t1)
      photonRef1.current.position.set(pos1.x, pos1.y, pos1.z)
      // Pulse scale slightly
      const s = 1 + Math.sin(t1 * Math.PI) * 0.5
      photonRef1.current.scale.set(s, s, s)
    }

    if (photonRef2.current && curve) {
      const pos2 = curve.getPointAt(t2)
      photonRef2.current.position.set(pos2.x, pos2.y, pos2.z)
      const s = 1 + Math.sin(t2 * Math.PI) * 0.4
      photonRef2.current.scale.set(s, s, s)
    }

    if (lineRef.current) {
      // Subtle traveling dash pulse
      lineRef.current.material.dashOffset = -(elapsed * 0.25 + (route.delay || 0)) % 2
    }
  })

  if (!fromNode || !toNode) return null

  const arcColor = isLight ? '#6366F1' : (fromNode.color || '#38BDF8')

  return (
    <group>
      {/* 3D Arc Line */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <lineDashedMaterial
          color={arcColor}
          dashSize={0.35}
          gapSize={0.15}
          transparent
          opacity={isLight ? 0.45 : 0.4}
          linewidth={1}
          depthWrite={false}
        />
      </line>

      {/* Primary Traveling Photon Energy Packet */}
      <mesh ref={photonRef1}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial
          color="#FFFFFF"
          toneMapped={false}
        />
      </mesh>

      {/* Secondary Trailing Photon */}
      <mesh ref={photonRef2}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial
          color={arcColor}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/**
 * Data Routes Manager Component
 */
export default function DataRoutes({
  routes = [],
  nodes = [],
  radius = 2.5,
  theme = 'dark',
}) {
  const nodeMap = useMemo(() => {
    const map = {}
    nodes.forEach(n => { map[n.id] = n })
    return map
  }, [nodes])

  return (
    <group>
      {routes.map((route, idx) => (
        <SingleDataRoute
          key={`${route.from}-${route.to}-${idx}`}
          route={route}
          nodeMap={nodeMap}
          radius={radius}
          theme={theme}
        />
      ))}
    </group>
  )
}
