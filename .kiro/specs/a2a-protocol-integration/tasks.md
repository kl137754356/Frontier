# Implementation Plan: A2A Protocol Integration

## Overview

Incrementally implement A2A protocol support in claw.exe (Rust) and backend proxy endpoint (TypeScript). Each phase builds on the previous, maintaining zero side-effects when unconfigured. Property-based tests use proptest crate; backend proxy is in agui-server.ts.

## Tasks

- [x] 1. Phase 1 — Configuration loading and client creation
  - [x] 1.1 Create `src/a2a/mod.rs` module structure and data models
    - Create `src/a2a/mod.rs` with submodule declarations (config, client, tools, delegate)
    - Define all data model structs (`A2aConfig`, `A2aAgentEntry`, `WebhookConfig`, `A2aOptions`, `AgentCard`, `AgentSkill`, `A2aClient`, JSON-RPC types, `TaskProgress`) with serde derives
    - Add helper functions `default_true()` and `default_connect_timeout()`
    - _Requirements: 1.2, 1.5_

  - [x] 1.2 Implement `src/a2a/config.rs` — config path resolution and loading
    - Implement `resolve_config_path()` with priority: explicit_path > env var `A2A_CONFIG_PATH` > default `{workspace}/.claw/a2a-agents.json`
    - Implement `load_a2a_config(explicit_path: Option<&Path>) -> Option<A2aConfig>` with info/warn logging on missing/invalid files
    - Implement `is_a2a_enabled(config: &Option<A2aConfig>) -> bool`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 1.3 Write property tests for config module (P1–P4)
    - **Property 1: Config path resolution priority** — generate random (explicit_path, env_var, default) combinations, verify priority
    - **Validates: Requirements 1.1**
    - **Property 2: Config serialization round-trip** — generate random A2aConfig values, serialize/deserialize, assert equality
    - **Validates: Requirements 1.2, 2.2, 7.2**
    - **Property 3: Invalid JSON input yields None** — generate random non-JSON strings, verify `load_a2a_config` returns None without panic
    - **Validates: Requirements 1.4**
    - **Property 4: Enabled field defaults to true** — generate agent JSON missing "enabled", verify `enabled == true` after deser
    - **Validates: Requirements 1.5**
    - Test file: `rust/crates/runtime/tests/a2a_config_test.rs`

  - [x] 1.4 Implement `src/a2a/client.rs` — Agent Card fetch and client creation
    - Implement `create_a2a_clients(config: &A2aConfig) -> Vec<A2aClient>` with parallel tokio::spawn fetches
    - Apply `connect_timeout_ms` from options
    - Filter only `enabled && agent_type == "native"` agents
    - Handle fail_fast mode: warn + skip vs abort
    - Cache AgentCard in `A2aClient` struct for process lifetime reuse
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 10.1, 10.2, 10.3_

  - [ ]* 1.5 Write property tests for client module (P5–P6)
    - **Property 5: Agent filtering — only enabled native agents get card requests** — generate mixed enabled/disabled/native/non-native config, verify filtered set
    - **Validates: Requirements 2.1, 2.3**
    - **Property 6: Fault tolerance — failFast=false skips unreachable agents** — simulate partial unreachability, verify graceful skip
    - **Validates: Requirements 2.3, 2.4, 6.1, 6.2, 6.3**
    - Test file: `rust/crates/runtime/tests/a2a_client_test.rs`
    - Use `wiremock` for HTTP mock

