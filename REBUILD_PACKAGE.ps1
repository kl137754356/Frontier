# 重新构建安装包 - 包含最新的 CronCreate 禁用修改
# 用法: .\REBUILD_PACKAGE.ps1

$ErrorActionPreference = "Stop"

Write-Host "`n" -ForegroundColor Green
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  重新构建 Frontier 安装包               ║" -ForegroundColor Cyan
Write-Host "║  包含 CronCreate 禁用和新增文件         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan

# 步骤 1: 验证源文件
Write-Host "`n📋 步骤 1: 验证源文件存在..." -ForegroundColor Yellow

$requiredFiles = @(
    "installer/skills/heartbeat/AGENT_INSTRUCTIONS.md",
    "installer/skills/heartbeat/SKILL.md",
    "installer/docs/DISABLE_CRONCREATE.md",
    "claw-web-chat/backend/src/ws-handler.ts"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ 缺少: $file" -ForegroundColor Red
        exit 1
    }
}

# 步骤 2: 清理旧的构建
Write-Host "`n🗑️  步骤 2: 清理旧的构建..." -ForegroundColor Yellow

$cleanDirs = @("installer/frontend-dist", "installer/backend-dist", "installer/release")
foreach ($dir in $cleanDirs) {
    if (Test-Path $dir) {
        Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
        Write-Host "  ✓ 删除 $dir" -ForegroundColor Green
    }
}

# 步骤 3: 执行构建
Write-Host "`n🔨 步骤 3: 执行构建脚本..." -ForegroundColor Yellow

try {
    Push-Location "installer"
    
    Write-Host "  → 运行 npm run build..." -ForegroundColor Gray
    & npm run build 2>&1 | ForEach-Object { Write-Host "    $_" }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ 构建失败" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "  ✓ 构建完成" -ForegroundColor Green
    
    # 步骤 4: 生成安装程序
    Write-Host "`n📦 步骤 4: 生成安装程序..." -ForegroundColor Yellow
    Write-Host "  → 运行 npm run dist:win..." -ForegroundColor Gray
    & npm run dist:win 2>&1 | ForEach-Object { Write-Host "    $_" }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ 打包失败" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Pop-Location
    Write-Host "  ✓ 打包完成" -ForegroundColor Green
    
} catch {
    Write-Host "  ✗ 错误: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

# 步骤 5: 验证打包内容
Write-Host "`n✅ 步骤 5: 验证打包内容..." -ForegroundColor Yellow

$packagingChecks = @(
    ("installer/release/Frontier/skills/heartbeat/AGENT_INSTRUCTIONS.md", "Agent 指令"),
    ("installer/release/Frontier/skills/heartbeat/SKILL.md", "技能文档"),
    ("installer/release/Frontier/docs/DISABLE_CRONCREATE.md", "禁用说明"),
    ("installer/release/Frontier/backend-dist", "后端文件"),
    ("installer/release/Frontier/frontend-dist", "前端文件")
)

foreach ($check in $packagingChecks) {
    $path = $check[0]
    $name = $check[1]
    
    if (Test-Path $path) {
        Write-Host "  ✓ $name" -ForegroundColor Green
    } else {
        Write-Host "  ✗ 缺少: $name" -ForegroundColor Red
    }
}

# 步骤 6: 显示结果
Write-Host "`n📊 构建结果" -ForegroundColor Green
Write-Host "═════════════════════════════════════" -ForegroundColor Cyan

$exeFile = Get-ChildItem "installer/release/Frontier Setup*.exe" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($exeFile) {
    $sizeMB = [math]::Round($exeFile.Length / 1MB, 1)
    Write-Host "  📦 安装程序: $($exeFile.Name) ($sizeMB MB)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  未找到安装程序" -ForegroundColor Yellow
}

$portableDir = "installer/release/Frontier"
if (Test-Path $portableDir) {
    $portableSize = (Get-ChildItem $portableDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "  📁 便携版: installer/release/Frontier ($([math]::Round($portableSize, 1)) MB)" -ForegroundColor Green
}

Write-Host "`n✅ 构建完成！新增文件：" -ForegroundColor Green
Write-Host "  • AGENT_INSTRUCTIONS.md - Agent 强制指令" -ForegroundColor Gray
Write-Host "  • DISABLE_CRONCREATE.md - 技术文档" -ForegroundColor Gray
Write-Host "  • 后端代码修改 - resolveSkill() 函数" -ForegroundColor Gray

Write-Host "`n📋 后续步骤：" -ForegroundColor Cyan
Write-Host "  1. 测试新的安装程序"
Write-Host "  2. 验证 Agent 是否只使用 /heartbeat API"
Write-Host "  3. 发布给用户"

Write-Host "`n" -ForegroundColor Green
