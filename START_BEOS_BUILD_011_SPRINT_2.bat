@echo off
setlocal
cd /d "%~dp0"
title Basithami Enterprise Operating System - Build 011 Sprint 2
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not available in PATH.
  echo Install Node.js and run this launcher again.
  pause
  exit /b 1
)
echo Starting Basithami Enterprise Operating System...
node server.cjs
if errorlevel 1 pause
endlocal
