# Generic Task Heartbeat Template
# 通用任务模板 - 支持文件数量限制和基于时间的自动停止

param(
    [string]$TaskName = "generic-task",
    [int]$IntervalSeconds = 60,
    [int]$MaxRunMinutes = 0,        # 0 = 无限运行
    [int]$MaxLogFiles = 10,         # 日志文件数量限制
    [long]$MaxLogSizeKB = 1024      # 单个日志文件最大 KB
)

# === 配置 ===
$heartbeatDir = "$env:APPDATA\frontier-desktop\heartbeat"
$logFile = "$heartbeatDir\$TaskName.log"
$pidFile = "$heartbeatDir\$TaskName.pid"

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

function Limit-LogSize {
    # 检查日志文件大小，超出限制时轮转
    if (Test-Path $logFile) {
        $fileInfo = Get-Item $logFile
        if ($fileInfo.Length / 1KB -gt $MaxLogSizeKB) {
            # 轮转日志
            $rotatedName = "$heartbeatDir\$TaskName-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
            Move-Item $logFile $rotatedName -Force
            Write-Log "日志已轮转到: $rotatedName"

            # 清理旧日志文件
            $logFiles = Get-ChildItem -Path $heartbeatDir -Filter "$TaskName-*.log" | Sort-Object LastWriteTime -Descending
            if ($logFiles.Count -gt $MaxLogFiles) {
                $logFiles | Select-Object -Skip $MaxLogFiles | ForEach-Object {
                    Remove-Item $_.FullName -Force
                }
            }
        }
    }
}

function Test-ShouldStop {
    # 基于时间的自动停止
    if ($MaxRunMinutes -gt 0) {
        $elapsed = (Get-Date) - $startTime
        if ($elapsed.TotalMinutes -ge $MaxRunMinutes) {
            Write-Log "已达到最大运行时间 (${MaxRunMinutes} 分钟)，自动停止"
            return $true
        }
    }
    return $false
}

function Invoke-Task {
    # === 在这里实现你的任务逻辑 ===
    # 示例：记录系统状态
    $cpuUsage = (Get-Counter '\Processor(_Total)\% Processor Time' -ErrorAction SilentlyContinue).CounterSamples[0].CookedValue
    $memInfo = Get-CimInstance -ClassName Win32_OperatingSystem
    $memUsage = [math]::Round(($memInfo.TotalVisibleMemorySize - $memInfo.FreePhysicalMemory) / $memInfo.TotalVisibleMemorySize * 100, 1)

    Write-Log "CPU: ${cpuUsage}%, 内存: ${memUsage}%"
    # === 任务逻辑结束 ===
}

# === 主循环 ===
Write-Log "通用任务启动 - 间隔: ${IntervalSeconds}秒, 最大运行: $(if($MaxRunMinutes -eq 0){'无限'}else{"${MaxRunMinutes}分钟"})"

while ($true) {
    try {
        # 检查是否需要停止
        if (Test-ShouldStop) {
            break
        }

        # 限制日志大小
        Limit-LogSize

        # 执行任务
        Invoke-Task

    } catch {
        Write-Log "任务执行异常: $_"
    }

    Start-Sleep -Seconds $IntervalSeconds
}

# 清理 PID 文件
if (Test-Path $pidFile) {
    Remove-Item $pidFile -Force
}
Write-Log "任务已停止"
