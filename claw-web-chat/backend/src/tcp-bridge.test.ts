import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as net from 'net';
import { TcpBridge } from './tcp-bridge.js';
import type { TcpServerMessage } from '../../shared/protocol.js';

describe('TcpBridge', () => {
  let bridge: TcpBridge;
  let server: net.Server;
  let serverPort: number;
  let serverSocket: net.Socket | null = null;

  beforeEach(async () => {
    bridge = new TcpBridge();
    serverSocket = null;

    // Create a test TCP server
    server = net.createServer((socket) => {
      serverSocket = socket;
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address() as net.AddressInfo;
        serverPort = addr.port;
        resolve();
      });
    });
  });

  afterEach(async () => {
    bridge.disconnect();
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  describe('connect()', () => {
    it('should connect to the TCP server', async () => {
      await bridge.connect('127.0.0.1', serverPort);
      expect(bridge.isConnected()).toBe(true);
    });

    it('should emit "connected" event on successful connection', async () => {
      const connectedHandler = vi.fn();
      bridge.on('connected', connectedHandler);

      await bridge.connect('127.0.0.1', serverPort);
      expect(connectedHandler).toHaveBeenCalledOnce();
    });

    it('should reject when connection fails', async () => {
      await expect(bridge.connect('127.0.0.1', 1)).rejects.toThrow();
    });
  });

  describe('disconnect()', () => {
    it('should disconnect from the server', async () => {
      await bridge.connect('127.0.0.1', serverPort);
      bridge.disconnect();
      expect(bridge.isConnected()).toBe(false);
    });

    it('should emit "disconnected" event', async () => {
      const disconnectedHandler = vi.fn();
      bridge.on('disconnected', disconnectedHandler);

      await bridge.connect('127.0.0.1', serverPort);
      bridge.disconnect();
      expect(disconnectedHandler).toHaveBeenCalled();
    });
  });

  describe('sendPrompt()', () => {
    it('should send a prompt message as JSON line', async () => {
      await bridge.connect('127.0.0.1', serverPort);

      // Wait for server to receive the socket
      await new Promise<void>((resolve) => setTimeout(resolve, 50));

      const dataPromise = new Promise<string>((resolve) => {
        serverSocket!.on('data', (data) => resolve(data.toString()));
      });

      bridge.sendPrompt('Hello, world!');

      const received = await dataPromise;
      expect(JSON.parse(received.trim())).toEqual({ type: 'prompt', text: 'Hello, world!' });
    });

    it('should throw when not connected', () => {
      expect(() => bridge.sendPrompt('test')).toThrow('Not connected');
    });
  });

  describe('sendReset()', () => {
    it('should send a reset message', async () => {
      await bridge.connect('127.0.0.1', serverPort);
      await new Promise<void>((resolve) => setTimeout(resolve, 50));

      const dataPromise = new Promise<string>((resolve) => {
        serverSocket!.on('data', (data) => resolve(data.toString()));
      });

      bridge.sendReset();

      const received = await dataPromise;
      expect(JSON.parse(received.trim())).toEqual({ type: 'reset' });
    });
  });

  describe('sendInject()', () => {
    it('should send an inject message with messages array', async () => {
      await bridge.connect('127.0.0.1', serverPort);
      await new Promise<void>((resolve) => setTimeout(resolve, 50));

      const dataPromise = new Promise<string>((resolve) => {
        serverSocket!.on('data', (data) => resolve(data.toString()));
      });

      const messages = [
        { role: 'user', text: 'hi' },
        { role: 'assistant', text: 'hello' },
      ];
      bridge.sendInject(messages);

      const received = await dataPromise;
      expect(JSON.parse(received.trim())).toEqual({ type: 'inject', messages });
    });
  });

  describe('sendHistory()', () => {
    it('should send a history message', async () => {
      await bridge.connect('127.0.0.1', serverPort);
      await new Promise<void>((resolve) => setTimeout(resolve, 50));

      const dataPromise = new Promise<string>((resolve) => {
        serverSocket!.on('data', (data) => resolve(data.toString()));
      });

      bridge.sendHistory();

      const received = await dataPromise;
      expect(JSON.parse(received.trim())).toEqual({ type: 'history' });
    });
  });

  describe('message parsing', () => {
    it('should emit parsed messages from server', async () => {
      await bridge.connect('127.0.0.1', serverPort);
      await new Promise<void>((resolve) => setTimeout(resolve, 50));

      const messagePromise = new Promise<TcpServerMessage>((resolve) => {
        bridge.on('message', resolve);
      });

      serverSocket!.write('{"type":"ready","model":"claude","session_id":"s1"}\n');

      const msg = await messagePromise;
      expect(msg).toEqual({ type: 'ready', model: 'claude', session_id: 's1' });
    });

    it('should handle multiple messages in one data event', async () => {
      await bridge.connect('127.0.0.1', serverPort);
      await new Promise<void>((resolve) => setTimeout(resolve, 50));

      const messages: TcpServerMessage[] = [];
      bridge.on('message', (msg) => messages.push(msg));

      serverSocket!.write(
        '{"type":"chunk","text":"hello"}\n{"type":"chunk","text":" world"}\n{"type":"done"}\n'
      );

      await new Promise<void>((resolve) => setTimeout(resolve, 50));

      expect(messages).toHaveLength(3);
      expect(messages[0]).toEqual({ type: 'chunk', text: 'hello' });
      expect(messages[1]).toEqual({ type: 'chunk', text: ' world' });
      expect(messages[2]).toEqual({ type: 'done' });
    });

    it('should handle partial messages across data events', async () => {
      await bridge.connect('127.0.0.1', serverPort);
      await new Promise<void>((resolve) => setTimeout(resolve, 50));

      const messages: TcpServerMessage[] = [];
      bridge.on('message', (msg) => messages.push(msg));

      // Send partial data
      serverSocket!.write('{"type":"chunk","te');
      await new Promise<void>((resolve) => setTimeout(resolve, 30));
      expect(messages).toHaveLength(0);

      // Complete the message
      serverSocket!.write('xt":"partial"}\n');
      await new Promise<void>((resolve) => setTimeout(resolve, 30));
      expect(messages).toHaveLength(1);
      expect(messages[0]).toEqual({ type: 'chunk', text: 'partial' });
    });
  });

  describe('reconnection', () => {
    it('should attempt reconnection when server closes connection', async () => {
      await bridge.connect('127.0.0.1', serverPort);

      const errorHandler = vi.fn();
      bridge.on('error', errorHandler);

      const disconnectedHandler = vi.fn();
      bridge.on('disconnected', disconnectedHandler);

      // Server closes the connection
      serverSocket!.destroy();

      // Wait for disconnect event
      await new Promise<void>((resolve) => setTimeout(resolve, 100));
      expect(disconnectedHandler).toHaveBeenCalled();
    });

    it('should not reconnect after intentional disconnect', async () => {
      await bridge.connect('127.0.0.1', serverPort);

      const connectedHandler = vi.fn();
      bridge.on('connected', connectedHandler);

      bridge.disconnect();

      // Wait to ensure no reconnection attempt
      await new Promise<void>((resolve) => setTimeout(resolve, 2500));
      // Only the initial connect should have triggered 'connected'
      expect(connectedHandler).not.toHaveBeenCalled();
    });
  });

  describe('isConnected()', () => {
    it('should return false before connecting', () => {
      expect(bridge.isConnected()).toBe(false);
    });

    it('should return true after connecting', async () => {
      await bridge.connect('127.0.0.1', serverPort);
      expect(bridge.isConnected()).toBe(true);
    });

    it('should return false after disconnecting', async () => {
      await bridge.connect('127.0.0.1', serverPort);
      bridge.disconnect();
      expect(bridge.isConnected()).toBe(false);
    });
  });
});
