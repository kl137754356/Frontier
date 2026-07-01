// Shared protocol types for claw-web-chat
// Defines WebSocket (Frontend ↔ Backend) and TCP (Backend ↔ claw-code) message types.

// === WebSocket Protocol (Frontend ↔ Backend) ===

// Client → Server Payloads

export interface PromptPayload {
  text: string;
  sessionId: string;
}

export interface ResetPayload {
  sessionId: string;
}

export interface InjectPayload {
  sessionId: string;
  messages: { role: string; text: string }[];
}

export interface SlashPayload {
  command: string;
  sessionId: string;
}

export interface ConfigPayload {
  baseUrl: string;
  clawHost: string;
  clawPort: number;
  model: string;
  apiKey?: string;
}

/**
 * WebSocket message sent from the client (frontend) to the server (backend).
 */
export interface WsClientMessage {
  type: 'prompt' | 'reset' | 'inject' | 'slash_command' | 'connect_config';
  payload: PromptPayload | ResetPayload | InjectPayload | SlashPayload | ConfigPayload;
}

/**
 * WebSocket message sent from the server (backend) to the client (frontend).
 */
export interface WsServerMessage {
  type:
    | 'chunk'
    | 'thinking'
    | 'done'
    | 'error'
    | 'ready'
    | 'tool_start'
    | 'tool_end'
    | 'usage'
    | 'status'
    | 'reconnected'
    | 'reset_done'
    | 'compact_done'
    | 'skills_list'
    | 'mcp_status'
    | 'plugins_list'
    | 'history';
  payload: any;
}

// === TCP Protocol (Backend ↔ claw-code) ===

/**
 * Metadata attached to each prompt for telemetry/session tracking.
 * Passed through TCP to claw-code, which injects these as HTTP headers to gateway.
 */
export interface PromptMeta {
  session_id: string;   // Unique session identifier (= AG-UI threadId)
  turn_id: string;      // Unique turn identifier (= runId)
  turn_index: number;   // Turn sequence number within session (0-based)
  terminal: string;     // Client type: 'web' | 'cli'
}

/**
 * TCP message sent from the backend to claw-code.
 */
export type TcpClientMessage =
  | { type: 'prompt'; text: string; meta?: PromptMeta }
  | { type: 'reset' }
  | { type: 'inject'; messages: { role: string; text: string }[] }
  | { type: 'exit' }
  | { type: 'history' };

/**
 * TCP message sent from claw-code to the backend.
 */
export type TcpServerMessage =
  | { type: 'ready'; model: string; session_id: string }
  | { type: 'chunk'; text: string }
  | { type: 'thinking'; text: string }
  | { type: 'status'; text: string }
  | { type: 'done' }
  | { type: 'error'; text: string }
  | { type: 'usage'; input_tokens: number; output_tokens: number }
  | { type: 'tool_start'; id: string; name: string; input: string }
  | { type: 'tool_end'; id: string; output: string; is_error: boolean }
  | { type: 'reset_done'; session_id: string }
  | { type: 'inject_done'; count: number }
  | { type: 'history'; messages: string[] };
