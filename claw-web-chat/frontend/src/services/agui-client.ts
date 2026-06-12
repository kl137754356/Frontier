/**
 * AG-UI SSE Client for claw-web-chat frontend.
 *
 * Replaces the WebSocket client with an AG-UI compatible HTTP+SSE client.
 * Maps AG-UI events to the same Zustand store actions as the old ws-client,
 * keeping the rest of the frontend unchanged.
 *
 * AG-UI Events handled:
 *   RUN_STARTED, TEXT_MESSAGE_START, TEXT_MESSAGE_CONTENT, TEXT_MESSAGE_END,
 *   TOOL_CALL_START, TOOL_CALL_ARGS, TOOL_CALL_END, RUN_FINISHED, RUN_ERROR,
 *   STEP_STARTED, STEP_FINISHED, CUSTOM
 */

import { useChatStore } from '../store/chat-store';
import { showToast } from '../components/Notifications';

const STREAM_TIMEOUT_MS = 120_000; // 2 minutes — no response timeout

// --- Cross-tab sync via BroadcastChannel ---
const tabChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('frontier-sync') : null;
if (tabChannel) {
  tabChannel.onmessage = (event) => {
    const { type, data } = event.data;
    if (type === 'connection_update') {
      const store = useChatStore.getState();
      store.setConnectionStatus(data.status);
      if (data.model) store.setCurrentModel(data.model);
      // Sync config profile if provided
      if (data.config) {
        store.updateConfig(data.config);
      }
    }
  };
}

function broadcastConnectionUpdate(status: string, model?: string | null, config?: any) {
  if (tabChannel) {
    tabChannel.postMessage({ type: 'connection_update', data: { status, model, config } });
  }
}

/**
 * TypewriterBuffer - smoothly drains text chunks character by character
 * to create a typing animation effect instead of jumping large blocks.
 */
class TypewriterBuffer {
  private buffer = '';
  private animFrameId: number | null = null;
  private sessionId = '';
  private msgId = '';
  private mode: 'text' | 'thinking';
  // Characters to flush per frame (~16ms). Tuned for smooth reading speed.
  private charsPerFrame = 3;

  constructor(mode: 'text' | 'thinking' = 'text') {
    this.mode = mode;
  }

  feed(text: string, sessionId: string, msgId: string): void {
    this.buffer += text;
    this.sessionId = sessionId;
    this.msgId = msgId;
    if (!this.animFrameId) {
      this.drain();
    }
  }

  private drain = (): void => {
    if (this.buffer.length === 0) {
      this.animFrameId = null;
      return;
    }

    // Adaptive speed: if buffer is large, flush faster to keep up
    const speed = this.buffer.length > 100 ? 8 : this.buffer.length > 30 ? 5 : this.charsPerFrame;
    const chars = this.buffer.slice(0, speed);
    this.buffer = this.buffer.slice(speed);

    const store = useChatStore.getState();
    if (store.streamingMessageId === this.msgId) {
      if (this.mode === 'text') {
        store.appendChunk(this.sessionId, this.msgId, chars);
      } else {
        // Append to thinking field
        const msgs = store.messages[this.sessionId] || [];
        const updated = msgs.map(m =>
          m.id === this.msgId
            ? { ...m, thinking: (m.thinking || '') + chars }
            : m
        );
        useChatStore.setState({ messages: { ...store.messages, [this.sessionId]: updated } });
      }
    } else {
      // Message changed or streaming ended — flush remaining immediately
      if (this.buffer.length > 0) {
        this.flushRemaining();
      }
      this.animFrameId = null;
      return;
    }

    this.animFrameId = requestAnimationFrame(this.drain);
  };

  private flushRemaining(): void {
    const store = useChatStore.getState();
    if (this.mode === 'text') {
      store.appendChunk(this.sessionId, this.msgId, this.buffer);
    } else {
      const msgs = store.messages[this.sessionId] || [];
      const updated = msgs.map(m =>
        m.id === this.msgId
          ? { ...m, thinking: (m.thinking || '') + this.buffer }
          : m
      );
      useChatStore.setState({ messages: { ...store.messages, [this.sessionId]: updated } });
    }
    this.buffer = '';
  }

