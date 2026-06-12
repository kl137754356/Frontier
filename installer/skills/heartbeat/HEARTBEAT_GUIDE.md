# 心跳任务完整指南

## 快速开始

心跳任务让 Agent 按固定间隔定时执行指令。正确的方式是调用 `/heartbeat` HTTP API。

### 创建心跳任务

```powershell
$body = @{
    action = "add"
    id = "my-task"
    prompt = "你是谁，你能干什么"
    intervalSeconds = 30  # 每30秒执行一次
} | ConvertTo-Json

$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8"
```

### 查看所有任务

```powershell
$body = '{"action":"list"}'
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" | 
    Select-Object -ExpandProperty Content | 
    ConvertFrom-Json
```

### 停止任务

```powershell
$body = @{ 
    action = "remove"
    id = "my-task"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### 清除所有任务

```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"clear"}' `
    -ContentType "application/json"
```

## 常见使用场景

### 场景1：系统监控（每30秒检查一次）

```powershell
$body = @{
    action = "add"
    id = "system-monitor"
    prompt = "检查系统内存占用，如果超过80%请报警"
    intervalSeconds = 30
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### 场景2：定期清理（每5分钟）

```powershell
$body = @{
    action = "add"
    id = "cleanup-task"
    prompt = "清理 C:\Temp 目录中7天以上的文件"
    intervalSeconds = 300  # 5分钟
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### 场景3：定期报告（每小时）

```powershell
$body = @{
    action = "add"
    id = "hourly-report"
    prompt = "报告最近1小时内的系统错误日志"
    intervalSeconds = 3600  # 1小时
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

## API 参数详解

### 创建任务 (action = "add")

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| action | string | 是 | 固定值 "add" |
| id | string | 是 | 任务唯一标识，用来管理任务 |
| prompt | string | 是 | 每次执行时发送给 Agent 的完整指令 |
| intervalSeconds | number | 是 | 执行间隔，单位秒（最小建议5秒） |

**响应示例：**
```json
{
  "status": "ok",
  "task": {
    "id": "my-task",
    "prompt": "你是谁，你能干什么",
    "intervalMs": 30000
  }
}
```

### 查看任务 (action = "list")

无额外参数。

**响应示例：**
```json
{
  "tasks": [
    {
      "id": "my-task",
      "prompt": "你是谁，你能干什么",
      "intervalMs": 30000,
      "lastRun": 1781183470000,
      "runCount": 5
    }
  ]
}
```

**字段说明：**
- `id`: 任务标识
- `prompt`: 执行指令
- `intervalMs`: 执行间隔（毫秒）
- `lastRun`: 最后执行时间戳（毫秒）
- `runCount`: 总执行次数

### 停止任务 (action = "remove")

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| action | string | 是 | 固定值 "remove" |
| id | string | 是 | 要停止的任务ID |

### 清除所有 (action = "clear")

无额外参数。

**响应示例：**
```json
{
  "status": "ok",
  "removed": 3
}
```

## 执行规则

### 何时执行

- ✓ 必须已连接到后端（通过 POST /config）
- ✓ TCP 连接保持活跃
- ✓ 当前没有其他 Agent 请求在处理

### 何时跳过

- ✗ Agent 正在处理用户消息
- ✗ TCP 连接断开
- ✗ 后端繁忙（auto-compacting）

### 执行顺序

1. **等待条件满足**：等待 TCP 连接和前一个请求完成
2. **发送指令**：将 prompt 发送给 Agent（自动添加前缀 `[自动心跳，直接执行...]`）
3. **收集结果**：Agent 执行完毕，结果保存在缓冲区
4. **显示结果**：结果在前端实时显示（通过聊天界面）
5. **准备下一次**：等待下一个间隔

## 故障排除

### Q: 创建了任务但没有执行

**A: 检查以下几点：**

1. 确认用的是 `/heartbeat` API，而不是 CronCreate 工具
   ```powershell
   # 正确 ✓
   $body = '{"action":"add","id":"test","prompt":"...","intervalSeconds":30}'
   
   # 错误 ✗
   # 不要使用 CronCreate/CronList 工具
   ```

2. 确认后端已连接（POST /config）
   ```powershell
   # 检查健康状态
   Invoke-WebRequest -Uri "http://localhost:8081/health"
   ```

3. 查看任务的执行统计
   ```powershell
   $body = '{"action":"list"}'
   Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
       -Method POST `
       -Body $body `
       -ContentType "application/json"
   ```
   如果 `runCount` 为 0，表示从未执行

4. 检查前端是否有活跃请求（这会延迟心跳执行）

### Q: 任务执行频率不一致

**A: 这是正常的。** 心跳会在条件允许时执行，但不会打断用户对话。如果你频繁与 Agent 聊天，心跳会被延迟。

如果想看到更规律的执行，减少与 Agent 的交互频率。

### Q: 想修改任务的 prompt 或间隔

**A: 删除旧任务，创建新任务**

```powershell
# 1. 删除旧任务
@{ action = "remove"; id = "my-task" } | ConvertTo-Json |
  % { [System.Text.Encoding]::UTF8.GetBytes($_) } |
  % { Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body $_ -ContentType "application/json" }

# 2. 创建新任务
@{ action = "add"; id = "my-task"; prompt = "新指令"; intervalSeconds = 60 } | ConvertTo-Json |
  % { [System.Text.Encoding]::UTF8.GetBytes($_) } |
  % { Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body $_ -ContentType "application/json" }
```

### Q: 旧的任务还在运行怎么办

**A: 清除所有任务**

```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"clear"}' `
    -ContentType "application/json"
```

## 提示

1. **Prompt 要明确** - 心跳是自动执行的，Prompt 应该清晰自包含，不需要用户交互
   - ✓ 好：`"检查系统内存占用，用百分比报告"`
   - ✗ 不好：`"帮我做点什么"`

2. **间隔不要太短** - 建议最少 5 秒，通常 30 秒以上
   - ✓ 合理：30、60、300、3600 秒
   - ✗ 太短：1、2、3 秒（可能造成卡顿）

3. **一次最多 3-5 个任务** - 太多并发任务可能影响 Agent 响应速度

4. **避免复杂逻辑** - 心跳适合简单、独立的任务，复杂逻辑应该在用户消息中完成

## 技术细节

### 后端如何工作

1. 任务被存储在内存中（HashMap）
2. 每个任务有一个 setInterval 定时器
3. 执行时检查：连接状态、是否繁忙、是否有活跃 SSE 响应
4. 如果条件满足，发送 prompt 给 Agent（TCP）
5. 结果收集在缓冲区，前端可通过 GET /heartbeat-results 获取

### 与 CronCreate 的区别

| 特性 | CronCreate 工具 | /heartbeat API |
|------|------------------|----------------|
| 状态 | ❌ 不受支持 | ✅ 完全支持 |
| 执行引擎 | 无 | 后端集成 |
| 任务存储 | 无（仅创建） | 内存（运行时保存） |
| 是否执行 | 否（从未执行） | 是（按规律执行） |

**关键差异**：CronCreate 是一个独立的工具，不与后端执行引擎集成。/heartbeat API 直接由后端管理。

