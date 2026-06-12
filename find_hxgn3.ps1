$ErrorActionPreference = 'SilentlyContinue'
$candidates = @(
  'C:\Program Files\Hexagon',
  'C:\Program Files (x86)\Hexagon',
  'K:\softwareFiles',
  'C:\Hexagon',
  (Join-Path $env:LOCALAPPDATA 'Programs\Hexagon'),
  (Join-Path $env:APPDATA 'Hexagon')
)
$found = @()
foreach ($p in $candidates) {
  if (Test-Path $p) {
    $found += $p
  }
}
$found -join [Environment]::NewLine
