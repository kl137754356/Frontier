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
const NODE_EXE = path.join(APP_DIR, 'node', 'node.exe');

// User data (workspace for claw-code)
const USER_DATA = path.join(process.env.APPDATA || process.env.HOME || APP_DIR, 'frontier-desktop');
if (!fs.existsSync(USER_DATA)) fs.mkdirSync(USER_DATA, { recursive: true });
const LOG_FILE = path.join(USER_DATA, 'frontier.log');

let backendProcess = null;

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
  let updated = 0;
  for (const dir of skillDirs) {
    const srcDir = path.join(bundledSkillsDir, dir.name);
    const destDir = path.join(workspaceSkillsDir, dir.name);
    if (!fs.existsSync(destDir)) {
      // New skill — copy everything
      copySkillDirToWorkspace(srcDir, destDir);
      copied++;
    } else {
      // Existing skill — only add NEW files that don't exist yet
      // (preserves user customizations and claw.exe's encrypted versions)
      updated += copyNewSkillFiles(srcDir, destDir);
    }
  }

  if (copied > 0) log(`Skills setup: copied ${copied} new skill(s) to ${workspaceSkillsDir}`);
  if (updated > 0) log(`Skills updated: added ${updated} new file(s) to existing skills`);
  if (copied === 0 && updated === 0) log('Skills already up to date');
}

/**
 * Set up hooks template — copies hooks.template.json to workspace .claw/hooks.json on first launch.
 * Won't overwrite if file already exists (preserves user modifications).
 */
function setupHooksTemplate() {
  const templateSrc = path.join(APP_DIR, 'hooks.template.json');
  const targetPath = path.join(USER_DATA, '.claw', 'hooks.json');

  if (!fs.existsSync(templateSrc)) {
    log('No hooks template found, skipping');
    return;
  }

  if (fs.existsSync(targetPath)) {
    log('hooks.json already exists, skipping template copy');
    return;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(templateSrc, targetPath);
  log('Hooks template copied to ' + targetPath);
}

/**
 * Refresh skill files in workspace every launch.
 * Overwrites bundled skill files (.txt) to keep them current.
 * Also cleans up any leftover .md/.IPGSD from old format.
 */
function refreshSkillFiles() {
  const bundledSkillsDir = path.join(APP_DIR, 'skills');
  const workspaceSkillsDir = path.join(USER_DATA, '.claw', 'skills');

  if (!fs.existsSync(bundledSkillsDir) || !fs.existsSync(workspaceSkillsDir)) return;

  let refreshed = 0;
  let cleaned = 0;

  const skillDirs = fs.readdirSync(bundledSkillsDir, { withFileTypes: true })
    .filter(e => e.isDirectory());

  for (const dir of skillDirs) {
    const srcDir = path.join(bundledSkillsDir, dir.name);
    const destDir = path.join(workspaceSkillsDir, dir.name);
    if (!fs.existsSync(destDir)) continue;

    const files = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile()) continue;

      const srcPath = path.join(srcDir, file.name);
      const destPath = path.join(destDir, file.name);

      // Clean up any leftover .md or .IPGSD from old format (when files were copied as .md)
      if (file.name.endsWith('.txt')) {
        const oldMd = path.join(destDir, file.name.replace(/\.txt$/, '.md'));
        const oldEnc = oldMd + '.IPGSD';
        if (fs.existsSync(oldEnc)) { try { fs.unlinkSync(oldEnc); cleaned++; } catch {} }
        if (fs.existsSync(oldMd)) { try { fs.unlinkSync(oldMd); cleaned++; } catch {} }
      }

      // Always overwrite .txt with fresh content from bundled source
      fs.writeFileSync(destPath, fs.readFileSync(srcPath, 'utf8'), 'utf8');
      refreshed++;
    }
  }

  if (refreshed > 0 || cleaned > 0) {
    log(`Skill files refreshed: ${refreshed} updated, ${cleaned} old files cleaned`);
  }
}

/**
 * Copy a skill directory to workspace.
 * Files are kept as-is (.txt stays .txt) since claw.exe now supports both .md and .txt.
 * This avoids .md files being encrypted by enterprise DLP (e.g. MDE) on some machines.
 */
