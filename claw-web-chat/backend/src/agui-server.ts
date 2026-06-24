/**
 * AG-UI Protocol Server for claw-web-chat.
 *
 * Replaces the WebSocket-based backend with an AG-UI compatible HTTP server:
 * - POST /agent → SSE stream (AG-UI event protocol)
 * - POST /config → Connect/configure claw-code process
 * - POST /reset → Reset claw-code session
 * - POST /slash → Execute slash commands
 * - GET /health → Health check
 *
 * The AG-UI event stream maps claw-code TCP messages to standard AG-UI events:
 *   RUN_STARTED, TEXT_MESSAGE_START, TEXT_MESSAGE_CONTENT, TEXT_MESSAGE_END,
 *   TOOL_CALL_START, TOOL_CALL_ARGS, TOOL_CALL_END, RUN_FINISHED, RUN_ERROR,
 *   STEP_STARTED, STEP_FINISHED, CUSTOM
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync, existsSync, statSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join, extname, dirname } from 'path';
import { TcpBridge } from './tcp-bridge.js';
import { ClawProcess } from './claw-process.js';
import { resolveSkill } from './ws-handler.js';
import type { TcpServerMessage } from '../../shared/protocol.js';
import type { PromptMeta } from '../../shared/protocol.js';
import {
  startTurn, recordToolStart, recordToolEnd, endTurn, endTurnWithError,
  isToolCallLogEnabled, setToolCallLogEnabled, toggleToolCallLog,
} from './tool-call-logger.js';

// --- Session turn tracking for telemetry ---
const sessionTurnCounters: Map<string, number> = new Map();

// --- Production static file serving ---
const FRONTEND_DIST = process.env.FRONTEND_DIST || '';
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

function serveStatic(req: IncomingMessage, res: ServerResponse): boolean {
  if (!FRONTEND_DIST || !req.url || req.method !== 'GET') return false;

  let filePath = join(FRONTEND_DIST, req.url === '/' ? 'index.html' : req.url.split('?')[0]);

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    // SPA fallback: serve index.html for non-file routes
    filePath = join(FRONTEND_DIST, 'index.html');
  }

  if (!existsSync(filePath)) return false;

  const ext = extname(filePath);
  const mime = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
    return true;
  } catch {
    return false;
  }
}

const PORT = parseInt(process.env.PORT || '8081', 10);
const CLAW_PORT = parseInt(process.env.CLAW_PORT || '9527', 10);
const CLAW_WORKSPACE = process.env.CLAW_WORKSPACE || '';
const SKILLS_DIR = CLAW_WORKSPACE ? join(CLAW_WORKSPACE, '.claw', 'skills') : join(process.cwd(), '.claw', 'skills');

// Shared instances
const tcpBridge = new TcpBridge();
const clawProcess = new ClawProcess();

// Connection state
let connectingInProgress = false;
let connectingTimer: ReturnType<typeof setTimeout> | null = null;
let clawReady = false; // True only after claw sends 'ready' message
let autoCompacting = false;
let lastPromptText: string | null = null;
let activeSSEResponse: ServerResponse | null = null; // Track active SSE response for [Question] interception
let activeRunId: string | null = null;
let activeMessageId: string | null = null;
let pendingConfigRestart: { apiKey: string; baseUrl: string; model: string; reqId: string } | null = null;

// Buffer recent MCP errors from claw stderr — keyed by tool name, used to inject errors into tool results
let recentMcpErrors: Map<string, string> = new Map();
let previousRunDraining = false; // True when waiting for old run_turn to finish before starting new one

// --- Heartbeat Scheduler ---
interface HeartbeatTask {
  id: string;
  prompt: string;
  intervalMs: number;
  timer: ReturnType<typeof setInterval> | null;
  createdAt: number;
  lastRun: number | null;
  runCount: number;
  stopped: boolean; // 新增：停止标志，用于立即停止正在运行的任务
  paused: boolean;  // 暂停标志，暂停后不执行但保留任务
}
const heartbeatTasks: Map<string, HeartbeatTask> = new Map();
// Buffer for heartbeat results — each entry has a unique id to allow frontend deduplication
let heartbeatResultBuffer: Array<{ id: string; text: string }> = [];
const heartbeatSSEClients: Set<ServerResponse> = new Set();

// Heartbeat queue — serializes execution so only one heartbeat runs at a time
const heartbeatQueue: Array<{ id: string; prompt: string; task: HeartbeatTask }> = [];
let heartbeatRunning: { resultText: string; task: HeartbeatTask } | null = null;
let userRunActive = false;

// Called when a TCP message arrives — routes to heartbeat handler if heartbeat is active
function handleHeartbeatTcpMsg(msg: TcpServerMessage): boolean {
  if (!heartbeatRunning) return false;
  const run = heartbeatRunning;
  if (msg.type === 'chunk') {
    run.resultText += (msg as any).text || '';
    return true;
  }
  if (msg.type === 'done' || msg.type === 'error') {
    if (msg.type === 'done' && !run.task.stopped && run.resultText.trim()) {
      heartbeatResultBuffer.push({
        id: `hbr-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text: `[${new Date().toLocaleTimeString()}] ${run.resultText.trim()}`,
      });
      if (heartbeatResultBuffer.length > 20) heartbeatResultBuffer.shift();
    }
    heartbeatRunning = null;
    setTimeout(() => drainHeartbeatQueue(), 0); // yield before next drain
    return true;
  }
  return false;
}

function drainHeartbeatQueue(): void {
  if (heartbeatRunning || userRunActive || heartbeatQueue.length === 0) return;
  // Skip stopped/disconnected items
  while (heartbeatQueue.length > 0) {
    const item = heartbeatQueue[0];
    if (item.task.stopped || !tcpBridge.isConnected()) {
      heartbeatQueue.shift();
      continue;
    }
    heartbeatQueue.shift();
    heartbeatRunning = { resultText: '', task: item.task };
    console.log(`[Heartbeat] Executing task '${item.id}': ${item.prompt.slice(0, 50)}`);
    tcpBridge.sendPrompt(`[自动心跳，直接执行不要提问不要选择框，用纯文字简洁报告] ${item.prompt}`);
    return;
  }
}

// Background TCP message handler — active when no user run is in progress
// Handles heartbeat responses so they're captured even without an active SSE connection
function backgroundMessageHandler(msg: TcpServerMessage): void {
  handleHeartbeatTcpMsg(msg);
}

function pauseHeartbeatTask(id: string): boolean {
  const task = heartbeatTasks.get(id);
  if (!task) return false;
  task.paused = true;
  if (task.timer) { clearInterval(task.timer); task.timer = null; }
  // Remove pending queue entries
  heartbeatQueue.splice(0, heartbeatQueue.length, ...heartbeatQueue.filter(item => item.id !== id));
  console.log(`[Heartbeat] Task '${id}' paused`);
  saveHeartbeatTasks();
  return true;
}

function resumeHeartbeatTask(id: string): boolean {
  const task = heartbeatTasks.get(id);
  if (!task || !task.paused) return false;
  task.paused = false;
  task.stopped = false;
  // Re-create the interval
  task.timer = setInterval(() => {
    if (task.stopped || task.paused) return;
    if (tcpBridge.isConnected()) {
      console.log(`[Heartbeat] Queuing task '${id}': ${task.prompt.slice(0, 50)}`);
      task.lastRun = Date.now();
      task.runCount++;
      heartbeatQueue.push({ id, prompt: task.prompt, task });
      drainHeartbeatQueue();
    }
  }, task.intervalMs);
  console.log(`[Heartbeat] Task '${id}' resumed`);
  saveHeartbeatTasks();
  return true;
}

function addHeartbeatTask(id: string, prompt: string, intervalMs: number): HeartbeatTask {
  // Remove existing task with same id
  removeHeartbeatTask(id);
  const task: HeartbeatTask = { id, prompt, intervalMs, timer: null, createdAt: Date.now(), lastRun: null, runCount: 0, stopped: false, paused: false };
  task.timer = setInterval(() => {
    // Check if task has been stopped or paused
    if (task.stopped || task.paused) {
      if (task.stopped) console.log(`[Heartbeat] Task '${id}' is stopped, skipping execution`);
      return;
    }

    // Only send if TCP connected
    if (tcpBridge.isConnected()) {
      if (task.stopped) return;
      console.log(`[Heartbeat] Queuing task '${id}': ${prompt.slice(0, 50)}`);
      task.lastRun = Date.now();
      task.runCount++;
      heartbeatQueue.push({ id, prompt, task });
      drainHeartbeatQueue();
    } else {
      console.log(`[Heartbeat] Skipped task '${id}' (TCP disconnected)`);
    }
  }, intervalMs);
  heartbeatTasks.set(id, task);
  console.log(`[Heartbeat] Task '${id}' added: "${prompt}" every ${intervalMs / 1000}s`);
  saveHeartbeatTasks();
  return task;
}

function removeHeartbeatTask(id: string): boolean {
  const task = heartbeatTasks.get(id);
  if (task) {
    task.stopped = true;
    if (task.timer) clearInterval(task.timer);
    heartbeatTasks.delete(id);
    // Remove any pending queue entries for this task
    const before = heartbeatQueue.length;
    heartbeatQueue.splice(0, heartbeatQueue.length,
      ...heartbeatQueue.filter(item => item.id !== id)
    );
    console.log(`[Heartbeat] Task '${id}' removed and stopped (cleared ${before - heartbeatQueue.length} queued items)`);
    saveHeartbeatTasks();
    return true;
  }
  return false;
}

function listHeartbeatTasks(): HeartbeatTask[] {
  return Array.from(heartbeatTasks.values());
}

function clearAllHeartbeatTasks(): number {
  let count = 0;
  for (const [id] of heartbeatTasks) {
    removeHeartbeatTask(id);
    count++;
  }
  // Clear the queue and buffer so no stale results are sent to the frontend
  heartbeatQueue.length = 0;
  heartbeatResultBuffer = [];
  console.log('[Heartbeat] All tasks cleared, queue and buffer flushed');
  saveHeartbeatTasks();
  return count;
}

// --- Heartbeat Persistence ---
const HEARTBEAT_PERSIST_PATH = join(
  CLAW_WORKSPACE || process.cwd(),
  '.claw',
  'heartbeat-tasks.json'
);

interface PersistedHeartbeatTask {
  id: string;
  prompt: string;
  intervalMs: number;
  paused: boolean;
}

function saveHeartbeatTasks(): void {
  try {
    const tasks: PersistedHeartbeatTask[] = Array.from(heartbeatTasks.values()).map(t => ({
      id: t.id,
      prompt: t.prompt,
      intervalMs: t.intervalMs,
      paused: t.paused,
    }));
    mkdirSync(dirname(HEARTBEAT_PERSIST_PATH), { recursive: true });
    writeFileSync(HEARTBEAT_PERSIST_PATH, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (err: any) {
    console.warn('[Heartbeat] Failed to save tasks:', err.message);
  }
}

function loadHeartbeatTasks(): void {
  try {
    if (!existsSync(HEARTBEAT_PERSIST_PATH)) return;
    const raw = readFileSync(HEARTBEAT_PERSIST_PATH, 'utf8');
    const tasks: PersistedHeartbeatTask[] = JSON.parse(raw);
    if (!Array.isArray(tasks)) return;
    let restored = 0;
    for (const t of tasks) {
      if (!t.id || !t.prompt || !t.intervalMs) continue;
      const task = addHeartbeatTask(t.id, t.prompt, t.intervalMs);
      if (t.paused) {
        pauseHeartbeatTask(task.id);
      }
      restored++;
    }
    if (restored > 0) {
      console.log(`[Heartbeat] Restored ${restored} task(s) from disk`);
    }
  } catch (err: any) {
    console.warn('[Heartbeat] Failed to load tasks:', err.message);
  }
}

// --- AG-UI Event Types ---
export type AgUiEventType =
  | 'RUN_STARTED'
  | 'RUN_FINISHED'
  | 'RUN_ERROR'
  | 'TEXT_MESSAGE_START'
  | 'TEXT_MESSAGE_CONTENT'
  | 'TEXT_MESSAGE_END'
  | 'TOOL_CALL_START'
  | 'TOOL_CALL_ARGS'
  | 'TOOL_CALL_END'
  | 'STEP_STARTED'
  | 'STEP_FINISHED'
  | 'STATE_SNAPSHOT'
  | 'CUSTOM';

export interface AgUiEvent {
  type: AgUiEventType;
  [key: string]: any;
}


// --- Utility: Parse JSON body ---
function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (e) { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

// --- Utility: CORS headers ---
function setCorsHeaders(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// --- Utility: Send SSE event ---
function sendSseEvent(res: ServerResponse, event: AgUiEvent): void {
  const data = JSON.stringify(event);
  res.write(`data: ${data}\n\n`);
  // Force flush - needed for SSE streaming to work in real-time
  if (typeof (res as any).flush === 'function') {
    (res as any).flush();
  }
}

// --- Utility: Parse [Question] output from claw-code stdout into a2ui operations ---
let questionBuffer = '';
let questionBufferTimer: ReturnType<typeof setTimeout> | null = null;

function parseQuestionToA2UI(text: string): any | null {
  // Pattern: [Question] question text\n  1. option1\n  2. option2\n ... Enter choice (1-N):
  const questionMatch = text.match(/\[Question\]\s*(.+?)(?:\n|$)/);
  if (!questionMatch) return null;

  const question = questionMatch[1].trim();
  const optionRegex = /^\s*(\d+)\.\s+(.+)$/gm;
  const options: Array<{ id: string; label: string }> = [];
  let match;
  while ((match = optionRegex.exec(text)) !== null) {
    options.push({ id: `opt_${match[1]}`, label: match[2].trim() });
  }

  if (options.length === 0) return null;

  const surfaceId = `decision-${Date.now().toString(36)}`;
  return {
    a2ui_operations: [
      { version: 'v0.9', createSurface: { surfaceId, catalogId: 'copilotkit://decision-catalog' } },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId,
          components: [{
            id: 'root',
            component: 'ChoicePrompt',
            question,
            description: '',
            mode: 'single',
            options,
            submitLabel: 'Submit',
            action: { event: { name: 'business_choices_confirmed', context: { surfaceId } } },
          }],
        },
      },
    ],
  };
}

// --- Utility: Parse numbered list from plain text into a2ui operations ---
function parseNumberedListToA2UI(text: string): any | null {
  // Match patterns like "1. option text" or "1、option text" with at least 2 options
  const optionRegex = /^\s*(\d+)[.、．)\]]\s+(.+)$/gm;
  const options: Array<{ id: string; label: string }> = [];
  let match;
  while ((match = optionRegex.exec(text)) !== null) {
    options.push({ id: `opt_${match[1]}`, label: match[2].trim() });
  }

  // Need at least 2 numbered options to consider it a choice list
  if (options.length < 2) return null;

  // Try to extract a question — look for text ending with ? or ？ before the list
  // Or use the first line that's not a numbered item
  const lines = text.split('\n');
  let question = '请选择';
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !/^\d+[.、．)\]]/.test(trimmed)) {
      // Non-numbered line — could be the question
      if (trimmed.includes('?') || trimmed.includes('？') || trimmed.includes('选') || trimmed.includes('做什么')) {
        question = trimmed.replace(/[*_#]/g, '').trim();
        break;
      }
    }
  }

  const surfaceId = `decision-${Date.now().toString(36)}`;
  return {
    a2ui_operations: [
      { version: 'v0.9', createSurface: { surfaceId, catalogId: 'copilotkit://decision-catalog' } },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId,
          components: [{
            id: 'root',
            component: 'ChoicePrompt',
            question,
            description: '',
            mode: 'single',
            options,
            submitLabel: 'Submit',
            action: { event: { name: 'business_choices_confirmed', context: { surfaceId } } },
          }],
        },
      },
    ],
  };
}

// --- Utility: Extract a2ui_operations from text (handles JSON in markdown code blocks or raw) ---
function extractA2UIOperations(text: string): any[] | null {
  // Try to find JSON containing a2ui_operations — may be in a code block or raw
  const patterns = [
    /```(?:json)?\s*\n?(\{[\s\S]*?"a2ui_operations"[\s\S]*?\})\s*\n?```/,
    /(\{[\s\S]*?"a2ui_operations"\s*:\s*\[[\s\S]*?\]\s*\})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed.a2ui_operations && Array.isArray(parsed.a2ui_operations)) {
          return parsed.a2ui_operations;
        }
      } catch {
        // Continue to next pattern
      }
    }
  }
  return null;
}

// --- A2A Direct Agent Mode (bypass claw-code) ---
async function handleDirectA2AAgent(
  req: any, res: any, agentId: string, lastUserMsg: any, runId?: string
): Promise<void> {
  // Find the agent in config
  const config = loadA2AAgentsConfig();
  const agent = config.agents?.find((a: any) => a.id === agentId);
  if (!agent || !agent.url) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Agent '${agentId}' not found or has no URL` }));
    return;
  }

  // Set up SSE response
  setCorsHeaders(res);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  const currentRunId = runId || `run-${Date.now()}`;
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Send RUN_STARTED
  const sseEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sseEvent('RUN_STARTED', { type: 'RUN_STARTED', threadId: agentId, runId: currentRunId });

  // Extract user text
  const userText = typeof lastUserMsg.content === 'string'
    ? lastUserMsg.content
    : lastUserMsg.content?.map((c: any) => c.text || '').join('') || '';

  // Send A2A JSON-RPC request to remote agent
  const jsonRpcBody = {
    jsonrpc: '2.0',
    method: 'message/send',
    id: `direct-${Date.now()}`,
    params: {
      message: {
        role: 'user',
        parts: [{ kind: 'text', text: userText }],
      },
    },
  };

  try {
    const a2aUrl = `${agent.url.replace(/\/$/, '')}/a2a/jsonrpc`;
    const response = await fetch(a2aUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonRpcBody),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const errText = await response.text();
      sseEvent('TEXT_MESSAGE_START', { type: 'TEXT_MESSAGE_START', messageId, role: 'assistant' });
      sseEvent('TEXT_MESSAGE_CONTENT', { type: 'TEXT_MESSAGE_CONTENT', messageId, delta: `[A2A Error] HTTP ${response.status}: ${errText}` });
      sseEvent('TEXT_MESSAGE_END', { type: 'TEXT_MESSAGE_END', messageId });
      sseEvent('RUN_FINISHED', { type: 'RUN_FINISHED', threadId: agentId, runId: currentRunId });
      res.end();
      return;
    }

    const data = await response.json() as any;

    // Extract result text from A2A response
    let resultText = '';
    if (data.result) {
      const result = data.result;
      // Try artifacts first
      if (result.artifacts?.length > 0) {
        resultText = result.artifacts
          .flatMap((a: any) => a.parts || [])
          .filter((p: any) => p.kind === 'text')
          .map((p: any) => p.text)
          .join('\n');
      }
      // Try status message
      if (!resultText && result.status?.message?.parts) {
        resultText = result.status.message.parts
          .filter((p: any) => p.kind === 'text')
          .map((p: any) => p.text)
          .join('');
      }
      if (!resultText) {
        resultText = JSON.stringify(result);
      }
    } else if (data.error) {
      resultText = `[A2A Error] ${data.error.message || JSON.stringify(data.error)}`;
    } else {
      resultText = JSON.stringify(data);
    }

    // Stream the result as AG-UI text message events
    sseEvent('TEXT_MESSAGE_START', { type: 'TEXT_MESSAGE_START', messageId, role: 'assistant' });
    sseEvent('TEXT_MESSAGE_CONTENT', { type: 'TEXT_MESSAGE_CONTENT', messageId, delta: resultText });
    sseEvent('TEXT_MESSAGE_END', { type: 'TEXT_MESSAGE_END', messageId });

  } catch (err: any) {
    sseEvent('TEXT_MESSAGE_START', { type: 'TEXT_MESSAGE_START', messageId, role: 'assistant' });
    sseEvent('TEXT_MESSAGE_CONTENT', { type: 'TEXT_MESSAGE_CONTENT', messageId, delta: `[A2A Error] ${err.message || 'Request failed'}` });
    sseEvent('TEXT_MESSAGE_END', { type: 'TEXT_MESSAGE_END', messageId });
  }

  sseEvent('RUN_FINISHED', { type: 'RUN_FINISHED', threadId: agentId, runId: currentRunId });
  res.end();
}

// --- POST /agent: AG-UI run endpoint ---
async function handleAgentRun(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await parseBody(req);
  const { threadId, runId, messages, directAgentId, history } = body;

  // Extract the last user message as the prompt
  const lastUserMsg = [...(messages || [])].reverse().find((m: any) => m.role === 'user');
  if (!lastUserMsg) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'No user message provided' }));
    return;
  }

  // --- A2A Direct Mode: bypass claw-code, talk directly to remote Agent ---
  if (directAgentId) {
    await handleDirectA2AAgent(req, res, directAgentId, lastUserMsg, runId);
    return;
  }

  if (!tcpBridge.isConnected() || !clawReady) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Frontier not connected. POST /config first.' }));
    return;
  }

  // Set up SSE response
  setCorsHeaders(res);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  // Flush headers immediately
  res.flushHeaders();

  const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const currentRunId = runId || `run-${Date.now()}`;
  let textStarted = false;
  let thinkingStepId: string | null = null;
  let accumulatedText = ''; // Accumulate text chunks for a2ui detection
  let a2uiAlreadyRendered = false; // Track if A2UI was rendered from tool_end
  const pendingToolIds: Set<string> = new Set(); // Track tool calls that haven't received tool_end
  const pendingToolNames: Map<string, string> = new Map(); // id -> name for logging

  // --- Timing instrumentation ---
  const t0 = Date.now(); // Request start time
  let tPromptSent = 0;   // When prompt was sent to claw-code
  let tFirstMsg = 0;     // When first TCP message arrived
  let tFirstChunk = 0;   // When first text chunk arrived
  const toolTimings: Map<string, { name: string; start: number; end?: number }> = new Map();

  // If a previous run was interrupted, we need to skip its remaining messages
  // until we see its 'done', then start processing new run's messages
  let skipStaleMessages = previousRunDraining;

  // Auto-clear skip after 10s to prevent permanent blocking
  if (skipStaleMessages) {
    setTimeout(() => {
      if (skipStaleMessages) {
        skipStaleMessages = false;
        previousRunDraining = false;
        console.log('[AgUiServer] Skip-stale timeout (10s), forcing new message processing');
      }
    }, 10000);
  }

  // Track active SSE response for [Question] interception
  activeSSEResponse = res;
  activeRunId = currentRunId;
  activeMessageId = messageId;

  // Periodic keepalive to prevent frontend timeout during long thinking
  const keepaliveTimer = setInterval(() => {
    if (!res.writableEnded) {
      res.write(`: keepalive\n\n`);
    } else {
      clearInterval(keepaliveTimer);
    }
  }, 15000); // Every 15 seconds

  // Send RUN_STARTED
  sendSseEvent(res, { type: 'RUN_STARTED', runId: currentRunId, threadId });

  // Resolve skill and send prompt
  const promptText = resolveSkill(lastUserMsg.content, SKILLS_DIR);
  lastPromptText = promptText;

  // Intercept choice-related requests — directly render A2UI instead of relying on claw-code
  let finalPrompt = promptText;
  const choicePattern = /选择界面|选择.*下一步|让我选|给我选项|selection interface|prompt me.*(?:next step|choice)|give me.*options/i;
  if (choicePattern.test(promptText)) {
    // Directly send A2UI render event before forwarding to claw-code
    // This ensures the UI always renders even if claw-code's model doesn't call the MCP tool
    const surfaceId = `decision-${Date.now().toString(36)}`;
    const fallbackA2UI = {
      operations: [
        { version: 'v0.9', createSurface: { surfaceId, catalogId: 'copilotkit://decision-catalog' } },
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId,
            components: [{
              id: 'root',
              component: 'ChoicePrompt',
              question: 'What would you like to explore next?',
              description: 'Select the direction you want to continue with',
              mode: 'single' as const,
              options: [
                { id: 'explore_code', label: 'Explore codebase', description: 'Navigate and understand the project structure' },
                { id: 'implement_feature', label: 'Implement a feature', description: 'Build new functionality' },
                { id: 'fix_bug', label: 'Fix a bug', description: 'Debug and resolve an issue' },
                { id: 'refactor', label: 'Refactor code', description: 'Improve existing code quality' },
                { id: 'write_tests', label: 'Write tests', description: 'Add test coverage' },
              ],
              submitLabel: 'Continue',
              action: { event: { name: 'business_choices_confirmed', context: { surfaceId } } },
            }],
          },
        },
      ],
    };
    sendSseEvent(res, { type: 'CUSTOM', name: 'a2ui_render', data: fallbackA2UI });
    sendSseEvent(res, { type: 'RUN_FINISHED', runId: currentRunId });
    // Don't call cleanup() here — it references onMessage which is defined later
    activeSSEResponse = null;
    activeRunId = null;
    activeMessageId = null;
    res.end();
    return;
  }

  // Listen for TCP messages from claw-code
  const onMessage = (msg: TcpServerMessage) => {
    // Route to heartbeat handler if a heartbeat run is currently active
    if (heartbeatRunning && handleHeartbeatTcpMsg(msg)) return;

    // If response is closed (client disconnected), just track 'done' for draining
    if (res.writableEnded) {
      if (msg.type === 'done' || msg.type === 'error') {
        previousRunDraining = false;
        tcpBridge.off('message', onMessage);
        console.log('[AgUiServer] Old run completed (response was closed), draining cleared');
      }
      return;
    }

    // Skip stale messages from a previous interrupted run until we see its 'done'
    if (skipStaleMessages) {
      if (msg.type === 'done' || msg.type === 'error') {
        skipStaleMessages = false;
        console.log('[AgUiServer] Stale run done received, now processing new run messages');
      } else {
        // Silently discard old run's messages
        return;
      }
      return; // Also skip the 'done' itself (it belongs to old run)
    }

    if (!tFirstMsg) tFirstMsg = Date.now();
    console.log('[AgUiServer] TCP message received:', msg.type, msg.type === 'chunk' ? `(${(msg as any).text?.length} chars)` : '', `[+${Date.now() - t0}ms]`);

    // Auto-compact on context window overflow
    if (msg.type === 'error' && msg.text.includes('Context window blocked') && !autoCompacting && lastPromptText) {
      autoCompacting = true;
      sendSseEvent(res, { type: 'CUSTOM', name: 'auto_compact', data: { message: 'Context window full. Auto-compacting...' } });
      tcpBridge.sendPrompt('/compact');
      const compactListener = (compactMsg: TcpServerMessage) => {
        if (compactMsg.type === 'done') {
          tcpBridge.off('message', compactListener);
          setTimeout(() => {
            tcpBridge.sendPrompt(lastPromptText!);
            autoCompacting = false;
          }, 500);
        } else if (compactMsg.type === 'error') {
          tcpBridge.off('message', compactListener);
          autoCompacting = false;
          sendSseEvent(res, { type: 'RUN_ERROR', runId: currentRunId, message: compactMsg.text });
          res.end();
        }
      };
      tcpBridge.on('message', compactListener);
      return;
    }

    switch (msg.type) {
      case 'thinking': {
        if (!thinkingStepId) {
          thinkingStepId = `step-thinking-${Date.now()}`;
          sendSseEvent(res, { type: 'STEP_STARTED', stepId: thinkingStepId, name: 'thinking' });
        }
        console.log(`[AgUiServer] thinking event: "${(msg as any).text?.slice(0, 50)}" [+${Date.now() - t0}ms]`);
        sendSseEvent(res, { type: 'CUSTOM', name: 'thinking', data: { text: msg.text, stepId: thinkingStepId } });
        break;
      }

      case 'chunk': {
        // End thinking step if active
        if (thinkingStepId) {
          sendSseEvent(res, { type: 'STEP_FINISHED', stepId: thinkingStepId });
          thinkingStepId = null;
        }
        // Auto-close any pending tool calls that never received tool_end
        // This happens when claw-code starts replying text without sending tool results
        if (pendingToolIds.size > 0) {
          console.log(`[AgUiServer] Auto-closing ${pendingToolIds.size} pending tool(s) — text chunk arrived before tool_end:`);
          for (const toolId of pendingToolIds) {
            const toolName = pendingToolNames.get(toolId) || 'unknown';
            console.log(`[AgUiServer]   - ${toolName} (id=${toolId})`);
            // Check if there's a captured MCP error for this tool
            const shortName = toolName.split('__').pop() || toolName;
            const mcpError = recentMcpErrors.get(shortName) || recentMcpErrors.get(toolName);
            if (mcpError) {
              console.log(`[AgUiServer]   Injecting MCP error for ${toolName}: ${mcpError.slice(0, 100)}`);
              sendSseEvent(res, { type: 'TOOL_CALL_END', toolCallId: toolId, result: mcpError, isError: true });
              recentMcpErrors.delete(shortName);
              recentMcpErrors.delete(toolName);
            } else {
              sendSseEvent(res, { type: 'TOOL_CALL_END', toolCallId: toolId, result: '', isError: false });
            }
          }
          pendingToolIds.clear();
          pendingToolNames.clear();
        }
        if (!textStarted) {
          if (!tFirstChunk) tFirstChunk = Date.now();
          sendSseEvent(res, { type: 'TEXT_MESSAGE_START', messageId, role: 'assistant' });
          textStarted = true;
        }
        accumulatedText += msg.text;
        sendSseEvent(res, { type: 'TEXT_MESSAGE_CONTENT', messageId, delta: msg.text });
        break;
      }

      case 'tool_start': {
        // End thinking step if active
        if (thinkingStepId) {
          sendSseEvent(res, { type: 'STEP_FINISHED', stepId: thinkingStepId });
          thinkingStepId = null;
        }
        // End text message if active (tool call interrupts text)
        if (textStarted) {
          sendSseEvent(res, { type: 'TEXT_MESSAGE_END', messageId });
          textStarted = false;
        }
        // Track this tool as pending
        pendingToolIds.add(msg.id);
        pendingToolNames.set(msg.id, msg.name);
        toolTimings.set(msg.id, { name: msg.name, start: Date.now() });
        sendSseEvent(res, { type: 'TOOL_CALL_START', toolCallId: msg.id, toolCallName: msg.name });
        if (msg.input) {
          sendSseEvent(res, { type: 'TOOL_CALL_ARGS', toolCallId: msg.id, delta: msg.input });
        }
        // Debug: log MCP/tool invocation details
        console.log(`[AgUiServer] tool_start: ${msg.name} (id=${msg.id}) [+${Date.now() - t0}ms]`);
        if (msg.input) {
          console.log(`[AgUiServer] tool_input: ${msg.input.slice(0, 300)}`);
        }
        // --- Tool Call Logger ---
        recordToolStart(currentRunId, msg.id, msg.name, msg.input || '');
        break;
      }

      case 'tool_end': {
        // Remove from pending set
        const wasPending = pendingToolIds.delete(msg.id);
        const timing = toolTimings.get(msg.id);
        const toolNameForError = pendingToolNames.get(msg.id) || timing?.name || 'unknown';
        pendingToolNames.delete(msg.id);
        if (timing) timing.end = Date.now();
        const toolDuration = timing ? (timing.end! - timing.start) : 0;
        console.log(`[AgUiServer] tool_end: ${timing?.name || 'unknown'} (id=${msg.id}) took ${toolDuration}ms, wasPending=${wasPending}, is_error=${msg.is_error}, output_len=${msg.output?.length || 0} [+${Date.now() - t0}ms]`);

        // If tool returned empty/null and we have a captured MCP error, inject it
        let finalOutput = msg.output;
        let finalIsError = msg.is_error;
        if (!finalOutput || finalOutput.trim() === '') {
          const shortName = toolNameForError.split('__').pop() || toolNameForError;
          const mcpError = recentMcpErrors.get(shortName) || recentMcpErrors.get(toolNameForError);
          if (mcpError) {
            console.log(`[AgUiServer] Injecting captured MCP error into empty tool_end for ${toolNameForError}`);
            finalOutput = mcpError;
            finalIsError = true;
            recentMcpErrors.delete(shortName);
            recentMcpErrors.delete(toolNameForError);
          }
        }

        sendSseEvent(res, { type: 'TOOL_CALL_END', toolCallId: msg.id, result: finalOutput, isError: finalIsError });

        // --- Tool Call Logger ---
        recordToolEnd(currentRunId, msg.id, finalOutput || '', finalIsError);

        // Detect a2ui_operations in tool output and emit as CUSTOM event
        if (!msg.is_error && msg.output) {
          console.log('[AgUiServer] tool_end output (first 200):', msg.output.slice(0, 200));
          try {
            const parsed = JSON.parse(msg.output);
            if (parsed.a2ui_operations && Array.isArray(parsed.a2ui_operations)) {
              console.log('[AgUiServer] Detected a2ui_operations in tool output!');
              sendSseEvent(res, { type: 'CUSTOM', name: 'a2ui_render', data: { operations: parsed.a2ui_operations } });
            } else {
              // Try MCP content format: {"content": [{"type":"text","text":"..."}]}
              const contentArray = parsed.content || (Array.isArray(parsed) ? parsed : null);
              if (contentArray && Array.isArray(contentArray)) {
                for (const item of contentArray) {
                  if (item.type === 'text' && item.text) {
                    try {
                      const inner = JSON.parse(item.text);
                      if (inner.a2ui_operations && Array.isArray(inner.a2ui_operations)) {
                        console.log('[AgUiServer] Detected a2ui_operations in MCP content!');
                        sendSseEvent(res, { type: 'CUSTOM', name: 'a2ui_render', data: { operations: inner.a2ui_operations } });
                        a2uiAlreadyRendered = true;
                      }
                    } catch { /* inner text not JSON */ }
                  }
                }
              }
            }
          } catch {
            // Not parseable — ignore
          }
        }
        break;
      }

      case 'usage': {
        sendSseEvent(res, { type: 'CUSTOM', name: 'usage', data: { inputTokens: msg.input_tokens, outputTokens: msg.output_tokens } });
        break;
      }

      case 'error': {
        // If "produced no content" and we already sent tool_start (A2UI interaction pending),
        // treat as normal completion — the user needs to interact with the UI
        if (msg.text.includes('produced no content') && pendingToolIds.size > 0) {
          console.log('[AgUiServer] Ignoring "produced no content" error (A2UI tool awaiting interaction)');
          // Auto-close pending tools and finish normally
          for (const toolId of pendingToolIds) {
            sendSseEvent(res, { type: 'TOOL_CALL_END', toolCallId: toolId, result: '', isError: false });
          }
          pendingToolIds.clear();
          pendingToolNames.clear();
          if (textStarted) {
            sendSseEvent(res, { type: 'TEXT_MESSAGE_END', messageId });
            textStarted = false;
          }
          // --- Tool Call Logger: end turn (produced no content) ---
          endTurn(currentRunId);
          sendSseEvent(res, { type: 'RUN_FINISHED', runId: currentRunId });
          cleanup();
          res.end();
          previousRunDraining = false;
          break;
        }

        if (thinkingStepId) {
          sendSseEvent(res, { type: 'STEP_FINISHED', stepId: thinkingStepId });
          thinkingStepId = null;
        }
        if (textStarted) {
          sendSseEvent(res, { type: 'TEXT_MESSAGE_END', messageId });
          textStarted = false;
        }
        sendSseEvent(res, { type: 'RUN_ERROR', runId: currentRunId, message: msg.text });

        // --- Tool Call Logger: end turn with error ---
        endTurnWithError(currentRunId, msg.text);

        // Auto-restart with latest token on 401 (token expired during MCP init)
        if (msg.text && (msg.text.includes('401') || msg.text.includes('Unauthorized') || msg.text.includes('Invalid token'))) {
          const latestConfig = clawProcess.getConfig();
          if (latestConfig && latestConfig.apiKey) {
            console.log('[AgUiServer] 401 detected — auto-restart and retry prompt transparently');

            // DON'T end the response — keep SSE open, retry transparently
            // Send a custom event so frontend shows "reconnecting" indicator
            sendSseEvent(res, { type: 'CUSTOM', name: 'token_refresh', data: { message: 'Token expired, reconnecting...' } });

            // Restart claw with latest token, then re-send the prompt
            const retryPrompt = finalPrompt;
            setTimeout(async () => {
              try {
                await applyDeferredConfig({
                  apiKey: latestConfig.apiKey,
                  baseUrl: latestConfig.baseUrl || '',
                  model: latestConfig.model || '',
                  reqId: `401-retry-${Date.now().toString(36)}`,
                });

                if (!res.writableEnded && tcpBridge.isConnected() && clawReady) {
                  console.log('[AgUiServer] 401 retry: claw restarted, re-sending prompt');
                  // Re-register message handler for this run
                  tcpBridge.removeAllListeners('message');
                  tcpBridge.on('message', onMessage);
                  tcpBridge.sendPrompt(retryPrompt, promptMeta);
                } else {
                  // Failed to recover — end with error
                  sendSseEvent(res, { type: 'RUN_ERROR', runId: currentRunId, message: 'Token refresh failed. Please retry.' });
                  cleanup();
                  res.end();
                }
              } catch (err: any) {
                console.warn('[AgUiServer] 401 auto-retry failed:', err.message);
                if (!res.writableEnded) {
                  sendSseEvent(res, { type: 'RUN_ERROR', runId: currentRunId, message: `Token refresh failed: ${err.message}` });
                  cleanup();
                  res.end();
                }
              }
            }, 1000);
            // Don't cleanup or end res — we're keeping the SSE connection alive for retry
            previousRunDraining = false;
            break;
          }
        }

        cleanup();
        res.end();
        previousRunDraining = false;
        break;
      }

      case 'done': {
        if (thinkingStepId) {
          sendSseEvent(res, { type: 'STEP_FINISHED', stepId: thinkingStepId });
          thinkingStepId = null;
        }
        // Auto-close any pending tool calls before finishing
        if (pendingToolIds.size > 0) {
          console.log(`[AgUiServer] Auto-closing ${pendingToolIds.size} pending tool(s) — run finished:`);
          for (const toolId of pendingToolIds) {
            const toolName = pendingToolNames.get(toolId) || 'unknown';
            console.log(`[AgUiServer]   - ${toolName} (id=${toolId})`);
            const shortName = toolName.split('__').pop() || toolName;
            const mcpError = recentMcpErrors.get(shortName) || recentMcpErrors.get(toolName);
            if (mcpError) {
              sendSseEvent(res, { type: 'TOOL_CALL_END', toolCallId: toolId, result: mcpError, isError: true });
              recentMcpErrors.delete(shortName);
              recentMcpErrors.delete(toolName);
            } else {
              sendSseEvent(res, { type: 'TOOL_CALL_END', toolCallId: toolId, result: '', isError: false });
            }
          }
          pendingToolIds.clear();
          pendingToolNames.clear();
        }
        if (textStarted) {
          sendSseEvent(res, { type: 'TEXT_MESSAGE_END', messageId });
          textStarted = false;
        }

        // Detect a2ui_operations in accumulated text output (when agent outputs JSON directly)
        if (a2uiAlreadyRendered) {
          // A2UI already rendered from tool_end, skip fallback detection
        } else if (accumulatedText.includes('"a2ui_operations"')) {
          console.log('[AgUiServer] Detected a2ui_operations in accumulated text');
          const a2uiOps = extractA2UIOperations(accumulatedText);
          if (a2uiOps) {
            console.log('[AgUiServer] Extracted a2ui_operations, sending to frontend');
            sendSseEvent(res, { type: 'CUSTOM', name: 'a2ui_render', data: { operations: a2uiOps } });
          }
        }
        // No fallback numbered list detection — only render A2UI when explicitly requested via tool

        // --- Tool Call Logger: end turn ---
        endTurn(currentRunId);

        sendSseEvent(res, { type: 'RUN_FINISHED', runId: currentRunId });

        // --- Timing summary ---
        const tDone = Date.now();
        console.log(`[AgUiServer] ⏱ TIMING SUMMARY:`);
        console.log(`[AgUiServer]   Total request duration: ${tDone - t0}ms`);
        console.log(`[AgUiServer]   Prompt sent → first TCP msg: ${tFirstMsg ? tFirstMsg - tPromptSent : 'N/A'}ms`);
        console.log(`[AgUiServer]   First TCP msg → first text chunk: ${tFirstChunk && tFirstMsg ? tFirstChunk - tFirstMsg : 'N/A'}ms`);
        console.log(`[AgUiServer]   Tool call durations:`);
        for (const [id, t] of toolTimings) {
          const duration = t.end ? t.end - t.start : (tDone - t.start);
          const status = t.end ? 'completed' : 'auto-closed';
          console.log(`[AgUiServer]     - ${t.name}: ${duration}ms (${status})`);
        }

        cleanup();
        res.end();
        previousRunDraining = false; // Run completed normally

        // --- Auto-compact: if response was slow, compact in background to speed up next turn ---
        const AUTO_COMPACT_THRESHOLD_MS = 30000; // 30s threshold
        const runDuration = tDone - t0;
        if (runDuration > AUTO_COMPACT_THRESHOLD_MS && !autoCompacting && tcpBridge.isConnected()) {
          console.log(`[AgUiServer] ⚡ Auto-compact triggered: total duration ${runDuration}ms > ${AUTO_COMPACT_THRESHOLD_MS}ms`);
          autoCompacting = true;
          setTimeout(() => {
            tcpBridge.sendPrompt('/compact');
            const compactDoneListener = (compactMsg: TcpServerMessage) => {
              if (compactMsg.type === 'done' || compactMsg.type === 'error') {
                tcpBridge.off('message', compactDoneListener);
                autoCompacting = false;
                if (compactMsg.type === 'done') {
                  console.log('[AgUiServer] ⚡ Background auto-compact completed');
                } else {
                  console.log('[AgUiServer] ⚡ Background auto-compact failed:', (compactMsg as any).text);
                }
              }
            };
            tcpBridge.on('message', compactDoneListener);
          }, 1000);
        }

        break;
      }

      case 'ready': {
        sendSseEvent(res, { type: 'CUSTOM', name: 'ready', data: { model: msg.model, sessionId: msg.session_id } });
        break;
      }
    }
  };

  function cleanup() {
    clearInterval(keepaliveTimer);
    activeSSEResponse = null;
    activeRunId = null;
    activeMessageId = null;
    // Resume queued heartbeat tasks now that user run is complete
    userRunActive = false;
    // Register background listener to handle heartbeat TCP messages when no user run is active
    tcpBridge.removeAllListeners('message');
    tcpBridge.on('message', backgroundMessageHandler);
    drainHeartbeatQueue();

    // Apply deferred config restart (token refresh that was waiting for run to finish)
    if (pendingConfigRestart) {
      const pending = pendingConfigRestart;
      pendingConfigRestart = null;
      console.log(`[Config#${pending.reqId}] Applying deferred token restart now (run completed)`);
      applyDeferredConfig(pending).catch((err: any) => {
        console.warn(`[Config] Deferred restart failed:`, err.message);
      });
    }
  }

  // Handle client disconnect
  req.on('close', () => { cleanup(); });
  res.on('close', () => { cleanup(); });

  // If a previous run is still active, its messages might still be arriving.
  // We'll use a "gate" timestamp: only process messages that arrive AFTER we send the new prompt.
  // Messages from old run will arrive before new prompt's response and be discarded.
  previousRunDraining = true;

  // If claw-code is waiting for a [Question] stdin reply, send a cancel to unblock it
  if (questionBuffer || questionBufferTimer) {
    console.log('[AgUiServer] Flushing pending Question (sending stdin "1" to unblock)');
    clawProcess.writeStdin('1'); // Send any valid choice to unblock stdin read
    questionBuffer = '';
    if (questionBufferTimer) { clearTimeout(questionBufferTimer); questionBufferTimer = null; }
  }

  // Register the message handler for this run
  // Block heartbeat queue while user request is active; cleanup() will resume it
  userRunActive = true;

  // Inject history BEFORE registering the SSE message handler
  // This ensures compact's /done doesn't get consumed by onMessage
  const turnIndex = sessionTurnCounters.get(threadId) ?? 0;
  sessionTurnCounters.set(threadId, turnIndex + 1);

  if (turnIndex === 0 && history && Array.isArray(history) && history.length > 0) {
    const injectMessages = history
      .filter((m: any) => m.role && m.content && m.content.trim())
      .map((m: any) => ({ role: m.role, text: m.content.slice(0, 1500) }));
    if (injectMessages.length > 0) {
      const totalChars = injectMessages.reduce((sum: number, m: any) => sum + m.text.length, 0);
      console.log(`[AgUiServer] Injecting ${injectMessages.length} history message(s) (${totalChars} chars) for session continuity`);
      tcpBridge.sendInject(injectMessages);
      await new Promise((r) => setTimeout(r, 300));

      // If history is very large, compact it before sending prompt
      if (totalChars > 50000) {
        console.log(`[AgUiServer] History too large (${totalChars} chars), compacting...`);
        // Use a dedicated listener for compact (backgroundMessageHandler is active)
        tcpBridge.sendPrompt('/compact');
        await new Promise<void>((resolve) => {
          const compactTimeout = setTimeout(() => { resolve(); }, 15000);
          const compactListener = (msg: TcpServerMessage) => {
            if (msg.type === 'done' || msg.type === 'error') {
              tcpBridge.off('message', compactListener);
              clearTimeout(compactTimeout);
              resolve();
            }
          };
          tcpBridge.on('message', compactListener);
        });
        console.log(`[AgUiServer] Compact done, proceeding with prompt`);
      }
    }
  }

  // NOW register the SSE message handler (after inject/compact are fully done)
  tcpBridge.removeAllListeners('message');
  tcpBridge.on('message', onMessage);

  // Send the prompt to claw-code
  const promptMeta: PromptMeta = {
    session_id: threadId || `session-${Date.now()}`,
    turn_id: currentRunId,
    turn_index: turnIndex,
    terminal: 'web',
  };

  console.log('[AgUiServer] Sending prompt to claw-code:', finalPrompt.slice(0, 100));
  tPromptSent = Date.now();

  // --- Tool Call Logger: start tracking this turn ---
  startTurn(currentRunId, threadId || '', finalPrompt);

  tcpBridge.sendPrompt(finalPrompt, promptMeta);
}


