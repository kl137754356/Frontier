# URL Monitor Heartbeat Template
# URL/HTTP 监控模板 - 定时请求指定 URL 检查响应状态

param(
    [string]$TaskName = "url-monitor",
    [string]$TargetUrl = "http://localhost:8080/health",
    [int]$IntervalSeconds = 30,
    [int]$TimeoutSeconds = 10,
    [int[]]$ExpectedStatusCodes = @(200),
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

function Test-Url {
    param(
        [string]$Url,
        [int]$Timeout
    )
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec $Timeout -UseBasicParsing
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            ResponseTime = 0
        }
    } catch {
        $statusCode = 0
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        }
        return @{
            Success = $false
            StatusCode = $statusCode
            Error = $_.Exception.Message
        }
    }
}

# === 主循环 ===
Write-Log "URL 监控启动 - 目标: $TargetUrl, 间隔: ${IntervalSeconds}秒, 期望状态码: $($ExpectedStatusCodes -join ',')"

$consecutiveFailures = 0
$alertThreshold = 3

while ($true) {
    try {
        $result = Test-Url -Url $TargetUrl -Timeout $TimeoutSeconds

        if ($result.Success -and $result.StatusCode -in $ExpectedStatusCodes) {
            if ($consecutiveFailures -gt 0) {
                Write-Log "URL $TargetUrl 已恢复 (状态码: $($result.StatusCode))"
                $consecutiveFailures = 0
            }
        } else {
            $consecutiveFailures++
            $detail = if ($result.Error) { $result.Error } else { "状态码: $($result.StatusCode)" }
            Write-Log "URL $TargetUrl 异常 - $detail (连续失败: $consecutiveFailures)"

            if ($consecutiveFailures -ge $alertThreshold) {
                Send-Alert "URL 监控告警" "URL $TargetUrl 连续 ${consecutiveFailures} 次检测异常: $detail"
                Invoke-Recovery
                $consecutiveFailures = 0
            }
        }
    } catch {
        Write-Log "检查异常: $_"
    }

    Start-Sleep -Seconds $IntervalSeconds
}
