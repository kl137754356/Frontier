import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from './chat-store';
import type { Message } from '@shared/types';

// Reset store state before each test
beforeEach(() => {
  useChatStore.setState({
    sessions: [],
    activeSessionId: null,
    messages: {},
    isStreaming: false,
    streamingMessageId: null,
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
    connectionStatus: 'disconnected',
    currentModel: null,
  });
});

describe('Session Management', () => {
  it('createSession creates a new session and sets it active', () => {
    const { createSession } = useChatStore.getState();
    const id = createSession();

    const state = useChatStore.getState();
    expect(state.sessions).toHaveLength(1);
    expect(state.sessions[0].id).toBe(id);
    expect(state.activeSessionId).toBe(id);
    expect(state.messages[id]).toEqual([]);
    expect(state.sessions[0].unread).toBe(false);
    expect(state.sessions[0].messageCount).toBe(0);
  });

  it('createSession generates unique IDs', () => {
    const { createSession } = useChatStore.getState();
    const id1 = createSession();
    const id2 = useChatStore.getState().createSession();

    expect(id1).not.toBe(id2);
    expect(useChatStore.getState().sessions).toHaveLength(2);
  });

  it('switchSession changes active session and clears unread', () => {
    const { createSession } = useChatStore.getState();
    const id1 = createSession();
    useChatStore.getState().createSession();

    // Mark session 1 as unread manually
    useChatStore.setState((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id1 ? { ...s, unread: true } : s
      ),
    }));

    useChatStore.getState().switchSession(id1);

    const state = useChatStore.getState();
    expect(state.activeSessionId).toBe(id1);
    expect(state.sessions.find((s) => s.id === id1)!.unread).toBe(false);
  });

  it('deleteSession removes session and its messages', () => {
    const { createSession } = useChatStore.getState();
    const id1 = createSession();
    const id2 = useChatStore.getState().createSession();

    useChatStore.getState().deleteSession(id2);

    const state = useChatStore.getState();
    expect(state.sessions).toHaveLength(1);
    expect(state.sessions[0].id).toBe(id1);
    expect(state.messages[id2]).toBeUndefined();
  });

  it('deleteSession switches to most recent remaining session', () => {
    const { createSession } = useChatStore.getState();
    const id1 = createSession();
    // Make id1 older
    useChatStore.setState((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id1 ? { ...s, updatedAt: 1000 } : s
      ),
    }));
    const id2 = useChatStore.getState().createSession();
    // Make id2 newer
    useChatStore.setState((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id2 ? { ...s, updatedAt: 2000 } : s
      ),
    }));
    const id3 = useChatStore.getState().createSession();
    // id3 is active, make it oldest
    useChatStore.setState((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id3 ? { ...s, updatedAt: 500 } : s
      ),
    }));

    // Delete active session (id3)
    useChatStore.getState().deleteSession(id3);

    const state = useChatStore.getState();
    // Should switch to id2 (most recent updatedAt)
    expect(state.activeSessionId).toBe(id2);
  });

  it('deleteSession sets activeSessionId to null when no sessions remain', () => {
    const { createSession } = useChatStore.getState();
    const id = createSession();
    useChatStore.getState().deleteSession(id);

    expect(useChatStore.getState().activeSessionId).toBeNull();
    expect(useChatStore.getState().sessions).toHaveLength(0);
  });

  it('renameSession updates the session name', () => {
    const { createSession } = useChatStore.getState();
    const id = createSession();
    useChatStore.getState().renameSession(id, 'My Custom Name');

    const session = useChatStore.getState().sessions.find((s) => s.id === id)!;
    expect(session.name).toBe('My Custom Name');
  });
});

