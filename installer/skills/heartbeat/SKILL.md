---
name: heartbeat
description: 创建定时执行的心跳任务，agent 会在对话上下文中定时执行用户指定的操作
---

# ⚠️ 强制指引

**如果你是 AI Agent 或 LLM，必须阅读 `AGENT_INSTRUCTIONS.md`**

关键点：
- ✅ 使用 `/heartbeat` HTTP API
- ❌ 禁止使用 CronCreate、CronList、CronDelete
- 📖 详见 `AGENT_INSTRUCTIONS.md`

---

# Heartbeat — 内置定时任务技能

## 重要：什么是"心跳任务"

当用户说"设置心跳"、"定时执行"时，意思是：
**让 Agent 按照指定间隔定时执行一组任务，执行时带有完整对话上下文。**

## 实现方式

调用 backend 的 `/heartbeat` HTTP API 注册定时任务。
注册后，backend 会按间隔自动向 Agent 发送 prompt，Agent 像收到用户消息一样处理。

## 使用场景

用户说到以下内容时使用此技能：
- "设置心跳"、"添加心跳"、"定时执行"
- "每隔 X 秒/分钟帮我做 XXX"
- "自动定时检查/清理/监控"

## 操作步骤

### 添加心跳任务

使用 PowerShell 调用 `/heartbeat` API：

```powershell
$body = @{
    action = "add"
    id = "任务名称"
    prompt = "要执行的完整指令"
    intervalSeconds = 30
} | ConvertTo-Json
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body $bodyBytes -ContentType "application/json; charset=utf-8"
```

### 查看心跳任务

```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body '{"action":"list"}' -ContentType "application/json"
```

### 停止心跳任务

```powershell
$body = '{"action":"remove","id":"任务名称"}'
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body $body -ContentType "application/json"
```

### 清除所有心跳

```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body '{"action":"clear"}' -ContentType "application/json"
```

## Prompt 设计要求

注册心跳时的 `prompt` 字段应该是一个完整的、自包含的指令，Agent 收到后能直接执行。例如：

- "清理回收站，然后用 PowerShell 查看当前显存和内存占用，查看磁盘占用，用简洁格式报告"
- "检查 D:/TempFile 文件数量，如果超过 10 个删除最旧的"
- "查看 8080 端口是否在监听，如果没有就报告"

## 关键特性

- 心跳执行时 Agent 拥有完整对话上下文
- 心跳结果会显示在聊天界面中
- 用户正在对话时，心跳会等待当前对话完成后再执行（不中断）
- 可以同时设置多个心跳任务

## 禁止事项

- 不要使用 AskUserQuestion
- 不要渲染选择框
- 直接调用 API 注册任务，不要创建外部 PowerShell 脚本
- 不要问"在哪里添加心跳"

## 极其重要：停止心跳的正确方式

当用户说"停止心跳"、"取消定时任务"时，**必须调用 /heartbeat API**！
仅仅在对话中说"已停止"是无效的，定时器仍然在后台运行。

正确做法：
```powershell
# 停止指定任务
$body = '{"action":"remove","id":"system-monitor"}'
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing

# 或清除所有心跳
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body '{"action":"clear"}' -ContentType "application/json" -UseBasicParsing
```

**永远不要只是口头说"已停止"而不调用 API！**

## ⚠️ 极其重要：DEPRECATED - CronCreate 工具已禁用

**❌ 不要使用 CronCreate、CronList、CronDelete 等 Cron 工具！**

这些工具：
- ❌ 不被支持
- ❌ 无法执行任务
- ❌ 仅显示创建成功但实际无效

### ✅ 唯一有效的方式

**必须使用 `/heartbeat` HTTP API**（见上面的操作步骤）

CronCreate 工具已被完全禁用。即使 Agent 尝试使用，也不会有任何效果。

### 强制说明给 Agent

**给所有 Agent/LLM 的强制指令：**
- 当用户说"设置心跳"、"定时执行"、"定时任务"时
- **必须且只能**调用 `/heartbeat` HTTP API
- **绝对禁止**使用 CronCreate 工具
- 不要让用户选择工具，直接使用 API

## 故障排除

### 问题：任务创建成功，但没有执行

**症状：**
- 日志显示 `CronCreate` 返回成功（JSON 中 `"enabled": true`）
- 但心跳任务从未被执行
- 没有看到定时指令被发送给 Agent

**原因：**
用了不支持的 `CronCreate` 工具创建任务。这个工具创建的任务不会被后端执行引擎处理。

**解决方案：**
使用正确的 `/heartbeat` HTTP API 重新创建心跳任务。之前用 `CronCreate` 创建的任务可以安全忽略，因为它们从未执行过。

**正确的创建方式：**
```powershell
$body = @{
    action = "add"
    id = "heartbeat-task-name"
    prompt = "你是谁，你能干什么"
    intervalSeconds = 30
} | ConvertTo-Json
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body $bodyBytes -ContentType "application/json; charset=utf-8"
```

### 问题：心跳任务被创建，但执行不规律或没有执行

**检查任务状态：**
```powershell
$body = '{"action":"list"}' 
$response = Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body $body -ContentType "application/json"
$tasks = ($response.Content | ConvertFrom-Json).tasks
$tasks | Format-Table -Property id, prompt, intervalMs, lastRun, runCount
```

**可能原因和解决方案：**
- 如果 `runCount` 始终为 0：Agent 可能在处理其他请求。心跳会等待当前请求完成。
- 如果 `lastRun` 很旧但 `runCount` 没增加：TCP 连接可能断开。重新连接后端（POST /config）。
- 如果 `intervalMs` 太小（< 5000）：可能导致任务堆积，建议改大一些。

### 问题：旧的心跳任务还在运行

清除所有旧任务：
```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body '{"action":"clear"}' -ContentType "application/json" -UseBasicParsing
```

### 理解执行限制

心跳不会立即执行，而是遵循以下规则：
1. **等待 TCP 连接**：必须先连接到后端（POST /config）
2. **等待当前请求完成**：如果 Agent 正在处理用户消息，心跳会等待
3. **不中断对话**：心跳优先级低，不会打断 Agent 处理

这是设计的，目的是确保用户交互优先，心跳任务不会造成卡顿。

