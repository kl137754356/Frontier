/**
 * ws-client.ts - Compatibility shim.
 *
 * This file now re-exports the AG-UI client with the same API surface
 * as the old WebSocket client, so all existing component imports continue
 * to work without modification.
 */

import { aguiClient, sendPrompt, sendReset, sendSlashCommand, sendConnectConfig } from './agui-client';

/**
 * Compatibility wrapper: exposes .connect() and .disconnect() matching
 * the old WsClient interface used in App.tsx.
 */
export const wsClient = {
  connect(url: string): void {
    aguiClient.connect(url);
  },
  disconnect(): void {
    aguiClient.disconnect();
  },
};

/**
 * WsClient class export for backward compatibility with tests.
 * This is a thin wrapper around the AG-UI client.
 */
export class WsClient {
  private url = '';
  private _connected = false;

  connect(url: string): void {
    this.url = url;
    this._connected = true;
    aguiClient.connect(url);
  }

  disconnect(): void {
    this._connected = false;
    aguiClient.disconnect();
  }

  send(msg: any): void {
    // No-op in AG-UI mode; prompts go through sendPrompt()
    console.log('[WsClient compat] send called:', msg?.type);
  }

  isConnected(): boolean {
    return this._connected;
  }

  getReconnectDelay(): number {
    return 5000; // Fixed for compat
  }
}

export { sendPrompt, sendReset, sendSlashCommand, sendConnectConfig };
