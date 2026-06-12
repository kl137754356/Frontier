# Port Monitor Heartbeat Template
# 端口监控模板 - 定时检测指定端口是否可达

param(
    [string]$TaskName = "port-monitor",
    [string]$TargetHost = "localhost",
    [int]$TargetPort = 8080,
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

function Test-Port {
    param(
        [string]$Host,
        [int]$Port,
        [int]$Timeout = 5000
    )
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $asyncResult = $tcpClient.BeginConnect($Host, $Port, $null, $null)
        $wait = $asyncResult.AsyncWaitHandle.WaitOne($Timeout, $false)
        if ($wait) {
            $tcpClient.EndConnect($asyncResult)
            $tcpClient.Close()
            return $true
        } else {
            $tcpClient.Close()
            return $false
        }
    } catch {
        return $false
    }
}

function Send-Alert {
    param([string]$Title, [string]$Message)
    # Windows 通知
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
Write-Log "端口监控启动 - 目标: ${TargetHost}:${TargetPort}, 间隔: ${IntervalSeconds}秒"

$consecutiveFailures = 0
$alertThreshold = 3

while ($true) {
    try {
        $isOpen = Test-Port -Host $TargetHost -Port $TargetPort

        if ($isOpen) {
            if ($consecutiveFailures -gt 0) {
                Write-Log "端口 ${TargetHost}:${TargetPort} 已恢复"
                $consecutiveFailures = 0
            }
        } else {
            $consecutiveFailures++
            Write-Log "端口 ${TargetHost}:${TargetPort} 不可达 (连续失败: $consecutiveFailures)"

            if ($consecutiveFailures -ge $alertThreshold) {
                Send-Alert "端口监控告警" "${TargetHost}:${TargetPort} 连续 ${consecutiveFailures} 次检测失败"
                Invoke-Recovery
                $consecutiveFailures = 0  # 重置计数，避免重复告警
            }
        }
    } catch {
        Write-Log "检查异常: $_"
    }

    Start-Sleep -Seconds $IntervalSeconds
}
