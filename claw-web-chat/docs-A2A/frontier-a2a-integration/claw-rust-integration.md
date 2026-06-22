# claw.exe Rust 集成指南

本文档面向 **claw.exe 纯 Rust 源码** 开发者，说明如何将 A2A 委派能力直接集成到 agent 核心的 function calling 工具注册流程中。

> TypeScript 逻辑规范参考：[`docs/examples/a2a-config-loader.ts`](../examples/a2a-config-loader.ts)  
> 可运行验证：[`docs/examples/direct-agent-integration.ts`](../examples/direct-agent-integration.ts)

---

## 1. 集成挂点（4 处）

在 claw 源码中找到 **Agent 初始化** 与 **MCP 工具合并** 的代码位置（通常在 `--serve` 模式启动路径），插入以下逻辑：

```rust
// 挂点 1：启动时 — 可选加载配置（失败不 panic，仅 log）
let a2a_config = load_a2a_config(&workspace_root);
// None 或 agents 为空 → 完全跳过，行为与今天一致

// 挂点 2：Agent 初始化 — 在现有 tools 列表之后条件合并
let mut tools = base_tools.clone();  // 内置工具 + 已有 MCP 工具
let mut system_prompt = base_system_prompt.clone();

if let Some(config) = &a2a_config {
    if is_a2a_enabled(config) {
        match create_a2a_clients(config).await {
            Ok(entries) if !entries.is_empty() => {
                tools.extend(build_handoff_tools(&entries, &config.webhook));
                system_prompt.push_str(&build_system_prompt_supplement(&entries));
                log::info!("已注册 {} 个 A2A 委派工具", entries.len());
            }
            Ok(_) => log::info!("无可用 A2A Agent，保持原有行为"),
            Err(e) if config.options.fail_fast => return Err(e),
            Err(e) => log::warn!("A2A 客户端创建部分失败: {}", e),
        }
    }
}

// 挂点 3：每个 handoff tool 执行时 — 调用 delegate_task()
// 挂点 4：tool 返回字符串 — 包含进度链与最终结果（Frontier UI 通过 tool_end 展示）
```

**关键原则：** 配置文件缺失、`agents: []`、或全部连接失败（`fail_fast: false`）时，**不得改变** 现有工具列表和 system prompt。

---

## 2. 建议模块划分

```
src/a2a/
├── config.rs      # JSON 解析、路径解析、is_enabled()
├── client.rs      # HTTP：Agent Card 拉取、JSON-RPC 流式委派
├── tools.rs       # 根据 AgentCard 生成 ToolDefinition
├── delegate.rs    # 流式事件解析、TaskProgress 内存表
└── mod.rs

src/external/
├── adapter.rs     # 调 /api/v1/proxy/agent/{id}/chat
├── config.rs      # external-agents.json 加载
└── mod.rs
```

### Cargo.toml 依赖建议

```toml
[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
reqwest = { version = "0.12", features = ["json", "stream"] }
tokio = { version = "1", features = ["full"] }
uuid = { version = "1", features = ["v4"] }
anyhow = "1"
log = "0.4"
```

---

## 3. 配置加载（config.rs）

