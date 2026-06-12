@echo off
REM 一键完整打包脚本
REM 用法: build-and-package.bat

setlocal enabledelayedexpansion

echo.
echo ========================================
echo  Frontier Desktop - Complete Build
echo ========================================
echo.

REM 检查 Node.js
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js !NODE_VERSION! detected

REM 检查 Rust（可选）
rustc --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ! Rust not found. Will use existing claw.exe if available.
) else (
    for /f "tokens=*" %%i in ('rustc --version') do set RUST_VERSION=%%i
    echo ✓ !RUST_VERSION! detected
)

REM 获取版本号
for /f "tokens=3" %%i in ('findstr "\"version\"" package.json') do (
    set VERSION=%%i
    set VERSION=!VERSION:"=!
    set VERSION=!VERSION:,=!
    goto version_found
)
:version_found
echo ✓ Building version: !VERSION!
echo.

REM Step 1: 清理旧的构建
echo --- Step 1: Clean old builds ---
if exist frontend-dist (
    echo Removing old frontend-dist...
    rmdir /s /q frontend-dist >nul 2>&1
)
if exist backend-dist (
    echo Removing old backend-dist...
    rmdir /s /q backend-dist >nul 2>&1
)
echo.

REM Step 2: 执行构建
echo --- Step 2: Build (frontend, backend, copy claw.exe) ---
call node scripts\build.js
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

REM Step 3: 应用后端补丁
echo --- Step 3: Apply backend patches ---
call node scripts\patch-backend.js
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Patch failed, continuing anyway...
)
echo.

REM Step 4: 生成安装程序
echo --- Step 4: Generate installer ---
call npm run dist:win
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Packaging failed!
    pause
    exit /b 1
)
echo.

REM Step 5: 显示结果
echo ========================================
echo  Build Complete!
echo ========================================
echo.
echo Output location: release\Frontier\
echo.

if exist "release\Frontier Setup !VERSION!.exe" (
    for /f "%%i in ('dir /B /S "release\Frontier Setup*.exe"') do (
        for %%j in (%%i) do (
            set FILESIZE=%%~zj
        )
    )
    REM 计算文件大小
    set /A FILESIZE_MB=!FILESIZE! / 1024 / 1024
    echo ✓ Installer: Frontier Setup !VERSION!.exe (!FILESIZE_MB!MB)
) else (
    echo ! Installer not found (check release\ directory)
)

if exist "release\Frontier\" (
    echo ✓ Portable version: release\Frontier\ (extractable)
)

echo.
echo Next steps:
echo   1. Test on a clean machine
echo   2. Run: .\release\Frontier\Frontier.vbs
echo   3. Verify features work correctly
echo   4. For distribution: zip release\Frontier\
echo.

REM Optional: Open explorer to show results
if exist release\Frontier (
    echo Opening release folder...
    explorer release
)

pause
exit /b 0
