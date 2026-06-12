$ErrorActionPreference = "Continue"
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class W {
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
  public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
  [DllImport("user32.dll", CharSet = CharSet.Auto)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
}
"@ | Out-Null

Write-Host "=== ALL top-level windows belonging to PID 80280 (visible + hidden) ==="
$found = New-Object System.Collections.Generic.List[object]
$cb = [W+EnumWindowsProc]{
  param($h, $l)
  $owner = 0
  [void][W]::GetWindowThreadProcessId($h, [ref]$owner)
  if ($owner -eq 80280) {
    $sb = New-Object System.Text.StringBuilder 512
    [void][W]::GetWindowText($h, $sb, 512)
    $visible = [W]::IsWindowVisible($h)
    $found.Add([PSCustomObject]@{HWnd=$h; Title=$sb.ToString(); Visible=$visible})
  }
  return $true
}
[W]::EnumWindows($cb, [IntPtr]::Zero) | Out-Null
$found | Format-Table -AutoSize

Write-Host "`n=== process.MainWindowHandle / Threads count ==="
$proc = Get-Process -Id 80280 -ErrorAction SilentlyContinue
$proc.Refresh()
Write-Host ("MainWindowHandle = {0}" -f $proc.MainWindowHandle)
Write-Host ("Threads          = {0}" -f $proc.Threads.Count)
Write-Host ("WorkingSet64 MB  = {0:N1}" -f ($proc.WorkingSet64/1MB))

Write-Host "`n=== Try force-show (SW_RESTORE=9, SW_SHOW=5) ==="
$hwnd = $proc.MainWindowHandle
if ($hwnd -ne 0) {
  $r1 = [W]::ShowWindow($hwnd, 9)
  Start-Sleep -Milliseconds 300
  $r2 = [W]::ShowWindow($hwnd, 5)
  $r3 = [W]::SetForegroundWindow($hwnd)
  Write-Host ("ShowWindow(restore)={0}  ShowWindow(show)={1}  SetForeground={2}" -f $r1,$r2,$r3)
} else {
  Write-Host "Process has no main window handle (headless). Will attempt to relaunch with proper exe_path."
}
