# Heartbeat Task Management Commands
# 心跳任务管理命令集

$heartbeatDir = "$env:APPDATA\frontier-desktop\heartbeat"

# 确保目录存在
if (!(Test-Path $heartbeatDir)) {
    New-Item -ItemType Directory -Path $heartbeatDir -Force | Out-Null
}

function List-HeartbeatTasks {
    <#
    .SYNOPSIS
    列出所有心跳任务及其运行状态
    #>
    $pidFiles = Get-ChildItem -Path $heartbeatDir -Filter "*.pid" -ErrorAction SilentlyContinue

    if (!$pidFiles -or $pidFiles.Count -eq 0) {
        Write-Host "没有发现任何心跳任务" -ForegroundColor Yellow
        return
    }

    Write-Host "`n=== 心跳任务列表 ===" -ForegroundColor Cyan
    Write-Host ("{0,-20} {1,-10} {2,-10}" -f "任务名称", "PID", "状态")
    Write-Host ("-" * 45)

    foreach ($pidFile in $pidFiles) {
        $taskName = $pidFile.BaseName
        $pid = Get-Content $pidFile.FullName -ErrorAction SilentlyContinue
        $status = "未知"

        if ($pid) {
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($process) {
                $status = "运行中"
            } else {
                $status = "已停止"
            }
        }

        $color = if ($status -eq "运行中") { "Green" } else { "Red" }
        Write-Host ("{0,-20} {1,-10} " -f $taskName, $pid) -NoNewline
        Write-Host $status -ForegroundColor $color
    }
    Write-Host ""
}

function Stop-HeartbeatTask {
    <#
    .SYNOPSIS
    停止指定的心跳任务
    .PARAMETER Name
    任务名称
    #>
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    $pidFile = "$heartbeatDir\$Name.pid"

    if (!(Test-Path $pidFile)) {
        Write-Host "任务 '$Name' 不存在" -ForegroundColor Red
        return
    }

    $pid = Get-Content $pidFile -ErrorAction SilentlyContinue
    if ($pid) {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Id $pid -Force
            Write-Host "任务 '$Name' (PID: $pid) 已停止" -ForegroundColor Green
        } else {
            Write-Host "任务 '$Name' 进程已不存在" -ForegroundColor Yellow
        }
    }
}

function Remove-HeartbeatTask {
    <#
    .SYNOPSIS
    删除指定的心跳任务（停止进程并清理文件）
    .PARAMETER Name
    任务名称
    #>
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    # 先停止任务
    Stop-HeartbeatTask -Name $Name

    # 删除 PID 文件
    $pidFile = "$heartbeatDir\$Name.pid"
    if (Test-Path $pidFile) {
        Remove-Item $pidFile -Force
    }

    # 删除日志文件
    $logFile = "$heartbeatDir\$Name.log"
    if (Test-Path $logFile) {
        Remove-Item $logFile -Force
    }

    Write-Host "任务 '$Name' 已删除（包括日志和 PID 文件）" -ForegroundColor Green
}

function Get-HeartbeatLog {
    <#
    .SYNOPSIS
    查看指定任务的日志
    .PARAMETER Name
    任务名称
    .PARAMETER Tail
    显示最后 N 行（默认 20）
    #>
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [int]$Tail = 20
    )

    $logFile = "$heartbeatDir\$Name.log"

    if (!(Test-Path $logFile)) {
        Write-Host "任务 '$Name' 的日志文件不存在" -ForegroundColor Red
        return
    }

    Write-Host "`n=== $Name 日志 (最后 $Tail 行) ===" -ForegroundColor Cyan
    Get-Content $logFile -Tail $Tail
    Write-Host ""
}

function Start-HeartbeatTask {
    <#
    .SYNOPSIS
    启动一个心跳任务（后台运行）
    .PARAMETER ScriptPath
    脚本文件路径
    .PARAMETER Name
    任务名称
    .PARAMETER Arguments
    额外参数（哈希表）
    #>
    param(
        [Parameter(Mandatory = $true)]
        [string]$ScriptPath,
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [hashtable]$Arguments = @{}
    )

    if (!(Test-Path $ScriptPath)) {
        Write-Host "脚本文件不存在: $ScriptPath" -ForegroundColor Red
        return
    }

    # 检查是否已在运行
    $pidFile = "$heartbeatDir\$Name.pid"
    if (Test-Path $pidFile) {
        $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
        if ($existingPid) {
            $process = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "任务 '$Name' 已在运行 (PID: $existingPid)" -ForegroundColor Yellow
                return
            }
        }
    }

    # 构建参数字符串
    $argString = "-TaskName `"$Name`""
    foreach ($key in $Arguments.Keys) {
        $value = $Arguments[$key]
        $argString += " -$key `"$value`""
    }

    # 启动后台进程
    $process = Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`" $argString" -WindowStyle Hidden -PassThru

    Write-Host "任务 '$Name' 已启动 (PID: $($process.Id))" -ForegroundColor Green
    Write-Host "日志文件: $heartbeatDir\$Name.log" -ForegroundColor Gray
}
