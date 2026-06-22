//! Handoff tool generation from Agent Cards.
//!
//! Converts each connected A2A Agent into a `RuntimeToolDefinition` that the LLM
//! can invoke via function calling.

use super::client::{A2aClient, AgentCard};
use serde_json::json;

// ---------------------------------------------------------------------------
// Snake case conversion
// ---------------------------------------------------------------------------

/// Convert an Agent Card name to a snake_case tool name.
///
/// Rules: lowercase, spaces/dashes become underscores, no leading/trailing/consecutive underscores,
/// only alphanumeric and underscore characters kept.
pub fn to_snake_case(name: &str) -> String {
    let mut result = String::with_capacity(name.len());
    let mut last_was_underscore = true; // prevents leading underscore

    for ch in name.chars() {
        if ch.is_alphanumeric() {
            result.push(ch.to_lowercase().next().unwrap_or(ch));
            last_was_underscore = false;
        } else if !last_was_underscore {
            result.push('_');
            last_was_underscore = true;
        }
    }

    // Remove trailing underscore
    if result.ends_with('_') {
        result.pop();
    }

    result
}

// ---------------------------------------------------------------------------
// Tool description
// ---------------------------------------------------------------------------

fn build_tool_description(card: &AgentCard) -> String {
    let mut desc = card.description.clone();
    if !card.skills.is_empty() {
        desc.push_str(" Skills: ");
        let skills_text: Vec<String> = card
            .skills
            .iter()
            .map(|s| format!("{}: {}", s.name, s.description))
            .collect();
        desc.push_str(&skills_text.join("; "));
    }
    desc
}

// ---------------------------------------------------------------------------
// RuntimeToolDefinition generation
// ---------------------------------------------------------------------------

/// A minimal tool definition that matches the shape expected by `GlobalToolRegistry::with_runtime_tools`.
#[derive(Debug, Clone, PartialEq)]
pub struct A2aToolDefinition {
    pub name: String,
    pub description: String,
    pub input_schema: serde_json::Value,
}

/// Build handoff tool definitions for all connected A2A clients.
pub fn build_handoff_tools(clients: &[A2aClient]) -> Vec<A2aToolDefinition> {
    clients
        .iter()
        .map(|client| {
            let tool_name = to_snake_case(&client.card.name);
            let description = build_tool_description(&client.card);
            let input_schema = json!({
                "type": "object",
                "properties": {
                    "task": {
                        "type": "string",
                        "description": format!("委派给 {} 的完整自然语言任务", client.card.name)
                    }
                },
                "required": ["task"]
            });

            A2aToolDefinition {
                name: tool_name,
                description,
                input_schema,
            }
        })
        .collect()
}

/// Generate system prompt supplement text describing available remote agents.
///
/// Returns `None` when no agents are available (zero side-effect on prompt).
pub fn build_system_prompt_supplement(clients: &[A2aClient]) -> Option<String> {
    if clients.is_empty() {
        return None;
    }

    let mut lines = vec![
        "\n## 远程专家委派".to_string(),
        "你可以将专业任务委派给以下远程专家 Agent：".to_string(),
    ];

    for client in clients {
        let tool_name = to_snake_case(&client.card.name);
        lines.push(format!("- 使用 `{}` 处理与「{}」相关的任务", tool_name, client.card.description));
    }

    lines.push("\n对于多步任务，按顺序调用工具，并将上一步结果传递给下一步。".to_string());
    lines.push("在回复中说明每个结果来自哪个专家 Agent。".to_string());

    Some(lines.join("\n"))
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use super::super::client::{AgentCard, AgentSkill};

    #[test]
    fn snake_case_basic() {
        assert_eq!(to_snake_case("Weather Agent"), "weather_agent");
        assert_eq!(to_snake_case("file-write"), "file_write");
        assert_eq!(to_snake_case("MyTool"), "my_tool");
    }

    #[test]
    fn snake_case_no_leading_trailing_underscore() {
        assert_eq!(to_snake_case(" hello "), "hello");
        assert_eq!(to_snake_case("---test---"), "test");
    }

    #[test]
    fn snake_case_no_consecutive_underscores() {
        assert_eq!(to_snake_case("a  b"), "a_b");
        assert_eq!(to_snake_case("a--b"), "a_b");
    }

    #[test]
    fn build_description_with_skills() {
        let card = AgentCard {
            name: "Test".into(),
            description: "Does testing.".into(),
            skills: vec![AgentSkill {
                name: "unit".into(),
                description: "runs unit tests".into(),
            }],
        };
        let desc = build_tool_description(&card);
        assert!(desc.contains("Does testing."));
        assert!(desc.contains("unit: runs unit tests"));
    }

    #[test]
    fn build_tools_generates_correct_count() {
        let clients = vec![
            A2aClient {
                id: "w".into(),
                base_url: "http://localhost:4000".into(),
                card: AgentCard {
                    name: "Weather Agent".into(),
                    description: "Weather info".into(),
                    skills: vec![],
                },
            },
        ];
        let tools = build_handoff_tools(&clients);
        assert_eq!(tools.len(), 1);
        assert_eq!(tools[0].name, "weather_agent");
    }

    #[test]
    fn supplement_none_when_empty() {
        assert!(build_system_prompt_supplement(&[]).is_none());
    }

    #[test]
    fn supplement_contains_tool_name() {
        let clients = vec![A2aClient {
            id: "w".into(),
            base_url: "http://x".into(),
            card: AgentCard {
                name: "Weather Agent".into(),
                description: "weather".into(),
                skills: vec![],
            },
        }];
        let text = build_system_prompt_supplement(&clients).unwrap();
        assert!(text.contains("weather_agent"));
    }
}
