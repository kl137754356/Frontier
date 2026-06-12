import { useEffect, useState, useCallback } from 'react';
import { useChatStore } from './store/chat-store';
import { wsClient, sendConnectConfig } from './services/ws-client';
import { checkAndSendStartupMessage } from './services/agui-client';
import { Header } from './components/Header';
import { SessionSidebar } from './components/SessionSidebar';
import { ChatArea } from './components/ChatArea';
import { ConfigPanel } from './components/ConfigPanel';
import { Notifications } from './components/Notifications';

function App() {
  const theme = useChatStore((s) => s.config.theme);
  const sidebarCollapsed = useChatStore((s) => s.config.sidebarCollapsed);
  const updateConfig = useChatStore((s) => s.updateConfig);
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const createSession = useChatStore((s) => s.createSession);
  const config = useChatStore((s) => s.config);

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Apply theme class to document on mount and when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Responsive: auto-collapse sidebar below 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        updateConfig({ sidebarCollapsed: true });
      }
    };

    // Check on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateConfig]);

  // Connect WebSocket to backend (always localhost:8080)
  // Then auto-connect to claw-code if API key is saved
  useEffect(() => {
    wsClient.connect('ws://localhost:8080');

    // Auto-connect when WebSocket becomes ready
    const unsubscribe = useChatStore.subscribe((state, prevState) => {
      // When connection succeeds, check for pending startup message
      if (state.connectionStatus === 'connected' && prevState.connectionStatus !== 'connected') {
        if (state.activeSessionId) {
          checkAndSendStartupMessage(state.activeSessionId);
        }
        return;
      }
    });

    // Fallback: try auto-connect after delay
    const timer = setTimeout(async () => {
      const state = useChatStore.getState();
      if (state.connectionStatus === 'connected') return; // already connected

      // First check if backend is already connected (e.g., another browser/tab configured it)
      try {
        const healthRes = await fetch('/health', { signal: AbortSignal.timeout(3000) });
        if (healthRes.ok) {
          const health = await healthRes.json();
          if (health.tcp && health.clawRunning) {
            // Backend is already connected to claw-code — mark as connected
            useChatStore.getState().setConnectionStatus('connected');
            return;
          }
        }
      } catch {}

      // Not connected yet — try to connect with saved credentials
      const profile = state.config.profiles.find((p) => p.id === state.config.activeProfile);
      if (profile?.apiKey) {
        sendConnectConfig({
          baseUrl: profile.baseUrl || '',
          clawHost: '127.0.0.1',
          clawPort: 9527,
          model: profile.model,
          apiKey: profile.apiKey,
        });
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      unsubscribe();
      wsClient.disconnect();
    };
  }, []);

  // Health monitor: periodically check backend health and auto-reconnect if needed
  useEffect(() => {
    let consecutiveFailures = 0;
    let reconnecting = false;

    const healthCheck = setInterval(async () => {
      if (reconnecting) return;

      try {
        const res = await fetch('/health', { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          consecutiveFailures = 0;
          // If we were disconnected but backend is now up, auto-reconnect
          const state = useChatStore.getState();
          if (state.connectionStatus === 'disconnected') {
            const profile = state.config.profiles.find((p) => p.id === state.config.activeProfile);
            if (profile?.apiKey) {
              reconnecting = true;
              state.setConnectionStatus('reconnecting');
              const { aguiClient } = await import('./services/agui-client');
              const success = await aguiClient.sendConfig({
                baseUrl: profile.baseUrl || '',
                clawHost: '127.0.0.1',
                clawPort: 9527,
                model: profile.model,
                apiKey: profile.apiKey,
              });
              if (!success) {
                state.setConnectionStatus('disconnected');
              }
              reconnecting = false;
            }
          }
        } else {
          consecutiveFailures++;
        }
      } catch {
        consecutiveFailures++;
        if (consecutiveFailures >= 3) {
          useChatStore.getState().setConnectionStatus('disconnected');
        }
      }
    }, 10000); // Check every 10 seconds

    // Poll for heartbeat results every 15 seconds
    const heartbeatPoll = setInterval(async () => {
      try {
        const res = await fetch('/heartbeat-results', { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const state = useChatStore.getState();
            const sessionId = state.activeSessionId;
            if (sessionId) {
              // Add heartbeat results as assistant messages
              for (const result of data.results) {
                state.addMessage(sessionId, {
                  id: `hb-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                  sessionId,
                  role: 'assistant',
                  content: [{ type: 'text', text: `📊 **心跳报告**\n\n${result}` }],
                  timestamp: Date.now(),
                  status: 'complete',
                });
              }
            }
          }
        }
      } catch {}
    }, 15000);

    return () => { clearInterval(healthCheck); clearInterval(heartbeatPoll); };
  }, []);

  // Create initial session if none exists
  useEffect(() => {
    if (sessions.length === 0 || !activeSessionId) {
      createSession();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSidebar = useCallback(() => {
    updateConfig({ sidebarCollapsed: !sidebarCollapsed });
  }, [sidebarCollapsed, updateConfig]);

  return (
    <div className={`h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <Header
        onToggleSidebar={toggleSidebar}
        onOpenSettings={() => setSettingsOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <aside className="w-sidebar shrink-0 overflow-y-auto">
            <SessionSidebar />
          </aside>
        )}

        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatArea />
        </main>
      </div>

      {/* Config panel modal */}
      {settingsOpen && <ConfigPanel onClose={() => setSettingsOpen(false)} />}

      {/* Toast notifications */}
      <Notifications />
    </div>
  );
}

export default App;
