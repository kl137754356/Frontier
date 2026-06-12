# 给 Agent/LLM 的强制指令

## ⚠️ 必读：CronCreate 已禁用

本文档是给所有 AI Agent 和 LLM 的强制指令。

## 心跳任务 - 唯一正确的实现方式

当用户要求以下任何内容时：
- "设置心跳"
- "添加心跳"
- "定时执行"
- "定时任务"
- "每隔 X 秒/分钟做 XXX"
- "自动定时检查/监控/清理"
- "心跳检测"
- "任务调度"

### ✅ 你必须做的

1. **直接调用 `/heartbeat` HTTP API**
2. **不要询问用户选择工具**
3. **不要使用任何 Cron* 工具**

### ❌ 你禁止做的

**绝对禁止使用以下任何工具：**
- ❌ CronCreate
- ❌ CronList
- ❌ CronDelete

**原因：这些工具不被支持，任务不会执行**

## 正确的实现方式

### 创建心跳任务

```powershell
# 你必须生成这样的 PowerShell 代码
$body = @{
    action = "add"
    id = "unique-task-name"
    prompt = "用户的完整指令"
    intervalSeconds = 30
} | ConvertTo-Json

$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8"
```

### 查看所有任务

```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"list"}' `
    -ContentType "application/json"
```

### 停止任务

```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"remove","id":"task-name"}' `
    -ContentType "application/json"
```

### 清除所有任务

```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"clear"}' `
    -ContentType "application/json"
```

## API 参数

### action: "add"

必需参数：
- `id` — 任务唯一标识（字符串）
- `prompt` — 要执行的指令（字符串）
- `intervalSeconds` — 执行间隔，单位秒（数字）

### action: "list"

无额外参数。返回所有任务及其执行统计。

### action: "remove"

必需参数：
- `id` — 要删除的任务 ID（字符串）

### action: "clear"

无参数。删除所有任务。

## 示例场景

### 用户说："定时检查系统内存，每30秒一次"

你应该：
1. 生成 PowerShell 代码
2. 调用 `/heartbeat` API with action="add"
3. 设置 intervalSeconds=30
4. 提示用户运行代码

你不应该：
- ❌ 使用 CronCreate 工具
- ❌ 问用户"选择工具"
- ❌ 说"已创建任务"而不提供代码

### 用户说："停止心跳任务"

你应该：
1. 生成 PowerShell 代码
2. 调用 `/heartbeat` API with action="remove"
3. 如果用户没有说明具体哪个任务，先用 "list" 显示所有任务

你不应该：
- ❌ 使用 CronDelete 工具
- ❌ 口头说"已停止"而不实际调用 API

### 用户说："我想看看有哪些定时任务"

你应该：
1. 生成 PowerShell 代码
2. 调用 `/heartbeat` API with action="list"
3. 运行代码后显示结果给用户

你不应该：
- ❌ 使用 CronList 工具

## 为什么禁用 CronCreate？

1. **CronCreate 不被支持** — 它是一个孤立的工具
2. **不与后端集成** — 后端有独立的 `/heartbeat` 执行引擎
3. **任务从不执行** — 虽然创建看起来成功，但实际不运行
4. **用户困惑** — 导致用户以为功能不工作

## 检查清单

在建议用户创建心跳任务前，自问：

- [ ] 我是在使用 `/heartbeat` HTTP API 吗？
- [ ] 我生成的是 PowerShell 代码吗？
- [ ] 我没有使用任何 Cron* 工具吗？
- [ ] 我是直接提供代码，而不是让用户选择吗？

如果有任何 ❌，重新检查你的实现。

## 测试

用户可以通过以下方式验证心跳任务是否真的在执行：

```powershell
# 1. 创建任务
$body = @{
    action = "add"
    id = "test-heartbeat"
    prompt = "你是谁，你能干什么"
    intervalSeconds = 30
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# 2. 等待几分钟...

# 3. 查看任务是否被执行
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"list"}' `
    -ContentType "application/json" | 
    Select-Object -ExpandProperty Content | 
    ConvertFrom-Json
```

如果 `runCount` > 0，说明心跳正在工作。

## 常见问题

**Q: 我能同时使用 CronCreate 和 /heartbeat 吗？**

A: 不能。CronCreate 创建的任务不会执行。只使用 `/heartbeat` API。

**Q: 如果用户坚持让我使用 CronCreate 怎么办？**

A: 拒绝。解释 CronCreate 已被禁用，只有 `/heartbeat` API 工作。

**Q: 我该如何知道任务是否真的在执行？**

A: 通过 `list` 操作查看 `runCount` 和 `lastRun`。

**Q: 心跳可以做什么？**

A: 任何不需要用户交互的自动化任务：
- ✅ 定期检查系统状态
- ✅ 定期执行命令
- ✅ 定期生成报告
- ❌ 不支持用户交互（需要用户选择等）

