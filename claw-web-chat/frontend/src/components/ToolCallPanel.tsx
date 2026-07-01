import { useState } from 'react';
import type { MessageContent } from '@shared/types';

interface ToolCallPanelProps {
  content: MessageContent[];
}

const GROUP_COLLAPSE_THRESHOLD = 2; // auto-collapse the whole group when tool count exceeds this

export function ToolCallPanel({ content }: ToolCallPanelProps) {
  // Filter out a2ui tool calls since they are rendered as A2UI components
  // Show all other tool calls (MCP + internal) for real-time execution visibility
  const filteredContent = content.filter((block) => {
    if (block.type === 'tool_use') {
      if (block.name.includes('a2ui')) return false;
      return true;
    }
    if (block.type === 'tool_result') {
      if (block.toolName?.includes('a2ui')) return false;
      return true;
    }
    return true;
  });

  const toolUseBlocks = filteredContent.filter(c => c.type === 'tool_use');
  const toolCount = toolUseBlocks.length;

  if (filteredContent.filter(c => c.type === 'tool_use' || c.type === 'tool_result').length === 0) {
    return null;
  }

  // Auto-collapse group when there are more than threshold tool calls
  const shouldAutoCollapse = toolCount > GROUP_COLLAPSE_THRESHOLD;
  const [groupCollapsed, setGroupCollapsed] = useState(shouldAutoCollapse);

  // Check if any tool is still running (no result yet)
  const isAnyRunning = toolUseBlocks.some(b => {
    if (b.type !== 'tool_use') return false;
    return !content.some(c => c.type === 'tool_result' && c.toolUseId === b.id);
  });

  // Count errors
  const errorCount = filteredContent.filter(
    c => c.type === 'tool_result' && c.isError
  ).length;

  // Build a short summary of tool names for the collapsed header
  const toolNames = toolUseBlocks
    .slice(0, 3)
    .map(b => b.type === 'tool_use' ? (b.name.includes('/') ? b.name.split('/').slice(1).join('/') : b.name) : '')
    .filter(Boolean);
  const namesSummary = toolNames.join(', ') + (toolCount > 3 ? ` +${toolCount - 3}` : '');

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Group header — always visible, click to toggle */}
      <button
        onClick={() => setGroupCollapsed(g => !g)}
        className="w-full flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-left"
        aria-expanded={!groupCollapsed}
      >
        {/* Collapse arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3 w-3 text-gray-400 transition-transform shrink-0 ${groupCollapsed ? '' : 'rotate-90'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>

        {/* Spinner or tool icon */}
        {isAnyRunning ? (
          <span className="inline-block w-3 h-3 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin shrink-0" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}

        {/* Tool count badge */}
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 shrink-0">
          {toolCount} 个工具调用
        </span>

        {/* Tool names summary */}
        <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
          {namesSummary}
        </span>

        {/* Error badge */}
        {errorCount > 0 && (
          <span className="ml-auto shrink-0 text-xs px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            {errorCount} 错误
          </span>
        )}

        {/* Running badge */}
        {isAnyRunning && (
          <span className="ml-auto shrink-0 text-xs text-blue-500 dark:text-blue-400">
            执行中…
          </span>
        )}
      </button>

      {/* Collapsible tool list */}
      {!groupCollapsed && (
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          <div className="p-2 space-y-2">
            {filteredContent.map((block, idx) => {
        if (block.type === 'tool_use') {
          // Find matching tool_result
          const result = content.find(
            (c) => c.type === 'tool_result' && c.toolUseId === block.id
          );
          return (
            <ToolCallItem
              key={`${block.id}-${idx}`}
              name={block.name}
              input={block.input}
              output={result?.type === 'tool_result' ? result.output : undefined}
              isError={result?.type === 'tool_result' ? result.isError : false}
            />
          );
        }
        // Standalone tool_result without matching tool_use
        if (block.type === 'tool_result') {
          const hasMatchingUse = content.some(
            (c) => c.type === 'tool_use' && c.id === block.toolUseId
          );
          if (!hasMatchingUse) {
            return (
              <ToolCallItem
                key={`result-${block.toolUseId}-${idx}`}
                name={block.toolName || 'Tool'}
                input=""
                output={block.output}
                isError={block.isError}
              />
            );
          }
        }
        return null;
      })}
          </div>
        </div>
      )}
    </div>
  );
}

interface ToolCallItemProps {
  name: string;
  input: string;
  output?: string;
  isError: boolean;
}

function ToolCallItem({ name, input, output, isError }: ToolCallItemProps) {
  // Can expand if there's any input OR the tool has finished (output is defined, even if empty)
  const hasContent = !!(input || output !== undefined);
  // Always start collapsed - user can expand if interested
  const [collapsed, setCollapsed] = useState(true);

  // Parse namespace prefix (MCP: "server/tool" or Plugin: "plugin/tool")
  const hasNamespace = name.includes('/');
  const namespace = hasNamespace ? name.split('/')[0] : null;
  const toolName = hasNamespace ? name.split('/').slice(1).join('/') : name;

  // Determine status indicator for the header
  const isRunning = output === undefined;

  return (
    <div
      className={`rounded-lg border overflow-hidden shadow-sm
        ${isError
          ? 'border-red-300 dark:border-red-700'
          : 'border-gray-300 dark:border-gray-700'
        }`}
    >
      {/* Tool Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`w-full flex items-center gap-2 px-3 py-1.5 text-ui font-medium transition-colors
          ${isError
            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
          }
          hover:bg-gray-50 dark:hover:bg-gray-750`}
        aria-expanded={!collapsed}
        aria-label={`Toggle tool call ${name}`}
      >
        {/* Status indicator: spinner when running, checkmark when done, collapse arrow if has content */}
        {isRunning ? (
          <span className="inline-block w-3 h-3 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin shrink-0" />
        ) : hasContent ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3 w-3 transition-transform shrink-0 ${collapsed ? '' : 'rotate-90'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}

        {/* Error indicator */}
        {isError && (
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" aria-label="Error" />
        )}

        {/* Tool icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>

        {/* Namespace prefix */}
        {namespace && (
          <span className="text-xs px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
            {namespace}
          </span>
        )}

        {/* Tool name */}
        <span className="truncate">{toolName}</span>
      </button>

      {/* Collapsible content - only render if there's something to show */}
      {!collapsed && hasContent && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Tool Input */}
          {input && (
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">Input</div>
              <pre className="text-xs font-mono text-gray-800 dark:text-gray-300 whitespace-pre-wrap break-all bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2 max-h-48 overflow-y-auto">
                {formatInput(input)}
              </pre>
            </div>
          )}

          {/* Tool Output */}
          {output !== undefined ? (
            output ? (
              <div className="px-3 py-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-semibold">Output</div>
                <pre
                  className={`text-xs font-mono whitespace-pre-wrap break-all rounded p-2 max-h-64 overflow-y-auto border
                    ${isError
                      ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                      : 'text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                    }`}
                >
                  {output}
                </pre>
              </div>
            ) : (
              <div className="px-3 py-1.5">
                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  完成（输出未通过协议回传，详见后台日志）
                </span>
              </div>
            )
          ) : (
            <div className="px-3 py-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-block w-3 h-3 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
              Running...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Format tool input for display. Tries to parse as JSON for pretty-printing.
 */
function formatInput(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return input;
  }
}