- [ ] 2. Checkpoint — Phase 1 complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Phase 2 — Handoff tool registration
  - [x] 3.1 Implement `src/a2a/tools.rs` — tool generation and system prompt supplement
    - Implement `to_snake_case(name: &str) -> String` (lowercase + underscore, no leading/trailing/consecutive underscores)
    - Implement `build_handoff_tools(clients: &[A2aClient]) -> Vec<RuntimeToolDefinition>` with tool name, description (description + skills), and single "task" string param schema
    - Implement `build_external_tools(config: &ExternalConfig) -> Vec<RuntimeToolDefinition>`
    - Implement `build_system_prompt_supplement(a2a_clients, external_agents) -> Option<String>` — returns None when both lists empty
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 8.1, 8.2_

  - [ ]* 3.2 Write property tests for tools module (P7–P10)
    - **Property 7: Tool name snake_case conversion** — generate random non-empty strings, verify output has only [a-z0-9_], no leading/trailing/consecutive underscores
    - **Validates: Requirements 3.2**
    - **Property 8: Tool generation count invariant** — generate N clients, verify exactly N tools; M enabled externals → M tools
    - **Validates: Requirements 3.1, 8.1**
    - **Property 9: Tool definition completeness** — generate AgentCard with skills, verify description contains card.description + all skill names; verify schema has "task" required string
    - **Validates: Requirements 3.3, 3.4, 8.2**
    - **Property 10: System prompt supplement contains all tool names** — generate non-empty clients+agents, verify supplement text includes every snake_case tool name
    - **Validates: Requirements 3.6**
    - Test file: `rust/crates/runtime/tests/a2a_tools_test.rs`

  - [x] 3.3 Wire integration hooks 1–2 into claw startup path
    - At hook point 1: call `load_a2a_config(None)` and `load_external_config(None)` after MCP tool loading
    - At hook point 2: conditionally call `create_a2a_clients`, `build_handoff_tools`, `build_external_tools`, append tools to registry, append system prompt supplement
    - Ensure zero side-effect when configs absent or agents empty (no tools added, no prompt change)
    - _Requirements: 3.5, 3.7, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 4. Checkpoint — Phase 2 complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Phase 3 — Delegate engine and progress tracking
  - [x] 5.1 Implement `src/a2a/delegate.rs` — JSON-RPC request construction and task delegation
    - Implement `build_jsonrpc_request(task_text, webhook) -> JsonRpcRequest` with uuid v4, method "message/send", conditional push_notification_config
    - Implement `delegate_task(client, task, webhook) -> String` — POST to `{base_url}/a2a/jsonrpc`, handle errors as `"[{name}] Error: {msg}"`
    - Implement `parse_streaming_response(response, agent_name) -> String` — parse JSON-RPC result or SSE lines into events
    - Implement `parse_events_from_body(body) -> Result<Vec<A2aEvent>, _>` — try JSON-RPC response then SSE line-by-line
    - Implement `format_tool_output(progress: &TaskProgress) -> String` — format as `"[{name}] Task {id}: {states ' → '}\nResult: {text}"`
    - Accumulate TaskProgress: task_id from Task event, states appended in order, artifacts appended, result_text from final event
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 10.4_

  - [ ]* 5.2 Write property tests for delegate module (P11–P13)
    - **Property 11: JSON-RPC request construction** — generate random task text + webhook configs, verify jsonrpc=="2.0", method=="message/send", message contains task text, push_notification_config present iff webhook.enabled==true
    - **Validates: Requirements 4.1, 4.2**
    - **Property 12: Event processing accumulation** — generate random event sequences, verify TaskProgress fields: task_id from first Task, states in order, artifacts appended, result_text from last final event
    - **Validates: Requirements 4.3, 5.1, 5.2, 5.3**
    - **Property 13: format_tool_output matches specification** — generate random TaskProgress, verify output pattern `"[{name}] Task {id}: {states ' → '}\nResult: {text}"`
    - **Validates: Requirements 5.4**
    - Test file: `rust/crates/runtime/tests/a2a_delegate_test.rs`

  - [x] 5.3 Wire integration hook 3 — Handoff tool execution dispatch
    - In the tool execution path (`execute_tool` or equivalent), add branch for handoff tools
    - Look up matching `A2aClient` by tool_name, call `delegate_task`
    - Look up matching external agent by tool_name, call `call_external_agent`
    - Return formatted string as tool result through existing TCP→SSE pipeline
    - _Requirements: 4.1, 4.4, 5.5, 8.3, 8.4, 8.5_

  - [x] 5.4 Wire integration hook 4 — incremental progress via TCP
    - During `delegate_task` streaming, send intermediate status updates through TCP sender
    - Use existing `tool_start` / `tool_end` SSE event flow (no modification to SSE format)
    - _Requirements: 5.5, 6.5_

- [ ] 6. Checkpoint — Phase 3 complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Phase 4 — External Agent support
  - [x] 7.1 Create `src/external/mod.rs` module structure and data models
    - Create `src/external/mod.rs` with submodule declarations (config, adapter)
    - Define `ExternalConfig`, `ExternalAgentEntry`, `ExternalChatRequest`, `ChatMessage`, `ExternalChatResponse` structs
    - _Requirements: 7.2_

  - [x] 7.2 Implement `src/external/config.rs` — external agent config loading
    - Implement `resolve_external_config_path(explicit_path)` — explicit > default `{workspace}/.claw/external-agents.json`
    - Implement `load_external_config(explicit_path) -> Option<ExternalConfig>` — reject if content contains "api_key" or "apiKey" substring
    - Log info on missing, warn on invalid or api_key presence
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 7.3 Write property test for external config (P14)
    - **Property 14: External agent config rejects api_key presence** — generate JSON strings containing "api_key" or "apiKey", verify `load_external_config` returns None
    - **Validates: Requirements 7.4, 9.1**
    - Test file: `rust/crates/runtime/tests/external_config_test.rs`

  - [x] 7.4 Implement `src/external/adapter.rs` — proxy call to backend
    - Implement `call_external_agent(proxy_base_url, agent_id, message, history) -> String`
    - POST to `{proxy_base_url}/{agent_id}/chat` with `ExternalChatRequest` body
    - On success: format as `"[外部 Agent] processing → success\nResult: {reply}"`
    - On failure: format as `"[外部 Agent] Error: {details}"`
    - _Requirements: 8.3, 8.4, 8.5_

  - [ ]* 7.5 Write property test for external adapter (P15)
    - **Property 15: OpenAI payload transformation** — generate random (message, history) pairs, verify transformed messages array == `[...history, {role:"user", content:message}]`
    - **Validates: Requirements 9.4**
    - Test file: `rust/crates/runtime/tests/external_adapter_test.rs`

  - [x] 7.6 Implement backend proxy endpoint in `agui-server.ts`
    - Add `POST /api/v1/proxy/agent/:agentId/chat` route
    - Implement credential store loading (JSON file for local dev)
    - Implement IDOR check: verify agentId belongs to requester, return 404 if not
    - Implement payload transformation: `{message, history}` → `{messages: [...history, {role:"user", content:message}]}` + `Authorization: Bearer {api_key}`
    - Filter api_key from response before returning to client
    - Do NOT modify existing SSE logic or other routes
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 6.5_

- [ ] 8. Final checkpoint — all phases complete
  - Ensure all Rust tests pass (`cargo test`)
  - Ensure TypeScript compiles without errors
  - Verify zero side-effect: remove config files → claw behavior unchanged
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional (property-based tests) and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation between phases
- Property tests use proptest with ≥100 iterations per property
- Dev dependencies needed: `proptest = "1"`, `tokio-test = "0.4"`, `wiremock = "0.6"`
- The backend proxy endpoint (task 7.6) is TypeScript; all other tasks are Rust
