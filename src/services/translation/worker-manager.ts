/**
 * Translation Worker Manager
 *
 * Manages the translation web worker lifecycle and provides a clean API
 * for the main thread to interact with the worker.
 */

import { WorkerMessageType } from './types';

import type {
  EntityType,
  WorkerMessage,
  TranslationConfig,
  TranslationResponse,
  GetTranslationRequest,
} from './types';

// ----------------------------------------------------------------------

/**
 * Event listeners type
 */
type EventListener = (data: any) => void;

/**
 * Translation Worker Manager
 */
export class TranslationWorkerManager {
  private worker: Worker | null = null;
  private initialized = false;
  private pendingRequests = new Map<string, (data: any) => void>();
  private eventListeners = new Map<WorkerMessageType, Set<EventListener>>();
  private requestIdCounter = 0;

  /**
   * Initialize the worker
   */
  async init(config?: Partial<TranslationConfig>): Promise<void> {
    if (this.initialized) {
      console.warn('[TranslationWorker] Already initialized');
      return undefined;
    }

    try {
      // Create worker using Vite's worker import
      const TranslationWorker = await import('./translation.worker?worker');
      this.worker = new TranslationWorker.default();

      // Set up message handler
      this.worker.addEventListener('message', this.handleWorkerMessage);

      // Set up error handler
      this.worker.addEventListener('error', (error) => {
        console.error('[TranslationWorker] Worker error:', error);
      });

      // Send init message
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Worker initialization timeout'));
        }, 10000);

        this.once(WorkerMessageType.INIT_COMPLETE, () => {
          clearTimeout(timeout);
          this.initialized = true;
          console.log('[TranslationWorker] Initialized successfully');
          resolve();
        });

        this.postMessage('INIT', config);
      });
    } catch (error) {
      console.error('[TranslationWorker] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Get a translation
   */
  async getTranslation(entity: EntityType, entityId: string, lang: string): Promise<string | null> {
    if (!this.initialized) {
      console.warn('[TranslationWorker] Not initialized, returning null');
      return null;
    }

    const request: GetTranslationRequest = { entity, entityId, lang };
    const requestId = this.generateRequestId();

    return new Promise<string | null>((resolve) => {
      this.pendingRequests.set(requestId, (response: TranslationResponse) => {
        resolve(response.content);
      });

      this.postMessage('GET_TRANSLATION', request, requestId);

      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          resolve(null);
        }
      }, 5000);
    });
  }

  /**
   * Sync a single entity
   */
  syncEntity(entity: EntityType): void {
    if (!this.initialized) {
      console.warn('[TranslationWorker] Not initialized');
      return;
    }

    this.postMessage('SYNC_ENTITY', { entity });
  }

  /**
   * Sync all entities
   */
  syncAll(): void {
    if (!this.initialized) {
      console.warn('[TranslationWorker] Not initialized');
      return;
    }

    this.postMessage('SYNC_ALL');
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<TranslationConfig>): void {
    if (!this.initialized) {
      console.warn('[TranslationWorker] Not initialized');
      return;
    }

    this.postMessage('SET_CONFIG', config);
  }

  /**
   * Add event listener
   */
  on(type: WorkerMessageType, listener: EventListener): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set());
    }
    this.eventListeners.get(type)!.add(listener);
  }

  /**
   * Remove event listener
   */
  off(type: WorkerMessageType, listener: EventListener): void {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  /**
   * Add one-time event listener
   */
  once(type: WorkerMessageType, listener: EventListener): void {
    const onceListener = (data: any) => {
      listener(data);
      this.off(type, onceListener);
    };
    this.on(type, onceListener);
  }

  /**
   * Terminate the worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.initialized = false;
      this.pendingRequests.clear();
      this.eventListeners.clear();
      console.log('[TranslationWorker] Terminated');
    }
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  // ----------------------------------------------------------------------
  // Private methods
  // ----------------------------------------------------------------------

  /**
   * Handle worker messages
   */
  private handleWorkerMessage = (event: MessageEvent<WorkerMessage>) => {
    const { type, payload, id } = event.data;

    // Handle pending requests
    if (id && this.pendingRequests.has(id)) {
      const callback = this.pendingRequests.get(id)!;
      this.pendingRequests.delete(id);
      callback(payload);
    }

    // Notify event listeners
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.forEach((listener) => listener(payload));
    }
  };

  /**
   * Post message to worker
   */
  private postMessage(type: string, payload?: any, id?: string): void {
    if (!this.worker) {
      console.error('[TranslationWorker] Worker not available');
      return;
    }

    const message: WorkerMessage = { type: type as WorkerMessageType, payload, id };
    this.worker.postMessage(message);
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    this.requestIdCounter += 1;
    return `req_${Date.now()}_${this.requestIdCounter}`;
  }
}

// ----------------------------------------------------------------------

/**
 * Singleton instance
 */
export const translationWorker = new TranslationWorkerManager();
