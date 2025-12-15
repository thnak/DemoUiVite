/**
 * SignalR Client Service
 * Manages WebSocket connections for real-time data communication
 * 
 * Features:
 * - Automatic reconnection with exponential backoff
 * - Connection state management
 * - Error handling and logging
 * - Token-based authentication support
 */

import * as signalR from '@microsoft/signalr';

export interface SignalRConfig {
  hubUrl: string;
  automaticReconnect?: boolean;
  accessTokenFactory?: () => string | Promise<string>;
  logLevel?: signalR.LogLevel;
}

export class SignalRClient {
  private connection: signalR.HubConnection | null = null;

  private reconnectAttempts = 0;

  private maxReconnectAttempts = 5;

  constructor(private config: SignalRConfig) {}

  /**
   * Establish connection to SignalR hub
   */
  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR already connected');
      return;
    }

    const builder = new signalR.HubConnectionBuilder().withUrl(this.config.hubUrl, {
      accessTokenFactory: this.config.accessTokenFactory,
      transport: (() => 
        // eslint-disable-next-line no-bitwise
         signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents
      )(),
      skipNegotiation: false, // Allow negotiation for best transport
    });

    // Configure automatic reconnection
    if (this.config.automaticReconnect !== false) {
      builder.withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          this.reconnectAttempts = retryContext.previousRetryCount;

          // Exponential backoff: 0s, 2s, 10s, 30s
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;

          return Math.min(30000, 2000 * 2 ** retryContext.previousRetryCount);
        },
      });
    }

    // Configure logging
    builder.configureLogging(this.config.logLevel ?? signalR.LogLevel.Information);

    this.connection = builder.build();

    // Setup connection event handlers
    this.setupConnectionHandlers();

    try {
      await this.connection.start();
      console.log('SignalR Connected successfully');
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  /**
   * Close the connection
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log('SignalR Disconnected');
    }
  }

  /**
   * Invoke a server method
   */
  async invoke<T = any>(methodName: string, ...args: any[]): Promise<T> {
    if (!this.connection) {
      throw new Error('SignalR connection not established. Call connect() first.');
    }

    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error(`SignalR connection is ${this.connection.state}. Cannot invoke method.`);
    }

    return this.connection.invoke<T>(methodName, ...args);
  }

  /**
   * Register a handler for server events
   */
  on(eventName: string, callback: (...args: any[]) => void): void {
    this.connection?.on(eventName, callback);
  }

  /**
   * Unregister a handler for server events
   */
  off(eventName: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.connection?.off(eventName, callback);
    } else {
      this.connection?.off(eventName);
    }
  }

  /**
   * Get current connection state
   */
  get state(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }

  /**
   * Check if connected
   */
  get isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  /**
   * Get connection ID
   */
  get connectionId(): string | null {
    return this.connection?.connectionId ?? null;
  }

  /**
   * Setup connection lifecycle event handlers
   */
  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    this.connection.onreconnecting((error) => {
      console.log('SignalR Reconnecting...', error);
      this.reconnectAttempts += 1;
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR Reconnected with connection ID:', connectionId);
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.log('SignalR Connection Closed', error);
      if (error) {
        console.error('Connection closed with error:', error);
      }
    });
  }

  /**
   * Get reconnection attempts count
   */
  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}
