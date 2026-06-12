@echo off
echo ================================================
echo   Frontier Desktop - Build Installer
echo ================================================
echo.

:: Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

:: Install dependencies
echo [1/5] Installing installer dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

:: Build everything
echo.
echo [2/5] Building frontend, backend, and copying claw.exe...
call node scripts/build.js
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

:: Patch backend for production
echo.
echo [3/5] Patching backend for production mode...
call node scripts/patch-backend.js

:: Create installer
echo.
echo [4/5] Creating Windows installer...
call npx electron-builder --win
if %ERRORLEVEL% neq 0 (
    echo ERROR: electron-builder failed
    pause
    exit /b 1
)

echo.
echo [5/5] Done! Installer is in: release\
echo.
dir release\*.exe 2>nul
echo.
pause