describe('Messages', () => {
  it('addMessage appends message and updates session metadata', () => {
    const { createSession } = useChatStore.getState();
    const sessionId = createSession();

    const msg: Message = {
      id: 'msg-1',
      sessionId,
      role: 'user',
      content: [{ type: 'text', text: 'Hello world' }],
      timestamp: Date.now(),
      status: 'complete',
    };

    useChatStore.getState().addMessage(sessionId, msg);

    const state = useChatStore.getState();
    expect(state.messages[sessionId]).toHaveLength(1);
    expect(state.messages[sessionId][0].id).toBe('msg-1');

    const session = state.sessions.find((s) => s.id === sessionId)!;
    expect(session.messageCount).toBe(1);
    expect(session.lastMessagePreview).toBe('Hello world');
  });

  it('addMessage marks inactive session as unread', () => {
    const { createSession } = useChatStore.getState();
    const id1 = createSession();
    useChatStore.getState().createSession();
    // second session is now active

    const msg: Message = {
      id: 'msg-1',
      sessionId: id1,
      role: 'assistant',
      content: [{ type: 'text', text: 'Response' }],
      timestamp: Date.now(),
      status: 'complete',
    };

    useChatStore.getState().addMessage(id1, msg);

    const session = useChatStore.getState().sessions.find((s) => s.id === id1)!;
    expect(session.unread).toBe(true);
  });

  it('addMessage does not mark active session as unread', () => {
    const { createSession } = useChatStore.getState();
    const sessionId = createSession();

    const msg: Message = {
      id: 'msg-1',
      sessionId,
      role: 'user',
      content: [{ type: 'text', text: 'Hello' }],
      timestamp: Date.now(),
      status: 'complete',
    };

    useChatStore.getState().addMessage(sessionId, msg);

    const session = useChatStore.getState().sessions.find((s) => s.id === sessionId)!;
    expect(session.unread).toBe(false);
  });

  it('appendChunk appends text to the last text content block', () => {
    const { createSession } = useChatStore.getState();
    const sessionId = createSession();

    const msg: Message = {
      id: 'msg-1',
      sessionId,
      role: 'assistant',
      content: [{ type: 'text', text: 'Hello' }],
      timestamp: Date.now(),
      status: 'streaming',
    };

    useChatStore.getState().addMessage(sessionId, msg);
    useChatStore.getState().appendChunk(sessionId, 'msg-1', ' world');

    const messages = useChatStore.getState().messages[sessionId];
    const content = messages[0].content[0];
    expect(content.type).toBe('text');
    expect((content as { type: 'text'; text: string }).text).toBe('Hello world');
  });

  it('clearMessages empties the session messages', () => {
    const { createSession } = useChatStore.getState();
    const sessionId = createSession();

    const msg: Message = {
      id: 'msg-1',
      sessionId,
      role: 'user',
      content: [{ type: 'text', text: 'Hello' }],
      timestamp: Date.now(),
      status: 'complete',
    };

    useChatStore.getState().addMessage(sessionId, msg);
    useChatStore.getState().clearMessages(sessionId);

    const state = useChatStore.getState();
    expect(state.messages[sessionId]).toEqual([]);
    const session = state.sessions.find((s) => s.id === sessionId)!;
    expect(session.messageCount).toBe(0);
    expect(session.lastMessagePreview).toBe('');
  });
});

describe('Streaming State', () => {
  it('startStreaming creates assistant message and sets streaming state', () => {
    const { createSession } = useChatStore.getState();
    const sessionId = createSession();

    const msgId = useChatStore.getState().startStreaming(sessionId);

    const state = useChatStore.getState();
    expect(state.isStreaming).toBe(true);
    expect(state.streamingMessageId).toBe(msgId);

    const messages = state.messages[sessionId];
    expect(messages).toHaveLength(1);
    expect(messages[0].id).toBe(msgId);
    expect(messages[0].role).toBe('assistant');
    expect(messages[0].status).toBe('streaming');
    expect(messages[0].content).toEqual([{ type: 'text', text: '' }]);
  });

  it('finishStreaming sets message to complete and clears streaming state', () => {
    const { createSession } = useChatStore.getState();
    const sessionId = createSession();

    const msgId = useChatStore.getState().startStreaming(sessionId);
    useChatStore.getState().appendChunk(sessionId, msgId, 'Done text');
    useChatStore.getState().finishStreaming(sessionId);

    const state = useChatStore.getState();
    expect(state.isStreaming).toBe(false);
    expect(state.streamingMessageId).toBeNull();

    const msg = state.messages[sessionId].find((m) => m.id === msgId)!;
    expect(msg.status).toBe('complete');
  });

  it('errorStreaming sets message to error and appends error text', () => {
    const { createSession } = useChatStore.getState();
    const sessionId = createSession();

    const msgId = useChatStore.getState().startStreaming(sessionId);
    useChatStore.getState().appendChunk(sessionId, msgId, 'Partial');
    useChatStore.getState().errorStreaming(sessionId, 'Connection lost');

    const state = useChatStore.getState();
    expect(state.isStreaming).toBe(false);
    expect(state.streamingMessageId).toBeNull();

    const msg = state.messages[sessionId].find((m) => m.id === msgId)!;
    expect(msg.status).toBe('error');
    // Should have original text block + error text block
    expect(msg.content).toHaveLength(2);
    expect(msg.content[1]).toEqual({ type: 'text', text: 'Connection lost' });
  });

  it('state machine: prompt → streaming → done', () => {
    const { createSession } = useChatStore.getState();
    const sessionId = createSession();

    // Initial state
    expect(useChatStore.getState().isStreaming).toBe(false);

    // Start streaming (prompt submitted)
    const msgId = useChatStore.getState().startStreaming(sessionId);
    expect(useChatStore.getState().isStreaming).toBe(true);

    // Receive chunks
    useChatStore.getState().appendChunk(sessionId, msgId, 'chunk1');
    useChatStore.getState().appendChunk(sessionId, msgId, 'chunk2');
    expect(useChatStore.getState().isStreaming).toBe(true);

    // Done
    useChatStore.getState().finishStreaming(sessionId);
    expect(useChatStore.getState().isStreaming).toBe(false);
  });

  it('state machine: prompt → streaming → error', () => {
    const { createSession } = useChatStore.getState();
    const sessionId = createSession();

    useChatStore.getState().startStreaming(sessionId);
    expect(useChatStore.getState().isStreaming).toBe(true);

    useChatStore.getState().errorStreaming(sessionId, 'Timeout');
    expect(useChatStore.getState().isStreaming).toBe(false);
  });
});

