# Frontier 项目架构文档

## 项目概述

Frontier 是一个高性能的 Rust 重写的 AI 编程助手 CLI 工具，是 Claude Code CLI 的 Rust 实现版本。项目采用模块化设计，包含 9 个核心 crate，总代码量约 20,000 行。

**项目特点：**
- 高性能：Rust 实现，提供原生工具执行能力
- 流式响应：支持 SSE 流式输出，打字机效果
- 权限系统：细粒度的权限控制模式
- 插件架构：支持插件扩展工具和命令
- 会话持久化：支持会话恢复和继续
- MCP 支持：Model Context Protocol 客户端生命周期管理

---

## 项目结构

```
rust/
├── Cargo.toml                    # 工作空间配置
├── Cargo.lock
└── crates/
    ├── api/                      # API 客户端和流式处理
    ├── commands/                 # 斜杠命令注册和帮助渲染
    ├── compat-harness/           # TypeScript 清单提取工具
    ├── mock-anthropic-service/   # 确定性 Mock 服务
    ├── plugins/                  # 插件元数据和管理
    ├── runtime/                  # 核心运行时（最大模块）
    ├── rusty-claude-cli/         # 主 CLI 入口
    ├── telemetry/                # 会话追踪和遥测
    └── tools/                    # 内置工具定义和执行
```

---

## 模块详解

### 1. rusty-claude-cli（主 CLI 入口）

**文件位置：** `rust/crates/rusty-claude-cli/src/main.rs`

**功能职责：**
- CLI 参数解析和命令分发
- REPL 交互模式实现
- 单次提示模式（one-shot prompt）
- 终端渲染和 Markdown 输出
- 会话恢复和导出
- 错误分类和机器可读输出

**核心数据结构：**

```rust
// CLI 命令类型
enum CliAction {
    Prompt { prompt, model, output_format, allowed_tools, permission_mode, compact, ... },
    Repl { model, allowed_tools, permission_mode, ... },
    ResumeSession { session_path, commands, output_format },
    Status { model, permission_mode, output_format, allowed_tools },
    Skills { args, output_format },
    Plugins { action, target, output_format },
    Mcp { args, output_format },
    Agents { args, output_format },
    Doctor { output_format },
    Config { section, output_format },
    Diff { output_format },
    Export { session_reference, output_path, output_format },
    // ... 其他命令
}

// 输出格式
enum CliOutputFormat {
    Text,
    Json,
}
```

**关键函数：**
- `main()` - 程序入口，错误处理包装
- `run()` - 命令分发主逻辑
- `parse_args()` - CLI 参数解析
- `classify_error_kind()` - 错误分类（#77）
- `read_piped_stdin()` - 读取管道输入

**使用示例：**
```bash
# 单次提示
claw prompt "explain this code"

# 交互 REPL
claw --model claude-opus-4-6

# JSON 输出
claw --output-format json status

# 恢复会话
claw --resume latest

# 跳过权限检查
claw --dangerously-skip-permissions prompt "write a file"
```

---

### 2. api（API 客户端）

**文件位置：** `rust/crates/api/src/lib.rs`

**功能职责：**
- Anthropic API 客户端实现
- OpenAI 兼容客户端
- SSE 流式解析
- 请求/响应类型定义
- 认证处理（API Key、OAuth）
- 模型别名解析
- 请求大小预检

**核心模块：**

```rust
pub mod client;           // OAuth 令牌管理、ProviderClient
pub mod error;            // ApiError 类型
pub mod http_client;      // HTTP 客户端构建、代理配置
pub mod prompt_cache;     // 提示缓存支持
pub mod providers;        // Anthropic/OpenAI 提供商
pub mod sse;              // SSE 帧解析
pub mod types;            // 消息、请求、响应类型
```

**核心类型：**

