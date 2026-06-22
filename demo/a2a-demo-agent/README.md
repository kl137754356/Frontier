# A2A Demo Agent — 天气查询

一个最小化的 A2A 协议兼容 Agent，用于验证 Frontier 的 A2A 集成。

## 快速启动

```powershell
cd demo/a2a-demo-agent
npm install
npm start
```

启动后监听 `http://localhost:4000`。

## 验证 Agent Card

浏览器打开: http://localhost:4000/.well-known/agent-card.json

应该看到:
```json
{
  "name": "Weather Agent",
  "description": "查询全球城市的天气信息...",
  "skills": [...]
}
```

## 手动测试 JSON-RPC

```powershell
$body = '{"jsonrpc":"2.0","method":"message/send","id":"test-1","params":{"message":{"role":"user","parts":[{"kind":"text","text":"查询东京天气"}]}}}'
Invoke-RestMethod -Uri http://localhost:4000/a2a/jsonrpc -Method POST -ContentType "application/json" -Body $body
```

## 连接到 Frontier

### 步骤 1: 启动 Demo Agent

```powershell
cd demo/a2a-demo-agent
npm install
npm start
```

### 步骤 2: 放置配置文件

将 `a2a-agents.json` 复制到 claw 的工作目录:

```powershell
# 开发模式（npm run dev）时，claw 的 cwd 是项目根目录
Copy-Item demo/a2a-demo-agent/a2a-agents.json .claw/a2a-agents.json
```

或者如果你用 Frontier 打包版:
```powershell
Copy-Item demo/a2a-demo-agent/a2a-agents.json "$env:APPDATA/frontier-desktop/.claw/a2a-agents.json"
```

### 步骤 3: 重启 Frontier（或重新 npm run dev）

claw.exe 启动时会读取 `.claw/a2a-agents.json`，拉取 Agent Card，注册 `weather_agent` 工具。

### 步骤 4: 在对话中使用

在 Frontier 聊天中输入:
- "查询东京的天气"
- "北京今天天气怎么样"
- "What's the weather in London"

LLM 会自动调用 `weather_agent` 工具，你会在结果中看到类似:

```
[Weather Agent] Task abc-123: completed
Result: 🌤 东京天气
温度: 25°C
状况: 晴天
湿度: 55%
建议: 适合户外活动
```

## 支持的城市

东京、北京、上海、纽约、伦敦、巴黎、深圳（及其英文名）。
其他城市会返回随机模拟数据。

## 文件说明

| 文件 | 用途 |
|------|------|
| `server.js` | Demo Agent 服务（Express） |
| `package.json` | 依赖声明 |
| `a2a-agents.json` | Frontier 配置文件模板 |
