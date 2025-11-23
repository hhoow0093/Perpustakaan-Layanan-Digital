@echo off
title Perpustakaan Layanan Digital - Auto Starter
color 0A

echo ========================================
echo   Perpustakaan Layanan Digital Starter
echo ========================================
echo.

echo [1/4] Checking backend dependencies...
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

echo.
echo [2/4] Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo [3/4] Starting Backend Server...
start "Backend Server - Port 5000" cmd /k "color 0B && cd backend && npm run dev"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Starting Frontend Server...
start "Frontend Server - Port 5173" cmd /k "color 0D && cd frontend && npm run dev"

echo.
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173 or 5174
echo ========================================
echo.
echo Servers are running in separate windows!
echo You can close this window safely.
echo.
pause
