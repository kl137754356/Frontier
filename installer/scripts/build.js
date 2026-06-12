/**
 * Build script for Frontier Desktop installer.
 * 
 * Steps:
 * 1. Build frontend (vite build) → copy dist to installer/frontend-dist/
 * 2. Build backend (tsc) → copy dist to installer/backend-dist/
 * 3. Copy claw.exe to installer/bin/
 * 4. Install production dependencies
 * 5. Run electron-builder to create installer
 * 
 * Usage: node scripts/build.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(ROOT, '..');
const FRONTEND_DIR = path.join(PROJECT_ROOT, 'claw-web-chat', 'frontend');
const BACKEND_DIR = path.join(PROJECT_ROOT, 'claw-web-chat', 'backend');
const SHARED_DIR = path.join(PROJECT_ROOT, 'claw-web-chat', 'shared');

function run(cmd, cwd) {
  console.log(`\n> [${path.basename(cwd || ROOT)}] ${cmd}`);
  execSync(cmd, { cwd: cwd || ROOT, stdio: 'inherit', shell: true });
}

function copyDir(src, dest) {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true });
  }
  fs.cpSync(src, dest, { recursive: true });
  console.log(`  Copied: ${src} → ${dest}`);
}

function copyFile(src, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  Copied: ${path.basename(src)} → ${dest}`);
}

// ============================================================
console.log('=== Frontier Desktop Build ===\n');

// Step 1: Build Frontend
console.log('--- Step 1: Build Frontend ---');
run('npm install', FRONTEND_DIR);
run('npm run build', FRONTEND_DIR);
copyDir(path.join(FRONTEND_DIR, 'dist'), path.join(ROOT, 'frontend-dist'));

// Step 2: Build Backend
console.log('\n--- Step 2: Build Backend ---');
run('npm install', BACKEND_DIR);
run('npm run build', BACKEND_DIR);
copyDir(path.join(BACKEND_DIR, 'dist'), path.join(ROOT, 'backend-dist'));

// Copy shared types (backend imports from shared/)
if (fs.existsSync(SHARED_DIR)) {
  copyDir(SHARED_DIR, path.join(ROOT, 'backend-dist', '..', 'shared'));
}

// Step 3: Copy claw.exe
console.log('\n--- Step 3: Copy claw.exe ---');
const clawCandidates = [
  path.join(PROJECT_ROOT, 'rust', 'target', 'release', 'claw.exe'),
  path.join(PROJECT_ROOT, 'rust', 'target', 'debug', 'claw.exe'),
];

let clawFound = false;
for (const candidate of clawCandidates) {
  if (fs.existsSync(candidate)) {
    copyFile(candidate, path.join(ROOT, 'bin', 'claw.exe'));
    clawFound = true;
    break;
  }
}

if (!clawFound) {
  console.warn('  WARNING: claw.exe not found! Building Rust project...');
  try {
    run('cargo build --release', path.join(PROJECT_ROOT, 'rust'));
    copyFile(clawCandidates[0], path.join(ROOT, 'bin', 'claw.exe'));
  } catch (e) {
    console.error('  ERROR: Failed to build claw.exe. Installer will not include AI engine.');
    console.error('  Please build manually: cd rust && cargo build --release');
  }
}

// Step 4: Install production deps for backend runtime
console.log('\n--- Step 4: Install Backend Runtime Dependencies ---');
const backendPkg = JSON.parse(fs.readFileSync(path.join(BACKEND_DIR, 'package.json'), 'utf8'));
const runtimePkg = {
  name: 'frontier-backend-runtime',
  version: '1.0.0',
  type: 'module',
  dependencies: backendPkg.dependencies || {},
};
const runtimeDir = path.join(ROOT, 'backend-dist');
fs.writeFileSync(path.join(runtimeDir, 'package.json'), JSON.stringify(runtimePkg, null, 2));
run('npm install --omit=dev', runtimeDir);

// Step 5: Install electron deps
console.log('\n--- Step 5: Install Electron Dependencies ---');
run('npm install', ROOT);

console.log('\n=== Build Complete ===');
console.log('To create installer: npm run dist:win');
console.log('To test locally: npm start');
