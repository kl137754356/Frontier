$ErrorActionPreference = "Continue"

Write-Host "=== Probing port 8780 (HTTP) ==="
try {
  $tcp = New-Object System.Net.Sockets.TcpClient
  $iar = $tcp.BeginConnect("127.0.0.1", 8780, $null, $null)
  $ok = $iar.AsyncWaitHandle.WaitOne(2000, $false)
  if ($ok -and $tcp.Connected) {
    Write-Host "  TCP 127.0.0.1:8780 OPEN"
    $tcp.Close()
  } else {
    Write-Host "  TCP 127.0.0.1:8780 REFUSED (no listener)"
  }
} catch {
  Write-Host ("  TCP probe error: {0}" -f $_.Exception.Message)
}

Write-Host "`n=== Try HTTP GET on / and /health ==="
foreach ($u in @("http://localhost:8780/", "http://127.0.0.1:8780/health", "http://127.0.0.1:8780/api/v1/health", "http://127.0.0.1:8780/status")) {
  try {
    $r = Invoke-WebRequest -Uri $u -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host ("  {0,-50} -> {1}" -f $u, $r.StatusCode)
  } catch {
    $msg = $_.Exception.Message.Split("`n")[0]
    Write-Host ("  {0,-50} -> {1}" -f $u, $msg)
  }
}

Write-Host "`n=== Locate Hexagon Metrology AI / Orca install ==="
$roots = @("C:\Program Files\Hexagon","C:\Program Files (x86)\Hexagon","D:\Program Files\Hexagon","D:\Program Files (x86)\Hexagon","C:\Hexagon","D:\Hexagon")
foreach ($root in $roots) {
  if (Test-Path $root) {
    Write-Host ("  {0}  (exists)" -f $root)
    Get-ChildItem -Path $root -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name | ForEach-Object { Write-Host ("    \{0}" -f $_) }
  }
}

Write-Host "`n=== Search for typical executable names ==="
$exeNames = @("MetrologyAI.exe","Metrology.AI.exe","Orca.exe","PC-Dmis.Orca.exe","MetrologyAI.Server.exe","MAIServer.exe")
$found = @()
foreach ($root in $roots) {
  if (-not (Test-Path $root)) { continue }
  foreach ($name in $exeNames) {
    $hit = Get-ChildItem -Path $root -Filter $name -Recurse -ErrorAction SilentlyContinue 2>$null | Select-Object -First 3
    if ($hit) { $found += $hit }
  }
}
$found | Select-Object -First 10 -ExpandProperty FullName | ForEach-Object { Write-Host ("  HIT: {0}" -f $_) }

Write-Host "`n=== Search for 'metrology' / 'orca' processes ==="
$procNames = @("MetrologyAI","Metrology.AI","Orca","MAIServer","MetrologyServer")
foreach ($n in $procNames) {
  $p = Get-Process -Name $n -ErrorAction SilentlyContinue
  if ($p) {
    Write-Host ("  Process '{0}' found:" -f $n)
    $p | Select-Object Id, ProcessName, MainWindowTitle, Path, StartTime | Format-List | Out-String | Write-Host
  }
}

Write-Host "`n=== Listening ports owned by any Hexagon / Python process ==="
Get-NetTCPConnection -State Listen -LocalPort 8780 -ErrorAction SilentlyContinue | Format-Table LocalAddress, LocalPort, OwningProcess, @{n='Proc';e={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}} -AutoSize
