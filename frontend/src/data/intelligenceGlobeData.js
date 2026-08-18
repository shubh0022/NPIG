/**
 * NPIG Global Intelligence Visualization Data Layer
 * 
 * Geographic coordinates, typed intelligence nodes, data routes, and floating telemetry alerts.
 * All coordinates are geographically accurate (latitude, longitude).
 */

export const INTELLIGENCE_CATEGORIES = {
  TRAFFIC: {
    id: 'traffic',
    label: 'Traffic Intelligence',
    colorDark: '#38BDF8',   // Sky blue
    colorLight: '#0284C7',
    badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    icon: 'MapPin',
  },
  CLIMATE: {
    id: 'climate',
    label: 'Climate Intelligence',
    colorDark: '#34D399',   // Emerald
    colorLight: '#059669',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    icon: 'Droplets',
  },
  SECURITY: {
    id: 'security',
    label: 'Security Intelligence',
    colorDark: '#F59E0B',   // Amber
    colorLight: '#D97706',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    icon: 'ShieldAlert',
  },
  HEALTHCARE: {
    id: 'healthcare',
    label: 'Healthcare Intelligence',
    colorDark: '#F43F5E',   // Rose
    colorLight: '#E11D48',
    badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    icon: 'Activity',
  },
  INFRASTRUCTURE: {
    id: 'infrastructure',
    label: 'Infrastructure Intelligence',
    colorDark: '#818CF8',   // Indigo/Violet
    colorLight: '#6366F1',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    icon: 'Cpu',
  },
}

/**
 * Geographically accurate Intelligence Nodes
 */
export const INTELLIGENCE_NODES = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    region: 'Western Express Corridor',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    category: 'traffic',
    riskLevel: 'HIGH',
    riskScore: 84,
    confidence: 92,
    updatedAt: '2 min ago',
    status: 'High Congestion Warning',
    currentMetric: 'Grid Saturation: 88.4%',
    predictedRisk: 'Very High',
    predictionWindow: '18:00 – 20:00',
    affectedZones: 12,
    actionRecommendation: 'Deploy Automated Signal Phasing & Corridor Diverts',
    color: '#38BDF8',
    isPrimaryHub: true,
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    region: 'National Capital Region',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    category: 'climate',
    riskLevel: 'CRITICAL',
    riskScore: 91,
    confidence: 95,
    updatedAt: 'Just now',
    status: 'Precipitation Influx Alert',
    currentMetric: 'Precipitation: 78mm/hr · AQI 312',
    predictedRisk: 'Flash Inundation Probable',
    predictionWindow: '16:00 – 22:00',
    affectedZones: 18,
    actionRecommendation: 'Initiate Stormwater Pump Grid & Sluice Gate Automation',
    color: '#34D399',
    isPrimaryHub: true,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    region: 'Silicon Plateau & Outer Ring',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    category: 'security',
    riskLevel: 'MEDIUM',
    riskScore: 68,
    confidence: 88,
    updatedAt: '5 min ago',
    status: 'Elevated Telemetry Anomaly',
    currentMetric: 'Density Flux: +34% vs Baseline',
    predictedRisk: 'Elevated Gathering',
    predictionWindow: '19:00 – 23:00',
    affectedZones: 6,
    actionRecommendation: 'Reroute Public Transit Feeders & Dispatch Rapid Units',
    color: '#F59E0B',
    isPrimaryHub: true,
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    region: 'Cyberabad Financial Grid',
    country: 'India',
    lat: 17.3850,
    lng: 78.4867,
    category: 'infrastructure',
    riskLevel: 'LOW',
    riskScore: 42,
    confidence: 91,
    updatedAt: '8 min ago',
    status: 'Power Grid Optimization Active',
    currentMetric: 'Grid Load: 62% · Frequency 50.02 Hz',
    predictedRisk: 'Nominal Operational State',
    predictionWindow: '20:00 – 04:00',
    affectedZones: 4,
    actionRecommendation: 'Maintain Autonomous Dynamic Balancing',
    color: '#818CF8',
    isPrimaryHub: false,
  },
  {
    id: 'chennai',
    name: 'Chennai',
    region: 'Coromandel Coastal Gateway',
    country: 'India',
    lat: 13.0827,
    lng: 80.2707,
    category: 'climate',
    riskLevel: 'MEDIUM',
    riskScore: 64,
    confidence: 89,
    updatedAt: '11 min ago',
    status: 'Maritime Wind Surge',
    currentMetric: 'Coastal Wind: 44 kts · Surge 0.8m',
    predictedRisk: 'Moderate Swell Warning',
    predictionWindow: '21:00 – 06:00',
    affectedZones: 7,
    actionRecommendation: 'Alert Port Authority & Harbor Logistics',
    color: '#34D399',
    isPrimaryHub: false,
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    region: 'Eastern Inland Waterways Hub',
    country: 'India',
    lat: 22.5726,
    lng: 88.3639,
    category: 'healthcare',
    riskLevel: 'LOW',
    riskScore: 38,
    confidence: 94,
    updatedAt: '14 min ago',
    status: 'Surveillance Baseline Normal',
    currentMetric: 'Vector Index: 0.18 (Safe)',
    predictedRisk: 'Low Incidence Probability',
    predictionWindow: '24h Forward',
    affectedZones: 3,
    actionRecommendation: 'Continue Predictive Vector Monitoring',
    color: '#F43F5E',
    isPrimaryHub: false,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    region: 'Indo-Pacific Gateway',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    category: 'infrastructure',
    riskLevel: 'LOW',
    riskScore: 24,
    confidence: 96,
    updatedAt: '4 min ago',
    status: 'High-Throughput Exchange Node',
    currentMetric: 'Bandwidth: 1.4 Tbps · 1.2ms SLA',
    predictedRisk: 'Optimal Transfer State',
    predictionWindow: 'Continuous',
    affectedZones: 1,
    actionRecommendation: 'Maintain Cross-Border Intelligence Mesh',
    color: '#818CF8',
    isPrimaryHub: true,
  },
  {
    id: 'dubai',
    name: 'Dubai',
    region: 'Middle East Aviation & Freight Grid',
    country: 'UAE',
    lat: 25.2048,
    lng: 55.2708,
    category: 'traffic',
    riskLevel: 'LOW',
    riskScore: 31,
    confidence: 97,
    updatedAt: '6 min ago',
    status: 'Freight Corridors Synchronized',
    currentMetric: 'Air Corridor Load: 74%',
    predictedRisk: 'Stable Flow Expected',
    predictionWindow: '18:00 – 02:00',
    affectedZones: 2,
    actionRecommendation: 'Standard Real-time Tracking Active',
    color: '#38BDF8',
    isPrimaryHub: true,
  },
  {
    id: 'london',
    name: 'London',
    region: 'European Telemetry Uplink',
    country: 'UK',
    lat: 51.5074,
    lng: -0.1278,
    category: 'security',
    riskLevel: 'LOW',
    riskScore: 35,
    confidence: 93,
    updatedAt: '12 min ago',
    status: 'Secure Exchange Synchronized',
    currentMetric: 'Threat Index: 0.04 (Nominal)',
    predictedRisk: 'Low Risk',
    predictionWindow: '24h Forward',
    affectedZones: 2,
    actionRecommendation: 'Federated Cipher Handshake Verified',
    color: '#F59E0B',
    isPrimaryHub: false,
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    region: 'East Asia Resilience Hub',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    category: 'infrastructure',
    riskLevel: 'LOW',
    riskScore: 28,
    confidence: 98,
    updatedAt: '3 min ago',
    status: 'Seismic & Cyber Grid Optimal',
    currentMetric: 'Grid Resiliency: 99.99%',
    predictedRisk: 'Nominal',
    predictionWindow: 'Continuous',
    affectedZones: 1,
    actionRecommendation: 'Automated Real-time Sensor Sync',
    color: '#818CF8',
    isPrimaryHub: false,
  },
]

