/**
 * NPIG Intelligence Globe Type Contracts and Data Interfaces
 * 
 * @typedef {'traffic' | 'climate' | 'security' | 'healthcare' | 'infrastructure'} IntelligenceCategory
 * @typedef {'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'OPTIMAL'} RiskSeverity
 * 
 * @typedef {Object} IntelligenceNode
 * @property {string} id - Unique identifier (e.g. 'mumbai')
 * @property {string} name - Display name (e.g. 'Mumbai')
 * @property {string} region - Region or corridor name
 * @property {string} country - Country name
 * @property {number} lat - Latitude in degrees
 * @property {number} lng - Longitude in degrees
 * @property {IntelligenceCategory} category - Intelligence domain
 * @property {RiskSeverity} riskLevel - Risk level
 * @property {number} riskScore - Numerical score (0-100)
 * @property {number} confidence - AI Confidence percentage (0-100)
 * @property {string} updatedAt - Timestamp relative string
 * @property {string} status - Concise status phrase
 * @property {string} currentMetric - Current telemetry readout
 * @property {string} predictedRisk - Predictive forecast description
 * @property {string} predictionWindow - Time window for prediction
 * @property {number} affectedZones - Number of sub-zones impacted
 * @property {string} actionRecommendation - Tactical recommendation
 * @property {string} color - Hex color representation
 * @property {boolean} [isPrimaryHub] - Flag for primary network hub
 * 
 * @typedef {Object} DataRoute
 * @property {string} from - Source node id
 * @property {string} to - Destination node id
 * @property {string} throughput - Data transmission bandwidth
 * @property {string} status - Link status
 * @property {number} delay - Animation phase offset
 * 
 * @typedef {Object} IntelligenceAlert
 * @property {string} id - Alert unique identifier
 * @property {IntelligenceCategory} category - Alert domain
 * @property {string} title - Alert title heading
 * @property {string} nodeId - Associated node id
 * @property {location} location - Location string
 * @property {RiskSeverity} severity - Severity rating
 * @property {string} status - Short alert summary
 * @property {string} window - Forecast time window
 * @property {string} affected - Zones affected
 * @property {string} color - Accent color
 * @property {'top-left' | 'right-middle' | 'bottom-left'} position - Visual overlay quadrant
 */

export const GLOBE_DEFAULTS = {
  RADIUS: 2.5,
  AUTO_ROTATE_SPEED: 0.0012,
  HOVER_SLOWDOWN_FACTOR: 0.25,
  SEGMENTS: 64,
  MAX_DPR: 2,
}