```rust
// 消息请求
struct MessageRequest {
    model: String,
    messages: Vec<InputMessage>,
    max_tokens: u32,
    stream: bool,
    system: Option<String>,
    // ...
}

// 流式事件
enum StreamEvent {
    MessageStart(MessageStartEvent),
    ContentBlockStart(ContentBlockStartEvent),
    ContentBlockDelta(ContentBlockDeltaEvent),
    ContentBlockStop(ContentBlockStopEvent),
    MessageStop(MessageStopEvent),
    MessageDelta(MessageDeltaEvent),
}

// 提供商类型
enum ProviderKind {
    Anthropic,
    OpenAICompat,
}
```

**关键函数：**
- `resolve_model_alias()` - 解析模型别名（opus → claude-opus-4-6）
- `build_http_client()` - 构建 HTTP 客户端
- `parse_frame()` - 解析 SSE 帧
- `oauth_token_is_expired()` - OAuth 令牌过期检查

---

### 3. runtime（核心运行时）

**文件位置：** `rust/crates/runtime/src/lib.rs`（约 2000+ 行导出）

**功能职责：**
- 会话持久化（Session）
- 对话运行时（ConversationRuntime）
- 权限策略执行
- MCP 客户端生命周期
- 系统提示构建
- 文件操作（read_file, write_file, edit_file, glob, grep）
- Bash 命令执行
- 权限提升令牌管理
- 任务注册表和团队调度
- 使用量追踪和计费

**核心模块：**

```rust
mod session;              // 会话管理
mod conversation;         // 对话运行时
mod permissions;          // 权限系统
mod mcp;                  // MCP 工具桥接
mod mcp_client;           // MCP 客户端
mod mcp_lifecycle_hardened; // MCP 生命周期（硬化版）
mod mcp_server;           // MCP 服务器
mod mcp_stdio;            // MCP STDIO 传输
mod config;               // 配置加载
mod hooks;                // 生命周期钩子
mod prompt;               // 系统提示构建
mod file_ops;             // 文件操作
mod bash;                 // Bash 执行
mod compact;              // 会话压缩
mod usage;                // 使用量追踪
mod task_registry;        // 任务注册表
mod team_cron_registry;   // 团队/定时任务
mod worker_boot;          // Worker 启动
```

**核心类型：**

```rust
// 对话会话
struct Session {
    id: String,
    messages: Vec<ConversationMessage>,
    created_at: DateTime<Utc>,
    // ...
}

// 对话运行时
struct ConversationRuntime {
    session: Session,
    api_client: ApiClient,
    tool_registry: GlobalToolRegistry,
    permission_enforcer: PermissionEnforcer,
    // ...
}

// 权限模式
enum PermissionMode {
    ReadOnly,           // 只读
    WorkspaceWrite,     // 工作区写入
    DangerFullAccess,   // 危险：完全访问
}

// 权限策略
struct PermissionPolicy {
    allow: BTreeSet<String>,
    deny: BTreeSet<String>,
    // ...
}
```

**关键函数：**
- `execute_bash()` - 执行 Bash 命令
- `read_file_in_workspace()` - 读取文件
- `write_file_in_workspace()` - 写入文件
- `glob_search_in_workspace()` - glob 搜索
- `grep_search_in_workspace()` - grep 搜索
- `compact_session()` - 压缩会话历史
- `load_system_prompt()` - 加载系统提示

---

### 4. tools（内置工具）

**文件位置：** `rust/crates/tools/src/lib.rs`（约 10000+ 行）

**功能职责：**
- 工具规范定义（ToolSpec）
- 工具注册表管理
- 工具执行逻辑
- 权限检查
- 技能（Skill）解析
- 代理（Agent）执行
- 工具搜索

**核心类型：**

```rust
// 工具规范
struct ToolSpec {
    name: &'static str,
    description: &'static str,
    input_schema: Value,
    required_permission: PermissionMode,
}

// 全局工具注册表
struct GlobalToolRegistry {
    plugin_tools: Vec<PluginTool>,
    runtime_tools: Vec<RuntimeToolDefinition>,
    enforcer: Option<PermissionEnforcer>,
}

// 技能输入
struct SkillInput {
    skill: String,
    args: Option<String>,
}
```

