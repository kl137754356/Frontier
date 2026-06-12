# Frontier Desktop - 一键完整打包脚本
# 用法: .\build-and-package.ps1

param(
    [switch]$NoClean,      # 不清理旧的构建
    [switch]$SkipTests,    # 跳过测试
    [switch]$OpenExplorer  # 打包完成后打开文件夹
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$text)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$text)
    Write-Host "--- $text ---" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$text)
    Write-Host "✓ $text" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$text)
    Write-Host "✗ ERROR: $text" -ForegroundColor Red
    exit 1
}

# ============================================================

Write-Header "Frontier Desktop - Complete Build"

# 检查 Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js $nodeVersion detected"
} catch {
    Write-Error-Custom "Node.js not found! Please install Node.js 18+ from https://nodejs.org"
}

# 检查 Rust（可选）
try {
    $rustVersion = rustc --version
    Write-Success "$rustVersion detected"
} catch {
    Write-Host "! Rust not found. Will use existing claw.exe if available." -ForegroundColor Yellow
}

# 获取版本号
$packageJson = Get-Content package.json | ConvertFrom-Json
$version = $packageJson.version
Write-Success "Building version: $version"

# ============================================================

# Step 1: 清理旧的构建
if (-not $NoClean) {
    Write-Step "Step 1: Clean old builds"
    
    if (Test-Path "frontend-dist") {
        Write-Host "  Removing old frontend-dist..."
        Remove-Item -Recurse -Force "frontend-dist" -ErrorAction SilentlyContinue
    }
    if (Test-Path "backend-dist") {
        Write-Host "  Removing old backend-dist..."
        Remove-Item -Recurse -Force "backend-dist" -ErrorAction SilentlyContinue
    }
    Write-Host ""
}

# ============================================================

# Step 2: 执行构建
Write-Step "Step 2: Build (frontend, backend, copy claw.exe)"
try {
    & node scripts/build.js
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Build failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Error-Custom "Build script failed: $_"
}
Write-Host ""

# ============================================================

# Step 3: 应用后端补丁
Write-Step "Step 3: Apply backend patches"
try {
    & node scripts/patch-backend.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host "! Warning: Patch may have failed, continuing anyway..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "! Warning: Patch error, continuing anyway..." -ForegroundColor Yellow
}
Write-Host ""

# ============================================================

# Step 4: 测试心跳任务脚本（可选）
if (-not $SkipTests) {
    Write-Step "Step 4: Verify heartbeat skill"
    
    $heartbeatPath = Join-Path (Get-Location) "skills/heartbeat"
    if (Test-Path "$heartbeatPath/SKILL.md") {
        Write-Success "Heartbeat skill found"
        Write-Success "  - SKILL.md exists"
    }
    
    if (Test-Path "$heartbeatPath/HEARTBEAT_GUIDE.md") {
        Write-Success "  - HEARTBEAT_GUIDE.md exists"
    }
    
    if (Test-Path "$heartbeatPath/test-heartbeat.ps1") {
        Write-Success "  - test-heartbeat.ps1 exists"
    }
    Write-Host ""
}

# ============================================================

# Step 5: 生成安装程序
Write-Step "Step 5: Generate installer (this may take a few minutes)"
try {
    & npm run dist:win
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Packaging failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Error-Custom "Packaging failed: $_"
}
Write-Host ""

# ============================================================

# Step 6: 显示结果
Write-Header "Build Complete!"

Write-Host "Output location: release\Frontier\" -ForegroundColor Green
Write-Host ""

# 获取文件大小
$installerPath = Get-ChildItem "release\Frontier*.exe" -ErrorAction SilentlyContinue
if ($installerPath) {
    $sizeMB = [math]::Round($installerPath.Length / 1MB, 1)
    Write-Success "Installer: $($installerPath.Name) ($sizeMB MB)"
} else {
    Write-Host "! Installer not found (check release\ directory)" -ForegroundColor Yellow
}

if (Test-Path "release\Frontier") {
    $portableSize = (Get-ChildItem "release\Frontier" -Recurse | Measure-Object -Property Length -Sum).Sum
    $portableMB = [math]::Round($portableSize / 1MB, 1)
    Write-Success "Portable version: release\Frontier\ ($portableMB MB)"
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Test on a clean machine"
Write-Host "  2. Run: .\release\Frontier\Frontier.vbs"
Write-Host "  3. Verify features work correctly"
Write-Host "  4. For distribution: zip release\Frontier\"
Write-Host ""

# 可选：打开文件夹
if ($OpenExplorer -or $PSBoundParameters.ContainsKey("OpenExplorer")) {
    if (Test-Path "release\Frontier") {
        Write-Host "Opening release folder..." -ForegroundColor Green
        Invoke-Item "release"
    }
}

Write-Host "`n✓ Packaging complete!" -ForegroundColor Green
Write-Host ""
