// ============================================================
// Frontier - API 客户端模块
// 文件位置：rust/crates/api/src/lib.rs
// 功能：Anthropic/OpenAI API 客户端、SSE 流式解析、请求/响应类型
// ============================================================

// 模块声明
mod client;           // API 客户端实现
mod error;            // 错误类型
mod http_client;      // HTTP 客户端构建
mod prompt_cache;     // 提示缓存
mod providers;        // 提供商（Anthropic/OpenAI）
mod sse;              // SSE 流式解析
mod types;            // 请求/响应类型

// 重新导出：客户端相关
pub use client::{
    oauth_token_is_expired,            // 检查 OAuth 令牌是否过期
    read_base_url,                     // 读取基础 URL
    read_xai_base_url,                 // 读取 XAI 基础 URL
    resolve_saved_oauth_token,         // 解析保存的 OAuth 令牌
    resolve_startup_auth_source,       // 解析启动时认证源
    MessageStream,                     // 消息流
    OAuthTokenSet,                     // OAuth 令牌集
    ProviderClient,                    // 提供商客户端接口
};

// 重新导出：API 错误
pub use error::ApiError;

// 重新导出：HTTP 客户端
pub use http_client::{
    build_http_client,                 // 构建 HTTP 客户端
    build_http_client_or_default,      // 构建默认 HTTP 客户端
    build_http_client_with,            // 使用配置构建 HTTP 客户端
    ProxyConfig,                       // 代理配置
};

// 重新导出：提示缓存
pub use prompt_cache::{
    CacheBreakEvent,                   // 缓存失效事件
    PromptCache,                       // 提示缓存
    PromptCacheConfig,                 // 缓存配置
    PromptCachePaths,                  // 缓存路径
    PromptCacheRecord,                 // 缓存记录
    PromptCacheStats,                  // 缓存统计
};

// 重新导出：Anthropic 提供商
pub use providers::anthropic::{
    AnthropicClient,                   // Anthropic 客户端
    AnthropicClient as ApiClient,      // API 客户端别名
    AuthSource,                        // 认证源
};

// 重新导出：OpenAI 兼容客户端
pub use providers::openai_compat::{
    build_chat_completion_request,     // 构建聊天完成请求
    check_request_body_size,           // 检查请求体大小
    estimate_request_body_size,        // 估算请求体大小
    flatten_tool_result_content,       // 扁平化工具结果内容
    is_reasoning_model,                // 是否推理模型
    model_rejects_is_error_field,      // 模型是否拒绝错误字段
    model_requires_reasoning_content_in_history,  // 模型是否需要历史推理内容
    translate_message,                 // 翻译消息
    OpenAiCompatClient,                // OpenAI 兼容客户端
    OpenAiCompatConfig,                // 兼容配置
};

// 重新导出：提供商检测
pub use providers::{
    detect_provider_kind,              // 检测提供商类型
    max_tokens_for_model,              // 获取模型最大 tokens
    max_tokens_for_model_with_override, // 带覆盖的最大 tokens
    model_family_identity_for,         // 获取模型家族标识
    model_family_identity_for_kind,    // 获取提供商对应的模型家族
    provider_diagnostics_for_model,    // 获取模型诊断信息
    resolve_model_alias,               // 解析模型别名
    ProviderDiagnostics,               // 提供商诊断
    ProviderKind,                      // 提供商类型
};

// 重新导出：SSE 解析
pub use sse::{
    parse_frame,                       // 解析 SSE 帧
    SseParser,                         // SSE 解析器
};

// 重新导出：类型定义
pub use types::{
    ContentBlockDelta,                 // 内容块增量
    ContentBlockDeltaEvent,            // 内容块增量事件
    ContentBlockStartEvent,            // 内容块开始事件
    ContentBlockStopEvent,             // 内容块结束事件
    InputContentBlock,                 // 输入内容块
    InputMessage,                      // 输入消息
    MessageDelta,                      // 消息增量
    MessageDeltaEvent,                 // 消息增量事件
    MessageRequest,                    // 消息请求
    MessageResponse,                   // 消息响应
    MessageStartEvent,                 // 消息开始事件
    MessageStopEvent,                  // 消息结束事件
    OutputContentBlock,                // 输出内容块
    StreamEvent,                       // 流事件
    ToolChoice,                        // 工具选择
    ToolDefinition,                    // 工具定义
    ToolResultContentBlock,            // 工具结果内容块
    Usage,                             // 使用量统计
};

// 重新导出：遥测（从 telemetry 模块）
pub use telemetry::{
    AnalyticsEvent,                    // 分析事件
    AnthropicRequestProfile,           // Anthropic 请求配置
    ClientIdentity,                    // 客户端标识
    JsonlTelemetrySink,                // JSONL 遥测接收器
    MemoryTelemetrySink,               // 内存遥测接收器
    SessionTraceRecord,                // 会话追踪记录
    SessionTracer,                     // 会话追踪器
    TelemetryEvent,                    // 遥测事件
    TelemetrySink,                     // 遥测接收器 trait
    DEFAULT_ANTHROPIC_VERSION,         // 默认 Anthropic 版本
};