**内置工具列表：**

| 工具名 | 描述 | 所需权限 |
|--------|------|----------|
| `bash` | 执行 Shell 命令 | DangerFullAccess |
| `read_file` | 读取文件 | ReadOnly |
| `write_file` | 写入文件 | WorkspaceWrite |
| `edit_file` | 编辑文件 | WorkspaceWrite |
| `glob_search` | 文件名搜索 | ReadOnly |
| `grep_search` | 内容搜索 | ReadOnly |
| `WebFetch` | 获取 URL 内容 | ReadOnly |
| `WebSearch` | 网络搜索 | ReadOnly |
| `TodoWrite` | 更新任务列表 | WorkspaceWrite |
| `Skill` | 加载技能 | ReadOnly |
| `Agent` | 启动代理任务 | DangerFullAccess |
| `ToolSearch` | 搜索工具 | ReadOnly |
| `NotebookEdit` | 编辑笔记本 | WorkspaceWrite |
| `Sleep` | 等待 | ReadOnly |
| `SendUserMessage` | 发送消息 | ReadOnly |
| `Config` | 获取/设置配置 | WorkspaceWrite |
| `PowerShell` | 执行 PowerShell | DangerFullAccess |
| `TaskCreate` | 创建后台任务 | DangerFullAccess |
| `TaskGet` | 获取任务状态 | ReadOnly |
| `TaskList` | 列出任务 | ReadOnly |
| `TaskStop` | 停止任务 | DangerFullAccess |
| `WorkerCreate` | 创建 Worker | DangerFullAccess |
| `WorkerSendPrompt` | 发送提示 | DangerFullAccess |
| `LSP` | LSP 查询 | ReadOnly |
| `MCP` | 执行 MCP 工具 | DangerFullAccess |

**关键函数：**
- `mvp_tool_specs()` - 返回所有内置工具规范
- `execute_tool()` - 执行工具
- `enforce_permission_check()` - 权限检查
- `run_skill()` - 执行技能
- `run_agent()` - 执行代理

---

### 5. commands（斜杠命令）

**文件位置：** `rust/crates/commands/src/lib.rs`

**功能职责：**
- 斜杠命令注册
- 命令解析和帮助渲染
- 技能命令分发
- 插件命令处理
- MCP 命令处理

**核心类型：**

```rust
// 斜杠命令规范
struct SlashCommandSpec {
    name: &'static str,
    aliases: &'static [&'static str],
    summary: &'static str,
    argument_hint: Option<&'static str>,
    resume_supported: bool,
}

// 命令注册表
struct CommandRegistry {
    entries: Vec<CommandManifestEntry>,
}
```

**斜杠命令列表（部分）：**

| 命令 | 别名 | 描述 |
|------|------|------|
| `/help` | - | 显示帮助 |
| `/status` | - | 显示会话状态 |
| `/sandbox` | - | 显示沙箱状态 |
| `/compact` | - | 压缩会话历史 |
| `/clear` | - | 开始新会话 |
| `/cost` | - | 显示 token 使用量 |
| `/resume` | - | 恢复会话 |
| `/config` | - | 检查配置 |
| `/mcp` | - | 检查 MCP 服务器 |
| `/skills` | skill | 技能管理 |
| `/agents` | - | 代理管理 |
| `/plugins` | marketplace | 插件管理 |
| `/doctor` | - | 诊断环境 |
| `/review` | - | 代码审查 |
| `/commit` | - | 生成提交信息 |
| `/pr` | - | 创建 PR |
| `/diff` | - | 显示 git diff |
| `/version` | - | 显示版本 |
| `/session` | - | 会话管理 |
| `/tasks` | - | 后台任务 |
| `/export` | - | 导出会话 |
| `/hooks` | - | 生命周期钩子 |
| `/web` | - | 获取网页 |
| `/map` | - | 代码结构可视化 |
| `/explain` | - | 解释代码 |
| `/fix` | - | 修复错误 |
| `/test` | - | 运行测试 |
| `/lint` | - | 运行 lint |
| `/build` | - | 构建项目 |
| `/git` | - | 运行 git 命令 |
| `/cron` | - | 定时任务 |
| `/team` | - | 团队管理 |
| `/benchmark` | - | 性能测试 |

