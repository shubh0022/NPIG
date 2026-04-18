"""
NPIG Data Ingestion Service
High-throughput real-time data ingestion from multiple city data sources
Publishes to Apache Kafka topics for downstream processing
"""

from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime
import asyncio
import json
import uuid
import logging
import os
import random
import math
from contextlib import asynccontextmanager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Kafka Producer (aiokafka) ---
try:
    from aiokafka import AIOKafkaProducer
    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False
    logger.warning("aiokafka not installed — running in mock mode")

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")

# --- Topics ---
TOPICS = {
    "TRAFFIC": "npig.traffic.raw",
    "CRIME": "npig.crime.raw",
    "HEALTH": "npig.health.raw",
    "CLIMATE": "npig.climate.raw",
    "CCTV": "npig.cctv.events",
    "CYBER": "npig.cyber.threats",
    "EMERGENCY": "npig.emergency.events",
    "SENSOR": "npig.iot.sensors",
}

producer = None

# --- Data Source Types ---
class DataSourceType(str, Enum):
    TRAFFIC_SENSOR = "TRAFFIC_SENSOR"
    CRIME_REPORT = "CRIME_REPORT"
    HEALTH_MONITOR = "HEALTH_MONITOR"
    CLIMATE_STATION = "CLIMATE_STATION"
    CCTV_EVENT = "CCTV_EVENT"
    CYBER_THREAT = "CYBER_THREAT"
    EMERGENCY_CALL = "EMERGENCY_CALL"
    IOT_SENSOR = "IOT_SENSOR"

# --- Payload Models ---
class TrafficPayload(BaseModel):
    sensor_id: str
    latitude: float
    longitude: float
    vehicle_count: int
    avg_speed_kmh: float
    congestion_level: float = Field(ge=0, le=1)
    incident_detected: bool = False
    timestamp: Optional[str] = None

class CrimePayload(BaseModel):
    report_id: str
    crime_type: str
    latitude: float
    longitude: float
    district: str
    severity: int = Field(ge=1, le=5)
    suspects: int = 0
    timestamp: Optional[str] = None

class HealthPayload(BaseModel):
    facility_id: str
    region: str
    disease_code: str  # ICD-10 code
    case_count: int
    hospitalization_rate: float
    latitude: float
    longitude: float
    alert_level: str = "NORMAL"  # NORMAL/WATCH/WARNING/EMERGENCY
    timestamp: Optional[str] = None

class ClimatePayload(BaseModel):
    station_id: str
    latitude: float
    longitude: float
    temperature_c: float
    humidity_pct: float
    rainfall_mm: float
    wind_speed_kmh: float
    flood_risk_index: float = Field(ge=0, le=1)
    heat_index: float
    uv_index: float
    timestamp: Optional[str] = None

class CyberThreatPayload(BaseModel):
    event_id: str
    threat_type: str  # DDoS, intrusion, malware, phishing
    source_ip: str
    target_system: str
    severity: str  # LOW/MEDIUM/HIGH/CRITICAL
    confidence_score: float = Field(ge=0, le=1)
    timestamp: Optional[str] = None

class EmergencyCallPayload(BaseModel):
    call_id: str
    emergency_type: str  # FIRE, MEDICAL, POLICE, DISASTER
    location: str
    latitude: float
    longitude: float
    caller_count: int = 1
    is_verified: bool = False
    timestamp: Optional[str] = None

class IngestRequest(BaseModel):
    source_type: DataSourceType
    source_id: str
    payload: Dict[str, Any]
    priority: int = Field(default=1, ge=1, le=5)  # 5 = highest priority
    metadata: Optional[Dict[str, Any]] = {}

class IngestResponse(BaseModel):
    event_id: str
    topic: str
    source_type: str
    status: str
    timestamp: str
    partition: Optional[int] = None

# --- FastAPI App ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    global producer
    if KAFKA_AVAILABLE:
        try:
            producer = AIOKafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP,
                value_serializer=lambda v: json.dumps(v).encode(),
                compression_type="gzip",
                max_batch_size=1024 * 1024,
                linger_ms=10,
            )
            await producer.start()
            logger.info("✅ Kafka producer started")
        except Exception as e:
            logger.error(f"❌ Kafka connection failed: {e} — running in mock mode")
    
    # Start synthetic data generator
    asyncio.create_task(synthetic_data_generator())
    yield
    
    if producer:
        await producer.stop()

