# 设计文档：Hook 管理

## Overview

本设计为 Frontier 桌面应用引入事件驱动的"Hook"自动化系统，覆盖 Hook 的 CRUD 管理、事件匹配、动作执行、前端管理界面、以及安装器集成。

核心设计原则：**在不改动现有 `/agent` 主链路与 AG-UI SSE 事件协议、不破坏心跳任务/登录/TCP 连接流程的前提下增量叠加能力**。

- 新增 `/hooks` REST 端点族，完全独立于现有端点。
- Hook 执行引擎在现有 `handleAgentRun` 的关键节点注入异步触发点，fire-and-forget 不阻塞 SSE 流。
- `send-prompt` 动作复用现有 heartbeat 的队列模式（共享 `heartbeatQueue` + `drainHeartbeatQueue`），保证与用户对话不冲突。

设计基于以下现有架构事实：

- 后端 `agui-server.ts` 使用原生 `http.createServer` + `if/else` 路由分发
- 心跳任务已有 `heartbeatQueue` + `drainHeartbeatQueue()` 的串行执行队列机制
- 前端用 Zustand + `persist`（localStorage）管理状态
- `A2AAgentManager.tsx` 和 `HeartbeatManager.tsx` 是管理面板 UI 的参考模式

## Architecture

### 组件划分

后端（`claw-web-chat/backend/src`）新增四个模块：

- **Hook_Store**（`hook-store.ts`）：纯数据层。读写 `~/.frontier-desktop/.claw/hooks.json`，原子写入，解析失败降级为空列表。
- **Hook_Manager**（`hook-manager.ts`）：业务逻辑层。CRUD、字段校验、hook_id 生成、时间戳维护。
- **Hook_Executor**（`hook-executor.ts`）：事件触发引擎。接收事件 → 匹配 enabled Hook → 异步执行动作。
- **Hook_Registry_API**：在 `agui-server.ts` 路由中新增 `/hooks` 端点族。

前端（`claw-web-chat/frontend/src`）：

- **HookManager.tsx**（`components/HookManager.tsx`）：Hook 管理面板，列表 + 创建/编辑表单 + 删除确认 + 启用/禁用开关。
- **chat-store 扩展**：新增 `hooks: HookDefinition[]` 缓存与管理 actions。

installer（`installer/main.js`）：

- **setupHooksTemplate()**：首次启动时拷贝默认模板。

### 组件关系图

```
┌─────────────────────────────────────────────────────┐
│  前端 (React + Zustand)                              │
│                                                      │
│  HookManager.tsx ──► chat-store (hooks cache)        │
│       │                    │                         │
│       └──── fetch ─────────┘                         │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP GET/POST/PUT/DELETE /hooks
                        ▼
┌─────────────────────────────────────────────────────┐
│  后端 (agui-server.ts)                               │
│                                                      │
│  /hooks 端点 ──► Hook_Manager ──► Hook_Store         │
│                                      │               │
│  handleAgentRun ──► Hook_Executor ◄──┘               │
│       │                    │                         │
│       │              (fire-and-forget)               │
│       │                    ├─► send-prompt           │
│       │                    │   (via heartbeatQueue)  │
│       │                    └─► run-command           │
│       │                        (child_process.exec)  │
│       ▼                                              │
│  tcpBridge / SSE (不变)                              │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  磁盘                                                │
│  ~/.frontier-desktop/.claw/hooks.json                │
└─────────────────────────────────────────────────────┘
```

### 关键架构决策

1. **新增独立 `/hooks` 端点而非扩展现有端点。** 理由：边界清晰，不增加主链路耦合。
2. **send-prompt 动作复用 heartbeat 队列。** 理由：heartbeat 已解决"AI 忙时排队"问题，复用保证 Hook prompt 不与用户对话冲突。
3. **Hook_Executor 采用 fire-and-forget。** 理由：Hook 执行结果不影响主对话流，异常隔离。
4. **hooks.json 与 agents.json 独立文件。** 理由：职责分离，各自原子写入互不影响。

## Components and Interfaces

### Hook_Store（`hook-store.ts`）

```typescript
// 路径：CLAW_WORKSPACE ? join(CLAW_WORKSPACE, '.claw', 'hooks.json')
//       : join(process.cwd(), '.claw', 'hooks.json')

interface HookStore {
  /** 读取全部 Hook。文件不存在或 JSON 解析失败 → 返回 []，记录日志，不抛出。 */
  loadAll(): HookDefinition[];

  /** 原子写入：临时文件 + fs.renameSync 覆盖。 */
  saveAll(hooks: HookDefinition[]): void;
}
```

降级语义：`loadAll()` 内部 `try/catch`，任何失败仅 `console.error` 并返回 `[]`。解析失败时不写回文件。

### Hook_Manager（`hook-manager.ts`）

