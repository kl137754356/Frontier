import { describe, it, expect, beforeEach } from 'vitest';
import { MessageParser } from './message-parser.js';

describe('MessageParser', () => {
  let parser: MessageParser;

  beforeEach(() => {
    parser = new MessageParser();
  });

  describe('feed()', () => {
    it('should parse a single complete JSON line', () => {
      const result = parser.feed('{"type":"ready","model":"claude","session_id":"abc"}\n');
      expect(result).toEqual([{ type: 'ready', model: 'claude', session_id: 'abc' }]);
    });

    it('should parse multiple complete JSON lines in one feed', () => {
      const data = '{"type":"chunk","text":"hello"}\n{"type":"chunk","text":" world"}\n{"type":"done"}\n';
      const result = parser.feed(data);
      expect(result).toEqual([
        { type: 'chunk', text: 'hello' },
        { type: 'chunk', text: ' world' },
        { type: 'done' },
      ]);
    });

    it('should buffer incomplete lines across multiple feeds', () => {
      const result1 = parser.feed('{"type":"chunk","te');
      expect(result1).toEqual([]);

      const result2 = parser.feed('xt":"partial"}\n');
      expect(result2).toEqual([{ type: 'chunk', text: 'partial' }]);
    });

    it('should handle data split at arbitrary points', () => {
      // Simulate TCP chunking at arbitrary byte boundaries
      const fullMessage = '{"type":"usage","input_tokens":100,"output_tokens":50}\n';
      const splitPoint = 15;

      const result1 = parser.feed(fullMessage.slice(0, splitPoint));
      expect(result1).toEqual([]);

      const result2 = parser.feed(fullMessage.slice(splitPoint));
      expect(result2).toEqual([{ type: 'usage', input_tokens: 100, output_tokens: 50 }]);
    });

    it('should skip empty lines', () => {
      const result = parser.feed('{"type":"done"}\n\n\n{"type":"done"}\n');
      expect(result).toEqual([{ type: 'done' }, { type: 'done' }]);
    });

    it('should skip invalid JSON lines', () => {
      const result = parser.feed('not json\n{"type":"done"}\n');
      expect(result).toEqual([{ type: 'done' }]);
    });

    it('should parse all server message types', () => {
      const messages = [
        '{"type":"ready","model":"claude-sonnet","session_id":"s1"}\n',
        '{"type":"chunk","text":"hi"}\n',
        '{"type":"done"}\n',
        '{"type":"error","text":"something went wrong"}\n',
        '{"type":"usage","input_tokens":10,"output_tokens":20}\n',
        '{"type":"tool_start","id":"t1","name":"bash","input":"ls"}\n',
        '{"type":"tool_end","id":"t1","output":"file.txt","is_error":false}\n',
        '{"type":"reset_done","session_id":"s2"}\n',
        '{"type":"inject_done","count":3}\n',
        '{"type":"history","messages":["msg1","msg2"]}\n',
      ];

      const result = parser.feed(messages.join(''));
      expect(result).toHaveLength(10);
      expect(result[0]).toEqual({ type: 'ready', model: 'claude-sonnet', session_id: 's1' });
      expect(result[1]).toEqual({ type: 'chunk', text: 'hi' });
      expect(result[2]).toEqual({ type: 'done' });
      expect(result[3]).toEqual({ type: 'error', text: 'something went wrong' });
      expect(result[4]).toEqual({ type: 'usage', input_tokens: 10, output_tokens: 20 });
      expect(result[5]).toEqual({ type: 'tool_start', id: 't1', name: 'bash', input: 'ls' });
      expect(result[6]).toEqual({ type: 'tool_end', id: 't1', output: 'file.txt', is_error: false });
      expect(result[7]).toEqual({ type: 'reset_done', session_id: 's2' });
      expect(result[8]).toEqual({ type: 'inject_done', count: 3 });
      expect(result[9]).toEqual({ type: 'history', messages: ['msg1', 'msg2'] });
    });

    it('should handle mixed complete and incomplete lines', () => {
      const result1 = parser.feed('{"type":"chunk","text":"a"}\n{"type":"chu');
      expect(result1).toEqual([{ type: 'chunk', text: 'a' }]);

      const result2 = parser.feed('nk","text":"b"}\n');
      expect(result2).toEqual([{ type: 'chunk', text: 'b' }]);
    });

    it('should return empty array for data with no newlines', () => {
      const result = parser.feed('{"type":"done"}');
      expect(result).toEqual([]);
    });
  });

  describe('reset()', () => {
    it('should clear the internal buffer', () => {
      // Feed partial data
      parser.feed('{"type":"chunk","te');

      // Reset the parser
      parser.reset();

      // Feed new complete data - should not combine with old buffer
      const result = parser.feed('{"type":"done"}\n');
      expect(result).toEqual([{ type: 'done' }]);
    });
  });
});
