# 打包检查清单

在发布新版本前，确保以下所有项都已完成。

## 代码检查

- [ ] 后端代码编译无错误
  ```bash
  cd ../claw-web-chat/backend && npm run build
  ```

- [ ] 前端代码编译无错误
  ```bash
  cd ../claw-web-chat/frontend && npm run build
  ```

- [ ] Rust 代码编译成功
  ```bash
  cd ../rust && cargo build --release
  ```

## 版本更新

- [ ] 更新 `package.json` 中的 `version` 字段
- [ ] 更新变更日志（如有）
- [ ] 标记 Git tag（可选但推荐）

## 技能文件检查

心跳技能：
- [ ] `installer/skills/heartbeat/SKILL.md` 已更新
- [ ] `installer/skills/heartbeat/HEARTBEAT_GUIDE.md` 已更新
- [ ] `installer/skills/heartbeat/test-heartbeat.ps1` 可正常运行
- [ ] 参考脚本在 `references/` 目录中

其他技能（如有）：
- [ ] 所有技能都在 `installer/skills/` 中
- [ ] 每个技能都有 `SKILL.md` 文档

## 文档检查

- [ ] `installer/README.md` 已更新
- [ ] `installer/docs/MCP-and-Skills-Guide.md` 已更新
- [ ] `installer/docs/QUICK_START.md` 内容准确
- [ ] 所有外部链接都有效

## 构建检查

```bash
# 1. 清理旧的构建
rm -r frontend-dist backend-dist

# 2. 执行完整构建
node scripts/build.js

# 3. 应用后端补丁
node scripts/patch-backend.js

# 4. 查看生成的文件
ls -la release/Frontier/
```

验证以下文件和目录存在：
- [ ] `frontend-dist/` — 前端静态文件
- [ ] `backend-dist/` — 后端编译输出 + node_modules
- [ ] `bin/claw.exe` — AI 引擎（> 30MB）
- [ ] `skills/heartbeat/` — 心跳技能文件
- [ ] `docs/` — 所有文档
- [ ] `mcp-servers/` — MCP 扩展（如有）

## 功能测试

在本地测试以下功能：

```bash
# 启动本地版本
npm start
```

然后测试：
- [ ] 聊天界面加载正常
- [ ] 可以输入并发送消息
- [ ] AI 能正常回复
- [ ] `/reset` 命令有效
- [ ] `/compact` 命令有效
- [ ] `/health` 返回正确状态

### 心跳任务测试

```powershell
# 运行测试脚本
cd skills/heartbeat
.\test-heartbeat.ps1
```

验证：
- [ ] 任务创建成功
- [ ] 任务列表显示正确
- [ ] 定时执行逻辑工作
- [ ] 任务删除成功

## 打包检查

```bash
# 生成安装程序
npm run dist:win
```

验证：
- [ ] 生成 `release/Frontier Setup x.x.x.exe`
- [ ] EXE 文件大小合理（通常 400-600MB）
- [ ] 便携版目录 `release/Frontier/` 完整

### 测试安装程序

1. 使用虚拟机或测试机器
2. 卸载旧版本（如有）
3. 双击新的 EXE 进行安装
4. 验证安装路径正确
5. 验证快捷方式可用
6. 启动应用，测试基本功能

### 测试便携版

1. 解压 `release/Frontier/` 到临时目录
2. 双击 `Frontier.vbs` 启动
3. 验证应用正常运行
4. 验证心跳任务可用

## 分发准备

- [ ] 检查文件大小
  ```bash
  # 应该在 400-600MB 范围内
  ls -lh release/Frontier*.exe
  ```

- [ ] 生成校验和（可选）
  ```bash
  certutil -hashfile "release/Frontier Setup x.x.x.exe" SHA256
  ```

- [ ] 准备发布文案
  - [ ] 新功能列表
  - [ ] Bug 修复列表
  - [ ] 已知问题（如有）
  - [ ] 升级建议

- [ ] 准备下载链接
  - [ ] 安装程序
  - [ ] 便携版
  - [ ] 发布说明

## 发布后验证

- [ ] 用户能下载到最新版本
- [ ] 新版本首次启动成功
- [ ] 收集早期用户反馈
- [ ] 准备紧急修复（如需要）

## 快速打包命令

```bash
# 一键完整打包流程
cd installer
rm -r frontend-dist backend-dist && \
node scripts/build.js && \
node scripts/patch-backend.js && \
npm run dist:win && \
echo "✓ 打包完成！输出: release/Frontier Setup x.x.x.exe"
```

## 故障排查

### 构建失败

检查：
- [ ] Node.js 版本 >= 18
- [ ] Rust toolchain 已安装
- [ ] 所有依赖已安装（npm install）
- [ ] 磁盘空间充足（> 2GB）

### 打包失败

检查：
- [ ] 7z 或 electron-builder 已安装
- [ ] 所有文件权限正确
- [ ] 没有被其他进程锁定的文件

### 测试失败

检查：
- [ ] API Key 已正确配置
- [ ] 网络连接正常
- [ ] 后端日志（查看控制台输出）

## 版本号管理

遵循语义化版本：
- `x.y.z`
  - `x` — 主版本（重大更新）
  - `y` — 次版本（新功能）
  - `z` — 补丁版本（bug 修复）

例如：
- `1.0.0` — 首个发布版本
- `1.1.0` — 添加心跳任务功能
- `1.1.1` — 修复心跳任务 bug
- `2.0.0` — 重大架构更新

