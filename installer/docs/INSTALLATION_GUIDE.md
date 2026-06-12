# Frontier 安装和设置指南

## 系统要求

- **操作系统**：Windows 10 或更新版本
- **磁盘空间**：至少 1GB（应用本身 ~500MB，加上缓存）
- **网络**：需要持续网络连接到 AI API 服务
- **浏览器**：Edge 或 Chrome（内置，无需单独安装）

## 安装步骤

### 方式 1：使用安装程序（推荐）

1. 下载 `Frontier Setup x.x.x.exe`

2. 双击运行安装程序

3. 按照安装向导完成安装：
   - 选择安装位置（默认 C:\Program Files\frontier-desktop）
   - 选择是否创建桌面快捷方式
   - 选择是否创建开始菜单快捷方式

4. 安装完成后，在以下位置找到 Frontier：
   - 桌面快捷方式
   - 开始菜单 → Frontier

### 方式 2：使用便携版（无需安装）

1. 下载 `Frontier.zip`

2. 解压到任意文件夹（例如 `D:\Apps\Frontier\`）

3. 打开文件夹，找到 `Frontier.vbs`

4. 双击 `Frontier.vbs` 启动应用

5. 首次启动可能需要 10-30 秒

## 首次启动设置

### 1. 启动应用

- **使用快捷方式**：双击桌面的 Frontier 快捷方式
- **使用便携版**：双击 `Frontier.vbs`

启动时可能看到一个黑色的控制台窗口，这是正常的（后端初始化）。

### 2. 打开浏览器

应用会自动打开浏览器窗口，显示聊天界面。

### 3. 配置 API Key

第一次使用需要配置 API Key：

1. 点击界面左上角的 **⚙ 设置** 按钮

2. 选择 **LLM 配置**

3. 输入以下信息：

   **使用 Anthropic Claude 的用户：**
   - **API Base URL**: `https://api.anthropic.com`
   - **API Key**: 从 [api.anthropic.com](https://api.anthropic.com) 获取
   - **Model**: `claude-sonnet-4-6` 或其他可用模型

   **使用其他服务的用户：**
   - **API Base URL**: 服务提供商的 API 端点
   - **API Key**: 你的 API Key
   - **Model**: 可用的模型名称

4. 点击 **保存** 或 **连接**

5. 如果配置正确，会显示连接成功

### 4. 开始对话

现在可以开始使用 Frontier 了！在输入框中输入问题，点击发送按钮。

## 日常使用

### 启动

- **快捷方式启动**（推荐）：双击桌面快捷方式
- **命令行启动**：
  ```bash
  "%APPDATA%\Local\Programs\frontier-desktop\Frontier.bat"
  ```
- **无窗口启动**（便携版）：
  ```bash
  D:\Frontier\Frontier.vbs
  ```

### 常用命令

在聊天框中输入以下命令：

| 命令 | 功能 |
|------|------|
| `/reset` | 清空对话历史 |
| `/compact` | 压缩上下文（当历史很长时） |
| `/health` | 显示服务健康状态 |

### 使用心跳任务

创建定时执行的任务（需要 PowerShell）：

```powershell
# 创建任务
$body = @{
    action = "add"
    id = "daily-check"
    prompt = "总结今天的重要事项"
    intervalSeconds = 86400  # 每天执行一次
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

详见 `skills/heartbeat/HEARTBEAT_GUIDE.md`

## 文件位置和配置

### 应用位置

- **安装版**：`C:\Program Files\frontier-desktop\`
- **便携版**：你解压的文件夹

### 用户数据

- **日志**：`%APPDATA%\Roaming\frontier-desktop\frontier.log`
- **缓存**：`%LOCALAPPDATA%\frontier-desktop\cache\`
- **配置**：保存在浏览器本地存储中

### 关键文件

```
Frontier\
├── Frontier.bat          # Windows 批处理启动器（显示控制台）
├── Frontier.vbs          # VBScript 启动器（无窗口）
├── main.js               # Node.js 主程序
├── frontend-dist\        # Web 前端文件
├── backend-dist\         # 后端服务
├── bin\claw.exe          # AI 引擎
├── skills\               # 技能和扩展
│   └── heartbeat\        # 定时任务技能
└── docs\                 # 文档
```

## 常见问题

### Q: 启动时窗口闪现然后消失？

**A**: 这通常表示后端启动失败。
- 检查 API Key 配置是否正确
- 查看日志文件：`%APPDATA%\Roaming\frontier-desktop\frontier.log`
- 确保网络连接正常

### Q: 启动很慢？

**A**: 正常。首次启动需要初始化 AI 引擎和下载必要数据，可能需要 20-30 秒。后续启动会快得多。

### Q: "连接失败" 或 "无法连接到服务器"？

**A**: 检查以下几点：
1. API Key 是否正确配置
2. 网络连接是否正常
3. 防火墙是否阻止了 localhost 连接
4. 尝试重启应用

### Q: 心跳任务没有执行？

**A**: 见 `skills/heartbeat/HEARTBEAT_GUIDE.md` 中的故障排除部分。常见原因：
- 没有使用 `/heartbeat` API
- Agent 正在处理其他请求
- TCP 连接断开

### Q: 如何完全卸载？

**A**: 
1. 在控制面板 → 程序和功能中找到 Frontier
2. 点击卸载
3. 选择是否保留用户数据
4. 完成卸载

如果想完全清除所有数据：
```bash
rmdir /s %APPDATA%\Roaming\frontier-desktop
rmdir /s %LOCALAPPDATA%\frontier-desktop
```

### Q: 能在多台计算机上使用吗？

**A**: 可以。每台计算机独立运行，配置和数据各自保存。

### Q: 支持多用户吗？

**A**: 支持。每个 Windows 用户账户有独立的应用数据和配置。

## 更新

### 检查更新

目前需要手动检查更新。定期访问下载页面查看最新版本。

### 升级步骤

1. 下载新版本安装程序
2. 双击运行（会自动卸载旧版本）
3. 或手动卸载旧版本后安装新版本

**便携版用户**：
1. 下载新版本 ZIP
2. 备份旧版本文件夹（如需保留配置）
3. 解压新版本到新文件夹

## 获取帮助

### 资源

- 📖 完整文档：见 `docs/` 目录
- 🎯 快速开始：`docs/QUICK_START.md`
- 💻 技能指南：`skills/heartbeat/HEARTBEAT_GUIDE.md`
- 🐛 已知问题：应用菜单 → 帮助 → 已知问题

### 反馈和支持

- 🔗 官方网站：[frontier-ai.example.com]
- 💬 讨论区：[community.example.com]
- 🐛 报告 Bug：[issues.example.com]

## 安全和隐私

### 数据处理

- API Key 仅存储在本地浏览器中，不会上传
- 对话记录存储在本地浏览器存储中
- 对话内容会发送到你配置的 AI API 服务（遵循该服务的隐私政策）

### 网络通信

- 应用仅连接到：
  - AI API 服务（如 api.anthropic.com）
  - 本地 localhost（端口 8081）
- 不会连接到其他外部服务

## 系统资源

典型资源占用：
- **内存**：200-500MB
- **CPU**：空闲时 < 5%，处理请求时 20-40%
- **磁盘**：初始 ~500MB + 缓存

## 技术细节

如果你对技术细节感兴趣，查看：
- 前端源代码：`claw-web-chat/frontend/`
- 后端源代码：`claw-web-chat/backend/`
- AI 引擎源代码：`rust/`

