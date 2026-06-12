// ============================================================
// 遥测模块 (Telemetry Module)
// ============================================================
// 提供客户端身份识别、请求配置、事件追踪和会话跟踪功能
// 用于收集和记录 API 请求、Analytics 事件和会话追踪数据

use std::fmt::{Debug, Formatter};
use std::fs::{File, OpenOptions};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

// 默认常量定义
pub const DEFAULT_ANTHROPIC_VERSION: &str = "2023-06-01";           // Anthropic API 默认版本
pub const DEFAULT_APP_NAME: &str = "claude-code";                   // 默认应用名称
pub const DEFAULT_RUNTIME: &str = "rust";                           // 默认运行时
pub const DEFAULT_AGENTIC_BETA: &str = "claude-code-20250219";      // Agentic Beta 标识
pub const DEFAULT_PROMPT_CACHING_SCOPE_BETA: &str = "prompt-caching-scope-2026-01-05";  // 提示缓存范围 Beta

// ============================================================
// 客户端身份 (Client Identity)
// ============================================================
// 标识发起 API 请求的客户端信息，用于请求头和身份识别

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ClientIdentity {
    pub app_name: String,      // 应用名称
    pub app_version: String,   // 应用版本
    pub runtime: String,       // 运行时环境
}

impl ClientIdentity {
    /// 创建新的客户端身份
    /// # 参数
    /// - app_name: 应用名称
    /// - app_version: 应用版本号
    #[must_use]
    pub fn new(app_name: impl Into<String>, app_version: impl Into<String>) -> Self {
        Self {
            app_name: app_name.into(),
            app_version: app_version.into(),
            runtime: DEFAULT_RUNTIME.to_string(),
        }
    }

    /// 设置运行时环境
    /// # 参数
    /// - runtime: 运行时标识
    #[must_use]
    pub fn with_runtime(mut self, runtime: impl Into<String>) -> Self {
        self.runtime = runtime.into();
        self
    }

    /// 生成 User-Agent 字符串
    /// # 返回值
    /// 格式为 "app_name/app_version" 的字符串
    #[must_use]
    pub fn user_agent(&self) -> String {
        format!("{}/{}", self.app_name, self.app_version)
    }
}

impl Default for ClientIdentity {
    fn default() -> Self {
        // 使用包版本作为默认应用版本
        Self::new(DEFAULT_APP_NAME, env!("CARGO_PKG_VERSION"))
    }
}

// ============================================================
// Anthropic 请求配置 (Anthropic Request Profile)
// ============================================================
// 配置 Anthropic API 请求的参数，包括版本、客户端信息和 Beta 功能

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AnthropicRequestProfile {
    pub anthropic_version: String,                    // API 版本
    pub client_identity: ClientIdentity,              // 客户端身份
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub betas: Vec<String>,                           // 启用的 Beta 功能列表
    #[serde(default, skip_serializing_if = "Map::is_empty")]
    pub extra_body: Map<String, Value>,               // 额外的请求体字段
}

impl AnthropicRequestProfile {
    /// 创建新的请求配置
    /// # 参数
    /// - client_identity: 客户端身份信息
    #[must_use]
    pub fn new(client_identity: ClientIdentity) -> Self {
        Self {
            anthropic_version: DEFAULT_ANTHROPIC_VERSION.to_string(),
            client_identity,
            betas: vec![
                DEFAULT_AGENTIC_BETA.to_string(),
                DEFAULT_PROMPT_CACHING_SCOPE_BETA.to_string(),
            ],
            extra_body: Map::new(),
        }
    }

    /// 添加 Beta 功能
    /// # 参数
    /// - beta: Beta 功能标识
    #[must_use]
    pub fn with_beta(mut self, beta: impl Into<String>) -> Self {
        let beta = beta.into();
        if !self.betas.contains(&beta) {
            self.betas.push(beta);
        }
        self
    }

    /// 添加额外的请求体字段
    /// # 参数
    /// - key: 字段名
    /// - value: 字段值
    #[must_use]
    pub fn with_extra_body(mut self, key: impl Into<String>, value: Value) -> Self {
        self.extra_body.insert(key.into(), value);
        self
    }

    /// 生成请求头键值对列表
    /// # 返回值
    /// 包含 anthropic-version、user-agent 和 anthropic-beta 的头列表
    #[must_use]
    pub fn header_pairs(&self) -> Vec<(String, String)> {
        let mut headers = vec![
            (
                "anthropic-version".to_string(),
                self.anthropic_version.clone(),
            ),
            ("user-agent".to_string(), self.client_identity.user_agent()),
        ];
        if !self.betas.is_empty() {
            headers.push(("anthropic-beta".to_string(), self.betas.join(",")));
        }
        headers
    }

