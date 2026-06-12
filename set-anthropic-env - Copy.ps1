# 清除所有冲突的 LLM 提供商环境变量
Get-ChildItem Env: | Where-Object { $_.Name -match '^(ANTHROPIC_|OPENAI_|DASHSCOPE_)' } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue
}

# 设置 Anthropic 兼容提供商 (MiniMax)
$env:ANTHROPIC_BASE_URL = "https://api.minimaxi.com/anthropic"
$env:ANTHROPIC_API_KEY = "sk-cp-10aaE0ria7NxfIbeJ1L2Y_O-oFCjl-RjlgyVES-8TPZLmyxJswcY8zu9R1qtE3JHCDATsZubI_M-h3R-qMxJGC6X66J5nKh3CAHQf6aQoNg1pCJRnXw6fkE"

Write-Host "LLM environment configured:" -ForegroundColor Green
Write-Host "  Base URL:  $env:ANTHROPIC_BASE_URL"
Write-Host "  API Key:   $($env:ANTHROPIC_API_KEY.Substring(0,10))..."



