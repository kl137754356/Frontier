# Requirements Document

## Introduction

本需求文档定义了在 Frontier 桌面应用核心组件 claw.exe（纯 Rust 实现的 agent）中引入 A2A（Agent2Agent）协议支持的功能需求。该功能使 claw 能够通过 function calling 工具与外部 Agent 交互，支持原生 A2A 协议和 OpenAI 兼容外部 Agent 两类集成方式。

本功能遵循**零副作用可选插件**原则：配置文件缺失或 agents 为空时，Frontier 行为与集成前完全一致。

实施分为 4 个阶段：
1. 配置加载 + 客户端创建
2. Handoff 工具注册
3. 进度追踪
4. 外部 Agent（后端代理 + 代理工具注册）

## Glossary

- **Claw**: claw.exe，Frontier 桌面应用中纯 Rust 实现的 agent 核心进程，负责 LLM 推理与 function calling 工具执行
- **A2A_Protocol**: Agent2Agent 协议，基于 JSON-RPC over HTTP 的 Agent 间通信标准
- **Agent_Card**: 远程 A2A Agent 通过 `/.well-known/agent-card.json` 暴露的能力描述文件，包含 name、description、skills 等字段
- **Handoff_Tool**: 为每个可达远程 Agent 动态生成的 function calling 工具，工具名为 Agent Card name 的 snake_case 形式
- **Native_A2A_Agent**: 遵循 A2A 协议规范的远程 Agent，通过 Agent Card 发现能力，经 JSON-RPC 委派任务
- **External_Agent**: OpenAI 兼容的外部平台（FastGPT、Dify 等），通过后端安全代理路由访问
- **Proxy_Router**: 后端代理路由服务，负责从安全存储加载 API Key 并转发请求到外部平台
- **Config_Loader**: 配置加载模块，负责解析 `.claw/a2a-agents.json` 和 `.claw/external-agents.json`
- **Task_Progress**: A2A 任务进度状态链，包含 submitted → working → completed/failed/canceled
- **Delegate_Task**: 向远程 Agent 委派任务的操作，包括发送请求和接收流式进度事件
- **Workspace_Root**: claw 进程的工作目录，通常为 `%APPDATA%/frontier-desktop`

## Requirements

### Requirement 1: 原生 A2A 配置加载

**User Story:** As a Frontier 用户, I want claw 在启动时自动加载 A2A 配置文件, so that 我可以通过简单的 JSON 配置来声明要集成的远程 Agent。

#### Acceptance Criteria

1. WHEN Claw 启动时, THE Config_Loader SHALL 按以下优先级解析配置文件路径：函数参数 > 环境变量 `A2A_CONFIG_PATH` > 默认路径 `{Workspace_Root}/.claw/a2a-agents.json`
2. WHEN 配置文件路径已解析, THE Config_Loader SHALL 读取并解析 JSON 文件为 A2aConfig 结构体（包含 agents 数组、webhook 配置、options 选项）
3. IF 配置文件不存在, THEN THE Config_Loader SHALL 记录 info 级别日志并返回 None，不中断启动流程
4. IF 配置文件存在但 JSON 格式无效, THEN THE Config_Loader SHALL 记录 warn 级别日志并返回 None，不中断启动流程
5. WHEN 配置文件有效加载后, THE Config_Loader SHALL 对每个 agent 记录解析 id、type、url、enabled 字段，其中 enabled 默认值为 true

### Requirement 2: Agent Card 拉取与客户端创建

**User Story:** As a Frontier 用户, I want claw 在启动时获取远程 Agent 的能力描述, so that 系统能生成准确的工具定义供 LLM 调用。

#### Acceptance Criteria

1. WHEN 配置中存在 enabled 为 true 且 type 为 "native" 的 agent 记录, THE Claw SHALL 对该 agent 的 url 拼接 `/.well-known/agent-card.json` 路径发起 HTTP GET 请求
2. WHEN Agent_Card 请求成功返回, THE Claw SHALL 解析响应为 AgentCard 结构体（包含 name、description、skills 字段）
3. IF Agent_Card 请求超时或失败且 options.failFast 为 false, THEN THE Claw SHALL 跳过该 Agent 并记录 warn 日志，继续处理其余 Agent
4. IF Agent_Card 请求超时或失败且 options.failFast 为 true, THEN THE Claw SHALL 终止启动并返回包含失败 Agent URL 的错误信息
5. THE Claw SHALL 使用 options.connectTimeoutMs（默认 5000ms）作为 Agent_Card 请求的超时时间
6. THE Claw SHALL 在启动时执行一次 Agent_Card 拉取，后续 function call 执行时复用缓存的 AgentCard 数据

