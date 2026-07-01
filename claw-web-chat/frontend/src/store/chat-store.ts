import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Session,
  Message,
  MessageContent,
  AppConfig,
  ConfigProfile,
} from '@shared/types';

// --- Backend session persistence helpers ---
function getUsername(): string {
  return localStorage.getItem('frontier_username') || '';
}

async function loadSessionsFromBackend(): Promise<{
  sessions: Session[];
  messages: Record<string, Message[]>;
  activeSessionId: string | null;
} | null> {
  const user = getUsername();
  if (!user) return null;
  try {
    const res = await fetch('/sessions?user=' + encodeURIComponent(user));
    if (!res.ok) return null;
    const data = await res.json();
    if (data && Array.isArray(data.sessions)) return data;
    return null;
  } catch {
    return null;
  }
}

let _saveTimer: ReturnType<typeof setTimeout> | null = null;

function saveSessionsToBackend(data: {
  sessions: Session[];
  messages: Record<string, Message[]>;
  activeSessionId: string | null;
}): void {
  const user = getUsername();
  if (!user) return;
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    fetch('/sessions?user=' + encodeURIComponent(user), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch((err) => console.warn('[Store] Failed to persist sessions to backend:', err));
  }, 2000);
}

export interface ChatState {
  sessions: Session[];
  activeSessionId: string | null;
  createSession(): string;
  switchSession(id: string): void;
  deleteSession(id: string): void;
  renameSession(id: string, name: string): void;
  messages: Record<string, Message[]>;
  addMessage(sessionId: string, msg: Message): void;
  appendChunk(sessionId: string, msgId: string, text: string): void;
  clearMessages(sessionId: string): void;
  isStreaming: boolean;
  streamingMessageId: string | null;
  startStreaming(sessionId: string): string;
  finishStreaming(sessionId: string): void;
  errorStreaming(sessionId: string, errorText: string): void;
  updateSessionTokenUsage(sessionId: string, usage: { inputTokens: number; outputTokens: number }): void;
  config: AppConfig;
  updateConfig(partial: Partial<AppConfig>): void;
  addProfile(profile: ConfigProfile): void;
  removeProfile(id: string): void;
  switchProfile(id: string): void;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  setConnectionStatus(status: 'connected' | 'disconnected' | 'reconnecting'): void;
  currentModel: string | null;
  setCurrentModel(model: string | null): void;
  notifications: string[];
  addNotification(msg: string): void;
  debugMode: boolean;
  setDebugMode(enabled: boolean): void;
  debugLogs: Array<{ timestamp: number; type: string; content: string }>;
  addDebugLog(type: string, content: string): void;
  clearDebugLogs(): void;
}

