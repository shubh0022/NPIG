"""
NPIG API Gateway
Central routing, rate limiting, authentication middleware, and request aggregation
"""

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import httpx
import asyncio
import time
import os
import json
import logging
from collections import defaultdict
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NPIG API Gateway",
    description="Central API Gateway for National Predictive Intelligence Grid",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# SERVICE REGISTRY
# ============================================================

SERVICES = {
    "auth":       os.getenv("AUTH_SERVICE_URL",       "http://auth-service:8001"),
    "ingest":     os.getenv("INGEST_SERVICE_URL",     "http://ingestion-service:8002"),
    "predict":    os.getenv("PREDICT_SERVICE_URL",    "http://prediction-service:8003"),
    "alerts":     os.getenv("ALERT_SERVICE_URL",      "http://alert-service:8004"),
    "twin":       os.getenv("TWIN_SERVICE_URL",       "http://digital-twin-service:8005"),
}

# ============================================================
# RATE LIMITER (token bucket algorithm)
# ============================================================

class RateLimiter:
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window = window_seconds
        self.requests: dict = defaultdict(list)
    
    def is_allowed(self, client_id: str, limit: int = None) -> bool:
        now = time.time()
        limit = limit or self.max_requests
        window_start = now - self.window
        
        self.requests[client_id] = [t for t in self.requests[client_id] if t > window_start]
        
        if len(self.requests[client_id]) >= limit:
            return False
        
        self.requests[client_id].append(now)
        return True

rate_limiter = RateLimiter()

# ============================================================
# REQUEST LOGGING & METRICS
# ============================================================

request_metrics = {
    "total": 0,
    "by_service": defaultdict(int),
    "errors": 0,
    "start_time": datetime.utcnow().isoformat()
}

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start = time.time()
    
    # Rate limiting
    client_ip = request.client.host if request.client else "unknown"
    
    # Higher limits for internal services
    limit = 1000 if request.headers.get("X-Internal-Service") else 100
    
    if not rate_limiter.is_allowed(client_ip, limit):
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded. Max 100 requests/minute."}
        )
    
    request_metrics["total"] += 1
    
    response = await call_next(request)
    
    elapsed = round((time.time() - start) * 1000, 2)
    
    if response.status_code >= 400:
        request_metrics["errors"] += 1
    
    response.headers["X-Response-Time"] = f"{elapsed}ms"
    response.headers["X-Service"] = "npig-gateway"
    
    logger.info(f"{request.method} {request.url.path} → {response.status_code} [{elapsed}ms]")
    return response

# ============================================================
# PROXY HELPER
# ============================================================

async def proxy_request(service: str, path: str, request: Request) -> JSONResponse:
    base_url = SERVICES.get(service)
    if not base_url:
        raise HTTPException(status_code=503, detail=f"Service '{service}' not registered")
    
    url = f"{base_url}{path}"
    
    try:
        body = await request.body()
        headers = dict(request.headers)
        headers.pop("host", None)
        headers["X-Forwarded-By"] = "npig-gateway"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.request(
                method=request.method,
                url=url,
                content=body,
                headers=headers,
                params=dict(request.query_params)
            )
        
        request_metrics["by_service"][service] += 1
        return JSONResponse(
            content=response.json() if response.content else {},
            status_code=response.status_code,
            headers={"X-Upstream-Service": service}
        )
    except httpx.ConnectError:
        logger.error(f"❌ Cannot connect to {service} at {url}")
        raise HTTPException(status_code=503, detail=f"Service '{service}' is unavailable")
    except Exception as e:
        logger.error(f"Gateway proxy error: {e}")
        raise HTTPException(status_code=500, detail=f"Gateway error: {str(e)}")

# ============================================================
# ROUTE DEFINITIONS
# ============================================================

# Auth routes
@app.api_route("/api/auth/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def auth_proxy(path: str, request: Request):
    return await proxy_request("auth", f"/auth/{path}", request)

# Ingestion routes
@app.api_route("/api/ingest/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def ingest_proxy(path: str, request: Request):
    return await proxy_request("ingest", f"/ingest/{path}", request)

# Prediction routes
@app.api_route("/api/predict/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def predict_proxy(path: str, request: Request):
    return await proxy_request("predict", f"/predict/{path}", request)

# Alert routes
@app.api_route("/api/alerts/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def alerts_proxy(path: str, request: Request):
    return await proxy_request("alerts", f"/alerts/{path}", request)

# Digital twin routes
@app.api_route("/api/twin/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def twin_proxy(path: str, request: Request):
    return await proxy_request("twin", f"/twin/{path}", request)

# ============================================================
# AGGREGATED ENDPOINTS
# ============================================================

@app.get("/api/v1/city-intelligence")
async def city_intelligence():
    """Aggregated city intelligence snapshot from all services"""
    async with httpx.AsyncClient(timeout=10.0) as client:
        results = {}
        tasks = {
            "predictions": f"{SERVICES['predict']}/predict/dashboard-snapshot",
            "alerts": f"{SERVICES['alerts']}/alerts/stats/summary",
            "ingestion": f"{SERVICES['ingest']}/ingest/status",
        }
        
        for name, url in tasks.items():
            try:
                resp = await client.get(url)
                results[name] = resp.json()
            except:
                results[name] = {"error": "service_unavailable"}
    
    results["gateway_metrics"] = {
        "total_requests": request_metrics["total"],
        "error_rate": round(request_metrics["errors"] / max(request_metrics["total"], 1), 3),
        "by_service": dict(request_metrics["by_service"]),
        "uptime_since": request_metrics["start_time"]
    }
    results["timestamp"] = datetime.utcnow().isoformat()
    
    return results

@app.get("/api/v1/health")
async def health_check():
    """Check health of all microservices"""
    service_health = {}
    async with httpx.AsyncClient(timeout=5.0) as client:
        for name, base_url in SERVICES.items():
            try:
                resp = await client.get(f"{base_url}/health", timeout=3.0)
                service_health[name] = {
                    "status": "healthy" if resp.status_code == 200 else "degraded",
                    "code": resp.status_code
                }
            except:
                service_health[name] = {"status": "unreachable", "code": 0}
    
    all_healthy = all(s["status"] == "healthy" for s in service_health.values())
    
    return {
        "gateway": "healthy",
        "overall_status": "healthy" if all_healthy else "degraded",
        "services": service_health,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/v1/metrics")
async def get_metrics():
    return {
        "gateway": {
            **request_metrics,
            "by_service": dict(request_metrics["by_service"])
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/")
async def root():
    return {
        "system": "National Predictive Intelligence Grid (NPIG)",
        "version": "1.0.0",
        "status": "OPERATIONAL",
        "api_docs": "/api/docs",
        "health": "/api/v1/health",
        "services": list(SERVICES.keys()),
        "timestamp": datetime.utcnow().isoformat()
    }
