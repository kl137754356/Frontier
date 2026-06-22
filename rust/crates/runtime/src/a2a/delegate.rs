//! Task delegation to remote A2A Agents.
//!
//! Constructs JSON-RPC `message/send` requests, parses streaming responses,
//! and tracks task progress in an in-memory table.

use super::client::A2aClient;
use super::config::WebhookConfig;
use serde::{Deserialize, Serialize};

// ---------------------------------------------------------------------------
// JSON-RPC request types
// ---------------------------------------------------------------------------

#[derive(Debug, Serialize)]
pub struct JsonRpcRequest {
    pub jsonrpc: String,
    pub method: String,
    pub id: String,
    pub params: MessageSendParams,
}

#[derive(Debug, Serialize)]
pub struct MessageSendParams {
    pub message: TaskMessage,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub push_notification_config: Option<PushNotificationConfig>,
}

#[derive(Debug, Serialize)]
pub struct TaskMessage {
    pub role: String,
    pub parts: Vec<MessagePart>,
}

#[derive(Debug, Serialize)]
#[serde(tag = "type")]
pub enum MessagePart {
    #[serde(rename = "text")]
    Text { text: String },
}

#[derive(Debug, Serialize)]
pub struct PushNotificationConfig {
    pub url: String,
    pub token: String,
}

// ---------------------------------------------------------------------------
// Streaming event types (deserialized from response)
// ---------------------------------------------------------------------------

#[derive(Debug, Deserialize)]
#[serde(tag = "kind")]
pub enum A2aEvent {
    #[serde(rename = "task")]
    Task(TaskEvent),
    #[serde(rename = "status-update")]
    StatusUpdate(StatusUpdateEvent),
    #[serde(rename = "artifact-update")]
    ArtifactUpdate(ArtifactUpdateEvent),
    #[serde(rename = "message")]
    Message(MessageEvent),
}

#[derive(Debug, Deserialize)]
pub struct TaskEvent {
    pub id: String,
    pub status: TaskStatus,
}

#[derive(Debug, Deserialize)]
pub struct StatusUpdateEvent {
    #[serde(rename = "taskId")]
    pub task_id: String,
    pub status: TaskStatus,
    #[serde(default, rename = "final")]
    pub is_final: bool,
}

#[derive(Debug, Clone, Deserialize)]
pub struct TaskStatus {
    pub state: String,
    #[serde(default)]
    pub message: Option<StatusMessage>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct StatusMessage {
    #[serde(default)]
    pub parts: Vec<StatusPart>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "kind")]
pub enum StatusPart {
    #[serde(rename = "text")]
    Text { text: String },
}

#[derive(Debug, Deserialize)]
pub struct ArtifactUpdateEvent {
    #[serde(rename = "taskId")]
    pub task_id: String,
    pub artifact: ArtifactInfo,
}

#[derive(Debug, Deserialize)]
pub struct ArtifactInfo {
    #[serde(default)]
    pub name: Option<String>,
    #[serde(default)]
    pub parts: Vec<ArtifactPart>,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "kind")]
pub enum ArtifactPart {
    #[serde(rename = "text")]
    Text { text: String },
}

#[derive(Debug, Deserialize)]
pub struct MessageEvent {
    #[serde(default)]
    pub parts: Vec<StatusPart>,
}

// ---------------------------------------------------------------------------
// Task Progress
// ---------------------------------------------------------------------------

/// In-memory record of a delegated task's progress.
#[derive(Debug, Clone)]
pub struct TaskProgress {
    pub task_id: String,
    pub agent_name: String,
    pub states: Vec<String>,
    pub artifacts: Vec<String>,
    pub result_text: Option<String>,
}

// ---------------------------------------------------------------------------
// Request construction
// ---------------------------------------------------------------------------

