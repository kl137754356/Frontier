/**
 * Claw Web Chat Backend - Entry Point
 *
 * Creates an HTTP server with WebSocket support that bridges
 * frontend WebSocket connections to claw-code's TCP --serve mode.
 *
 * Flow:
 * 1. Backend starts HTTP/WebSocket server immediately
 * 2. User opens web UI and configures API key + model
 * 3. Backend spawns claw-code child process with those credentials
 * 4. Backend connects TCP bridge to claw-code
 * 5. Chat is ready
 *
 * Environment variables:
 * - PORT: HTTP/WebSocket server port (default: 8080)
 * - CLAW_PORT: claw-code TCP port (default: 9527)
 */

import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { TcpBridge } from './tcp-bridge.js';
import { ClawProcess } from './claw-process.js';
import { createHealthHandler } from './health.js';
import { handleWebSocketConnection } from './ws-handler.js';

const PORT = parseInt(process.env.PORT || '8080', 10);
const CLAW_PORT = parseInt(process.env.CLAW_PORT || '9527', 10);

// Create instances
const tcpBridge = new TcpBridge();
const clawProcess = new ClawProcess();

// Create health check handler
const healthHandler = createHealthHandler(tcpBridge);

// Create HTTP server
const server = createServer((req, res) => {
  if (healthHandler(req, res)) return;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('[Server] New WebSocket connection');
  handleWebSocketConnection(ws, tcpBridge, clawProcess, CLAW_PORT);
});

// Logging
tcpBridge.on('connected', () => {
  console.log('[Server] TCP connected to claw-code');
});
tcpBridge.on('disconnected', () => {
  console.warn('[Server] TCP disconnected from claw-code');
});
tcpBridge.on('error', (err: Error) => {
  console.error('[Server] TCP error:', err.message);
});

clawProcess.on('log', (text: string) => {
  process.stderr.write(`[claw] ${text}`);
});
clawProcess.on('exit', (code: number | null) => {
  console.log(`[Server] claw-code process exited (code: ${code})`);
});

// Start HTTP server only — claw-code will be started when user provides API key
server.listen(PORT, () => {
  console.log(`[Server] Claw Web Chat backend listening on port ${PORT}`);
  console.log(`[Server] WebSocket: ws://localhost:${PORT}`);
  console.log('[Server] Waiting for API configuration from web UI...');
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Server] Port ${PORT} is already in use. Kill the existing process or use a different port:`);
    console.error(`  $env:PORT = "${PORT + 1}"; npm run dev:backend`);
    process.exit(1);
  }
  throw err;
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Server] Shutting down...');
  tcpBridge.disconnect();
  await clawProcess.stop();
  server.close();
  process.exit(0);
});

export { server, wss, tcpBridge, clawProcess };
