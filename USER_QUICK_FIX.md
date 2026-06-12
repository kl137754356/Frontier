# 🔧 快速修复 - 心跳任务无法执行？

## 问题

你设置了心跳任务，但任务没有执行。

## 原因

你可能使用了 **CronCreate 工具**（不被支持），而不是 **`/heartbeat` HTTP API**（正确方式）。

## ✅ 快速修复

### 方法 1：新版本用户（推荐）

升级到最新版本后，系统会自动强制使用 `/heartbeat` API。

**只需输入：** `设置心跳`

Agent 会自动生成正确的代码，无需手动操作。

### 方法 2：手动使用 API

在 PowerShell 中运行以下代码：

#### 创建任务
```powershell
$body = @{
    action = "add"
    id = "my-task"
    prompt = "你是谁，你能干什么"
    intervalSeconds = 30
} | ConvertTo-Json

$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $bodyBytes `
    -ContentType "application/json; charset=utf-8"
```

#### 查看所有任务
```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"list"}' `
    -ContentType "application/json" | 
    Select-Object -ExpandProperty Content | 
    ConvertFrom-Json
```

#### 停止任务
```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"remove","id":"my-task"}' `
    -ContentType "application/json"
```

## ❌ 不要做

| ❌ 错误 | ✅ 正确 |
|-------|--------|
| 使用 CronCreate 工具 | 使用 `/heartbeat` API |
| 口头说"已创建" | 实际运行代码 |
| 不确定用哪个 | 新版本自动选择 |

## 🔍 检查列表

任务是否真的在运行？

```powershell
# 查看任务状态
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"list"}' `
    -ContentType "application/json"
```

查看输出中的：
- ✅ `runCount` 是否 > 0（表示已执行）
- ✅ `lastRun` 是否最近更新（表示正在运行）

## 📚 完整文档

- 📖 详细指南：`installer/docs/`中的 `HEARTBEAT_GUIDE.md`
- 📖 快速开始：`installer/docs/`中的 `QUICK_START.md`
- 📖 安装说明：`installer/docs/`中的 `INSTALLATION_GUIDE.md`

## 💬 常见问题

**Q: 我之前用 CronCreate 创建的任务怎么办？**
A: 删除它们（它们从不执行过）。使用新方法重新创建。

**Q: 新版本中 Agent 会自动选择正确的方式吗？**
A: 是的。升级后，Agent 会 100% 使用 `/heartbeat` API。

**Q: 为什么 CronCreate 不工作？**
A: 因为它是独立的工具，不与后端的心跳执行引擎集成。

**Q: 怎么清除所有旧任务？**
A: 
```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"clear"}' `
    -ContentType "application/json"
```

## 🆘 还是不行？

1. **检查后端是否运行**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:8081/health"
   ```

2. **检查 API Key 是否正确配置**
   - 打开应用
   - 点击⚙️ 设置
   - 确保 API Key 有效

3. **查看日志**
   - Windows：`%APPDATA%\Roaming\frontier-desktop\frontier.log`
   - 寻找错误信息

4. **重启应用**
   - 有时重启能解决临时问题

## 📞 获取帮助

- 📖 查看完整文档
- 🔍 搜索已知问题
- 💬 提交反馈

---

**记住：** 新版本已自动修复这个问题。升级后，一切就会工作！

