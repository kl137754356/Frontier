# Requirements Document

## Introduction

为 Frontier 桌面应用增加“自定义 Agent 管理”能力，并为未来的 A2A（Agent2Agent）协议接入预留扩展空间。

当前 Frontier 中的“Agent”是隐式组合：系统指令（instructions.txt）+ Skill 集合（`~/.frontier-desktop/.claw/skills/`）+ MCP 服务器（settings.json 的 mcpServers）。系统没有显式的 agent 定义文件，前端也没有“创建/选择 agent”的界面。

本功能将“Agent”显式化为可创建、可编辑、可删除、可选择的配置实体，持久化在后端 `.claw` 目录（`agents.json`），并在用户选定某个 Agent 后，按该 Agent 的配置（额外指令、启用的 Skills、启用的 MCP 服务器、模型）运行对话。整个功能必须在不破坏现有 `/agent` 主链路、登录/连接流程和现有功能的前提下实现；未选择任何 Agent 时，系统回退到当前默认行为（向后兼容）。

本功能分两个阶段（Phase）交付，风险与优先级不同：

- **Phase 1（核心，本规格主体）**：自定义 Agent 的 CRUD + Agent 列表选择 + 按选中 Agent 配置运行。这是用户当前最迫切的需求，风险较低。
- **Phase 2（可选，后续阶段）**：真正的 A2A 协议接入（多 Agent 互相调用协作、Agent Card、运动前放行 token、人在回路确认等）。本文档将其作为未来扩展需求列出并明确标注为后续阶段，不在 Phase 1 实现。

## Glossary

- **Frontier**: 本桌面应用整体，由 Electron/Node 启动器（installer/main.js）+ Node 后端（agui-server）+ React 前端组成
- **Agent_Definition**: 用户自定义的 Agent 配置实体，包含 agent_id、name、description、extra_instructions、enabled_skills、enabled_mcp_servers、model、created_at、updated_at 等字段
- **Agent_Store**: 负责在后端 `.claw` 目录读写 `agents.json` 的持久化模块
- **Agent_Manager**: 后端中提供 Agent 创建/读取/更新/删除（CRUD）业务逻辑的模块
- **Agent_Registry_API**: 后端暴露给前端的 Agent 管理 HTTP 接口集合
- **Agent_Selector_UI**: 前端用于展示 Agent 列表并允许用户选择当前 Agent 的界面组件
- **Agent_Editor_UI**: 前端用于创建/编辑/删除 Agent_Definition 的界面组件
- **Active_Agent**: 当前会话所选中的 Agent_Definition；可能为空（未选择）
- **Default_Behavior**: 未选择任何 Agent 时系统当前的运行方式（使用现有 instructions.txt + 全部可用 skills + settings.json 的 mcpServers + 默认模型）
- **Agent_Run_Pipeline**: 后端处理对话的核心链路：前端 POST `/agent` → resolveSkill() 加载技能 → tcpBridge.sendPrompt() 经 TCP 给 claw-code → claw-code 处理后回流 → agui-server 转 AG-UI SSE 事件回前端
- **Skill**: 位于 `~/.frontier-desktop/.claw/skills/` 下的技能定义
- **MCP_Server**: settings.json 的 mcpServers 中配置的 Model Context Protocol 服务器
- **Agents_Template**: 随安装包分发的默认 `agents.json` 模板，首次启动时拷贝到用户 `.claw` 目录
- **A2A_Protocol**: Agent2Agent 协议，用于多 Agent 之间的发现与协作（Phase 2）
- **Agent_Card**: A2A 协议中描述某 Agent 能力与端点的元数据（Phase 2）
- **Clearance_Token**: A2A 场景中，执行高风险操作（如驱动 PC-DMIS 真实 CMM 硬件运动）前必须获得的一次性放行凭证（Phase 2）

## Requirements

### Requirement 1: 创建自定义 Agent

**User Story:** 作为 Frontier 用户，我希望创建自己的自定义 Agent，以便用一套固定的指令、技能与工具组合来完成特定任务。

#### Acceptance Criteria

1. WHEN 用户在 Agent_Editor_UI 提交一个新 Agent 的有效配置，THE Agent_Manager SHALL 创建一条 Agent_Definition 并通过 Agent_Store 持久化到 `agents.json`
2. THE Agent_Manager SHALL 为每条新建的 Agent_Definition 分配全局唯一的 agent_id
3. THE Agent_Manager SHALL 在创建时记录 created_at 与 updated_at 时间戳
4. WHEN 用户提交的 Agent 配置缺少必填字段 name，THE Agent_Manager SHALL 拒绝创建并返回标识缺失字段的错误信息
5. IF 提交的 name 与已存在的 Agent_Definition 的 name 重复，THEN THE Agent_Manager SHALL 拒绝创建并返回名称重复的错误信息
6. THE Agent_Definition SHALL 支持以下可配置字段：name、description、extra_instructions、enabled_skills、enabled_mcp_servers、model