function copySkillDirToWorkspace(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copySkillDirToWorkspace(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copy only new files from src skill dir to dest, skipping any that already exist.
 * Files are kept as-is (.txt stays .txt) since claw.exe now supports both.
 * Returns the count of newly copied files.
 */
function copyNewSkillFiles(src, dest, depth = 0) {
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    if (entry.isDirectory()) {
      count += copyNewSkillFiles(srcPath, path.join(dest, entry.name), depth + 1);
    } else {
      const destPath = path.join(dest, entry.name);
      // Also check if the .md version already exists (user may have it in old format)
      const mdVariant = destPath.replace(/\.txt$/, '.md');
      const alreadyExists = fs.existsSync(destPath) || fs.existsSync(mdVariant)
        || fs.existsSync(destPath + '.IPGSD') || fs.existsSync(mdVariant + '.IPGSD');
      if (!alreadyExists) {
        fs.copyFileSync(srcPath, destPath);
        count++;
      }
    }
  }
  return count;
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
 * Export readable .txt copies of all skill .md files to a user-accessible folder.
 * claw.exe encrypts .md files in .claw/skills/ — this gives users a plain-text copy
 * they can open with any text editor.
 * Always overwrites so docs stay current after app updates.
 */
function exportSkillDocs() {
  const bundledSkillsDir = path.join(APP_DIR, 'skills');
  const docsOutDir = path.join(USER_DATA, 'skills-docs');

  if (!fs.existsSync(bundledSkillsDir)) return;

  fs.mkdirSync(docsOutDir, { recursive: true });

  // Walk every skill directory and copy .md → .txt
  const entries = fs.readdirSync(bundledSkillsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillSrcDir = path.join(bundledSkillsDir, entry.name);
    const skillDocDir = path.join(docsOutDir, entry.name);
    fs.mkdirSync(skillDocDir, { recursive: true });

    const files = fs.readdirSync(skillSrcDir, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile()) continue;
      if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) continue;
      const src = path.join(skillSrcDir, file.name);
      // Ensure output is always .txt
      const destName = file.name.endsWith('.md') ? file.name.replace(/\.md$/, '.txt') : file.name;
      const dest = path.join(skillDocDir, destName);
      const content = fs.readFileSync(src, 'utf8');
      fs.writeFileSync(dest, '\uFEFF' + content, 'utf8');
    }
  }

  // Also export installer/docs/*.md as .txt
  const bundledDocsDir = path.join(APP_DIR, 'docs');
  if (fs.existsSync(bundledDocsDir)) {
    const mainDocDir = path.join(docsOutDir, 'docs');
    fs.mkdirSync(mainDocDir, { recursive: true });
    for (const file of fs.readdirSync(bundledDocsDir)) {
      if (!file.endsWith('.md')) continue;
      const content = fs.readFileSync(path.join(bundledDocsDir, file), 'utf8');
      fs.writeFileSync(
        path.join(mainDocDir, file.replace(/\.md$/, '.txt')),
        '\uFEFF' + content, 'utf8'
      );
    }
  }

  log(`Skill docs exported as .txt to: ${docsOutDir}`);
}

/**
 * Auto-detect MCP server executables in the mcp-servers/ directory and
 * register them in .claw/settings.json. Supports:
 *   metrology-mcp.exe  → "metrology" server
 *   pcdmis-mcp.exe     → "pcdmis" server
 * Always updates to pick up path changes after reinstall.
 */