describe('Configuration', () => {
  it('updateConfig merges partial config', () => {
    useChatStore.getState().updateConfig({ theme: 'light', sidebarWidth: 300 });

    const config = useChatStore.getState().config;
    expect(config.theme).toBe('light');
    expect(config.sidebarWidth).toBe(300);
    // Other fields unchanged
    expect(config.activeProfile).toBe('default');
  });

  it('addProfile adds a new profile', () => {
    useChatStore.getState().addProfile({
      id: 'prod',
      name: 'Production',
      baseUrl: 'wss://prod.example.com',
      clawHost: '10.0.0.1',
      clawPort: 9527,
      model: 'claude-opus-4-6',
    });

    const profiles = useChatStore.getState().config.profiles;
    expect(profiles).toHaveLength(2);
    expect(profiles[1].id).toBe('prod');
  });

  it('removeProfile removes a profile', () => {
    useChatStore.getState().addProfile({
      id: 'prod',
      name: 'Production',
      baseUrl: 'wss://prod.example.com',
      clawHost: '10.0.0.1',
      clawPort: 9527,
      model: 'claude-opus-4-6',
    });

    useChatStore.getState().removeProfile('prod');

    const profiles = useChatStore.getState().config.profiles;
    expect(profiles).toHaveLength(1);
    expect(profiles[0].id).toBe('default');
  });

  it('removeProfile switches active profile if removed', () => {
    useChatStore.getState().addProfile({
      id: 'prod',
      name: 'Production',
      baseUrl: 'wss://prod.example.com',
      clawHost: '10.0.0.1',
      clawPort: 9527,
      model: 'claude-opus-4-6',
    });

    useChatStore.getState().switchProfile('prod');
    expect(useChatStore.getState().config.activeProfile).toBe('prod');

    useChatStore.getState().removeProfile('prod');
    expect(useChatStore.getState().config.activeProfile).toBe('default');
  });

  it('switchProfile updates active profile', () => {
    useChatStore.getState().addProfile({
      id: 'staging',
      name: 'Staging',
      baseUrl: 'ws://staging:8080',
      clawHost: '192.168.1.1',
      clawPort: 9527,
      model: 'deepseek-v4-flash',
    });

    useChatStore.getState().switchProfile('staging');
    expect(useChatStore.getState().config.activeProfile).toBe('staging');
  });
});

describe('Connection', () => {
  it('setConnectionStatus updates status', () => {
    useChatStore.getState().setConnectionStatus('connected');
    expect(useChatStore.getState().connectionStatus).toBe('connected');

    useChatStore.getState().setConnectionStatus('reconnecting');
    expect(useChatStore.getState().connectionStatus).toBe('reconnecting');
  });

  it('setCurrentModel updates model', () => {
    useChatStore.getState().setCurrentModel('claude-opus-4-6');
    expect(useChatStore.getState().currentModel).toBe('claude-opus-4-6');

    useChatStore.getState().setCurrentModel(null);
    expect(useChatStore.getState().currentModel).toBeNull();
  });
});
