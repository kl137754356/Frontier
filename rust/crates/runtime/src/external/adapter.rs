//! External Agent proxy adapter.
//!
//! Calls the backend proxy endpoint `/api/v1/proxy/agent/{id}/chat`.
//! API Keys are held by the proxy, never by claw.

use serde::{Deserialize, Serialize};

// ---------------------------------------------------------------------------
// Request / Response types
// ---------------------------------------------------------------------------

#[derive(Debug, Serialize)]
pub struct ExternalChatRequest {
    pub message: String,
    #[serde(default)]
    pub history: Vec<ChatMessage>,
    pub stream: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Debug, Deserialize)]
pub struct ExternalChatResponse {
    pub reply: String,
    #[serde(default)]
    pub status: String,
}

// ---------------------------------------------------------------------------
// Proxy call
// ---------------------------------------------------------------------------

/// Call an external agent via the backend proxy.
///
/// Returns a formatted tool output string. On error, returns an error description
/// (never panics) so the LLM can decide next steps.
pub async fn call_external_agent(
    proxy_base_url: &str,
    agent_id: &str,
    message: &str,
) -> String {
    let url = format!(
        "{}/{}/chat",
        proxy_base_url.trim_end_matches('/'),
        agent_id
    );
    let body = ExternalChatRequest {
        message: message.to_string(),
        history: Vec::new(),
        stream: false,
    };

    let client = match reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(60))
        .build()
    {
        Ok(c) => c,
        Err(e) => return format!("[外部 Agent] Error: {}", e),
    };

    match client.post(&url).json(&body).send().await {
        Ok(resp) if resp.status().is_success() => {
            match resp.json::<ExternalChatResponse>().await {
                Ok(chat_resp) => {
                    format!(
                        "[外部 Agent] processing → success\nResult: {}",
                        chat_resp.reply
                    )
                }
                Err(e) => format!("[外部 Agent] Error: failed to parse response: {}", e),
            }
        }
        Ok(resp) => {
            let status = resp.status();
            let body_text = resp.text().await.unwrap_or_default();
            format!("[外部 Agent] Error: HTTP {} - {}", status, body_text)
        }
        Err(e) => format!("[外部 Agent] Error: {}", e),
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn request_serialization() {
        let req = ExternalChatRequest {
            message: "hello".into(),
            history: vec![ChatMessage {
                role: "user".into(),
                content: "prior".into(),
            }],
            stream: false,
        };
        let json = serde_json::to_value(&req).unwrap();
        assert_eq!(json["message"], "hello");
        assert_eq!(json["stream"], false);
        assert_eq!(json["history"][0]["role"], "user");
    }
}
