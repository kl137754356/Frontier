# Implementation Plan: 自定义 Agent 管理（Phase 1）

## Overview

按设计文档增量叠加“自定义 Agent”能力，全程不改动现有 `/agent` 主链路与 AG-UI SSE 事件协议、不破坏登录/TCP 连接流程。实现顺序为：先落地后端纯数据层与类型（Agent_Store），再到业务层（Agent_Manager）与纯函数运行规划（Agent_Resolver），随后接入 `/agents` REST 端点与 `handleAgentRun` 的 `agentId` 注入，再扩展前端（chat-store、agui-client、Selector/Editor），最后完成 installer 模板拷贝与打包。每个任务都可独立编译/验证，并最终接线为完整链路。

实现语言：**TypeScript**（后端 Node + 前端 React，与现有代码一致）；installer 为 Node/CommonJS（`installer/main.js`、`make-installer.js`）。

属性测试统一使用 **fast-check + Vitest**，单属性单测、`numRuns ≥ 100`，每个测试以注释标注 `Feature: custom-agent-management, Property {number}: {property_text}`。标记 `*` 的子任务为可选测试任务，可跳过以加速 MVP。

## Tasks

- [x] 1. 定义共享类型与目录路径
  - 在 `claw-web-chat/backend/src` 新增 `agent-types.ts`，定义 `AgentDefinition`、`AgentInput`、`Result<T>`、`AgentErrorCode`（`MISSING_NAME` / `DUPLICATE_NAME` / `NOT_FOUND` / `INVALID_MCP`）、`AgentRunPlan`、`agents.json` 顶层结构（`version` / `agents` / `highRiskMcpServers`）
  - 复用与 `SKILLS_DIR` 一致的路径解析方式，导出 `AGENTS_JSON_PATH`（`CLAW_WORKSPACE ? join(CLAW_WORKSPACE,'.claw','agents.json') : join(process.cwd(),'.claw','agents.json')`）
  - 仅类型与常量，不含运行时逻辑，确保 `getDiagnostics` 无错误
  - _Requirements: 1.6, 7.1_

- [x] 2. 实现 Agent_Store 纯数据层
  - [x] 2.1 实现 `agent-store.ts` 的 `loadAll` / `saveAll`
    - `loadAll`：`try/catch` 包裹 `readFileSync` + `JSON.parse`；文件不存在或解析失败时 `console.error` 并返回 `[]`，不抛出、解析失败时不写回原文件
    - `saveAll`：`JSON.stringify` 序列化（自动 JSON 转义 name/description/extra_instructions），先写临时文件 `agents.json.tmp` 再 `fs.renameSync` 原子覆盖；写入前 `mkdirSync(recursive)` 保证 `.claw` 目录存在
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 9.5, 6.4_

  - [x]* 2.2 编写 Agent_Store round-trip 属性测试
    - **Property 1: Agent 持久化 round-trip**
    - **Validates: Requirements 1.1, 1.6, 2.1, 2.4, 7.1, 7.2, 7.3**
    - 在 `os.tmpdir()` 下创建隔离目录承载 agents.json，saveAll 后由新实例 loadAll 取回并逐字段比较

  - [x]* 2.3 编写特殊字符序列化转义属性测试
    - **Property 2: 特殊字符序列化转义安全**
    - **Validates: Requirements 9.5**
    - 生成含双引号、反斜杠、换行、制表符、非 ASCII Unicode 的字符串作为 name/description/extra_instructions，校验 round-trip 相等且文件为合法 JSON

  - [x]* 2.4 编写读取/解析失败降级属性测试
    - **Property 16: 读取/解析失败降级且不覆盖原文件**
    - **Validates: Requirements 6.4, 7.4**
    - 用损坏内容生成器写入非法 JSON 字节，校验 loadAll 返回 `[]` 不抛出，且原文件字节在下一次成功 saveAll 前保持不变

  - [x]* 2.5 编写写入完整性（原子写）属性测试
    - **Property 18: 写入完整性（原子写）**
    - **Validates: Requirements 7.5**
    - 对任意 AgentDefinition 集合序列依次 saveAll，校验任意时刻读取 agents.json 均为合法可解析 JSON

