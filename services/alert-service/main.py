"""
NPIG Alert Service
Intelligent multi-channel alert routing and escalation engine
Manages: SMS, Email, Push notifications, Webhook integrations
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from enum import Enum
import asyncio
import json
import uuid
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NPIG Alert Service",
    description="Intelligent multi-channel alert routing and escalation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# MODELS
# ============================================================

class AlertSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"

class AlertCategory(str, Enum):
    TRAFFIC = "TRAFFIC"
    CRIME = "CRIME"
    HEALTH = "HEALTH"
    CLIMATE = "CLIMATE"
    CYBER = "CYBER"
    EMERGENCY = "EMERGENCY"
    SYSTEM = "SYSTEM"

class AlertStatus(str, Enum):
    ACTIVE = "ACTIVE"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    RESOLVED = "RESOLVED"
    ESCALATED = "ESCALATED"
    DISMISSED = "DISMISSED"

class AlertChannel(str, Enum):
    SMS = "SMS"
    EMAIL = "EMAIL"
    PUSH = "PUSH"
    WEBHOOK = "WEBHOOK"
    RADIO = "RADIO"
    SIREN = "SIREN"
    DASHBOARD = "DASHBOARD"

class CreateAlertRequest(BaseModel):
    title: str
    description: str
    severity: AlertSeverity
    category: AlertCategory
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    affected_zone: Optional[str] = None
    affected_population: Optional[int] = None
    source_service: str
    prediction_id: Optional[str] = None
    confidence: float = Field(default=1.0, ge=0, le=1)
    recommended_actions: List[str] = []
    metadata: Dict[str, Any] = {}
    auto_escalate: bool = True
    escalation_timeout_minutes: int = 15

class UpdateAlertRequest(BaseModel):
    status: AlertStatus
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None

class AlertResponse(BaseModel):
    alert_id: str
    title: str
    severity: str
    category: str
    status: str
    created_at: str
    channels_notified: List[str]
    affected_zone: Optional[str]
    recommended_actions: List[str]

# ============================================================
# IN-MEMORY ALERT STORE (replace with PostgreSQL in production)
# ============================================================

alerts_db: Dict[str, dict] = {}
websocket_clients: List[WebSocket] = []
alert_counters = {
    "CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "INFO": 0
}

# ============================================================
# NOTIFICATION ROUTER
# ============================================================

class NotificationRouter:
    """Routes alerts to appropriate channels based on severity"""
    
    SEVERITY_CHANNELS = {
        AlertSeverity.CRITICAL: [AlertChannel.SMS, AlertChannel.EMAIL, AlertChannel.PUSH, 
                                  AlertChannel.DASHBOARD, AlertChannel.RADIO, AlertChannel.SIREN],
        AlertSeverity.HIGH:     [AlertChannel.SMS, AlertChannel.EMAIL, AlertChannel.PUSH, 
                                  AlertChannel.DASHBOARD],
        AlertSeverity.MEDIUM:   [AlertChannel.EMAIL, AlertChannel.PUSH, AlertChannel.DASHBOARD],
        AlertSeverity.LOW:      [AlertChannel.PUSH, AlertChannel.DASHBOARD],
        AlertSeverity.INFO:     [AlertChannel.DASHBOARD],
    }
    
    CATEGORY_RECIPIENTS = {
        AlertCategory.TRAFFIC:    ["traffic_ops", "city_control_room"],
        AlertCategory.CRIME:      ["police_dispatch", "crime_analytics", "security_ops"],
        AlertCategory.HEALTH:     ["health_ministry", "hospital_network", "cdc_regional"],
        AlertCategory.CLIMATE:    ["ndrf", "disaster_mgmt", "weather_dept"],
        AlertCategory.CYBER:      ["cert_in", "cyber_security_ops", "it_admin"],
        AlertCategory.EMERGENCY:  ["emergency_ops", "all_agencies"],
        AlertCategory.SYSTEM:     ["it_admin", "system_ops"],
    }
    
    async def route(self, alert: dict) -> List[str]:
        severity = AlertSeverity(alert["severity"])
        channels = self.SEVERITY_CHANNELS.get(severity, [AlertChannel.DASHBOARD])
        recipients = self.CATEGORY_RECIPIENTS.get(AlertCategory(alert["category"]), [])
        
        notified = []
        for channel in channels:
            success = await self._send(channel, alert, recipients)
            if success:
                notified.append(channel.value)
        
        return notified
    
    async def _send(self, channel: AlertChannel, alert: dict, recipients: List[str]) -> bool:
        """Simulated channel sending — replace with real integrations"""
        try:
            if channel == AlertChannel.SMS:
                logger.info(f"📱 SMS Alert: [{alert['severity']}] {alert['title']} → {recipients}")
            elif channel == AlertChannel.EMAIL:
                logger.info(f"📧 Email Alert: [{alert['severity']}] {alert['title']} → {recipients}")
            elif channel == AlertChannel.PUSH:
                logger.info(f"🔔 Push Alert: [{alert['severity']}] {alert['title']}")
            elif channel == AlertChannel.RADIO:
                logger.info(f"📻 Radio Alert: [{alert['severity']}] {alert['title']}")
            elif channel == AlertChannel.SIREN:
                logger.info(f"🚨 SIREN TRIGGERED: {alert['title']}")
            elif channel == AlertChannel.DASHBOARD:
                await broadcast_to_websockets({"type": "ALERT", "alert": alert})
            return True
        except Exception as e:
            logger.error(f"Failed to send via {channel}: {e}")
            return False

router_engine = NotificationRouter()

# ============================================================
# ESCALATION ENGINE
# ============================================================

async def escalation_monitor():
    """Background task: auto-escalate unacknowledged critical alerts"""
    while True:
        now = datetime.utcnow()
        for alert_id, alert in alerts_db.items():
            if alert["status"] != AlertStatus.ACTIVE.value:
                continue
            
            created = datetime.fromisoformat(alert["created_at"])
            timeout = alert.get("escalation_timeout_minutes", 15)
            
            if (now - created).total_seconds() / 60 > timeout:
                if alert["severity"] in [AlertSeverity.CRITICAL.value, AlertSeverity.HIGH.value]:
                    alert["status"] = AlertStatus.ESCALATED.value
                    alert["escalated_at"] = now.isoformat()
                    alert["escalation_reason"] = f"No acknowledgment within {timeout} minutes"
                    logger.warning(f"⚠️ ALERT ESCALATED: {alert_id} — {alert['title']}")
                    await broadcast_to_websockets({"type": "ESCALATION", "alert": alert})
        
        await asyncio.sleep(60)  # Check every minute

@app.on_event("startup")
async def startup():
    asyncio.create_task(escalation_monitor())
    asyncio.create_task(seed_demo_alerts())
    logger.info("✅ Alert Service started")

# ============================================================
# HELPERS
# ============================================================

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
# DEMO DATA SEEDER
# ============================================================

async def seed_demo_alerts():
    """Seed realistic demo alerts for dashboard"""
    await asyncio.sleep(2)
    
    demo_alerts = [
        {
            "title": "Severe Traffic Congestion Predicted — NH-48",
            "description": "AI model predicts 87% congestion probability on NH-48 between km 12-28 within next 2 hours due to peak traffic overlap with freight movement.",
            "severity": AlertSeverity.HIGH,
            "category": AlertCategory.TRAFFIC,
            "latitude": 28.6139, "longitude": 77.2090,
            "affected_zone": "Downtown",
            "affected_population": 250000,
            "confidence": 0.87,
            "recommended_actions": ["Activate alternate route signage", "Deploy traffic officers at junction", "Issue public advisory"],
            "source_service": "prediction-service"
        },
        {
            "title": "Crime Hotspot Alert — Sector 17 Night Pattern",
            "description": "Kernel density analysis shows 73% elevated crime probability in Sector 17 between 11 PM - 2 AM based on 30-day historical patterns.",
            "severity": AlertSeverity.HIGH,
            "category": AlertCategory.CRIME,
            "latitude": 28.5710, "longitude": 77.2146,
            "affected_zone": "Sector 17",
            "confidence": 0.73,
            "recommended_actions": ["Deploy patrol units", "Activate CCTV monitoring", "Alert neighborhood watch"],
            "source_service": "prediction-service"
        },
        {
            "title": "CRITICAL: Flood Risk — River Basin Forecast",
            "description": "Cumulative rainfall of 187mm in 24h combined with low elevation areas creates 91% flood risk for riverside settlements.",
            "severity": AlertSeverity.CRITICAL,
            "category": AlertCategory.CLIMATE,
            "latitude": 28.7041, "longitude": 77.1025,
            "affected_zone": "Riverside District",
            "affected_population": 85000,
            "confidence": 0.91,
            "recommended_actions": ["Evacuate low-lying areas", "Open emergency shelters", "Deploy rescue teams", "Alert disaster management"],
            "source_service": "prediction-service"
        },
        {
            "title": "Disease Cluster Detected — Influenza Variant",
            "description": "Surge in ILI cases (312% above baseline) across 3 districts with Rt = 1.8. Outbreak probability: 82%.",
            "severity": AlertSeverity.MEDIUM,
            "category": AlertCategory.HEALTH,
            "latitude": 28.6692, "longitude": 77.4538,
            "affected_zone": "Medical District",
            "affected_population": 42000,
            "confidence": 0.82,
            "recommended_actions": ["Deploy mobile testing units", "Increase hospital capacity", "Issue health advisory"],
            "source_service": "prediction-service"
        },
        {
            "title": "Cyber Attack Detected — Critical Infrastructure",
            "description": "Coordinated DDoS attack targeting power grid SCADA systems. 15 IP sources identified. Attack confidence: 96%.",
            "severity": AlertSeverity.CRITICAL,
            "category": AlertCategory.CYBER,
            "confidence": 0.96,
            "recommended_actions": ["Isolate affected systems", "Activate incident response", "Notify CERT-In", "Switch to backup systems"],
            "source_service": "ingestion-service"
        },
    ]
    
    for alert_data in demo_alerts:
        req = CreateAlertRequest(**alert_data)
        await _create_alert_internal(req)
        await asyncio.sleep(0.5)

async def _create_alert_internal(req: CreateAlertRequest) -> dict:
    alert_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    alert = {
        "alert_id": alert_id,
        "title": req.title,
        "description": req.description,
        "severity": req.severity.value,
        "category": req.category.value,
        "status": AlertStatus.ACTIVE.value,
        "created_at": now,
        "updated_at": now,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "affected_zone": req.affected_zone,
        "affected_population": req.affected_population,
        "source_service": req.source_service,
        "prediction_id": req.prediction_id,
        "confidence": req.confidence,
        "recommended_actions": req.recommended_actions,
        "metadata": req.metadata,
        "auto_escalate": req.auto_escalate,
        "escalation_timeout_minutes": req.escalation_timeout_minutes,
        "acknowledged_by": None,
        "acknowledged_at": None,
        "resolved_at": None,
        "channels_notified": [],
    }
    
    alerts_db[alert_id] = alert
    alert_counters[req.severity.value] = alert_counters.get(req.severity.value, 0) + 1
    
    # Route notifications
    notified = await router_engine.route(alert)
    alert["channels_notified"] = notified
    
    return alert

# ============================================================
# ENDPOINTS
# ============================================================

@app.post("/alerts", response_model=AlertResponse, status_code=201)
async def create_alert(req: CreateAlertRequest, bg: BackgroundTasks):
    alert = await _create_alert_internal(req)
    logger.info(f"🚨 Alert created: [{alert['severity']}] {alert['title']}")
    
    return AlertResponse(
        alert_id=alert["alert_id"],
        title=alert["title"],
        severity=alert["severity"],
        category=alert["category"],
        status=alert["status"],
        created_at=alert["created_at"],
        channels_notified=alert["channels_notified"],
        affected_zone=alert.get("affected_zone"),
        recommended_actions=alert.get("recommended_actions", [])
    )

@app.get("/alerts")
async def list_alerts(
    severity: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    results = list(alerts_db.values())
    
    if severity:
        results = [a for a in results if a["severity"] == severity.upper()]
    if category:
        results = [a for a in results if a["category"] == category.upper()]
    if status:
        results = [a for a in results if a["status"] == status.upper()]
    
    results.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {
        "total": len(results),
        "alerts": results[offset:offset+limit],
        "counters": alert_counters,
    }

@app.get("/alerts/{alert_id}")
async def get_alert(alert_id: str):
    alert = alerts_db.get(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@app.patch("/alerts/{alert_id}")
async def update_alert(alert_id: str, req: UpdateAlertRequest):
    alert = alerts_db.get(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert["status"] = req.status.value
    alert["updated_at"] = datetime.utcnow().isoformat()
    
    if req.status == AlertStatus.ACKNOWLEDGED:
        alert["acknowledged_by"] = req.assigned_to
        alert["acknowledged_at"] = datetime.utcnow().isoformat()
    elif req.status == AlertStatus.RESOLVED:
        alert["resolved_at"] = datetime.utcnow().isoformat()
        alert["resolution_notes"] = req.resolution_notes
    
    await broadcast_to_websockets({"type": "ALERT_UPDATE", "alert": alert})
    return alert

@app.delete("/alerts/{alert_id}")
async def dismiss_alert(alert_id: str):
    alert = alerts_db.get(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert["status"] = AlertStatus.DISMISSED.value
    alert["updated_at"] = datetime.utcnow().isoformat()
    return {"success": True, "alert_id": alert_id}

@app.get("/alerts/stats/summary")
async def alert_stats():
    active = [a for a in alerts_db.values() if a["status"] == "ACTIVE"]
    critical = [a for a in active if a["severity"] == "CRITICAL"]
    
    return {
        "total_alerts": len(alerts_db),
        "active_alerts": len(active),
        "critical_active": len(critical),
        "by_severity": {
            s: len([a for a in alerts_db.values() if a["severity"] == s])
            for s in ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]
        },
        "by_category": {
            c: len([a for a in alerts_db.values() if a["category"] == c])
            for c in ["TRAFFIC", "CRIME", "HEALTH", "CLIMATE", "CYBER", "EMERGENCY"]
        },
        "resolution_rate": round(
            len([a for a in alerts_db.values() if a["status"] == "RESOLVED"]) / max(len(alerts_db), 1), 3
        )
    }

@app.websocket("/ws/alerts")
async def alerts_websocket(websocket: WebSocket):
    await websocket.accept()
    websocket_clients.append(websocket)
    
    # Send current active alerts immediately
    active = [a for a in alerts_db.values() if a["status"] == "ACTIVE"]
    await websocket.send_json({"type": "INIT", "alerts": active})
    
    try:
        while True:
            await asyncio.sleep(1)
    except:
        websocket_clients.remove(websocket)

@app.get("/alerts/health")
async def health():
    return {"status": "healthy", "service": "alert-service", "total_alerts": len(alerts_db)}
