@echo off
title ScholarTrack - Spring Boot Backend (Port 8080)
echo ========================================================
echo Starting ScholarTrack Spring Boot Backend...
echo Port: 8080 | Profile: dev (H2 embedded + auto-seed)
echo ========================================================
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run
pause
