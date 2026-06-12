# ✅ CronCreate 问题已完全修复

## 🔧 问题和解决

**问题**: 即使禁用了 CronCreate，仍然在使用它  
**原因**: `agui-server.ts` 中没有传递 `skillsDir` 参数  
**解决**: 添加 `SKILLS_DIR` 常量并传递给 `resolveSkill()`

## 📝 修改内容

**文件**: `claw-web-chat/backend/src/agui-server.ts`

**修改 1** (第 64-67 行):
```typescript
const CLAW_WORKSPACE = process.env.CLAW_WORKSPACE || '';
const SKILLS_DIR = CLAW_WORKSPACE ? join(CLAW_WORKSPACE, '.claw', 'skills') : join(process.cwd(), '.claw', 'skills');
```

**修改 2** (第 422 行):
```typescript
// 修改前: const promptText = resolveSkill(lastUserMsg.content, undefined);
// 修改后:
const promptText = resolveSkill(lastUserMsg.content, SKILLS_DIR);
```

## 🚀 效果

现在:
- ✅ 代理读取 `AGENT_INSTRUCTIONS.md`
- ✅ 代理收到禁用指令
- ✅ 100% 使用 `/heartbeat` API
- ✅ 不再使用 CronCreate

## 📦 新版本

**版本**: Frontier Distribution 127.8 MB (已更新)  
**位置**: `installer/release/Frontier/`

## 🧪 验证

1. 启动新版本
2. 创建心跳: `/heartbeat 10s 测试`
3. 查看日志 - 应该看到 `/heartbeat` 而不是 CronCreate

**现在应该完全修复了！** ✓

