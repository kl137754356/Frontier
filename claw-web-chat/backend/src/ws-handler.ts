/**
 * WebSocket connection handler for claw-web-chat backend.
 *
 * Manages individual WebSocket connections:
 * - Parses incoming WsClientMessage from the frontend
 * - Forwards messages to TcpBridge (claw-code)
 * - Relays TcpServerMessage responses back to the WebSocket client
 * - Implements 30s ping/pong heartbeat for dead connection detection
 * - Resolves bare-word skill names to skill invocations
 */

import type { WebSocket } from 'ws';
import * as fs from 'fs';
import * as path from 'path';
import type { TcpBridge } from './tcp-bridge.js';
import type { ClawProcess } from './claw-process.js';
import type {
  WsClientMessage,
  WsServerMessage,
  TcpServerMessage,
  PromptPayload,
  ResetPayload,
  InjectPayload,
  SlashPayload,
  ConfigPayload,
} from '../../shared/protocol.js';

const HEARTBEAT_INTERVAL_MS = 30_000;

/** Known skill names resolved from .claw/skills/ directory */
const KNOWN_SKILLS = ['pc-dmis-automation', 'sysinfo'];

/** Lock to prevent concurrent connect_config handling */
let connectingInProgress = false;
let connectingTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Handle a new WebSocket connection.
 * Sets up message forwarding between the WebSocket client and TcpBridge,
 * and starts heartbeat monitoring.
 */
export function handleWebSocketConnection(
  ws: WebSocket,
  tcpBridge: TcpBridge,
  clawProcess: ClawProcess,
  clawPort: number,
  skillsDir?: string,
): void {
  let isAlive = true;

  // --- Heartbeat (30s ping/pong) ---
  const heartbeatInterval = setInterval(() => {
    if (!isAlive) {
      console.warn('[WsHandler] Client heartbeat timeout, terminating connection');
      clearInterval(heartbeatInterval);
      ws.terminate();
      return;
    }
    isAlive = false;
    ws.ping();
  }, HEARTBEAT_INTERVAL_MS);

  ws.on('pong', () => {
    isAlive = true;
  });

  // --- TCP Bridge message listener: forward to WebSocket client ---
  // Remove all previous listeners to avoid duplicate messages
  tcpBridge.removeAllListeners('message');

  let lastPromptText: string | null = null; // Track last prompt for auto-retry
  let autoCompacting = false; // Prevent infinite compact loops

  const onTcpMessage = (msg: TcpServerMessage) => {
    if (ws.readyState !== ws.OPEN) return;

    // Auto-compact on context window overflow
    if (msg.type === 'error' && msg.text.includes('Context window blocked') && !autoCompacting && lastPromptText) {
      autoCompacting = true;
      const retryText = lastPromptText;
      console.log('[WsHandler] Context window blocked, auto-compacting...');

      // Notify frontend about auto-compact
      const compactNotice: WsServerMessage = {
        type: 'status',
        payload: { autoCompact: true, message: 'Context window full. Auto-compacting...' },
      };
      ws.send(JSON.stringify(compactNotice));

      // Send /compact then retry
      tcpBridge.sendPrompt('/compact');

      // Wait for compact to finish, then retry the original prompt
      const compactListener = (compactMsg: TcpServerMessage) => {
        if (compactMsg.type === 'done') {
          tcpBridge.off('message', compactListener);
          console.log('[WsHandler] Compact done, retrying prompt...');
          // Small delay to let claw-code settle
          setTimeout(() => {
            tcpBridge.sendPrompt(retryText);
            autoCompacting = false;
          }, 500);
        } else if (compactMsg.type === 'error') {
          tcpBridge.off('message', compactListener);
          autoCompacting = false;
          // Forward the compact error to frontend
          const wsMsg: WsServerMessage = mapTcpToWsMessage(compactMsg);
          ws.send(JSON.stringify(wsMsg));
        }
        // Forward chunk/other messages from compact to frontend
        if (compactMsg.type === 'chunk') {
          // Don't forward compact chunks to avoid confusing the UI
        }
      };
      tcpBridge.on('message', compactListener);
      return;
    }

    const wsMsg: WsServerMessage = mapTcpToWsMessage(msg);
    ws.send(JSON.stringify(wsMsg));
  };

  tcpBridge.on('message', onTcpMessage);

  // Notify frontend when TCP disconnects
  const onTcpDisconnect = () => {
    if (ws.readyState === ws.OPEN) {
      const msg: WsServerMessage = { type: 'status', payload: { connected: false, disconnected: true } };
      ws.send(JSON.stringify(msg));
    }
  };
  tcpBridge.on('disconnected', onTcpDisconnect);

  // --- WebSocket message handler: parse and forward to TCP ---
  ws.on('message', (data: Buffer | string) => {
    let clientMsg: WsClientMessage;
    try {
      const raw = typeof data === 'string' ? data : data.toString('utf-8');
      console.log('[WsHandler] Received message:', raw.slice(0, 200));
      clientMsg = JSON.parse(raw) as WsClientMessage;
    } catch (err) {
      sendError(ws, 'Invalid message format');
      return;
    }

    // Track last prompt for auto-compact retry
    if (clientMsg.type === 'prompt') {
      const payload = clientMsg.payload as PromptPayload;
      lastPromptText = resolveSkill(payload.text, skillsDir);
      if (!tcpBridge.isConnected()) {
        sendError(ws, 'claw-code disconnected. Please click the connection indicator to reconnect, or open Settings to reconfigure.');
        return;
      }
      tcpBridge.sendPrompt(lastPromptText);
      return;
    }

    handleClientMessage(ws, tcpBridge, clawProcess, clawPort, clientMsg, skillsDir);
  });

  // --- Cleanup on close/error ---
  ws.on('close', () => {
    clearInterval(heartbeatInterval);
    tcpBridge.off('message', onTcpMessage);
    tcpBridge.off('disconnected', onTcpDisconnect);
  });

  ws.on('error', (err) => {
    console.error('[WsHandler] WebSocket error:', err.message);
    clearInterval(heartbeatInterval);
    tcpBridge.off('message', onTcpMessage);
    tcpBridge.off('disconnected', onTcpDisconnect);
  });

  // Send initial status
  const statusMsg: WsServerMessage = {
    type: 'status',
    payload: {
      connected: tcpBridge.isConnected(),
      clawRunning: clawProcess.isRunning(),
    },
  };
  ws.send(JSON.stringify(statusMsg));
}

