$ErrorActionPreference = "SilentlyContinue"

Write-Host "=== Search for Hexagon / Orca / Metrology AI install ==="
$roots = @("C:\Program Files", "C:\Program Files (x86)", "D:\Program Files", "D:\Program Files (x86)", "E:\Program Files", "F:\Program Files", "C:\Hexagon", "D:\Hexagon", "D:\PC-Dmis", "D:\")
$patterns = @("metrology*.exe", "metrology ai*.exe", "orca*.exe", "hexagon metrology*.exe", "pcdmis metrology*.exe", "pcdmis-metrology*.exe")
$found = New-Object System.Collections.Generic.List[string]
foreach ($root in $roots) {
  if (-not (Test-Path $root)) { continue }
  foreach ($p in $patterns) {
    Get-ChildItem -Path $root -Filter $p -Recurse -ErrorAction SilentlyContinue 2>$null | ForEach-Object {
      $found.Add($_.FullName)
    }
  }
}
$found = $found | Select-Object -Unique
if ($found.Count -eq 0) {
  Write-Host "(no executables matched)"
} else {
  $found | Select-Object -First 30 | ForEach-Object { Write-Host $_ }
}

Write-Host "`n=== Look for *Metrology* / *Orca* directories (any depth <=6) ==="
$dirs = New-Object System.Collections.Generic.List[string]
foreach ($root in $roots) {
  if (-not (Test-Path $root)) { continue }
  Get-ChildItem -Path $root -Directory -ErrorAction SilentlyContinue 2>$null | ForEach-Object {
    $n = $_.Name
    if ($n -match "(?i)metrology|orca|hexagon") {
      $dirs.Add($_.FullName)
    }
  }
  Get-ChildItem -Path $root -Directory -ErrorAction SilentlyContinue 2>$null | ForEach-Object {
    Get-ChildItem -Path $_.FullName -Directory -ErrorAction SilentlyContinue 2>$null | ForEach-Object {
      $n = $_.Name
      if ($n -match "(?i)metrology|orca") {
        $dirs.Add($_.FullName)
      }
    }
  }
}
$dirs = $dirs | Select-Object -Unique
if ($dirs.Count -eq 0) {
  Write-Host "(no directories matched)"
} else {
  $dirs | Select-Object -First 30 | ForEach-Object { Write-Host $_ }
}

Write-Host "`n=== Currently running processes matching metrology/orca ==="
Get-Process | Where-Object { $_.ProcessName -match "(?i)metrology|orca" } | Select-Object Id, ProcessName, MainWindowTitle, Path | Format-Table -AutoSize

Write-Host "`n=== Services named like Metrology / Orca ==="
Get-Service | Where-Object { $_.Name -match "(?i)metrology|orca|hexagon" } | Select-Object Name, DisplayName, Status, StartType | Format-Table -AutoSize