**关键函数：**
- `slash_command_specs()` - 返回所有命令规范
- `render_slash_command_help()` - 渲染帮助文本
- `handle_skills_slash_command()` - 处理技能命令
- `handle_plugins_slash_command()` - 处理插件命令
- `handle_mcp_slash_command()` - 处理 MCP 命令

---

### 6. plugins（插件系统）

**文件位置：** `rust/crates/plugins/src/lib.rs`

**功能职责：**
- 插件元数据管理
- 插件安装/启用/禁用/卸载
- 插件工具定义
- 插件钩子管理
- 插件生命周期（init/shutdown）

**核心类型：**

```rust
// 插件元数据
struct PluginMetadata {
    id: String,
    name: String,
    version: String,
    description: String,
    kind: PluginKind,  // Builtin, Bundled, External
    source: String,
    default_enabled: bool,
    root: Option<PathBuf>,
}

// 插件清单
struct PluginManifest {
    name: String,
    version: String,
    description: String,
    permissions: Vec<PluginPermission>,
    default_enabled: bool,
    hooks: PluginHooks,
    lifecycle: PluginLifecycle,
    tools: Vec<PluginToolManifest>,
    commands: Vec<PluginCommandManifest>,
}

// 插件钩子
struct PluginHooks {
    pre_tool_use: Vec<String>,
    post_tool_use: Vec<String>,
    post_tool_use_failure: Vec<String>,
}

// 插件生命周期
struct PluginLifecycle {
    init: Vec<String>,
    shutdown: Vec<String>,
}

// 插件工具
struct PluginTool {
    plugin_id: String,
    plugin_name: String,
    definition: PluginToolDefinition,
    command: String,
    args: Vec<String>,
    required_permission: PluginToolPermission,
}
```

**插件类型：**

```rust
enum PluginKind {
    Builtin,   // 内置插件
    Bundled,   // 捆绑插件
    External,  // 外部插件
}

enum PluginDefinition {
    Builtin(BuiltinPlugin),
    Bundled(BundledPlugin),
    External(ExternalPlugin),
}
```

**关键函数：**
- `PluginManager::discover()` - 发现插件
- `PluginManager::install()` - 安装插件
- `PluginRegistry::aggregated_hooks()` - 聚合钩子
- `PluginRegistry::aggregated_tools()` - 聚合工具

---

### 7. telemetry（遥测系统）

**文件位置：** `rust/crates/telemetry/src/lib.rs`

**功能职责：**
- 会话追踪记录
- HTTP 请求追踪
- 分析事件
- 遥测接收器（内存/JSONL）

**核心类型：**

```rust
// 客户端标识
struct ClientIdentity {
    app_name: String,
    app_version: String,
    runtime: String,  // "rust"
}

// Anthropic 请求配置
struct AnthropicRequestProfile {
    anthropic_version: String,
    client_identity: ClientIdentity,
    betas: Vec<String>,
    extra_body: Map<String, Value>,
}

// 分析事件
struct AnalyticsEvent {
    namespace: String,
    action: String,
    properties: Map<String, Value>,
}

// 会话追踪记录
struct SessionTraceRecord {
    session_id: String,
    sequence: u64,
    name: String,
    timestamp_ms: u64,
    attributes: Map<String, Value>,
}

// 遥测事件
enum TelemetryEvent {
    HttpRequestStarted { ... },
    HttpRequestSucceeded { ... },
    HttpRequestFailed { ... },
    Analytics(AnalyticsEvent),
    SessionTrace(SessionTraceRecord),
}

// 遥测接收器 trait
trait TelemetrySink {
    fn record(&self, event: TelemetryEvent);
}

// 内存接收器（测试用）
struct MemoryTelemetrySink {
    events: Mutex<Vec<TelemetryEvent>>,
}

// JSONL 文件接收器
struct JsonlTelemetrySink {
    path: PathBuf,
    file: Mutex<File>,
}

// 会话追踪器
struct SessionTracer {
    session_id: String,
    sequence: Arc<AtomicU64>,
    sink: Arc<dyn TelemetrySink>,
}
```