function setupLocalMcpServers() {
  const mcpDir = path.join(APP_DIR, 'mcp-servers');
  const settingsPath = path.join(USER_DATA, '.claw', 'settings.json');

  // Only auto-configure if settings.json doesn't exist yet (first launch)
  // After first launch, user owns settings.json — don't modify it
  if (!fs.existsSync(mcpDir) || !fs.existsSync(settingsPath)) return;

  const mcpMappings = [
    {
      exeName: 'metrology-mcp.exe',
      serverKey: 'metrology',
      buildConfig: (exePath) => ({
        command: exePath,
        args: [],
        env: { METROLOGY_AI_URL: process.env.METROLOGY_AI_URL || 'http://localhost:8780' },
      }),
    },
    {
      exeName: 'pcdmis-mcp.exe',
      serverKey: 'pcdmis',
      buildConfig: (exePath) => ({
        command: exePath,
        args: [],
      }),
    },
  ];

  let changed = false;
  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch {
    return;
  }
  if (!settings.mcpServers) settings.mcpServers = {};

  const files = fs.readdirSync(mcpDir);
  for (const mapping of mcpMappings) {
    const found = files.find(f => f.toLowerCase() === mapping.exeName.toLowerCase());
    if (found) {
      // Use absolute path (APP_DIR is the install location, not relative to cwd)
      const exePath = path.join(mcpDir, found);
      const newConfig = mapping.buildConfig(exePath);
      const existingCmd = settings.mcpServers[mapping.serverKey]?.command || '';
      if (!settings.mcpServers[mapping.serverKey] || existingCmd !== exePath) {
        settings.mcpServers[mapping.serverKey] = newConfig;
        log(`MCP server configured: ${mapping.serverKey} → ${found}`);
        changed = true;
      }
    } else {
      if (settings.mcpServers[mapping.serverKey]) {
        delete settings.mcpServers[mapping.serverKey];
        log(`MCP server removed (exe not found): ${mapping.serverKey}`);
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
  }
}

/**
 * Write CLAUDE.md to the workspace root.
 * claw.exe reads CLAUDE.md (hardcoded name) as persistent memory on every startup.
 * Source content comes from Frontier.md bundled in the app directory.
 * Always overwrite so instructions stay current after updates.
 */
function setupClaudeMd() {
  // Write to .claw/instructions.txt — claw.exe reads this as system prompt.
  // Using .txt extension to avoid enterprise DLP (MDE) encryption of .md files.
  const instructionsPath = path.join(USER_DATA, '.claw', 'instructions.txt');
  fs.mkdirSync(path.dirname(instructionsPath), { recursive: true });

  // Try to read from bundled Frontier.txt
  const frontierMdPath = path.join(APP_DIR, 'Frontier.txt');
  if (fs.existsSync(frontierMdPath)) {
    const content = fs.readFileSync(frontierMdPath, 'utf8');
    fs.writeFileSync(instructionsPath, content, 'utf8');
    log('instructions.txt written to workspace from Frontier.txt');
    return;
  }

  // Fallback: inline content
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
  ].join('\n');

  fs.writeFileSync(instructionsPath, content, 'utf8');
  log('instructions.txt written to workspace (fallback)');
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

  // Set up bundled skills (first launch only, won't overwrite user changes)
  setupSkills();

  // Set up hooks template (first launch only, won't overwrite user changes)
  setupHooksTemplate();

  // Refresh skill .md files — delete encrypted .IPGSD and rewrite clean plaintext.
  // Must run before claw.exe connects so files are readable.
  refreshSkillFiles();

  // Export readable .txt copies of all skill docs (always refresh so updates are visible)
  exportSkillDocs();

  // Write/update CLAUDE.md with mandatory agent instructions (always overwrite to stay current)
  setupClaudeMd();

  // Write .claw/settings.json ONLY if it doesn't exist (first launch).
  // If it exists, never overwrite — user modifications are preserved.
  const clawSettingsSrc = path.join(APP_DIR, 'frontier-settings.json');
  const clawSettingsDst = path.join(USER_DATA, '.claw', 'settings.json');
  let settingsIsNew = false;
  if (fs.existsSync(clawSettingsSrc)) {
    fs.mkdirSync(path.dirname(clawSettingsDst), { recursive: true });

    if (!fs.existsSync(clawSettingsDst)) {
      // First launch: write template as-is
      const userHome = (process.env.USERPROFILE || process.env.HOME || '').replace(/\\/g, '\\\\');
      let templateContent = fs.readFileSync(clawSettingsSrc, 'utf8');
      templateContent = templateContent.replace(/\$\{USER_HOME\}/g, userHome);
      const template = JSON.parse(templateContent);
      fs.writeFileSync(clawSettingsDst, JSON.stringify(template, null, 2), 'utf8');
      log(`Settings created: ${clawSettingsDst}`);
      settingsIsNew = true;
    } else {
      log(`Settings already exist, skipping (user modifications preserved)`);
    }
  }

  // Auto-configure MCP servers found in mcp-servers/ directory (only on first launch)
  if (settingsIsNew) {
    setupLocalMcpServers();
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
