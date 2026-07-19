@echo off
setlocal
cd /d "%~dp0"
title BASITHAMI ENTERPRISE PLATFORM V7 - SOURCE BUILD 004
cls
echo ======================================================
echo  BASITHAMI ENTERPRISE PLATFORM V7 - SOURCE BUILD 004
echo ======================================================
echo.
npm config set registry https://registry.npmjs.org/
if not exist node_modules (
  echo Installing dependencies from the public npm registry...
  call npm install --registry=https://registry.npmjs.org/
  if errorlevel 1 (
    echo.
    echo Installation failed. Use the Portable Build for testing.
    pause
    exit /b 1
  )
)
echo Starting BEP V7...
call npm run dev
pause
