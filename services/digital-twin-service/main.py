"""
NPIG Digital Twin Service
Real-time city simulation and what-if scenario modeling
Simulates city state and predicts outcomes of interventions
"""

from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import asyncio
import uuid
import math
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NPIG Digital Twin Service",
    description="Real-time city digital twin simulation and what-if scenario modeling",
    version="1.0.0"
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ============================================================
# CITY GRID - 6x6 zone matrix
# ============================================================

CITY_ZONES = [
    {"id": "Z001", "name": "Downtown Core",     "lat": 28.6139, "lng": 77.2090, "type": "COMMERCIAL",   "population": 150000},
    {"id": "Z002", "name": "Financial District", "lat": 28.6270, "lng": 77.2190, "type": "COMMERCIAL",   "population": 80000},
    {"id": "Z003", "name": "Airport Corridor",  "lat": 28.5562, "lng": 77.1000, "type": "TRANSIT",      "population": 20000},
    {"id": "Z004", "name": "Industrial Hub",    "lat": 28.6692, "lng": 77.4538, "type": "INDUSTRIAL",   "population": 50000},
    {"id": "Z005", "name": "Residential North", "lat": 28.7041, "lng": 77.1025, "type": "RESIDENTIAL",  "population": 350000},
    {"id": "Z006", "name": "Medical District",  "lat": 28.5710, "lng": 77.2146, "type": "HEALTHCARE",   "population": 70000},
    {"id": "Z007", "name": "University Zone",   "lat": 28.6358, "lng": 77.1673, "type": "EDUCATION",    "population": 45000},
    {"id": "Z008", "name": "Port Zone",         "lat": 28.6104, "lng": 77.2295, "type": "LOGISTICS",    "population": 30000},
    {"id": "Z009", "name": "Riverside Park",    "lat": 28.5950, "lng": 77.2400, "type": "RECREATIONAL", "population": 10000},
    {"id": "Z010", "name": "Tech Park",         "lat": 28.6520, "lng": 77.3456, "type": "COMMERCIAL",   "population": 65000},
    {"id": "Z011", "name": "Eastern Suburbs",   "lat": 28.5800, "lng": 77.4000, "type": "RESIDENTIAL",  "population": 280000},
    {"id": "Z012", "name": "Government Hub",    "lat": 28.6200, "lng": 77.2100, "type": "GOVERNMENT",   "population": 25000},
]

# ============================================================
# SIMULATION STATE
# ============================================================

