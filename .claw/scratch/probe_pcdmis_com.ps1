$ErrorActionPreference = "Continue"
Write-Host "=== COM attach via correct ProgID: PCDLRN.Application.20.2 ==="
$progids = @("PCDLRN.Application.20.2", "PCDLRN.Application.15.1", "PCDLRN.Application", "PC-DMIS.Application.20.2", "PC-DMIS.Application")
foreach ($p in $progids) {
  try {
    $obj = [Runtime.InteropServices.Marshal]::GetActiveObject($p)
    Write-Host ("[OK ] {0,-30} -> {1}" -f $p, $obj.GetType().FullName)
    try {
      $ver = $obj.Version
      Write-Host ("      Version: {0}" -f $ver)
    } catch { }
    try {
      $cn = $obj.ConnectedName
      Write-Host ("      ConnectedName: {0}" -f $cn)
    } catch { }
    try {
      $part = $obj.ActivePartProgram
      Write-Host ("      ActivePartProgram: {0}" -f $part)
    } catch { Write-Host "      ActivePartProgram: (no part program open)" }
  } catch {
    Write-Host ("[ERR] {0,-30} -> {1}" -f $p, $_.Exception.Message.Split("`n")[0])
  }
}
