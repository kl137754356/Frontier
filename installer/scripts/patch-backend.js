/**
 * Patches the compiled backend to serve static frontend files
 * when running in production/packaged mode.
 * 
 * Creates a static-server.js module that the agui-server can use
 * to serve frontend assets on the same port.
 */

const fs = require('fs');
const path = require('path');

const BACKEND_DIST = path.join(__dirname, '..', 'backend-dist');

const staticServerCode = `/**
 * Production wrapper: serves static frontend + backend API on single port.
 */
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const FRONTEND_DIR = process.env.FRONTEND_DIST || join(__dirname, '..', 'frontend-dist');
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

export function serveStatic(req, res) {
  if (!req.url || req.method !== 'GET') return false;
  
  // Skip API routes
  const apiPaths = ['/agent', '/config', '/reset', '/slash', '/health', '/a2ui-event', '/a2ui-test'];
  if (apiPaths.some(p => req.url.startsWith(p))) return false;

  let filePath = join(FRONTEND_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // SPA fallback
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    filePath = join(FRONTEND_DIR, 'index.html');
  }

  if (!existsSync(filePath)) return false;

  const ext = extname(filePath);
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  
  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
    return true;
  } catch {
    return false;
  }
}
`;

if (!fs.existsSync(BACKEND_DIST)) {
  fs.mkdirSync(BACKEND_DIST, { recursive: true });
}

fs.writeFileSync(path.join(BACKEND_DIST, 'static-server.js'), staticServerCode.trim());
console.log('Created backend-dist/static-server.js');