**关键函数：**
- `SessionTracer::new()` - 创建追踪器
- `SessionTracer::record_http_request_started()` - 记录请求开始
- `SessionTracer::record_http_request_succeeded()` - 记录请求成功
- `SessionTracer::record_analytics()` - 记录分析事件

---

### 8. mock-anthropic-service（Mock 服务）

**文件位置：** `rust/crates/mock-anthropic-service/src/lib.rs`

**功能职责：**
- 确定性 Mock Anthropic API 服务
- 端到端测试覆盖
- 场景定义和响应构建

**核心类型：**

```rust
// Mock 服务
struct MockAnthropicService {
    base_url: String,
    requests: Arc<Mutex<Vec<CapturedRequest>>>,
    shutdown: Option<oneshot::Sender<()>>,
    join_handle: JoinHandle<()>,
}

// 捕获的请求
struct CapturedRequest {
    method: String,
    path: String,
    headers: HashMap<String, String>,
    scenario: String,
    stream: bool,
    raw_body: String,
}

// 测试场景
enum Scenario {
    StreamingText,
    ReadFileRoundtrip,
    GrepChunkAssembly,
    WriteFileAllowed,
    WriteFileDenied,
    MultiToolTurnRoundtrip,
    BashStdoutRoundtrip,
    BashPermissionPromptApproved,
    BashPermissionPromptDenied,
    PluginToolRoundtrip,
    AutoCompactTriggered,
    TokenCostReporting,
}
```

**使用场景：**
- CLI 一致性测试
- 干净环境测试
- 工具调用往返测试

---

### 9. compat-harness（兼容测试工具）

**文件位置：** `rust/crates/compat-harness/src/lib.rs`

**功能职责：**
- 从上游 TypeScript 源码提取清单
- 工具/命令清单生成
- 兼容性测试

---

## 配置文件

### .claw.json（工作区配置）

```json
{
  "model": "claude-opus-4-6",
  "permissionMode": "danger-full-access",
  "allowedTools": ["bash", "read_file", "write_file", "grep_search"],
  "mcpServers": {
    "server-name": {
      "command": "uvx",
      "args": ["server-package@latest"]
    }
  },
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": []
  }
}
```

### MCP 配置

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"],
      "disabled": false
    },
    "github": {
      "command": "uvx",
      "args": ["github.com/github/github-mcp-server@latest"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "..."
      }
    }
  }
}
```

---

## 权限系统

### 权限模式

```rust
enum PermissionMode {
    ReadOnly,           // 只读访问
    WorkspaceWrite,     // 工作区写入
    DangerFullAccess,   // 完全访问（危险）
}
```

### 权限检查流程

```
工具调用请求
    ↓
PermissionEnforcer.check(tool_name, input_json)
    ↓
根据工具规范获取 required_permission
    ↓
根据 PermissionMode 决定是否允许
    ↓
返回 EnforcementResult::Allowed 或 Denied
```

### 权限提升令牌

```rust
// 临时提升权限
let token = ApprovalTokenGrant::new(
    ApprovalScope::WriteFiles(PathBuf::from("/project")),
    Duration::from_secs(300),
);

// 使用令牌执行操作
enforcer.check_with_token(tool_name, input, &token)
```

---

## 技能系统

### 技能文件结构

Skills 存储在 `~/.claw/skills/` 目录：

```
~/.claw/skills/
├── sysinfo/
│   └── SKILL.md
├── pc-dmis-automation/
│   └── SKILL.md
└── other-skill/
    └── SKILL.md
```

### SKILL.md 格式

```markdown
# Skill Name

## Description
Brief description of what this skill does.

## When to Use
When to invoke this skill.

## Parameters
- param1: Description
- param2: Description