    /// 渲染请求的 JSON 体
    /// # 参数
    /// - request: 要序列化的请求对象
    /// # 返回值
    /// 包含所有配置字段的 JSON 值
    pub fn render_json_body<T: Serialize>(&self, request: &T) -> Result<Value, serde_json::Error> {
        let mut body = serde_json::to_value(request)?;
        let object = body.as_object_mut().ok_or_else(|| {
            serde_json::Error::io(std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                "request body must serialize to a JSON object",
            ))
        })?;
        // 合并额外的请求体字段
        for (key, value) in &self.extra_body {
            object.insert(key.clone(), value.clone());
        }
        // 添加 Beta 功能列表
        if !self.betas.is_empty() {
            object.insert(
                "betas".to_string(),
                Value::Array(self.betas.iter().cloned().map(Value::String).collect()),
            );
        }
        Ok(body)
    }
}

impl Default for AnthropicRequestProfile {
    fn default() -> Self {
        Self::new(ClientIdentity::default())
    }
}

// ============================================================
// 分析事件 (Analytics Event)
// ============================================================
// 用于记录分析追踪事件，包含命名空间、操作和属性

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AnalyticsEvent {
    pub namespace: String,                              // 事件命名空间
    pub action: String,                                 // 事件动作
    #[serde(default, skip_serializing_if = "Map::is_empty")]
    pub properties: Map<String, Value>,                 // 事件属性
}

impl AnalyticsEvent {
    /// 创建新的分析事件
    /// # 参数
    /// - namespace: 事件命名空间
    /// - action: 事件动作
    #[must_use]
    pub fn new(namespace: impl Into<String>, action: impl Into<String>) -> Self {
        Self {
            namespace: namespace.into(),
            action: action.into(),
            properties: Map::new(),
        }
    }

    /// 添加事件属性
    /// # 参数
    /// - key: 属性名
    /// - value: 属性值
    #[must_use]
    pub fn with_property(mut self, key: impl Into<String>, value: Value) -> Self {
        self.properties.insert(key.into(), value);
        self
    }
}

// ============================================================
// 会话追踪记录 (Session Trace Record)
// ============================================================
// 记录会话中的追踪事件，包含序列号、时间戳和属性

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SessionTraceRecord {
    pub session_id: String,                             // 会话 ID
    pub sequence: u64,                                  // 序列号
    pub name: String,                                   // 事件名称
    pub timestamp_ms: u64,                              // 时间戳（毫秒）
    #[serde(default, skip_serializing_if = "Map::is_empty")]
    pub attributes: Map<String, Value>,                 // 事件属性
}

// ============================================================
// 遥测事件 (Telemetry Event)
// ============================================================
// 统一的遥测事件类型，支持多种事件变体

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum TelemetryEvent {
    // HTTP 请求开始事件
    HttpRequestStarted {
        session_id: String,
        attempt: u32,
        method: String,
        path: String,
        #[serde(default, skip_serializing_if = "Map::is_empty")]
        attributes: Map<String, Value>,
    },
    // HTTP 请求成功事件
    HttpRequestSucceeded {
        session_id: String,
        attempt: u32,
        method: String,
        path: String,
        status: u16,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        request_id: Option<String>,
        #[serde(default, skip_serializing_if = "Map::is_empty")]
        attributes: Map<String, Value>,
    },
    // HTTP 请求失败事件
    HttpRequestFailed {
        session_id: String,
        attempt: u32,
        method: String,
        path: String,
        error: String,
        retryable: bool,
        #[serde(default, skip_serializing_if = "Map::is_empty")]
        attributes: Map<String, Value>,
    },
    // 分析事件
    Analytics(AnalyticsEvent),
    // 会话追踪事件
    SessionTrace(SessionTraceRecord),
}

// ============================================================
// 遥测接收器 trait (TelemetrySink Trait)
// ============================================================
// 定义遥测事件的接收器接口，支持发送和同步操作

pub trait TelemetrySink: Send + Sync {
    /// 记录遥测事件
    /// # 参数
    /// - event: 要记录的事件
    fn record(&self, event: TelemetryEvent);
}

// ============================================================
// 内存遥测接收器 (Memory Telemetry Sink)
// ============================================================
// 将事件存储在内存中的接收器实现，适用于测试和临时追踪

#[derive(Default)]
pub struct MemoryTelemetrySink {
    events: Mutex<Vec<TelemetryEvent>>,  // 事件存储
}

impl MemoryTelemetrySink {
    /// 获取所有记录的事件
    /// # 返回值
    /// 事件列表的副本
    #[must_use]
    pub fn events(&self) -> Vec<TelemetryEvent> {
        self.events
            .lock()
            .unwrap_or_else(std::sync::PoisonError::into_inner)
            .clone()
    }
}

