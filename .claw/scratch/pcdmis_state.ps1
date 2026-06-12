$p = Get-Process -Id 80280 -ErrorAction SilentlyContinue
if ($p) {
  $p.Refresh()
  Write-Host ("Process            : PCDLRN.exe (PID {0})" -f $p.Id)
  Write-Host ("Has exited        : {0}" -f $p.HasExited)
  Write-Host ("Responding        : {0}" -f $p.Responding)
  Write-Host ("MainWindowHandle  : {0}  (0 means hidden/headless)" -f $p.MainWindowHandle)
  Write-Host ("Working set MB    : {0:N1}" -f ($p.WorkingSet64/1MB))
  Write-Host ("Threads           : {0}" -f $p.Threads.Count)
  Write-Host ("Start time        : {0}" -f $p.StartTime)
  Write-Host ("Path              : {0}" -f $p.Path)
} else {
  Write-Host "PCDLRN.exe (PID 80280) not found."
}