- [x] 3. 实现 Agent_Manager 业务层
  - [x] 3.1 实现 `agent-manager.ts` 的 CRUD 与校验
    - `list` / `get(id)`（不存在返回 null）；`create`（name trim 非空校验 → `MISSING_NAME`；name 查重 → `DUPLICATE_NAME`；`crypto.randomUUID()` 生成 agent_id；`created_at = updated_at = Date.now()`）
    - `update`（按 id 查找不存在 → `NOT_FOUND` 且不改 Store；保留 agent_id 与 created_at，刷新 updated_at；改名查重排除自身）；`remove`（不存在 → `NOT_FOUND`；存在则移除并 saveAll）
    - MCP 登记校验：`create`/`update` 校验 `enabled_mcp_servers` 每项都在 `settings.json` 的 `mcpServers` key 集合中，存在未登记项 → `INVALID_MCP`；高风险 MCP 只要已登记即允许
    - 通过依赖注入接收 Agent_Store 与“已登记 mcpServers 读取函数”，便于测试
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.4, 2.5, 3.1, 3.2, 3.3, 3.5, 9.1, 9.2_

  - [x]* 3.2 编写缺失 name 拒绝属性测试
    - **Property 3: 缺失 name 被拒绝**
    - **Validates: Requirements 1.4**

  - [x]* 3.3 编写 name 唯一性属性测试
    - **Property 4: name 唯一性**
    - **Validates: Requirements 1.5, 3.1**

  - [x]* 3.4 编写创建不变量属性测试
    - **Property 5: 创建不变量（唯一 id 与时间戳）**
    - **Validates: Requirements 1.2, 1.3**

  - [x]* 3.5 编写更新不变量属性测试
    - **Property 6: 更新不变量（id 不变、时间戳前进）**
    - **Validates: Requirements 3.1, 3.2**

  - [x]* 3.6 编写删除移除属性测试
    - **Property 7: 删除移除**
    - **Validates: Requirements 3.3**

  - [x]* 3.7 编写不存在 id 错误条件属性测试
    - **Property 8: 不存在 id 的错误条件与不变量**
    - **Validates: Requirements 2.5, 3.5**

  - [x]* 3.8 编写 MCP 登记边界属性测试
    - **Property 20: MCP 登记边界（当且仅当全部已登记才允许）**
    - **Validates: Requirements 9.1, 9.2**

- [x] 4. Checkpoint - 数据层与业务层验证
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. 实现 Agent_Resolver 纯函数运行规划
  - [x] 5.1 实现 `agent-resolver.ts` 的 `planAgentRun`
    - 签名 `planAgentRun(agent: AgentDefinition | null, basePromptContent, availableSkills, registeredMcpServers): AgentRunPlan`
    - `agent` 为 null：prompt 等于基线 basePrompt、skillsToLoad/mcpServersToEnable 不施加过滤、modelOverride 为 null（Default_Behavior 等价）
    - `agent` 非空：按固定顺序拼装 prompt（系统级安全指令块在前 → “用户级 Agent 附加指令”包裹的 extra_instructions → skill 上下文 + 用户消息）；`skillsToLoad = enabled_skills ∩ availableSkills`；`mcpServersToEnable = enabled_mcp_servers ∩ registeredMcpServers`；`modelOverride = agent.model || null`；缺失 skill/mcp 项跳过并写入 `warnings`
    - 纯函数，无副作用、不触碰 TCP/SSE/文件
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.5, 9.4_

  - [x]* 5.2 编写 extra_instructions 用户级注入属性测试
    - **Property 11: extra_instructions 作为用户级注入且系统指令优先**
    - **Validates: Requirements 5.1, 9.4**

  - [x]* 5.3 编写仅加载启用 skills 属性测试
    - **Property 12: 仅加载启用的 skills**
    - **Validates: Requirements 5.2**

  - [x]* 5.4 编写仅启用登记且选中 MCP 属性测试
    - **Property 13: 仅启用登记且选中的 MCP**
    - **Validates: Requirements 5.3**

  - [x]* 5.5 编写模型覆盖选择属性测试
    - **Property 14: 模型覆盖选择**
    - **Validates: Requirements 5.4, 5.5**

  - [x]* 5.6 编写无 Active_Agent 等价 Default_Behavior 属性测试
    - **Property 15: 无 Active_Agent 等价于 Default_Behavior**
    - **Validates: Requirements 6.1, 6.2**

  - [x]* 5.7 编写缺失引用跳过并告警属性测试
    - **Property 17: 缺失引用跳过并告警**
    - **Validates: Requirements 6.5**

