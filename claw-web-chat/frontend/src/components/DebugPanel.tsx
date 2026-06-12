import { useRef, useEffect } from 'react';
import { useChatStore } from '../store/chat-store';

export function DebugPanel() {
  const debugMode = useChatStore((s) => s.debugMode);
  const debugLogs = useChatStore((s) => s.debugLogs);
  const clearDebugLogs = useChatStore((s) => s.clearDebugLogs);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debugLogs.length]);

  if (!debugMode) return null;

  const typeColor = (type: string) => {
    if (type === 'PROMPT_SENT') return 'text-blue-400';
    if (type.startsWith('TOOL_CALL')) return 'text-yellow-400';
    if (type.startsWith('CUSTOM:')) return 'text-purple-400';
    if (type === 'TEXT_MESSAGE_CONTENT') return 'text-green-400';
    if (type === 'RUN_ERROR') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="border-t border-gray-700 bg-gray-900 max-h-48 overflow-y-auto font-mono text-xs">
      <div className="sticky top-0 flex items-center justify-between px-2 py-1 bg-gray-800 border-b border-gray-700">
        <span className="text-gray-400">Debug Log ({debugLogs.length})</span>
        <button onClick={clearDebugLogs} className="text-gray-500 hover:text-gray-300 text-xs">Clear</button>
      </div>
      <div className="px-2 py-1 space-y-0.5">
        {debugLogs.map((log, i) => (
          <div key={i} className="flex gap-2 leading-4">
            <span className="text-gray-600 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className={`shrink-0 ${typeColor(log.type)}`}>[{log.type}]</span>
            <span className="text-gray-300 break-all">{log.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
