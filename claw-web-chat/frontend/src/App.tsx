import { useEffect, useState, useCallback } from 'react';
import { useChatStore, initSessionsFromBackend } from './store/chat-store';
import { wsClient, sendConnectConfig } from './services/ws-client';
import { checkAndSendStartupMessage } from './services/agui-client';
import { Header } from './components/Header';
import { SessionSidebar } from './components/SessionSidebar';
import { ChatArea } from './components/ChatArea';
import { Notifications } from './components/Notifications';
import { LoginPage } from './components/LoginPage';

// Flag to prevent App.tsx auto-connect from firing after LoginPage already sent config
let loginPageSentConfig = false;

/** Returns true if the saved gateway token is still valid */
function isTokenValid(): boolean {
  const expiresAt = localStorage.getItem('frontier_token_expires_at');
  if (!expiresAt) return false;
  // Also verify the saved profile uses the current gateway URL
  const profile = useChatStore.getState().config.profiles.find((p) => p.id === 'gateway');
  if (profile && profile.baseUrl !== 'https://frontier.hexai.top') {
    // Stale profile with old URL — clear it
    localStorage.removeItem('frontier_token_expires_at');
    return false;
  }
  return Date.now() < parseInt(expiresAt, 10) - 60_000; // 1-min buffer
}

/** Returns the saved gateway access token if it's still valid, otherwise null */
function getSavedToken(): string | null {
  const profile = useChatStore.getState().config.profiles.find((p) => p.id === 'gateway');
  return profile?.apiKey && isTokenValid() ? profile.apiKey : null;
}

