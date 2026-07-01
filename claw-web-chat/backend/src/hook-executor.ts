/**
 * Hook_Executor - 事件触发引擎
 *
 * 接收事件 → 匹配 enabled Hook → 异步执行动作（fire-and-forget）。
 */

import { exec } from 'child_process';
import { HookManager } from './hook-manager.js';
import type { HookEventPayload, HookDefinition } from './hook-types.js';

export class HookExecutor {
  private hookManager: HookManager;
  private sendPromptFn: (prompt: string) => void;

  constructor(hookManager: HookManager, sendPromptFn: (prompt: string) => void) {
    this.hookManager = hookManager;
    this.sendPromptFn = sendPromptFn;
  }

  /**
   * 触发事件，匹配并异步执行所有符合条件的 Hook。
   * Fire-and-forget: 不返回 Promise，不阻塞调用方。
   */
  fire(event: HookEventPayload): void {
    try {
      const hooks = this.hookManager.list();
      const matched = hooks.filter(hook => this.matches(hook, event));

      if (matched.length > 0) {
        console.log(`[HookExecutor] Event "${event.type}" matched ${matched.length} hook(s)`);
      }

      for (const hook of matched) {
        this.executeAsync(hook, event);
      }
    } catch (err: any) {
      console.error('[HookExecutor] Error in fire():', err.message);
    }
  }

  /**
   * 手动触发单个 Hook，无论 enabled 状态如何。
   */
  triggerManual(hookId: string): boolean {
    try {
      const hook = this.hookManager.get(hookId);
      if (!hook) return false;
      console.log(`[HookExecutor] Manual trigger: "${hook.name}"`);
      this.executeAsync(hook, { type: hook.event as HookEventPayload['type'] });
      return true;
    } catch (err: any) {
      console.error('[HookExecutor] Error in triggerManual():', err.message);
      return false;
    }
  }

  private matches(hook: HookDefinition, event: HookEventPayload): boolean {
    // Must be enabled and event type must match
    if (!hook.enabled || hook.event !== event.type) return false;

    // If pattern is specified, check against event payload
    const pattern = hook.eventConfig?.pattern;
    if (pattern) {
      const textToMatch = this.getEventText(event);
      if (!textToMatch) return false;
      try {
        const regex = new RegExp(pattern);
        if (!regex.test(textToMatch)) return false;
      } catch {
        console.warn(`[HookExecutor] Invalid regex pattern in hook "${hook.name}": ${pattern}`);
        return false;
      }
    }

    return true;
  }

  private getEventText(event: HookEventPayload): string {
    switch (event.type) {
      case 'prompt-submit': return event.data?.prompt || '';
      case 'run-complete': return event.data?.response || '';
      case 'run-error': return event.data?.error || '';
      case 'tool-error': return event.data?.toolError || '';
      default: return '';
    }
  }

  private executeAsync(hook: HookDefinition, event: HookEventPayload): void {
    // Fire-and-forget execution
    try {
      switch (hook.action) {
        case 'send-prompt': {
          const prompt = hook.actionConfig.prompt;
          if (prompt) {
            // For tool-error events, inject tool context into the prompt
            let enrichedPrompt = prompt;
            if (event.type === 'tool-error' && event.data) {
              enrichedPrompt = `[工具调用出错]\n工具名: ${event.data.toolName || 'unknown'}\n输入: ${(event.data.toolInput || '').slice(0, 500)}\n错误信息: ${(event.data.toolError || '').slice(0, 1000)}\n\n${prompt}`;
            }
            console.log(`[HookExecutor] Hook "${hook.name}" sending prompt: ${enrichedPrompt.slice(0, 80)}...`);
            this.sendPromptFn(`[Hook: ${hook.name}] ${enrichedPrompt}`);
          }
          break;
        }
        case 'run-command': {
          const command = hook.actionConfig.command;
          if (command) {
            console.log(`[HookExecutor] Hook "${hook.name}" running command: ${command.slice(0, 80)}`);
            exec(command, { timeout: 30000 }, (err, stdout, stderr) => {
              if (err) {
                console.error(`[HookExecutor] Hook "${hook.name}" command failed:`, err.message);
              }
              if (stdout) console.log(`[HookExecutor] Hook "${hook.name}" stdout: ${stdout.slice(0, 500)}`);
              if (stderr) console.warn(`[HookExecutor] Hook "${hook.name}" stderr: ${stderr.slice(0, 500)}`);
            });
          }
          break;
        }
      }
    } catch (err: any) {
      console.error(`[HookExecutor] Hook "${hook.name}" execution error:`, err.message);
    }
  }
}