/// Build a JSON-RPC `message/send` request for task delegation.
pub fn build_jsonrpc_request(task_text: &str, webhook: Option<&WebhookConfig>) -> JsonRpcRequest {
    let push_config = webhook
        .filter(|w| w.enabled && !w.url.is_empty())
        .map(|w| PushNotificationConfig {
            url: w.url.clone(),
            token: w.token.clone(),
        });

    JsonRpcRequest {
        jsonrpc: "2.0".to_string(),
        method: "message/send".to_string(),
        id: format!("{:x}", rand_id()),
        params: MessageSendParams {
            message: TaskMessage {
                role: "user".to_string(),
                parts: vec![MessagePart::Text {
                    text: task_text.to_string(),
                }],
            },
            push_notification_config: push_config,
        },
    }
}

/// Simple random ID generator (avoids uuid dependency for now).
fn rand_id() -> u128 {
    use std::time::{SystemTime, UNIX_EPOCH};
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_nanos();
    nanos ^ (std::process::id() as u128)
}

// ---------------------------------------------------------------------------
// Task delegation
// ---------------------------------------------------------------------------

/// Delegate a task to a remote A2A Agent and return formatted tool output.
///
/// On error, returns an error string (never panics) so the LLM can decide next steps.
pub async fn delegate_task(
    client: &A2aClient,
    task_text: &str,
    webhook: Option<&WebhookConfig>,
) -> String {
    let request = build_jsonrpc_request(task_text, webhook);
    let url = format!("{}/a2a/jsonrpc", client.base_url.trim_end_matches('/'));

    let http = match reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(120))
        .build()
    {
        Ok(c) => c,
        Err(e) => return format!("[{}] Error: {}", client.card.name, e),
    };

    let response = match http.post(&url).json(&request).send().await {
        Ok(resp) => resp,
        Err(e) => return format!("[{}] Error: {}", client.card.name, e),
    };

    if !response.status().is_success() {
        return format!(
            "[{}] Error: HTTP {}",
            client.card.name,
            response.status()
        );
    }

    let body = match response.text().await {
        Ok(b) => b,
        Err(e) => return format!("[{}] Error reading response: {}", client.card.name, e),
    };

    let progress = parse_response_to_progress(&body, &client.card.name);
    format_tool_output(&progress)
}

/// Parse a response body into a TaskProgress record.
fn parse_response_to_progress(body: &str, agent_name: &str) -> TaskProgress {
    let mut progress = TaskProgress {
        task_id: String::new(),
        agent_name: agent_name.to_string(),
        states: Vec::new(),
        artifacts: Vec::new(),
        result_text: None,
    };

    // Try parsing as newline-delimited events (SSE-like)
    let events = parse_events(body);
    if events.is_empty() {
        // Fallback: treat entire body as result text
        progress.result_text = Some(body.to_string());
        return progress;
    }

    for event in events {
        match event {
            A2aEvent::Task(te) => {
                progress.task_id = te.id;
                progress.states.push(te.status.state);
            }
            A2aEvent::StatusUpdate(su) => {
                if !progress.states.contains(&su.status.state) {
                    progress.states.push(su.status.state.clone());
                }
                if su.is_final {
                    if let Some(msg) = &su.status.message {
                        let text = extract_text_from_parts(&msg.parts);
                        if !text.is_empty() {
                            progress.result_text = Some(text);
                        }
                    }
                }
            }
            A2aEvent::ArtifactUpdate(au) => {
                let name = au.artifact.name.unwrap_or_else(|| "artifact".to_string());
                progress.artifacts.push(name);
                // Extract text from artifact parts as result
                for part in &au.artifact.parts {
                    let ArtifactPart::Text { text } = part;
                    progress.result_text = Some(text.clone());
                }
            }
            A2aEvent::Message(me) => {
                let text = extract_text_from_parts(&me.parts);
                if !text.is_empty() {
                    progress.result_text = Some(text);
                }
            }
        }
    }

    progress
}

fn extract_text_from_parts(parts: &[StatusPart]) -> String {
    parts
        .iter()
        .filter_map(|p| match p {
            StatusPart::Text { text } => Some(text.as_str()),
        })
        .collect::<Vec<_>>()
        .join("")
}