// --- Deferred config restart (applies token change after active run finishes) ---
async function applyDeferredConfig(pending: { apiKey: string; baseUrl: string; model: string; reqId: string }): Promise<void> {
  const { apiKey, baseUrl, model, reqId } = pending;
  console.log(`[Config#${reqId}] Deferred restart: stopping old claw process`);
  connectingInProgress = true;
  clawReady = false; // Mark as not ready immediately to reject new requests during restart
  try {
    tcpBridge.disconnect();
    await clawProcess.stop();
    await new Promise((r) => setTimeout(r, 1000));

    console.log(`[Config#${reqId}] Deferred restart: starting claw with new credentials`);
    await clawProcess.start({ apiKey, baseUrl: baseUrl || undefined, model: model || undefined, port: CLAW_PORT });
    await new Promise((r) => setTimeout(r, 3000));
    await tcpBridge.connect('127.0.0.1', CLAW_PORT);

    // Wait for ready
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => { tcpBridge.off('message', listener); resolve(); }, 20000);
      const listener = (msg: TcpServerMessage) => {
        if (msg.type === 'ready') { tcpBridge.off('message', listener); clearTimeout(timeout); resolve(); }
      };
      tcpBridge.on('message', listener);
    });

    console.log(`[Config#${reqId}] Deferred restart: SUCCESS`);
    clawReady = true;
  } catch (err: any) {
    console.warn(`[Config#${reqId}] Deferred restart: FAILED —`, err.message);
  } finally {
    connectingInProgress = false;
  }
}

