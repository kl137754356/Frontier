$ErrorActionPreference = "Continue"
$exe = "D:\Program Files\Hexagon\MetrologyAI 2026.2\Hexagon.Metrology.AI.exe"
$logDir = "D:\AI_LLM\LLM\claw-code\claw-code_Agui\.claw\scratch"
$logPath = Join-Path $logDir "metrology_stdout.log"
$errPath = Join-Path $logDir "metrology_stderr.log"

# Make sure not already running
$existing = Get-Process -Name "Hexagon.Metrology.AI" -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host ("Already running. PID={0}" -f $existing.Id)
  exit 0
}

Write-Host "=== Launching $exe ==="
$p = Start-Process -FilePath $exe `
  -WorkingDirectory (Split-Path $exe -Parent) `
  -RedirectStandardOutput $logPath `
  -RedirectStandardError  $errPath `
  -PassThru
Write-Host ("  Started PID={0}" -f $p.Id)
Write-Host ("  StdOut log: {0}" -f $logPath)
Write-Host ("  StdErr log: {0}" -f $errPath)

Write-Host "`n=== Polling port 127.0.0.1:8780 (up to 60s) ==="
$deadline = (Get-Date).AddSeconds(60)
$ok = $false
$logShown = $false
while ((Get-Date) -lt $deadline) {
  Start-Sleep -Milliseconds 1500
  $proc = Get-Process -Id $p.Id -ErrorAction SilentlyContinue
  if (-not $proc) {
    Write-Host "  Process exited unexpectedly."
    break
  }
  $ws = [math]::Round($proc.WorkingSet64/1MB,1)
  $tcp = New-Object System.Net.Sockets.TcpClient
  try {
    $iar = $tcp.BeginConnect("127.0.0.1", 8780, $null, $null)
    if ($iar.AsyncWaitHandle.WaitOne(1000, $false) -and $tcp.Connected) {
      Write-Host ("  [OK] port open. WorkingSet={0}MB" -f $ws)
      $ok = $true
      $tcp.Close()
      break
    }
  } catch { } finally { try { $tcp.Close() } catch {} }
  if (-not $logShown -and (Test-Path $logPath)) {
    Write-Host "  --- early stdout ---"
    Get-Content $logPath -Tail 15 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host ("    " + $_) }
    $logShown = $true
  }
}

if (-not $ok) {
  Write-Host "  [TIMEOUT] port 8780 not reachable after 60s"
}

Write-Host "`n=== HTTP probe ==="
foreach ($u in @("http://127.0.0.1:8780/","http://127.0.0.1:8780/health","http://127.0.0.1:8780/api/health")) {
  try {
    $r = Invoke-WebRequest -Uri $u -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host ("  {0,-50} -> {1}" -f $u, $r.StatusCode)
  } catch {
    $msg = $_.Exception.Message.Split("`n")[0]
    Write-Host ("  {0,-50} -> {1}" -f $u, $msg)
  }
}

Write-Host "`n=== Tail of stderr (if any) ==="
if (Test-Path $errPath) {
  Get-Content $errPath -Tail 20 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host ("  " + $_) }
} else {
  Write-Host "  (no stderr file)"
}