### Requirement 2: 查看与列出 Agent

**User Story:** 作为 Frontier 用户，我希望看到一个可用 Agent 的列表，以便从中选择我要使用的 Agent。

#### Acceptance Criteria

1. WHEN 前端请求 Agent 列表，THE Agent_Registry_API SHALL 返回 Agent_Store 中全部 Agent_Definition 的集合
2. THE Agent_Selector_UI SHALL 展示每个 Agent_Definition 的 name 与 description
3. WHEN Agent_Store 中不存在任何 Agent_Definition，THE Agent_Selector_UI SHALL 显示空列表提示并提供创建入口
4. WHEN 前端按 agent_id 请求单个 Agent，THE Agent_Registry_API SHALL 返回该 agent_id 对应的完整 Agent_Definition
5. IF 请求的 agent_id 不存在，THEN THE Agent_Registry_API SHALL 返回未找到错误信息

### Requirement 3: 编辑与删除 Agent

**User Story:** 作为 Frontier 用户，我希望修改或删除已有的自定义 Agent，以便随需求变化调整我的 Agent。

#### Acceptance Criteria

1. WHEN 用户提交对某 Agent_Definition 的有效修改，THE Agent_Manager SHALL 更新该 Agent_Definition 并刷新 updated_at 时间戳
2. THE Agent_Manager SHALL 在更新时保持该 Agent_Definition 的 agent_id 不变
3. WHEN 用户请求删除某 Agent_Definition，THE Agent_Manager SHALL 从 Agent_Store 移除该 Agent_Definition
4. IF 被删除的 Agent_Definition 为当前会话的 Active_Agent，THEN THE Frontier SHALL 将该会话回退到 Default_Behavior
5. IF 用户请求编辑或删除的 agent_id 不存在，THEN THE Agent_Manager SHALL 返回未找到错误信息且不修改 Agent_Store

### Requirement 4: 选择当前 Agent

**User Story:** 作为 Frontier 用户，我希望在界面上选择一个 Agent 作为当前会话使用的 Agent，以便对话按该 Agent 的配置运行。

#### Acceptance Criteria

1. WHEN 用户在 Agent_Selector_UI 选中一个 Agent_Definition，THE Frontier SHALL 将该 Agent_Definition 设为当前会话的 Active_Agent
2. WHILE 存在 Active_Agent，THE Agent_Selector_UI SHALL 显示当前选中的 Agent name
3. WHEN 用户清除当前选择，THE Frontier SHALL 将会话回退到 Default_Behavior
4. THE Frontier SHALL 将 Active_Agent 的选择按会话（session）维度保存，使不同会话可使用不同 Active_Agent

### Requirement 5: 按选中 Agent 配置运行对话

**User Story:** 作为 Frontier 用户，我希望选中 Agent 后对话能按该 Agent 的指令、技能、工具与模型运行，以便获得该 Agent 专属的行为。

#### Acceptance Criteria

1. WHILE 存在 Active_Agent，WHEN 用户发送一条消息，THE Agent_Run_Pipeline SHALL 将 Active_Agent 的 extra_instructions 合并进发送给 claw-code 的系统指令
2. WHILE 存在 Active_Agent，THE Agent_Run_Pipeline SHALL 仅加载 Active_Agent 的 enabled_skills 所列出的 Skill
3. WHILE 存在 Active_Agent，THE Agent_Run_Pipeline SHALL 仅启用 Active_Agent 的 enabled_mcp_servers 所列出的 MCP_Server
4. WHERE Active_Agent 指定了 model，THE Agent_Run_Pipeline SHALL 使用该 model 运行本次对话
5. WHERE Active_Agent 未指定 model，THE Agent_Run_Pipeline SHALL 使用当前 profile 的默认模型
6. THE Agent_Run_Pipeline SHALL 通过现有的 tcpBridge.sendPrompt() 与 AG-UI SSE 回流机制返回结果，不改变现有事件协议

### Requirement 6: 向后兼容与稳定性

**User Story:** 作为 Frontier 用户，我希望新增的 Agent 功能不影响现有功能与软件稳定性，以便我可以照常使用应用。

#### Acceptance Criteria

