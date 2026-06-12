import { useChatStore } from '../store/chat-store';
import { sendConnectConfig } from '../services/ws-client';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onToggleSidebar, onOpenSettings, sidebarCollapsed }: HeaderProps) {
  const connectionStatus = useChatStore((s) => s.connectionStatus);
  const currentModel = useChatStore((s) => s.currentModel);
  const theme = useChatStore((s) => s.config.theme);
  const updateConfig = useChatStore((s) => s.updateConfig);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    updateConfig({ theme: newTheme });
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="flex items-center px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
      {/* Hamburger menu - visible when sidebar is collapsed */}
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-ui font-semibold text-gray-800 dark:text-gray-100">
          Frontier
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section: ConnectionStatus + Model + ThemeToggle + SettingsButton */}
      <div className="flex items-center gap-2">
        {/* Connection status */}
        <ConnectionIndicator status={connectionStatus} />

        {/* Current model indicator */}
        {connectionStatus === 'connected' && currentModel && (
          <span className="text-ui text-gray-500 dark:text-gray-400 hidden sm:inline truncate max-w-[180px]" title={currentModel}>
            {currentModel}
          </span>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            // Sun icon (switch to light)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            // Moon icon (switch to dark)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label="Open settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function ConnectionIndicator({ status }: { status: 'connected' | 'disconnected' | 'reconnecting' }) {
  const dotColor =
    status === 'connected'
      ? 'bg-green-500'
      : status === 'reconnecting'
        ? 'bg-yellow-500 animate-pulse'
        : 'bg-red-500';

  const label =
    status === 'connected'
      ? 'Connected'
      : status === 'reconnecting'
        ? 'Reconnecting'
        : 'Disconnected';

  return (
    <div
      className="flex items-center gap-1.5 text-ui text-gray-600 dark:text-gray-300"
      title={label}
    >
      <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}
