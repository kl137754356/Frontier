/**
 * TcpBridge - Manages TCP connection to claw-code's --serve mode.
 *
 * Provides an EventEmitter-based interface for sending messages to claw-code
 * and receiving parsed responses. Handles connection lifecycle, reconnection
 * (max 3 attempts, 2s delay), and JSON Lines protocol framing.
 *
 * Events emitted:
 * - 'message' (TcpServerMessage) - Parsed message from claw-code
 * - 'connected' - TCP connection established
 * - 'disconnected' - TCP connection closed
 * - 'error' (Error) - Connection or protocol error
 */

import { EventEmitter } from 'events';
import * as net from 'net';
import type { TcpClientMessage, TcpServerMessage } from '../../shared/protocol.js';
import { MessageParser } from './message-parser.js';

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 5000; // 5s between runtime reconnect attempts

export interface TcpBridgeEvents {
  message: (msg: TcpServerMessage) => void;
  connected: () => void;
  disconnected: () => void;
  error: (err: Error) => void;
}

export class TcpBridge extends EventEmitter {
  private socket: net.Socket | null = null;
  private parser: MessageParser = new MessageParser();
  private host: string = '';
  private port: number = 0;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private reconnecting: boolean = false;
  private intentionalDisconnect: boolean = false;

  /**
   * Connect to claw-code TCP server.
   * Resolves when connection is established, rejects on failure.
   */
  connect(host: string, port: number): Promise<void> {
    this.host = host;
    this.port = port;
    this.intentionalDisconnect = false;
    this.reconnectAttempts = 0;

    return this.createConnection();
  }

  /**
   * Disconnect from claw-code TCP server.
   * Sends an 'exit' message before closing the socket.
   */
  disconnect(): void {
    this.intentionalDisconnect = true;
    this.reconnecting = false;

    if (this.socket) {
      // Try to send exit message before closing
      try {
        this.sendMessage({ type: 'exit' });
      } catch {
        // Ignore errors during disconnect
      }
      this.socket.destroy();
      this.socket = null;
    }

    if (this.connected) {
      this.connected = false;
      this.emit('disconnected');
    }

    this.parser.reset();
  }

  /**
   * Send a prompt message to claw-code.
   */
  sendPrompt(text: string): void {
    this.sendMessage({ type: 'prompt', text });
  }

  /**
   * Send a reset message to clear claw-code session history.
   */
  sendReset(): void {
    this.sendMessage({ type: 'reset' });
  }

  /**
   * Send an inject message to inject history messages into claw-code.
   */
  sendInject(messages: { role: string; text: string }[]): void {
    this.sendMessage({ type: 'inject', messages });
  }

  /**
   * Send a history request to get prompt history from claw-code.
   */
  sendHistory(): void {
    this.sendMessage({ type: 'history' });
  }

  /**
   * Check if the TCP connection is currently active.
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Send a raw TcpClientMessage over the TCP connection.
   * Messages are serialized as JSON Lines (JSON + '\n').
   */
  private sendMessage(msg: TcpClientMessage): void {
    if (!this.socket || !this.connected) {
      throw new Error('Not connected to claw-code TCP server');
    }
    const data = JSON.stringify(msg) + '\n';
    this.socket.write(data);
  }

  /**
   * Create a new TCP connection with error handling.
   */
  private createConnection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.parser.reset();

      const socket = new net.Socket();
      this.socket = socket;

      const onConnect = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        this.reconnecting = false;
        this.emit('connected');
        resolve();
      };

      const onData = (data: Buffer) => {
        const text = data.toString('utf-8');
        const messages = this.parser.feed(text);
        for (const msg of messages) {
          this.emit('message', msg);
        }
      };

      const onError = (err: Error) => {
        if (this.connected) {
          // Only emit error events for runtime errors, not initial connect failures
          this.emit('error', err);
        }
        if (!this.connected) {
          // Connection failed during initial connect
          reject(err);
        }
      };

      const onClose = () => {
        const wasConnected = this.connected;
        this.connected = false;
        this.socket = null;
        this.parser.reset();

        if (wasConnected) {
          this.emit('disconnected');
        }
      };

      socket.on('connect', onConnect);
      socket.on('data', onData);
      socket.on('error', onError);
      socket.on('close', onClose);

      socket.connect(this.port, this.host);
    });
  }

  /**
   * Attempt to reconnect to the TCP server.
   * Max 3 attempts with 2s delay between each.
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      this.emit('error', new Error(
        `Failed to reconnect after ${MAX_RECONNECT_ATTEMPTS} attempts. ` +
        'Please ensure claw-code is running with --serve mode.'
      ));
      return;
    }

    this.reconnecting = true;
    this.reconnectAttempts++;

    setTimeout(() => {
      if (this.intentionalDisconnect) {
        return;
      }

      this.createConnection()
        .then(() => {
          // Reconnection successful
          this.reconnecting = false;
        })
        .catch(() => {
          // Will trigger onClose → attemptReconnect again
          this.reconnecting = false;
        });
    }, RECONNECT_DELAY_MS);
  }
}
