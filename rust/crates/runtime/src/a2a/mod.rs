//! A2A (Agent2Agent) protocol integration.
//!
//! Provides optional remote Agent discovery and task delegation via the A2A protocol.
//! When configured, claw registers handoff tools that allow the LLM to delegate tasks
//! to remote A2A Agents or external OpenAI-compatible platforms via a backend proxy.
//!
//! **Zero side-effect guarantee:** If the config file is missing, empty, or all agents
//! are unreachable (with `fail_fast = false`), the tool list and system prompt remain
//! identical to the pre-integration state.

pub mod config;
pub mod client;
pub mod delegate;
pub mod tools;

// Re-export primary types for convenience.
pub use config::{load_a2a_config, is_a2a_enabled, A2aConfig, A2aAgentEntry, A2aOptions, WebhookConfig};
pub use client::{create_a2a_clients, A2aClient};
pub use delegate::{delegate_task, format_tool_output, TaskProgress};
pub use tools::{build_handoff_tools, build_system_prompt_supplement, to_snake_case};

use std::sync::{Mutex, OnceLock};

// ---------------------------------------------------------------------------
// Global A2A client registry (set at startup, read at tool execution time)
// ---------------------------------------------------------------------------

static A2A_CLIENTS: Mutex<Vec<(String, String, String)>> = Mutex::new(Vec::new());
static A2A_WEBHOOK: OnceLock<Option<WebhookConfig>> = OnceLock::new();

/// Store A2A clients globally after startup initialization.
pub fn register_clients(clients: Vec<A2aClient>, webhook: Option<WebhookConfig>) {
    let mut store = A2A_CLIENTS.lock().unwrap_or_else(|e| e.into_inner());
    store.clear();
    for c in &clients {
        store.push((c.base_url.clone(), c.card.name.clone(), c.id.clone()));
    }
    let _ = A2A_WEBHOOK.set(webhook);
}

/// Look up an A2A client by tool name (snake_case of card.name).
/// Returns the client's base_url, card name, and id if found.
pub fn find_client_by_tool_name(tool_name: &str) -> Option<(String, String, String)> {
    let store = A2A_CLIENTS.lock().ok()?;
    store.iter().find_map(|(base_url, card_name, id)| {
        let expected = to_snake_case(card_name);
        if expected == tool_name {
            Some((base_url.clone(), card_name.clone(), id.clone()))
        } else {
            None
        }
    })
}

/// Check if a tool name corresponds to a registered A2A handoff tool.
pub fn is_a2a_tool(tool_name: &str) -> bool {
    find_client_by_tool_name(tool_name).is_some()
}

/// Execute an A2A handoff tool by delegating to the remote agent.
pub async fn execute_a2a_tool(tool_name: &str, task_text: &str) -> String {
    let (base_url, card_name, _id) = match find_client_by_tool_name(tool_name) {
        Some(info) => info,
        None => return format!("[A2A] Error: no client registered for tool '{}'", tool_name),
    };

    let card = client::AgentCard {
        name: card_name.clone(),
        description: String::new(),
        skills: Vec::new(),
    };
    let temp_client = A2aClient {
        id: tool_name.to_string(),
        base_url,
        card,
    };

    let webhook = A2A_WEBHOOK.get().and_then(|w| w.as_ref());
    delegate_task(&temp_client, task_text, webhook).await
}
