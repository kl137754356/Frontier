import { useRef, useEffect, useState, useCallback } from 'react';
import { useChatStore } from '../store/chat-store';
import { AssistantMessage } from './AssistantMessage';
import { ToolCallPanel } from './ToolCallPanel';
import { A2UIRenderer } from './A2UIRenderer';
import type { Message, MessageContent } from '@shared/types';

export function MessageList() {
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const sessionMessages = activeSessionId ? messages[activeSessionId] ?? [] : [];

  // Auto-scroll to bottom during streaming unless user scrolled up
  useEffect(() => {
    if (!userScrolledUp && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [sessionMessages, userScrolledUp]);

  // Detect user scroll
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;

    if (isAtBottom) {
      setUserScrolledUp(false);
    } else if (isStreaming) {
      setUserScrolledUp(true);
    }
  }, [isStreaming]);

  const scrollToBottom = useCallback(() => {
    setUserScrolledUp(false);
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0"
    >
      {sessionMessages.length === 0 && (
        <div className="flex-1 flex items-center justify-center h-full text-content text-gray-400 dark:text-gray-500">
          <p>Start a conversation</p>
        </div>
      )}

      {sessionMessages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* Scroll anchor */}
      <div ref={bottomRef} />

      {/* Scroll to bottom button */}
      {userScrolledUp && isStreaming && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-6 z-10 flex items-center gap-1 px-3 py-1.5 rounded-full
            bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-ui shadow-lg
            hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
          aria-label="Scroll to bottom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>Bottom</span>
        </button>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === 'system') {
    return <SystemNotice message={message} />;
  }

  if (message.role === 'user') {
    return <UserMessage message={message} />;
  }

  // Assistant message - check content types
  const hasToolUse = message.content.some((c) => c.type === 'tool_use');
  const hasToolResult = message.content.some((c) => c.type === 'tool_result');
  const hasA2UI = message.content.some((c) => c.type === 'a2ui');

  if (hasToolUse || hasToolResult) {
    // Check if there's meaningful text content to show alongside tools
    const textContent = message.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as { type: 'text'; text: string }).text)
      .join('')
      .trim();

    return (
      <>
        <ToolCallPanel content={message.content} />
        {textContent && <AssistantMessage message={message} />}
        {hasA2UI && <A2UIRenderer content={message.content} />}
      </>
    );
  }

  if (hasA2UI) {
    // Check if there's meaningful text content
    const textContent = message.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as { type: 'text'; text: string }).text)
      .join('')
      .trim();

    if (textContent) {
      return (
        <>
          <AssistantMessage message={message} />
          <A2UIRenderer content={message.content} />
        </>
      );
    }
    // Only a2ui content, no text — just render the choice UI
    return <A2UIRenderer content={message.content} />;
  }

  return <AssistantMessage message={message} />;
}

function UserMessage({ message }: { message: Message }) {
  const textContent = message.content
    .filter((c): c is Extract<MessageContent, { type: 'text' }> => c.type === 'text')
    .map((c) => c.text)
    .join('\n');

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] px-3 py-2 rounded-lg bg-blue-500 text-white text-content whitespace-pre-wrap">
        {textContent}
      </div>
    </div>
  );
}

function SystemNotice({ message }: { message: Message }) {
  const textContent = message.content
    .filter((c): c is Extract<MessageContent, { type: 'text' }> => c.type === 'text')
    .map((c) => c.text)
    .join('\n');

  return (
    <div className="flex justify-center">
      <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-ui text-gray-500 dark:text-gray-400 italic">
        {textContent}
      </div>
    </div>
  );
}
