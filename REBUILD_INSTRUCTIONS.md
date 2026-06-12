# 安装包重建说明

## 当前状态

❌ **旧的安装包**（`installer/release/Frontier/`）不包含最新文件：
- ❌ 缺少 `AGENT_INSTRUCTIONS.md`
- ❌ 缺少 `DISABLE_CRONCREATE.md`
- ❌ 后端代码未更新

✅ **源代码已更新**：
- ✅ 所有新文件已创建
- ✅ 后端代码已修改
- ✅ 技能文档已更新

## 需要做什么

需要重新构建安装包以将最新的代码和文件打包进去。

## 快速重建方法

### 方法 1：使用重建脚本（推荐）

```powershell
# 在项目根目录运行
.\REBUILD_PACKAGE.ps1
```

脚本会自动：
1. 验证所有源文件存在
2. 清理旧的构建
3. 执行完整构建
4. 生成新的安装程序
5. 验证打包内容

### 方法 2：手动重建

```bash
# 1. 进入 installer 目录
cd installer

# 2. 清理旧的构建
rm -r frontend-dist backend-dist release

# 3. 构建（编译前端、后端、复制 claw.exe）
npm run build

# 4. 生成安装程序
npm run dist:win

# 5. 输出位置
# release/Frontier Setup x.x.x.exe
# release/Frontier/（便携版）
```

### 方法 3：使用已有的一键脚本

```powershell
cd installer
.\build-and-package.ps1
```

## 重建完成后

### 验证新文件是否包含

```bash
# 检查新文件是否在打包中
ls installer/release/Frontier/skills/heartbeat/
# 输出应该包含：
# - AGENT_INSTRUCTIONS.md ✓（新增）
# - HEARTBEAT_GUIDE.md
# - SKILL.md（已更新）
# - test-heartbeat.ps1
# - references/

ls installer/release/Frontier/docs/
# 输出应该包含：
# - DISABLE_CRONCREATE.md ✓（新增）
# - QUICK_START.md
# - INSTALLATION_GUIDE.md
# - MCP-and-Skills-Guide.md
```

### 测试新的安装程序

```bash
# 1. 在虚拟机或测试机上安装
# 双击 installer/release/Frontier Setup x.x.x.exe

# 2. 启动应用

# 3. 输入："设置心跳"
# 观察 Agent 是否：
# ✓ 生成 PowerShell 代码
# ✓ 调用 /heartbeat API
# ✗ 不使用 CronCreate

# 4. 运行生成的代码
# 验证任务是否执行成功
```

## 文件变更清单

### 新增到安装包中

```
installer/release/Frontier/
├── skills/heartbeat/
│   ├── AGENT_INSTRUCTIONS.md ✨ 新增
│   ├── HEARTBEAT_GUIDE.md
│   ├── SKILL.md (更新)
│   └── test-heartbeat.ps1
├── docs/
│   ├── DISABLE_CRONCREATE.md ✨ 新增
│   ├── QUICK_START.md
│   ├── INSTALLATION_GUIDE.md
│   └── ...
├── backend-dist/
│   └── ... (包含修改后的 ws-handler.ts)
```

### 打包时自动复制

通过 `make-installer.js` 脚本：
```javascript
copyDir(path.join(ROOT, 'skills'), path.join(RELEASE_DIR, 'skills'));
copyDir(path.join(ROOT, 'docs'), path.join(RELEASE_DIR, 'docs'));
```

这确保所有新文件自动包含在安装包中。

## 构建时间预估

| 步骤 | 时间 |
|------|------|
| 清理 | < 1s |
| 前端构建 | 30-60s |
| 后端构建 | 20-30s |
| 打包 | 30-60s |
| **总计** | **2-3 分钟** |

## 常见问题

### Q: 构建失败了怎么办？

A: 检查以下几点：
1. Node.js 版本是否 >= 18
2. 磁盘空间是否充足（> 2GB）
3. 防火墙是否阻止了网络访问
4. 查看错误日志找到具体原因

### Q: 为什么要重新构建？

A: 因为新文件需要打包进安装程序。仅修改源代码而不重新构建，用户无法获得这些改进。

### Q: 重建会覆盖什么？

A: 仅覆盖 `installer/release/` 目录中的文件。源代码不受影响。

### Q: 能否跳过某些步骤？

A: 不建议。完整的构建流程确保一切正确打包。

## 最后检查

重建前确认：

- [ ] `installer/skills/heartbeat/AGENT_INSTRUCTIONS.md` 存在
- [ ] `installer/docs/DISABLE_CRONCREATE.md` 存在
- [ ] `claw-web-chat/backend/src/ws-handler.ts` 已修改
- [ ] Node.js 已安装
- [ ] 磁盘空间充足

## 发布检查

重建后确认：

- [ ] `installer/release/Frontier/skills/heartbeat/AGENT_INSTRUCTIONS.md` 在安装包中
- [ ] `installer/release/Frontier/docs/DISABLE_CRONCREATE.md` 在安装包中
- [ ] EXE 文件大小正常（400-600MB）
- [ ] 在测试机上安装成功
- [ ] 功能测试通过

## 下一步

1. 运行重建脚本
2. 验证打包内容
3. 在测试环境验证功能
4. 发布给用户

---

**提示**：如果想了解打包的详细过程，查看 `installer/scripts/make-installer.js`