  /** Flush all remaining buffer immediately (e.g., on stream end) */
  flush(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.buffer.length > 0) {
      this.flushRemaining();
    }
  }
}

class AgUiClient {
  private baseUrl = '';
  private abortController: AbortController | null = null;
  private streamTimeout: ReturnType<typeof setTimeout> | null = null;
  private connected = false;
  private typewriter = new TypewriterBuffer();
  private thinkingTypewriter = new TypewriterBuffer('thinking');

  /**
   * Set the backend base URL (e.g., 'http://localhost:8080')
   */
  connect(_url: string): void {
    // Use relative URL so requests go through Vite proxy (same-origin)
    // This avoids CORS issues with SSE streaming
    this.baseUrl = '';
    this.connected = true;
    // Don't set 'connected' here — wait for actual backend confirmation via /config or 'ready' event
    // Status stays as 'disconnected' until backend responds
    console.log('[AgUiClient] Using relative URLs (Vite proxy to backend)');
  }

  disconnect(): void {
    this.connected = false;
    this.abort();
    useChatStore.getState().setConnectionStatus('disconnected');
  }

  /**
   * Send a prompt to the agent via AG-UI POST /agent endpoint.
   * Returns an SSE stream that updates the store in real-time.
   */
  async sendPrompt(text: string, sessionId: string): Promise<void> {
    if (!this.connected) {
      console.warn('[AgUiClient] Not connected');
      return;
    }

    const store = useChatStore.getState();
    // Don't call startStreaming here - InputArea already does it
    // Just get the current streamingMessageId
    const msgId = store.streamingMessageId;
    if (!msgId) {
      console.warn('[AgUiClient] No streaming message ID - was startStreaming called?');
      return;
    }
    this.resetStreamTimeout();

    // Build AG-UI request body
    const body = {
      threadId: sessionId,
      runId: `run-${Date.now()}`,
      messages: [{ id: `msg-${Date.now()}`, role: 'user', content: text }],
      tools: [],
      context: [],
      forwardedProps: {},
    };

    // Debug log the outgoing prompt
    const store2 = useChatStore.getState();
    if (store2.debugMode) {
      store2.addDebugLog('PROMPT_SENT', text);
    }

    this.abortController = new AbortController();

    try {
      const response = await fetch(`${this.baseUrl}/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(body),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: response.statusText }));
        store.errorStreaming(sessionId, err.error || 'Request failed');
        this.clearStreamTimeout();
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        store.errorStreaming(sessionId, 'No response stream');
        this.clearStreamTimeout();
        return;
      }

      await this.processSSEStream(reader, sessionId);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const currentStore = useChatStore.getState();
      if (currentStore.isStreaming) {
        currentStore.errorStreaming(sessionId, err.message || 'Network error');
      }
      // Network error likely means backend is down
      if (err.message?.includes('fetch') || err.message?.includes('network') || err.name === 'TypeError') {
        useChatStore.getState().setConnectionStatus('disconnected');
        broadcastConnectionUpdate('disconnected');
      }
      this.clearStreamTimeout();
    }
  }


  /**
   * Process the SSE stream from the AG-UI /agent endpoint.
   * Maps AG-UI events to Zustand store actions.
   */
  private async processSSEStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    sessionId: string,
  ): Promise<void> {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Any data received means connection is alive — reset timeout
        this.resetStreamTimeout();

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === '[DONE]') continue;
            try {
              const event = JSON.parse(jsonStr);
              this.handleAgUiEvent(event, sessionId);
            } catch {
              console.warn('[AgUiClient] Failed to parse SSE event:', jsonStr);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Handle a single AG-UI event and update the store accordingly.
   */
  private handleAgUiEvent(event: any, sessionId: string): void {
    const store = useChatStore.getState();

    // Debug logging
    if (store.debugMode) {
      const logType = event.type === 'CUSTOM' ? `CUSTOM:${event.name}` : event.type;
      let logContent = '';
      switch (event.type) {
        case 'TEXT_MESSAGE_CONTENT':
          logContent = event.delta;
          break;
        case 'TOOL_CALL_START':
          logContent = `Tool: ${event.toolCallName}`;
          break;
        case 'TOOL_CALL_ARGS':
          logContent = event.delta?.slice(0, 500) || '';
          break;
        case 'TOOL_CALL_END':
          logContent = `Result: ${(event.result || '').slice(0, 500)}`;
          break;
        case 'CUSTOM':
          logContent = JSON.stringify(event.data || {}).slice(0, 500);
          break;
        case 'RUN_ERROR':
          logContent = event.message || '';
          break;
        default:
          logContent = JSON.stringify(event).slice(0, 200);
      }
      store.addDebugLog(logType, logContent);
    }

    switch (event.type) {
      case 'RUN_STARTED':
        // Run has started, streaming is already initiated
        break;

      case 'TEXT_MESSAGE_START':
        // Text message started - we already created the streaming message
        break;

      case 'TEXT_MESSAGE_CONTENT':
        if (store.streamingMessageId) {
          this.typewriter.feed(event.delta, sessionId, store.streamingMessageId);
          this.resetStreamTimeout();
        }
        break;

      case 'TEXT_MESSAGE_END':
        // Text message ended - flush typewriter buffers
        this.typewriter.flush();
        this.thinkingTypewriter.flush();
        break;

      case 'TOOL_CALL_START': {
        if (store.streamingMessageId) {
          const msgs = store.messages[sessionId] || [];
          const sm = msgs.find(m => m.id === store.streamingMessageId);
          if (sm) {
            const uc = [...sm.content, {
              type: 'tool_use' as const,
              id: event.toolCallId,
              name: event.toolCallName,
              input: '',
            }];
            useChatStore.setState({
              messages: { ...store.messages, [sessionId]: msgs.map(m => m.id === store.streamingMessageId ? { ...m, content: uc } : m) },
            });
          }
        }
        break;
      }

      case 'TOOL_CALL_ARGS': {
        // Append args to the tool_use content block
        if (store.streamingMessageId) {
          const msgs = store.messages[sessionId] || [];
          const sm = msgs.find(m => m.id === store.streamingMessageId);
          if (sm) {
            const updatedContent = sm.content.map(c =>
              c.type === 'tool_use' && c.id === event.toolCallId
                ? { ...c, input: (c.input || '') + event.delta }
                : c
            );
            useChatStore.setState({
              messages: { ...store.messages, [sessionId]: msgs.map(m => m.id === store.streamingMessageId ? { ...m, content: updatedContent } : m) },
            });
          }
        }
        break;
      }

      case 'TOOL_CALL_END': {
        if (store.streamingMessageId) {
          const msgs = store.messages[sessionId] || [];
          const sm = msgs.find(m => m.id === store.streamingMessageId);
          if (sm) {
            const uc = [...sm.content, {
              type: 'tool_result' as const,
              toolUseId: event.toolCallId,
              toolName: '',
              output: event.result || '',
              isError: event.isError || false,
            }];
            useChatStore.setState({
              messages: { ...store.messages, [sessionId]: msgs.map(m => m.id === store.streamingMessageId ? { ...m, content: uc } : m) },
            });
          }
        }
        break;
      }

      case 'STEP_STARTED':
        // Thinking step started - no UI action needed yet
        break;

      case 'STEP_FINISHED':
        // Thinking step finished
        break;

      case 'RUN_FINISHED':
        this.typewriter.flush();
        this.thinkingTypewriter.flush();
        if (store.isStreaming) {
          store.finishStreaming(sessionId);
        }
        this.clearStreamTimeout();
        break;

      case 'RUN_ERROR':
        if (store.isStreaming) {
          store.errorStreaming(sessionId, event.message || 'Agent error');
        } else {
          showToast(event.message || 'Agent error', 'error', 6000);
        }
        this.clearStreamTimeout();
        break;

      case 'CUSTOM':
        this.handleCustomEvent(event, sessionId);
        break;
    }
  }

  /**
   * Handle CUSTOM AG-UI events (thinking, usage, ready, auto_compact).
   */
  private handleCustomEvent(event: any, sessionId: string): void {
    const store = useChatStore.getState();

    switch (event.name) {
      case 'thinking': {
        const currentStore = useChatStore.getState();
        if (currentStore.streamingMessageId) {
          this.thinkingTypewriter.feed(event.data.text, sessionId, currentStore.streamingMessageId);
        }
        break;
      }

      case 'usage': {
        store.updateSessionTokenUsage(sessionId, {
          inputTokens: event.data.inputTokens,
          outputTokens: event.data.outputTokens,
        });
        break;
      }

      case 'ready': {
        store.setCurrentModel(event.data.model);
        store.setConnectionStatus('connected');
        break;
      }

      case 'auto_compact': {
        // Silent — background compact doesn't need to notify user
        break;
      }

      case 'a2ui_render': {
        // Append a2ui operations to the current streaming message or the last assistant message
        const msgs = store.messages[sessionId] || [];
        let targetId = store.streamingMessageId;

        if (!targetId) {
          // Find the last assistant message
          for (let i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i].role === 'assistant') {
              targetId = msgs[i].id;
              break;
            }
          }
        }

        if (targetId) {
          // Append a2ui block to existing message
          const updated = msgs.map(m =>
            m.id === targetId
              ? { ...m, content: [...m.content, { type: 'a2ui' as const, operations: event.data.operations }] }
              : m
          );
          useChatStore.setState({ messages: { ...store.messages, [sessionId]: updated } });
        } else {
          // No existing message — create a new assistant message with a2ui content
          const newMsgId = `a2ui-${Date.now()}`;
          const newMsg = {
            id: newMsgId,
            sessionId,
            role: 'assistant' as const,
            content: [{ type: 'a2ui' as const, operations: event.data.operations }],
            timestamp: Date.now(),
            status: 'complete' as const,
          };
          useChatStore.setState({
            messages: { ...store.messages, [sessionId]: [...msgs, newMsg] },
          });
        }
        this.resetStreamTimeout();
        break;
      }
    }
  }

  // --- Timeout management ---
  private clearStreamTimeout(): void {
    if (this.streamTimeout) { clearTimeout(this.streamTimeout); this.streamTimeout = null; }
  }

  private resetStreamTimeout(): void {
    this.clearStreamTimeout();
    const store = useChatStore.getState();
    if (!store.isStreaming) return;
    this.streamTimeout = setTimeout(() => {
      const s = useChatStore.getState();
      if (!s.isStreaming || !s.activeSessionId) return;

      // Check backend health to determine timeout reason
      fetch('/health', { signal: AbortSignal.timeout(3000) })
        .then(res => res.json())
        .then(health => {
          const s2 = useChatStore.getState();
          if (!s2.isStreaming || !s2.activeSessionId) return;
          if (health.tcp && health.clawRunning) {
            s2.errorStreaming(s2.activeSessionId, '⏱ 会话超时：2 分钟内未收到任何回复。\n可能原因：API 响应缓慢或模型推理超时。');
            showToast('会话超时：2分钟无响应，已自动停止', 'warning', 8000);
          } else {
            s2.errorStreaming(s2.activeSessionId, '⏱ 会话超时：后端服务无响应。\n可能原因：后端进程崩溃或连接已断开。');
            s2.setConnectionStatus('disconnected');
            showToast('会话超时：后端服务断开', 'error', 8000);
          }
        })
        .catch(() => {
          const s2 = useChatStore.getState();
          if (s2.isStreaming && s2.activeSessionId) {
            s2.errorStreaming(s2.activeSessionId, '⏱ 会话超时：无法连接后端服务。\n可能原因：网络断开或服务已停止。');
            s2.setConnectionStatus('disconnected');
            showToast('会话超时：无法连接后端', 'error', 8000);
          }
        });
      this.abort();
    }, STREAM_TIMEOUT_MS);
  }

  private abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.clearStreamTimeout();
  }

  /**
   * Cancel the current running request and clean up streaming state.
   * Called when user sends a new message while previous is still streaming.
   * Note: claw-code's run_turn cannot be interrupted mid-execution.
   * The new prompt will be processed after the current turn finishes.
   */
  cancelCurrentRun(sessionId: string): void {
    // Flush any pending typewriter content
    this.typewriter.flush();
    this.thinkingTypewriter.flush();
    // Abort the HTTP request (stops receiving SSE events)
    this.abort();
    // Mark current streaming message as interrupted
    const store = useChatStore.getState();
    if (store.isStreaming) {
      // Append interruption notice to current message
      if (store.streamingMessageId) {
        store.appendChunk(sessionId, store.streamingMessageId, '\n\n*[已中断 — 正在处理新消息...]*');
      }
      store.finishStreaming(sessionId);
    }
  }

  // --- REST endpoints for non-streaming operations ---

  async sendConfig(config: { baseUrl: string; clawHost: string; clawPort: number; model: string; apiKey?: string }): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok) {
        useChatStore.getState().setConnectionStatus('connected');
        if (data.model) useChatStore.getState().setCurrentModel(data.model);
        // Broadcast to other tabs
        broadcastConnectionUpdate('connected', data.model);
        showToast('Connected to Frontier', 'success');
        return true;
      } else {
        showToast(data.error || 'Connection failed', 'error', 6000);
        return false;
      }
    } catch (err: any) {
      showToast(err.message || 'Network error', 'error', 6000);
      return false;
    }
  }

  async sendReset(sessionId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    } catch (err: any) {
      showToast(err.message || 'Reset failed', 'error');
    }
  }

  async sendSlashCommand(command: string, sessionId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/slash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, sessionId }),
      });
    } catch (err: any) {
      showToast(err.message || 'Command failed', 'error');
    }
  }

  async sendA2UIEvent(eventData: { event: { name: string; context: Record<string, any> } }): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/a2ui-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      // Reset stream timeout since user is actively interacting
      this.resetStreamTimeout();
    } catch (err: any) {
      showToast(err.message || 'A2UI event failed', 'error');
    }
  }
}

export const aguiClient = new AgUiClient();

// --- Exported helper functions matching the old ws-client API ---

export function sendPrompt(text: string, sessionId: string): void {
  aguiClient.sendPrompt(text, sessionId);
}

export function sendReset(sessionId: string): void {
  aguiClient.sendReset(sessionId);
}

export function sendSlashCommand(command: string, sessionId: string): void {
  aguiClient.sendSlashCommand(command, sessionId);
}

export function sendConnectConfig(config: { baseUrl: string; clawHost: string; clawPort: number; model: string; apiKey?: string }): void {
  aguiClient.sendConfig(config);
}

export function sendA2UIEvent(eventData: { event: { name: string; context: Record<string, any> } }): void {
  aguiClient.sendA2UIEvent(eventData);
}

/**
 * Request backend restart (for MCP config changes that need process restart).
 * After restart, auto-reconnects with saved credentials and optionally sends a startup message.
 */
export async function requestRestart(startupMessage?: string): Promise<void> {
  const store = useChatStore.getState();
  store.setConnectionStatus('reconnecting');

  // Save startup message to localStorage so it persists across page reload
  if (startupMessage) {
    localStorage.setItem('frontier_startup_message', startupMessage);
  }

  try {
    await fetch('/restart', { method: 'POST' });
  } catch {
    // Expected — server will close connection during restart
  }

  // Wait for backend to come back, then reload page
  const maxWait = 20000;
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const res = await fetch('/health');
      if (res.ok) {
        // Backend is back — reload page (auto-connect useEffect will handle the rest)
        window.location.reload();
        return;
      }
    } catch {
      // Still restarting
    }
  }

  store.setConnectionStatus('disconnected');
  showToast('重启失败，后端未响应', 'error');
}

/**
 * Check and send startup message if one was saved before restart.
 * Call this after successful connection.
 */
export function checkAndSendStartupMessage(sessionId: string): void {
  const msg = localStorage.getItem('frontier_startup_message');
  if (msg) {
    localStorage.removeItem('frontier_startup_message');
    // Small delay to ensure claw-code is ready
    setTimeout(() => {
      const store = useChatStore.getState();
      if (store.connectionStatus === 'connected') {
        const userMsg = {
          id: crypto.randomUUID(),
          sessionId,
          role: 'user' as const,
          content: [{ type: 'text' as const, text: msg }],
          timestamp: Date.now(),
          status: 'complete' as const,
        };
        store.addMessage(sessionId, userMsg);
        store.startStreaming(sessionId);
        aguiClient.sendPrompt(msg, sessionId);
      }
    }, 3000);
  }
}
