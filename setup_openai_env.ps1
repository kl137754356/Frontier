# 清除所有冲突的 LLM 提供商环境变量
Get-ChildItem Env: | Where-Object { $_.Name -match '^(ANTHROPIC_|OPENAI_|DASHSCOPE_)' } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue
}

# 配置 DeepSeek API（通过 OpenAI 兼容接口）
$env:OPENAI_BASE_URL = "https://api.deepseek.com"
$env:OPENAI_API_KEY = "sk-cf08d0075bf24016ae4d05b76ba64f42"
$env:OPENAI_MODEL = "deepseek-v4-flash"

Write-Host "环境变量已配置完成：" -ForegroundColor Green
Write-Host "  OPENAI_BASE_URL = $env:OPENAI_BASE_URL"
Write-Host "  OPENAI_API_KEY  = $($env:OPENAI_API_KEY.Substring(0,10))..."
Write-Host "  OPENAI_MODEL    = $env:OPENAI_MODEL"
