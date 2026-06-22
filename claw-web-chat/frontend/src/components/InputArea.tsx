import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from 'react';
import { useChatStore } from '../store/chat-store';
import { sendPrompt, sendSlashCommand, sendReset, aguiClient } from '../services/agui-client';
import { SlashCommandMenu } from './SlashCommandMenu';
import { AgentSelector } from './AgentSelector';
import { A2AAgentManager } from './A2AAgentManager';
import { A2AAgentList } from './A2AAgentList';
import type { Message } from '@shared/types';

// Known skill names that can be invoked as bare words
const KNOWN_SKILLS = [
  'sysinfo',
  'refactor',
  'test',
  'review',
  'explain',
  'document',
  'debug',
  'optimize',
];

/**
 * Check if a message is a bare-word skill invocation.
 * A bare-word skill is a single word (alphanumeric, hyphens, underscores)
 * that matches a known skill name.
 */
function isBareWordSkill(text: string): boolean {
  const trimmed = text.trim();
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return KNOWN_SKILLS.includes(trimmed.toLowerCase());
  }
  return false;
}

export function InputArea() {
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const addMessage = useChatStore((s) => s.addMessage);
  const startStreaming = useChatStore((s) => s.startStreaming);
  const sessions = useChatStore((s) => s.sessions);
  const agents = useChatStore((s) => (s as any).agents) || [];
  const setActiveAgent = useChatStore((s) => (s as any).setActiveAgent) || (() => {});
  const refreshAgents = useChatStore((s) => (s as any).refreshAgents) || (() => {});

  const [text, setText] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [showA2AManager, setShowA2AManager] = useState(false);
  const [directA2AAgentId, setDirectA2AAgentId] = useState<string | null>(null);
  const [directA2AAgentName, setDirectA2AAgentName] = useState<string | null>(null);
  const [skillSuggestions, setSkillSuggestions] = useState<{ label: string; text: string }[] | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load agents on mount
  useEffect(() => {
    refreshAgents();
  }, [refreshAgents]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = '60px';
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(Math.max(scrollHeight, 60), 200)}px`;
  }, [text]);

  // Show slash menu when input starts with "/"
  useEffect(() => {
    if (text.startsWith('/') && !text.includes(' ')) {
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
    }

    // Skill suggestions based on keywords
    const lower = text.toLowerCase();
    if (lower.match(/heartbeat|心跳|监控|存活检测|health.?check|定时/)) {
      setSkillSuggestions([
        { label: '🔌 监控端口', text: '添加心跳：每 30 秒检查 localhost:8080 端口是否可达，连续 3 次失败就弹窗告警，持续运行直到我手动停止' },
        { label: '🗑️ 定时清理', text: '添加心跳：每 10 秒检查回收站，如果有文件就清空，5 分钟后自动停止' },
        { label: '⚙️ 监控进程', text: '添加心跳：每 15 秒检查 nginx 进程是否在运行，如果挂了就执行 restart-nginx.bat 重启，永久运行' },
        { label: '🌐 监控 API', text: '添加心跳：每 60 秒请求 http://localhost:8080/health，返回非 200 就记录日志并告警，10 分钟后停止' },
        { label: '📋 管理任务', text: '查看所有心跳任务的状态和最近日志' },
      ]);
    } else {
      setSkillSuggestions(null);
    }
  }, [text]);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || !activeSessionId) return;

    // If currently streaming, abort the previous request first
    if (isStreaming) {
      aguiClient.cancelCurrentRun(activeSessionId);
    }

    // Check for bare-word skill invocation
    if (isBareWordSkill(trimmed)) {
      sendSlashCommand(`skill:${trimmed}`, activeSessionId);
      setText('');
      return;
    }

    // Check for /test-a2ui command to trigger test a2ui rendering
    if (trimmed === '/test-a2ui') {
      startStreaming(activeSessionId);
      // Fetch test endpoint and process as SSE
      fetch('/a2ui-test', { headers: { 'Accept': 'text/event-stream' } })
        .then(async (response) => {
          const reader = response.body?.getReader();
          if (!reader) return;
          const decoder = new TextDecoder();
          let buf = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            const lines = buf.split('\n');
            buf = lines.pop() || '';
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const event = JSON.parse(line.slice(6).trim());
                  if (event.type === 'CUSTOM' && event.name === 'a2ui_render') {
                    const store = useChatStore.getState();
                    const sid = store.activeSessionId!;
                    const msgs = store.messages[sid] || [];
                    const targetId = store.streamingMessageId;
                    if (targetId) {
                      const updated = msgs.map((m: any) =>
                        m.id === targetId
                          ? { ...m, content: [...m.content, { type: 'a2ui', operations: event.data.operations }] }
                          : m
                      );
                      useChatStore.setState({ messages: { ...store.messages, [sid]: updated } });
                    }
                  } else if (event.type === 'RUN_FINISHED') {
                    useChatStore.getState().finishStreaming(activeSessionId);
                  }
                } catch {}
              }
            }
          }
          reader.releaseLock();
        });
      setText('');
      return;
    }

    // Add user message to store
    const userMsg: Message = {
      id: crypto.randomUUID(),
      sessionId: activeSessionId,
      role: 'user',
      content: [{ type: 'text', text: trimmed }],
      timestamp: Date.now(),
      status: 'complete',
    };
    addMessage(activeSessionId, userMsg);

    // Start streaming and send prompt
    startStreaming(activeSessionId);
    sendPrompt(trimmed, activeSessionId, directA2AAgentId);

    setText('');
  }, [text, activeSessionId, isStreaming, addMessage, startStreaming]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showSlashMenu) {
        setShowSlashMenu(false);
      }
      handleSubmit();
    }
  }, [handleSubmit, showSlashMenu]);

  const handleSlashCommandSelect = useCallback((fullText: string) => {
    setText(fullText);
    setShowSlashMenu(false);
    // Auto-submit slash commands
    if (fullText.startsWith('/')) {
      // Let the slash command menu handle execution
    }
  }, []);

  // Token usage display
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const activeAgentId = activeSession?.activeAgentId ?? null;
  const activeAgent = agents.find((a) => a.agent_id === activeAgentId) ?? null;
  const tokenUsage = activeSession?.tokenUsage;

  return (
  <>
    <div className="relative shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
      {/* Slash command menu */}
      {showSlashMenu && (
        <SlashCommandMenu
          prefix={text}
          onSelect={handleSlashCommandSelect}
          onClose={() => setShowSlashMenu(false)}
        />
      )}

      {/* Skill suggestions */}
      {skillSuggestions && !showSlashMenu && (
        <div className="absolute bottom-full left-4 right-4 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-20">
          <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-600">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">💡 Heartbeat 快捷示例（点击使用）</span>
          </div>
          {skillSuggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setText(s.text); setSkillSuggestions(null); }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b last:border-b-0 border-gray-100 dark:border-gray-700"
            >
              {s.label} — <span className="text-gray-500 dark:text-gray-400">{s.text}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Text input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? 'Type to interrupt and send new message...' : 'Type a message... (/ for commands)'}
          className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-900 text-content text-gray-900 dark:text-gray-100
            px-3 py-2 outline-none focus:border-blue-400 dark:focus:border-blue-500
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
          style={{ minHeight: '60px', maxHeight: '200px' }}
          aria-label="Message input"
        />

        {/* Send / Stop button */}
        {isStreaming ? (
          <button
            onClick={() => aguiClient.cancelCurrentRun(activeSessionId!)}
            className="shrink-0 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors animate-pulse"
            aria-label="Stop generation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="shrink-0 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300
              dark:disabled:bg-gray-600 text-white disabled:text-gray-500 dark:disabled:text-gray-400
              transition-colors disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Token counter + toolbar */}
      <div className="mt-1.5 flex items-center gap-3">
        {/* Agent selector button */}
        <div className="relative">
          <button
            onClick={() => setShowAgentMenu((v) => !v)}
            className={`flex items-center gap-1 text-xs transition-colors ${
              directA2AAgentId
                ? 'text-purple-500 dark:text-purple-400 font-medium'
                : activeAgent
                ? 'text-blue-500 dark:text-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
            }`}
            title="切换 Agent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.364 2.798H4.362c-1.394 0-2.365-1.798-1.364-2.798L4.2 15.3" />
            </svg>
            <span>{directA2AAgentName || (activeAgent ? activeAgent.name : 'Agent')}</span>
          </button>

          {/* Agent popover */}
          {showAgentMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-30 p-3 max-h-80 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">选择 Agent</span>
                <button onClick={() => setShowAgentMenu(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none">&times;</button>
              </div>

              {/* Default: use claw-code (no direct agent) */}
              <button
                onClick={() => { setDirectA2AAgentId(null); setDirectA2AAgentName(null); setShowAgentMenu(false); }}
                className={`w-full text-left px-2 py-1.5 rounded text-xs mb-1 ${!directA2AAgentId ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                🧠 Frontier (claw-code)
                {!directA2AAgentId && <span className="ml-1 text-blue-400">✓</span>}
              </button>

              {/* A2A Direct Agents */}
              <A2AAgentList
                selectedId={directA2AAgentId}
                onSelect={(id, name) => {
                  setDirectA2AAgentId(id);
                  setDirectA2AAgentName(name);
                  setShowAgentMenu(false);
                }}
              />

              {/* Manage button */}
              <button
                onClick={() => { setShowAgentMenu(false); setShowA2AManager(true); }}
                className="w-full mt-2 px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 border-t border-gray-200 dark:border-gray-700 pt-2"
              >
                ⚙ 管理 A2A Agent
              </button>
            </div>
          )}
        </div>

        {/* New chat button */}
        <button
          onClick={() => {
            const id = useChatStore.getState().createSession();
            sendReset(id);
          }}
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          title="New chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>New</span>
        </button>

        {/* Toggle sidebar button */}
        <button
          onClick={() => {
            const state = useChatStore.getState();
            state.updateConfig({ sidebarCollapsed: !state.config.sidebarCollapsed });
          }}
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          title="Toggle history"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span>History</span>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Token counter */}
        {tokenUsage && (tokenUsage.inputTokens > 0 || tokenUsage.outputTokens > 0) && (
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Tokens: {tokenUsage.inputTokens + tokenUsage.outputTokens}</span>
            {tokenUsage.estimatedCost > 0 && (
              <span>· ${tokenUsage.estimatedCost.toFixed(4)}</span>
            )}
          </div>
        )}
      </div>
    </div>

    {/* A2A Agent Manager Modal */}
    {showA2AManager && <A2AAgentManager onClose={() => setShowA2AManager(false)} />}
  </>
  );
}
