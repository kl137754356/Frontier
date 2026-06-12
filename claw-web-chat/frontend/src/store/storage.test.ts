import { describe, it, expect } from 'vitest';
import { isValidUrl } from './storage';

describe('isValidUrl', () => {
  it('accepts http URLs', () => {
    expect(isValidUrl('http://localhost:8080')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
    expect(isValidUrl('http://192.168.1.1:3000/path')).toBe(true);
  });

  it('accepts https URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('https://api.example.com/v1')).toBe(true);
  });

  it('accepts ws URLs', () => {
    expect(isValidUrl('ws://localhost:8080')).toBe(true);
    expect(isValidUrl('ws://192.168.1.1:9527')).toBe(true);
  });

  it('accepts wss URLs', () => {
    expect(isValidUrl('wss://prod.example.com')).toBe(true);
    expect(isValidUrl('wss://secure.host:443/ws')).toBe(true);
  });

  it('rejects URLs without protocol', () => {
    expect(isValidUrl('localhost:8080')).toBe(false);
    expect(isValidUrl('example.com')).toBe(false);
  });

  it('rejects URLs with unsupported protocols', () => {
    expect(isValidUrl('ftp://files.example.com')).toBe(false);
    expect(isValidUrl('file:///etc/passwd')).toBe(false);
    expect(isValidUrl('ssh://server.com')).toBe(false);
  });

  it('rejects invalid strings', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('://missing-protocol')).toBe(false);
  });
});
