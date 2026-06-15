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
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { TcpBridge } from './tcp-bridge.js';
import { ClawProcess } from './claw-process.js';
import { resolveSkill } from './ws-handler.js';
import type { TcpServerMessage } from '../../shared/protocol.js';

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
let autoCompacting = false;
let lastPromptText: string | null = null;
let activeSSEResponse: ServerResponse | null = null; // Track active SSE response for [Question] interception
let activeRunId: string | null = null;
let activeMessageId: string | null = null;
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

function addHeartbeatTask(id: string, prompt: string, intervalMs: number): HeartbeatTask {
  // Remove existing task with same id
  removeHeartbeatTask(id);
  const task: HeartbeatTask = { id, prompt, intervalMs, timer: null, createdAt: Date.now(), lastRun: null, runCount: 0, stopped: false };
  task.timer = setInterval(() => {
    // Check if task has been stopped (immediate stop of in-flight tasks)
    if (task.stopped) {
      console.log(`[Heartbeat] Task '${id}' is stopped, skipping execution`);
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
  return count;
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

// --- POST /agent: AG-UI run endpoint ---
async function handleAgentRun(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await parseBody(req);
  const { threadId, runId, messages } = body;

  // Extract the last user message as the prompt
  const lastUserMsg = [...(messages || [])].reverse().find((m: any) => m.role === 'user');
  if (!lastUserMsg) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'No user message provided' }));
    return;
  }

  if (!tcpBridge.isConnected()) {
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
            sendSseEvent(res, { type: 'TOOL_CALL_END', toolCallId: toolId, result: '', isError: false });
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
        break;
      }

      case 'tool_end': {
        // Remove from pending set
        const wasPending = pendingToolIds.delete(msg.id);
        pendingToolNames.delete(msg.id);
        const timing = toolTimings.get(msg.id);
        if (timing) timing.end = Date.now();
        const toolDuration = timing ? (timing.end! - timing.start) : 0;
        console.log(`[AgUiServer] tool_end: ${timing?.name || 'unknown'} (id=${msg.id}) took ${toolDuration}ms, wasPending=${wasPending}, is_error=${msg.is_error}, output_len=${msg.output?.length || 0} [+${Date.now() - t0}ms]`);
        sendSseEvent(res, { type: 'TOOL_CALL_END', toolCallId: msg.id, result: msg.output, isError: msg.is_error });

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
            sendSseEvent(res, { type: 'TOOL_CALL_END', toolCallId: toolId, result: '', isError: false });
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
  tcpBridge.removeAllListeners('message');
  tcpBridge.on('message', onMessage);

  // Send the prompt to claw-code
  console.log('[AgUiServer] Sending prompt to claw-code:', finalPrompt.slice(0, 100));
  tPromptSent = Date.now();
  tcpBridge.sendPrompt(finalPrompt);
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
    if (sameApiKey) {
      console.log(`[Config#${reqId}] SKIP — same token, reusing connection`);
      connectingInProgress = false;
      if (connectingTimer) { clearTimeout(connectingTimer); connectingTimer = null; }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'connected', model: currentConfig?.model }));
      return;
    }
    console.log(`[Config#${reqId}] RESTART — token changed (new account)`);
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
    await new Promise((r) => setTimeout(r, 3000));

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

// --- POST /cancel: Kill the current claw-code run ---
// Restarts claw-code process to unblock any stuck PowerShell/bash command.
// The frontend should reconnect via POST /config after calling this.
async function handleCancel(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCorsHeaders(res);
  console.log('[AgUiServer] Cancel requested — restarting claw-code to unblock stuck run');

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

  // Restart claw-code — this kills any child processes (PowerShell, bash) it spawned
  const config = clawProcess.getConfig();
  if (config) {
    try {
      await clawProcess.stop();
      tcpBridge.disconnect();
      await clawProcess.start(config);
      await tcpBridge.connect('127.0.0.1', config.port);
      console.log('[AgUiServer] claw-code restarted successfully');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'restarted' }));
    } catch (err) {
      console.error('[AgUiServer] Failed to restart claw-code:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to restart' }));
    }
  } else {
    // Not configured yet — just close anything active
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
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: tcpBridge.isConnected() ? 'ok' : 'degraded',
    tcp: tcpBridge.isConnected(),
    clawRunning: clawProcess.isRunning(),
    connectingInProgress,
    uptime: process.uptime(),
  }));
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
          result = { tasks: listHeartbeatTasks().map(t => ({ id: t.id, prompt: t.prompt, intervalMs: t.intervalMs, lastRun: t.lastRun, runCount: t.runCount })) };
          break;
        case 'clear':
          const count = clearAllHeartbeatTasks();
          result = { status: 'ok', removed: count };
          break;
        default:
          result = { error: 'Unknown action. Use: add, remove, list, clear' };
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
tcpBridge.on('connected', () => { console.log('[AgUiServer] TCP connected to claw-code'); });
tcpBridge.on('disconnected', () => {
  console.warn('[AgUiServer] TCP disconnected from claw-code');
  // Don't auto-reconnect here — the 'exit' handler on clawProcess will handle restart
  // Auto-reconnect only if claw is still running (e.g., TCP glitch without process crash)
  setTimeout(() => {
    // Skip auto-reconnect if a manual handleConfig is in progress (it will connect itself)
    if (connectingInProgress) return;
    if (!tcpBridge.isConnected() && clawProcess.isRunning()) {
      console.log('[AgUiServer] Attempting TCP auto-reconnect (claw still running)...');
      tcpBridge.connect('127.0.0.1', CLAW_PORT);
    }
  }, 3000);
});
tcpBridge.on('error', (err: Error) => { console.error('[AgUiServer] TCP error:', err.message); });
clawProcess.on('log', (text: string) => {
  process.stderr.write(`[claw] ${text}`);

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
  console.log(`  GET  /health - Health check`);
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
