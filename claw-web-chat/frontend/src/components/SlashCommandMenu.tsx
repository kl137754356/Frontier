import { useMemo, useCallback } from 'react';
import { useChatStore } from '../store/chat-store';
import { sendSlashCommand, sendReset } from '../services/ws-client';
import { sendPrompt } from '../services/agui-client';
import { showToast } from './Notifications';
import { SLASH_COMMANDS } from '@shared/types';
import type { Message } from '@shared/types';

interface SlashCommandMenuProps {
  prefix: string;
  onSelect: (text: string) => void;
  onClose: () => void;
}

export function SlashCommandMenu({ prefix, onSelect, onClose }: SlashCommandMenuProps) {
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const clearMessages = useChatStore((s) => s.clearMessages);
  const addMessage = useChatStore((s) => s.addMessage);
  const startStreaming = useChatStore((s) => s.startStreaming);
  const sessions = useChatStore((s) => s.sessions);
  const messages = useChatStore((s) => s.messages);
  const connectionStatus = useChatStore((s) => s.connectionStatus);
  const currentModel = useChatStore((s) => s.currentModel);

  // Filter commands based on prefix (strip leading /)
  const searchTerm = prefix.startsWith('/') ? prefix.slice(1).toLowerCase() : '';

  const filteredCommands = useMemo(() => {
    if (!searchTerm) return SLASH_COMMANDS;
    return SLASH_COMMANDS.filter((cmd) =>
      cmd.name.toLowerCase().startsWith(searchTerm)
    );
  }, [searchTerm]);

  const executeCommand = useCallback((commandName: string) => {
    if (!activeSessionId) return;

    const addSystemMessage = (text: string) => {
      const msg: Message = {
        id: crypto.randomUUID(),
        sessionId: activeSessionId,
        role: 'system',
        content: [{ type: 'text', text }],
        timestamp: Date.now(),
        status: 'complete',
      };
      addMessage(activeSessionId, msg);
    };

    switch (commandName) {
      case 'help': {
        const helpText = SLASH_COMMANDS.map(
          (cmd) => `/${cmd.name} — ${cmd.description}`
        ).join('\n');
        addSystemMessage(`Available commands:\n${helpText}`);
        break;
      }

      case 'status': {
        const statusText = [
          `Model: ${currentModel || 'Not connected'}`,
          `Connection: ${connectionStatus}`,
        ].join('\n');
        addSystemMessage(statusText);
        break;
      }

      case 'clear': {
        clearMessages(activeSessionId);
        sendReset(activeSessionId);
        break;
      }

      case 'cost': {
        const session = sessions.find((s) => s.id === activeSessionId);
        if (session) {
          const { inputTokens, outputTokens, estimatedCost } = session.tokenUsage;
          const costText = [
            `Token Usage:`,
            `  Input: ${inputTokens}`,
            `  Output: ${outputTokens}`,
            `  Total: ${inputTokens + outputTokens}`,
            `  Estimated Cost: $${estimatedCost.toFixed(4)}`,
          ].join('\n');
          addSystemMessage(costText);
        }
        break;
      }

      case 'export': {
        const session = sessions.find((s) => s.id === activeSessionId);
        const sessionMessages = messages[activeSessionId] ?? [];
        const exportData = { session, messages: sessionMessages };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `session-${session?.name ?? activeSessionId}.json`;
        a.click();
        URL.revokeObjectURL(url);
        addSystemMessage('Session exported successfully.');
        break;
      }

      // Remote commands: forward as prompt so results come back through SSE stream
      case 'compact':
      case 'skills':
      case 'plugins':
      case 'mcp':
      case 'version': {
        // Add user message showing the command
        const userMsg: Message = {
          id: crypto.randomUUID(),
          sessionId: activeSessionId,
          role: 'user',
          content: [{ type: 'text', text: `/${commandName}` }],
          timestamp: Date.now(),
          status: 'complete',
        };
        addMessage(activeSessionId, userMsg);
        startStreaming(activeSessionId);
        sendPrompt(`/${commandName}`, activeSessionId);
        break;
      }

      default:
        break;
    }

    onSelect('');
    onClose();
  }, [activeSessionId, clearMessages, addMessage, startStreaming, sessions, messages, connectionStatus, currentModel, onSelect, onClose]);

  if (filteredCommands.length === 0) return null;

  return (
    <div className="absolute bottom-full left-4 right-4 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto z-20">
      {filteredCommands.map((cmd) => (
        <button
          key={cmd.name}
          onClick={() => executeCommand(cmd.name)}
          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-ui font-mono text-blue-600 dark:text-blue-400 shrink-0">
            /{cmd.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {cmd.description}
          </span>
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 shrink-0">
            {cmd.handler === 'local' ? 'local' : 'remote'}
          </span>
        </button>
      ))}
    </div>
  );
}
