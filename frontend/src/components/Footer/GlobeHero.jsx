import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// City nodes in India with lat/lng
const CITIES = [
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090, status: 'Active', color: '#60a5fa' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, status: 'Active', color: '#34d399' },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, status: 'Optimal', color: '#a78bfa' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, status: 'Active', color: '#f43f5e' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, status: 'Optimal', color: '#fbbf24' },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, status: 'Active', color: '#2dd4bf' },
];

// Helper to convert lat/lng to Vector3 on a sphere of radius R
function getVertex(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  return new THREE.Vector3(x, y, z);
}

// Generate curve points between two Vector3s
function getCurvePoints(p1, p2, radius, segments = 30) {
  const points = [];
  const cb = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const normal = new THREE.Vector3();

  // Get middle point of chord
  cb.addVectors(p1, p2).multiplyScalar(0.5);
  // Get vector from center to middle point
  normal.copy(cb).normalize();

  // Distance between points
  const dist = p1.distanceTo(p2);
  // Height of arc proportional to distance
  const height = dist * 0.25;

  // Middle point of curve
  const midPoint = new THREE.Vector3().copy(cb).addScaledVector(normal, height);

  // Generate quadratic bezier points
  const curve = new THREE.QuadraticBezierCurve3(p1, midPoint, p2);
  return curve.getPoints(segments);
}

// Renders the glowing connection arcs
function ConnectionArc({ start, end, radius, color, delay }) {
  const curvePoints = useMemo(() => getCurvePoints(start, end, radius), [start, end, radius]);
  const lineRef = useRef();

  useFrame((state) => {
    if (lineRef.current) {
      // Create a traveling pulse effect using dash offset or material properties
      const time = state.clock.getElapsedTime();
      const dashOffset = -(time * 0.4 + delay) % 2;
      lineRef.current.material.dashOffset = dashOffset;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(curvePoints.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineDashedMaterial
        color={color}
        dashSize={0.4}
        gapSize={0.2}
        transparent
        opacity={0.6}
        linewidth={1}
      />
    </line>
  );
}

// Earth Globe Component
function Globe({ activeCity, setActiveCity }) {
  const globeRef = useRef();
  const radius = 2.5;

  useFrame((state) => {
    if (globeRef.current) {
      // Slow automatic rotation
      globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  const cityVertices = useMemo(() => {
    return CITIES.map(c => ({
      ...c,
      pos: getVertex(c.lat, c.lng, radius)
    }));
  }, [radius]);

  const connections = useMemo(() => {
    const list = [];
    // Link New Delhi to all other cities for demonstration of a hub-spoke model
    const hub = cityVertices[0]; // New Delhi
    for (let i = 1; i < cityVertices.length; i++) {
      list.push({
        id: i,
        start: hub.pos,
        end: cityVertices[i].pos,
        color: cityVertices[i].color,
        delay: i * 0.3
      });
    }
    // Connect Mumbai to Bengaluru as well
    if (cityVertices[1] && cityVertices[2]) {
      list.push({
        id: 99,
        start: cityVertices[1].pos,
        end: cityVertices[2].pos,
        color: '#fbbf24',
        delay: 0.8
      });
    }
    return list;
  }, [cityVertices]);

  return (
    <group ref={globeRef}>
      {/* Ambient outer atmospheric glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[radius, 40, 40]} />
        <meshBasicMaterial
          color="#1e3a8a"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Earth grid wireframe */}
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color="#1e40af"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Earth continents/texture placeholder structure */}
      <mesh>
        <sphereGeometry args={[radius * 0.99, 24, 24]} />
        <meshStandardMaterial
          color="#030712"
          transparent
          opacity={0.85}
          roughness={0.9}
        />
      </mesh>

      {/* Animated Connection Arcs */}
      {connections.map(conn => (
        <ConnectionArc
          key={conn.id}
          start={conn.start}
          end={conn.end}
          radius={radius}
          color={conn.color}
          delay={conn.delay}
        />
      ))}

      {/* City Nodes */}
      {cityVertices.map((city, idx) => (
        <mesh
          key={city.name}
          position={city.pos}
          onPointerOver={(e) => {
            e.stopPropagation();
            setActiveCity(city);
          }}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial
            color={city.color}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main GlobeHero component containing Canvas and telemetry overlays
export default function GlobeHero() {
  const [activeCity, setActiveCity] = useState(CITIES[0]);

  return (
    <div className="relative w-full h-[550px] md:h-[650px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#030712]/80 to-[#020617]/95 border border-white/[0.06] backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between p-6 md:p-12">
      {/* Decorative Grid Overlays */}
      <div className="absolute inset-0 bg-grid-dark bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      
      {/* Telemetry Panel (Left side) */}
      <div className="relative z-10 w-full md:w-[40%] flex flex-col justify-center text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          Globe Live Network Link
        </div>

        <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
          National Predictive Grid Uplink
        </h3>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Real-time cyber telemetry mapping prediction vectors across major metropolitan nodes. Hover on any active city node on the interactive 3D grid to sync secure details.
        </p>

        {/* Dynamic City Telemetry Details Card */}
        <div className="glass-card p-5 border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl rounded-2xl shadow-lg relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: activeCity.color }} />
          
          <div className="flex justify-between items-center mb-3 pl-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selected Node</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5" style={{ color: activeCity.color }}>
              {activeCity.status}
            </span>
          </div>

          <div className="text-xl font-bold text-white mb-2 pl-2">
            {activeCity.name} Sector
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pl-2 font-mono text-[11px] text-slate-400">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Uplink Latency</p>
              <p className="text-white font-bold">{(Math.random() * 5 + 2).toFixed(1)} ms</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Load Factor</p>
              <p className="text-white font-bold">{(Math.random() * 20 + 35).toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Threat Level</p>
              <p className="text-emerald-400 font-bold">MINIMAL</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Coordinate Ref</p>
              <p className="text-white font-bold">{activeCity.lat.toFixed(2)}°N, {activeCity.lng.toFixed(2)}°E</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas (Right side) */}
      <div className="relative w-full md:w-[55%] h-[300px] md:h-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} className="w-full h-full">
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 2]} intensity={1.5} color="#60a5fa" />
          <pointLight position={[-5, -5, -2]} intensity={0.8} color="#a78bfa" />
          <Stars radius={100} depth={40} count={600} factor={4} saturation={0} fade speed={0.5} />
          <Globe activeCity={activeCity} setActiveCity={setActiveCity} />
        </Canvas>

        {/* Subtle grid indicator overlay */}
        <div className="absolute bottom-4 right-4 pointer-events-none bg-black/40 border border-white/5 backdrop-blur-md rounded px-2.5 py-1 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          3D Globe Interactive Layer v2.7
        </div>
      </div>
    </div>
  );
}
