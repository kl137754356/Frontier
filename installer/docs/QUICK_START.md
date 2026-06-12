# Frontier 快速开始指南

欢迎使用 Frontier 桌面应用！本文档帮助你快速上手。

## 安装

1. 下载 `Frontier Setup x.x.x.exe`
2. 双击运行安装程序
3. 按提示完成安装
4. 桌面出现 "Frontier" 快捷方式

## 首次启动

1. 双击桌面快捷方式或在开始菜单找到 Frontier
2. 应用启动，打开聊天界面
3. 点击设置 → 输入 API Key（获取方式见下文）
4. 开始对话

## 获取 API Key

### 使用 Anthropic Claude

1. 前往 [api.anthropic.com](https://api.anthropic.com)
2. 注册或登录账户
3. 获取 API Key
4. 在 Frontier 中粘贴

### 其他模型

支持任何兼容 OpenAI API 格式的服务（如 OpenRouter、本地模型等）。

## 常用功能

### 1. 基本对话

直接输入问题，点击发送。AI 将实时回复。

### 2. 定时任务（心跳）

让 AI 按固定间隔执行任务。例如定期检查系统资源。

```powershell
# 创建任务
$body = @{
    action = "add"
    id = "check-memory"
    prompt = "检查系统内存占用，如果超过80%报警"
    intervalSeconds = 60
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

**查看所有任务：**
```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"list"}' `
    -ContentType "application/json"
```

**停止任务：**
```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"remove","id":"check-memory"}' `
    -ContentType "application/json"
```

### 3. 斜杠命令

- `/compact` — 压缩上下文历史
- `/reset` — 清空对话历史
- `/health` — 检查服务状态

## 文件位置

安装后，文件位于：

```
C:\Users\[你的用户名]\AppData\Local\Programs\frontier-desktop\
├── Frontier.bat           # 启动器
├── skills/
│   └── heartbeat/         # 心跳任务技能
│       └── HEARTBEAT_GUIDE.md  # 完整指南
└── docs/
    └── ...                # 文档
```

## 常见问题

### Q: 启动很慢？

**A**: 首次启动需要初始化 AI 引擎，通常需要 10-30 秒。后续启动会快很多。

### Q: 心跳任务没有执行？

**A**: 检查以下几点：
- API Key 已配置
- 后端正常运行（查看控制台）
- 使用 `/heartbeat` API，不要用 CronCreate 工具
- 详见 `skills/heartbeat/HEARTBEAT_GUIDE.md`

### Q: 如何提交反馈？

**A**: 查看应用菜单 → 帮助 → 提交反馈

### Q: 能否离线使用？

**A**: 不能，需要网络连接到 AI API 服务。

## 更多帮助

- 查看 `docs/` 目录中的完整文档
- 查看 `skills/heartbeat/` 中的技能说明
- 运行 PowerShell 脚本进行测试

## 技巧

1. **快速清空历史** — 输入 `/reset` 回车
2. **保存重要对话** — 复制并粘贴到文本编辑器
3. **多个任务** — 可同时设置多个心跳任务
4. **自定义间隔** — 心跳间隔建议 30 秒以上

祝你使用愉快！