/**
 * Connected 3D Data Flow Routes (Great-Circle Arcs)
 */
export const DATA_ROUTES = [
  { from: 'mumbai', to: 'delhi', throughput: '4.8 Gbps', status: 'Optimal', delay: 0.0 },
  { from: 'delhi', to: 'bengaluru', throughput: '3.6 Gbps', status: 'Active', delay: 0.3 },
  { from: 'bengaluru', to: 'singapore', throughput: '8.2 Gbps', status: 'Optimal', delay: 0.6 },
  { from: 'mumbai', to: 'dubai', throughput: '6.4 Gbps', status: 'Optimal', delay: 0.2 },
  { from: 'dubai', to: 'london', throughput: '5.1 Gbps', status: 'Optimal', delay: 0.8 },
  { from: 'delhi', to: 'kolkata', throughput: '2.9 Gbps', status: 'Active', delay: 0.4 },
  { from: 'hyderabad', to: 'chennai', throughput: '3.2 Gbps', status: 'Optimal', delay: 0.5 },
  { from: 'singapore', to: 'tokyo', throughput: '7.8 Gbps', status: 'Optimal', delay: 0.7 },
]

/**
 * 4 Enterprise Floating Intelligence Alerts (matching the exact reference image)
 */
export const FLOATING_ALERTS = [
  {
    id: 'alert-high-risk',
    category: 'security',
    title: 'High Risk',
    nodeId: 'mumbai',
    location: 'Mumbai, India',
    severity: 'CRITICAL',
    status: 'Elevated Threat Cluster Flagged',
    window: 'Immediate',
    affected: 'Sector 7 & Coastal Line',
    color: '#EF4444',
    position: 'top-left',
  },
  {
    id: 'alert-traffic',
    category: 'traffic',
    title: 'Traffic Alert',
    nodeId: 'delhi',
    location: 'New Delhi, India',
    severity: 'HIGH',
    status: 'Arterial Corridor Congestion',
    window: '17:30 – 20:00',
    affected: 'Outer Ring & Expressway',
    color: '#F59E0B',
    position: 'top-right',
  },
  {
    id: 'alert-flood',
    category: 'climate',
    title: 'Flood Warning',
    nodeId: 'singapore',
    location: 'Jakarta, Indonesia',
    severity: 'HIGH',
    status: 'Coastal Surge Inundation Probable',
    window: '18:00 – 22:00',
    affected: 'Lowland Coastal Wards',
    color: '#06B6D4',
    position: 'bottom-left',
  },
  {
    id: 'alert-cyber',
    category: 'infrastructure',
    title: 'Cyber Threat',
    nodeId: 'london',
    location: 'Global',
    severity: 'CRITICAL',
    status: 'Distributed SCADA Intrusion Attempt',
    window: 'Ongoing',
    affected: 'Multi-Regional Grid Relays',
    color: '#8B5CF6',
    position: 'bottom-right',
  },
]

/**
 * Converts Latitude and Longitude to 3D Cartesian coordinates on a sphere of radius R.
 * In Three.js coordinates, +Y is North, -Z is facing front at (0, 0, R) or rotated accordingly.
 * 
 * @param {number} lat - Latitude in degrees (-90 to 90)
 * @param {number} lng - Longitude in degrees (-180 to 180)
 * @param {number} radius - Sphere radius
 * @returns {[number, number, number]} [x, y, z]
 */
export function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.sin(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.cos(theta)

  return [x, y, z]
}
