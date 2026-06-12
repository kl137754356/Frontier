# 清除所有冲突的 LLM 提供商环境变量
Get-ChildItem Env: | Where-Object { $_.Name -match '^(ANTHROPIC_|OPENAI_|DASHSCOPE_)' } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue
}

# 设置 OpenAI 兼容提供商
$env:LLM_PROVIDER = "openai"
$env:OPENAI_API_KEY = "sk-FmvSMNZlHj7YZHtCZhjC3fagHyUSlMX6GZkZt3CUERd2jTkQ"
$env:OPENAI_BASE_URL = "https://api.hexai.top"
$env:OPENAI_MODEL = "openai/MiniMax-M2.5"

Write-Host "LLM environment configured:" -ForegroundColor Green
Write-Host "  Provider:  $env:LLM_PROVIDER"
Write-Host "  Base URL:  $env:OPENAI_BASE_URL"
Write-Host "  Model:     $env:OPENAI_MODEL"
