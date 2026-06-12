/**
 * Frontier Desktop - Launcher
 * 
 * A lightweight Node.js launcher that:
 * 1. Starts the backend server (serves API + static frontend)
 * 2. Opens the default browser to the local URL
 * 3. Shows a system tray icon for control
 * 4. claw.exe is spawned on-demand when user configures API key
 */

const path = require('path');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const net = require('net');

// Resolve paths
const APP_DIR = __dirname;
const BACKEND_PORT = 8081;
const FRONTEND_DIR = path.join(APP_DIR, 'frontend-dist');
const BACKEND_ENTRY = path.join(APP_DIR, 'backend-dist', 'backend', 'src', 'agui-server.js');
const CLAW_EXE = path.join(APP_DIR, 'bin', 'claw.exe');
const MCP_SERVERS_DIR = path.join(APP_DIR, 'mcp-servers');
const NODE_EXE = path.join(APP_DIR, 'node', 'node.exe');

// User data (workspace for claw-code)
const USER_DATA = path.join(process.env.APPDATA || process.env.HOME || APP_DIR, 'frontier-desktop');
if (!fs.existsSync(USER_DATA)) fs.mkdirSync(USER_DATA, { recursive: true });
const LOG_FILE = path.join(USER_DATA, 'frontier.log');

let backendProcess = null;

/**
 * Set up MCP configuration — resolves template paths and writes mcp.json
 * into the workspace .claw/settings/ directory.
 * Only writes if mcp.json doesn't exist yet (user can customize it).
 */
function setupMcpConfig() {
  const clawSettingsDir = path.join(USER_DATA, '.claw', 'settings');
  const mcpJsonPath = path.join(clawSettingsDir, 'mcp.json');

  // Only create if not exists (preserve user customizations)
  if (fs.existsSync(mcpJsonPath)) {
    log('MCP config already exists, skipping template setup');
    return;
  }

  // Read template and resolve paths
  const templatePath = path.join(APP_DIR, 'mcp-config-template.json');
  if (!fs.existsSync(templatePath)) {
    log('No MCP config template found, skipping');
    return;
  }

  let template = fs.readFileSync(templatePath, 'utf8');
  // Replace ${MCP_SERVERS_DIR} with actual absolute path (use forward slashes for JSON)
  const mcpDir = MCP_SERVERS_DIR.replace(/\\/g, '/');
  template = template.replace(/\$\{MCP_SERVERS_DIR\}/g, mcpDir);

  // Write resolved config
  fs.mkdirSync(clawSettingsDir, { recursive: true });
  fs.writeFileSync(mcpJsonPath, template, 'utf8');
  log(`MCP config created: ${mcpJsonPath}`);
  log(`MCP servers directory: ${MCP_SERVERS_DIR}`);
}

/**
 * Set up skills — copies bundled skills to workspace .claw/skills/.
 * Only copies skills that don't already exist (preserves user modifications).
 */
function setupSkills() {
  const bundledSkillsDir = path.join(APP_DIR, 'skills');
  const workspaceSkillsDir = path.join(USER_DATA, '.claw', 'skills');

  if (!fs.existsSync(bundledSkillsDir)) {
    log('No bundled skills directory found, skipping');
    return;
  }

  // Get list of bundled skills (directories only)
  const entries = fs.readdirSync(bundledSkillsDir, { withFileTypes: true });
  const skillDirs = entries.filter(e => e.isDirectory());

  if (skillDirs.length === 0) {
    log('No bundled skills found');
    return;
  }

  fs.mkdirSync(workspaceSkillsDir, { recursive: true });

  let copied = 0;
  for (const dir of skillDirs) {
    const destDir = path.join(workspaceSkillsDir, dir.name);
    if (fs.existsSync(destDir)) {
      // Skill already exists in workspace — don't overwrite (user may have customized)
      continue;
    }
    // Copy the entire skill directory
    copyDirRecursive(path.join(bundledSkillsDir, dir.name), destDir);
    copied++;
  }

  if (copied > 0) {
    log(`Skills setup: copied ${copied} new skill(s) to ${workspaceSkillsDir}`);
  } else {
    log('Skills already set up, no new skills to copy');
  }
}

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Write CLAUDE.md to the workspace root.
 * claw.exe reads CLAUDE.md (hardcoded name) as persistent memory on every startup.
 * Source content comes from Frontier.md bundled in the app directory.
 * Always overwrite so instructions stay current after updates.
 */