function App() {
  const theme = useChatStore((s) => s.config.theme);
  const sidebarCollapsed = useChatStore((s) => s.config.sidebarCollapsed);
  const updateConfig = useChatStore((s) => s.updateConfig);
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const createSession = useChatStore((s) => s.createSession);
  const config = useChatStore((s) => s.config);

  // Login gate: show LoginPage until we have a valid token
  const [isLoggedIn, setIsLoggedIn] = useState(() => getSavedToken() !== null);
  const [tokenChecked, setTokenChecked] = useState(false);

  // On mount: verify saved token is still valid with the gateway
  useEffect(() => {
    if (!isLoggedIn) { setTokenChecked(true); return; }
    const token = getSavedToken();
    if (!token) { setTokenChecked(true); return; }
    // Skip server-side verification if token was just saved (within last 30s)
    // This prevents the race condition where verify-token runs with a stale token right after login
    const expiresAt = localStorage.getItem('frontier_token_expires_at');
    if (expiresAt) {
      const savedAt = Number(expiresAt) - 28800000; // expiresAt = savedAt + 8h
      if (Date.now() - savedAt < 30000) {
        setTokenChecked(true);
        return;
      }
    }
    // Use the backend as a proxy to verify token validity
    fetch('/auth/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(5000),
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid === false) {
          // Token expired on server side — force re-login
          localStorage.removeItem('frontier_token_expires_at');
          localStorage.removeItem('frontier_username');
          setIsLoggedIn(false);
        }
      })
      .catch(() => { /* Network error: proceed optimistically */ })
      .finally(() => setTokenChecked(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = useCallback(() => {
    // Clear gateway token and profile — no need to explicitly reset backend,
    // the next login's sendConfig will handle reconnecting with the new token
    localStorage.removeItem('frontier_token_expires_at');
    localStorage.removeItem('frontier_username');
    const state = useChatStore.getState();
    const remaining = state.config.profiles.filter((p) => p.id !== 'gateway');
    state.updateConfig({
      profiles: remaining.length > 0 ? remaining : state.config.profiles,
      activeProfile: remaining.length > 0 ? remaining[0].id : state.config.activeProfile,
    });
    state.setConnectionStatus('disconnected');
    setIsLoggedIn(false);
  }, []);

  // Apply theme class to document on mount and when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load sessions from backend on mount if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      initSessionsFromBackend();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      // When connection succeeds (reconnect after claw restart), stay on current session
      if (state.connectionStatus === 'connected' && prevState.connectionStatus !== 'connected') {
        // Just stay on the current session — inject will handle context continuity
        if (state.activeSessionId) {
          checkAndSendStartupMessage(state.activeSessionId);
        }
        return;
      }
    });

    // Fallback: try auto-connect after delay — only if user is logged in
    const timer = setTimeout(async () => {
      // Don't auto-connect if showing login page
      if (!isLoggedIn) return;
      // Don't auto-connect if LoginPage already sent config (avoid duplicate requests with different tokens)
      if (loginPageSentConfig) { loginPageSentConfig = false; return; }
      const state = useChatStore.getState();
      if (state.connectionStatus === 'connected') return; // already connected

      // First check if backend is already connected or connecting
      try {
        const healthRes = await fetch('/health', { signal: AbortSignal.timeout(3000) });
        if (healthRes.ok) {
          const health = await healthRes.json();
          if (health.tcp && health.clawRunning && health.clawReady) {
            // Backend is already connected to claw-code — mark as connected
            useChatStore.getState().setConnectionStatus('connected');
            return;
          }
          // If login page is in the middle of connecting, don't interfere
          if (health.connectingInProgress) return;
        }
      } catch {}

      // Not connected yet — prefer gateway profile with valid token, fall back to active profile
      const token = getSavedToken();
      const gatewayProfile = state.config.profiles.find((p) => p.id === 'gateway');
      // Only use gateway profile if it matches the current gateway URL
      const validGateway = token && gatewayProfile && gatewayProfile.baseUrl === 'https://frontier.hexai.top';
      const profile = validGateway
        ? gatewayProfile
        : state.config.profiles.find((p) => p.id === state.config.activeProfile);
      if (profile?.apiKey) {
        // Force correct model format for gateway profile
        const model = profile.id === 'gateway' ? 'anthropic/claude-sonnet-4-20250514' : profile.model;
        sendConnectConfig({
          baseUrl: profile.baseUrl || '',
          clawHost: '127.0.0.1',
          clawPort: 9527,
          model,
          apiKey: profile.apiKey,
        });
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      unsubscribe();
      wsClient.disconnect();
    };
  }, [isLoggedIn]);

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

          // Check if this session has been kicked (another browser logged in with different token)
          const healthData = await res.json();
          if (healthData.activeTokenHash) {
            const kickCheckState = useChatStore.getState();
            const profile = kickCheckState.config.profiles.find((p: any) => p.id === 'gateway');
            if (profile?.apiKey) {
              const myHash = profile.apiKey.slice(0, 8) + profile.apiKey.slice(-4);
              if (myHash !== healthData.activeTokenHash) {
                // Token mismatch — this session has been superseded by a new login
                console.warn('[App] Session kicked: active token changed (another login detected)');
                handleLogout();
                return;
              }
            }
          }

          // If we were disconnected but backend is now up, auto-reconnect
          const state = useChatStore.getState();
          if (state.connectionStatus === 'disconnected') {
            // Only auto-reconnect with the 'gateway' profile (official login)
            // to avoid accidentally switching to a stale/different provider profile
            const profile = state.config.profiles.find((p) => p.id === 'gateway')
              || state.config.profiles.find((p) => p.id === state.config.activeProfile);
            if (profile?.apiKey && profile.baseUrl?.includes('frontier.hexai.top')) {
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
    const seenHeartbeatIds = new Set<string>(); // deduplicate by server-assigned ID
    const heartbeatPoll = setInterval(async () => {
      try {
        const res = await fetch('/heartbeat-results', { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const state = useChatStore.getState();
            const sessionId = state.activeSessionId;
            if (sessionId) {
              for (const result of data.results) {
                const id: string = typeof result === 'string' ? result : (result.id ?? String(Date.now()));
                const text: string = typeof result === 'string' ? result : (result.text ?? JSON.stringify(result));
                if (seenHeartbeatIds.has(id)) continue;

                // Skip reports that indicate a stopped/cancelled heartbeat (not real data)
                const stopWords = ['已停止', '已取消', '停止了', 'stopped', 'cancelled', 'canceled', '任务不存在', '没有心跳'];
                if (stopWords.some(w => text.includes(w))) continue;
                seenHeartbeatIds.add(id);
                if (seenHeartbeatIds.size > 200) {
                  const first = seenHeartbeatIds.values().next().value as string;
                  seenHeartbeatIds.delete(first);
                }
                state.addMessage(sessionId, {
                  id: `hb-${id}`,
                  sessionId,
                  role: 'assistant',
                  content: [{ type: 'text', text: `📊 **心跳报告**\n\n${text}` }],
                  timestamp: Date.now(),
                  status: 'complete',
                });
              }
            }
          }
        }
      } catch {}
    }, 5000); // Poll every 5s so heartbeat results appear promptly

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

  // Show login page if not authenticated
  if (!tokenChecked) {
    return <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900"><span className="text-gray-400">验证登录状态...</span></div>;
  }
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => { loginPageSentConfig = true; initSessionsFromBackend(); setTokenChecked(true); setIsLoggedIn(true); }} />;
  }

  return (
    <div className={`h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <Header
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
        onLogout={handleLogout}
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

      {/* Toast notifications */}
      <Notifications />
    </div>
  );
}

export default App;
