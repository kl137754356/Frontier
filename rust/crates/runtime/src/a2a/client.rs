//! A2A client creation and Agent Card fetching.
//!
//! Creates HTTP clients for each enabled native agent, fetches their Agent Card
//! at startup, and caches the result for the process lifetime.

use super::config::A2aConfig;
use serde::Deserialize;

// ---------------------------------------------------------------------------
// Agent Card (fetched from remote)
// ---------------------------------------------------------------------------

/// Remote Agent's capability description fetched from `/.well-known/agent-card.json`.
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct AgentCard {
    pub name: String,
    pub description: String,
    #[serde(default)]
    pub skills: Vec<AgentSkill>,
}

/// A single skill advertised by the remote Agent.
#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct AgentSkill {
    pub name: String,
    #[serde(default)]
    pub description: String,
}

// ---------------------------------------------------------------------------
// A2A Client (runtime structure)
// ---------------------------------------------------------------------------

/// A connected A2A client with cached Agent Card.
pub struct A2aClient {
    pub id: String,
    pub base_url: String,
    pub card: AgentCard,
}

// ---------------------------------------------------------------------------
// Client creation
// ---------------------------------------------------------------------------

/// Create A2A clients for all enabled native agents in the config.
///
/// Fetches Agent Cards in parallel. Agents that fail to connect are skipped
/// (unless `options.fail_fast` is true, in which case the function returns an error).
///
/// Returns an empty vec when no agents are reachable (zero side-effect).
pub async fn create_a2a_clients(config: &A2aConfig) -> Result<Vec<A2aClient>, String> {
    let enabled_natives: Vec<_> = config
        .agents
        .iter()
        .filter(|a| a.enabled && a.agent_type == "native" && a.url.is_some())
        .collect();

    if enabled_natives.is_empty() {
        log::info!("[A2A] No enabled native agents, skipping client creation");
        return Ok(Vec::new());
    }

    let timeout = std::time::Duration::from_millis(config.options.connect_timeout_ms);
    let mut clients = Vec::new();

    // Fetch Agent Cards (sequential for simplicity; can be parallelized with tokio::spawn)
    for agent in &enabled_natives {
        let base_url = agent.url.as_deref().unwrap();
        let card_url = format!(
            "{}/.well-known/agent-card.json",
            base_url.trim_end_matches('/')
        );

        let http_client = match reqwest::Client::builder()
            .connect_timeout(timeout)
            .timeout(timeout)
            .build()
        {
            Ok(c) => c,
            Err(e) => {
                let msg = format!("[A2A] Failed to build HTTP client for {}: {}", agent.id, e);
                if config.options.fail_fast {
                    return Err(msg);
                }
                log::warn!("{}", msg);
                continue;
            }
        };

        match http_client.get(&card_url).send().await {
            Ok(resp) if resp.status().is_success() => match resp.json::<AgentCard>().await {
                Ok(card) => {
                    log::info!("[A2A] Connected: {} ({})", card.name, base_url);
                    clients.push(A2aClient {
                        id: agent.id.clone(),
                        base_url: base_url.to_string(),
                        card,
                    });
                }
                Err(e) => {
                    let msg = format!("[A2A] Failed to parse Agent Card from {}: {}", card_url, e);
                    if config.options.fail_fast {
                        return Err(msg);
                    }
                    log::warn!("{}", msg);
                }
            },
            Ok(resp) => {
                let msg = format!(
                    "[A2A] Agent Card request to {} returned status {}",
                    card_url,
                    resp.status()
                );
                if config.options.fail_fast {
                    return Err(msg);
                }
                log::warn!("{}", msg);
            }
            Err(e) => {
                let msg = format!("[A2A] Agent Card request to {} failed: {}", card_url, e);
                if config.options.fail_fast {
                    return Err(msg);
                }
                log::warn!("{}", msg);
            }
        }
    }

    if clients.is_empty() {
        log::info!("[A2A] No agents reachable, tool list unchanged");
    }

    Ok(clients)
}