```rust
use serde::Deserialize;
use std::path::{Path, PathBuf};

#[derive(Debug, Deserialize, Clone)]
pub struct A2aConfig {
    pub agents: Vec<AgentRecord>,
    pub webhook: Option<WebhookConfig>,
    pub options: Option<Options>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct AgentRecord {
    pub id: String,
    #[serde(rename = "type")]
    pub agent_type: String,  // "native" | "openai_compatible"
    pub url: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub enabled: Option<bool>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct WebhookConfig {
    pub enabled: bool,
    pub url: Option<String>,
    pub token: Option<String>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Options {
    pub connect_timeout_ms: Option<u64>,
    pub fail_fast: Option<bool>,
}

/// 解析默认路径：{CLAW_WORKSPACE}/.claw/a2a-agents.json
pub fn resolve_default_config_path() -> PathBuf {
    let workspace = std::env::var("CLAW_WORKSPACE")
        .or_else(|_| std::env::var("APPDATA").map(|p| format!("{p}/frontier-desktop")))
        .unwrap_or_else(|_| ".".into());
    PathBuf::from(workspace).join(".claw").join("a2a-agents.json")
}

/// 加载配置。文件不存在返回 None（不 panic）。
pub fn load_a2a_config(workspace_root: &Path) -> Option<A2aConfig> {
    let path = std::env::var("A2A_CONFIG_PATH")
        .map(PathBuf::from)
        .unwrap_or_else(|_| resolve_default_config_path());

    if !path.exists() {
        log::info!("[A2A] 配置文件不存在，跳过: {}", path.display());
        return None;
    }

    let raw = std::fs::read_to_string(&path).ok()?;
    let config: A2aConfig = serde_json::from_str(&raw).ok()?;
    Some(config)
}

pub fn is_a2a_enabled(config: &A2aConfig) -> bool {
    config.agents.iter().any(|a| {
        a.agent_type == "native"
            && a.enabled != Some(false)
            && a.url.is_some()
    })
}
```

---

## 4. Agent Card 拉取（client.rs）

Native A2A Agent 的基础 URL 示例：`http://localhost:4000`  
SDK 会自动请求：`GET {url}/.well-known/agent-card.json`

```rust
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct AgentCard {
    pub name: String,
    pub description: String,
    pub skills: Option<Vec<Skill>>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Skill {
    pub id: String,
    pub name: String,
    pub description: String,
}

pub async fn fetch_agent_card(
    client: &reqwest::Client,
    base_url: &str,
) -> anyhow::Result<AgentCard> {
    let url = format!(
        "{}/.well-known/agent-card.json",
        base_url.trim_end_matches('/')
    );
    let card = client
        .get(&url)
        .timeout(std::time::Duration::from_secs(5))
        .send()
        .await?
        .error_for_status()?
        .json::<AgentCard>()
        .await?;
    Ok(card)
}
```

---

## 5. 任务委派与流式进度（delegate.rs）

对照 TypeScript 的 `delegateTask()` 与 `orchestrator.ts` L70–112。

### JSON-RPC 流式请求

A2A SDK 的 `sendMessageStream` 底层调用 JSON-RPC `message/send` 并解析 SSE/流式事件。Rust 实现可：

1. **推荐：** 使用 `@a2a-js/sdk` 的 HTTP 协议规范，POST 到 `{base_url}/a2a/jsonrpc`
2. 解析流中 `kind` 为 `task`、`status-update`、`artifact-update` 的事件

```rust
#[derive(Debug, Clone)]
pub struct TaskProgress {
    pub task_id: String,
    pub agent_name: String,
    pub agent_id: String,
    pub states: Vec<String>,
    pub artifacts: Vec<String>,
    pub result: Option<String>,
}

/// 内存任务进度表（对应 TS 的 taskProgressStore）
static TASK_PROGRESS: std::sync::LazyLock<
    std::sync::Mutex<std::collections::HashMap<String, TaskProgress>>,
> = std::sync::LazyLock::new(Default::default);

/// 格式化工具返回值 — Frontier agui-server 通过 tool_end 展示
pub fn format_tool_output(
    card_name: &str,
    task_id: Option<&str>,
    states: &[String],
    result: &str,
) -> String {
    let progress = match (task_id, states.is_empty()) {
        (Some(id), false) => format!("[{card_name}] Task {id}: {}\n", states.join(" → ")),
        _ => format!("[{card_name}] "),
    };
    format!("{progress}Result: {result}")
}

pub fn card_name_to_tool_name(card_name: &str) -> String {
    card_name.to_lowercase().replace(' ', "_")
}
```

### 事件处理伪代码