app = FastAPI(
    title="NPIG Ingestion Service",
    description="Real-time multi-source data ingestion with Kafka publishing",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WebSocket clients for real-time streaming ---
websocket_clients: List[WebSocket] = []

async def publish_to_kafka(topic: str, event: dict, key: str = None) -> dict:
    """Publish event to Kafka topic and return metadata"""
    event["_event_id"] = str(uuid.uuid4())
    event["_ingested_at"] = datetime.utcnow().isoformat()
    event["_topic"] = topic
    
    if producer and KAFKA_AVAILABLE:
        try:
            key_bytes = key.encode() if key else None
            record = await producer.send_and_wait(
                topic,
                value=event,
                key=key_bytes
            )
            return {"partition": record.partition, "offset": record.offset, "status": "published"}
        except Exception as e:
            logger.error(f"Kafka publish failed: {e}")
    
    return {"partition": 0, "offset": 0, "status": "mock_published"}

async def broadcast_to_websockets(data: dict):
    """Broadcast event to all connected WebSocket clients"""
    disconnected = []
    for ws in websocket_clients:
        try:
            await ws.send_json(data)
        except:
            disconnected.append(ws)
    for ws in disconnected:
        websocket_clients.remove(ws)

# --- Ingestion Endpoints ---
@app.post("/ingest", response_model=IngestResponse)
async def ingest_data(request: IngestRequest, background_tasks: BackgroundTasks):
    """Universal data ingestion endpoint"""
    
    topic_map = {
        DataSourceType.TRAFFIC_SENSOR: TOPICS["TRAFFIC"],
        DataSourceType.CRIME_REPORT: TOPICS["CRIME"],
        DataSourceType.HEALTH_MONITOR: TOPICS["HEALTH"],
        DataSourceType.CLIMATE_STATION: TOPICS["CLIMATE"],
        DataSourceType.CCTV_EVENT: TOPICS["CCTV"],
        DataSourceType.CYBER_THREAT: TOPICS["CYBER"],
        DataSourceType.EMERGENCY_CALL: TOPICS["EMERGENCY"],
        DataSourceType.IOT_SENSOR: TOPICS["SENSOR"],
    }
    
    topic = topic_map.get(request.source_type)
    event_id = str(uuid.uuid4())
    
    event = {
        "event_id": event_id,
        "source_type": request.source_type.value,
        "source_id": request.source_id,
        "priority": request.priority,
        "payload": request.payload,
        "metadata": request.metadata,
        "timestamp": datetime.utcnow().isoformat(),
    }
    
    result = await publish_to_kafka(topic, event, key=request.source_id)
    background_tasks.add_task(broadcast_to_websockets, event)
    
    logger.info(f"Ingested: [{request.source_type.value}] event_id={event_id}")
    
    return IngestResponse(
        event_id=event_id,
        topic=topic,
        source_type=request.source_type.value,
        status=result["status"],
        timestamp=event["timestamp"],
        partition=result.get("partition")
    )

@app.post("/ingest/traffic")
async def ingest_traffic(payload: TrafficPayload, bg: BackgroundTasks):
    """Dedicated traffic sensor ingestion"""
    if not payload.timestamp:
        payload.timestamp = datetime.utcnow().isoformat()
    
    event = payload.dict()
    result = await publish_to_kafka(TOPICS["TRAFFIC"], event, key=payload.sensor_id)
    bg.add_task(broadcast_to_websockets, {"type": "TRAFFIC", **event})
    return {"status": "ok", **result}

@app.post("/ingest/crime")
async def ingest_crime(payload: CrimePayload, bg: BackgroundTasks):
    if not payload.timestamp:
        payload.timestamp = datetime.utcnow().isoformat()
    event = payload.dict()
    result = await publish_to_kafka(TOPICS["CRIME"], event, key=payload.report_id)
    bg.add_task(broadcast_to_websockets, {"type": "CRIME", **event})
    return {"status": "ok", **result}

@app.post("/ingest/health")
async def ingest_health(payload: HealthPayload, bg: BackgroundTasks):
    if not payload.timestamp:
        payload.timestamp = datetime.utcnow().isoformat()
    event = payload.dict()
    result = await publish_to_kafka(TOPICS["HEALTH"], event, key=payload.facility_id)
    bg.add_task(broadcast_to_websockets, {"type": "HEALTH", **event})
    return {"status": "ok", **result}

@app.post("/ingest/climate")
async def ingest_climate(payload: ClimatePayload, bg: BackgroundTasks):
    if not payload.timestamp:
        payload.timestamp = datetime.utcnow().isoformat()
    event = payload.dict()
    result = await publish_to_kafka(TOPICS["CLIMATE"], event, key=payload.station_id)
    bg.add_task(broadcast_to_websockets, {"type": "CLIMATE", **event})
    return {"status": "ok", **result}

@app.post("/ingest/cyber")
async def ingest_cyber(payload: CyberThreatPayload, bg: BackgroundTasks):
    if not payload.timestamp:
        payload.timestamp = datetime.utcnow().isoformat()
    event = payload.dict()
    # High priority — critical cyber threats get immediate routing
    if payload.severity in ["HIGH", "CRITICAL"]:
        event["_priority"] = "CRITICAL"
    result = await publish_to_kafka(TOPICS["CYBER"], event, key=payload.event_id)
    bg.add_task(broadcast_to_websockets, {"type": "CYBER", **event})
    return {"status": "ok", **result}

@app.post("/ingest/emergency")
async def ingest_emergency(payload: EmergencyCallPayload, bg: BackgroundTasks):
    if not payload.timestamp:
        payload.timestamp = datetime.utcnow().isoformat()
    event = payload.dict()
    event["_priority"] = "CRITICAL"
    result = await publish_to_kafka(TOPICS["EMERGENCY"], event, key=payload.call_id)
    bg.add_task(broadcast_to_websockets, {"type": "EMERGENCY", **event})
    return {"status": "ok", **result}

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    """Real-time event streaming via WebSocket"""
    await websocket.accept()
    websocket_clients.append(websocket)
    logger.info(f"WebSocket client connected — total: {len(websocket_clients)}")
    try:
        while True:
            await asyncio.sleep(1)
    except:
        websocket_clients.remove(websocket)
        logger.info("WebSocket client disconnected")

# --- Synthetic Data Generator ---
CITY_ZONES = [
    {"name": "Downtown", "lat": 28.6139, "lng": 77.2090},
    {"name": "Airport Zone", "lat": 28.5562, "lng": 77.1000},
    {"name": "Industrial Hub", "lat": 28.6692, "lng": 77.4538},
    {"name": "Residential North", "lat": 28.7041, "lng": 77.1025},
    {"name": "Medical District", "lat": 28.5710, "lng": 77.2146},
    {"name": "Port Zone", "lat": 28.6104, "lng": 77.2295},
]

async def synthetic_data_generator():
    """Continuously generates synthetic city data for demo purposes"""
    await asyncio.sleep(2)  # Wait for app to start
    logger.info("🔄 Synthetic data generator started")
    
    counter = 0
    while True:
        try:
            zone = random.choice(CITY_ZONES)
            lat_jitter = random.uniform(-0.01, 0.01)
            lng_jitter = random.uniform(-0.01, 0.01)
            
            # Generate traffic data
            traffic_event = {
                "event_id": str(uuid.uuid4()),
                "type": "TRAFFIC",
                "source_type": "TRAFFIC_SENSOR",
                "sensor_id": f"TRF-{random.randint(1000, 9999)}",
                "zone": zone["name"],
                "latitude": zone["lat"] + lat_jitter,
                "longitude": zone["lng"] + lng_jitter,
                "vehicle_count": random.randint(50, 500),
                "avg_speed_kmh": random.uniform(10, 80),
                "congestion_level": random.uniform(0, 1),
                "incident_detected": random.random() < 0.05,
                "timestamp": datetime.utcnow().isoformat(),
            }
            
            await broadcast_to_websockets(traffic_event)
            await publish_to_kafka(TOPICS["TRAFFIC"], traffic_event)
            
            # Every 5 cycles, generate climate data
            if counter % 5 == 0:
                climate_event = {
                    "event_id": str(uuid.uuid4()),
                    "type": "CLIMATE",
                    "source_type": "CLIMATE_STATION",
                    "station_id": f"WX-{random.randint(100, 999)}",
                    "zone": zone["name"],
                    "latitude": zone["lat"] + lat_jitter,
                    "longitude": zone["lng"] + lng_jitter,
                    "temperature_c": random.uniform(25, 45),
                    "humidity_pct": random.uniform(30, 95),
                    "rainfall_mm": random.uniform(0, 50),
                    "wind_speed_kmh": random.uniform(0, 80),
                    "flood_risk_index": random.uniform(0, 1),
                    "heat_index": random.uniform(28, 55),
                    "uv_index": random.uniform(0, 11),
                    "timestamp": datetime.utcnow().isoformat(),
                }
                await broadcast_to_websockets(climate_event)
            
            # Every 10 cycles, generate a crime/alert event
            if counter % 10 == 0 and random.random() < 0.3:
                crime_event = {
                    "event_id": str(uuid.uuid4()),
                    "type": "CRIME",
                    "source_type": "CRIME_REPORT",
                    "report_id": f"CR-{uuid.uuid4().hex[:8].upper()}",
                    "crime_type": random.choice(["THEFT", "ASSAULT", "VANDALISM", "SUSPICIOUS_ACTIVITY", "TRAFFIC_VIOLATION"]),
                    "latitude": zone["lat"] + lat_jitter,
                    "longitude": zone["lng"] + lng_jitter,
                    "district": zone["name"],
                    "severity": random.randint(1, 5),
                    "timestamp": datetime.utcnow().isoformat(),
                }
                await broadcast_to_websockets(crime_event)
            
            counter += 1
            await asyncio.sleep(1.5)
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Synthetic generator error: {e}")
            await asyncio.sleep(5)

@app.get("/ingest/status")
async def get_status():
    return {
        "service": "ingestion-service",
        "status": "running",
        "kafka_connected": KAFKA_AVAILABLE and producer is not None,
        "topics": list(TOPICS.values()),
        "websocket_clients": len(websocket_clients),
        "version": "1.0.0"
    }

@app.get("/ingest/health")
async def health():
    return {"status": "healthy", "service": "ingestion-service"}
