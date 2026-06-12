/**
 * Creates a self-contained distribution package for Frontier.
 * 
 * Output structure (in release/Frontier/):
 *   node/           - Embedded Node.js runtime (just node.exe)
 *   backend-dist/   - Compiled backend + node_modules
 *   frontend-dist/  - Built frontend static files
 *   bin/            - claw.exe (AI engine)
 *   skills/         - Bundled skills (heartbeat, etc.)
 *   docs/           - Documentation and guides
 *   mcp-servers/    - Optional MCP server extensions
 *   main.js         - Node.js launcher
 *   Frontier.bat    - Console launcher (shows logs)
 *   Frontier.vbs    - Silent launcher (no console window)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RELEASE_DIR = path.join(ROOT, 'release', 'Frontier');

console.log('=== Frontier Distribution Builder ===\n');

// Clean release dir
if (fs.existsSync(RELEASE_DIR)) {
  fs.rmSync(RELEASE_DIR, { recursive: true });
}
fs.mkdirSync(RELEASE_DIR, { recursive: true });

// Step 1: Copy app files
console.log('--- Step 1: Copy application files ---');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`  SKIP (not found): ${src}`);
    return;
  }
  fs.cpSync(src, dest, { recursive: true });
  console.log(`  ${path.basename(src)}/ copied`);
}

function copyFile(src, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  ${path.basename(src)} copied`);
}

copyDir(path.join(ROOT, 'frontend-dist'), path.join(RELEASE_DIR, 'frontend-dist'));
copyDir(path.join(ROOT, 'backend-dist'), path.join(RELEASE_DIR, 'backend-dist'));
copyFile(path.join(ROOT, 'bin', 'claw.exe'), path.join(RELEASE_DIR, 'bin', 'claw.exe'));
copyFile(path.join(ROOT, 'main.js'), path.join(RELEASE_DIR, 'main.js'));

// Copy Frontier.md (agent instructions — read by main.js, written to CLAUDE.md in workspace)
const frontierMd = path.join(ROOT, '..', 'Frontier.md');
if (fs.existsSync(frontierMd)) {
  copyFile(frontierMd, path.join(RELEASE_DIR, 'Frontier.md'));
  console.log('  Frontier.md (agent instructions) copied');
}

// Copy MCP servers directory and config template
copyDir(path.join(ROOT, 'mcp-servers'), path.join(RELEASE_DIR, 'mcp-servers'));
copyFile(path.join(ROOT, 'mcp-config-template.json'), path.join(RELEASE_DIR, 'mcp-config-template.json'));
console.log('  MCP servers and config template copied');

// Copy bundled skills
// Skills included: heartbeat (定时任务), and other built-in skills
copyDir(path.join(ROOT, 'skills'), path.join(RELEASE_DIR, 'skills'));
console.log('  Bundled skills copied (heartbeat, etc.)');

// Copy documentation
copyDir(path.join(ROOT, 'docs'), path.join(RELEASE_DIR, 'docs'));
console.log('  Documentation copied');

// Copy frontier settings reference (MCP config etc)
const clawSettings = path.join(ROOT, 'frontier-settings.json');
if (fs.existsSync(clawSettings)) {
  copyFile(clawSettings, path.join(RELEASE_DIR, 'frontier-settings.json'));
  console.log('  Frontier settings reference copied');
}

// Step 2: Copy Node.js runtime (just node.exe)
console.log('\n--- Step 2: Embed Node.js runtime ---');
const nodeDestDir = path.join(RELEASE_DIR, 'node');
fs.mkdirSync(nodeDestDir, { recursive: true });
fs.copyFileSync(process.execPath, path.join(nodeDestDir, 'node.exe'));
console.log(`  node.exe (${process.version}) embedded`);

// Step 3: Create launcher scripts
console.log('\n--- Step 3: Create launchers ---');

const batchContent = '@echo off\r\ntitle Frontier\r\nset "APP_DIR=%~dp0"\r\nset "NODE=%APP_DIR%node\\\\node.exe"\r\n"%NODE%" "%APP_DIR%main.js"\r\n';
fs.writeFileSync(path.join(RELEASE_DIR, 'Frontier.bat'), batchContent);
console.log('  Frontier.bat (console launcher)');

// VBS for silent startup - no console window
const vbsContent = 'Set WshShell = CreateObject("WScript.Shell")\r\nWshShell.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)\r\nWshShell.Run """node\\node.exe"" ""main.js""", 0, False\r\n';
fs.writeFileSync(path.join(RELEASE_DIR, 'Frontier.vbs'), vbsContent);
console.log('  Frontier.vbs (silent launcher)');

// Step 4: Summary
console.log('\n--- Summary ---');
let totalSize = 0;
function calcSize(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) calcSize(full);
    else totalSize += fs.statSync(full).size;
  }
}
calcSize(RELEASE_DIR);
console.log(`  Total: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
console.log(`  Output: release/Frontier/`);
console.log('\n  Users can run Frontier.vbs (silent) or Frontier.bat (with console).');
console.log('  To distribute: zip the release/Frontier/ folder.');
