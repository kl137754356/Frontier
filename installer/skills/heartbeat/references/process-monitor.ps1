# Process Monitor Heartbeat Template
# 进程监控模板 - 定时检测指定进程是否在运行

param(
    [string]$TaskName = "process-monitor",
    [string]$ProcessName = "notepad",
    [int]$IntervalSeconds = 30,
    [string]$RecoveryCommand = ""
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

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Add-Content -Path $logFile -Value $logEntry -Encoding UTF8
}

function Send-Alert {
    param([string]$Title, [string]$Message)
    [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms") | Out-Null
    $notify = New-Object System.Windows.Forms.NotifyIcon
    $notify.Icon = [System.Drawing.SystemIcons]::Warning
    $notify.BalloonTipIcon = "Error"
    $notify.BalloonTipTitle = $Title
    $notify.BalloonTipText = $Message
    $notify.Visible = $true
    $notify.ShowBalloonTip(5000)
    Start-Sleep -Seconds 6
    $notify.Dispose()
}

function Invoke-Recovery {
    if ($RecoveryCommand -and $RecoveryCommand.Trim() -ne "") {
        Write-Log "执行恢复命令: $RecoveryCommand"
        try {
            Invoke-Expression $RecoveryCommand
            Write-Log "恢复命令执行成功"
        } catch {
            Write-Log "恢复命令执行失败: $_"
        }
    }
}

# === 主循环 ===
Write-Log "进程监控启动 - 目标进程: $ProcessName, 间隔: ${IntervalSeconds}秒"

$consecutiveFailures = 0
$alertThreshold = 3

while ($true) {
    try {
        $process = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue

        if ($process) {
            if ($consecutiveFailures -gt 0) {
                Write-Log "进程 $ProcessName 已恢复运行 (PID: $($process[0].Id))"
                $consecutiveFailures = 0
            }
        } else {
            $consecutiveFailures++
            Write-Log "进程 $ProcessName 未运行 (连续失败: $consecutiveFailures)"

            if ($consecutiveFailures -ge $alertThreshold) {
                Send-Alert "进程监控告警" "进程 $ProcessName 已停止运行，连续 ${consecutiveFailures} 次检测未发现"
                Invoke-Recovery
                $consecutiveFailures = 0
            }
        }
    } catch {
        Write-Log "检查异常: $_"
    }

    Start-Sleep -Seconds $IntervalSeconds
}
