# Implementation Plan: Hook 管理

## Overview

按设计文档增量叠加"Hook 管理"能力，全程不改动现有 `/agent` 主链路与 AG-UI SSE 事件协议、不破坏心跳任务/登录/TCP 连接流程。实现顺序：先后端数据层（Hook_Store）→ 业务层（Hook_Manager）→ 执行引擎（Hook_Executor）→ REST API → 前端（chat-store + HookManager UI）→ 集成到 handleAgentRun → installer 模板。

实现语言：TypeScript（后端 Node + 前端 React，与现有代码一致）；installer 为 Node/CommonJS。

## Tasks

- [x] 1. 定义共享类型
  - 在 `claw-web-chat/backend/src` 新增 `hook-types.ts`
  - 定义 `HookEventType`（`'prompt-submit' | 'run-complete' | 'run-error' | 'app-start'`）
  - 定义 `HookActionType`（`'send-prompt' | 'run-command'`）
  - 定义 `HookDefinition`、`HookInput`、`Result<T>`、`HookErrorCode`（`MISSING_NAME / DUPLICATE_NAME / NOT_FOUND / INVALID_EVENT / INVALID_ACTION`）
  - 定义 `HookEventPayload` 接口
  - 定义 `hooks.json` 顶层结构类型 `HooksFile`（`{ version: number; hooks: HookDefinition[] }`）
  - 导出 `HOOKS_JSON_PATH` 常量（复用 `CLAW_WORKSPACE` 环境变量路径解析）
  - 导出 `VALID_EVENTS` 与 `VALID_ACTIONS` 常量数组
  - 仅类型与常量，无运行时逻辑
  - _Requirements: 1.8, 5.1, 6.1_

- [x] 2. 实现 Hook_Store 纯数据层
  - [x] 2.1 创建 `claw-web-chat/backend/src/hook-store.ts`
    - `loadAll()`：`try/catch` 包裹 `readFileSync` + `JSON.parse`；文件不存在或解析失败时 `console.error` 并返回 `[]`，不抛出、不写回原文件
    - `saveAll(hooks)`：`JSON.stringify(hooksFile, null, 2)` 序列化，先写 `hooks.json.tmp` 再 `fs.renameSync` 原子覆盖；写入前 `mkdirSync(recursive)` 保证 `.claw` 目录存在
    - 构造函数接收可选 `filePath` 参数（便于测试），默认使用 `HOOKS_JSON_PATH`
    - _Requirements: 7.4, 8.1, 8.2, 8.3_

  - [ ]* 2.2 编写 Hook_Store 属性测试
    - **属性 1: Hook 持久化 round-trip**
    - **属性 2: 特殊字符序列化安全**
    - **属性 11: 文件降级不影响启动**
    - 测试文件：`claw-web-chat/backend/src/__tests__/hook-store.property.test.ts`
    - 在 `os.tmpdir()` 下创建隔离目录，numRuns: 100
    - _Requirements: 8.1, 8.2, 8.3, 7.4_

- [x] 3. 实现 Hook_Manager 业务层
  - [x] 3.1 创建 `claw-web-chat/backend/src/hook-manager.ts`
    - `list()`：返回 `hookStore.loadAll()`
    - `get(hookId)`：按 id 查找，不存在返回 null
    - `create(input)`：
      - name trim 非空校验 → `MISSING_NAME`
      - name 查重 → `DUPLICATE_NAME`
      - event 在 VALID_EVENTS 中 → 否则 `INVALID_EVENT`
      - action 在 VALID_ACTIONS 中 → 否则 `INVALID_ACTION`
      - 生成 `id = crypto.randomUUID()`
      - `createdAt = updatedAt = Date.now()`
      - `enabled` 默认 `true`
    - `update(hookId, input)`：
      - 按 id 查找不存在 → `NOT_FOUND`
      - 保留 id 与 createdAt，刷新 updatedAt
      - 改名时查重排除自身
      - 同样校验 event/action 合法性
    - `remove(hookId)`：不存在 → `NOT_FOUND`；存在则移除并 saveAll
    - `toggle(hookId, enabled)`：不存在 → `NOT_FOUND`；更新 enabled 字段并 saveAll
    - 通过依赖注入接收 Hook_Store 实例
    - _Requirements: 1.1-1.8, 2.1, 2.4, 2.5, 3.1-3.4, 4.1, 4.4_

  - [ ]* 3.2 编写 Hook_Manager 属性测试
    - **属性 3: 缺失 name 被拒绝**
    - **属性 4: name 唯一性**
    - **属性 5: 创建不变量（唯一 id 与时间戳）**
    - **属性 6: 更新不变量（id 不变、时间戳前进）**
    - **属性 7: 删除移除**
    - **属性 8: 不存在 id 错误条件**
    - 测试文件：`claw-web-chat/backend/src/__tests__/hook-manager.property.test.ts`
    - numRuns: 100
    - _Requirements: 1.2-1.7, 3.1-3.4, 2.5_

