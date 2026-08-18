import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { latLngToVector3, INTELLIGENCE_CATEGORIES } from '../../data/intelligenceGlobeData'

/**
 * Individual Animated Intelligence Beacon
 */
function IntelligenceBeacon({ node, radius, isHovered, isSelected, onHover, onSelect, theme }) {
  const pulseRef = useRef()
  const ringRef = useRef()
  const isLight = theme === 'light'

  // Position on globe
  const pos = useMemo(() => {
    return latLngToVector3(node.lat, node.lng, radius * 1.006)
  }, [node.lat, node.lng, radius])

  // Look-at normal for orienting the beacon flat against the sphere surface
  const normal = useMemo(() => {
    return new THREE.Vector3(...pos).normalize()
  }, [pos])

  // Beacon orientation quaternion
  const orientation = useMemo(() => {
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    return q
  }, [normal])

  // Restrained Pulsing Halo Animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 1.6 + (node.lat * 0.1)
    if (pulseRef.current) {
      const scale = 1 + (Math.sin(t) * 0.5 + 0.5) * 0.6
      pulseRef.current.scale.set(scale, scale, scale)
      pulseRef.current.material.opacity = (1 - (Math.sin(t) * 0.5 + 0.5)) * 0.5
    }
    if (ringRef.current) {
      const ringScale = 1 + ((t * 0.4) % 1) * 1.2
      ringRef.current.scale.set(ringScale, ringScale, ringScale)
      ringRef.current.material.opacity = Math.max(0, 0.6 - ((t * 0.4) % 1) * 0.6)
    }
  })

  const categoryConfig = INTELLIGENCE_CATEGORIES[node.category.toUpperCase()] || INTELLIGENCE_CATEGORIES.TRAFFIC
  const nodeColor = isLight ? categoryConfig.colorLight : (node.color || categoryConfig.colorDark)

  return (
    <group position={pos} quaternion={orientation}>
      {/* Invisible Interactive Hitbox for effortless hover / click */}
      <mesh
        visible={false}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(node)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          onHover(node, e)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'auto'
          onHover(null, e)
        }}
      >
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      {/* Core Luminous Point */}
      <mesh>
        <sphereGeometry args={[node.isPrimaryHub ? 0.038 : 0.028, 16, 16]} />
        <meshBasicMaterial
          color={nodeColor}
          toneMapped={false}
        />
      </mesh>

      {/* Pulsing Outer Halo Sphere */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial
          color={nodeColor}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Expanding Concentric Wave Ring */}
      <mesh ref={ringRef} position={[0, 0, 0.003]}>
        <ringGeometry args={[0.028, 0.045, 24]} />
        <meshBasicMaterial
          color={nodeColor}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Highlight ring when hovered or selected */}
      {(isHovered || isSelected) && (
        <mesh position={[0, 0, 0.008]}>
          <ringGeometry args={[0.05, 0.075, 32]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Subtle vertical elevation spike for primary hubs */}
      {node.isPrimaryHub && (
        <mesh position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.0025, 0.005, 0.08, 8]} />
          <meshBasicMaterial
            color={nodeColor}
            transparent
            opacity={0.65}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  )
}

/**
 * Intelligence Nodes Cluster
 */
export default function IntelligenceNodes({
  nodes = [],
  radius = 2.1,
  hoveredNode = null,
  selectedNode = null,
  onNodeHover = () => {},
  onNodeSelect = () => {},
  theme = 'dark',
}) {
  return (
    <group>
      {nodes.map((node) => (
        <IntelligenceBeacon
          key={node.id}
          node={node}
          radius={radius}
          isHovered={hoveredNode?.id === node.id}
          isSelected={selectedNode?.id === node.id}
          onHover={onNodeHover}
          onSelect={onNodeSelect}
          theme={theme}
        />
      ))}
    </group>
  )
}