class SimulationState:
    def __init__(self):
        self.tick = 0
        self.simulated_time = datetime.utcnow()
        self.zone_states: Dict[str, dict] = {}
        self.infrastructure: Dict[str, dict] = {}
        self.active_scenarios: List[dict] = []
        self._initialize()
    
    def _initialize(self):
        for zone in CITY_ZONES:
            self.zone_states[zone["id"]] = {
                "zone_id": zone["id"],
                "name": zone["name"],
                "lat": zone["lat"],
                "lng": zone["lng"],
                "type": zone["type"],
                "population": zone["population"],
                "traffic_load": random.uniform(0.2, 0.8),
                "crime_risk": random.uniform(0.05, 0.4),
                "health_risk": random.uniform(0.02, 0.2),
                "climate_risk": random.uniform(0.1, 0.5),
                "power_status": "OPERATIONAL",
                "water_status": "OPERATIONAL",
                "network_status": "OPERATIONAL",
                "emergency_units": random.randint(2, 8),
                "hospital_capacity_pct": random.uniform(0.5, 0.85),
                "air_quality_index": random.uniform(50, 200),
                "noise_db": random.uniform(45, 85),
            }
        
        self.infrastructure = {
            "power_grid": {"status": "OPERATIONAL", "capacity_pct": random.uniform(0.6, 0.9), "substations": 12},
            "water_supply": {"status": "OPERATIONAL", "pressure_bar": random.uniform(2.5, 4.0), "reservoirs": 4},
            "telecom": {"status": "OPERATIONAL", "cell_towers": 156, "uptime_pct": 99.7},
            "transport": {
                "metro_lines": {"status": "OPERATIONAL", "delay_min": random.randint(0, 5)},
                "buses": {"status": "OPERATIONAL", "active_fleet_pct": random.uniform(0.8, 0.95)},
                "major_roads": {"congestion_pct": random.uniform(0.3, 0.7)},
            },
            "emergency_services": {
                "police": {"units_active": 48, "response_time_min": random.uniform(4, 12)},
                "fire": {"units_active": 24, "response_time_min": random.uniform(6, 15)},
                "ambulance": {"units_active": 32, "response_time_min": random.uniform(5, 12)},
            }
        }
    
    def tick_forward(self, dt_seconds: int = 60):
        """Advance simulation by dt_seconds"""
        self.tick += 1
        
        for zone_id, state in self.zone_states.items():
            # Apply Brownian motion with mean reversion
            state["traffic_load"] = self._bounded_random_walk(state["traffic_load"], 0.05, 0.3, 0.9)
            state["crime_risk"] = self._bounded_random_walk(state["crime_risk"], 0.02, 0.0, 1.0)
            state["health_risk"] = self._bounded_random_walk(state["health_risk"], 0.01, 0.0, 1.0)
            state["climate_risk"] = self._bounded_random_walk(state["climate_risk"], 0.03, 0.0, 1.0)
            state["air_quality_index"] = self._bounded_random_walk(state["air_quality_index"], 5, 20, 400)
            state["hospital_capacity_pct"] = self._bounded_random_walk(state["hospital_capacity_pct"], 0.02, 0.3, 1.0)
            
            # Apply active scenario effects
            for scenario in self.active_scenarios:
                self._apply_scenario_effect(zone_id, state, scenario)
        
        # Update infrastructure
        self.infrastructure["power_grid"]["capacity_pct"] = self._bounded_random_walk(
            self.infrastructure["power_grid"]["capacity_pct"], 0.02, 0.4, 1.0
        )
        self.infrastructure["emergency_services"]["police"]["response_time_min"] = self._bounded_random_walk(
            self.infrastructure["emergency_services"]["police"]["response_time_min"], 1, 2, 20
        )
    
    def _bounded_random_walk(self, current: float, step: float, low: float, high: float) -> float:
        new_val = current + random.gauss(0, step)
        # Mean reversion
        mid = (low + high) / 2
        new_val += (mid - current) * 0.05
        return round(max(low, min(high, new_val)), 4)
    
    def _apply_scenario_effect(self, zone_id: str, state: dict, scenario: dict):
        if zone_id not in scenario.get("affected_zones", []):
            return
        
        stype = scenario.get("type")
        intensity = scenario.get("intensity", 1.0)
        
        if stype == "MAJOR_FLOOD":
            state["climate_risk"] = min(1.0, state["climate_risk"] + 0.02 * intensity)
            state["traffic_load"] = min(1.0, state["traffic_load"] + 0.03 * intensity)
        elif stype == "MASS_EVENT":
            state["traffic_load"] = min(1.0, state["traffic_load"] + 0.05 * intensity)
            state["crime_risk"] = min(1.0, state["crime_risk"] + 0.01 * intensity)
        elif stype == "PANDEMIC_SURGE":
            state["health_risk"] = min(1.0, state["health_risk"] + 0.03 * intensity)
            state["hospital_capacity_pct"] = min(1.0, state["hospital_capacity_pct"] + 0.02 * intensity)
        elif stype == "POWER_OUTAGE":
            state["power_status"] = "DEGRADED"
            state["crime_risk"] = min(1.0, state["crime_risk"] + 0.05 * intensity)
        elif stype == "CYBER_ATTACK":
            state["network_status"] = "DEGRADED"

    def get_snapshot(self) -> dict:
        return {
            "tick": self.tick,
            "simulated_time": self.simulated_time.isoformat(),
            "zones": list(self.zone_states.values()),
            "infrastructure": self.infrastructure,
            "active_scenarios": self.active_scenarios,
            "city_metrics": self._compute_city_metrics()
        }
    
    def _compute_city_metrics(self) -> dict:
        zones = list(self.zone_states.values())
        return {
            "avg_traffic_load": round(sum(z["traffic_load"] for z in zones) / len(zones), 3),
            "avg_crime_risk": round(sum(z["crime_risk"] for z in zones) / len(zones), 3),
            "avg_health_risk": round(sum(z["health_risk"] for z in zones) / len(zones), 3),
            "avg_climate_risk": round(sum(z["climate_risk"] for z in zones) / len(zones), 3),
            "avg_air_quality": round(sum(z["air_quality_index"] for z in zones) / len(zones), 1),
            "total_population": sum(z["population"] for z in zones),
            "zones_at_high_risk": len([z for z in zones if max(z["traffic_load"], z["crime_risk"], z["climate_risk"]) > 0.7]),
        }

# ============================================================
# SCENARIO MODELS
# ============================================================

class ScenarioType(str, Enum):
    MAJOR_FLOOD = "MAJOR_FLOOD"
    EARTHQUAKE = "EARTHQUAKE"
    PANDEMIC_SURGE = "PANDEMIC_SURGE"
    POWER_OUTAGE = "POWER_OUTAGE"
    CYBER_ATTACK = "CYBER_ATTACK"
    MASS_EVENT = "MASS_EVENT"
    INDUSTRIAL_ACCIDENT = "INDUSTRIAL_ACCIDENT"
    TERRORIST_THREAT = "TERRORIST_THREAT"