/**
 * Handle a parsed WsClientMessage from the frontend.
 */
function handleClientMessage(
  ws: WebSocket,
  tcpBridge: TcpBridge,
  clawProcess: ClawProcess,
  clawPort: number,
  msg: WsClientMessage,
  skillsDir?: string,
): void {
  // connect_config doesn't require existing TCP connection
  if (msg.type === 'connect_config') {
    const payload = msg.payload as ConfigPayload;
    handleConnectConfig(ws, tcpBridge, clawProcess, clawPort, payload);
    return;
  }

  if (!tcpBridge.isConnected()) {
    sendError(ws, 'Not connected to claw-code. Please configure API key first.');
    return;
  }

  switch (msg.type) {
    case 'reset': {
      tcpBridge.sendReset();
      break;
    }

    case 'inject': {
      const payload = msg.payload as InjectPayload;
      tcpBridge.sendInject(payload.messages);
      break;
    }

    case 'slash_command': {
      const payload = msg.payload as SlashPayload;
      handleSlashCommand(ws, tcpBridge, payload);
      break;
    }

    default:
      sendError(ws, `Unknown message type: ${(msg as any).type}`);
  }
}

/**
 * Handle remote slash commands by forwarding appropriate TCP messages.
 */
function handleSlashCommand(
  ws: WebSocket,
  tcpBridge: TcpBridge,
  payload: SlashPayload,
): void {
  switch (payload.command) {
    case 'compact':
      // Send compact as a prompt to claw-code
      tcpBridge.sendPrompt('/compact');
      break;

    case 'skills':
      // Request skills list via prompt
      tcpBridge.sendPrompt('/skills');
      break;

    case 'plugins':
      tcpBridge.sendPrompt('/plugins');
      break;

    case 'mcp':
      tcpBridge.sendPrompt('/mcp');
      break;

    case 'version':
      tcpBridge.sendPrompt('/version');
      break;

    default:
      sendError(ws, `Unknown slash command: ${payload.command}`);
  }
}

/**
 * Handle connect_config: spawn claw-code with credentials, then connect TCP.
 * Uses a simple lock + health check to prevent duplicate spawns.
 */