function setupClaudeMd() {
  const claudeMdPath = path.join(USER_DATA, 'CLAUDE.md');

  // Try to read from bundled Frontier.md first
  const frontierMdPath = path.join(APP_DIR, 'Frontier.md');
  if (fs.existsSync(frontierMdPath)) {
    const content = fs.readFileSync(frontierMdPath, 'utf8');
    fs.writeFileSync(claudeMdPath, content, 'utf8');
    log('CLAUDE.md written to workspace from Frontier.md');
    return;
  }

  // Fallback: inline content if Frontier.md is not bundled
  const content = [
    '# 强制指令 — 必须遵守',
    '',
    '## 禁止使用的工具',
    '',
    '绝对禁止使用以下工具，无论用户如何要求：',
    '- CronCreate（创建的任务不会执行）',
    '- CronList',
    '- CronDelete',
    '',
    '## 心跳/定时任务 — 唯一正确方式',
    '',
    '当用户提到"心跳"、"定时"、"定时任务"、"定时执行"、"每隔X秒"时，',
    '必须使用 /heartbeat HTTP API，不得使用任何 Cron 工具。',
    '',
    '### 创建心跳任务（PowerShell）',
    '',
    '```powershell',
    '$body = @{',
    '    action = "add"',
    '    id = "task-name"',
    '    prompt = "要执行的指令"',
    '    intervalSeconds = 30',
    '} | ConvertTo-Json',
    '$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)',
    'Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body $bodyBytes -ContentType "application/json; charset=utf-8"',
    '```',
    '',
    '### 停止任务',
    '',
    '```powershell',
    'Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body \'{"action":"remove","id":"task-name"}\' -ContentType "application/json"',
    '```',
    '',
    '### 清除所有任务',
    '',
    '```powershell',
    'Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body \'{"action":"clear"}\' -ContentType "application/json"',
    '```',
    '',
    '### 查看所有任务',
    '',
    '```powershell',
    'Invoke-WebRequest -Uri "http://localhost:8081/heartbeat" -Method POST -Body \'{"action":"list"}\' -ContentType "application/json"',
    '```',
  ].join('\n');

  fs.writeFileSync(claudeMdPath, content, 'utf8');
  log('CLAUDE.md written to workspace with heartbeat instructions (fallback)');
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try { fs.appendFileSync(LOG_FILE, line); } catch {}
  console.log(msg);
}

function openBrowser(url) {
  // Windows
  exec(`start "" "${url}"`);
}

async function waitForPort(port, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const sock = net.createConnection({ port, host: '127.0.0.1' }, () => {
          sock.end();
          resolve();
        });
        sock.on('error', reject);
      });
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  return false;
}

