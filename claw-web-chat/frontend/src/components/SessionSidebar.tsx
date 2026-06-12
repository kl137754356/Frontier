import { useState, useCallback, useRef, useEffect, type MouseEvent } from 'react';
import { useChatStore } from '../store/chat-store';
import { sendReset } from '../services/ws-client';

export function SessionSidebar() {
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const createSession = useChatStore((s) => s.createSession);
  const switchSession = useChatStore((s) => s.switchSession);
  const deleteSession = useChatStore((s) => s.deleteSession);
  const renameSession = useChatStore((s) => s.renameSession);
  const messages = useChatStore((s) => s.messages);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; sessionId: string } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  // Focus rename input when entering rename mode
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const handleNewSession = useCallback(() => {
    const id = createSession();
    sendReset(id);
  }, [createSession]);

  const handleContextMenu = useCallback((e: MouseEvent, sessionId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, sessionId });
  }, []);

  const handleRename = useCallback((sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setRenamingId(sessionId);
      setRenameValue(session.name);
    }
    setContextMenu(null);
  }, [sessions]);

  const handleRenameSubmit = useCallback(() => {
    if (renamingId && renameValue.trim()) {
      renameSession(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  }, [renamingId, renameValue, renameSession]);

  const handleDelete = useCallback((sessionId: string) => {
    deleteSession(sessionId);
    setContextMenu(null);
  }, [deleteSession]);

  const handleExport = useCallback((sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    const sessionMessages = messages[sessionId] ?? [];
    const exportData = { session, messages: sessionMessages };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${session?.name ?? sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setContextMenu(null);
  }, [sessions, messages]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Sort sessions by updatedAt descending (most recent first)
  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* New session button */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleNewSession}
          className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-ui font-medium rounded
            bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          aria-label="New session"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto">
        {sortedSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => switchSession(session.id)}
            onContextMenu={(e) => handleContextMenu(e, session.id)}
            className={`relative px-3 py-2 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors
              ${session.id === activeSessionId
                ? 'bg-blue-50 dark:bg-blue-900/30 border-l-2 border-l-blue-500'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-l-2 border-l-transparent'
              }`}
            role="button"
            tabIndex={0}
            aria-label={`Switch to session ${session.name}`}
            aria-current={session.id === activeSessionId ? 'true' : undefined}
          >
            {/* Unread indicator */}
            {session.unread && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" aria-label="Unread messages" />
            )}

            {/* Session name */}
            {renamingId === session.id ? (
              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit();
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                className="w-full text-ui font-medium bg-white dark:bg-gray-700 border border-blue-400 rounded px-1 py-0.5 outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="text-ui font-medium text-gray-800 dark:text-gray-200 truncate pr-4">
                {session.name}
              </div>
            )}

            {/* Last message preview + time */}
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1 pr-2">
                {session.lastMessagePreview || 'No messages'}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                {formatTime(session.updatedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleRename(contextMenu.sessionId)}
            className="w-full text-left px-3 py-1.5 text-ui text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Rename
          </button>
          <button
            onClick={() => handleExport(contextMenu.sessionId)}
            className="w-full text-left px-3 py-1.5 text-ui text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Export
          </button>
          <button
            onClick={() => handleDelete(contextMenu.sessionId)}
            className="w-full text-left px-3 py-1.5 text-ui text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