async function handleConnectConfig(
  ws: WebSocket,
  tcpBridge: TcpBridge,
  clawProcess: ClawProcess,
  clawPort: number,
  payload: ConfigPayload,
): Promise<void> {
  console.log('[WsHandler] handleConnectConfig called:', {
    hasApiKey: !!payload.apiKey,
    baseUrl: payload.baseUrl,
    model: payload.model,
    clawPort,
  });

  // If claw-code is already running and TCP is connected, just notify success
  if (tcpBridge.isConnected() && clawProcess.isRunning()) {
    console.log('[WsHandler] Already connected, sending status');
    const statusMsg: WsServerMessage = {
      type: 'status',
      payload: { connected: true, clawRunning: true },
    };
    ws.send(JSON.stringify(statusMsg));
    return;
  }

  // Prevent concurrent connect attempts
  if (connectingInProgress) {
    console.log('[WsHandler] Connection in progress, waiting...');
    // Wait for the in-progress connection to finish, then check status
    await new Promise((r) => setTimeout(r, 8000));
    if (tcpBridge.isConnected()) {
      const statusMsg: WsServerMessage = {
        type: 'status',
        payload: { connected: true, clawRunning: true },
      };
      ws.send(JSON.stringify(statusMsg));
    }
    return;
  }

  connectingInProgress = true;
  if (connectingTimer) clearTimeout(connectingTimer);
  connectingTimer = setTimeout(() => { connectingInProgress = false; }, 20000);

  try {
    // Stop any existing process
    if (clawProcess.isRunning()) {
      tcpBridge.disconnect();
      await clawProcess.stop();
      // Wait for port release on Windows
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Start claw-code
    console.log('[WsHandler] Starting claw-code process...');
    await clawProcess.start({
      apiKey: payload.apiKey || '',
      baseUrl: payload.baseUrl || undefined,
      model: payload.model || undefined,
      port: clawPort,
    });
    console.log('[WsHandler] claw-code process started');

    // Wait for TCP listener
    await new Promise((r) => setTimeout(r, 1000));

    // Connect TCP bridge
    console.log('[WsHandler] Connecting TCP bridge...');
    await tcpBridge.connect('127.0.0.1', clawPort);
    console.log('[WsHandler] TCP bridge connected');

    const statusMsg: WsServerMessage = {
      type: 'status',
      payload: { connected: true, clawRunning: true },
    };
    ws.send(JSON.stringify(statusMsg));
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Connection failed';
    console.error('[WsHandler] handleConnectConfig FAILED:', errorMsg);
    sendError(ws, `Failed to start claw-code: ${errorMsg}`);
  } finally {
    connectingInProgress = false;
    if (connectingTimer) { clearTimeout(connectingTimer); connectingTimer = null; }
  }
}

/**
 * Resolve bare-word skill names.
 *
 * If the input text exactly matches a known skill name (case-insensitive, trimmed),
 * read the skill's SKILL.md file and prepend it as context to the prompt.
 * Otherwise, return the text as-is.
 */
export function resolveSkill(text: string, skillsDir?: string): string {
  const trimmed = text.trim();
  const lowerTrimmed = trimmed.toLowerCase();

  // Check if it matches a known skill name
  const matchedSkill = KNOWN_SKILLS.find(
    (skill) => skill.toLowerCase() === lowerTrimmed,
  );

  if (!matchedSkill) {
    return text;
  }

  // Try to read the skill's SKILL.md file
  const baseDir = skillsDir || path.join(process.cwd(), '.claw', 'skills');
  const skillMdPath = path.join(baseDir, matchedSkill, 'SKILL.md');
  
  // For heartbeat skill, also try to load AGENT_INSTRUCTIONS.md for additional guidance
  let agentInstructions = '';
  if (matchedSkill.toLowerCase() === 'heartbeat') {
    const agentInstructionsPath = path.join(baseDir, matchedSkill, 'AGENT_INSTRUCTIONS.md');
    try {
      agentInstructions = fs.readFileSync(agentInstructionsPath, 'utf-8');
    } catch {
      // If AGENT_INSTRUCTIONS.md doesn't exist, continue without it
    }
  }

  try {
    const skillContent = fs.readFileSync(skillMdPath, 'utf-8');
    // Prepend skill content and agent instructions as context to the prompt
    const fullContext = agentInstructions 
      ? `${agentInstructions}\n\n---\n\n${skillContent}`
      : skillContent;
    return `${fullContext}\n\n---\nExecute the above skill.`;
  } catch {
    // If SKILL.md doesn't exist, just send the skill name as a prompt
    // claw-code may handle it natively
    return trimmed;
  }
}

/**
 * Map a TcpServerMessage to a WsServerMessage for the frontend.
 */
function mapTcpToWsMessage(msg: TcpServerMessage): WsServerMessage {
  switch (msg.type) {
    case 'ready':
      return { type: 'ready', payload: { model: msg.model, sessionId: msg.session_id } };
    case 'chunk':
      return { type: 'chunk', payload: { text: msg.text } };
    case 'thinking':
      return { type: 'thinking', payload: { text: msg.text } };
    case 'done':
      return { type: 'done', payload: {} };
    case 'error':
      return { type: 'error', payload: { text: msg.text } };
    case 'usage':
      return { type: 'usage', payload: { inputTokens: msg.input_tokens, outputTokens: msg.output_tokens } };
    case 'tool_start':
      return { type: 'tool_start', payload: { id: msg.id, name: msg.name, input: msg.input } };
    case 'tool_end':
      return { type: 'tool_end', payload: { id: msg.id, output: msg.output, isError: msg.is_error } };
    case 'reset_done':
      return { type: 'reset_done', payload: { sessionId: msg.session_id } };
    case 'history':
      return { type: 'history', payload: { messages: msg.messages } };
    case 'inject_done':
      return { type: 'done', payload: { injected: msg.count } };
    default:
      return { type: 'status', payload: msg };
  }
}

/**
 * Send an error message to the WebSocket client.
 */
function sendError(ws: WebSocket, text: string): void {
  if (ws.readyState !== ws.OPEN) return;

  const msg: WsServerMessage = { type: 'error', payload: { text } };
  ws.send(JSON.stringify(msg));
}