// --- POST /config: Connect/configure claw-code ---
async function handleConfig(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCorsHeaders(res);
  const body = await parseBody(req);
  const { apiKey, baseUrl, model: rawModel } = body;
  // Normalize model name — ensure provider prefix (e.g. claude-xxx → anthropic/claude-xxx)
  let model = rawModel || '';
  if (model && !model.includes('/') && model.startsWith('claude-')) {
    model = `anthropic/${model}`;
  }
  const port = CLAW_PORT;

  const reqId = Date.now().toString(36);
  const maskedKey = apiKey ? apiKey.slice(0, 8) + '...' : '(none)';
  console.log(`[Config#${reqId}] ENTER — model=${model} baseUrl=${baseUrl || '(default)'} apiKey=${maskedKey}`);

  // Prevent concurrent connect attempts — set early to block auto-reconnect race
  if (connectingInProgress) {
    console.log(`[Config#${reqId}] REJECT — another connection in progress`);
    res.writeHead(409, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Connection in progress' }));
    return;
  }
  connectingInProgress = true;
  if (connectingTimer) clearTimeout(connectingTimer);
  connectingTimer = setTimeout(() => { connectingInProgress = false; }, 60000); // 60s to allow MCP init

  // If claw-code is running with the same token, reuse it.
  // If the token changed (different account), we must restart claw with the new token.
  const currentConfig = clawProcess.getConfig();
  console.log(`[Config#${reqId}] current state — connected=${tcpBridge.isConnected()} running=${clawProcess.isRunning()} currentKey=${currentConfig?.apiKey ? currentConfig.apiKey.slice(0, 8) + '...' : '(none)'}`);
  if (tcpBridge.isConnected() && clawProcess.isRunning()) {
    const sameApiKey = (currentConfig?.apiKey || '') === (apiKey || '');
    const sameBaseUrl = (currentConfig?.baseUrl || '') === (baseUrl || '');
    if (sameApiKey) {
      console.log(`[Config#${reqId}] SKIP — same token, reusing connection`);
      connectingInProgress = false;
      if (connectingTimer) { clearTimeout(connectingTimer); connectingTimer = null; }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'connected', model: currentConfig?.model }));
      return;
    }

    // Same gateway, different token.
    // Just store the new token — DON'T restart claw.
    // Reasons:
    //   1. Frequent restarts cause claw crash loops (ECONNRESET)
    //   2. The 401 auto-retry mechanism will restart with the latest stored token if needed
    //   3. Front-end sends multiple config requests with different tokens during startup
    if (sameBaseUrl) {
      console.log(`[Config#${reqId}] SKIP — same gateway, storing new token (current may still be valid)`);
      if (currentConfig) { (currentConfig as any).apiKey = apiKey; }
      connectingInProgress = false;
      if (connectingTimer) { clearTimeout(connectingTimer); connectingTimer = null; }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'connected', model: currentConfig?.model }));
      return;
    }

    // If a user run is active, defer restart until it completes
    // BUT: only defer if the new config is from the same provider (token refresh).
    // If it's a completely different provider, reject — don't disrupt the active run.
    if (activeSSEResponse && !activeSSEResponse.writableEnded) {
      if (!sameBaseUrl && baseUrl !== (currentConfig?.baseUrl || '')) {
        console.log(`[Config#${reqId}] REJECT — different provider config during active run (baseUrl=${baseUrl} vs current=${currentConfig?.baseUrl})`);
        connectingInProgress = false;
        if (connectingTimer) { clearTimeout(connectingTimer); connectingTimer = null; }
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'rejected', message: 'Cannot switch provider during active run' }));
        return;
      }
      console.log(`[Config#${reqId}] DEFER — token changed but user run is active, waiting...`);
      connectingInProgress = false;
      if (connectingTimer) { clearTimeout(connectingTimer); connectingTimer = null; }
      pendingConfigRestart = { apiKey, baseUrl, model, reqId };
      res.writeHead(202, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'deferred', message: 'Token update deferred until current run completes' }));
      return;
    }

    console.log(`[Config#${reqId}] RESTART — baseUrl changed (different provider)`);
  }

  try {
    // Stop existing process — must restart to pass new token as env var
    if (clawProcess.isRunning()) {
      console.log(`[Config#${reqId}] stopping old claw process`);
      tcpBridge.disconnect();
      await clawProcess.stop();
      // Give MCP subprocesses time to clean up and OS to release port
      // Retry until port is free (up to 8 seconds)
      for (let i = 0; i < 16; i++) {
        await new Promise((r) => setTimeout(r, 500));
        if (!clawProcess.isRunning()) break;
      }
      await new Promise((r) => setTimeout(r, 500));
    }

    console.log(`[Config#${reqId}] starting claw with new credentials`);
    // Start claw-code
    await clawProcess.start({
      apiKey: apiKey || '',
      baseUrl: baseUrl || undefined,
      model: model || undefined,
      port: CLAW_PORT,
    });

    // Wait for TCP listener — give claw.exe more time to initialize (MCP servers can be slow)
    await new Promise((r) => setTimeout(r, 1500));

    console.log(`[Config#${reqId}] connecting TCP bridge`);
    // Connect TCP bridge — retry up to 5 times to handle port cleanup delays
    let connected = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        if (!tcpBridge.isConnected()) {
          await tcpBridge.connect('127.0.0.1', CLAW_PORT);
        }
        connected = true;
        break;
      } catch (connErr) {
        console.log(`[Config#${reqId}] TCP connect attempt ${attempt} failed, retrying in 1s...`);
        await new Promise((r) => setTimeout(r, 1000));
        // Restart claw if it exited
        if (!clawProcess.isRunning()) {
          await clawProcess.start({ apiKey: apiKey || '', baseUrl: baseUrl || undefined, model: model || undefined, port: CLAW_PORT });
        }
      }
    }
    if (!connected) throw new Error('connect ECONNREFUSED 127.0.0.1:9527 (all retries failed)');

    // Wait for claw-code to send 'ready' (MCP initialization complete)
    await new Promise<void>((resolve, reject) => {
      const readyTimeout = setTimeout(() => {
        tcpBridge.off('message', readyListener);
        resolve(); // proceed anyway after 20s
      }, 20000);
      const readyListener = (msg: TcpServerMessage) => {
        if (msg.type === 'ready') {
          tcpBridge.off('message', readyListener);
          clearTimeout(readyTimeout);
          resolve();
        } else if (msg.type === 'error') {
          tcpBridge.off('message', readyListener);
          clearTimeout(readyTimeout);
          reject(new Error(msg.text));
        }
      };
      tcpBridge.on('message', readyListener);
    });

    console.log(`[Config#${reqId}] SUCCESS — model: ${model}, baseUrl: ${baseUrl || '(default)'}`);
    clawReady = true;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'connected', model }));
    console.log(`[AgUiServer] Connected — model: ${model}, baseUrl: ${baseUrl || '(default)'}`);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Connection failed';
    console.log(`[Config#${reqId}] FAILED — ${errorMsg}, retrying once in 3s...`);

    // Retry once after a short delay — handles transient port/process cleanup races
    try {
      await new Promise((r) => setTimeout(r, 3000));
      if (!clawProcess.isRunning()) {
        await clawProcess.start({
          apiKey: apiKey || '',
          baseUrl: baseUrl || undefined,
          model: model || undefined,
          port: CLAW_PORT,
        });
      }
      if (!tcpBridge.isConnected()) {
        await tcpBridge.connect('127.0.0.1', CLAW_PORT);
      }
      // Wait for ready
      await new Promise<void>((resolve) => {
        const t = setTimeout(resolve, 15000);
        const l = (msg: TcpServerMessage) => { if (msg.type === 'ready') { clearTimeout(t); tcpBridge.off('message', l); resolve(); } };
        if (tcpBridge.isConnected()) tcpBridge.on('message', l); else resolve();
      });
      console.log(`[Config#${reqId}] RETRY SUCCESS`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'connected', model }));
    } catch (retryErr) {
      const retryMsg = retryErr instanceof Error ? retryErr.message : 'Retry failed';
      console.log(`[Config#${reqId}] RETRY FAILED — ${retryMsg}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: retryMsg }));
    }
  } finally {
    connectingInProgress = false;
    if (connectingTimer) { clearTimeout(connectingTimer); connectingTimer = null; }
    console.log(`[Config#${reqId}] EXIT`);
  }
}

// --- POST /reset: Reset session ---
async function handleReset(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCorsHeaders(res);
  if (!tcpBridge.isConnected()) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not connected' }));
    return;
  }
  tcpBridge.sendReset();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
}

