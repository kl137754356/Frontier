# 定时自动发送消息给 Agent (Auto-Task)

## 什么是 Auto-Task

Auto-Task 是一种定时自动发送消息给 Agent 的后台任务。它创建一个 PowerShell 脚本，该脚本会按照设定的时间间隔自动向 Agent 的 `/agent` 端点发送 POST 请求，触发 Agent 执行指定的操作。

## 使用场景

- 定时提醒 Agent 执行某项检查
- 周期性触发 Agent 生成报告
- 自动化工作流中的定时步骤
- 定期让 Agent 执行数据同步或清理操作

## 用户需要提供的信息

1. **消息内容**：要发送给 Agent 的消息文本
2. **发送间隔**：多久发送一次（默认 60 秒）
3. **任务名称**：用于标识和管理这个后台任务
4. **最大运行时间**（可选）：任务运行多久后自动停止

## 执行步骤

1. 根据用户需求确定消息内容和间隔
2. 基于模板生成自动发送脚本
3. 先测试一次发送，确认 Agent 端点可达
4. 启动后台任务
5. 确认任务正在运行

## 重要规则

- **永远不要使用 AskUserQuestion**：后台任务不能有任何交互式提示
- **永远不要提示选择框**：不要使用任何需要用户选择的 UI 元素
- 消息使用 UTF-8 编码发送
- 目标端点固定为 `http://localhost:8081/agent`
- POST 请求的 Content-Type 为 `application/json; charset=utf-8`
- 必须记录 PID 和日志用于任务管理

## 脚本规范

- 日志和 PID 目录：`$env:APPDATA\frontier-desktop\heartbeat\`
- PID 文件格式：`<任务名>.pid`
- 日志文件格式：`<任务名>.log`
- 脚本使用 UTF-8 编码
- 使用 `[System.Text.Encoding]::UTF8.GetBytes()` 确保请求体正确编码
- 使用 `Start-Process powershell -WindowStyle Hidden` 启动后台任务

## 模板参考

参考 `references/` 目录下的模板：

- `auto-sender.ps1` — 自动发送消息模板

## 禁止事项

- **永远不要使用 AskUserQuestion**
- **永远不要提示选择框**
- 不要使用 `Read-Host` 或任何需要用户输入的命令
- 不要弹出对话框等待用户操作
- 不要使用需要用户交互的任何方式