const DEFAULT_CONFIG: AppConfig = {
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
  sidebarCollapsed: true,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,

      createSession(): string {
        const id = crypto.randomUUID();
        const now = Date.now();
        const newSession: Session = {
          id,
          name: `Session ${get().sessions.length + 1}`,
          createdAt: now,
          updatedAt: now,
          lastMessagePreview: '',
          messageCount: 0,
          unread: false,
          tokenUsage: { inputTokens: 0, outputTokens: 0, estimatedCost: 0 },
        };
        set((state) => ({
          sessions: [...state.sessions, newSession],
          activeSessionId: id,
          messages: { ...state.messages, [id]: [] },
        }));
        return id;
      },

      switchSession(id: string): void {
        set((state) => ({
          activeSessionId: id,
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, unread: false } : s)),
        }));
      },

      deleteSession(id: string): void {
        set((state) => {
          const remaining = state.sessions.filter((s) => s.id !== id);
          const newMessages = { ...state.messages };
          delete newMessages[id];
          let newActiveId = state.activeSessionId;
          if (state.activeSessionId === id) {
            if (remaining.length > 0) {
              const sorted = [...remaining].sort((a, b) => b.updatedAt - a.updatedAt);
              newActiveId = sorted[0].id;
            } else {
              newActiveId = null;
            }
          }
          return { sessions: remaining, messages: newMessages, activeSessionId: newActiveId };
        });
      },

      renameSession(id: string, name: string): void {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, name, updatedAt: Date.now() } : s)),
        }));
      },

      messages: {},

      addMessage(sessionId: string, msg: Message): void {
        set((state) => {
          const sessionMessages = state.messages[sessionId] ?? [];
          const preview = msg.content.length > 0 && msg.content[0].type === 'text' ? msg.content[0].text.slice(0, 50) : '';
          const isInactive = state.activeSessionId !== sessionId;
          return {
            messages: { ...state.messages, [sessionId]: [...sessionMessages, msg] },
            sessions: state.sessions.map((s) =>
              s.id === sessionId
                ? { ...s, updatedAt: Date.now(), lastMessagePreview: preview, messageCount: s.messageCount + 1, unread: isInactive ? true : s.unread }
                : s
            ),
          };
        });
      },

      appendChunk(sessionId: string, msgId: string, text: string): void {
        set((state) => {
          const sessionMessages = state.messages[sessionId];
          if (!sessionMessages) return state;
          const updatedMessages = sessionMessages.map((msg) => {
            if (msg.id !== msgId) return msg;
            const content = [...msg.content];
            let lastTextIdx = -1;
            for (let i = content.length - 1; i >= 0; i--) {
              if (content[i].type === 'text') { lastTextIdx = i; break; }
            }
            if (lastTextIdx >= 0) {
              const block = content[lastTextIdx] as { type: 'text'; text: string };
              content[lastTextIdx] = { type: 'text', text: block.text + text };
            }
            return { ...msg, content };
          });
          return { messages: { ...state.messages, [sessionId]: updatedMessages } };
        });
      },

      clearMessages(sessionId: string): void {
        set((state) => ({
          messages: { ...state.messages, [sessionId]: [] },
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, messageCount: 0, lastMessagePreview: '', updatedAt: Date.now() } : s
          ),
        }));
      },

      isStreaming: false,
      streamingMessageId: null,

      startStreaming(sessionId: string): string {
        const msgId = crypto.randomUUID();
        const now = Date.now();
        const streamingMessage: Message = {
          id: msgId, sessionId, role: 'assistant',
          content: [{ type: 'text', text: '' }], timestamp: now, status: 'streaming',
        };
        const state = get();
        const sessionMessages = state.messages[sessionId] ?? [];
        const isInactive = state.activeSessionId !== sessionId;
        set({
          isStreaming: true, streamingMessageId: msgId,
          messages: { ...state.messages, [sessionId]: [...sessionMessages, streamingMessage] },
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, updatedAt: now, lastMessagePreview: '', messageCount: s.messageCount + 1, unread: isInactive ? true : s.unread }
              : s
          ),
        });
        return msgId;
      },

      finishStreaming(sessionId: string): void {
        set((state) => {
          const sessionMessages = state.messages[sessionId];
          if (!sessionMessages) return { isStreaming: false, streamingMessageId: null };
          const updatedMessages = sessionMessages.map((msg) =>
            msg.id === state.streamingMessageId ? { ...msg, status: 'complete' as const } : msg
          );
          const completedMsg = updatedMessages.find((m) => m.id === state.streamingMessageId);
          const preview = completedMsg && completedMsg.content.length > 0 && completedMsg.content[0].type === 'text'
            ? completedMsg.content[0].text.slice(0, 50) : '';
          return {
            isStreaming: false, streamingMessageId: null,
            messages: { ...state.messages, [sessionId]: updatedMessages },
            sessions: state.sessions.map((s) => (s.id === sessionId ? { ...s, lastMessagePreview: preview } : s)),
          };
        });
      },

      errorStreaming(sessionId: string, errorText: string): void {
        set((state) => {
          const sessionMessages = state.messages[sessionId];
          if (!sessionMessages) return { isStreaming: false, streamingMessageId: null };
          const updatedMessages = sessionMessages.map((msg) => {
            if (msg.id !== state.streamingMessageId) return msg;
            const content: MessageContent[] = [...msg.content, { type: 'text', text: errorText }];
            return { ...msg, content, status: 'error' as const };
          });
          return { isStreaming: false, streamingMessageId: null, messages: { ...state.messages, [sessionId]: updatedMessages } };
        });
      },

      updateSessionTokenUsage(sessionId: string, usage: { inputTokens: number; outputTokens: number }): void {
        const inputCostPer1k = 0.003;
        const outputCostPer1k = 0.015;
        const additionalCost = (usage.inputTokens / 1000) * inputCostPer1k + (usage.outputTokens / 1000) * outputCostPer1k;
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, tokenUsage: { inputTokens: s.tokenUsage.inputTokens + usage.inputTokens, outputTokens: s.tokenUsage.outputTokens + usage.outputTokens, estimatedCost: s.tokenUsage.estimatedCost + additionalCost } }
              : s
          ),
        }));
      },

      notifications: [],
      addNotification(msg: string): void { set((state) => ({ notifications: [...state.notifications, msg] })); },

      debugMode: false,
      debugLogs: [],
      setDebugMode(enabled: boolean): void { set({ debugMode: enabled }); },
      addDebugLog(type: string, content: string): void {
        if (!get().debugMode) return;
        set((state) => ({ debugLogs: [...state.debugLogs.slice(-200), { timestamp: Date.now(), type, content }] }));
      },
      clearDebugLogs(): void { set({ debugLogs: [] }); },

      config: DEFAULT_CONFIG,
      updateConfig(partial: Partial<AppConfig>): void { set((state) => ({ config: { ...state.config, ...partial } })); },
      addProfile(profile: ConfigProfile): void {
        set((state) => ({ config: { ...state.config, profiles: [...state.config.profiles, profile] } }));
      },
      removeProfile(id: string): void {
        set((state) => {
          const remaining = state.config.profiles.filter((p) => p.id !== id);
          const activeProfile = state.config.activeProfile === id && remaining.length > 0 ? remaining[0].id : state.config.activeProfile;
          return { config: { ...state.config, profiles: remaining, activeProfile } };
        });
      },
      switchProfile(id: string): void { set((state) => ({ config: { ...state.config, activeProfile: id } })); },

      connectionStatus: 'disconnected',
      setConnectionStatus(status: 'connected' | 'disconnected' | 'reconnecting'): void { set({ connectionStatus: status }); },
      currentModel: null,
      setCurrentModel(model: string | null): void { set({ currentModel: model }); },
    }),
    {
      name: 'claw-web-chat:store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          try { localStorage.setItem(name, JSON.stringify(value)); }
          catch (e) {
            console.warn('[Store] LocalStorage quota exceeded');
            localStorage.removeItem(name);
            try { localStorage.setItem(name, JSON.stringify(value)); } catch { /* skip */ }
          }
          const s = (value as any)?.state;
          if (s?.sessions) {
            saveSessionsToBackend({ sessions: s.sessions, messages: s.messages || {}, activeSessionId: s.activeSessionId || null });
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        messages: state.messages,
        config: state.config,
      } as any),
    }
  )
);

export async function initSessionsFromBackend(): Promise<void> {
  const data = await loadSessionsFromBackend();
  if (data && data.sessions.length > 0) {
    useChatStore.setState({
      sessions: data.sessions,
      messages: data.messages || {},
      activeSessionId: data.activeSessionId || data.sessions[data.sessions.length - 1].id,
    });
    console.log('[Store] Loaded ' + data.sessions.length + ' sessions from backend for user: ' + getUsername());
  }
}
