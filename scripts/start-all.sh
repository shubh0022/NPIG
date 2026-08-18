#!/bin/bash
# ============================================================
# NPIG - Start All Services Locally
# ============================================================

set -e
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "============================================================"
echo "🚀 Starting National Predictive Intelligence Grid (NPIG)..."
echo "============================================================"

# Create logs directory
mkdir -p "$PROJECT_ROOT/logs"

# 1. Auth Service (Port 8001)
echo "🔐 Starting Auth Service (Port 8001)..."
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 \
  --app-dir "$PROJECT_ROOT/services/auth-service" \
  > "$PROJECT_ROOT/logs/auth-service.log" 2>&1 &
echo $! > "$PROJECT_ROOT/logs/auth.pid"

# 2. Ingestion Service (Port 8002)
echo "📡 Starting Ingestion Service (Port 8002)..."
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8002 \
  --app-dir "$PROJECT_ROOT/services/ingestion-service" \
  > "$PROJECT_ROOT/logs/ingestion-service.log" 2>&1 &
echo $! > "$PROJECT_ROOT/logs/ingest.pid"

# 3. Prediction Service (Port 8003)
echo "⚡ Starting Prediction Service (Port 8003)..."
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8003 \
  --app-dir "$PROJECT_ROOT/services/prediction-service" \
  > "$PROJECT_ROOT/logs/prediction-service.log" 2>&1 &
echo $! > "$PROJECT_ROOT/logs/prediction.pid"

# 4. Alert Service (Port 8004)
echo "🚨 Starting Alert Service (Port 8004)..."
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8004 \
  --app-dir "$PROJECT_ROOT/services/alert-service" \
  > "$PROJECT_ROOT/logs/alert-service.log" 2>&1 &
echo $! > "$PROJECT_ROOT/logs/alert.pid"

# 5. Digital Twin Service (Port 8005)
echo "🌐 Starting Digital Twin Service (Port 8005)..."
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8005 \
  --app-dir "$PROJECT_ROOT/services/digital-twin-service" \
  > "$PROJECT_ROOT/logs/digital-twin-service.log" 2>&1 &
echo $! > "$PROJECT_ROOT/logs/twin.pid"

# 6. NEXUS Chatbot Service (Port 8006)
echo "🤖 Starting NEXUS Chatbot Service (Port 8006)..."
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8006 \
  --app-dir "$PROJECT_ROOT/services/nexus-chatbot" \
  > "$PROJECT_ROOT/logs/nexus-chatbot.log" 2>&1 &
echo $! > "$PROJECT_ROOT/logs/nexus.pid"

# 7. API Gateway (Port 8000)
echo "🛡️ Starting API Gateway (Port 8000)..."
AUTH_SERVICE_URL="http://localhost:8001" \
INGEST_SERVICE_URL="http://localhost:8002" \
PREDICT_SERVICE_URL="http://localhost:8003" \
ALERT_SERVICE_URL="http://localhost:8004" \
TWIN_SERVICE_URL="http://localhost:8005" \
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 \
  --app-dir "$PROJECT_ROOT/services/api-gateway" \
  > "$PROJECT_ROOT/logs/api-gateway.log" 2>&1 &
echo $! > "$PROJECT_ROOT/logs/gateway.pid"

# 8. Frontend (Port 3000)
echo "🎨 Starting Frontend Dashboard (Port 3000)..."
cd "$PROJECT_ROOT/frontend"
nohup npm run dev > "$PROJECT_ROOT/logs/frontend.log" 2>&1 &
echo $! > "$PROJECT_ROOT/logs/frontend.pid"
cd "$PROJECT_ROOT"

echo "============================================================"
echo "✅ All NPIG services launched successfully!"
echo "------------------------------------------------------------"
echo "🖥️  Frontend UI:          http://localhost:3000"
echo "🛡️  API Gateway:          http://localhost:8000 (Docs: /api/docs)"
echo "🔐 Auth Service:         http://localhost:8001"
echo "📡 Ingestion Service:    http://localhost:8002"
echo "⚡ Prediction Service:    http://localhost:8003"
echo "🚨 Alert Service:         http://localhost:8004"
echo "🌐 Digital Twin Service:  http://localhost:8005"
echo "🤖 NEXUS Chatbot Service: http://localhost:8006"
echo "------------------------------------------------------------"
echo "📁 Logs stored in: $PROJECT_ROOT/logs/"
echo "🛑 To stop all services: ./scripts/stop-all.sh"
echo "============================================================"
