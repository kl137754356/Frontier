/**
 * Storage utility helpers for claw-web-chat.
 */

/**
 * Validates whether a string is a valid URL with an accepted protocol.
 * Accepted protocols: http, https, ws, wss.
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'http:' ||
      parsed.protocol === 'https:' ||
      parsed.protocol === 'ws:' ||
      parsed.protocol === 'wss:'
    );
  } catch {
    return false;
  }
}