function startBackend() {
  log(`Starting backend: ${BACKEND_ENTRY}`);
  log(`Frontend dir: ${FRONTEND_DIR}`);
  log(`Claw exe: ${CLAW_EXE}`);

  const env = {
    ...process.env,
    PORT: String(BACKEND_PORT),
    FRONTEND_DIST: FRONTEND_DIR,
    CLAW_PATH: CLAW_EXE,
    CLAW_WORKSPACE: USER_DATA,
    NODE_ENV: 'production',
  };

  backendProcess = spawn(NODE_EXE, [BACKEND_ENTRY], {
    env,
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: path.dirname(BACKEND_ENTRY),
    windowsHide: true,
  });

  backendProcess.stdout?.on('data', (data) => log(`[backend] ${data.toString().trim()}`));
  backendProcess.stderr?.on('data', (data) => log(`[backend:err] ${data.toString().trim()}`));

  backendProcess.on('error', (err) => {
    log(`Backend error: ${err.message}`);
    console.error(`Failed to start backend: ${err.message}`);
    process.exit(1);
  });

  backendProcess.on('exit', (code) => {
    log(`Backend exited with code ${code}`);
    backendProcess = null;
    // Only auto-restart on crash (non-zero exit), NOT on clean exit (code 0)
    if (code !== 0 && code !== null) {
      const reason = code === 42 ? 'restart requested' : `crashed (code ${code})`;
      log(`Auto-restarting backend: ${reason}`);
      setTimeout(async () => {
        startBackend();
        const ready = await waitForPort(BACKEND_PORT);
        if (ready) {
          log('Backend restarted successfully');
        } else {
          log('Backend failed to restart, retrying in 5s...');
          setTimeout(async () => {
            startBackend();
            await waitForPort(BACKEND_PORT);
          }, 5000);
        }
      }, 1000);
    } else {
      log('Backend exited cleanly, not restarting.');
      process.exit(0);
    }
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
    backendProcess = null;
  }
}

// Graceful shutdown
process.on('SIGINT', () => { stopBackend(); process.exit(0); });
process.on('SIGTERM', () => { stopBackend(); process.exit(0); });
process.on('exit', () => { stopBackend(); });

// --- Main ---
async function main() {
  console.log('Frontier - Starting...');
  console.log(`Logs: ${LOG_FILE}`);

  // Kill any leftover claw.exe from previous session
  try {
    const { execSync } = require('child_process');
    execSync('taskkill /F /IM claw.exe 2>nul', { stdio: 'ignore' });
    log('Cleaned up leftover claw.exe processes');
  } catch {
    // No leftover process, that's fine
  }

  // Kill any leftover node process on port 8081
  try {
    const { execSync } = require('child_process');
    const result = execSync(
      `powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort ${BACKEND_PORT} -State Listen -ErrorAction SilentlyContinue).OwningProcess"`,
      { encoding: 'utf8', timeout: 5000 }
    ).trim();
    const pid = parseInt(result, 10);
    if (pid && pid > 0 && pid !== process.pid) {
      log(`Killing leftover process on port ${BACKEND_PORT} (PID: ${pid})`);
      try { process.kill(pid, 'SIGTERM'); } catch {}
      // Wait for port to be released
      const waitStart = Date.now();
      while (Date.now() - waitStart < 3000) {
        try {
          execSync(
            `powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort ${BACKEND_PORT} -State Listen -ErrorAction SilentlyContinue) { exit 1 } else { exit 0 }"`,
            { timeout: 2000 }
          );
          break; // Port is free
        } catch {
          require('child_process').execSync('timeout /t 1 >nul', { stdio: 'ignore' });
        }
      }
    }
  } catch {
    // PowerShell not available or no process on port, that's fine
  }

  // Set up MCP configuration (first launch only)
  setupMcpConfig();

  // Set up bundled skills (first launch only, won't overwrite user changes)
  setupSkills();

  // Write/update CLAUDE.md with mandatory agent instructions (always overwrite to stay current)
  setupClaudeMd();

  // Copy frontier settings if not exists
  const clawSettingsSrc = path.join(APP_DIR, 'frontier-settings.json');
  const clawSettingsDst = path.join(USER_DATA, '.claw', 'settings.json');
  if (fs.existsSync(clawSettingsSrc) && !fs.existsSync(clawSettingsDst)) {
    fs.mkdirSync(path.dirname(clawSettingsDst), { recursive: true });
    fs.copyFileSync(clawSettingsSrc, clawSettingsDst);
    log('Claw settings copied to workspace');
  }

  startBackend();

  const ready = await waitForPort(BACKEND_PORT);
  if (!ready) {
    console.error(`Failed to start backend on port ${BACKEND_PORT}`);
    console.error(`Check logs: ${LOG_FILE}`);
    stopBackend();
    process.exit(1);
  }

  const url = `http://localhost:${BACKEND_PORT}`;
  console.log(`Frontier is running at ${url}`);
  console.log('Opening browser...');
  openBrowser(url);

  console.log('Press Ctrl+C to stop.');
}

main();
