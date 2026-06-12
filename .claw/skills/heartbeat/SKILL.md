---
name: heartbeat
description: 创建定时执行的心跳任务，agent 会在对话上下文中定时执行用户指定的操作
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

## 极其重要：禁止使用 CronCreate 工具

**永远不要使用 CronCreate、CronList、CronDelete 等 Cron 工具！**
这些工具在当前运行模式下不工作，任务不会被执行。

唯一有效的方式是调用 `/heartbeat` HTTP API（见上面的操作步骤）。