- [x] 4. 实现 Hook_Executor 事件引擎
  - [x] 4.1 创建 `claw-web-chat/backend/src/hook-executor.ts`
    - 构造函数接收 `HookManager` 实例与 `sendPromptFn`（类型 `(prompt: string) => void`，用于注入 heartbeat 队列）
    - `fire(event: HookEventPayload): void`
      - 从 hookManager.list() 获取全部 Hook
      - 筛选：`hook.enabled && hook.event === event.type`
      - 对有 `eventConfig.pattern` 的 Hook：用 `new RegExp(pattern)` 匹配事件载荷对应文本（prompt-submit→data.prompt，run-complete→data.response，run-error→data.error），不匹配则跳过；正则构造失败则跳过并 console.warn
      - 对匹配的 Hook 异步执行：
        - `send-prompt`：调用注入的 `sendPromptFn(actionConfig.prompt)`
        - `run-command`：`child_process.exec(actionConfig.command, { timeout: 30000 })` 回调记录 stdout/stderr
      - 所有执行包裹 `try/catch`，异常仅 console.error
    - 纯异步 fire-and-forget，`fire()` 不返回 Promise 不阻塞调用方
    - _Requirements: 5.1-5.6, 6.1-6.6, 4.2, 7.5_

  - [ ]* 4.2 编写 Hook_Executor 属性测试
    - **属性 9: 事件匹配正确性**（只执行 type 匹配且 enabled 的）
    - **属性 10: disabled Hook 不执行**
    - 测试文件：`claw-web-chat/backend/src/__tests__/hook-executor.property.test.ts`
    - mock sendPromptFn 和 child_process.exec，验证调用次数与参数
    - _Requirements: 5.2-5.5, 4.2_

- [x] 5. Checkpoint - 后端核心模块验证
  - 确保 hook-types、hook-store、hook-manager、hook-executor 编译通过且测试通过（如有）
  - getDiagnostics 检查无类型错误

- [x] 6. 接入 Hook_Registry_API
  - [x] 6.1 在 `agui-server.ts` 新增 `handleHooks(req, res)` 并挂载路由
    - 在现有 `if/else` 路由链中将 `/hooks` 前缀请求分发到 `handleHooks`
    - 支持 URL 模式：`/hooks`（列表/创建）、`/hooks/{id}`（获取/更新/删除）、`/hooks/{id}/toggle`（PATCH 切换启用）
    - 按 method 调用 Hook_Manager 的对应方法
    - 状态码映射：GET list→200；GET by id→200/404；POST→201/400/409；PUT→200/400/404/409；DELETE→200/404；PATCH toggle→200/404
    - 统一错误体 `{ error: { code, message, field? } }`
    - 所有响应调用 `setCorsHeaders(res)`
    - 不改动任何现有端点
    - _Requirements: 2.1, 2.4, 2.5, 1.1, 1.4-1.7, 3.1, 3.3, 3.4, 4.1, 7.1_

- [x] 7. 集成 Hook_Executor 到 handleAgentRun
  - [x] 7.1 在 `agui-server.ts` 模块顶层实例化 HookExecutor
    - 导入 HookStore、HookManager、HookExecutor
    - 创建实例，`sendPromptFn` 绑定到 heartbeat 队列（创建虚拟 task 推入 `heartbeatQueue` 并调用 `drainHeartbeatQueue()`）
    - _Requirements: 6.2, 6.4_

  - [x] 7.2 在 handleAgentRun 中注入事件触发点
    - `tcpBridge.sendPrompt()` 调用前：`hookExecutor.fire({ type: 'prompt-submit', data: { prompt: userMessage } })`
    - `done` 事件处理末尾：`hookExecutor.fire({ type: 'run-complete', data: { response: accumulatedText } })`
    - `error` 事件分支：`hookExecutor.fire({ type: 'run-error', data: { error: errorText } })`
    - _Requirements: 5.2, 5.3, 5.4, 7.1, 7.5_

  - [x] 7.3 在 TCP 连接成功回调中触发 app-start
    - 在 `tcpBridge` 连接成功后调用 `hookExecutor.fire({ type: 'app-start' })`
    - _Requirements: 5.5_