```rust
pub async fn delegate_task(
    http: &reqwest::Client,
    base_url: &str,
    card_name: &str,
    agent_id: &str,
    task_text: &str,
    webhook: Option<&WebhookConfig>,
) -> anyhow::Result<String> {
    let mut states: Vec<String> = Vec::new();
    let mut task_id: Option<String> = None;

    // 构造 MessageSendParams（见 A2A 协议规范）
    // POST {base_url}/a2a/jsonrpc，Accept: text/event-stream 或 chunked JSON

    // 伪代码：解析流式事件
    // for event in stream {
    //     match event.kind {
    //         "task" => { task_id = Some(event.id); states.push(event.status.state); }
    //         "status-update" => {
    //             states.push(event.status.state);
    //             if event.final { return Ok(format_tool_output(...)); }
    //         }
    //         "artifact-update" => { /* 记录 artifact 名称 */ }
    //         "message" => { return Ok(format_tool_output(..., text)); }
    //     }
    // }

    todo!("实现 JSON-RPC 流式解析 — 参考 @a2a-js/sdk 源码或先用非流式 message/send 验证")
}
```

> **渐进策略：** 第一版可先用非流式 `message/send` + `getTask` 轮询，第二版再接入流式以展示 `submitted → working → completed` 进度链。

### 实时进度回调（对接 Frontier UI）

TypeScript 参考：`delegateTask()` 的 `onProgress` 回调（见 `a2a-config-loader.ts`）。每次 `status-update` 时触发：

```rust
pub type ProgressCallback = Box<dyn Fn(TaskProgressEvent) + Send + Sync>;

pub enum TaskProgressEvent {
    TaskCreated { task_id: String, agent_name: String, state: String },
    State { task_id: String, agent_name: String, state: String, final_: bool },
    Artifact { task_id: String, artifact: String },
    Completed { task_id: String, states: Vec<String>, result: String },
}
```

**Frontier UI 要点：** `agui-server.js` 在 `tool_start` 后、`tool_end` 前不会自动刷新。若要在 UI 中实时显示 `submitted → working`，claw 需在工具执行过程中通过 TCP 发送**增量输出**（例如在每次状态变更时更新 tool output 或发送自定义进度事件）。仅发送最终 `tool_end` 会导致 UI 与旧版 CLI 一样“等到结束才显示”。

```rust
// 伪代码：每次状态变更时推送增量进度
on_progress: Some(Box::new(|event| {
    if let TaskProgressEvent::State { task_id, agent_name, state, .. } = event {
        tcp_emit_tool_progress(tool_call_id, &format!(
            "[{agent_name}] Task {task_id}: {state}"
        ));
    }
})),
```

---

## 6. 工具注册（tools.rs）

每个远程 Agent 对应一个 function calling 工具：

| 字段 | 值 |
|------|-----|
| 工具名 | `card.name` 转 snake_case，如 `weather_agent` |
| 描述 | `{card.description} Skills: {skill.name}: {skill.description}; ...` |
| 参数 schema | `{ "task": { "type": "string", "description": "委派给该专家的完整自然语言任务" } }` |

```rust
/// 对接 claw 现有的 ToolDefinition / function schema 结构
pub struct HandoffToolDef {
    pub name: String,
    pub description: String,
    pub parameters_schema: serde_json::Value,
}

pub fn build_handoff_tool_def(card: &AgentCard) -> HandoffToolDef {
    let skill_summary = card.skills.as_ref().map(|skills| {
        skills
            .iter()
            .map(|s| format!("{}: {}", s.name, s.description))
            .collect::<Vec<_>>()
            .join("; ")
    });

    let description = match skill_summary {
        Some(s) => format!("{} Skills: {}", card.description, s),
        None => card.description.clone(),
    };

    HandoffToolDef {
        name: card_name_to_tool_name(&card.name),
        description,
        parameters_schema: serde_json::json!({
            "type": "object",
            "properties": {
                "task": {
                    "type": "string",
                    "description": format!("委派给 {} 的完整自然语言任务", card.name)
                }
            },
            "required": ["task"]
        }),
    }
}
```

在 claw 工具注册处，找到 MCP 工具合并逻辑（类似 `merge_mcp_tools()`），在其后追加：

