/**
 * Hook_Store - 纯数据层
 *
 * 负责读写 hooks.json，原子写入，解析失败降级为空列表。
 */

import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { HOOKS_JSON_PATH, type HookDefinition, type HooksFile } from './hook-types.js';

export class HookStore {
  private filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || HOOKS_JSON_PATH;
  }

  /**
   * 读取全部 Hook。文件不存在或 JSON 解析失败 → 返回 []，记录日志，不抛出。
   */
  loadAll(): HookDefinition[] {
    try {
      if (!existsSync(this.filePath)) {
        return [];
      }
      const raw = readFileSync(this.filePath, 'utf8');
      const parsed: HooksFile = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.hooks)) {
        console.error('[HookStore] Invalid hooks.json structure, returning empty list');
        return [];
      }
      return parsed.hooks;
    } catch (err: any) {
      console.error('[HookStore] Failed to load hooks.json:', err.message);
      return [];
    }
  }

  /**
   * 原子写入：先写临时文件再 rename 覆盖。
   */
  saveAll(hooks: HookDefinition[]): void {
    const dir = dirname(this.filePath);
    mkdirSync(dir, { recursive: true });

    const hooksFile: HooksFile = { version: 1, hooks };
    const content = JSON.stringify(hooksFile, null, 2);
    const tmpPath = this.filePath + '.tmp';

    writeFileSync(tmpPath, content, 'utf8');
    renameSync(tmpPath, this.filePath);
  }
}
