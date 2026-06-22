//! A2A configuration loading and validation.
//!
//! Reads `.claw/a2a-agents.json` with the following path priority:
//! 1. Explicit path parameter
//! 2. Environment variable `A2A_CONFIG_PATH`
//! 3. Default: `{workspace}/.claw/a2a-agents.json`

use serde::Deserialize;
use std::path::{Path, PathBuf};

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

/// Top-level A2A configuration file structure.
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct A2aConfig {
    pub agents: Vec<A2aAgentEntry>,
    #[serde(default)]
    pub webhook: Option<WebhookConfig>,
    #[serde(default)]
    pub options: A2aOptions,
}

/// A single agent record in the config file.
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct A2aAgentEntry {
    pub id: String,
    #[serde(rename = "type")]
    pub agent_type: String,
    #[serde(default)]
    pub url: Option<String>,
    #[serde(default = "default_true")]
    pub enabled: bool,
}

/// Webhook push notification configuration.
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct WebhookConfig {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub url: String,
    #[serde(default)]
    pub token: String,
}

/// Options controlling A2A startup behavior.
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct A2aOptions {
    #[serde(default = "default_connect_timeout")]
    pub connect_timeout_ms: u64,
    #[serde(default)]
    pub fail_fast: bool,
}

impl Default for A2aOptions {
    fn default() -> Self {
        Self {
            connect_timeout_ms: default_connect_timeout(),
            fail_fast: false,
        }
    }
}

fn default_true() -> bool {
    true
}

fn default_connect_timeout() -> u64 {
    5000
}

// ---------------------------------------------------------------------------
// Path resolution
// ---------------------------------------------------------------------------

/// Resolve the config file path using the priority chain.
fn resolve_config_path(explicit_path: Option<&Path>) -> PathBuf {
    if let Some(p) = explicit_path {
        return p.to_path_buf();
    }
    if let Ok(env_path) = std::env::var("A2A_CONFIG_PATH") {
        return PathBuf::from(env_path);
    }
    let workspace = std::env::current_dir().unwrap_or_default();
    workspace.join(".claw").join("a2a-agents.json")
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

/// Load A2A configuration from disk.
///
/// Returns `None` (without panicking) when the file is missing or contains
/// invalid JSON. This guarantees zero side-effects on the caller.
pub fn load_a2a_config(explicit_path: Option<&Path>) -> Option<A2aConfig> {
    let path = resolve_config_path(explicit_path);
    let content = match std::fs::read_to_string(&path) {
        Ok(c) => c,
        Err(_) => {
            log::info!("[A2A] Config not found at {:?}, skipping", path);
            return None;
        }
    };
    match serde_json::from_str::<A2aConfig>(&content) {
        Ok(config) => Some(config),
        Err(e) => {
            log::warn!("[A2A] Config parse error at {:?}: {}", path, e);
            None
        }
    }
}

/// Returns `true` if the config is present and contains at least one enabled
/// native agent with a URL.
pub fn is_a2a_enabled(config: &Option<A2aConfig>) -> bool {
    config.as_ref().map_or(false, |c| {
        c.agents
            .iter()
            .any(|a| a.enabled && a.agent_type == "native" && a.url.is_some())
    })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    #[test]
    fn parses_valid_config() {
        let json = r#"{
            "agents": [
                {"id": "weather", "type": "native", "url": "http://localhost:4000", "enabled": true}
            ],
            "options": {"connectTimeoutMs": 3000, "failFast": true}
        }"#;
        let config: A2aConfig = serde_json::from_str(json).unwrap();
        assert_eq!(config.agents.len(), 1);
        assert_eq!(config.agents[0].id, "weather");
        assert_eq!(config.options.connect_timeout_ms, 3000);
        assert!(config.options.fail_fast);
    }

    #[test]
    fn enabled_defaults_to_true() {
        let json = r#"{"id": "x", "type": "native", "url": "http://localhost:1"}"#;
        let entry: A2aAgentEntry = serde_json::from_str(json).unwrap();
        assert!(entry.enabled);
    }

    #[test]
    fn options_default_values() {
        let json = r#"{"agents": []}"#;
        let config: A2aConfig = serde_json::from_str(json).unwrap();
        assert_eq!(config.options.connect_timeout_ms, 5000);
        assert!(!config.options.fail_fast);
    }

    #[test]
    fn is_enabled_with_valid_native_agent() {
        let config = Some(A2aConfig {
            agents: vec![A2aAgentEntry {
                id: "test".into(),
                agent_type: "native".into(),
                url: Some("http://localhost:4000".into()),
                enabled: true,
            }],
            webhook: None,
            options: A2aOptions::default(),
        });
        assert!(is_a2a_enabled(&config));
    }

    #[test]
    fn is_not_enabled_when_all_disabled() {
        let config = Some(A2aConfig {
            agents: vec![A2aAgentEntry {
                id: "test".into(),
                agent_type: "native".into(),
                url: Some("http://localhost:4000".into()),
                enabled: false,
            }],
            webhook: None,
            options: A2aOptions::default(),
        });
        assert!(!is_a2a_enabled(&config));
    }

    #[test]
    fn is_not_enabled_when_empty() {
        let config = Some(A2aConfig {
            agents: vec![],
            webhook: None,
            options: A2aOptions::default(),
        });
        assert!(!is_a2a_enabled(&config));
    }

    #[test]
    fn is_not_enabled_when_none() {
        assert!(!is_a2a_enabled(&None));
    }

    #[test]
    fn load_returns_none_for_missing_file() {
        let path = Path::new("/nonexistent/a2a-agents.json");
        assert!(load_a2a_config(Some(path)).is_none());
    }

    #[test]
    fn load_returns_none_for_invalid_json() {
        let dir = std::env::temp_dir().join("a2a_test_invalid");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("bad.json");
        let mut f = std::fs::File::create(&path).unwrap();
        f.write_all(b"not valid json {{{").unwrap();
        assert!(load_a2a_config(Some(&path)).is_none());
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn load_succeeds_for_valid_file() {
        let dir = std::env::temp_dir().join("a2a_test_valid");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("ok.json");
        let mut f = std::fs::File::create(&path).unwrap();
        f.write_all(br#"{"agents":[{"id":"w","type":"native","url":"http://x"}]}"#)
            .unwrap();
        let config = load_a2a_config(Some(&path));
        assert!(config.is_some());
        assert_eq!(config.unwrap().agents[0].id, "w");
        let _ = std::fs::remove_dir_all(&dir);
    }
}