- [x] 6. Checkpoint - 运行规划纯函数验证
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. 接入 Agent_Registry_API（`/agents` 端点族）
  - [x] 7.1 在 `agui-server.ts` 新增 `handleAgents(req, res)` 并挂载路由
    - 在现有 `if/else` 路由链中将 `/agents` 与 `/agents/{id}` 分发到 `handleAgents`，按 method（GET/POST/PUT/DELETE）调用 Agent_Manager
    - 状态码与错误体映射：GET list → `200 {agents}`；GET by id → `200 {agent}` / `404`；POST → `201 {agent}` / `400 MISSING_NAME` / `409 DUPLICATE_NAME` / `400 INVALID_MCP`；PUT → `200` / `404` / `409` / `400`；DELETE → `200 {status:'ok'}` / `404`；统一错误体 `{ error: { code, message, field? } }`
    - 所有响应调用 `setCorsHeaders(res)`；端点不依赖 TCP 连接（纯文件操作），纳入既有顶层 try/catch 兜底返回 500
    - 不改动任何现有端点的请求/响应协议
    - _Requirements: 2.1, 2.4, 2.5, 1.1, 1.4, 1.5, 3.1, 3.3, 3.5, 9.1, 6.2_

  - [x]* 7.2 编写 `handleAgents` 集成单元测试
    - 各 method 的状态码与统一错误体映射；agents.json 缺失/损坏时端点降级冒烟测试
    - _Requirements: 2.1, 2.5, 6.4_

- [x] 8. 接入 Agent_Run_Pipeline（`handleAgentRun` 的 agentId 注入）
  - [x] 8.1 在 `handleAgentRun` 中解析可选 `agentId` 并调用 Agent_Resolver
    - 请求体解构新增可选 `agentId`；为空 → 走 `resolveSkill` 的 Default_Behavior；非空 → `agentManager.get(agentId)`，取不到（已删除）记录警告并回退 Default_Behavior，取到则用可用 skills 与已登记 mcpServers 调用 `planAgentRun`
    - 用 `planAgentRun` 产出的 prompt 经现有 `tcpBridge.sendPrompt()` 发送，AG-UI SSE 事件协议不变
    - warnings 可选透出为既有 `CUSTOM` 事件（不新增事件类型）
    - _Requirements: 5.1, 5.2, 5.6, 6.1, 6.2, 6.3, 6.5_

  - [x] 8.2 实现 MCP/模型按需重连机制
    - 维护进程级 `currentRunContext` 指纹 `{ model, enabledMcpServers }`；发送 prompt 前与目标 Plan 比较：一致直接 `sendPrompt`；不一致先写出仅含 `mcpServersToEnable` 子集的派生 settings（原子写到 claw-code 工作区 settings.json），再以 `modelOverride` 复用 `clawProcess.stop()/start()` + `tcpBridge` 重连，重连成功后 `sendPrompt`
    - 切回 Default_Behavior 时同样按指纹判断是否恢复完整 settings 与 profile 默认模型；重连失败复用现有 `/config` 失败处理路径（重试一次，仍失败返回 `RUN_ERROR`）
    - _Requirements: 5.3, 5.4, 5.5, 6.3_

  - [x]* 8.3 编写 handleAgentRun 路径集成单元测试
    - 带/不带 agentId 分别走过滤路径与 Default_Behavior 路径；MCP 指纹一致不触发重连、不一致触发重连的判定
    - _Requirements: 6.1, 5.3_

- [x] 9. Checkpoint - 后端端到端接线验证
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. 扩展前端 chat-store 与 agui-client
  - [x] 10.1 扩展 chat-store
    - `Session` 增加可选字段 `activeAgentId?: string | null`（向后兼容 persist）；新增 actions `setActiveAgent(sessionId, agentId)` / `clearActiveAgent`；新增非持久化 `agents: AgentDefinition[]` 缓存与 `refreshAgents()`
    - 删除 Agent 后清空所有指向该 agent 的会话 `activeAgentId`（会话回退逻辑）
    - _Requirements: 4.1, 4.3, 4.4, 3.4_

  - [x] 10.2 扩展 `agui-client.ts`
    - 新增 `listAgents/getAgent/createAgent/updateAgent/deleteAgent`；`sendPrompt(text, sessionId, agentId?)` 从当前 `Session.activeAgentId` 读取并附加到 `/agent` 请求体，为空则不附加（向后兼容）
    - _Requirements: 2.1, 2.4, 1.1, 3.1, 3.3, 4.1, 5.6, 6.2_

  - [ ]* 10.3 编写选择一致性与会话隔离属性测试
    - **Property 9: 当前 Agent 选择一致性与会话隔离**
    - **Validates: Requirements 4.1, 4.3, 4.4**

  - [ ]* 10.4 编写删除当前 Agent 触发会话回退属性测试
    - **Property 10: 删除当前 Agent 触发会话回退**
    - **Validates: Requirements 3.4**

