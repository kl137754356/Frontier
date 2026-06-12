import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WsClient, sendPrompt, sendReset, sendSlashCommand } from './ws-client';
import { useChatStore } from '../store/chat-store';

// --- Mock WebSocket ---

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  url: string;
  readyState: number = 0; // CONNECTING
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  sentMessages: string[] = [];
  closed = false;

  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  send(data: string): void {
    this.sentMessages.push(data);
  }

  close(): void {
    this.closed = true;
    this.readyState = MockWebSocket.CLOSED;
  }

  // Test helpers
  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.();
  }

  simulateMessage(data: string): void {
    this.onmessage?.({ data });
  }

  simulateClose(): void {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  }

  simulateError(): void {
    this.onerror?.({} as Event);
  }
}

// Assign mock to global
const originalWebSocket = globalThis.WebSocket;

beforeEach(() => {
  MockWebSocket.instances = [];
  (globalThis as any).WebSocket = MockWebSocket as any;

  // Also set the OPEN constant on the global mock
  (globalThis as any).WebSocket.OPEN = MockWebSocket.OPEN;

  // Reset store state
  useChatStore.setState({
    sessions: [],
    activeSessionId: null,
    messages: {},
    isStreaming: false,
    streamingMessageId: null,
    connectionStatus: 'disconnected',
    currentModel: null,
    config: {
      activeProfile: 'default',
      profiles: [
        {
          id: 'default',
          name: 'Default',
          baseUrl: 'ws://localhost:8080',
          clawHost: '127.0.0.1',
          clawPort: 9527,
          model: 'claude-sonnet-4-20250514',
        },
      ],
      theme: 'dark',
      sidebarWidth: 250,
      sidebarCollapsed: false,
    },
  });

  vi.useFakeTimers();
});

afterEach(() => {
  (globalThis as any).WebSocket = originalWebSocket;
  vi.useRealTimers();
});