// --- POST /cancel: Cancel the current run ---
// Soft cancel: just close the active SSE stream so frontend shows run as stopped.
// claw-code finishes the current turn in the background (results discarded).
// Session context is preserved — no restart needed.
// Only force-restarts if body contains { force: true }.
async function handleCancel(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCorsHeaders(res);
  const body = await parseBody(req);
  const forceRestart = body?.force === true;

  // Close active SSE connection so frontend knows run is over
  if (activeSSEResponse && !activeSSEResponse.writableEnded) {
    sendSseEvent(activeSSEResponse, {
      type: 'RUN_ERROR',
      runId: activeRunId || 'unknown',
      message: '[已中止] 用户取消了正在执行的操作',
    });
    activeSSEResponse.end();
  }
  activeSSEResponse = null;
  activeRunId = null;
  activeMessageId = null;
  previousRunDraining = false;
  userRunActive = false;

  if (!forceRestart) {
    // Soft cancel: let claw finish in background, discard output
    console.log('[AgUiServer] Cancel requested — soft cancel (session preserved)');
    // Re-register background handler to silently consume remaining messages from claw
    tcpBridge.removeAllListeners('message');
    tcpBridge.on('message', backgroundMessageHandler);
    drainHeartbeatQueue();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'cancelled' }));
    return;
  }

  // Force cancel: restart claw-code (kills stuck subprocesses, loses context)
  console.log('[AgUiServer] Cancel requested — force restart (context will be lost)');
  const config = clawProcess.getConfig();
  if (config) {
    try {
      await clawProcess.stop();
      tcpBridge.disconnect();
      await clawProcess.start(config);
      await new Promise((r) => setTimeout(r, 2000));
      await tcpBridge.connect('127.0.0.1', config.port);
      await new Promise<void>((resolve) => {
        const readyTimeout = setTimeout(() => {
          console.log('[AgUiServer] Cancel restart: timed out waiting for ready, proceeding anyway');
          tcpBridge.off('message', readyListener);
          resolve();
        }, 15000);
        const readyListener = (msg: TcpServerMessage) => {
          if (msg.type === 'ready') {
            tcpBridge.off('message', readyListener);
            clearTimeout(readyTimeout);
            console.log('[AgUiServer] Cancel restart: claw-code ready');
            resolve();
          }
        };
        tcpBridge.on('message', readyListener);
      });
      console.log('[AgUiServer] claw-code restarted successfully');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'restarted' }));
    } catch (err) {
      console.error('[AgUiServer] Failed to restart claw-code:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to restart' }));
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  }
}

