@echo off
title ScholarTrack - React Frontend (Port 5173)
echo ========================================================
echo Starting ScholarTrack React Vite Frontend...
echo Port: 5173 | URL: http://localhost:5173
echo ========================================================
cd /d "%~dp0frontend"
npm run dev
pause
