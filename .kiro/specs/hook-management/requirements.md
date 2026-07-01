# Requirements Document

## Introduction

为 Frontier 桌面应用增加"Hook 管理"能力——即基于事件的自动化触发器系统。用户可以创建、编辑、删除、启用/禁用 Hook，当指定事件发生时自动执行预配置的动作（发送 prompt 给 AI 或执行 shell 命令）。

当前 Frontier 已有"心跳任务"（Heartbeat）机制——基于固定时间间隔的定时任务。但心跳任务只能按时间触发，无法响应其他类型的事件（如用户发送消息前/后、AI 回复完成后、应用启动时等）。

Hook 系统将事件驱动的自动化能力显式化为可管理的配置实体，持久化在后端 `.claw` 目录（`hooks.json`），并通过前端 UI 提供完整的 CRUD 管理界面。整个功能必须在不破坏现有 `/agent` 主链路、心跳任务、登录/连接流程和其他现有功能的前提下实现。

## Glossary

- **Hook_Definition**: 用户自定义的 Hook 配置实体，包含 hook_id、name、description、event（触发事件类型）、eventConfig（事件配置）、action（动作类型）、actionConfig（动作配置）、enabled、created_at、updated_at 等字段
- **Hook_Store**: 负责在后端 `.claw` 目录读写 `hooks.json` 的持久化模块
- **Hook_Manager**: 后端中提供 Hook 创建/读取/更新/删除（CRUD）业务逻辑的模块
- **Hook_Registry_API**: 后端暴露给前端的 Hook 管理 HTTP 接口集合
- **Hook_Executor**: 负责在事件发生时匹配并执行对应 Hook 的引擎模块
- **Hook_Event**: Hook 可监听的事件类型枚举
- **Hook_Action**: Hook 触发后可执行的动作类型枚举
- **HookManager_UI**: 前端用于展示 Hook 列表并允许用户创建/编辑/删除/启用禁用 Hook 的界面组件
- **Agent_Run_Pipeline**: 后端处理对话的核心链路：前端 POST `/agent` → resolveSkill() → tcpBridge.sendPrompt() → claw-code → AG-UI SSE 事件回前端

## Requirements

### Requirement 1: 创建 Hook

**User Story:** 作为 Frontier 用户，我希望创建自动化 Hook，以便在特定事件发生时自动执行预设动作。

#### Acceptance Criteria

1. WHEN 用户在 HookManager_UI 提交一个新 Hook 的有效配置，THE Hook_Manager SHALL 创建一条 Hook_Definition 并通过 Hook_Store 持久化到 `hooks.json`
2. THE Hook_Manager SHALL 为每条新建的 Hook_Definition 分配全局唯一的 hook_id
3. THE Hook_Manager SHALL 在创建时记录 created_at 与 updated_at 时间戳
4. WHEN 用户提交的 Hook 配置缺少必填字段 name，THE Hook_Manager SHALL 拒绝创建并返回标识缺失字段的错误信息
5. IF 提交的 name 与已存在的 Hook_Definition 的 name 重复，THEN THE Hook_Manager SHALL 拒绝创建并返回名称重复的错误信息
6. WHEN 用户提交的 event 类型不在支持的枚举值内，THE Hook_Manager SHALL 拒绝创建并返回无效事件类型的错误信息
7. WHEN 用户提交的 action 类型不在支持的枚举值内，THE Hook_Manager SHALL 拒绝创建并返回无效动作类型的错误信息
8. THE Hook_Definition SHALL 支持以下可配置字段：name、description、event、eventConfig、action、actionConfig、enabled

### Requirement 2: 查看与列出 Hook

**User Story:** 作为 Frontier 用户，我希望看到所有已创建的 Hook 列表，以便了解当前自动化配置。

#### Acceptance Criteria

1. WHEN 前端请求 Hook 列表，THE Hook_Registry_API SHALL 返回 Hook_Store 中全部 Hook_Definition 的集合
2. THE HookManager_UI SHALL 展示每个 Hook_Definition 的 name、event 类型、action 类型、enabled 状态
3. WHEN Hook_Store 中不存在任何 Hook_Definition，THE HookManager_UI SHALL 显示空列表提示并提供创建入口
4. WHEN 前端按 hook_id 请求单个 Hook，THE Hook_Registry_API SHALL 返回该 hook_id 对应的完整 Hook_Definition
5. IF 请求的 hook_id 不存在，THEN THE Hook_Registry_API SHALL 返回未找到错误信息

### Requirement 3: 编辑与删除 Hook

**User Story:** 作为 Frontier 用户，我希望修改或删除已有的 Hook，以便随需求变化调整自动化配置。

#### Acceptance Criteria

1. WHEN 用户提交对某 Hook_Definition 的有效修改，THE Hook_Manager SHALL 更新该 Hook_Definition 并刷新 updated_at 时间戳
2. THE Hook_Manager SHALL 在更新时保持该 Hook_Definition 的 hook_id 不变
3. WHEN 用户请求删除某 Hook_Definition，THE Hook_Manager SHALL 从 Hook_Store 移除该 Hook_Definition
4. IF 用户请求编辑或删除的 hook_id 不存在，THEN THE Hook_Manager SHALL 返回未找到错误信息且不修改 Hook_Store

