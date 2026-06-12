import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Message, MessageContent } from '@shared/types';

interface AssistantMessageProps {
  message: Message;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  const [thinkingExpanded, setThinkingExpanded] = useState(false);
  const thinkingRef = useRef<HTMLDivElement>(null);

  // Auto-scroll thinking container to bottom when content updates
  useEffect(() => {
    if (thinkingRef.current && message.status === 'streaming') {
      thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight;
    }
  }, [message.thinking, message.status]);

  const hasA2UI = message.content.some((c) => c.type === 'a2ui');

  let textContent = message.content
    .filter((c): c is Extract<MessageContent, { type: 'text' }> => c.type === 'text')
    .map((c) => c.text)
    .join('\n');

  // Strip a2ui_operations JSON from displayed text if A2UI UI is being rendered
  if (hasA2UI) {
    textContent = textContent
      .replace(/```(?:json)?\s*\n?\{[\s\S]*?"a2ui_operations"[\s\S]*?\}\s*\n?```/g, '')
      .replace(/\{[\s\S]*?"a2ui_operations"\s*:\s*\[[\s\S]*?\]\s*\}/g, '')
      .trim();
  }

  const isStreaming = message.status === 'streaming';
  const isError = message.status === 'error';
  const hasThinking = !!message.thinking;

  // Don't render empty text bubble when only a2ui content exists
  if (!textContent && hasA2UI && !isStreaming && !hasThinking) {
    return null;
  }

  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[85%] px-4 py-3 rounded-lg text-content leading-relaxed
          ${isError
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : 'bg-gray-100 dark:bg-gray-800'
          }`}
      >
        {/* Thinking process - always visible during streaming, collapsible when done */}
        {hasThinking && (
          <div className="mb-2">
            {isStreaming ? (
              /* Show thinking content live during streaming - always expanded */
              <div className="border-l-2 border-purple-400 dark:border-purple-600 pl-3">
                <div className="flex items-center gap-1.5 mb-1 text-xs text-purple-600 dark:text-purple-400">
                  <span className="inline-block w-2.5 h-2.5 border-2 border-purple-300 dark:border-purple-600 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" />
                  <span>Thinking...</span>
                </div>
                <div ref={thinkingRef} className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {message.thinking}
                  <span className="inline-block w-1 h-3 bg-purple-400 dark:bg-purple-500 animate-pulse ml-0.5" />
                </div>
              </div>
            ) : (
              /* Collapsible thinking section when done */
              <>
                <button
                  onClick={() => setThinkingExpanded(!thinkingExpanded)}
                  className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 transition-transform ${thinkingExpanded ? 'rotate-90' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>💭 Thinking ({message.thinking!.length} chars)</span>
                </button>
                {thinkingExpanded && (
                  <div className="mt-1.5 pl-4 border-l-2 border-purple-300 dark:border-purple-700 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {message.thinking}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="prose prose-sm dark:prose-invert max-w-none
          prose-p:my-1.5 prose-p:leading-relaxed
          prose-headings:mt-3 prose-headings:mb-1.5 prose-headings:font-semibold
          prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
          prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5
          prose-ul:pl-4 prose-ol:pl-4
          prose-code:font-mono prose-code:text-[13px] prose-code:bg-gray-200 prose-code:dark:bg-gray-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-50 prose-pre:dark:bg-gray-900 prose-pre:border prose-pre:border-gray-200 prose-pre:dark:border-gray-700 prose-pre:rounded-lg prose-pre:my-2.5 prose-pre:p-3 prose-pre:overflow-x-auto
          prose-pre:prose-code:bg-transparent prose-pre:prose-code:px-0 prose-pre:prose-code:py-0 prose-pre:prose-code:text-[13px] prose-pre:prose-code:text-gray-800 prose-pre:prose-code:dark:text-gray-200
          prose-strong:text-gray-900 prose-strong:dark:text-gray-100 prose-strong:font-semibold
          prose-a:text-blue-600 prose-a:dark:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:dark:border-gray-600 prose-blockquote:pl-3 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:dark:text-gray-400 prose-blockquote:my-2
          prose-hr:my-3 prose-hr:border-gray-200 prose-hr:dark:border-gray-700
          prose-table:my-2 prose-th:px-3 prose-th:py-1.5 prose-th:text-left prose-th:font-semibold prose-th:border-b prose-th:border-gray-300 prose-th:dark:border-gray-600
          prose-td:px-3 prose-td:py-1.5 prose-td:border-b prose-td:border-gray-200 prose-td:dark:border-gray-700
          prose-img:rounded-lg prose-img:my-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {textContent}
          </ReactMarkdown>
        </div>

        {/* Streaming cursor */}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-blue-500 dark:bg-blue-400 animate-pulse ml-0.5 rounded-sm" aria-label="Typing" />
        )}
      </div>
    </div>
  );
}
