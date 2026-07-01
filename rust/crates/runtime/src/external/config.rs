//! External agent configuration loading.
//!
//! Reads `.claw/external-agents.json` containing metadata (no API keys).
//! Rejects config files that contain api_key fields for security.

use serde::Deserialize;
use std::path::{Path, PathBuf};
use std::sync::OnceLock;

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

/// Top-level external agents configuration.
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct ExternalConfig {
    #[serde(rename = "proxyBaseUrl")]
    pub proxy_base_url: String,
    pub agents: Vec<ExternalAgentEntry>,
}

/// A single external agent entry (metadata only, no secrets).
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct ExternalAgentEntry {
    pub id: String,
    #[serde(rename = "type")]
    pub agent_type: String,
    pub name: String,
    pub description: String,
    #[serde(default = "default_true")]
    pub enabled: bool,
}

fn default_true() -> bool {
    true
}

// ---------------------------------------------------------------------------
// Global registry
// ---------------------------------------------------------------------------

static EXTERNAL_CONFIG: OnceLock<ExternalConfig> = OnceLock::new();

/// Store external config globally for tool execution dispatch.
pub fn register_external_config(config: ExternalConfig) {
    let _ = EXTERNAL_CONFIG.set(config);
}

/// Look up an external agent by tool name (snake_case of id).
/// Returns (proxy_base_url, agent_id, agent_name) if found.
pub fn find_external_agent_by_tool_name(tool_name: &str) -> Option<(String, String, String)> {
    let config = EXTERNAL_CONFIG.get()?;
    config.agents.iter().find_map(|a| {
        let expected = crate::a2a::to_snake_case(&a.id);
        if expected == tool_name && a.enabled {
            Some((config.proxy_base_url.clone(), a.id.clone(), a.name.clone()))
        } else {
            None
        }
    })
}

/// Check if a tool name corresponds to a registered external agent.
pub fn is_external_tool(tool_name: &str) -> bool {
    find_external_agent_by_tool_name(tool_name).is_some()
}

// ---------------------------------------------------------------------------
// Path resolution
// ---------------------------------------------------------------------------

fn resolve_external_config_path(explicit_path: Option<&Path>) -> PathBuf {
    if let Some(p) = explicit_path {
        return p.to_path_buf();
    }
    let workspace = std::env::current_dir().unwrap_or_default();
    workspace.join(".claw").join("external-agents.json")
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

/// Load external agents configuration.
///
/// Returns `None` if the file is missing, invalid, or contains api_key fields
/// (security rejection). Zero side-effect on failure.
pub fn load_external_config(explicit_path: Option<&Path>) -> Option<ExternalConfig> {
    let path = resolve_external_config_path(explicit_path);
    let content = match std::fs::read_to_string(&path) {
        Ok(c) => c,
        Err(_) => {
            log::info!("[External] Config not found at {:?}, skipping", path);
            return None;
        }
    };

    // Security check: reject configs containing api_key
    if content.contains("\"api_key\"") || content.contains("\"apiKey\"") {
        log::warn!(
            "[External] Config at {:?} contains api_key field, rejected for security",
            path
        );
        return None;
    }

    match serde_json::from_str::<ExternalConfig>(&content) {
        Ok(config) => Some(config),
        Err(e) => {
            log::warn!("[External] Config parse error at {:?}: {}", path, e);
            None
        }
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    #[test]
    fn parses_valid_external_config() {
        let json = r#"{
            "proxyBaseUrl": "http://localhost:8081/api/v1/proxy/agent",
            "agents": [
                {"id": "fastgpt", "type": "openai_compatible", "name": "FastGPT", "description": "Docs QA"}
            ]
        }"#;
        let config: ExternalConfig = serde_json::from_str(json).unwrap();
        assert_eq!(config.agents.len(), 1);
        assert_eq!(config.agents[0].id, "fastgpt");
        assert_eq!(config.proxy_base_url, "http://localhost:8081/api/v1/proxy/agent");
    }

    #[test]
    fn enabled_defaults_to_true() {
        let json = r#"{"id": "x", "type": "openai_compatible", "name": "X", "description": "y"}"#;
        let entry: ExternalAgentEntry = serde_json::from_str(json).unwrap();
        assert!(entry.enabled);
    }

    #[test]
    fn rejects_config_with_api_key() {
        let dir = std::env::temp_dir().join("ext_test_apikey");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("bad.json");
        let mut f = std::fs::File::create(&path).unwrap();
        f.write_all(br#"{"proxyBaseUrl":"x","agents":[],"api_key":"secret"}"#).unwrap();
        assert!(load_external_config(Some(&path)).is_none());
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn rejects_config_with_camel_case_api_key() {
        let dir = std::env::temp_dir().join("ext_test_apikey2");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("bad2.json");
        let mut f = std::fs::File::create(&path).unwrap();
        f.write_all(br#"{"proxyBaseUrl":"x","agents":[],"apiKey":"secret"}"#).unwrap();
        assert!(load_external_config(Some(&path)).is_none());
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn returns_none_for_missing_file() {
        assert!(load_external_config(Some(Path::new("/nonexistent/ext.json"))).is_none());
    }
}
