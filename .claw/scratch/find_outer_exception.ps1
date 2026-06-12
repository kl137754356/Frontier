$ErrorActionPreference = "Continue"
$exeName = "Hexagon.Metrology.AI.exe"

Write-Host "=== Windows Event Log: Application errors for $exeName (last 5) ==="
try {
  Get-WinEvent -FilterHashtable @{LogName='Application'; ProviderName='Application Error','Windows Error Reporting','.NET Runtime'} -MaxEvents 80 -ErrorAction SilentlyContinue |
    Where-Object { $_.Message -match [regex]::Escape($exeName) -or $_.Message -match 'Metrology' -or $_.Message -match 'ILoggerFacade' } |
    Select-Object -First 5 -Property TimeCreated, Id, LevelDisplayName, ProviderName, Message |
    ForEach-Object {
      Write-Host ("--- {0} | {1} | {2} ---" -f $_.TimeCreated, $_.ProviderName, $_.LevelDisplayName)
      Write-Host ($_.Message.Substring(0, [Math]::Min(2500, $_.Message.Length)))
      Write-Host ""
    }
} catch {
  Write-Host ("  WinEvent error: {0}" -f $_.Exception.Message)
}

Write-Host "`n=== .NET Runtime / Application logs that mention Hexagon or Orca ==="
Get-WinEvent -FilterHashtable @{LogName='Application'; ProviderName='.NET Runtime','Application Error'} -MaxEvents 200 -ErrorAction SilentlyContinue |
  Where-Object { $_.Message -match 'Hexagon\.Metrology|Hexagon\.CadGraph|Metrology\.AI|Orca|Prism|Unity' } |
  Select-Object -First 5 -Property TimeCreated, Id, ProviderName, Message |
  ForEach-Object {
    Write-Host ("--- {0} | {1} | {2} ---" -f $_.TimeCreated, $_.ProviderName, $_.Id)
    Write-Host ($_.Message.Substring(0, [Math]::Min(2500, $_.Message.Length)))
    Write-Host ""
  }

Write-Host "`n=== Looking for newer .log / .dmp / .wer files in the install ==="
Get-ChildItem -Path "D:\Program Files\Hexagon\MetrologyAI 2026.2" -Recurse -Depth 3 -ErrorAction SilentlyContinue 2>$null |
  Where-Object { $_.Name -match '\.(log|dmp|wer|trace|xml)$' -and $_.LastWriteTime -gt (Get-Date).AddDays(-7) } |
  Select-Object FullName, Length, LastWriteTime | Format-Table -AutoSize

Write-Host "`n=== Hexagon.Metrology.AI.exe.config contains WPF startup override? ==="
Select-String -Path "D:\Program Files\Hexagon\MetrologyAI 2026.2\Hexagon.Metrology.AI.exe.config" -Pattern "useLegacy|render|disable|gpu|software|window|headless" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host ("  " + $_.ToString()) }
