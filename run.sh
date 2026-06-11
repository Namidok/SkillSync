#!/bin/bash
# run.sh — starts FastAPI backend + Streamlit frontend

echo "🚀 Starting SkillSync..."

# Start FastAPI in background
cd "$(dirname "$0")"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
FASTAPI_PID=$!
echo "✅ FastAPI running on http://localhost:8000"

# Give FastAPI a moment to start
sleep 2

# Start Streamlit
streamlit run streamlit_app.py --server.port 8501

# Cleanup on exit
trap "kill $FASTAPI_PID" EXIT