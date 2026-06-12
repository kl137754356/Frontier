$ErrorActionPreference = 'SilentlyContinue'
$roots = @(
  'C:\Program Files\Hexagon',
  'C:\Hexagon',
  (Join-Path $env:LOCALAPPDATA 'Programs'),
  (Join-Path $env:APPDATA 'Hexagon')
)
$patterns = @('*MetrologyAI*', '*Metrology*AI*', '*HexMI*', '*Orca*')
$results = @()
foreach ($root in $roots) {
  if (-not (Test-Path $root)) { continue }
  foreach ($pat in $patterns) {
    Get-ChildItem -Path $root -Recurse -Filter $pat -ErrorAction SilentlyContinue |
      Where-Object { $_.Extension -in '.exe', '.lnk' } |
      ForEach-Object {
        $results += [pscustomobject]@{
          Name = $_.Name
          Path = $_.FullName
          Root = $root
        }
      }
  }
}
$results | Sort-Object Root,Name | Format-Table -AutoSize | Out-String -Width 4096
