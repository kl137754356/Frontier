$ErrorActionPreference = "Continue"
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class W2 {
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr hWnd);
  [DllImport("user32.dll", CharSet = CharSet.Auto)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern long GetWindowLong(IntPtr hWnd, int nIndex);
  [DllImport("user32.dll")] public static extern long SetWindowLong(IntPtr hWnd, int nIndex, long dwNewLong);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
}
"@ | Out-Null

# The discovered main window for PC-DMIS CAD++ 2025.2
$mainHwnd = [IntPtr]11090316
$sb = New-Object System.Text.StringBuilder 512
[void][W2]::GetWindowText($mainHwnd, $sb, 512)
Write-Host ("Target HWND: {0}" -f $mainHwnd)
Write-Host ("Target Title: {0}" -f $sb.ToString())
Write-Host ("Currently Visible: {0}" -f ([W2]::IsWindowVisible($mainHwnd)))

# Force-clear WS_VISIBLE bit and use SW_SHOW
# SW_RESTORE = 9 (if minimized), SW_SHOW = 5
Write-Host "`n=== Step 1: ShowWindow SW_RESTORE ==="
$r1 = [W2]::ShowWindow($mainHwnd, 9)
Start-Sleep -Milliseconds 200
Write-Host ("SW_RESTORE returned: {0}" -f $r1)

Write-Host "`n=== Step 2: ShowWindow SW_SHOW ==="
$r2 = [W2]::ShowWindow($mainHwnd, 5)
Start-Sleep -Milliseconds 200
Write-Host ("SW_SHOW returned: {0}" -f $r2)

Write-Host "`n=== Step 3: BringWindowToTop ==="
$r3 = [W2]::BringWindowToTop($mainHwnd)
Write-Host ("BringWindowToTop returned: {0}" -f $r3)

Write-Host "`n=== Step 4: SetForegroundWindow ==="
$r4 = [W2]::SetForegroundWindow($mainHwnd)
Write-Host ("SetForegroundWindow returned: {0}" -f $r4)

Start-Sleep -Milliseconds 500
$isVisible = [W2]::IsWindowVisible($mainHwnd)
$fgHwnd = [W2]::GetForegroundWindow()
Write-Host "`n=== Post-state ==="
Write-Host ("MainHwnd now visible: {0}" -f $isVisible)
Write-Host ("Foreground HWND: {0}  (target was {1})" -f $fgHwnd, $mainHwnd)
Write-Host ("Foreground is our target: {0}" -f ($fgHwnd -eq $mainHwnd))

# Also try resizing the window to make it prominent
Write-Host "`n=== Step 5: Resize to 1280x800 at 100,100 ==="
[void][W2]::MoveWindow($mainHwnd, 100, 100, 1280, 800, $true)
Start-Sleep -Milliseconds 300
$isVisible2 = [W2]::IsWindowVisible($mainHwnd)
Write-Host ("Visible after move: {0}" -f $isVisible2)
