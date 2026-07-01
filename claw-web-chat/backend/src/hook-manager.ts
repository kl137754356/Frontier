/**
 * Hook_Manager - 业务逻辑层
 *
 * CRUD + 字段校验 + hook_id 生成 + 时间戳维护。
 */

import { randomUUID } from 'crypto';
import { HookStore } from './hook-store.js';
import {
  VALID_EVENTS,
  VALID_ACTIONS,
  type HookDefinition,
  type HookInput,
  type HookErrorCode,
  type Result,
} from './hook-types.js';

export class HookManager {
  private store: HookStore;

  constructor(store: HookStore) {
    this.store = store;
  }

  list(): HookDefinition[] {
    return this.store.loadAll();
  }

  get(hookId: string): HookDefinition | null {
    const hooks = this.store.loadAll();
    return hooks.find(h => h.id === hookId) || null;
  }

  create(input: HookInput): Result<HookDefinition> {
    // Validate name
    const name = (input.name || '').trim();
    if (!name) {
      return { ok: false, error: { code: 'MISSING_NAME', message: 'Hook name is required', field: 'name' } };
    }

    // Validate event
    if (!VALID_EVENTS.includes(input.event)) {
      return { ok: false, error: { code: 'INVALID_EVENT', message: `Invalid event type: ${input.event}. Valid: ${VALID_EVENTS.join(', ')}`, field: 'event' } };
    }

    // Validate action
    if (!VALID_ACTIONS.includes(input.action)) {
      return { ok: false, error: { code: 'INVALID_ACTION', message: `Invalid action type: ${input.action}. Valid: ${VALID_ACTIONS.join(', ')}`, field: 'action' } };
    }

    // Check name uniqueness
    const hooks = this.store.loadAll();
    if (hooks.some(h => h.name.trim() === name)) {
      return { ok: false, error: { code: 'DUPLICATE_NAME', message: `Hook name "${name}" already exists`, field: 'name' } };
    }

    const now = Date.now();
    const hook: HookDefinition = {
      id: randomUUID(),
      name,
      description: input.description || '',
      event: input.event,
      eventConfig: input.eventConfig || {},
      action: input.action,
      actionConfig: input.actionConfig || {},
      enabled: input.enabled !== undefined ? input.enabled : true,
      createdAt: now,
      updatedAt: now,
    };

    hooks.push(hook);
    this.store.saveAll(hooks);
    return { ok: true, value: hook };
  }

  update(hookId: string, input: Partial<HookInput>): Result<HookDefinition> {
    const hooks = this.store.loadAll();
    const idx = hooks.findIndex(h => h.id === hookId);
    if (idx === -1) {
      return { ok: false, error: { code: 'NOT_FOUND', message: `Hook "${hookId}" not found` } };
    }

    const existing = hooks[idx];

    // If name is being changed, validate
    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name) {
        return { ok: false, error: { code: 'MISSING_NAME', message: 'Hook name is required', field: 'name' } };
      }
      // Check uniqueness excluding self
      if (hooks.some(h => h.id !== hookId && h.name.trim() === name)) {
        return { ok: false, error: { code: 'DUPLICATE_NAME', message: `Hook name "${name}" already exists`, field: 'name' } };
      }
      existing.name = name;
    }

    // Validate event if provided
    if (input.event !== undefined) {
      if (!VALID_EVENTS.includes(input.event)) {
        return { ok: false, error: { code: 'INVALID_EVENT', message: `Invalid event type: ${input.event}`, field: 'event' } };
      }
      existing.event = input.event;
    }

    // Validate action if provided
    if (input.action !== undefined) {
      if (!VALID_ACTIONS.includes(input.action)) {
        return { ok: false, error: { code: 'INVALID_ACTION', message: `Invalid action type: ${input.action}`, field: 'action' } };
      }
      existing.action = input.action;
    }

    if (input.description !== undefined) existing.description = input.description;
    if (input.eventConfig !== undefined) existing.eventConfig = input.eventConfig;
    if (input.actionConfig !== undefined) existing.actionConfig = input.actionConfig;
    if (input.enabled !== undefined) existing.enabled = input.enabled;

    existing.updatedAt = Date.now();
    hooks[idx] = existing;
    this.store.saveAll(hooks);
    return { ok: true, value: existing };
  }

  remove(hookId: string): Result<void> {
    const hooks = this.store.loadAll();
    const idx = hooks.findIndex(h => h.id === hookId);
    if (idx === -1) {
      return { ok: false, error: { code: 'NOT_FOUND', message: `Hook "${hookId}" not found` } };
    }

    hooks.splice(idx, 1);
    this.store.saveAll(hooks);
    return { ok: true, value: undefined };
  }

  toggle(hookId: string, enabled: boolean): Result<HookDefinition> {
    const hooks = this.store.loadAll();
    const idx = hooks.findIndex(h => h.id === hookId);
    if (idx === -1) {
      return { ok: false, error: { code: 'NOT_FOUND', message: `Hook "${hookId}" not found` } };
    }

    hooks[idx].enabled = enabled;
    hooks[idx].updatedAt = Date.now();
    this.store.saveAll(hooks);
    return { ok: true, value: hooks[idx] };
  }
}
