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

/**
 * Copy a directory, renaming all .md files to .txt so claw.exe doesn't encrypt them.
 * claw.exe watches for .md files and encrypts them on the fly.
 */
function copyDirRenameMd(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`  SKIP (not found): ${src}`);
    return;
  }
  copyDirRecursiveRenameMd(src, dest);
  console.log(`  ${path.basename(src)}/ copied (.md → .txt)`);
}

function copyDirRecursiveRenameMd(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursiveRenameMd(srcPath, path.join(dest, entry.name));
    } else if (entry.name.endsWith('.md')) {
      // Rename .md → .txt and write with UTF-8 BOM (so Windows Notepad shows Chinese correctly)
      const content = fs.readFileSync(srcPath, 'utf8');
      const destName = entry.name.replace(/\.md$/, '.txt');
      fs.writeFileSync(path.join(dest, destName), '\uFEFF' + content, 'utf8');
    } else {
      fs.copyFileSync(srcPath, path.join(dest, entry.name));
    }
  }
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

// Copy Frontier.md as Frontier.txt (agent instructions — renamed to avoid claw.exe encryption)
const frontierMd = path.join(ROOT, '..', 'Frontier.md');
if (fs.existsSync(frontierMd)) {
  const content = fs.readFileSync(frontierMd, 'utf8');
  fs.writeFileSync(path.join(RELEASE_DIR, 'Frontier.txt'), '\uFEFF' + content, 'utf8');
  console.log('  Frontier.txt (agent instructions) copied');
}

// Copy MCP servers directory and config template are no longer needed.
// claw.exe reads MCP config from CLAW_WORKSPACE/.claw/settings.json (copied from frontier-settings.json).

// Copy mcp-servers/ folder (contains user-supplied MCP server executables + README)
copyDir(path.join(ROOT, 'mcp-servers'), path.join(RELEASE_DIR, 'mcp-servers'));
console.log('  mcp-servers/ folder copied (place metrology-mcp.exe / pcdmis-mcp.exe here)');


// Copy bundled skills — rename .md to .txt to prevent claw.exe encryption
copyDirRenameMd(path.join(ROOT, 'skills'), path.join(RELEASE_DIR, 'skills'));
console.log('  Bundled skills copied (heartbeat, etc.)');

// Copy documentation — rename .md to .txt
copyDirRenameMd(path.join(ROOT, 'docs'), path.join(RELEASE_DIR, 'docs'));
console.log('  Documentation copied');

// Copy frontier settings reference (MCP config etc)
const clawSettings = path.join(ROOT, 'frontier-settings.json');
if (fs.existsSync(clawSettings)) {
  copyFile(clawSettings, path.join(RELEASE_DIR, 'frontier-settings.json'));
  console.log('  Frontier settings reference copied');
}

// Copy hooks template
const hooksTemplate = path.join(ROOT, 'hooks.template.json');
if (fs.existsSync(hooksTemplate)) {
  copyFile(hooksTemplate, path.join(RELEASE_DIR, 'hooks.template.json'));
  console.log('  Hooks template copied');
}

// Step 2: Copy Node.js runtime (just node.exe)
console.log('\n--- Step 2: Embed Node.js runtime ---');
const nodeDestDir = path.join(RELEASE_DIR, 'node');
fs.mkdirSync(nodeDestDir, { recursive: true });
fs.copyFileSync(process.execPath, path.join(nodeDestDir, 'node.exe'));
console.log(`  node.exe (${process.version}) embedded`);

// Step 3: Create launcher scripts
console.log('\n--- Step 3: Create launchers ---');

const batchContent = [
  '@echo off',
  'title Frontier',
  ':: Check for admin rights',
  'net session >nul 2>&1',
  'if %errorlevel% neq 0 (',
  '    echo Requesting administrator privileges...',
  '    powershell -Command "Start-Process \'%~f0\' -Verb RunAs"',
  '    exit /b',
  ')',
  'set "APP_DIR=%~dp0"',
  'set "NODE=%APP_DIR%node\\\\node.exe"',
  '"%NODE%" "%APP_DIR%main.js"',
  '',
].join('\r\n');
fs.writeFileSync(path.join(RELEASE_DIR, 'Frontier.bat'), batchContent);
console.log('  Frontier.bat (console launcher, admin)');

// VBS for silent startup with admin elevation
const vbsContent = [
  'Set fso = CreateObject("Scripting.FileSystemObject")',
  'Set WshShell = CreateObject("WScript.Shell")',
  'appDir = fso.GetParentFolderName(WScript.ScriptFullName)',
  "' Run as Administrator",
  'Set objShell = CreateObject("Shell.Application")',
  'objShell.ShellExecute appDir & "\\node\\node.exe", """" & appDir & "\\main.js""", appDir, "runas", 0',
  '',
].join('\r\n');
fs.writeFileSync(path.join(RELEASE_DIR, 'Frontier.vbs'), vbsContent);
console.log('  Frontier.vbs (silent launcher, admin)');

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
