$ErrorActionPreference = 'SilentlyContinue'

Write-Host '=== 运行中的相关进程 ==='
Get-Process | Where-Object {
  $_.ProcessName -match '(?i)metr|hexa|hexmi|orca' -or
  $_.MainWindowTitle -match '(?i)metr|hexa|hexmi|orca'
} | Select-Object Id, ProcessName, MainWindowTitle |
  Format-Table -AutoSize | Out-String -Width 4096

Write-Host "`n=== 端口 8780 占用情况 ==="
$conn = Get-NetTCPConnection -LocalPort 8780 -ErrorAction SilentlyContinue
if ($conn) {
  $conn | Format-Table -AutoSize | Out-String -Width 4096
} else {
  Write-Host '(无任何进程占用 8780 端口)'
}

Write-Host "`n=== 开始菜单中的相关快捷方式 ==="
$startMenuPaths = @(
  [Environment]::GetFolderPath('Programs'),
  [Environment]::GetFolderPath('CommonPrograms')
)
$found = @()
foreach ($sp in $startMenuPaths) {
  if (-not (Test-Path $sp)) { continue }
  Get-ChildItem -Path $sp -Recurse -Filter '*.lnk' -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '(?i)metr|hexa|hexmi|orca' } |
    ForEach-Object { $found += $_.FullName }
}
if ($found.Count -gt 0) {
  $found -join "`n"
} else {
  Write-Host '(没有找到相关快捷方式)'
}