- [x] 11. 实现前端 Agent_Selector_UI 与 Agent_Editor_UI
  - [x] 11.1 实现 `components/AgentSelector.tsx`
    - 列出每个 Agent 的 name + description；高亮并显示当前 `activeAgentId` 对应 name；提供“清除选择 → Default_Behavior”入口；列表为空显示空状态提示 + “创建 Agent”按钮；放置在 `ConfigPanel` 附近
    - _Requirements: 2.2, 2.3, 4.2, 4.3_

  - [x] 11.2 实现 `components/AgentEditor.tsx`
    - 表单字段对应 `AgentInput`；`enabled_skills` 从后端可用 skills 多选；`enabled_mcp_servers` 从已登记 mcpServers 多选；对 `highRiskMcpServers` 中的 MCP 显示醒目风险标识（图标/颜色/提示文案），可勾选启用但不阻止；接线 create/update/delete 到 agui-client，删除成功后回退相关会话 activeAgentId
    - _Requirements: 1.1, 1.4, 1.6, 3.1, 3.3, 9.3_

  - [ ]* 11.3 编写 Selector/Editor 渲染单元测试
    - Selector 渲染 name/description（R2.2）、空列表提示与创建入口（R2.3）、存在 Active_Agent 显示其 name（R4.2）；Editor 对高风险 MCP 渲染风险标识且仍可勾选（R9.3）
    - _Requirements: 2.2, 2.3, 4.2, 9.3_

- [x] 12. Checkpoint - 前端集成验证
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. 实现 installer 模板拷贝与打包
  - [x] 13.1 新增 `installer/agents.template.json` 并在 `main.js` 实现 `setupAgentsTemplate`
    - 模板含 `version`、示例 `agents`、`highRiskMcpServers`（如 `["pcdmis"]`）；`setupAgentsTemplate()` 在 `setupSkills`/settings 合并附近调用：无模板源跳过；目标 `.claw/agents.json` 已存在不覆盖；不存在则 `copyFileSync` 拷贝并 log
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 13.2 在 `make-installer.js` 拷贝模板进 release
    - 将 `installer/agents.template.json` 拷入 release 目录（与 `frontier-settings.json` 同级）
    - _Requirements: 8.1_

  - [ ]* 13.3 编写模板拷贝幂等属性测试
    - **Property 19: 模板拷贝幂等且不覆盖**
    - **Validates: Requirements 8.2, 8.3**

  - [ ]* 13.4 编写 release 产物包含模板的构建期单元测试
    - 校验 release 产物包含 `agents.template.json`
    - _Requirements: 8.1_

- [x] 14. Final Checkpoint - 全链路验证
  - Ensure all tests pass, ask the user if questions arise.
  - 确认未选择 Agent 时 Default_Behavior 与功能引入前一致；`/agent` 协议、登录与 TCP 连接流程未变

## Notes

- 标记 `*` 的子任务为可选测试任务，可跳过以加速 MVP；顶层任务不标记 `*`。
- 每个任务回链对应 Requirements 条款；PBT 任务显式引用设计文档中的 Property 编号。
- 属性测试与对应模块绑定：Agent_Store → P1/P2/P16/P18；Agent_Manager → P3/P4/P5/P6/P7/P8/P20；Agent_Resolver → P11/P12/P13/P14/P15/P17；chat-store → P9/P10；installer setupAgentsTemplate → P19。
- Checkpoint 用于增量验证，确保不破坏现有 `/agent` 主链路与 AG-UI SSE 事件协议。
- 本工作流仅产出 design/planning 制品。**本规格不实现 Phase 2（A2A 协议）**；设计中的 A2A 扩展点仅为字段/接口预留，不在本任务清单内产出实现任务。
```
