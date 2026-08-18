import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Atmosphere Shader Component
 * Emits a soft, elegant Fresnel rim glow around the globe.
 * Seamlessly integrates with the dark navy background in dark mode and pearl/sky in light mode.
 */
export default function Atmosphere({ radius = 2.1, theme = 'dark' }) {
  const isLight = theme === 'light'

  const customAtmosphereMaterial = useMemo(() => {
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform vec3 uColor;
      uniform float uCoefficient;
      uniform float uPower;
      uniform float uOpacity;

      void main() {
        vec3 viewDir = normalize(-vPosition);
        float fresnel = dot(vNormal, viewDir);
        fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
        float intensity = pow(fresnel, uPower) * uCoefficient;
        gl_FragColor = vec4(uColor, intensity * uOpacity);
      }
    `

    const uniforms = {
      uColor: {
        value: isLight
          ? new THREE.Color('#6366F1')
          : new THREE.Color('#38BDF8')
      },
      uCoefficient: { value: isLight ? 0.35 : 0.7 },
      uPower: { value: isLight ? 3.8 : 3.2 },
      uOpacity: { value: isLight ? 0.2 : 0.5 },
    }

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    })
  }, [isLight])

  return (
    <group>
      {/* Outer Atmospheric Haze (BackSide) */}
      <mesh scale={1.14} material={customAtmosphereMaterial}>
        <sphereGeometry args={[radius, 48, 48]} />
      </mesh>

      {/* Secondary Soft Ambient Bloom Ring */}
      <mesh scale={1.06}>
        <sphereGeometry args={[radius, 36, 36]} />
        <meshBasicMaterial
          color={isLight ? '#818CF8' : '#1E40AF'}
          transparent
          opacity={isLight ? 0.02 : 0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
