// Shared types for claw-web-chat

/**
 * Token usage statistics for a message or session.
 */
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number; // estimated cost (USD)
}

/**
 * A chat session containing metadata and cumulative usage.
 */
export interface Session {
  id: string; // UUID v4
  name: string; // user-defined or auto-generated
  createdAt: number; // creation timestamp (ms)
  updatedAt: number; // last update timestamp (ms)
  lastMessagePreview: string; // last message preview (first 50 chars)
  messageCount: number; // message count
  unread: boolean; // has unread messages
  tokenUsage: TokenUsage; // cumulative token usage
}

/**
 * Content block types within a message.
 */
export type MessageContent =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: string }
  | { type: 'tool_result'; toolUseId: string; toolName: string; output: string; isError: boolean }
  | { type: 'a2ui'; operations: any[] };

/**
 * A single message in a session.
 */
export interface Message {
  id: string; // UUID v4
  sessionId: string; // session ID
  role: 'user' | 'assistant' | 'system';
  content: MessageContent[]; // content blocks
  thinking?: string; // thinking process (if any)
  timestamp: number; // timestamp (ms)
  usage?: TokenUsage; // token usage for this message
  status: 'sending' | 'streaming' | 'complete' | 'error';
}

/**
 * A configuration profile for connecting to a claw-code instance.
 */
export interface ConfigProfile {
  id: string; // profile ID
  name: string; // profile name
  baseUrl: string; // API baseURL (backend address)
  clawHost: string; // claw-code TCP host
  clawPort: number; // claw-code TCP port
  model: string; // model name
  apiKey?: string; // API Key (optional)
}

/**
 * Application-level configuration.
 */
export interface AppConfig {
  activeProfile: string; // active profile ID
  profiles: ConfigProfile[]; // profile list
  theme: 'light' | 'dark'; // theme
  sidebarWidth: number; // sidebar width (px)
  sidebarCollapsed: boolean; // sidebar collapsed
}

/**
 * Represents a tool call displayed in the UI.
 */
export interface ToolCall {
  id: string; // tool call ID
  name: string; // tool name (e.g., "bash", "read_file", "mcp:server/tool")
  input: Record<string, any>; // tool input parameters
  output?: string; // tool output
  isError: boolean; // is error
  status: 'running' | 'complete' | 'error';
  startTime: number; // start time
  endTime?: number; // end time
  collapsed: boolean; // UI collapsed state
}

/**
 * A slash command definition.
 */
export interface SlashCommand {
  name: string; // command name (without /)
  description: string; // command description
  handler: 'local' | 'remote'; // local or remote handling
}

/**
 * Available slash commands.
 */
export const SLASH_COMMANDS: SlashCommand[] = [
  { name: 'help', description: '显示帮助信息', handler: 'local' },
  { name: 'status', description: '显示连接状态和模型信息', handler: 'local' },
  { name: 'compact', description: '压缩会话上下文', handler: 'remote' },
  { name: 'clear', description: '清空当前会话', handler: 'local' },
  { name: 'cost', description: '显示 token 使用和费用', handler: 'local' },
  { name: 'skills', description: '列出可用技能', handler: 'remote' },
  { name: 'plugins', description: '列出已安装插件', handler: 'remote' },
  { name: 'mcp', description: '显示 MCP 服务器状态', handler: 'remote' },
  { name: 'version', description: '显示版本信息', handler: 'remote' },
  { name: 'export', description: '导出会话为 JSON', handler: 'local' },
];