/// Parse events from response body (tries SSE lines, then JSON-RPC wrapper).
fn parse_events(body: &str) -> Vec<A2aEvent> {
    // Try SSE line-by-line first
    let mut events = Vec::new();
    for line in body.lines() {
        let trimmed = line.trim();
        let data = if trimmed.starts_with("data:") {
            trimmed.trim_start_matches("data:").trim()
        } else {
            trimmed
        };
        if let Ok(event) = serde_json::from_str::<A2aEvent>(data) {
            events.push(event);
        }
    }

    if !events.is_empty() {
        return events;
    }

    // Try as JSON-RPC response with embedded result
    if let Ok(val) = serde_json::from_str::<serde_json::Value>(body) {
        if let Some(result) = val.get("result") {
            if let Ok(event) = serde_json::from_value::<A2aEvent>(result.clone()) {
                return vec![event];
            }
            if let Ok(evts) = serde_json::from_value::<Vec<A2aEvent>>(result.clone()) {
                return evts;
            }
        }
    }

    Vec::new()
}

// ---------------------------------------------------------------------------
// Output formatting
// ---------------------------------------------------------------------------

/// Format a TaskProgress into the standardized tool output string.
///
/// Format: `[{agent_name}] Task {task_id}: {states ' → '}\nResult: {result_text}`
pub fn format_tool_output(progress: &TaskProgress) -> String {
    let states_chain = if progress.states.is_empty() {
        String::new()
    } else {
        progress.states.join(" → ")
    };

    let result = progress.result_text.as_deref().unwrap_or("(no result)");

    if progress.task_id.is_empty() {
        format!("[{}] Result: {}", progress.agent_name, result)
    } else {
        format!(
            "[{}] Task {}: {}\nResult: {}",
            progress.agent_name, progress.task_id, states_chain, result
        )
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn format_output_with_progress() {
        let p = TaskProgress {
            task_id: "abc-123".into(),
            agent_name: "Weather Agent".into(),
            states: vec!["submitted".into(), "working".into(), "completed".into()],
            artifacts: vec![],
            result_text: Some("Sunny in Tokyo".into()),
        };
        let output = format_tool_output(&p);
        assert_eq!(
            output,
            "[Weather Agent] Task abc-123: submitted → working → completed\nResult: Sunny in Tokyo"
        );
    }

    #[test]
    fn format_output_no_task_id() {
        let p = TaskProgress {
            task_id: String::new(),
            agent_name: "Test".into(),
            states: vec![],
            artifacts: vec![],
            result_text: Some("hello".into()),
        };
        assert_eq!(format_tool_output(&p), "[Test] Result: hello");
    }

    #[test]
    fn format_output_no_result() {
        let p = TaskProgress {
            task_id: "x".into(),
            agent_name: "A".into(),
            states: vec!["submitted".into()],
            artifacts: vec![],
            result_text: None,
        };
        assert!(format_tool_output(&p).contains("(no result)"));
    }

    #[test]
    fn build_request_without_webhook() {
        let req = build_jsonrpc_request("do something", None);
        assert_eq!(req.jsonrpc, "2.0");
        assert_eq!(req.method, "message/send");
        assert_eq!(req.params.message.role, "user");
        assert!(req.params.push_notification_config.is_none());
    }

    #[test]
    fn build_request_with_webhook() {
        let wh = WebhookConfig {
            enabled: true,
            url: "http://hook".into(),
            token: "tok".into(),
        };
        let req = build_jsonrpc_request("task", Some(&wh));
        let push = req.params.push_notification_config.unwrap();
        assert_eq!(push.url, "http://hook");
        assert_eq!(push.token, "tok");
    }

    #[test]
    fn build_request_webhook_disabled() {
        let wh = WebhookConfig {
            enabled: false,
            url: "http://hook".into(),
            token: "tok".into(),
        };
        let req = build_jsonrpc_request("task", Some(&wh));
        assert!(req.params.push_notification_config.is_none());
    }
}