class SimulateScenarioRequest(BaseModel):
    scenario_type: ScenarioType
    affected_zone_ids: List[str]
    intensity: float = 1.0
    duration_hours: float = 2.0
    description: Optional[str] = None

class InterventionRequest(BaseModel):
    zone_id: str
    intervention_type: str  # DEPLOY_POLICE, REROUTE_TRAFFIC, EVACUATE, MEDICAL_SURGE
    parameters: Dict[str, Any] = {}

# ============================================================
# SIMULATION ENGINE
# ============================================================

sim_state = SimulationState()
websocket_clients: List[WebSocket] = []

@app.on_event("startup")
async def startup():
    asyncio.create_task(simulation_loop())
    logger.info("✅ Digital Twin simulation engine started")

async def simulation_loop():
    while True:
        sim_state.tick_forward()
        snapshot = sim_state.get_snapshot()
        
        # Broadcast to connected clients every 3 seconds
        await broadcast_to_websockets({"type": "TICK", "data": snapshot})
        await asyncio.sleep(3)

async def broadcast_to_websockets(data: dict):
    disconnected = []
    for ws in websocket_clients:
        try:
            await ws.send_json(data)
        except:
            disconnected.append(ws)
    for ws in disconnected:
        websocket_clients.remove(ws)

# ============================================================
# ENDPOINTS
# ============================================================

@app.get("/twin/snapshot")
async def get_snapshot():
    return sim_state.get_snapshot()

@app.post("/twin/simulate")
async def simulate_scenario(req: SimulateScenarioRequest):
    """Inject a what-if scenario into the simulation"""
    scenario_id = str(uuid.uuid4())
    scenario = {
        "id": scenario_id,
        "type": req.scenario_type.value,
        "affected_zones": req.affected_zone_ids,
        "intensity": req.intensity,
        "duration_hours": req.duration_hours,
        "description": req.description or f"{req.scenario_type.value} simulation",
        "started_at": datetime.utcnow().isoformat(),
        "status": "ACTIVE"
    }
    
    sim_state.active_scenarios.append(scenario)
    logger.info(f"🔬 Scenario injected: {scenario['type']} affecting {req.affected_zone_ids}")
    
    # Auto-remove after duration
    asyncio.create_task(remove_scenario_after(scenario_id, req.duration_hours * 3600))
    
    return {"scenario_id": scenario_id, "scenario": scenario}

async def remove_scenario_after(scenario_id: str, delay_seconds: float):
    await asyncio.sleep(min(delay_seconds, 300))  # Cap at 5 minutes for demo
    sim_state.active_scenarios = [s for s in sim_state.active_scenarios if s["id"] != scenario_id]

@app.post("/twin/intervene")
async def apply_intervention(req: InterventionRequest):
    """Apply a corrective intervention to a zone"""
    zone = sim_state.zone_states.get(req.zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    effect = {}
    itype = req.intervention_type
    
    if itype == "DEPLOY_POLICE":
        count = req.parameters.get("count", 5)
        zone["emergency_units"] += count
        zone["crime_risk"] = max(0, zone["crime_risk"] - 0.15)
        effect = {"crime_risk_reduced_by": 0.15, "units_added": count}
    
    elif itype == "REROUTE_TRAFFIC":
        zone["traffic_load"] = max(0, zone["traffic_load"] - 0.20)
        effect = {"traffic_load_reduced_by": 0.20}
    
    elif itype == "EVACUATE":
        zone["population"] = int(zone["population"] * 0.7)
        zone["climate_risk"] = max(0, zone["climate_risk"] - 0.1)
        effect = {"population_evacuated": int(zone["population"] * 0.3)}
    
    elif itype == "MEDICAL_SURGE":
        surge = req.parameters.get("beds", 200)
        zone["health_risk"] = max(0, zone["health_risk"] - 0.2)
        effect = {"surge_capacity_added": surge}
    
    return {
        "success": True,
        "zone_id": req.zone_id,
        "intervention": itype,
        "effect": effect,
        "updated_zone": zone
    }

@app.get("/twin/zones")
async def get_zones():
    return list(sim_state.zone_states.values())

@app.get("/twin/infrastructure")
async def get_infrastructure():
    return sim_state.infrastructure

@app.get("/twin/scenarios")
async def get_scenarios():
    return sim_state.active_scenarios

@app.websocket("/ws/twin")
async def twin_websocket(websocket: WebSocket):
    await websocket.accept()
    websocket_clients.append(websocket)
    await websocket.send_json({"type": "INIT", "data": sim_state.get_snapshot()})
    try:
        while True:
            await asyncio.sleep(1)
    except:
        websocket_clients.remove(websocket)

@app.get("/twin/health")
async def health():
    return {"status": "healthy", "service": "digital-twin-service", "tick": sim_state.tick}