## Example
```
Use the skill like this:
{{skill_name param1="value" param2="value"}}
```

## Commands
```powershell
# PowerShell commands
Get-Process | Select-Object Name, CPU
```
```

### 使用技能

```
{{skill_name arg1="value"}}
```

---

## 调试指南

### 1. 日志输出

```bash
# 启用详细日志
CLAW_DEBUG=1 claw prompt "your prompt"

# 追踪特定模块
CLAW_TRACE=api,tools claw prompt "your prompt"
```

### 2. 遥测日志

遥测日志默认写入 `~/.cache/claude-code/telemetry.jsonl`

```bash
# 查看遥测日志
cat ~/.cache/claude-code/telemetry.jsonl | jq '.'
```

### 3. 会话调试

```bash
# 列出会话
claw session list

# 检查会话
claw session exists <session-id>

# 导出会话
claw export latest -o session.jsonl
```

### 4. 权限调试

```bash
# 查看当前权限模式
claw status

# 临时切换权限模式
claw --permission-mode=read-only prompt "read only"
```

### 5. 工具调试

```bash
# 列出可用工具
claw ToolSearch query="file"

# 查看工具详情
claw tool-details read_file
```

### 6. MCP 调试

```bash
# 列出 MCP 服务器
claw mcp list

# 查看 MCP 服务器详情
claw mcp show <server-name>
```

### 7. 插件调试

```bash
# 列出插件
claw plugin list

# 检查插件健康
claw plugin list | jq '.[] | select(.health != "healthy")'
```

---

## 代码流程图

### 单次提示流程

```
claw prompt "hello"
    ↓
parse_args() → CliAction::Prompt
    ↓
LiveCli::new(model, allowed_tools, permission_mode)
    ↓
ConfigLoader::load() → 加载 .claw.json
    ↓
PluginManager::discover() → 发现插件
    ↓
GlobalToolRegistry::definitions() → 工具列表
    ↓
ConversationRuntime::run_turn()
    ↓
ApiClient::send_message() → Anthropic API
    ↓
流式接收 SSE 事件
    ↓
ToolExecutor::execute() → 执行工具调用
    ↓
渲染输出到终端
```

### 工具调用流程

```
AI 模型决定调用工具
    ↓
ConversationRuntime::execute_tool()
    ↓
PermissionEnforcer.check()
    ↓
tools::execute_tool(name, input)
    ↓
匹配工具名并执行对应函数
    ↓
返回结果给模型
```

---

## 扩展开发

### 添加新工具

1. 在 `tools/src/lib.rs` 中添加 `ToolSpec`
2. 实现执行函数 `run_<tool_name>()`
3. 在 `execute_tool_with_enforcer()` 中添加匹配
4. 添加测试

### 添加新命令

1. 在 `commands/src/lib.rs` 的 `SLASH_COMMAND_SPECS` 中添加规范
2. 实现处理函数
3. 在 `main.rs` 的 `parse_args()` 中添加解析
4. 添加帮助文本

### 添加插件

1. 创建插件目录结构
2. 编写 `.claude-plugin/plugin.json`
3. 实现工具/钩子
4. 测试插件加载

---

## 常见问题

### Q: 如何跳过权限确认？
A: 使用 `--dangerously-skip-permissions` 或设置 `permissionMode: "danger-full-access"`

### Q: 如何限制可用工具？
A: 使用 `--allowedTools bash,read_file,write_file`

### Q: 如何恢复会话？
A: `claw --resume latest` 或 `claw --resume session-id`

### Q: 如何配置 MCP 服务器？
A: 在 `.claw.json` 的 `mcpServers` 中配置

### Q: 如何调试工具执行？
A: 使用 `CLAW_DEBUG=1` 环境变量

---

## 版本信息

- **当前版本：** 0.1.0
- **默认模型：** claude-opus-4-6
- **默认权限：** danger-full-access
- **二进制名称：** claw
- **代码行数：** ~20,000 行 Rust
- **工作空间成员：** 9 个 crate