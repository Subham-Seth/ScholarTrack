@echo off
title ScholarTrack - Python AI Microservice (Port 8000)
echo ========================================================
echo Starting ScholarTrack Python AI Microservice...
echo Port: 8000 | FastAPI + RapidFuzz
echo ========================================================
cd /d "%~dp0ai-service"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