- [x] 8. Checkpoint - 后端集成验证
  - 确保 agui-server.ts 编译通过
  - getDiagnostics 检查无类型错误
  - 手动测试：启动后端，curl /hooks 返回 `{ hooks: [] }`

- [x] 9. 扩展前端 chat-store
  - 在 `claw-web-chat/frontend/src/store/chat-store.ts` 中新增：
    - `hooks: HookDefinition[]` 字段（非持久化，每次打开面板时 fetch）
    - `loadHooks()`：`fetch('/hooks')` 并更新 `hooks`
    - `createHook(input)`：`POST /hooks`，成功后 reload
    - `updateHook(hookId, input)`：`PUT /hooks/{id}`，成功后 reload
    - `removeHook(hookId)`：`DELETE /hooks/{id}`，成功后 reload
    - `toggleHook(hookId, enabled)`：`PATCH /hooks/{id}/toggle`，成功后 reload
  - 不影响现有 sessions/messages/config 的 persist 结构
  - _Requirements: 2.1, 1.1, 3.1, 3.3, 4.1_

- [x] 10. 实现前端 HookManager.tsx 管理面板
  - [x] 10.1 创建 `claw-web-chat/frontend/src/components/HookManager.tsx`
    - 模态面板（参考 HeartbeatManager.tsx 样式）
    - 列表视图：每个 Hook 显示 name、event badge、action badge、enabled 开关、编辑/删除按钮
    - 空列表提示："暂无 Hook。点击下方按钮创建第一个自动化 Hook"
    - "创建 Hook"按钮打开表单视图
    - _Requirements: 2.2, 2.3, 4.3_

  - [x] 10.2 实现创建/编辑表单
    - 字段：name（必填）、description、event（下拉）、eventConfig.pattern（条件显示）、action（下拉）、actionConfig.prompt / actionConfig.command（条件显示）
    - 提交后调用 createHook / updateHook
    - 显示 API 返回的错误信息
    - _Requirements: 1.1, 1.4-1.7, 3.1_

  - [x] 10.3 实现启用/禁用开关与删除确认
    - 开关切换调用 toggleHook
    - 删除前弹出 confirm dialog
    - _Requirements: 4.1, 4.3, 3.3_

- [x] 11. 在前端入口集成 HookManager 入口按钮
  - 在 `Header.tsx` 或 `ConfigPanel.tsx` 中添加"🪝 Hook 管理"按钮，点击打开 HookManager 面板
  - 参考现有"💓 心跳管理"按钮的放置方式
  - _Requirements: 2.2_

- [x] 12. Checkpoint - 前端集成验证
  - getDiagnostics 检查前端文件无类型错误
  - 确认 HookManager 面板可打开/关闭，列表渲染正确

- [x] 13. 实现 installer 集成
  - [x] 13.1 创建 `installer/hooks.template.json`
    - 包含 `version: 1` 和 1-2 个示例 Hook（如"AI 回复后自动检查系统状态"）
    - _Requirements: 9.1_

  - [x] 13.2 在 `installer/main.js` 实现 `setupHooksTemplate()`
    - 模板源：`path.join(APP_DIR, 'hooks.template.json')`
    - 目标：`path.join(USER_DATA, '.claw', 'hooks.json')`
    - 不存在模板源 → 跳过
    - 目标已存在 → 跳过（不覆盖）
    - 否则 `copyFileSync` 并 log
    - 在 `startBackend()` 前、`setupSkills()` 附近调用
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 13.3 在 `installer/scripts/make-installer.js` 中拷贝模板进 release
    - 将 `installer/hooks.template.json` 拷入 release 目录
    - _Requirements: 9.1_

- [x] 14. Final Checkpoint - 全链路验证
  - 确保后端编译通过、前端编译通过
  - 确认现有 `/agent` 链路、心跳任务、登录流程未受影响
  - Hook CRUD API 可用：curl 测试 create/list/update/toggle/delete
  - Hook 执行引擎：创建一个 run-complete + send-prompt Hook，发送消息后验证 Hook 被触发

## Notes

- 标记 `*` 的子任务为可选测试任务，可跳过以加速 MVP
- send-prompt 动作复用现有 heartbeat 队列机制，确保不与用户对话冲突
- Hook_Executor 的 fire() 是 fire-and-forget，不阻塞主 SSE 流
- hooks.json 与 agents.json 为独立文件，互不影响
- 本规格不包含 Phase 2 扩展（如文件变更监听等更复杂事件类型），这些可作为后续迭代增加