1. WHILE 不存在 Active_Agent，THE Frontier SHALL 按 Default_Behavior 运行，与本功能引入前的行为保持一致
2. THE Frontier SHALL 保持现有 `/agent` 接口的请求与响应协议向后兼容
3. THE Frontier SHALL 保持现有登录流程与 TCP 连接流程不变
4. IF Agent_Store 读取 `agents.json` 失败，THEN THE Frontier SHALL 记录错误日志并以空 Agent 列表继续运行，且不阻断 Default_Behavior 下的对话
5. IF Active_Agent 引用了已不存在的 Skill 或 MCP_Server，THEN THE Agent_Run_Pipeline SHALL 跳过缺失项、记录警告日志并继续运行本次对话

### Requirement 7: Agent 定义持久化

**User Story:** 作为 Frontier 用户，我希望我创建的 Agent 在重启应用后依然存在，以便长期复用我的配置。

#### Acceptance Criteria

1. THE Agent_Store SHALL 将所有 Agent_Definition 持久化到后端 `.claw` 目录下的 `agents.json` 文件
2. WHEN `agents.json` 文件不存在，THE Agent_Store SHALL 在首次写入前创建该文件
3. WHEN Frontier 重启后请求 Agent 列表，THE Agent_Store SHALL 返回重启前已持久化的全部 Agent_Definition
4. IF `agents.json` 内容无法解析为有效 JSON，THEN THE Agent_Store SHALL 记录错误日志并将其视为空 Agent 列表，且不覆盖原文件直到下一次成功写入
5. WHEN Agent_Store 写入 `agents.json`，THE Agent_Store SHALL 以原子方式写入，避免并发写入导致文件损坏

### Requirement 8: 打包与首次启动模板

**User Story:** 作为 Frontier 用户，我希望首次安装启动后就有一套可用的默认 Agent，以便立即体验功能。

#### Acceptance Criteria

1. THE Frontier 安装包 SHALL 包含一份 Agents_Template（默认 `agents.json` 模板）
2. WHEN Frontier 首次启动且用户 `.claw` 目录中不存在 `agents.json`，THE Frontier SHALL 将 Agents_Template 拷贝到用户 `.claw` 目录，行为与现有拷贝 skills/settings 的逻辑一致
3. IF 用户 `.claw` 目录中已存在 `agents.json`，THEN THE Frontier SHALL 保留用户现有文件，不覆盖

### Requirement 9: 自定义 Agent 安全与权限边界

**User Story:** 作为 Frontier 平台运营方，我希望自定义 Agent 的指令与工具受到权限边界约束，以便用户自由输入的内容不会危及系统安全或硬件安全。

#### Acceptance Criteria

1. THE Agent_Manager SHALL 仅允许 Active_Agent 启用 settings.json 中已登记的 MCP_Server，不允许通过 Agent_Definition 新增任意未登记的工具端点
2. THE Agent_Manager SHALL 允许自定义 Agent 启用任意已登记的 MCP_Server，包括可驱动 PC-DMIS 真实 CMM 硬件运动的高风险 MCP_Server
3. WHERE 某 MCP_Server 被标记为高风险（如可驱动 PC-DMIS 真实 CMM 硬件运动），THE Agent_Editor_UI SHALL 在用户启用该 MCP_Server 时显示高风险标识，以便用户知情确认（但不阻止启用）
4. WHEN Agent_Definition 的 extra_instructions 被合并进系统指令，THE Agent_Run_Pipeline SHALL 将其作为用户级指令注入，且 SHALL 保留系统级安全指令的优先级
5. THE Agent_Store SHALL 将用户输入的 name、description、extra_instructions 作为纯文本持久化，且在写入与读取时进行 JSON 转义，避免破坏 `agents.json` 结构

### Requirement 10: A2A 协议接入（Phase 2，后续阶段）

**User Story:** 作为 Frontier 平台运营方，我希望未来能让多个 Agent 通过 A2A 协议互相协作，以便支持计量编排等复杂多 Agent 工作流。

> 说明：本需求属于 Phase 2，标注为后续阶段，不在 Phase 1 交付范围内。列于此处用于确认范围边界与为架构预留扩展点。

#### Acceptance Criteria

1. WHERE A2A_Protocol 已启用，THE Frontier SHALL 为每个可被调用的 Agent 暴露一份 Agent_Card 描述其能力与端点
2. WHERE A2A_Protocol 已启用，WHEN 一个 Agent 请求调用另一个 Agent，THE Frontier SHALL 依据权限策略校验该调用是否被允许
3. WHERE A2A_Protocol 已启用，IF 某操作将驱动 PC-DMIS 真实 CMM 硬件运动，THEN THE Frontier SHALL 在执行前要求有效的 Clearance_Token 与人在回路确认
4. WHERE A2A_Protocol 已启用，THE Frontier SHALL 对每个 Agent 应用最小权限原则，仅授予其完成职责所需的工具访问权