impl TelemetrySink for MemoryTelemetrySink {
    fn record(&self, event: TelemetryEvent) {
        self.events
            .lock()
            .unwrap_or_else(std::sync::PoisonError::into_inner)
            .push(event);
    }
}

// ============================================================
// JSONL 遥测接收器 (JSONL Telemetry Sink)
// ============================================================
// 将事件持久化到 JSONL 文件的接收器实现，适用于日志记录

pub struct JsonlTelemetrySink {
    path: PathBuf,                 // 文件路径
    file: Mutex<File>,             // 文件句柄
}

impl Debug for JsonlTelemetrySink {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("JsonlTelemetrySink")
            .field("path", &self.path)
            .finish_non_exhaustive()
    }
}

impl JsonlTelemetrySink {
    /// 创建新的 JSONL 遥测接收器
    /// # 参数
    /// - path: 日志文件路径
    /// # 返回值
    /// 成功返回接收器实例，失败返回 IO 错误
    pub fn new(path: impl AsRef<Path>) -> Result<Self, std::io::Error> {
        let path = path.as_ref().to_path_buf();
        // 创建父目录
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let file = OpenOptions::new().create(true).append(true).open(&path)?;
        Ok(Self {
            path,
            file: Mutex::new(file),
        })
    }

    /// 获取文件路径
    #[must_use]
    pub fn path(&self) -> &Path {
        &self.path
    }
}

impl TelemetrySink for JsonlTelemetrySink {
    fn record(&self, event: TelemetryEvent) {
        // 将事件序列化为 JSON 行并写入文件
        let Ok(line) = serde_json::to_string(&event) else {
            return;
        };
        let mut file = self
            .file
            .lock()
            .unwrap_or_else(std::sync::PoisonError::into_inner);
        let _ = writeln!(file, "{line}");
        let _ = file.flush();
    }
}

#[derive(Clone)]
pub struct SessionTracer {
    session_id: String,
    sequence: Arc<AtomicU64>,
    sink: Arc<dyn TelemetrySink>,
}

impl Debug for SessionTracer {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("SessionTracer")
            .field("session_id", &self.session_id)
            .finish_non_exhaustive()
    }
}

impl SessionTracer {
    #[must_use]
    pub fn new(session_id: impl Into<String>, sink: Arc<dyn TelemetrySink>) -> Self {
        Self {
            session_id: session_id.into(),
            sequence: Arc::new(AtomicU64::new(0)),
            sink,
        }
    }

    #[must_use]
    pub fn session_id(&self) -> &str {
        &self.session_id
    }

    pub fn record(&self, name: impl Into<String>, attributes: Map<String, Value>) {
        let record = SessionTraceRecord {
            session_id: self.session_id.clone(),
            sequence: self.sequence.fetch_add(1, Ordering::Relaxed),
            name: name.into(),
            timestamp_ms: current_timestamp_ms(),
            attributes,
        };
        self.sink.record(TelemetryEvent::SessionTrace(record));
    }

    pub fn record_http_request_started(
        &self,
        attempt: u32,
        method: impl Into<String>,
        path: impl Into<String>,
        attributes: Map<String, Value>,
    ) {
        let method = method.into();
        let path = path.into();
        self.sink.record(TelemetryEvent::HttpRequestStarted {
            session_id: self.session_id.clone(),
            attempt,
            method: method.clone(),
            path: path.clone(),
            attributes: attributes.clone(),
        });
        self.record(
            "http_request_started",
            merge_trace_fields(method, path, attempt, attributes),
        );
    }

    pub fn record_http_request_succeeded(
        &self,
        attempt: u32,
        method: impl Into<String>,
        path: impl Into<String>,
        status: u16,
        request_id: Option<String>,
        attributes: Map<String, Value>,
    ) {
        let method = method.into();
        let path = path.into();
        self.sink.record(TelemetryEvent::HttpRequestSucceeded {
            session_id: self.session_id.clone(),
            attempt,
            method: method.clone(),
            path: path.clone(),
            status,
            request_id: request_id.clone(),
            attributes: attributes.clone(),
        });
        let mut trace_attributes = merge_trace_fields(method, path, attempt, attributes);
        trace_attributes.insert("status".to_string(), Value::from(status));
        if let Some(request_id) = request_id {
            trace_attributes.insert("request_id".to_string(), Value::String(request_id));
        }
        self.record("http_request_succeeded", trace_attributes);
    }

