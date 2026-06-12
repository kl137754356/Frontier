# 心跳任务测试脚本
# 正确的使用方式：调用 /heartbeat HTTP API，NOT CronCreate 工具

$API_URL = "http://localhost:8081/heartbeat"

# 1. 添加心跳任务
Write-Host "添加心跳任务..." -ForegroundColor Cyan
$addBody = @{
    action = "add"
    id = "test-heartbeat"
    prompt = "你是谁，你能干什么"
    intervalSeconds = 30  # 每30秒执行一次
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $API_URL `
    -Method POST `
    -Body $addBody `
    -ContentType "application/json; charset=utf-8" `
    -ErrorAction Stop

Write-Host "任务创建结果: " -ForegroundColor Green
$response.Content | ConvertFrom-Json | Format-List

# 2. 列出所有心跳任务
Write-Host "`n查看所有心跳任务..." -ForegroundColor Cyan
$listBody = @{ action = "list" } | ConvertTo-Json
$listResponse = Invoke-WebRequest -Uri $API_URL `
    -Method POST `
    -Body $listBody `
    -ContentType "application/json" `
    -ErrorAction Stop

Write-Host "任务列表: " -ForegroundColor Green
$listResponse.Content | ConvertFrom-Json | Format-List

# 3. 等待一会儿，看心跳是否执行
Write-Host "`n等待40秒，查看心跳是否执行..." -ForegroundColor Yellow
Start-Sleep -Seconds 40

# 4. 再次列出任务，查看 lastRun 和 runCount
$listResponse = Invoke-WebRequest -Uri $API_URL `
    -Method POST `
    -Body $listBody `
    -ContentType "application/json" `
    -ErrorAction Stop

Write-Host "心跳执行状态: " -ForegroundColor Green
$tasks = ($listResponse.Content | ConvertFrom-Json).tasks
$tasks | Format-Table -Property id, prompt, intervalMs, lastRun, runCount

# 5. 停止心跳任务
Write-Host "`n停止心跳任务..." -ForegroundColor Cyan
$removeBody = @{ 
    action = "remove"
    id = "test-heartbeat"
} | ConvertTo-Json

$removeResponse = Invoke-WebRequest -Uri $API_URL `
    -Method POST `
    -Body $removeBody `
    -ContentType "application/json" `
    -ErrorAction Stop

Write-Host "任务移除结果: " -ForegroundColor Green
$removeResponse.Content | ConvertFrom-Json | Format-List