```rust
for entry in &a2a_entries {
    let def = build_handoff_tool_def(&entry.card);
    tools.push(Tool::new(def.name, def.description, def.parameters_schema, {
        let client = entry.http_client.clone();
        let url = entry.base_url.clone();
        let name = entry.card.name.clone();
        let id = entry.id.clone();
        move |args| async move {
            let task = args["task"].as_str().unwrap_or("");
            delegate_task(&client, &url, &name, &id, task, None).await
        }
    }));
}
```

---

## 7. 外部 Agent（external/adapter.rs）

外部平台（FastGPT、Dify）不走 A2A 协议，通过后端代理访问：

```
claw → POST /api/v1/proxy/agent/{id}/chat → 后端附加 API Key → 外部 OpenAI API
```

```rust
pub async fn send_via_proxy(
    http: &reqwest::Client,
    proxy_base: &str,
    agent_id: &str,
    message: &str,
) -> anyhow::Result<String> {
    let url = format!("{proxy_base}/{agent_id}/chat");
    let payload = serde_json::json!({
        "message": message,
        "history": [],
        "stream": false
    });

    let resp = http
        .post(&url)
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await?
        .error_for_status()?
        .json::<serde_json::Value>()
        .await?;

    let reply = resp["reply"].as_str().unwrap_or("").to_string();
    Ok(format!("[外部 Agent] processing → success\nResult: {reply}"))
}
```

配置文件：`.claw/external-agents.json`（仅元数据，无密钥）。  
代理实现参考：[`docs/examples/proxy_router.ts`](../examples/proxy_router.ts)

---

## 8. System Prompt 补充

```rust
pub fn build_system_prompt_supplement(entries: &[A2aClientEntry]) -> String {
    if entries.is_empty() { return String::new(); }

    let lines: Vec<String> = entries
        .iter()
        .map(|e| {
            let tool = card_name_to_tool_name(&e.card.name);
            format!("- 使用 {tool} 处理与「{}」相关的任务", e.card.description)
        })
        .collect();

    format!(
        "\n你可以将专业任务委派给以下远程专家 Agent：\n{}\n\
         对于多步任务，按顺序调用工具，并将上一步结果传递给下一步。\n\
         在回复中说明每个结果来自哪个专家 Agent。",
        lines.join("\n")
    )
}
```

---

## 9. 与 Frontier 的衔接

| 组件 | 是否需改动 |
|------|-----------|
| `claw.exe`（本仓库） | **是** |
| `agui-server.js` | 否 — 已有 `tool_start`/`tool_end` SSE |
| `main.js` | 否 — 无需注册 MCP |
| `%APPDATA%/frontier-desktop/.claw/a2a-agents.json` | 用户可选配置 |

`claw-process.js` 启动 claw 时 `cwd` 已指向 workspace，默认配置路径可直接使用。

---

## 10. 验证步骤

1. 在 Agent2Agent 仓库运行 TS 参考验证逻辑：
   ```powershell
   npx tsx weather_agent.ts
   $env:A2A_CONFIG_PATH = ".\docs\frontier-a2a-integration\a2a-agents.example.json"
   npx tsx docs/examples/direct-agent-integration.ts "查询东京天气"
   ```

2. Rust 集成后，在 Frontier 中对话触发 `weather_agent` tool，观察 SSE 中的 `TOOL_CALL_START` / `TOOL_CALL_END`。

3. 确认无配置文件时 Frontier 行为与集成前完全一致。

---

## 11. 对照表：TypeScript ↔ Rust

| TypeScript (`a2a-config-loader.ts`) | Rust 模块 |
|-------------------------------------|-----------|
| `loadA2AConfig()` | `config::load_a2a_config()` |
| `isA2AEnabled()` | `config::is_a2a_enabled()` |
| `createA2AClients()` | `client::create_a2a_clients()` |
| `delegateTask()` | `delegate::delegate_task()` |
| `buildHandoffTools()` | `tools::build_handoff_tool_def()` + 注册 |
| `buildA2ASystemPromptSupplement()` | `tools::build_system_prompt_supplement()` |
| `getTaskProgress()` | `delegate::TASK_PROGRESS` |
| `formatToolOutput()` | `delegate::format_tool_output()` |
| `OpenAIProxyAdapter` | `external::adapter::send_via_proxy()` |
