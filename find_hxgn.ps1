# Find HxGN Visual Detection installation
$searchKeys = @(
    'HKCU:\SOFTWARE\Hexagon\HxGN Visual Detection\2025.1\4331\64-bit',
    'HKCU:\SOFTWARE\Hexagon\HxGN Visual Detection\2024.1\4331\64-bit'
)

$paths = @()
foreach ($key in $searchKeys) {
    if (Test-Path $key) {
        $props = Get-ItemProperty $key
        if ($props.Path) { $paths += $props.Path }
        if ($props.InstallLocation) { $paths += $props.InstallLocation }
        if ($props.Exe) { $paths += $props.Exe }
    }
}

# Also search Program Files
$pf86 = "C:\Program Files (x86)"
if (Test-Path $pf86) {
    Get-ChildItem $pf86 -Directory | Where-Object { $_.Name -like '*HxGN*' -or $_.Name -like '*Visual*' } | ForEach-Object {
        $paths += $_.FullName
    }
}

# Try common names
$commonExes = @(
    "HxGNVD.exe",
    "HxGN Visual Detection.exe",
    "VisualDetection.exe",
    "HxGNVD.Application.exe"
)

Write-Host "Searching for HxGN Visual Detection..."
foreach ($exe in $commonExes) {
    $result = Get-ChildItem "C:\" -Recurse -Filter $exe -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($result) {
        Write-Host "FOUND: $result"
    }
}

Write-Host "Done"