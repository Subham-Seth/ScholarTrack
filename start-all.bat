@echo off
title ScholarTrack - System Orchestrator
echo ========================================================
echo SCHOLARTRACK: Launching Full-Stack Application
echo ========================================================
echo [1/3] Launching Spring Boot Backend (Port 8080)...
start "ScholarTrack Backend (8080)" cmd /k "%~dp0start-backend.bat"

echo [2/3] Launching Python AI Microservice (Port 8000)...
start "ScholarTrack AI Microservice (8000)" cmd /k "%~dp0start-ai.bat"

echo [3/3] Launching React Vite Frontend (Port 5173)...
start "ScholarTrack Frontend (5173)" cmd /k "%~dp0start-frontend.bat"

echo ========================================================
echo All services triggered in separate console windows!
echo - Web App:    http://localhost:5173
echo - Backend:    http://localhost:8080/api
echo - H2 Console: http://localhost:8080/h2-console
echo - AI Service: http://localhost:8000/docs
echo ========================================================
pause
