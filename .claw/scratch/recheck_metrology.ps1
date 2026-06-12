$ErrorActionErrorActionPreference = "Continue"
Write-Host "=== Process named metrology-mcp ==="
Get-Process -Name "metrology-mcp*" -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, StartTime, Path | Format-List | Out-String | Write-Host

Write-Host "`n=== Hexagon.Metrology.AI process ==="
Get-Process -Name "Hexagon.Metrology.AI" -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, MainWindowTitle, StartTime, Path, WorkingSet64 | Format-List | Out-String | Write-Host

Write-Host "`n=== Listeners on 127.0.0.1:8780 ==="
Get-NetTCPConnection -State Listen -LocalAddress "127.0.0.1" -LocalPort 8780 -ErrorAction SilentlyContinue |
  Select-Object LocalAddress, LocalPort, OwningProcess, @{n='Proc';e={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}} | Format-Table -AutoSize

Write-Host "`n=== All listeners (any addr) port 8780 ==="
Get-NetTCPConnection -State Listen -LocalPort 8780 -ErrorAction SilentlyContinue |
  Select-Object LocalAddress, LocalPort, OwningProcess, @{n='Proc';e={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}} | Format-Table -AutoSize

Write-Host "`n=== Try GET with proper Accept and Origin ==="
try {
  $r = Invoke-WebRequest -Uri "http://127.0.0.1:8780/" -Method Get -Headers @{"Accept"="application/json";"Origin"="http://localhost:8780"} -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
  Write-Host ("  Status: {0}, Body[0:200]: {1}" -f $r.StatusCode, ($r.Content.Substring(0,[Math]::Min(200,$r.Content.Length))))
} catch {
  Write-Host ("  Error: {0}" -f $_.Exception.Message)
}

Write-Host "`n=== Try POST common API paths ==="
foreach ($p in @("/api/v1/health","/api/health","/v1/health","/orca/health","/health","/status","/api/Status","/api/Orca/Document/Current")) {
  try {
    $r = Invoke-WebRequest -Uri ("http://127.0.0.1:8780" + $p) -Method Get -TimeoutSec 4 -UseBasicParsing -ErrorAction Stop
    Write-Host ("  GET {0,-40} -> {1}" -f $p, $r.StatusCode)
  } catch {
    $code = $null
    if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
    Write-Host ("  GET {0,-40} -> {1}" -f $p, $(if ($code) { $code } else { $_.Exception.Message.Split("`n")[0] }))
  }
}