    pub fn record_http_request_failed(
        &self,
        attempt: u32,
        method: impl Into<String>,
        path: impl Into<String>,
        error: impl Into<String>,
        retryable: bool,
        attributes: Map<String, Value>,
    ) {
        let method = method.into();
        let path = path.into();
        let error = error.into();
        self.sink.record(TelemetryEvent::HttpRequestFailed {
            session_id: self.session_id.clone(),
            attempt,
            method: method.clone(),
            path: path.clone(),
            error: error.clone(),
            retryable,
            attributes: attributes.clone(),
        });
        let mut trace_attributes = merge_trace_fields(method, path, attempt, attributes);
        trace_attributes.insert("error".to_string(), Value::String(error));
        trace_attributes.insert("retryable".to_string(), Value::Bool(retryable));
        self.record("http_request_failed", trace_attributes);
    }

    pub fn record_analytics(&self, event: AnalyticsEvent) {
        let mut attributes = event.properties.clone();
        attributes.insert(
            "namespace".to_string(),
            Value::String(event.namespace.clone()),
        );
        attributes.insert("action".to_string(), Value::String(event.action.clone()));
        self.sink.record(TelemetryEvent::Analytics(event));
        self.record("analytics", attributes);
    }
}

fn merge_trace_fields(
    method: String,
    path: String,
    attempt: u32,
    mut attributes: Map<String, Value>,
) -> Map<String, Value> {
    attributes.insert("method".to_string(), Value::String(method));
    attributes.insert("path".to_string(), Value::String(path));
    attributes.insert("attempt".to_string(), Value::from(attempt));
    attributes
}

fn current_timestamp_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis()
        .try_into()
        .unwrap_or(u64::MAX)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn request_profile_emits_headers_and_merges_body() {
        let profile = AnthropicRequestProfile::new(
            ClientIdentity::new("claude-code", "1.2.3").with_runtime("rust-cli"),
        )
        .with_beta("tools-2026-04-01")
        .with_extra_body("metadata", serde_json::json!({"source": "test"}));

        assert_eq!(
            profile.header_pairs(),
            vec![
                (
                    "anthropic-version".to_string(),
                    DEFAULT_ANTHROPIC_VERSION.to_string()
                ),
                ("user-agent".to_string(), "claude-code/1.2.3".to_string()),
                (
                    "anthropic-beta".to_string(),
                    "claude-code-20250219,prompt-caching-scope-2026-01-05,tools-2026-04-01"
                        .to_string(),
                ),
            ]
        );

        let body = profile
            .render_json_body(&serde_json::json!({"model": "claude-sonnet"}))
            .expect("body should serialize");
        assert_eq!(
            body["metadata"]["source"],
            Value::String("test".to_string())
        );
        assert_eq!(
            body["betas"],
            serde_json::json!([
                "claude-code-20250219",
                "prompt-caching-scope-2026-01-05",
                "tools-2026-04-01"
            ])
        );
    }

    #[test]
    fn session_tracer_records_structured_events_and_trace_sequence() {
        let sink = Arc::new(MemoryTelemetrySink::default());
        let tracer = SessionTracer::new("session-123", sink.clone());

        tracer.record_http_request_started(1, "POST", "/v1/messages", Map::new());
        tracer.record_analytics(
            AnalyticsEvent::new("cli", "prompt_sent")
                .with_property("model", Value::String("claude-opus".to_string())),
        );

        let events = sink.events();
        assert!(matches!(
            &events[0],
            TelemetryEvent::HttpRequestStarted {
                session_id,
                attempt: 1,
                method,
                path,
                ..
            } if session_id == "session-123" && method == "POST" && path == "/v1/messages"
        ));
        assert!(matches!(
            &events[1],
            TelemetryEvent::SessionTrace(SessionTraceRecord { sequence: 0, name, .. })
            if name == "http_request_started"
        ));
        assert!(matches!(&events[2], TelemetryEvent::Analytics(_)));
        assert!(matches!(
            &events[3],
            TelemetryEvent::SessionTrace(SessionTraceRecord { sequence: 1, name, .. })
            if name == "analytics"
        ));
    }

    #[test]
    fn jsonl_sink_persists_events() {
        let path =
            std::env::temp_dir().join(format!("telemetry-jsonl-{}.log", current_timestamp_ms()));
        let sink = JsonlTelemetrySink::new(&path).expect("sink should create file");

        sink.record(TelemetryEvent::Analytics(
            AnalyticsEvent::new("cli", "turn_completed").with_property("ok", Value::Bool(true)),
        ));

        let contents = std::fs::read_to_string(&path).expect("telemetry log should be readable");
        assert!(contents.contains("\"type\":\"analytics\""));
        assert!(contents.contains("\"action\":\"turn_completed\""));

        let _ = std::fs::remove_file(path);
    }
}