### Requirement 3: Handoff 工具注册

**User Story:** As a Frontier 用户, I want 远程 Agent 自动注册为 function calling 工具, so that LLM 能在对话中自动发现并调用远程专家能力。

#### Acceptance Criteria

1. WHEN Agent_Card 成功获取后, THE Claw SHALL 为每个可达的 Native_A2A_Agent 生成一个 Handoff_Tool 定义
2. THE Claw SHALL 将 Handoff_Tool 的工具名设置为 Agent_Card 的 name 字段转换为 snake_case 格式（例如 "Weather Agent" → "weather_agent"）
3. THE Claw SHALL 将 Handoff_Tool 的描述设置为 Agent_Card 的 description 加上 skills 摘要（格式："{description} Skills: {skill.name}: {skill.description}; ..."）
4. THE Claw SHALL 将 Handoff_Tool 的参数 schema 设置为包含单个 "task" 字符串参数（描述为"委派给该专家的完整自然语言任务"）
5. WHEN Handoff_Tool 定义生成完毕, THE Claw SHALL 将其追加到现有工具列表（内置工具 + MCP 工具）之后
6. WHEN Handoff_Tool 注册完毕, THE Claw SHALL 在 system prompt 中追加远程 Agent 委派引导文本，列出可用的远程专家及其用途
7. THE Claw SHALL 保持现有 MCP 工具的注册与执行逻辑不变

### Requirement 4: 原生 A2A 任务委派

**User Story:** As a Frontier 用户, I want 通过 function calling 将任务委派给远程 A2A Agent, so that 我可以利用远程专家的能力完成特定任务。

#### Acceptance Criteria

1. WHEN LLM 调用某个 Handoff_Tool 时, THE Claw SHALL 向对应 Native_A2A_Agent 的 JSON-RPC 端点（`{base_url}/a2a/jsonrpc`）发送 `message/send` 请求，请求体包含 task 参数内容
2. WHEN 委派请求包含有效 webhook 配置（webhook.enabled 为 true）, THE Claw SHALL 在请求中附加 pushNotificationConfig（包含 url 和 token）
3. WHEN 委派响应返回 task 事件, THE Claw SHALL 记录 task_id 和初始状态到内存 Task_Progress 表
4. WHEN 委派请求失败或超时, THE Claw SHALL 返回包含错误描述的工具输出文本（格式："[{agent_name}] Error: {error_message}"）

### Requirement 5: 流式进度追踪

**User Story:** As a Frontier 用户, I want 在任务执行过程中看到实时进度, so that 我能了解远程 Agent 的工作状态而非等待无提示的长时间空白。

#### Acceptance Criteria

1. WHEN Delegate_Task 收到 status-update 事件, THE Claw SHALL 将新状态追加到 Task_Progress 的 states 列表中
2. WHEN Delegate_Task 收到 artifact-update 事件, THE Claw SHALL 将 artifact 名称记录到 Task_Progress 的 artifacts 列表中
3. WHEN Delegate_Task 收到 final 标记为 true 的事件, THE Claw SHALL 提取最终结果文本并结束流式监听
4. THE Claw SHALL 将工具输出格式化为 "[{agent_name}] Task {task_id}: {states_chain}\nResult: {result_text}"（其中 states_chain 为状态以 " → " 连接）
5. WHILE 任务执行中, THE Claw SHALL 通过 TCP 协议发送增量进度文本到 agui-server，使 UI 能实时展示任务状态变化

### Requirement 6: 零副作用保证

**User Story:** As a Frontier 用户, I want A2A 集成在未配置时对系统无任何影响, so that 不需要远程 Agent 的用户不会受到任何性能或行为上的变化。

#### Acceptance Criteria

