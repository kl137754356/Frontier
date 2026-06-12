import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Session,
  Message,
  MessageContent,
  AppConfig,
  ConfigProfile,
} from '@shared/types';

export interface ChatState {
  // Session management
  sessions: Session[];
  activeSessionId: string | null;
  createSession(): string;
  switchSession(id: string): void;
  deleteSession(id: string): void;
  renameSession(id: string, name: string): void;

  // Messages
  messages: Record<string, Message[]>;
  addMessage(sessionId: string, msg: Message): void;
  appendChunk(sessionId: string, msgId: string, text: string): void;
  clearMessages(sessionId: string): void;

  // Streaming state
  isStreaming: boolean;
  streamingMessageId: string | null;
  startStreaming(sessionId: string): string;
  finishStreaming(sessionId: string): void;
  errorStreaming(sessionId: string, errorText: string): void;

  // Token usage
  updateSessionTokenUsage(sessionId: string, usage: { inputTokens: number; outputTokens: number }): void;

  // Configuration
  config: AppConfig;
  updateConfig(partial: Partial<AppConfig>): void;
  addProfile(profile: ConfigProfile): void;
  removeProfile(id: string): void;
  switchProfile(id: string): void;

  // Connection
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  setConnectionStatus(status: 'connected' | 'disconnected' | 'reconnecting'): void;
  currentModel: string | null;
  setCurrentModel(model: string | null): void;

  // Notifications
  notifications: string[];
  addNotification(msg: string): void;