// --- POST /slash: Execute slash command ---
async function handleSlash(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCorsHeaders(res);
  const body = await parseBody(req);
  const { command } = body;

  if (!tcpBridge.isConnected()) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not connected' }));
    return;
  }

  // Forward as prompt (claw-code handles slash commands natively)
  tcpBridge.sendPrompt(`/${command}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
}

// --- GET /a2ui-test: Test endpoint to verify a2ui rendering pipeline ---
async function handleA2UITest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCorsHeaders(res);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  });
  res.flushHeaders();

  const runId = `run-test-${Date.now()}`;
  const msgId = `msg-test-${Date.now()}`;
  const surfaceId = `decision-test-${Date.now().toString(36)}`;

  sendSseEvent(res, { type: 'RUN_STARTED', runId, threadId: 'test' });
  sendSseEvent(res, { type: 'CUSTOM', name: 'a2ui_render', data: {
    operations: [
      { version: 'v0.9', createSurface: { surfaceId, catalogId: 'copilotkit://decision-catalog' } },
      { version: 'v0.9', updateComponents: { surfaceId, components: [{
        id: 'root',
        component: 'ChoicePrompt',
        question: '测试：你想做什么？',
        description: '这是一个测试选择界面',
        mode: 'single',
        options: [
          { id: 'opt_1', label: '选项 A' },
          { id: 'opt_2', label: '选项 B' },
          { id: 'opt_3', label: '选项 C' },
        ],
        submitLabel: '确认',
        action: { event: { name: 'business_choices_confirmed', context: { surfaceId } } },
      }]}},
    ],
  }});
  sendSseEvent(res, { type: 'RUN_FINISHED', runId });
  res.end();
}

// --- POST /a2ui-event: Forward A2UI user interaction events to claw-code ---
async function handleA2UIEvent(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCorsHeaders(res);
  const body = await parseBody(req);
  const { event } = body;

  if (!event || !event.name) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing event.name' }));
    return;
  }

  if (!tcpBridge.isConnected()) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not connected' }));
    return;
  }

  // Convert A2UI choice to a prompt
  // If the selected option id is like "opt_3", extract "3" for claw-code's [Question] response
  let promptText: string;
  const selectedIds: string[] = event.context?.selectedIds || [];
  const numericChoices = selectedIds
    .map((id: string) => id.replace(/^opt_/, ''))
    .filter((v: string) => /^\d+$/.test(v));

  if (numericChoices.length > 0) {
    // Respond via stdin for claw-code's [Question] handler
    const choice = numericChoices[0];
    console.log('[AgUiServer] Sending [Question] response via stdin:', choice);
    clawProcess.writeStdin(choice);
  } else {
    // Generic event forwarding via TCP prompt
    promptText = `[A2UI Event] ${event.name}: ${JSON.stringify(event.context || {})}`;
    console.log('[AgUiServer] Forwarding A2UI event as prompt:', promptText);
    tcpBridge.sendPrompt(promptText);
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
}

// --- GET /health ---
function handleHealth(res: ServerResponse): void {
  setCorsHeaders(res);
  const currentConfig = clawProcess.getConfig();
  const activeToken = currentConfig?.apiKey || '';
  // Simple hash: first 8 + last 4 chars of token (enough to detect change, not expose full token)
  const activeTokenHash = activeToken ? activeToken.slice(0, 8) + activeToken.slice(-4) : '';
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: tcpBridge.isConnected() && clawReady ? 'ok' : 'degraded',
    tcp: tcpBridge.isConnected(),
    clawRunning: clawProcess.isRunning(),
    clawReady,
    connectingInProgress,
    uptime: process.uptime(),
    activeTokenHash,
  }));
}

// --- Auth Proxy (avoids browser CORS/redirect issues with Gateway) ---
async function handleAuthProxy(req: any, res: any) {
  setCorsHeaders(res);
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  try {
    // Use Node.js fetch which properly handles redirects server-side
    const gatewayUrl = 'https://frontier.hexai.top/auth/cli-login';
    
    // First request — may get 301 redirect
    let response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      redirect: 'manual',
    });

    // If redirected, follow manually preserving POST method
    if ([301, 302, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (location) {
        const redirectUrl = location.startsWith('http') ? location : `https://frontier.hexai.top${location}`;
        response = await fetch(redirectUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          redirect: 'follow',
        });
      }
    }

    const text = await response.text();
    res.writeHead(response.status, { 'Content-Type': 'application/json' });
    res.end(text);
  } catch (err: any) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Gateway proxy error' }));
  }
}

