/**
 * Tool Call Logger for Frontier
 * 
 * Logs all tool/function calls within a conversation turn in a structured format.
 * Each conversation turn is bounded by "Start" and "End" markers.
 * Output is controlled by a global switch (environment variable or runtime toggle).
 * 
 * Log format:
 * ═══════════════════════════════════════════════════════════
 * 【<user_message> - Start】
 * ───────────────────────────────────────────────────────────
 * [Tool Call #1]
 *   Name: <tool_name>
 *   Input: <tool_input_json>
 *   Output: <tool_output>
 *   Duration: <ms>
 *   Error: <error_message_if_any>
 * ───────────────────────────────────────────────────────────
 * [Tool Call #2] ...
 * ═══════════════════════════════════════════════════════════
 * 【<user_message> - End】
 * ═══════════════════════════════════════════════════════════
 */

export interface ToolCallEntry {
  index: number;
  toolId: string;
  toolName: string;
  input: string;
  output: string;
  isError: boolean;
  errorMessage?: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
}

export interface ConversationTurnLog {
  userMessage: string;
  sessionId: string;
  runId: string;
  startTime: number;
  endTime?: number;
  toolCalls: ToolCallEntry[];
}

// --- Global switch ---
import { existsSync, readFileSync, writeFileSync, mkdirSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';

const CLAW_DIR = join(process.env.CLAW_WORKSPACE || process.cwd(), '.claw');
const PERSIST_PATH = join(CLAW_DIR, 'tool-log-enabled.json');
const LOG_FILE_PATH = join(CLAW_DIR, 'logs', 'tool-calls.log');

function loadPersistedState(): boolean {
  try {
    if (existsSync(PERSIST_PATH)) {
      const data = JSON.parse(readFileSync(PERSIST_PATH, 'utf8'));
      return data.enabled === true;
    }
  } catch {}
  return false;
}

function savePersistedState(enabled: boolean): void {
  try {
    mkdirSync(dirname(PERSIST_PATH), { recursive: true });
    writeFileSync(PERSIST_PATH, JSON.stringify({ enabled }, null, 2), 'utf8');
  } catch (err: any) {
    console.warn('[ToolCallLogger] Failed to persist state:', err.message);
  }
}

// Initialize: env var takes priority, otherwise load from disk
let _enabled = process.env.FRONTIER_TOOL_LOG === '1' || process.env.FRONTIER_TOOL_LOG === 'true' || loadPersistedState();

// --- File logging helper ---
function logLine(msg: string): void {
  console.log(msg);
  try {
    mkdirSync(dirname(LOG_FILE_PATH), { recursive: true });
    appendFileSync(LOG_FILE_PATH, msg + '\n', 'utf8');
  } catch {}
}

export function getLogFilePath(): string {
  return LOG_FILE_PATH;
}

export function isToolCallLogEnabled(): boolean {
  return _enabled;
}

export function setToolCallLogEnabled(enabled: boolean): void {
  _enabled = enabled;
  savePersistedState(enabled);
  console.log(`[ToolCallLogger] Logging ${enabled ? 'ENABLED' : 'DISABLED'}`);
}

export function toggleToolCallLog(): boolean {
  _enabled = !_enabled;
  savePersistedState(_enabled);
  console.log(`[ToolCallLogger] Logging ${_enabled ? 'ENABLED' : 'DISABLED'}`);
  return _enabled;
}

// --- Active turn tracker ---
const activeTurns: Map<string, ConversationTurnLog> = new Map();

/**
 * Start tracking a new conversation turn.
 */
export function startTurn(runId: string, sessionId: string, userMessage: string): void {
  if (!_enabled) return;

  const turn: ConversationTurnLog = {
    userMessage,
    sessionId,
    runId,
    startTime: Date.now(),
    toolCalls: [],
  };
  activeTurns.set(runId, turn);

  const separator = '═'.repeat(60);
  const header = `【${truncate(userMessage, 80)} - Start】`;
  logLine('');
  logLine(`[ToolCallLogger] ${separator}`);
  logLine(`[ToolCallLogger] ${header}`);
  logLine(`[ToolCallLogger]   Session: ${sessionId}`);
  logLine(`[ToolCallLogger]   RunId:   ${runId}`);
  logLine(`[ToolCallLogger]   Time:    ${new Date().toISOString()}`);
  logLine(`[ToolCallLogger] ${separator}`);
}

/**
 * Record a tool call start event.
 */
export function recordToolStart(runId: string, toolId: string, toolName: string, input: string): void {
  if (!_enabled) return;

  const turn = activeTurns.get(runId);
  if (!turn) return;

  const entry: ToolCallEntry = {
    index: turn.toolCalls.length + 1,
    toolId,
    toolName,
    input,
    output: '',
    isError: false,
    startTime: Date.now(),
  };
  turn.toolCalls.push(entry);

  const divider = '─'.repeat(60);
  logLine(`[ToolCallLogger] ${divider}`);
  logLine(`[ToolCallLogger] [Tool Call #${entry.index}] START`);
  logLine(`[ToolCallLogger]   Name:    ${toolName}`);
  logLine(`[ToolCallLogger]   ID:      ${toolId}`);
  logLine(`[ToolCallLogger]   Input:   ${formatPayload(input)}`);
}

/**
 * Record a tool call end event.
 */
export function recordToolEnd(runId: string, toolId: string, output: string, isError: boolean): void {
  if (!_enabled) return;

  const turn = activeTurns.get(runId);
  if (!turn) return;

  const entry = turn.toolCalls.find(t => t.toolId === toolId);
  if (!entry) return;

  entry.endTime = Date.now();
  entry.durationMs = entry.endTime - entry.startTime;
  entry.output = output;
  entry.isError = isError;
  if (isError) {
    entry.errorMessage = output;
  }

  logLine(`[ToolCallLogger] [Tool Call #${entry.index}] END`);
  logLine(`[ToolCallLogger]   Duration: ${entry.durationMs}ms`);
  logLine(`[ToolCallLogger]   IsError:  ${isError}`);
  if (isError) {
    logLine(`[ToolCallLogger]   Error:    ${formatPayload(output)}`);
  } else {
    logLine(`[ToolCallLogger]   Output:   ${formatPayload(output)}`);
  }
}

/**
 * End a conversation turn and print the full summary.
 */
export function endTurn(runId: string): void {
  if (!_enabled) return;

  const turn = activeTurns.get(runId);
  if (!turn) return;

  turn.endTime = Date.now();
  const totalDuration = turn.endTime - turn.startTime;

  const separator = '═'.repeat(60);
  const divider = '─'.repeat(60);
  logLine(`[ToolCallLogger] ${divider}`);
  logLine(`[ToolCallLogger] TURN SUMMARY:`);
  logLine(`[ToolCallLogger]   Total Tool Calls: ${turn.toolCalls.length}`);
  logLine(`[ToolCallLogger]   Total Duration:   ${totalDuration}ms`);
  logLine(`[ToolCallLogger]   Errors:           ${turn.toolCalls.filter(t => t.isError).length}`);
  logLine(`[ToolCallLogger] ${separator}`);
  logLine(`[ToolCallLogger] 【${truncate(turn.userMessage, 80)} - End】`);
  logLine(`[ToolCallLogger] ${separator}`);
  logLine('');

  // Also output as structured JSON for programmatic consumption
  const jsonLog = {
    type: 'TURN_TOOL_CALLS',
    userMessage: turn.userMessage,
    sessionId: turn.sessionId,
    runId: turn.runId,
    startTime: new Date(turn.startTime).toISOString(),
    endTime: new Date(turn.endTime).toISOString(),
    totalDurationMs: totalDuration,
    totalToolCalls: turn.toolCalls.length,
    errorCount: turn.toolCalls.filter(t => t.isError).length,
    toolCalls: turn.toolCalls.map(t => ({
      index: t.index,
      toolName: t.toolName,
      toolId: t.toolId,
      input: safeParseJson(t.input),
      output: safeParseJson(t.output),
      isError: t.isError,
      errorMessage: t.errorMessage || null,
      durationMs: t.durationMs || null,
    })),
  };
  logLine(`[ToolCallLogger:JSON] ${JSON.stringify(jsonLog)}`);

  // Cleanup
  activeTurns.delete(runId);
}

/**
 * End a turn due to error.
 */
export function endTurnWithError(runId: string, errorText: string): void {
  if (!_enabled) return;

  const turn = activeTurns.get(runId);
  if (!turn) return;

  turn.endTime = Date.now();
  const totalDuration = turn.endTime - turn.startTime;

  const separator = '═'.repeat(60);
  logLine(`[ToolCallLogger] ⚠ TURN ENDED WITH ERROR`);
  logLine(`[ToolCallLogger]   Error:    ${errorText}`);
  logLine(`[ToolCallLogger]   Duration: ${totalDuration}ms`);
  logLine(`[ToolCallLogger]   Tool Calls Completed: ${turn.toolCalls.filter(t => t.endTime).length}/${turn.toolCalls.length}`);
  logLine(`[ToolCallLogger] ${separator}`);
  logLine(`[ToolCallLogger] 【${truncate(turn.userMessage, 80)} - End (ERROR)】`);
  logLine(`[ToolCallLogger] ${separator}`);
  logLine('');

  activeTurns.delete(runId);
}

// --- Helpers ---

function truncate(str: string, maxLen: number): string {
  if (!str) return '';
  // Remove newlines for display
  const oneLine = str.replace(/[\r\n]+/g, ' ').trim();
  if (oneLine.length <= maxLen) return oneLine;
  return oneLine.slice(0, maxLen) + '...';
}

function formatPayload(str: string, maxLen: number = 500): string {
  if (!str) return '(empty)';
  // Try to pretty-print JSON
  try {
    const obj = JSON.parse(str);
    const pretty = JSON.stringify(obj, null, 2);
    if (pretty.length <= maxLen) return '\n' + pretty.split('\n').map(l => `[ToolCallLogger]            ${l}`).join('\n');
    return truncate(str, maxLen);
  } catch {
    return truncate(str, maxLen);
  }
}

function safeParseJson(str: string): any {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
