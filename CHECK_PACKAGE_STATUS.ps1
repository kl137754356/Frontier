# 检查安装包状态 - 验证是否需要重新构建

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     安装包状态检查                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan

$needsRebuild = $false

# 检查 1: 源代码是否已更新
Write-Host "`n📝 检查 1: 源代码更新状态" -ForegroundColor Yellow

$sourceChecks = @(
    ("installer/skills/heartbeat/AGENT_INSTRUCTIONS.md", "Agent 指令"),
    ("installer/docs/DISABLE_CRONCREATE.md", "禁用文档"),
    ("installer/skills/heartbeat/SKILL.md", "技能文档（应更新）")
)

foreach ($check in $sourceChecks) {
    $path = $check[0]
    $name = $check[1]
    
    if (Test-Path $path) {
        Write-Host "  ✓ $name 已存在" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $name 缺失" -ForegroundColor Red
        $needsRebuild = $true
    }
}

# 检查 2: 后端代码是否已修改
Write-Host "`n🔧 检查 2: 后端代码修改状态" -ForegroundColor Yellow

$wsHandlerPath = "claw-web-chat/backend/src/ws-handler.ts"
if (Test-Path $wsHandlerPath) {
    $content = Get-Content $wsHandlerPath -Raw
    if ($content -like "*agentInstructions*") {
        Write-Host "  ✓ ws-handler.ts 已修改（检测到 agentInstructions）" -ForegroundColor Green
    } else {
        Write-Host "  ✗ ws-handler.ts 未修改" -ForegroundColor Red
        $needsRebuild = $true
    }
} else {
    Write-Host "  ✗ ws-handler.ts 未找到" -ForegroundColor Red
}

# 检查 3: 安装包中的文件
Write-Host "`n📦 检查 3: 安装包中的文件" -ForegroundColor Yellow

$packageChecks = @(
    ("installer/release/Frontier/skills/heartbeat/AGENT_INSTRUCTIONS.md", "安装包中的 Agent 指令"),
    ("installer/release/Frontier/docs/DISABLE_CRONCREATE.md", "安装包中的禁用文档")
)

foreach ($check in $packageChecks) {
    $path = $check[0]
    $name = $check[1]
    
    if (Test-Path $path) {
        Write-Host "  ✓ $name 已包含" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $name 未包含（需要重新构建）" -ForegroundColor Red
        $needsRebuild = $true
    }
}

# 检查 4: 安装程序
Write-Host "`n🔍 检查 4: 安装程序状态" -ForegroundColor Yellow

$exeFile = Get-ChildItem "installer/release/Frontier Setup*.exe" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($exeFile) {
    $fileTime = $exeFile.LastWriteTime
    $sourceTime = (Get-Item "installer/skills/heartbeat/AGENT_INSTRUCTIONS.md").LastWriteTime
    
    if ($fileTime -lt $sourceTime) {
        Write-Host "  ⚠️  安装程序已过期（源文件比安装程序更新）" -ForegroundColor Yellow
        $needsRebuild = $true
    } else {
        Write-Host "  ✓ 安装程序是最新的" -ForegroundColor Green
    }
    
    $sizeMB = [math]::Round($exeFile.Length / 1MB, 1)
    Write-Host "  📄 $($exeFile.Name) ($sizeMB MB)" -ForegroundColor Gray
} else {
    Write-Host "  ✗ 未找到安装程序" -ForegroundColor Yellow
    $needsRebuild = $true
}

# 最终状态
Write-Host "`n` -ForegroundColor White
Write-Host "═════════════════════════════════════════" -ForegroundColor Cyan

if ($needsRebuild) {
    Write-Host "`n⚠️  需要重新构建安装包" -ForegroundColor Red
    Write-Host "`n运行以下命令进行重建：" -ForegroundColor Yellow
    Write-Host "  .\REBUILD_PACKAGE.ps1" -ForegroundColor White
    Write-Host "  或" -ForegroundColor White
    Write-Host "  cd installer; npm run build; npm run dist:win" -ForegroundColor White
} else {
    Write-Host "`n✅ 安装包已是最新" -ForegroundColor Green
    Write-Host "  无需重新构建" -ForegroundColor Gray
}

Write-Host "`n" -ForegroundColor White

# 返回状态码
exit $needsRebuild ? 1 : 0