  // Debug logging
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
      // --- Session management ---
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
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, unread: false } : s
          ),
        }));
      },

      deleteSession(id: string): void {
        set((state) => {
          const remaining = state.sessions.filter((s) => s.id !== id);
          const newMessages = { ...state.messages };
          delete newMessages[id];

          let newActiveId = state.activeSessionId;
          if (state.activeSessionId === id) {
            // Switch to most recent remaining session by updatedAt
            if (remaining.length > 0) {
              const sorted = [...remaining].sort(
                (a, b) => b.updatedAt - a.updatedAt
              );
              newActiveId = sorted[0].id;
            } else {
              newActiveId = null;
            }
          }

          return {
            sessions: remaining,
            messages: newMessages,
            activeSessionId: newActiveId,
          };
        });
      },

      renameSession(id: string, name: string): void {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, name, updatedAt: Date.now() } : s
          ),
        }));
      },

      // --- Messages ---
      messages: {},

      addMessage(sessionId: string, msg: Message): void {
        set((state) => {
          const sessionMessages = state.messages[sessionId] ?? [];
          const preview =
            msg.content.length > 0 && msg.content[0].type === 'text'
              ? msg.content[0].text.slice(0, 50)
              : '';

          const isInactive = state.activeSessionId !== sessionId;

          return {
            messages: {
              ...state.messages,
              [sessionId]: [...sessionMessages, msg],
            },
            sessions: state.sessions.map((s) =>
              s.id === sessionId
                ? {
                    ...s,
                    updatedAt: Date.now(),
                    lastMessagePreview: preview,
                    messageCount: s.messageCount + 1,
                    unread: isInactive ? true : s.unread,
                  }
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

            // Find the last text content block and append to it
            const content = [...msg.content];
            let lastTextIdx = -1;
            for (let i = content.length - 1; i >= 0; i--) {
              if (content[i].type === 'text') {
                lastTextIdx = i;
                break;
              }
            }

            if (lastTextIdx >= 0) {
              const block = content[lastTextIdx] as { type: 'text'; text: string };
              content[lastTextIdx] = { type: 'text', text: block.text + text };
            }

            return { ...msg, content };
          });

          return {
            messages: { ...state.messages, [sessionId]: updatedMessages },
          };
        });
      },

      clearMessages(sessionId: string): void {
        set((state) => ({
          messages: { ...state.messages, [sessionId]: [] },
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, messageCount: 0, lastMessagePreview: '', updatedAt: Date.now() }
              : s
          ),
        }));
      },

      // --- Streaming state ---
      isStreaming: false,
      streamingMessageId: null,

      startStreaming(sessionId: string): string {
        const msgId = crypto.randomUUID();
        const now = Date.now();
        const streamingMessage: Message = {
          id: msgId,
          sessionId,
          role: 'assistant',
          content: [{ type: 'text', text: '' }],
          timestamp: now,
          status: 'streaming',
        };

        // Add the streaming message to the session
        const state = get();
        const sessionMessages = state.messages[sessionId] ?? [];
        const preview = '';
        const isInactive = state.activeSessionId !== sessionId;

        set({
          isStreaming: true,
          streamingMessageId: msgId,
          messages: {
            ...state.messages,
            [sessionId]: [...sessionMessages, streamingMessage],
          },
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  updatedAt: now,
                  lastMessagePreview: preview,
                  messageCount: s.messageCount + 1,
                  unread: isInactive ? true : s.unread,
                }
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
            msg.id === state.streamingMessageId
              ? { ...msg, status: 'complete' as const }
              : msg
          );

          // Update lastMessagePreview from the completed message
          const completedMsg = updatedMessages.find(
            (m) => m.id === state.streamingMessageId
          );
          const preview =
            completedMsg &&
            completedMsg.content.length > 0 &&
            completedMsg.content[0].type === 'text'
              ? completedMsg.content[0].text.slice(0, 50)
              : '';

          return {
            isStreaming: false,
            streamingMessageId: null,
            messages: { ...state.messages, [sessionId]: updatedMessages },
            sessions: state.sessions.map((s) =>
              s.id === sessionId ? { ...s, lastMessagePreview: preview } : s
            ),
          };
        });
      },

      errorStreaming(sessionId: string, errorText: string): void {
        set((state) => {
          const sessionMessages = state.messages[sessionId];
          if (!sessionMessages) return { isStreaming: false, streamingMessageId: null };

          const updatedMessages = sessionMessages.map((msg) => {
            if (msg.id !== state.streamingMessageId) return msg;

            // Append error text to the message content
            const content: MessageContent[] = [
              ...msg.content,
              { type: 'text', text: errorText },
            ];

            return { ...msg, content, status: 'error' as const };
          });

          return {
            isStreaming: false,
            streamingMessageId: null,
            messages: { ...state.messages, [sessionId]: updatedMessages },
          };
        });
      },

      // --- Token usage ---
      updateSessionTokenUsage(sessionId: string, usage: { inputTokens: number; outputTokens: number }): void {
        // Estimate cost: rough pricing for Claude models
        const inputCostPer1k = 0.003;
        const outputCostPer1k = 0.015;
        const additionalCost =
          (usage.inputTokens / 1000) * inputCostPer1k +
          (usage.outputTokens / 1000) * outputCostPer1k;

        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  tokenUsage: {
                    inputTokens: s.tokenUsage.inputTokens + usage.inputTokens,
                    outputTokens: s.tokenUsage.outputTokens + usage.outputTokens,
                    estimatedCost: s.tokenUsage.estimatedCost + additionalCost,
                  },
                }
              : s
          ),
        }));
      },

      // --- Notifications ---
      notifications: [],

      addNotification(msg: string): void {
        set((state) => ({
          notifications: [...state.notifications, msg],
        }));
      },

      // --- Debug logging ---
      debugMode: false,
      debugLogs: [],

      setDebugMode(enabled: boolean): void {
        set({ debugMode: enabled });
      },

      addDebugLog(type: string, content: string): void {
        const { debugMode } = get();
        if (!debugMode) return;
        set((state) => ({
          debugLogs: [...state.debugLogs.slice(-200), { timestamp: Date.now(), type, content }],
        }));
      },

      clearDebugLogs(): void {
        set({ debugLogs: [] });
      },

      // --- Configuration ---
      config: DEFAULT_CONFIG,

      updateConfig(partial: Partial<AppConfig>): void {
        set((state) => ({
          config: { ...state.config, ...partial },
        }));
      },

      addProfile(profile: ConfigProfile): void {
        set((state) => ({
          config: {
            ...state.config,
            profiles: [...state.config.profiles, profile],
          },
        }));
      },

      removeProfile(id: string): void {
        set((state) => {
          const remaining = state.config.profiles.filter((p) => p.id !== id);
          // If removing the active profile, switch to the first remaining
          const activeProfile =
            state.config.activeProfile === id && remaining.length > 0
              ? remaining[0].id
              : state.config.activeProfile;

          return {
            config: {
              ...state.config,
              profiles: remaining,
              activeProfile,
            },
          };
        });
      },

      switchProfile(id: string): void {
        set((state) => ({
          config: { ...state.config, activeProfile: id },
        }));
      },

      // --- Connection ---
      connectionStatus: 'disconnected',

      setConnectionStatus(
        status: 'connected' | 'disconnected' | 'reconnecting'
      ): void {
        set({ connectionStatus: status });
      },

      currentModel: null,

      setCurrentModel(model: string | null): void {
        set({ currentModel: model });
      },
    }),
    {
      name: 'claw-web-chat:store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (e) {
            // Quota exceeded — clear old data and retry
            console.warn('[Store] LocalStorage quota exceeded, clearing old data');
            localStorage.removeItem(name);
            try {
              localStorage.setItem(name, JSON.stringify(value));
            } catch {
              // Still failing — just skip persist
            }
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        messages: state.messages, // ← NEW: 持久化所有消息
        config: state.config,
      } as any),
    }
  )
);
