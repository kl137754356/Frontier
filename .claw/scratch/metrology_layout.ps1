$ErrorActionPreference = "Continue"
$dir = "D:\Program Files\Hexagon\MetrologyAI 2026.2"
Write-Host ("=== Top-level of {0} ===" -f $dir)
if (Test-Path $dir) {
  Get-ChildItem -Path $dir -Force -ErrorAction SilentlyContinue | Select-Object Mode, Length, LastWriteTime, Name | Format-Table -AutoSize
} else {
  Write-Host "  (not found)"
  return
}

Write-Host "`n=== All .exe in this dir (depth 3) ==="
Get-ChildItem -Path $dir -Filter "*.exe" -Recurse -Depth 3 -ErrorAction SilentlyContinue 2>$null |
  Where-Object { -not $_.PSIsContainer } |
  Select-Object FullName, Length, LastWriteTime |
  Format-Table -AutoSize

Write-Host "`n=== Look for server / web / launch / start / main .exe / .bat / .cmd / .ps1 / .jar ==="
$patterns = @("*server*","*Server*","*web*","*Web*","*launch*","*Launch*","*start*","*Start*","*main*","*MAI*","*orca*","*Orca*","*run*")
foreach ($p in $patterns) {
  Get-ChildItem -Path $dir -Filter $p -Recurse -Depth 4 -ErrorAction SilentlyContinue 2>$null |
    Where-Object { -not $_.PSIsContainer } |
    Select-Object -First 5 -ExpandProperty FullName | ForEach-Object { Write-Host ("  HIT: {0}" -f $_) }
}

Write-Host "`n=== *.config / appsettings* ==="
Get-ChildItem -Path $dir -Recurse -Depth 4 -ErrorAction SilentlyContinue 2>$null |
  Where-Object { $_.Name -match "(appsettings|\.config|\.yml|\.yaml|launch|start|README|install)" -and -not $_.PSIsContainer } |
  Select-Object -First 25 -ExpandProperty FullName | ForEach-Object { Write-Host ("  {0}" -f $_) }

Write-Host "`n=== Any port 8780 listener anywhere? ==="
Get-NetTCPConnection -State Listen -LocalPort 8780 -ErrorAction SilentlyContinue | Format-Table -AutoSize
Write-Host "(end)"
