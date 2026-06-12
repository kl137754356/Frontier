import { describe, it, expect, vi } from 'vitest';
import { createHealthHandler } from './health.js';
import type { TcpBridge } from './tcp-bridge.js';

function createMockTcpBridge(connected: boolean): TcpBridge {
  return {
    isConnected: () => connected,
  } as unknown as TcpBridge;
}

function createMockReq(method: string, url: string) {
  return { method, url } as any;
}

function createMockRes() {
  const res: any = {
    writeHead: vi.fn(),
    end: vi.fn(),
  };
  return res;
}

describe('Health Check Handler', () => {
  it('should return true and respond with health status when GET /health', () => {
    const bridge = createMockTcpBridge(true);
    const handler = createHealthHandler(bridge);

    const req = createMockReq('GET', '/health');
    const res = createMockRes();

    const handled = handler(req, res);

    expect(handled).toBe(true);
    expect(res.writeHead).toHaveBeenCalledWith(200, expect.objectContaining({
      'Content-Type': 'application/json',
    }));

    const body = JSON.parse(res.end.mock.calls[0][0]);
    expect(body.status).toBe('ok');
    expect(body.http).toBe(true);
    expect(body.tcp).toBe(true);
    expect(typeof body.uptime).toBe('number');
  });

  it('should return degraded status when TCP is disconnected', () => {
    const bridge = createMockTcpBridge(false);
    const handler = createHealthHandler(bridge);

    const req = createMockReq('GET', '/health');
    const res = createMockRes();

    handler(req, res);

    const body = JSON.parse(res.end.mock.calls[0][0]);
    expect(body.status).toBe('degraded');
    expect(body.http).toBe(true);
    expect(body.tcp).toBe(false);
  });

  it('should return false for non-health routes', () => {
    const bridge = createMockTcpBridge(true);
    const handler = createHealthHandler(bridge);

    const req = createMockReq('GET', '/other');
    const res = createMockRes();

    const handled = handler(req, res);
    expect(handled).toBe(false);
    expect(res.writeHead).not.toHaveBeenCalled();
  });

  it('should return false for non-GET methods', () => {
    const bridge = createMockTcpBridge(true);
    const handler = createHealthHandler(bridge);

    const req = createMockReq('POST', '/health');
    const res = createMockRes();

    const handled = handler(req, res);
    expect(handled).toBe(false);
  });
});