```typescript
interface HookManager {
  list(): HookDefinition[];
  get(hookId: string): HookDefinition | null;
  create(input: HookInput): Result<HookDefinition>;
  update(hookId: string, input: Partial<HookInput>): Result<HookDefinition>;
  remove(hookId: string): Result<void>;
  toggle(hookId: string, enabled: boolean): Result<HookDefinition>;
}

type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: { code: HookErrorCode; message: string; field?: string } };

type HookErrorCode =
  | 'MISSING_NAME'
  | 'DUPLICATE_NAME'
  | 'NOT_FOUND'
  | 'INVALID_EVENT'
  | 'INVALID_ACTION';
```

校验规则：
- `name` trim 后非空，否则 `MISSING_NAME`
- `name` 与现有 Hook 不重复（大小写敏感、trim 后比较），否则 `DUPLICATE_NAME`
- `event` 必须在 `['prompt-submit', 'run-complete', 'run-error', 'app-start']` 中，否则 `INVALID_EVENT`
- `action` 必须在 `['send-prompt', 'run-command']` 中，否则 `INVALID_ACTION`
- `hook_id = crypto.randomUUID()`
- `created_at = updated_at = Date.now()`，更新时仅刷新 `updated_at`
- 新建时 `enabled` 默认为 `true`

### Hook_Executor（`hook-executor.ts`）

```typescript
interface HookExecutor {
  /** 触发事件，匹配并异步执行所有符合条件的 Hook */
  fire(event: HookEventPayload): void;
}

interface HookEventPayload {
  type: HookEventType;
  data?: {
    prompt?: string;      // prompt-submit 时的用户消息
    response?: string;    // run-complete 时的 AI 回复
    error?: string;       // run-error 时的错误信息
  };
}

type HookEventType = 'prompt-submit' | 'run-complete' | 'run-error' | 'app-start';
```

执行逻辑：
1. `fire(event)` → 从 Hook_Manager 获取全部 Hook
2. 筛选：`hook.enabled === true && hook.event === event.type`
3. 对有 `eventConfig.pattern` 的 Hook，额外检查事件载荷是否匹配（正则匹配 prompt 文本）
4. 对匹配的 Hook 异步执行动作：
   - `send-prompt`：将 `actionConfig.prompt` 推入 `heartbeatQueue`（复用现有机制），经 `drainHeartbeatQueue()` 串行发送
   - `run-command`：`child_process.exec(actionConfig.command, { timeout: 30000 })`，stdout/stderr 写入 console.log
5. 所有执行包裹 `try/catch`，异常仅 console.error，不向上抛出

### Hook_Registry_API

在 `agui-server.ts` 路由中新增：

| Method | Path | Handler | 成功码 | 错误码 |
|--------|------|---------|--------|--------|
| GET | `/hooks` | list | 200 `{hooks}` | - |
| GET | `/hooks/{id}` | get | 200 `{hook}` | 404 |
| POST | `/hooks` | create | 201 `{hook}` | 400/409 |
| PUT | `/hooks/{id}` | update | 200 `{hook}` | 400/404/409 |
| DELETE | `/hooks/{id}` | remove | 200 `{status:'ok'}` | 404 |
| PATCH | `/hooks/{id}/toggle` | toggle | 200 `{hook}` | 404 |

统一错误体：`{ error: { code, message, field? } }`

### 前端 HookManager_UI

参考 `HeartbeatManager.tsx` 的模态面板模式：

- 列表视图：展示 name、event 类型 badge、action 类型 badge、enabled 开关、编辑/删除按钮
- 创建/编辑表单：
  - name（必填文本输入）
  - description（可选文本输入）
  - event（下拉选择：prompt-submit / run-complete / run-error / app-start）
  - eventConfig.pattern（可选文本输入，仅 prompt-submit 时显示）
  - action（下拉选择：send-prompt / run-command）
  - actionConfig.prompt（文本域，仅 send-prompt 时显示）
  - actionConfig.command（文本输入，仅 run-command 时显示）
- 删除确认 dialog
- 错误/成功消息提示

### chat-store 扩展

```typescript
// 新增字段
hooks: HookDefinition[];

// 新增 actions
loadHooks(): Promise<void>;
createHook(input: HookInput): Promise<Result<HookDefinition>>;
updateHook(hookId: string, input: Partial<HookInput>): Promise<Result<HookDefinition>>;
removeHook(hookId: string): Promise<Result<void>>;
toggleHook(hookId: string, enabled: boolean): Promise<Result<HookDefinition>>;
```

### installer 集成

在 `installer/main.js` 的 `startBackend()` 之前，调用 `setupHooksTemplate()`：

