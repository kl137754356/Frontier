# 心跳任务修复 - 行动清单

## 给现有用户

### 如果你已创建了心跳任务但没有执行

✅ **不用担心，这是正常的**

之前创建的任务使用了不支持的工具，它们从未真正执行过。

### 如何创建工作的心跳任务

使用正确的 `/heartbeat` HTTP API：

```powershell
# 创建任务
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

### 清除旧任务（可选）

```powershell
# 清除所有旧的、不工作的任务
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"clear"}' `
    -ContentType "application/json"
```

### 查看完整文档

在你的 Frontier 安装目录中找到：
- 📖 `skills/heartbeat/HEARTBEAT_GUIDE.md` — 完整使用指南
- 📖 `docs/QUICK_START.md` — 快速开始
- 📖 `docs/INSTALLATION_GUIDE.md` — 详细说明

## 给开发者

### 构建新版本

1. **更新文件**（已完成）
   - ✅ 更新了 skill 文档
   - ✅ 添加了使用指南
   - ✅ 创建了测试脚本
   - ✅ 更新了 README

2. **打包新版本**
   ```bash
   cd installer
   .\build-and-package.ps1
   # 或
   npm run build && npm run dist:win
   ```

3. **测试发布版本**
   - 在测试机器上安装新的 EXE
   - 验证心跳任务功能
   - 检查文档可见性

4. **发布**
   - 上传 `release/Frontier Setup x.x.x.exe`
   - 上传发布说明
   - 通知用户升级

### 发布说明范例

```markdown
## Frontier vX.Y.Z 发布说明

### 🔧 修复

- **心跳任务** — 修复任务无法执行的问题
  - 之前使用的 CronCreate 工具不被支持
  - 现在完全使用 /heartbeat HTTP API
  - 用户需更新创建任务的方式

### 📚 改进

- 添加完整的心跳任务使用指南
- 新增快速开始指南
- 完善了安装说明文档

### 📖 文档

- `skills/heartbeat/HEARTBEAT_GUIDE.md` — 完整 API 文档
- `docs/QUICK_START.md` — 5 分钟快速上手
- `docs/INSTALLATION_GUIDE.md` — 详细设置步骤

### 升级指南

如果你已创建了心跳任务：
1. 旧任务不会执行（这是正常的）
2. 参考新文档使用 `/heartbeat` API 创建新任务
3. 或清除所有旧任务后重新创建

### 已知问题

暂无

### 系统要求

- Windows 10+
- 1GB 磁盘空间
- 网络连接
```

### 检查清单

发布前确认：

- [ ] `installer/skills/heartbeat/HEARTBEAT_GUIDE.md` 内容完整
- [ ] `test-heartbeat.ps1` 脚本可正常运行
- [ ] 本地测试心跳任务功能
- [ ] 文档在安装包中（`release/Frontier/skills/`）
- [ ] README 已更新，提及新的文档
- [ ] 版本号已更新
- [ ] 构建无错误

### 构建验证

```bash
# 1. 打包
cd installer
.\build-and-package.ps1

# 2. 检查输出
ls -la release/Frontier/

# 3. 验证文件存在
ls release/Frontier/skills/heartbeat/
ls release/Frontier/docs/

# 4. 尺寸检查（应该在 400-600MB）
ls -lh "release/Frontier*.exe"

# 5. 本地测试
cd release/Frontier
.\Frontier.vbs
# 测试：
# - 界面加载
# - 聊天功能
# - 心跳 API（PowerShell 脚本）
```

## 给用户支持团队

### 常见问题和回答

**Q: 为什么我的心跳任务没有执行？**

A: 如果是在更新前创建的任务，那是因为之前使用的工具不被支持。升级到新版本后，按照 `skills/heartbeat/HEARTBEAT_GUIDE.md` 中的说明使用 `/heartbeat` API 创建任务即可。

**Q: 如何确认我的任务正在工作？**

A: 运行以下命令查看任务的执行统计：
```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"list"}' `
    -ContentType "application/json"
```

检查 `runCount` 是否在增加。

**Q: 我可以同时创建多少个任务？**

A: 理论上无限制，但建议不超过 5 个以避免 Agent 响应缓慢。

**Q: 心跳任务会中断用户对话吗？**

A: 不会。心跳任务优先级低，会等待用户对话完成后再执行。

**Q: 如何停止一个任务？**

A: 使用 remove 操作：
```powershell
Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" `
    -Method POST `
    -Body '{"action":"remove","id":"task-name"}' `
    -ContentType "application/json"
```

### 参考资源

- 📖 完整指南：`skills/heartbeat/HEARTBEAT_GUIDE.md`
- 📖 快速开始：`docs/QUICK_START.md`
- 🧪 测试脚本：`skills/heartbeat/test-heartbeat.ps1`

## 时间线

### 立即（当前）

- ✅ 文档已更新
- ✅ 指南已完成
- ✅ 测试工具已创建

### 下一版本发布

- 📦 打包新的安装程序
- 📢 发布更新说明
- 📧 通知现有用户

### 后续

- 🔄 收集用户反馈
- 🛠️ 如需要进行微调
- 📈 改进文档基于实际使用

## 相关文件

### 用户文档
- `installer/skills/heartbeat/HEARTBEAT_GUIDE.md`
- `installer/skills/heartbeat/SKILL.md`
- `installer/docs/QUICK_START.md`
- `installer/docs/INSTALLATION_GUIDE.md`

### 开发者文档
- `installer/README.md`
- `installer/PACKAGING_CHECKLIST.md`
- `PACKAGE_UPDATE_SUMMARY.md`（本项目）

### 工具脚本
- `installer/build-and-package.ps1`
- `installer/build-and-package.bat`
- `installer/skills/heartbeat/test-heartbeat.ps1`

## 问题跟踪

**问题**：用户创建的心跳任务从不执行

**症状**：
- CronCreate 返回成功
- 但 runCount 始终为 0

**根本原因**：CronCreate 工具不被支持

**解决方案**：使用 `/heartbeat` HTTP API

**状态**：✅ 已解决（通过文档更新和示例代码）

## 备注

- 所有文档都包含在安装包中
- 新用户不会受到影响（他们会看到正确的文档）
- 现有用户需要升级才能看到新文档
- 无需代码更改，仅文档和打包更新

