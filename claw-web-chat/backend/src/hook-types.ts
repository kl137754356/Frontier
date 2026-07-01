/**
 * Hook Management - Shared Types & Constants
 *
 * 事件驱动的自动化触发器系统类型定义。
 */

import { join } from 'path';

// --- Path Resolution (same pattern as SKILLS_DIR) ---
const CLAW_WORKSPACE = process.env.CLAW_WORKSPACE || '';
export const HOOKS_JSON_PATH = CLAW_WORKSPACE
  ? join(CLAW_WORKSPACE, '.claw', 'hooks.json')
  : join(process.cwd(), '.claw', 'hooks.json');

// --- Event & Action Enums ---
export type HookEventType = 'prompt-submit' | 'run-complete' | 'run-error' | 'app-start' | 'tool-error';
export type HookActionType = 'send-prompt' | 'run-command';

export const VALID_EVENTS: HookEventType[] = ['prompt-submit', 'run-complete', 'run-error', 'app-start', 'tool-error'];
export const VALID_ACTIONS: HookActionType[] = ['send-prompt', 'run-command'];

// --- Data Model ---
export interface HookDefinition {
  id: string;
  name: string;
  description?: string;
  event: HookEventType;
  eventConfig: {
    pattern?: string; // 正则字符串，用于 prompt-submit 按关键词过滤
  };
  action: HookActionType;
  actionConfig: {
    prompt?: string;  // send-prompt 时的内容
    command?: string; // run-command 时的 shell 命令
  };
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface HookInput {
  name: string;
  description?: string;
  event: HookEventType;
  eventConfig?: { pattern?: string };
  action: HookActionType;
  actionConfig: { prompt?: string; command?: string };
  enabled?: boolean;
}

// --- hooks.json File Structure ---
export interface HooksFile {
  version: number;
  hooks: HookDefinition[];
}

// --- Result Type ---
export type HookErrorCode =
  | 'MISSING_NAME'
  | 'DUPLICATE_NAME'
  | 'NOT_FOUND'
  | 'INVALID_EVENT'
  | 'INVALID_ACTION';

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: { code: HookErrorCode; message: string; field?: string } };

// --- Event Payload ---
export interface HookEventPayload {
  type: HookEventType;
  data?: {
    prompt?: string;     // prompt-submit 时的用户消息
    response?: string;   // run-complete 时的 AI 回复
    error?: string;      // run-error 时的错误信息
    toolName?: string;   // tool-error 时的工具名
    toolInput?: string;  // tool-error 时的工具输入
    toolError?: string;  // tool-error 时的错误输出
  };
}