### Requirement 4: 启用与禁用 Hook

**User Story:** 作为 Frontier 用户，我希望能快速启用或禁用某个 Hook 而不删除它，以便临时控制自动化行为。

#### Acceptance Criteria

1. WHEN 用户切换某 Hook_Definition 的 enabled 状态，THE Hook_Manager SHALL 更新该状态并持久化
2. WHILE Hook_Definition.enabled === false，THE Hook_Executor SHALL 跳过该 Hook 不执行其动作
3. THE HookManager_UI SHALL 通过视觉指示（如开关控件）展示每个 Hook 的 enabled 状态
4. THE Hook_Manager SHALL 在新建 Hook 时默认 enabled = true

### Requirement 5: 事件触发与匹配

**User Story:** 作为 Frontier 用户，我希望 Hook 能准确响应我配置的事件，以便自动化按预期工作。

#### Acceptance Criteria

1. THE Hook_Executor SHALL 支持以下事件类型：`prompt-submit`（用户发送消息前）、`run-complete`（AI 回复完成后）、`run-error`（AI 回复出错时）、`app-start`（应用启动时）
2. WHEN `prompt-submit` 事件发生，THE Hook_Executor SHALL 匹配所有 event === 'prompt-submit' 且 enabled === true 的 Hook_Definition
3. WHEN `run-complete` 事件发生，THE Hook_Executor SHALL 匹配所有 event === 'run-complete' 且 enabled === true 的 Hook_Definition
4. WHEN `run-error` 事件发生，THE Hook_Executor SHALL 匹配所有 event === 'run-error' 且 enabled === true 的 Hook_Definition
5. WHEN `app-start` 事件发生，THE Hook_Executor SHALL 匹配所有 event === 'app-start' 且 enabled === true 的 Hook_Definition
6. WHERE Hook_Definition 指定了 eventConfig.pattern（正则或 glob），THE Hook_Executor SHALL 仅在事件载荷匹配 pattern 时触发（用于 prompt-submit 按关键词过滤）

### Requirement 6: 动作执行

**User Story:** 作为 Frontier 用户，我希望 Hook 触发后能执行我配置的动作。

#### Acceptance Criteria

1. THE Hook_Executor SHALL 支持以下动作类型：`send-prompt`（将指定 prompt 发送给 AI）、`run-command`（执行 shell 命令）
2. WHEN action === 'send-prompt'，THE Hook_Executor SHALL 通过现有 tcpBridge.sendPrompt() 将 actionConfig.prompt 发送给 claw-code
3. WHEN action === 'run-command'，THE Hook_Executor SHALL 通过 child_process.exec() 执行 actionConfig.command，并将 stdout/stderr 记录到日志
4. THE Hook_Executor SHALL 以异步方式执行动作，不阻塞 Agent_Run_Pipeline 的 SSE 流
5. WHEN 动作执行失败（命令超时、进程崩溃等），THE Hook_Executor SHALL 记录错误日志但不影响主流程
6. THE Hook_Executor SHALL 为 run-command 动作设置默认超时（30 秒），超时后终止子进程

### Requirement 7: 向后兼容与稳定性

**User Story:** 作为 Frontier 用户，我希望新增的 Hook 功能不影响现有功能与软件稳定性。

#### Acceptance Criteria

1. THE Hook 功能 SHALL 不改动现有 `/agent` 端点的请求/响应协议（AG-UI SSE 事件协议保持不变）
2. THE Hook 功能 SHALL 不改动现有心跳任务（Heartbeat）的功能与接口
3. THE Hook 功能 SHALL 不影响登录/TCP 连接流程
4. WHEN hooks.json 文件不存在或损坏，THE Hook_Store SHALL 降级为空列表并记录日志，不影响应用启动
5. THE Hook_Executor 的任何异常 SHALL 被捕获并记录日志，不导致应用崩溃或主流程中断

### Requirement 8: 持久化与数据完整性

**User Story:** 作为 Frontier 用户，我希望我创建的 Hook 配置不会丢失。

#### Acceptance Criteria

1. THE Hook_Store SHALL 使用原子写入（临时文件 + rename）保证 hooks.json 不因写入中断而损坏
2. THE Hook_Store SHALL 在解析失败时不覆盖原文件，保留用户原始数据直到下一次成功写入
3. THE Hook_Store SHALL 正确处理 name/description/actionConfig 中的特殊字符（双引号、反斜杠、换行、Unicode）

### Requirement 9: 安装器集成

**User Story:** 作为 Frontier 部署者，我希望安装包中包含默认 Hook 模板，便于用户开箱即用。

#### Acceptance Criteria

1. THE installer SHALL 随安装包分发 `hooks.template.json` 文件
2. WHEN 用户首次启动且 `.claw/hooks.json` 不存在，THE installer SHALL 将模板拷贝到用户 `.claw` 目录
3. WHEN `.claw/hooks.json` 已存在，THE installer SHALL 不覆盖用户现有配置

