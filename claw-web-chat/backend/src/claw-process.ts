/**
 * ClawProcess - Manages the claw-code child process lifecycle.
 *
 * Spawns claw-code with --serve mode using user-provided API credentials.
 * Allows restarting with different credentials without restarting the backend.
 */

import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';

export interface ClawConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  port: number;
}

export class ClawProcess extends EventEmitter {
  private process: ChildProcess | null = null;
  private config: ClawConfig | null = null;
  private clawPath: string;
  private ready: boolean = false;

  constructor(clawPath?: string) {
    super();
    // Default: look for claw.exe via env var or relative to project root
    this.clawPath = clawPath || process.env.CLAW_PATH || this.findClawExecutable();
  }

  /**
   * Start claw-code with the given configuration.
   * If already running, stops the current instance first.
   */
  async start(config: ClawConfig): Promise<void> {
    if (this.process) {
      await this.stop();
    }

    this.config = config;
    this.ready = false;

    const env: Record<string, string> = {
      ...process.env as Record<string, string>,
    };

    // Set API credentials based on model prefix
    const isOpenAI = config.model && config.model.startsWith('openai/');
    if (isOpenAI) {
      env.OPENAI_API_KEY = config.apiKey;
      if (config.baseUrl) {
        env.OPENAI_BASE_URL = config.baseUrl;
      }
    } else {
      env.ANTHROPIC_API_KEY = config.apiKey;
      if (config.baseUrl) {
        env.ANTHROPIC_BASE_URL = config.baseUrl;
      }
    }

    // On Windows, PATH may be stored as 'Path' - normalize to ensure both are set
    const currentPath = env.PATH || env.Path || '';
    const enrichedPath = this.ensurePath(currentPath);
    // Set both variants to ensure child process gets the correct PATH
    env.PATH = enrichedPath;
    env.Path = enrichedPath;

    const args: string[] = [];
    if (config.model) {
      args.push('--model', config.model);
    }
    args.push('--serve', String(config.port));

    return new Promise<void>((resolve, reject) => {
      // Set cwd to workspace root so claw-code can find .claw/ config (MCP, plugins, skills)
      // In packaged mode, use CLAW_WORKSPACE env var; in dev, resolve relative to backend cwd
      const workspaceRoot = process.env.CLAW_WORKSPACE || path.resolve(process.cwd(), '..', '..');
      console.log('[ClawProcess] Spawning with cwd:', workspaceRoot);
      console.log('[ClawProcess] PATH includes:', (env.PATH || env.Path || '').split(path.delimiter).slice(0, 10).join('\n  '));

      try {
        this.process = spawn(this.clawPath, args, {
          env,
          cwd: workspaceRoot,
          stdio: ['pipe', 'pipe', 'pipe'],
          shell: false,
        });
      } catch (err) {
        reject(new Error(`Failed to spawn claw-code: ${err instanceof Error ? err.message : err}`));
        return;
      }

      const timeout = setTimeout(() => {
        if (!this.ready) {
          // Even if we didn't see "listening", it might still be starting
          this.ready = true;
          resolve();
        }
      }, 5000);

      this.process.stderr?.on('data', (data: Buffer) => {
        const text = data.toString();
        this.emit('log', text);

        // Detect when claw-code is ready
        if (text.includes('listening on')) {
          this.ready = true;
          clearTimeout(timeout);
          resolve();
        }

        // Detect credential errors
        if (text.includes('missing Anthropic credentials') || text.includes('authentication')) {
          clearTimeout(timeout);
          reject(new Error('Invalid API credentials'));
        }
      });

      this.process.stdout?.on('data', (data: Buffer) => {
        this.emit('log', data.toString());
      });

      this.process.on('error', (err) => {
        clearTimeout(timeout);
        this.ready = false;
        this.process = null;
        reject(err);
      });

      this.process.on('exit', (code) => {
        clearTimeout(timeout);
        this.ready = false;
        this.process = null;
        this.emit('exit', code);
        reject(new Error(`claw-code exited with code ${code}`));
      });
    });
  }

  /**
   * Stop the claw-code process.
   */
  async stop(): Promise<void> {
    if (!this.process) return;

    return new Promise<void>((resolve) => {
      const proc = this.process!;
      proc.on('exit', () => {
        this.process = null;
        this.ready = false;
        resolve();
      });

      proc.kill('SIGTERM');

      // Force kill after 3s
      setTimeout(() => {
        if (this.process) {
          this.process.kill('SIGKILL');
        }
      }, 3000);
    });
  }

  isRunning(): boolean {
    return this.process !== null && this.ready;
  }

  /**
   * Write to claw-code's stdin (for interactive [Question] responses).
   */
  writeStdin(text: string): void {
    if (this.process && this.process.stdin) {
      this.process.stdin.write(text + '\n');
    }
  }

  getConfig(): ClawConfig | null {
    return this.config;
  }

  /**
   * Ensure PATH contains Node.js, PowerShell, Git, and other common tool directories.
   * Always prepends critical paths to guarantee they're found first.
   */
  private ensurePath(currentPath: string): string {
    const sep = path.delimiter; // ';' on Windows

    // Always prepend these critical paths (order matters)
    const criticalPaths = [
      'C:\\Program Files\\Git\\bin',
      'C:\\Program Files\\Git\\cmd',
      'C:\\Windows\\System32\\WindowsPowerShell\\v1.0',
      'C:\\Windows\\System32',
      'C:\\Windows',
      'D:\\Program Files (x86)\\nodejs',
      'C:\\Program Files\\nodejs',
    ];

    // Also check for optional paths that may exist
    const optionalPaths = [
      'C:\\Program Files\\PowerShell\\7',
      path.join(process.env.LOCALAPPDATA || '', 'Programs\\Python\\Python311\\Scripts'),
      path.join(process.env.LOCALAPPDATA || '', 'Programs\\Python\\Python312\\Scripts'),
      path.join(process.env.USERPROFILE || '', '.cargo\\bin'),
    ];

    const extraPaths: string[] = [...criticalPaths];

    for (const candidate of optionalPaths) {
      if (!candidate) continue;
      try {
        if (fs.statSync(candidate).isDirectory()) {
          extraPaths.push(candidate);
        }
      } catch { /* skip */ }
    }

    const result = [...extraPaths, currentPath].join(sep);
    console.log('[ClawProcess] PATH prepended with:', criticalPaths.join(sep));
    return result;
  }

  private findClawExecutable(): string {
    // Backend cwd is claw-web-chat/backend when run via npm run dev
    // Workspace root is claw-web-chat/../ (i.e., claw-code_network)
    // claw.exe is at workspace_root/rust/target/debug/claw.exe
    const candidates = [
      path.resolve(process.cwd(), '..', '..', 'rust', 'target', 'debug', 'claw.exe'),
      path.resolve(process.cwd(), '..', '..', 'rust', 'target', 'release', 'claw.exe'),
    ];

    for (const p of candidates) {
      try {
        if (fs.statSync(p).isFile()) {
          console.log('[ClawProcess] Found claw executable:', p);
          return p;
        }
      } catch { /* not found, try next */ }
    }

    console.warn('[ClawProcess] claw.exe not found, tried:', candidates);
    return candidates[0];
  }
}