1. WHEN 配置文件不存在, THE Claw SHALL 保持工具列表与集成前完全一致，system prompt 不包含任何 A2A 相关文本
2. WHEN 配置文件的 agents 数组为空, THE Claw SHALL 保持工具列表与集成前完全一致，system prompt 不包含任何 A2A 相关文本
3. WHEN 所有配置的 Agent 均不可达且 options.failFast 为 false, THE Claw SHALL 保持工具列表与集成前完全一致，system prompt 不包含任何 A2A 相关文本
4. THE Claw SHALL 不修改现有 MCP 工具的注册流程、执行逻辑或工具命名格式
5. THE Claw SHALL 不修改 agui-server 的 SSE 事件格式或处理逻辑
6. THE Claw SHALL 不修改 main.js 的启动流程

### Requirement 7: 外部 Agent 配置加载

**User Story:** As a Frontier 用户, I want 通过配置文件声明 OpenAI 兼容的外部 Agent, so that 我可以使用 FastGPT、Dify 等非 A2A 平台的 Agent 能力。

#### Acceptance Criteria

1. WHEN Claw 启动时, THE Config_Loader SHALL 读取 `{Workspace_Root}/.claw/external-agents.json` 文件
2. WHEN 外部配置文件有效, THE Config_Loader SHALL 解析 proxyBaseUrl 和 agents 数组（每个 agent 包含 id、type、name、description、enabled 字段）
3. IF 外部配置文件不存在或无效, THEN THE Config_Loader SHALL 记录 info 日志并跳过外部 Agent 注册，不中断启动流程
4. THE Config_Loader SHALL 验证配置文件中不包含 api_key 字段；外部 Agent 配置仅存储元数据

### Requirement 8: 外部 Agent 代理工具注册与调用

**User Story:** As a Frontier 用户, I want 外部 Agent 也注册为 function calling 工具, so that LLM 可以统一调度原生 A2A Agent 和外部 Agent。

#### Acceptance Criteria

1. WHEN 外部配置中存在 enabled 为 true 的 agent 记录, THE Claw SHALL 为每个外部 Agent 生成一个 Handoff_Tool 定义（工具名为 id 字段的 snake_case 形式）
2. THE Claw SHALL 将外部 Agent 的 Handoff_Tool 描述设置为配置文件中的 description 字段
3. WHEN LLM 调用外部 Agent 的 Handoff_Tool 时, THE Claw SHALL 向 `{proxyBaseUrl}/{agent_id}/chat` 发送 POST 请求，请求体包含 message 和 history 字段
4. WHEN 代理响应成功, THE Claw SHALL 将工具输出格式化为 "[外部 Agent] processing → success\nResult: {reply}"
5. IF 代理请求失败, THEN THE Claw SHALL 返回包含错误描述的工具输出文本

### Requirement 9: 后端代理安全保障

**User Story:** As a 系统管理员, I want 第三方 API Key 永不到达前端或 claw 进程, so that 用户的敏感凭证得到安全保护。

#### Acceptance Criteria

1. THE Proxy_Router SHALL 从安全存储（数据库或服务端配置）加载外部 Agent 的 API Key，Claw 进程不持有也不传输该密钥
2. WHEN 收到代理请求, THE Proxy_Router SHALL 验证请求发起者对目标 agent_id 的所有权（防止 IDOR 攻击）
3. IF 请求者不是目标 Agent 的所有者, THEN THE Proxy_Router SHALL 返回 HTTP 404 响应，不暴露 Agent 是否存在
4. THE Proxy_Router SHALL 将内部 payload（message + history）转换为 OpenAI 格式（messages 数组）后附加 API Key 转发到外部平台
5. THE Proxy_Router SHALL 在响应中过滤 api_key 字段，确保密钥不被返回到客户端

### Requirement 10: 性能与容错

**User Story:** As a Frontier 用户, I want A2A 集成不影响启动速度且能优雅处理故障, so that 远程 Agent 的不稳定不会降低本地使用体验。

#### Acceptance Criteria

1. THE Claw SHALL 在启动时并行发起所有 Agent_Card 请求，总超时受 options.connectTimeoutMs 约束
2. WHEN 单个 Agent 不可达且 options.failFast 为 false, THE Claw SHALL 在 connectTimeoutMs 内完成超时判定并跳过该 Agent
3. THE Claw SHALL 在启动时缓存所有成功获取的 Agent_Card，后续工具调用不重新拉取 Agent_Card
4. IF Delegate_Task 执行超时, THEN THE Claw SHALL 返回超时错误信息而非无限等待
