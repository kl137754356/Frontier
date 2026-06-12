<#
.SYNOPSIS
  Launch the PC-DMIS MCP server.
  Auto-bootstraps uv + Python if not installed.

.PARAMETER Transport
  MCP transport: "stdio" (default, for Claude Desktop/Cursor) or "sse" (for HTTP clients).

.PARAMETER Port
  Port for SSE transport (default: 8000). Ignored for stdio.

.EXAMPLE
  # Stdio mode (Claude Desktop, Cursor, etc.)
  .\run_mcp.ps1

  # HTTP/SSE mode (Dify, custom clients)
  .\run_mcp.ps1 -Transport sse -Port 8000
#>

param(
  [ValidateSet("stdio", "sse")]
  [string] $Transport = "stdio",
  [int] $Port = 8000
)

$ErrorActionPreference = 'Stop'

# --- Locate skill root ---
$SkillRoot = Split-Path -Parent $PSScriptRoot
Set-Location $SkillRoot

# --- Bootstrap uv if not installed (reuse logic from run_pcdmis.ps1) ---
if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
  Write-Host "[bootstrap] uv not found. Installing..." -ForegroundColor Cyan
  try {
    & ([scriptblock]::Create((Invoke-RestMethod "https://astral.sh/uv/install.ps1"))) 2>&1 | Out-Host
    $uvPaths = @(
      "$env:USERPROFILE\.local\bin",
      "$env:USERPROFILE\.cargo\bin"
    ) | Where-Object { $_ -and (Test-Path $_) }
    foreach ($p in $uvPaths) {
      if ($env:PATH -notlike "*$p*") { $env:PATH = "$p;$env:PATH" }
    }
    if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
      Write-Error "[bootstrap] uv installed but not found on PATH. Open a new terminal."
      exit 1
    }
    Write-Host "[bootstrap] uv installed." -ForegroundColor Green
  } catch {
    Write-Error "[bootstrap] Failed: $_`nManual: irm https://astral.sh/uv/install.ps1 | iex"
    exit 1
  }
}

# --- Launch MCP server (uv run syncs the environment automatically) ---
$mcpArgs = @("run", "fastmcp", "run", "scripts/mcp_server.py")
if ($Transport -eq "sse") {
  $mcpArgs += @("--transport", "sse", "--port", "$Port")
  Write-Host "[mcp] Starting PC-DMIS MCP server (SSE on port $Port)..." -ForegroundColor Cyan
}
uv @mcpArgs
exit $LASTEXITCODE