#!/bin/bash
# ============================================================
# NPIG - Stop All Running Services
# ============================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🛑 Stopping NPIG Services..."

# Kill by PID files if available
if [ -d "$PROJECT_ROOT/logs" ]; then
  for pid_file in "$PROJECT_ROOT/logs"/*.pid; do
    if [ -f "$pid_file" ]; then
      pid=$(cat "$pid_file")
      if kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null || true
        echo "Killed process $pid ($pid_file)"
      fi
      rm -f "$pid_file"
    fi
  done
fi

# Fallback kill by port
for port in 3000 8000 8001 8002 8003 8004 8005 8006; do
  pids=$(lsof -ti :$port 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "Terminating process on port $port (PID: $pids)"
    kill -9 $pids 2>/dev/null || true
  fi
done

echo "✅ All NPIG services stopped."
