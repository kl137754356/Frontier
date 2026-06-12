$base = 'HKCU:\SOFTWARE\Hexagon\HxGN Visual Detection'
Get-ChildItem $base -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Name -notlike '*Settings*' } | ForEach-Object {
    Write-Host $_.Name
    Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue | ForEach-Object {
        $_.PSObject.Properties | Where-Object { $_.Name -notlike 'PS*' } | ForEach-Object {
            Write-Host "  $($_.Name) = $($_.Value)"
        }
    }
}