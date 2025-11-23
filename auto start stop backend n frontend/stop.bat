@echo off
title Stop Perpustakaan Servers
color 0C

echo ========================================
echo   Stopping Perpustakaan Servers
echo ========================================
echo.

echo Stopping processes on port 5000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul

echo Stopping processes on port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul

echo Stopping processes on port 5174 (Frontend Alt)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5174" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul

echo.
echo All servers stopped!
echo.
pause