```javascript
function setupHooksTemplate() {
  const templateSrc = path.join(APP_DIR, 'hooks.template.json');
  const targetPath = path.join(USER_DATA, '.claw', 'hooks.json');
  if (!fs.existsSync(templateSrc)) { log('No hooks template found, skipping'); return; }
  if (fs.existsSync(targetPath)) { log('hooks.json already exists, skipping template copy'); return; }
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(templateSrc, targetPath);
  log('Hooks template copied to ' + targetPath);
}
```

## Data Model

### hooks.json 顶层结构

```json
{
  "version": 1,
  "hooks": [
    {
      "id": "uuid-v4",
      "name": "AI 回复后自动检查",
      "description": "每次 AI 回复完成后检查系统状态",
      "event": "run-complete",
      "eventConfig": {},
      "action": "send-prompt",
      "actionConfig": {
        "prompt": "检查一下系统当前状态"
      },
      "enabled": true,
      "createdAt": 1700000000000,
      "updatedAt": 1700000000000
    }
  ]
}
```

### TypeScript 类型定义

```typescript
type HookEventType = 'prompt-submit' | 'run-complete' | 'run-error' | 'app-start';
type HookActionType = 'send-prompt' | 'run-command';

interface HookDefinition {
  id: string;
  name: string;
  description?: string;
  event: HookEventType;
  eventConfig: {
    pattern?: string;  // 正则字符串，用于 prompt-submit 按关键词过滤
  };
  action: HookActionType;
  actionConfig: {
    prompt?: string;   // send-prompt 时的内容
    command?: string;  // run-command 时的 shell 命令
  };
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

interface HookInput {
  name: string;
  description?: string;
  event: HookEventType;
  eventConfig?: { pattern?: string };
  action: HookActionType;
  actionConfig: { prompt?: string; command?: string };
  enabled?: boolean;
}
```

## Integration Points

### handleAgentRun 中的事件触发点

```typescript
// 在 tcpBridge.sendPrompt() 前触发 prompt-submit
hookExecutor.fire({ type: 'prompt-submit', data: { prompt: userMessage } });

// 在 done 事件处理末尾触发 run-complete
hookExecutor.fire({ type: 'run-complete', data: { response: accumulatedText } });

// 在 error 事件处理分支触发 run-error
hookExecutor.fire({ type: 'run-error', data: { error: errorText } });
```

### 应用启动时

```typescript
// 在 TCP 连接建立后触发 app-start
hookExecutor.fire({ type: 'app-start' });
```

## Error Handling

| 场景 | 处理策略 |
|------|---------|
| hooks.json 不存在/损坏 | loadAll() 返回 []，console.error，不影响启动 |
| Hook 动作执行超时（30s） | 终止子进程，console.error，不影响主流程 |
| send-prompt 时 TCP 未连接 | 跳过（复用 heartbeat 队列的连接检查） |
| run-command 进程崩溃 | 捕获异常，console.error，不抛出 |
| API 请求体 JSON 解析失败 | 返回 400 + 错误信息 |

## Correctness Properties

### 属性 1: Hook 持久化 round-trip
对任意 HookDefinition 列表，saveAll 后由新实例 loadAll 取回，逐字段相等。
**验证需求：8.1, 8.3**

### 属性 2: 特殊字符序列化安全
含双引号、反斜杠、换行、Unicode 的 name/description/actionConfig，round-trip 保持不变。
**验证需求：8.3**

### 属性 3: 缺失 name 被拒绝
create 时 name 为空/纯空白，返回 MISSING_NAME 错误。
**验证需求：1.4**

### 属性 4: name 唯一性
任意两次 create 使用相同 name，第二次返回 DUPLICATE_NAME。
**验证需求：1.5**

### 属性 5: 创建不变量
创建后 hook_id 唯一且 createdAt === updatedAt。
**验证需求：1.2, 1.3**

### 属性 6: 更新不变量
更新后 hook_id 不变、updatedAt >= 更新前值。
**验证需求：3.1, 3.2**

### 属性 7: 删除移除
删除后 list() 不再包含该 hook_id。
**验证需求：3.3**

### 属性 8: 不存在 id 错误条件
对不存在的 hook_id 执行 get/update/remove，返回 NOT_FOUND 且 store 不变。
**验证需求：2.5, 3.4**

### 属性 9: 事件匹配正确性
Hook_Executor.fire(event) 只执行 event type 匹配且 enabled 的 Hook。
**验证需求：5.2, 5.3, 5.4, 5.5, 4.2**

### 属性 10: disabled Hook 不执行
enabled === false 的 Hook 在任何事件触发时不执行动作。
**验证需求：4.2**

### 属性 11: 文件降级不影响启动
hooks.json 为非法 JSON 时 loadAll() 返回 [] 且不抛出异常。
**验证需求：7.4**

### 属性 12: 模板拷贝幂等
setupHooksTemplate() 在目标已存在时不覆盖。
**验证需求：9.3**
