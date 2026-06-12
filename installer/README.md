# Frontier Desktop Installer

将 Frontier 聊天应用打包成 Windows 安装程序（.exe），用户安装后双击即可使用，无需配置任何开发环境。

## 架构

```
installer/
├── main.js                      # Electron 主进程（启动后台 + 显示窗口）
├── preload.js                   # 安全的 IPC 桥接
├── package.json                 # Electron + electron-builder 配置
├── scripts/
│   ├── build.js                 # 一键构建脚本
│   └── patch-backend.js         # 生产模式静态文件服务
├── assets/
│   └── icon.ico                 # 应用图标（需要提供）
├── skills/
│   └── heartbeat/               # 内置技能：定时任务
│       ├── SKILL.md             # 技能文档
│       ├── HEARTBEAT_GUIDE.md   # 完整使用指南
│       ├── test-heartbeat.ps1   # 测试脚本
│       └── references/          # 参考示例
├── docs/
│   └── MCP-and-Skills-Guide.md  # MCP 和技能指南
├── frontend-dist/               # [构建生成] 前端静态文件
├── backend-dist/                # [构建生成] 后端编译输出
└── bin/
    └── claw.exe                 # [构建生成] AI 引擎
```

## 打包流程

### 前置条件

- Node.js 18+ 
- Rust toolchain（如需编译 claw.exe）
- Windows 环境

### 步骤

```bash
# 1. 进入 installer 目录
cd installer

# 2. 安装依赖
npm install

# 3. 一键构建（编译前端、后端、拷贝 claw.exe）
node scripts/build.js

# 4. 给后端添加静态文件服务能力
node scripts/patch-backend.js

# 5. 本地测试
npm start

# 6. 打包成安装程序
npm run dist:win
```

### 输出

构建完成后，安装包位于 `installer/release/` 目录：
- `Frontier Setup x.x.x.exe` — NSIS 安装程序
- `Frontier/` — 便携版（解压即用）

### 打包内容

生成的安装程序包含以下内容：

1. **前端** — Vue.js 聊天界面
2. **后端** — Node.js 服务（AG-UI 协议、心跳任务管理）
3. **AI 引擎** — claw.exe（Rust 编写）
4. **内置技能** — 心跳任务管理、系统监控等
5. **文档** — 使用指南、API 文档
6. **MCP 服务器** — 可选的扩展服务

### 心跳技能（Heartbeat）

安装包已包含心跳任务技能，用户无需额外配置：

- **位置**：`Frontier/skills/heartbeat/`
- **文档**：
  - `SKILL.md` — 技能概述
  - `HEARTBEAT_GUIDE.md` — 完整使用指南
- **测试**：运行 `test-heartbeat.ps1` 验证功能

用户可通过 `/heartbeat` HTTP API 创建定时任务：

```powershell
$body = @{
    action = "add"
    id = "my-task"
    prompt = "你是谁，你能干什么"
    intervalSeconds = 30
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

## 用户使用流程

### 安装和启动

1. 双击安装程序 → 安装到自选目录
2. 桌面/开始菜单出现 "Frontier" 快捷方式
3. 双击启动 → 自动启动后台服务 + 打开聊天界面
4. 首次使用需在设置中配置 API Key
5. 开始对话

### 使用内置功能

#### 心跳任务（Heartbeat）

用户可创建定时执行的任务，让 AI 按固定间隔执行指令：

**创建任务：**
```powershell
$body = @{
    action = "add"
    id = "monitor"
    prompt = "检查系统内存占用"
    intervalSeconds = 60  # 每60秒执行一次
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
    -Body '{"action":"remove","id":"monitor"}' `
    -ContentType "application/json"
```

详细文档见：`Frontier/skills/heartbeat/HEARTBEAT_GUIDE.md`

## 技术细节

- **Electron** — 负责创建桌面窗口 + 管理进程生命周期
- **Backend (Node.js)** — 提供 AG-UI 协议服务、HTTP API、静态文件服务
  - `/agent` — 主 AI 运行端点（SSE 流）
  - `/heartbeat` — 心跳任务管理 API
  - `/config` — AI 引擎连接配置
  - `/health` — 健康检查
- **claw.exe** — AI 引擎（Rust 编写），由 backend 按需启动
- **心跳任务** — 后端集成的定时任务管理器
  - 使用 setInterval 管理任务计时
  - 支持并发多任务
  - 自动等待前置条件满足后执行
- 所有组件打包在一起，用户无需安装任何依赖

## 自定义

- 修改 `package.json` 中的 `build.nsis` 配置安装行为
- 替换 `assets/icon.ico` 自定义应用图标
- 修改 `main.js` 中窗口大小等参数

## 构建故障排除

### 问题：claw.exe 找不到

**原因**：Rust 还未编译

**解决方案**：
```bash
cd ../rust
cargo build --release
cd ../installer
node scripts/build.js
```

### 问题：构建过程很慢

**说明**：首次构建需要编译前端、后端、Rust，通常需要 5-10 分钟。后续构建可用缓存加速。

### 问题：打包后的 EXE 很大（> 500MB）

**说明**：这是正常的，包含了 Node.js 运行时、claw.exe、所有依赖。建议压缩后分发。

## 分发

### 方式1：安装程序（推荐）
- 文件：`release/Frontier Setup x.x.x.exe`
- 用户体验：一键安装，集成快捷方式

### 方式2：便携版
- 文件：`release/Frontier/` 目录
- 用户体验：无需安装，直接运行

### 优化分发大小

```bash
# 压缩便携版
cd release
7z a -tzip Frontier.zip Frontier/
# 上传 Frontier.zip，用户下载后解压即可使用
```

## 版本更新

### 打包新版本

```bash
# 1. 更新版本号
# 修改 package.json version 字段

# 2. 重新构建
node scripts/build.js
node scripts/patch-backend.js

# 3. 打包
npm run dist:win

# 输出：release/Frontier Setup x.x.x.exe
```

### 更新内容

- **技能文件** — 直接修改 `skills/` 目录，重新打包时自动包含
- **文档** — 修改 `docs/` 或 `skills/*/README.md`，重新打包
- **后端 API** — 修改 `claw-web-chat/backend/src`，重新构建

## 快速参考

### 最常见的操作

```bash
# 完整构建 + 打包
node scripts/build.js && node scripts/patch-backend.js && npm run dist:win

# 仅测试本地
npm start

# 清理构建缓存
rm -r frontend-dist backend-dist
node scripts/build.js
```

