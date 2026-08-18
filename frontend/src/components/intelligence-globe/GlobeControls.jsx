import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Globe Interaction Controller
 * Manages slow automatic rotation, drag orbit manipulation with inertia, hover damping,
 * touch gestures, and accessibility (prefers-reduced-motion).
 */
export default function GlobeControls({
  children,
  isHovered = false,
  isInteractingModal = false,
}) {
  const groupRef = useRef()
  const { gl } = useThree()

  const [isDragging, setIsDragging] = useState(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const rotationVelocity = useRef({ x: 0, y: 0.001 })
  const prefersReducedMotion = useRef(false)

  // Check user prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mediaQuery.matches

    const handler = (e) => {
      prefersReducedMotion.current = e.matches
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Pointer drag event handlers
  useEffect(() => {
    const domElement = gl.domElement

    const handlePointerDown = (e) => {
      setIsDragging(true)
      previousMousePosition.current = {
        x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
        y: e.clientY || (e.touches && e.touches[0].clientY) || 0,
      }
    }

    const handlePointerMove = (e) => {
      if (!isDragging) return
      const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0
      const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0

      const deltaX = currentX - previousMousePosition.current.x
      const deltaY = currentY - previousMousePosition.current.y

      // Calculate rotational velocity from drag delta
      rotationVelocity.current = {
        x: deltaY * 0.003,
        y: deltaX * 0.003,
      }

      if (groupRef.current) {
        groupRef.current.rotation.y += deltaX * 0.004
        groupRef.current.rotation.x = Math.max(
          -Math.PI / 4,
          Math.min(Math.PI / 4, groupRef.current.rotation.x + deltaY * 0.004)
        )
      }

      previousMousePosition.current = { x: currentX, y: currentY }
    }

    const handlePointerUp = () => {
      setIsDragging(false)
    }

    domElement.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    domElement.addEventListener('touchstart', handlePointerDown, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })
    window.addEventListener('touchend', handlePointerUp)

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      domElement.removeEventListener('touchstart', handlePointerDown)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('touchend', handlePointerUp)
    }
  }, [gl, isDragging])

  // Animation frame update
  useFrame(() => {
    if (!groupRef.current) return

    // If reduced motion is preferred, pause auto-rotation
    if (prefersReducedMotion.current) return

    if (!isDragging) {
      // Slow auto-rotation speed (0.001 rad/frame)
      let targetSpeed = 0.001
      if (isInteractingModal) {
        targetSpeed = 0.0001
      } else if (isHovered) {
        targetSpeed = 0.00025
      }

      // Smoothly interpolate velocity
      rotationVelocity.current.y = THREE.MathUtils.lerp(
        rotationVelocity.current.y,
        targetSpeed,
        0.05
      )
      rotationVelocity.current.x = THREE.MathUtils.lerp(
        rotationVelocity.current.x,
        0,
        0.05
      )

      groupRef.current.rotation.y += rotationVelocity.current.y
      groupRef.current.rotation.x += rotationVelocity.current.x
    }
  })

  // Initial natural Earth axial tilt (23.4 degrees) and initial longitude alignment for South Asia
  return (
    <group ref={groupRef} rotation={[0.25, 4.8, 0]}>
      {children}
    </group>
  )
}