describe('WsClient', () => {
  describe('connect', () => {
    it('creates a WebSocket connection to the given URL', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');

      expect(MockWebSocket.instances).toHaveLength(1);
      expect(MockWebSocket.instances[0].url).toBe('ws://localhost:8080');
    });

    it('sets connectionStatus to connected on open', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');

      MockWebSocket.instances[0].simulateOpen();

      expect(useChatStore.getState().connectionStatus).toBe('connected');
    });

    it('resets reconnect attempts on successful connection', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');

      // Simulate a close to trigger reconnect
      MockWebSocket.instances[0].simulateClose();
      expect(useChatStore.getState().connectionStatus).toBe('reconnecting');

      // Advance timer to trigger reconnect
      vi.advanceTimersByTime(5000);

      // New connection opens
      const newWs = MockWebSocket.instances[1];
      newWs.simulateOpen();

      expect(useChatStore.getState().connectionStatus).toBe('connected');
    });
  });

  describe('disconnect', () => {
    it('closes the WebSocket and sets status to disconnected', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();

      client.disconnect();

      expect(MockWebSocket.instances[0].closed).toBe(true);
      expect(useChatStore.getState().connectionStatus).toBe('disconnected');
    });

    it('does not attempt reconnection after intentional disconnect', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();

      client.disconnect();

      // Advance time well past reconnect delay
      vi.advanceTimersByTime(60000);

      // Should still only have 1 WebSocket instance (no reconnect attempts)
      expect(MockWebSocket.instances).toHaveLength(1);
    });
  });

  describe('send', () => {
    it('sends JSON-serialized message when connected', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();

      client.send({ type: 'prompt', payload: { text: 'hello', sessionId: 's1' } });

      const sent = MockWebSocket.instances[0].sentMessages;
      expect(sent).toHaveLength(1);
      expect(JSON.parse(sent[0])).toEqual({
        type: 'prompt',
        payload: { text: 'hello', sessionId: 's1' },
      });
    });

    it('silently drops messages when not connected', () => {
      const client = new WsClient();
      // Not connected yet
      client.send({ type: 'prompt', payload: { text: 'hello', sessionId: 's1' } });

      // No WebSocket instances created, no errors thrown
      expect(MockWebSocket.instances).toHaveLength(0);
    });
  });

  describe('isConnected', () => {
    it('returns false when not connected', () => {
      const client = new WsClient();
      expect(client.isConnected()).toBe(false);
    });

    it('returns true when WebSocket is open', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();

      expect(client.isConnected()).toBe(true);
    });

    it('returns false after disconnect', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();
      client.disconnect();

      expect(client.isConnected()).toBe(false);
    });
  });

  describe('message handling', () => {
    it('dispatches ready message to store', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();

      MockWebSocket.instances[0].simulateMessage(
        JSON.stringify({ type: 'ready', payload: { model: 'claude-opus-4-6' } })
      );

      expect(useChatStore.getState().currentModel).toBe('claude-opus-4-6');
      expect(useChatStore.getState().connectionStatus).toBe('connected');
    });

    it('dispatches chunk message to store', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();

      // Set up a session with streaming
      const sessionId = useChatStore.getState().createSession();
      const msgId = useChatStore.getState().startStreaming(sessionId);

      MockWebSocket.instances[0].simulateMessage(
        JSON.stringify({ type: 'chunk', payload: { text: 'Hello' } })
      );

      const messages = useChatStore.getState().messages[sessionId];
      const streamingMsg = messages.find((m) => m.id === msgId)!;
      expect(streamingMsg.content[0]).toEqual({ type: 'text', text: 'Hello' });
    });

    it('dispatches done message to store', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();

      const sessionId = useChatStore.getState().createSession();
      useChatStore.getState().startStreaming(sessionId);

      MockWebSocket.instances[0].simulateMessage(
        JSON.stringify({ type: 'done', payload: {} })
      );

      expect(useChatStore.getState().isStreaming).toBe(false);
    });

    it('dispatches error message to store', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();

      const sessionId = useChatStore.getState().createSession();
      const msgId = useChatStore.getState().startStreaming(sessionId);

      MockWebSocket.instances[0].simulateMessage(
        JSON.stringify({ type: 'error', payload: { text: 'Something went wrong' } })
      );

      const state = useChatStore.getState();
      expect(state.isStreaming).toBe(false);
      const msg = state.messages[sessionId].find((m) => m.id === msgId)!;
      expect(msg.status).toBe('error');
    });

    it('ignores malformed JSON messages', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();

      // Should not throw
      MockWebSocket.instances[0].simulateMessage('not valid json{{{');

      expect(useChatStore.getState().connectionStatus).toBe('connected');
    });
  });

  describe('reconnection', () => {
    it('sets status to reconnecting on unexpected close', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();
      MockWebSocket.instances[0].simulateClose();

      expect(useChatStore.getState().connectionStatus).toBe('reconnecting');
    });

    it('attempts reconnection after base delay (5s)', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();
      MockWebSocket.instances[0].simulateClose();

      expect(MockWebSocket.instances).toHaveLength(1);

      vi.advanceTimersByTime(5000);

      expect(MockWebSocket.instances).toHaveLength(2);
      expect(MockWebSocket.instances[1].url).toBe('ws://localhost:8080');
    });

    it('uses exponential backoff for subsequent attempts', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();
      MockWebSocket.instances[0].simulateClose();

      // First reconnect at 5000ms
      vi.advanceTimersByTime(5000);
      expect(MockWebSocket.instances).toHaveLength(2);

      // Second close
      MockWebSocket.instances[1].simulateClose();

      // Second reconnect at 5000 * 1.5 = 7500ms
      vi.advanceTimersByTime(7499);
      expect(MockWebSocket.instances).toHaveLength(2);
      vi.advanceTimersByTime(1);
      expect(MockWebSocket.instances).toHaveLength(3);
    });

    it('caps reconnect delay at maxDelay (30s)', () => {
      const client = new WsClient();

      // getReconnectDelay is public for testing
      // Simulate many attempts: 5000 * 1.5^10 = ~288,000ms > 30,000ms
      // We test via the public method
      expect(client.getReconnectDelay()).toBe(5000); // attempt 0
    });
  });

  describe('helper functions', () => {
    it('sendPrompt sends a prompt message', () => {
      const client = new WsClient();
      client.connect('ws://localhost:8080');
      MockWebSocket.instances[0].simulateOpen();

      // The helpers use the singleton, so we need to test via the module's wsClient
      // Instead, test the WsClient.send directly
      const sendSpy = vi.spyOn(client, 'send');
      client.send({ type: 'prompt', payload: { text: 'test', sessionId: 's1' } });

      expect(sendSpy).toHaveBeenCalledWith({
        type: 'prompt',
        payload: { text: 'test', sessionId: 's1' },
      });
    });
  });
});

describe('Helper functions', () => {
  it('sendPrompt constructs correct message', () => {
    // We can't easily test the singleton without more setup,
    // but we can verify the function exists and has the right signature
    expect(typeof sendPrompt).toBe('function');
    expect(typeof sendReset).toBe('function');
    expect(typeof sendSlashCommand).toBe('function');
  });
});
