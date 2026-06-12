/**
 * MessageParser - JSON Lines message parser for claw-code TCP protocol.
 *
 * Handles buffering of incomplete JSON lines and parsing complete lines
 * into typed TcpServerMessage objects.
 *
 * Protocol: Each message is a single JSON object terminated by '\n'.
 * Partial data is buffered until a complete line is received.
 */

import type { TcpServerMessage } from '../../shared/protocol.js';

export class MessageParser {
  private buffer: string = '';

  /**
   * Feed raw data from the TCP stream.
   * Returns an array of fully parsed TcpServerMessage objects.
   * Incomplete lines are buffered for the next feed() call.
   */
  feed(data: string): TcpServerMessage[] {
    this.buffer += data;
    const messages: TcpServerMessage[] = [];

    // Split on newline - last element may be incomplete
    const lines = this.buffer.split('\n');

    // Keep the last element as buffer (it's either empty string or incomplete line)
    this.buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        continue;
      }

      try {
        const parsed = JSON.parse(trimmed) as TcpServerMessage;
        if (parsed && typeof parsed === 'object' && 'type' in parsed) {
          messages.push(parsed);
        }
      } catch {
        // Invalid JSON line - skip it and log for debugging
        console.warn('[MessageParser] Failed to parse line:', trimmed);
      }
    }

    return messages;
  }

  /**
   * Clear the internal buffer.
   * Call this when resetting the connection or starting fresh.
   */
  reset(): void {
    this.buffer = '';
  }
}
