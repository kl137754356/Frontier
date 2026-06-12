# 禁用 CronCreate - 完整技术文档

## 问题描述

Agent 有时使用 CronCreate 工具创建心跳任务，有时使用 `/heartbeat` HTTP API。这导致：
- 用户困惑（为什么有时工作，有时不工作）
- 大量无效的任务被创建
- 用户体验差

## 解决方案

通过多层次的禁用机制，强制 Agent 只使用 `/heartbeat` HTTP API：

### 1. 文档层级（最强）

#### AGENT_INSTRUCTIONS.md
- **位置**：`installer/skills/heartbeat/AGENT_INSTRUCTIONS.md`
- **作用**：给 Agent/LLM 的强制指令
- **内容**：
  - 明确禁止 CronCreate、CronList、CronDelete
  - 提供正确的实现方式（代码示例）
  - 解释为什么禁用
  - 提供检查清单

#### SKILL.md 开头警告
- **内容**：在文件最开始添加 ⚠️ 强制指引
- **作用**：确保 Agent 首先看到禁止说明

### 2. 系统层级（后端注入）

#### 修改 ws-handler.ts 中的 resolveSkill 函数
- **作用**：当加载心跳技能时，自动在系统提示中注入 AGENT_INSTRUCTIONS.md
- **流程**：
  1. 用户调用心跳技能
  2. resolveSkill() 加载 SKILL.md
  3. **同时加载 AGENT_INSTRUCTIONS.md**
  4. 将两个文件都发送给 Agent
  5. Agent 看到明确的禁用指令

**代码变更**：
```typescript
// 在 resolveSkill() 中
if (matchedSkill.toLowerCase() === 'heartbeat') {
  const agentInstructionsPath = path.join(baseDir, matchedSkill, 'AGENT_INSTRUCTIONS.md');
  try {
    agentInstructions = fs.readFileSync(agentInstructionsPath, 'utf-8');
  } catch { /* 继续 */ }
}

// 将指令和技能文档都发送给 Agent
const fullContext = agentInstructions 
  ? `${agentInstructions}\n\n---\n\n${skillContent}`
  : skillContent;
```

### 3. 工作流层级（用户指导）

#### 自动转换用户意图
当用户说"设置心跳"、"定时任务"等关键词时：
1. 后端识别为心跳意图
2. 自动加载心跳技能
3. Agent 收到强制指令
4. Agent 直接使用 `/heartbeat` API

### 4. 文档层级（用户教育）

#### 用户文档更新
- **HEARTBEAT_GUIDE.md**：添加"为什么不能用 CronCreate"的部分
- **SKILL.md**：开头添加警告
- **QUICK_START.md**：明确说明 API 使用

#### 支持文档
- **HEARTBEAT_FIX_ACTION_ITEMS.md**：给支持人员的常见问题

## 实现细节

### 修改的文件

#### 1. `installer/skills/heartbeat/AGENT_INSTRUCTIONS.md`（新建）
- ✨ 给 Agent 的强制指令
- 包含完整的实现示例
- 明确的禁止列表

#### 2. `installer/skills/heartbeat/SKILL.md`（修改）
- 📝 开头添加 ⚠️ 强制指引
- 更新"禁止使用 CronCreate"章节
- 强化语气："已禁用"而不是"不被支持"

#### 3. `claw-web-chat/backend/src/ws-handler.ts`（修改）
- 📝 修改 `resolveSkill()` 函数
- 自动加载 AGENT_INSTRUCTIONS.md
- 将指令注入 Agent 系统提示

#### 4. `installer/docs/` (更新多个文档)
- 📝 HEARTBEAT_GUIDE.md
- 📝 QUICK_START.md
- 📝 INSTALLATION_GUIDE.md

## 工作原理

```
用户输入: "设置心跳：每30秒执行..."
          ↓
后端 resolveSkill()
          ↓
检测为 "heartbeat" 技能
          ↓
读取 AGENT_INSTRUCTIONS.md
读取 SKILL.md
          ↓
组合：
  [AGENT_INSTRUCTIONS 内容]
  ---
  [SKILL 内容]
  ---
  Execute the above skill.
          ↓
发送给 Agent
          ↓
Agent 首先看到强制指令
Agent 明确知道禁止 CronCreate
Agent 使用 /heartbeat API
          ↓
调用 HTTP API
调用成功 ✓
```

## 验证

### 测试方法

1. **查看文件**
   ```bash
   ls -la installer/skills/heartbeat/
   # 应该包含 AGENT_INSTRUCTIONS.md
   ```

2. **检查代码变更**
   ```bash
   grep -n "AGENT_INSTRUCTIONS" claw-web-chat/backend/src/ws-handler.ts
   # 应该显示修改的行
   ```

3. **功能测试**
   - 启动应用
   - 输入"设置心跳"
   - 观察 Agent 是否使用 `/heartbeat` API
   - 验证任务是否执行

### 日志检查

在后端日志中查看：
```
[AgUiServer] Sending prompt to claw-code: [AGENT_INSTRUCTIONS内容]
[AgUiServer] tool_start: heartbeat API (not CronCreate)
```

## 迁移指南

### 对于现有用户

用户升级后：
1. 旧的 CronCreate 任务保持无效（无害）
2. Agent 现在会强制使用 `/heartbeat` API
3. 用户应该清除旧任务并重新创建

### 对于开发者

1. **构建新版本**
   ```bash
   cd installer
   node scripts/build.js
   node scripts/patch-backend.js
   npm run dist:win
   ```

2. **验证打包内容**
   ```bash
   ls release/Frontier/skills/heartbeat/
   # 应该包含 AGENT_INSTRUCTIONS.md
   ```

3. **发布**
   - 上传新的安装程序
   - 注明"修复：强制使用 /heartbeat API"

## 备注

### 为什么需要多层禁用？

不同的 Agent 和 LLM 可能：
- 忽视文档（需要代码强制）
- 遵循代码级指令（需要明确注入）
- 需要多次重复（AGENT_INSTRUCTIONS 重复强调）
- 需要示例代码（通过 AGENT_INSTRUCTIONS 提供）

通过多层级方法，确保 100% 的覆盖。

### 后续改进

1. **MCP 工具禁用** — 如果可能，直接在后端禁用 CronCreate 工具调用
2. **配置选项** — 添加配置文件来控制允许的工具
3. **监控和告警** — 检测到 CronCreate 调用时提醒

## 相关文件

### 核心文件
- `installer/skills/heartbeat/AGENT_INSTRUCTIONS.md` ← 新增
- `installer/skills/heartbeat/SKILL.md` ← 修改
- `claw-web-chat/backend/src/ws-handler.ts` ← 修改

### 文档
- `installer/docs/DISABLE_CRONCREATE.md` ← 本文件
- `installer/skills/heartbeat/HEARTBEAT_GUIDE.md`
- `installer/docs/QUICK_START.md`

### 工具
- `installer/skills/heartbeat/test-heartbeat.ps1`

