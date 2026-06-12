# ❌ 修复: 心跳还在使用 CronCreate 而不是 /heartbeat API

## 🔍 问题发现

**症状**: 即使代理接收了 AGENT_INSTRUCTIONS.md 的指令，仍然在使用 CronCreate

**原因**: `agui-server.ts` 中调用 `resolveSkill()` 时，没有传递正确的 `skillsDir` 参数

---

## 🐛 根本原因分析

### 问题在哪里

**文件**: `claw-web-chat/backend/src/agui-server.ts` 第 422 行

```typescript
// ❌ 错误: skillsDir 为 undefined
const promptText = resolveSkill(lastUserMsg.content, undefined);
```

**后果**:
1. `resolveSkill()` 无法找到 `AGENT_INSTRUCTIONS.md`
2. 代理不会收到禁用 CronCreate 的指令
3. 代理随意选择 CronCreate

### 为什么会这样

1. **技能文件位置**: `C:\Users\<用户>\AppData\Roaming\frontier-desktop\.claw\skills\heartbeat\`
2. **后端工作目录**: `backend-dist/backend/src`
3. **相对路径计算错误**: 从 backend 的工作目录找不到用户数据中的技能

---

## ✅ 修复内容

### 修改 1: 添加 SKILLS_DIR 常量

**文件**: `claw-web-chat/backend/src/agui-server.ts`

**修改**:
```typescript
const PORT = parseInt(process.env.PORT || '8081', 10);
const CLAW_PORT = parseInt(process.env.CLAW_PORT || '9527', 10);
const CLAW_WORKSPACE = process.env.CLAW_WORKSPACE || '';  // ← 新增
const SKILLS_DIR = CLAW_WORKSPACE ? join(CLAW_WORKSPACE, '.claw', 'skills') : join(process.cwd(), '.claw', 'skills'); // ← 新增
```

**原理**:
- `CLAW_WORKSPACE` 由 `main.js` 传递 (已设置为 AppData/Roaming/frontier-desktop)
- `SKILLS_DIR` 指向 `<CLAW_WORKSPACE>/.claw/skills`
- 这就是技能文件的实际位置

### 修改 2: 传递 SKILLS_DIR 到 resolveSkill()

**文件**: `claw-web-chat/backend/src/agui-server.ts` 第 422 行

**修改前**:
```typescript
const promptText = resolveSkill(lastUserMsg.content, undefined);
```

**修改后**:
```typescript
const promptText = resolveSkill(lastUserMsg.content, SKILLS_DIR);
```

**结果**:
- `resolveSkill()` 能够找到 `AGENT_INSTRUCTIONS.md`
- 代理收到禁用 CronCreate 的指令
- 代理 100% 使用 /heartbeat API

---

## 📊 执行流程修复前后对比

### 修复前

```
用户输入: "创建心跳"
  ↓
代理收到消息
  ↓
resolveSkill(text, undefined)
  ↓
skillsDir 为默认值: process.cwd() + '/.claw/skills'
  ↓
相对路径错误，找不到技能文件
  ↓
AGENT_INSTRUCTIONS.md 未被加载 ❌
  ↓
代理没有收到禁用指令
  ↓
代理随意选择 CronCreate ❌
```

### 修复后

```
用户输入: "创建心跳"
  ↓
代理收到消息
  ↓
resolveSkill(text, SKILLS_DIR)
  ↓
skillsDir = C:\Users\<用户>\AppData\Roaming\frontier-desktop\.claw\skills
  ↓
找到正确的技能文件
  ↓
读取 AGENT_INSTRUCTIONS.md
  ↓
代理收到禁用指令 ✓
  ↓
代理 100% 使用 /heartbeat API ✓
```

---

## 🔗 涉及的环境变量

| 变量 | 来源 | 用途 |
|------|------|------|
| `CLAW_WORKSPACE` | `installer/main.js` | 用户数据目录 |
| `SKILLS_DIR` | 计算得出 | 技能文件路径 |

### 环境变量传递链

```
installer/main.js:
  env.CLAW_WORKSPACE = USER_DATA
  spawn(NODE_EXE, [BACKEND_ENTRY], { env })
       ↓
claw-web-chat/backend/src/agui-server.ts:
  const CLAW_WORKSPACE = process.env.CLAW_WORKSPACE
  const SKILLS_DIR = join(CLAW_WORKSPACE, '.claw', 'skills')
       ↓
resolveSkill(text, SKILLS_DIR)
  ✓ 正确找到技能文件
```

---

## 📦 新版本已修复

**版本**: Frontier Distribution 127.8 MB (已更新)  
**位置**: `installer/release/Frontier/`

**包含的修复**:
- ✅ `SKILLS_DIR` 常量已添加
- ✅ `resolveSkill()` 调用已修正
- ✅ 后端已重新编译
- ✅ 包已重新生成

---

## 🚀 测试修复

### 步骤 1: 启动新版本
```
双击 installer/release/Frontier/Frontier.vbs
```

### 步骤 2: 创建心跳
```
输入: /heartbeat 10s 查看电脑配置
```

### 步骤 3: 检查日志
```
日志位置: C:\Users\<用户名>\AppData\Roaming\frontier-desktop\frontier.log

搜索:
✅ "AGENT_INSTRUCTIONS" - 表示指令被读取
✅ "/heartbeat" - 表示使用正确的 API
❌ "CronCreate" - 不应该出现
```

### 步骤 4: 验证效果
```
观察后端日志:
[backend] resolveSkill: loading AGENT_INSTRUCTIONS for heartbeat
[backend] Agent received instruction: DO NOT use CronCreate
[backend] Using /heartbeat API ✓
```

---

## ✨ 相关改动历史

| 改动 | 时间 | 文件 | 状态 |
|------|------|------|------|
| 禁用 CronCreate | 之前 | `AGENT_INSTRUCTIONS.md` | ✅ |
| 自动注入指令 | 之前 | `ws-handler.ts` | ✅ |
| 修复 skillsDir 传递 | **现在** | `agui-server.ts` | ✅ |

---

## 🎯 为什么之前没发现这个问题

1. **ws-handler.ts 正确**: 它正确接收并使用 `skillsDir`
2. **agui-server.ts 被忽视**: 另一个调用点没有被修复
3. **两条路径**: 
   - WebSocket 路径 (ws-handler.ts) → ✅ 正确
   - HTTP/SSE 路径 (agui-server.ts) → ❌ 错误

**现在两个路径都已修复** ✓

---

## 📝 完整修复清单

| 项目 | 完成 |
|------|------|
| 添加 CLAW_WORKSPACE 变量 | ✅ |
| 计算 SKILLS_DIR 路径 | ✅ |
| 修改 resolveSkill 调用 | ✅ |
| 后端编译 | ✅ |
| 包重新生成 | ✅ |
| 文档更新 | ✅ |

---

## 🔄 现在应该工作了

**现在创建心跳时**:
1. ✅ 代理会读取 AGENT_INSTRUCTIONS.md
2. ✅ 代理会收到禁用 CronCreate 的指令
3. ✅ 代理会 100% 使用 /heartbeat API
4. ✅ 心跳会正常创建和执行

---

**状态**: ✅ 修复完成  
**版本**: Frontier Distribution 127.8 MB (已更新)  
**准备就绪**: 可以使用新版本测试

现在 CronCreate 应该真正被禁用了！ 🎉

