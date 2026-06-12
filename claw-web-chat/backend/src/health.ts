/**
 * Health check endpoint for the claw-web-chat backend.
 *
 * Provides a GET /health endpoint that reports the status of:
 * - HTTP server (always true if responding)
 * - TCP connection to claw-code
 * - Server uptime
 */

import type { IncomingMessage, ServerResponse } from 'http';
import type { TcpBridge } from './tcp-bridge.js';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  http: boolean;
  tcp: boolean;
  uptime: number;
}

const startTime = Date.now();

/**
 * Create a health check request handler.
 * Returns a function that handles HTTP GET /health requests.
 */
export function createHealthHandler(tcpBridge: TcpBridge) {
  return (req: IncomingMessage, res: ServerResponse): boolean => {
    if (req.method !== 'GET' || req.url !== '/health') {
      return false;
    }

    const tcpConnected = tcpBridge.isConnected();
    const uptime = Math.floor((Date.now() - startTime) / 1000);

    const health: HealthStatus = {
      status: tcpConnected ? 'ok' : 'degraded',
      http: true,
      tcp: tcpConnected,
      uptime,
    };

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(health));
    return true;
  };
}
