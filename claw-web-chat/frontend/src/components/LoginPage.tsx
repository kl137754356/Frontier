import { useState, useCallback } from 'react';
import { useChatStore } from '../store/chat-store';
import { aguiClient } from '../services/agui-client';

const GATEWAY_URL = 'https://frontier.hexai.top';
const DEFAULT_MODEL = 'anthropic/claude-sonnet-4-20250514';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const updateConfig = useChatStore((s) => s.updateConfig);
  const config = useChatStore((s) => s.config);
  const theme = useChatStore((s) => s.config.theme);
  const dark = theme === 'dark';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`/auth/cli-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'password', username: username.trim(), password }),
      });

      const data = await res.json();

      // Gateway may return HTTP 200 with success:false for login failures
      if (!res.ok || data.success === false || !data.access_token) {
        setStatus('error');
        setErrorMsg(data.detail || data.message || `登录失败 (HTTP ${res.status})`);
        return;
      }

      const accessToken: string = data.access_token;
      const expiresIn: number = data.expires_in ?? 28800;

      const profile = {
        id: 'gateway',
        name: username.trim(),
        baseUrl: GATEWAY_URL,
        clawHost: '127.0.0.1',
        clawPort: 9527,
        model: DEFAULT_MODEL,
        apiKey: accessToken,
      };

      const existing = config.profiles.find((p) => p.id === 'gateway');
      if (existing) {
        updateConfig({
          profiles: config.profiles.map((p) => p.id === 'gateway' ? profile : p),
          activeProfile: 'gateway',
        });
      } else {
        updateConfig({
          profiles: [...config.profiles, profile],
          activeProfile: 'gateway',
        });
      }

      localStorage.setItem('frontier_token_expires_at', String(Date.now() + expiresIn * 1000));
      localStorage.setItem('frontier_username', username.trim());

      // Proceed to main UI immediately — don't wait for claw to initialize
      onLoginSuccess();

      // Start claw connection in background (non-blocking)
      aguiClient.sendConfig({
        baseUrl: GATEWAY_URL,
        clawHost: '127.0.0.1',
        clawPort: 9527,
        model: DEFAULT_MODEL,
        apiKey: accessToken,
      }).catch(() => { /* App's auto-connect will retry */ });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || '网络错误，请检查连接后重试');
    }
  }, [username, password, config.profiles, updateConfig, onLoginSuccess]);

  // ── Theme tokens ──────────────────────────────────────────────
  const bg = dark
    ? 'bg-gray-950'
    : 'bg-gradient-to-br from-slate-50 to-blue-50';

  const gradientOverlay = dark
    ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 opacity-80'
    : 'bg-gradient-to-br from-white/60 to-blue-100/40 opacity-60';

  const card = dark
    ? 'bg-gray-900 border border-gray-800'
    : 'bg-white border border-gray-200 shadow-xl shadow-gray-200/60';

  const labelColor = dark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = dark
    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500'
    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-400';

  const eyeBtn = dark
    ? 'text-gray-500 hover:text-gray-300'
    : 'text-gray-400 hover:text-gray-600';

  const titleColor = dark ? 'text-white' : 'text-gray-900';
  const subtitleColor = dark ? 'text-gray-400' : 'text-gray-500';
  const footerColor = dark ? 'text-gray-600' : 'text-gray-400';

  const errorBg = dark
    ? 'bg-red-950/60 border-red-800/60 text-red-300'
    : 'bg-red-50 border-red-200 text-red-600';
  const errorIcon = dark ? 'text-red-400' : 'text-red-500';

  // ─────────────────────────────────────────────────────────────

  return (
    <div className={`min-h-screen flex items-center justify-center ${bg} px-4`}>
      <div className={`absolute inset-0 ${gradientOverlay} pointer-events-none`} />

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <img src="/Hexagon.jpg" alt="Hex.Frontier" className="w-16 h-16 mx-auto rounded-2xl shadow-lg shadow-blue-600/30 mb-4 object-cover" />
          <h1 className={`text-2xl font-bold tracking-tight ${titleColor}`}>Hex.Frontier</h1>
          <p className={`text-sm mt-1 ${subtitleColor}`}>您的 AI 助手，登录后即可使用</p>
        </div>

        {/* Card */}
        <div className={`rounded-2xl p-8 ${card}`}>
          <form onSubmit={handleLogin} className="space-y-5" noValidate>

            {/* Error */}
            {status === 'error' && (
              <div className={`flex items-start gap-2.5 px-3 py-2.5 border rounded-lg ${errorBg}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 shrink-0 mt-0.5 ${errorIcon}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">{errorMsg}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className={`block text-xs font-medium mb-1.5 ${labelColor}`}>
                用户名
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setStatus('idle'); }}
                placeholder="请输入用户名"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${inputBg}`}
                disabled={status === 'loading'}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={`block text-xs font-medium mb-1.5 ${labelColor}`}>
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setStatus('idle'); }}
                  placeholder="请输入密码"
                  className={`w-full px-3.5 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${inputBg}`}
                  disabled={status === 'loading'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${eyeBtn}`}
                  tabIndex={-1}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading' || !username.trim() || !password.trim()}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400
                flex items-center justify-center gap-2 shadow-sm shadow-blue-600/30"
            >
              {status === 'loading' ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-blue-300 border-t-white rounded-full animate-spin" />
                  <span>登录中...</span>
                </>
              ) : (
                '登 录'
              )}
            </button>
          </form>
        </div>

        <p className={`text-center text-xs mt-6 ${footerColor}`}>
          Hex.Frontier · Powered by Hexagon AI
        </p>
      </div>
    </div>
  );
}
