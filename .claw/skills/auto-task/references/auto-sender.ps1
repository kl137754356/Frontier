# Auto Sender Template
# 自动发送消息给 Agent 模板 - 定时向 /agent 端点发送 POST 请求

param(
    [string]$TaskName = "auto-sender",
    [string]$Message = "定时任务触发",
    [int]$IntervalSeconds = 60,
    [int]$MaxRunMinutes = 0,        # 0 = 无限运行
    [int]$Port = 8081
)

# === 配置 ===
$heartbeatDir = "$env:APPDATA\frontier-desktop\heartbeat"
$logFile = "$heartbeatDir\$TaskName.log"
$pidFile = "$heartbeatDir\$TaskName.pid"
$baseUrl = "http://localhost:$Port"

# 确保目录存在
if (!(Test-Path $heartbeatDir)) {
    New-Item -ItemType Directory -Path $heartbeatDir -Force | Out-Null
}

# 记录 PID
$PID | Out-File -FilePath $pidFile -Encoding UTF8 -Force

$startTime = Get-Date

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Add-Content -Path $logFile -Value $logEntry -Encoding UTF8
}

function Test-ShouldStop {
    if ($MaxRunMinutes -gt 0) {
        $elapsed = (Get-Date) - $startTime
        if ($elapsed.TotalMinutes -ge $MaxRunMinutes) {
            Write-Log "已达到最大运行时间 (${MaxRunMinutes} 分钟)，自动停止"
            return $true
        }
    }
    return $false
}

function Send-MessageToAgent {
    param([string]$Content)

    try {
        $body = @{
            message = $Content
            source = "auto-task"
            taskName = $TaskName
            timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
        } | ConvertTo-Json -Compress

        $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
        $response = Invoke-WebRequest -Uri "$baseUrl/agent" -Method POST -Body $bodyBytes -ContentType "application/json; charset=utf-8" -TimeoutSec 120 -UseBasicParsing

        if ($response.StatusCode -eq 200) {
            Write-Log "消息发送成功: $Content"
            return $true
        } else {
            Write-Log "消息发送异常 - 状态码: $($response.StatusCode)"
            return $false
        }
    } catch {
        Write-Log "消息发送失败: $_"
        return $false
    }
}

# === 主循环 ===
Write-Log "Auto-Task 启动 - 消息: $Message, 间隔: ${IntervalSeconds}秒, 目标: $baseUrl/agent"

$sendCount = 0
$failCount = 0

while ($true) {
    try {
        # 检查是否需要停止
        if (Test-ShouldStop) {
            break
        }

        # 发送消息
        $success = Send-MessageToAgent -Content $Message
        $sendCount++

        if (!$success) {
            $failCount++
            if ($failCount -ge 5) {
                Write-Log "连续失败 ${failCount} 次，等待较长时间后重试"
                Start-Sleep -Seconds ($IntervalSeconds * 3)
                $failCount = 0
                continue
            }
        } else {
            $failCount = 0
        }

    } catch {
        Write-Log "任务执行异常: $_"
    }

    Start-Sleep -Seconds $IntervalSeconds
}

# 清理 PID 文件
if (Test-Path $pidFile) {
    Remove-Item $pidFile -Force
}
Write-Log "Auto-Task 已停止 (共发送 ${sendCount} 次消息)"