// --- A2A External Agent Proxy ---
// Credential store path (local dev: JSON file)
const EXTERNAL_CREDENTIALS_PATH = join(
  process.env.CLAW_WORKSPACE || process.cwd(),
  '.claw',
  'external-agent-credentials.json'
);

interface ExternalAgentCredential {
  id: string;
  base_url: string;
  api_key: string;
}

function loadExternalCredentials(): ExternalAgentCredential[] {
  try {
    if (!existsSync(EXTERNAL_CREDENTIALS_PATH)) return [];
    const raw = readFileSync(EXTERNAL_CREDENTIALS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.agents) ? parsed.agents : [];
  } catch {
    return [];
  }
}

async function handleExternalAgentProxy(req: any, res: any) {
  setCorsHeaders(res);

  // Parse agent ID from URL: /api/v1/proxy/agent/{agentId}/chat
  const urlParts = req.url?.split('/') || [];
  const agentIdx = urlParts.indexOf('agent');
  if (agentIdx === -1 || agentIdx + 2 >= urlParts.length) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }
  const agentId = urlParts[agentIdx + 1];
  const action = urlParts[agentIdx + 2]; // should be "chat"

  if (action !== 'chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Load credentials and find the target agent
  const credentials = loadExternalCredentials();
  const credential = credentials.find(c => c.id === agentId);
  if (!credential) {
    // IDOR protection: return 404 whether agent doesn't exist or user doesn't own it
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Read request body
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  let parsed: { message?: string; history?: Array<{ role: string; content: string }>; stream?: boolean };
  try {
    parsed = JSON.parse(body);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  const message = parsed.message || '';
  const history = parsed.history || [];

  // Transform to OpenAI format
  const messages = [
    ...history,
    { role: 'user', content: message }
  ];

  try {
    // Forward to external platform with API key
    const response = await fetch(credential.base_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credential.api_key}`,
      },
      body: JSON.stringify({
        model: 'agent',
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.writeHead(response.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reply: errText, status: 'error' }));
      return;
    }

    const data = await response.json() as any;
    const reply = data?.choices?.[0]?.message?.content || data?.reply || JSON.stringify(data);

    // Never return api_key in response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ reply, status: 'success' }));
  } catch (err: any) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ reply: err.message || 'Proxy error', status: 'error' }));
  }
}

// --- A2A Agent Registry (CRUD + auto-restart claw) ---
const A2A_CONFIG_PATH = join(
  process.env.CLAW_WORKSPACE || join(process.cwd(), '..', '..'),
  '.claw',
  'a2a-agents.json'
);

function loadA2AAgentsConfig(): any {
  try {
    if (!existsSync(A2A_CONFIG_PATH)) return { agents: [], options: { connectTimeoutMs: 5000, failFast: false } };
    return JSON.parse(readFileSync(A2A_CONFIG_PATH, 'utf8'));
  } catch {
    return { agents: [], options: { connectTimeoutMs: 5000, failFast: false } };
  }
}

function saveA2AAgentsConfig(config: any): void {
  mkdirSync(dirname(A2A_CONFIG_PATH), { recursive: true });
  writeFileSync(A2A_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

async function restartClawAfterAgentChange(): Promise<boolean> {
  const config = clawProcess.getConfig();
  if (!config) return false;
  try {
    tcpBridge.disconnect();
    await clawProcess.stop();
    await new Promise((r) => setTimeout(r, 2000));
    await clawProcess.start(config);
    await new Promise((r) => setTimeout(r, 2000));
    await tcpBridge.connect('127.0.0.1', 9527);
    // Wait for ready signal
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => { resolve(); }, 10000);
      const listener = (msg: any) => {
        if (msg?.type === 'ready') { clearTimeout(timeout); tcpBridge.off('message', listener); resolve(); }
      };
      tcpBridge.on('message', listener);
    });
    return true;
  } catch (err: any) {
    console.error('[A2A Registry] Failed to restart claw:', err.message);
    return false;
  }
}

async function handleA2AAgents(req: any, res: any) {
  setCorsHeaders(res);
  const url = req.url || '';

  // GET /a2a-agents — list all
  if (req.method === 'GET') {
    const config = loadA2AAgentsConfig();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(config));
    return;
  }

  // POST /a2a-agents — add a new agent
  if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) { body += chunk; }
    let input: any;
    try { input = JSON.parse(body); } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }

    if (!input.id || !input.url) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing required fields: id, url' }));
      return;
    }

    const config = loadA2AAgentsConfig();
    if (config.agents.some((a: any) => a.id === input.id)) {
      res.writeHead(409, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Agent with id '${input.id}' already exists` }));
      return;
    }

    // Validate: try to fetch Agent Card
    let agentCard = null;
    try {
      const cardUrl = `${input.url.replace(/\/$/, '')}/.well-known/agent-card.json`;
      const cardRes = await fetch(cardUrl, { signal: AbortSignal.timeout(5000) });
      if (cardRes.ok) {
        agentCard = await cardRes.json();
      }
    } catch {}

    const newAgent = {
      id: input.id,
      type: input.type || 'native',
      url: input.url,
      enabled: input.enabled !== false,
    };
    config.agents.push(newAgent);
    saveA2AAgentsConfig(config);

    // Auto-restart claw to pick up new agent
    console.log(`[A2A Registry] Added agent '${input.id}', restarting claw...`);
    const restarted = await restartClawAfterAgentChange();

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      agent: newAgent,
      agentCard,
      clawRestarted: restarted,
    }));
    return;
  }

  // DELETE /a2a-agents?id=xxx — remove an agent
  if (req.method === 'DELETE') {
    const params = new URL(url, 'http://localhost').searchParams;
    const id = params.get('id');
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing query param: id' }));
      return;
    }

    const config = loadA2AAgentsConfig();
    const idx = config.agents.findIndex((a: any) => a.id === id);
    if (idx === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Agent '${id}' not found` }));
      return;
    }

    config.agents.splice(idx, 1);
    saveA2AAgentsConfig(config);

    console.log(`[A2A Registry] Removed agent '${id}', restarting claw...`);
    const restarted = await restartClawAfterAgentChange();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'deleted', id, clawRestarted: restarted }));
    return;
  }

  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

// --- Session Persistence API ---
// Per-user session storage: .claw/users/{username}/sessions.json
const USERS_BASE_DIR = join(
  process.env.CLAW_WORKSPACE || join(process.cwd(), '..', '..'),
  '.claw',
  'users'
);

function getUserSessionsPath(username: string): string {
  // Sanitize username to prevent directory traversal
  const safe = username.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  return join(USERS_BASE_DIR, safe, 'sessions.json');
}

interface PersistedSessionData {
  sessions: any[];
  messages: Record<string, any[]>;
  activeSessionId: string | null;
}

function loadUserSessions(username: string): PersistedSessionData | null {
  const filePath = getUserSessionsPath(username);
  try {
    if (!existsSync(filePath)) return null;
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as PersistedSessionData;
  } catch (err) {
    console.error(`[Sessions] Failed to load sessions for user '${username}':`, err);
    return null;
  }
}

function saveUserSessions(username: string, data: PersistedSessionData): void {
  const filePath = getUserSessionsPath(username);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data), 'utf8');
}

async function handleSessions(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCorsHeaders(res);

  // Extract username from query param or header
  const url = new URL(req.url || '', 'http://localhost');
  const username = url.searchParams.get('user') || req.headers['x-frontier-user'] as string || '';

  if (!username) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing user identifier (query param ?user= or header X-Frontier-User)' }));
    return;
  }

  // GET /sessions?user=xxx — load sessions
  if (req.method === 'GET') {
    const data = loadUserSessions(username);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data || { sessions: [], messages: {}, activeSessionId: null }));
    return;
  }

  // PUT /sessions?user=xxx — save sessions (full replace)
  if (req.method === 'PUT') {
    const body = await parseBody(req);
    const { sessions, messages, activeSessionId } = body;
    if (!Array.isArray(sessions) || typeof messages !== 'object') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid body: need { sessions, messages, activeSessionId }' }));
      return;
    }
    saveUserSessions(username, { sessions, messages, activeSessionId });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'saved' }));
    return;
  }

  // DELETE /sessions?user=xxx — clear all sessions for user
  if (req.method === 'DELETE') {
    const filePath = getUserSessionsPath(username);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'deleted' }));
    return;
  }

  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

// --- HTTP Server ---
const server = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (req.method === 'GET' && req.url === '/health') {
      handleHealth(res);
    } else if (req.method === 'GET' && req.url === '/heartbeat-results') {
      // Return buffered heartbeat results and clear the buffer
      setCorsHeaders(res);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const results = [...heartbeatResultBuffer];
      heartbeatResultBuffer = [];
      res.end(JSON.stringify({ results }));
    } else if (req.method === 'POST' && req.url === '/agent') {
      await handleAgentRun(req, res);
    } else if (req.method === 'POST' && req.url === '/config') {
      await handleConfig(req, res);
    } else if (req.method === 'POST' && req.url === '/reset') {
      await handleReset(req, res);
    } else if (req.method === 'POST' && req.url === '/cancel') {
      await handleCancel(req, res);
    } else if (req.method === 'POST' && req.url === '/slash') {
      await handleSlash(req, res);
    } else if (req.method === 'POST' && req.url === '/a2ui-event') {
      await handleA2UIEvent(req, res);
    } else if (req.method === 'GET' && req.url === '/a2ui-test') {
      await handleA2UITest(req, res);
    } else if (req.method === 'POST' && req.url === '/heartbeat') {
      // Heartbeat task management
      setCorsHeaders(res);
      const body = await parseBody(req);
      const { action, id, prompt, intervalSeconds } = body;
      let result: any;
      switch (action) {
        case 'add':
          if (!id || !prompt || !intervalSeconds) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing id, prompt, or intervalSeconds' }));
            return;
          }
          const task = addHeartbeatTask(id, prompt, intervalSeconds * 1000);
          result = { status: 'ok', task: { id: task.id, prompt: task.prompt, intervalMs: task.intervalMs } };
          break;
        case 'remove':
          const removed = removeHeartbeatTask(id);
          result = { status: removed ? 'ok' : 'not_found' };
          break;
        case 'list':
          result = { tasks: listHeartbeatTasks().map(t => ({ id: t.id, prompt: t.prompt, intervalMs: t.intervalMs, lastRun: t.lastRun, runCount: t.runCount, paused: t.paused })) };
          break;
        case 'clear':
          const count = clearAllHeartbeatTasks();
          result = { status: 'ok', removed: count };
          break;
        case 'pause':
          const paused = pauseHeartbeatTask(id);
          result = { status: paused ? 'ok' : 'not_found' };
          break;
        case 'resume':
          const resumed = resumeHeartbeatTask(id);
          result = { status: resumed ? 'ok' : 'not_found' };
          break;
        default:
          result = { error: 'Unknown action. Use: add, remove, list, clear, pause, resume' };
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } else if (req.method === 'POST' && req.url === '/restart') {
      // Signal the launcher to restart the entire application
      setCorsHeaders(res);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'restarting' }));
      // Exit process — launcher will detect exit and restart
      setTimeout(() => process.exit(42), 500); // Exit code 42 = restart signal
    } else if (req.method === 'POST' && req.url?.startsWith('/api/v1/proxy/agent/')) {
      // --- A2A External Agent Proxy Endpoint ---
      await handleExternalAgentProxy(req, res);
    } else if (req.method === 'POST' && req.url === '/auth/cli-login') {
      // --- Auth proxy: forward login to Gateway (avoids CORS/redirect issues) ---
      await handleAuthProxy(req, res);
    } else if (req.method === 'POST' && req.url === '/auth/verify-token') {
      // --- Token validation: check if a saved token is still valid ---
      setCorsHeaders(res);
      try {
        const body = await parseBody(req);
        const token = body.token;
        if (!token) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ valid: false, reason: 'no token' }));
          return;
        }
        // Make a lightweight request to the gateway to verify token
        const verifyRes = await fetch('https://frontier.hexai.top/v1/models', {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: AbortSignal.timeout(5000),
        });
        if (verifyRes.status === 401 || verifyRes.status === 403) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ valid: false, reason: 'token_expired' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ valid: true }));
        }
      } catch (err: any) {
        // Network error — can't verify, assume valid (optimistic)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ valid: true, reason: 'verification_failed' }));
      }
    } else if (req.url === '/a2a-agents' || req.url?.startsWith('/a2a-agents?')) {
      // --- A2A Agent Registry CRUD ---
      await handleA2AAgents(req, res);
    } else if (req.url?.startsWith('/sessions')) {
      // --- Session Persistence API ---
      await handleSessions(req, res);
    } else if (req.method === 'POST' && req.url === '/tool-log') {
      // --- Tool Call Log Toggle ---
      setCorsHeaders(res);
      const body = await parseBody(req);
      const { action: logAction } = body;
      let result: any;
      switch (logAction) {
        case 'enable':
          setToolCallLogEnabled(true);
          result = { status: 'ok', enabled: true };
          break;
        case 'disable':
          setToolCallLogEnabled(false);
          result = { status: 'ok', enabled: false };
          break;
        case 'toggle':
          const nowEnabled = toggleToolCallLog();
          result = { status: 'ok', enabled: nowEnabled };
          break;
        case 'status':
        default:
          result = { status: 'ok', enabled: isToolCallLogEnabled() };
          break;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } else if (serveStatic(req, res)) {
      // Served static file (production mode)
    } else {
      setCorsHeaders(res);
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (err) {
    console.error('[AgUiServer] Request error:', err);
    if (!res.headersSent) {
      setCorsHeaders(res);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
});

// Logging
// Register background handler initially (handles heartbeat TCP responses when no user run is active)
tcpBridge.on('message', backgroundMessageHandler);
tcpBridge.on('connected', () => {
  console.log('[AgUiServer] TCP connected to claw-code');
  // Re-register background handler so heartbeat responses are captured
  if (!userRunActive) {
    tcpBridge.removeAllListeners('message');
    tcpBridge.on('message', backgroundMessageHandler);
    drainHeartbeatQueue();
  }
});
tcpBridge.on('disconnected', () => {
  console.warn('[AgUiServer] TCP disconnected from claw-code');
  clawReady = false;
  // Clear in-flight heartbeat execution to prevent queue deadlock
  if (heartbeatRunning) {
    console.log('[Heartbeat] Clearing in-flight heartbeat due to TCP disconnect');
    heartbeatRunning = null;
  }
  // Don't auto-reconnect here — the 'exit' handler on clawProcess will handle restart
  // Auto-reconnect only if claw is still running (e.g., TCP glitch without process crash)
  setTimeout(() => {
    // Skip auto-reconnect if a manual handleConfig is in progress (it will connect itself)
    if (connectingInProgress) return;
    if (!tcpBridge.isConnected() && clawProcess.isRunning()) {
      console.log('[AgUiServer] Attempting TCP auto-reconnect (claw still running)...');
      tcpBridge.connect('127.0.0.1', CLAW_PORT).catch((err: Error) => {
        console.warn('[AgUiServer] TCP auto-reconnect failed:', err.message);
      });
    }
  }, 3000);
});
tcpBridge.on('error', (err: Error) => { console.error('[AgUiServer] TCP error:', err.message); });
clawProcess.on('log', (text: string) => {
  process.stderr.write(`[claw] ${text}`);

  // Capture MCP tool errors from stderr to inject into tool results
  const mcpErrorMatch = text.match(/Invalid arguments for tool\s+'([^']+)':\s*(.+)/s)
    || text.match(/WARNING.*tool\s+'([^']+)'.*?:\s*(.+)/s)
    || text.match(/Error.*tool\s+'([^']+)'.*?:\s*(.+)/s);
  if (mcpErrorMatch) {
    const toolName = mcpErrorMatch[1];
    const errorDetail = mcpErrorMatch[2].replace(/\s+/g, ' ').trim().slice(0, 500);
    recentMcpErrors.set(toolName, `MCP Error: Invalid arguments for tool '${toolName}': ${errorDetail}`);
    // Auto-clear after 30s to avoid stale errors
    setTimeout(() => { recentMcpErrors.delete(toolName); }, 30000);
  }

  // Send keepalive to prevent frontend timeout while claw-code is processing
  if (activeSSEResponse && !activeSSEResponse.writableEnded && !text.includes('[Question]') && !questionBuffer) {
    // Any log output from claw-code means it's still working - send a comment keepalive
    activeSSEResponse.write(`: keepalive\n\n`);
  }

  // Intercept [Question] output from claw-code and convert to a2ui events
  if (text.includes('[Question]') || questionBuffer) {
    questionBuffer += text;

    // Wait for the full question to arrive (look for "Enter choice" or accumulate)
    if (questionBufferTimer) clearTimeout(questionBufferTimer);
    questionBufferTimer = setTimeout(() => {
      if (questionBuffer && activeSSEResponse && !activeSSEResponse.writableEnded) {
        const a2uiData = parseQuestionToA2UI(questionBuffer);
        if (a2uiData) {
          console.log('[AgUiServer] Intercepted [Question], converting to a2ui');
          // Send a2ui render event — keep SSE open for continued response after user answers
          sendSseEvent(activeSSEResponse, { type: 'CUSTOM', name: 'a2ui_render', data: { operations: a2uiData.a2ui_operations } });
          // Don't end SSE or set activeSSEResponse to null — claw-code will continue after stdin reply
        }
      }
      questionBuffer = '';
      questionBufferTimer = null;
    }, 500); // Wait 500ms for full question text to arrive
  }
});
let shuttingDown = false;

clawProcess.on('exit', (code: number | null) => {
  console.log(`[AgUiServer] claw-code exited (code: ${code})`);
  // Clear draining state — old run is gone, no more messages coming
  previousRunDraining = false;
  // Don't auto-restart if we're shutting down
  if (shuttingDown) return;
  // Auto-restart claw-code if it exits unexpectedly
  // Wait a moment then try to restart with last known config
  setTimeout(async () => {
    // Skip auto-restart if handleConfig is already managing a restart
    if (connectingInProgress) {
      console.log('[AgUiServer] Skipping auto-restart — handleConfig is in progress');
      return;
    }
    if (clawProcess.isRunning()) return; // Already restarted
    console.log('[AgUiServer] Attempting to auto-restart claw-code...');
    try {
      const config = clawProcess.getConfig();
      if (config) {
        await clawProcess.start(config);
        // Wait for TCP listener to be ready
        await new Promise((r) => setTimeout(r, 3000));
        if (!tcpBridge.isConnected()) {
          await tcpBridge.connect('127.0.0.1', CLAW_PORT);
        }
        // Wait for claw-code to send 'ready' message (MCP initialization)
        await new Promise<void>((resolve) => {
          const readyTimeout = setTimeout(() => {
            console.log('[AgUiServer] Timed out waiting for ready, proceeding anyway');
            resolve();
          }, 15000);
          const readyListener = (msg: TcpServerMessage) => {
            if (msg.type === 'ready') {
              tcpBridge.off('message', readyListener);
              clearTimeout(readyTimeout);
              console.log('[AgUiServer] claw-code ready after restart');
              resolve();
            }
          };
          tcpBridge.on('message', readyListener);
        });
        console.log('[AgUiServer] claw-code auto-restarted and ready');
      } else {
        console.log('[AgUiServer] No saved config, cannot auto-restart claw-code. User must POST /config.');
      }
    } catch (err: any) {
      console.error('[AgUiServer] Failed to auto-restart claw-code:', err.message);
    }
  }, 3000);
});

server.listen(PORT, () => {
  console.log(`[AgUiServer] AG-UI server listening on port ${PORT}`);
  console.log(`[AgUiServer] Endpoints:`);
  console.log(`  POST /agent  - AG-UI run (SSE stream)`);
  console.log(`  POST /config - Configure & connect Frontier`);
  console.log(`  POST /reset  - Reset session`);
  console.log(`  POST /slash  - Slash commands`);
  console.log(`  POST /tool-log - Tool call log toggle (enable/disable/toggle/status)`);
  console.log(`  GET  /health - Health check`);
  console.log(`  GET|PUT|DELETE /sessions - Session persistence (per-user)`);
  // Restore persisted heartbeat tasks
  loadHeartbeatTasks();
});

// Idle shutdown: if no frontend requests for 5 minutes, exit cleanly
let lastActivityTime = Date.now();
const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// Reset activity timer on any incoming request
const originalEmit = server.emit.bind(server);
server.emit = function(event: string, ...args: any[]) {
  if (event === 'request') lastActivityTime = Date.now();
  return originalEmit(event, ...args);
} as any;

// Check idle every 60 seconds
setInterval(() => {
  if (Date.now() - lastActivityTime > IDLE_TIMEOUT_MS) {
    console.log('[AgUiServer] No frontend activity for 5 minutes, shutting down...');
    // Clean shutdown: stop claw-code, close server, exit 0
    shuttingDown = true;
    if (clawProcess.isRunning()) {
      tcpBridge.disconnect();
      clawProcess.stop().then(() => process.exit(0)).catch(() => process.exit(0));
    } else {
      process.exit(0);
    }
  }
}, 60000);

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[AgUiServer] Port ${PORT} already in use. Please kill the old process and restart.`);
    process.exit(1);
  }
  throw err;
});
