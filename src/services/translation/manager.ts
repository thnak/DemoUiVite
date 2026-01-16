/**
 * Translation Manager
 * 
 * Central manager for the translation system.
 * Provides initialization, sync control, and event handling.
 */

import type { TranslationConfig, SyncProgress } from './types';
import { WorkerMessageType } from './types';
import { translationWorker } from './worker-manager';
import { apiConfig } from 'src/api/config';

// ----------------------------------------------------------------------

/**
 * Translation Manager Class
 */
class TranslationManagerClass {
  private syncProgressListeners = new Set<(progress: SyncProgress) => void>();
  private syncCompleteListeners = new Set<() => void>();
  private dataUpdatedListeners = new Set<(entity: string) => void>();

  /**
   * Initialize the translation system
   */
  async initialize(config?: Partial<TranslationConfig>): Promise<void> {
    console.log('[TranslationManager] Initializing...');

    // Set base URL from API config
    const fullConfig: Partial<TranslationConfig> = {
      baseUrl: apiConfig.baseUrl,
      pollingInterval: 30 * 60 * 1000, // 30 minutes
      autoSync: true,
      ...config,
    };

    try {
      await translationWorker.init(fullConfig);

      // Set up event listeners
      this.setupEventListeners();

      console.log('[TranslationManager] Initialized successfully');
    } catch (error) {
      console.error('[TranslationManager] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Sync all entity translations
   */
  syncAll(): void {
    console.log('[TranslationManager] Syncing all entities...');
    translationWorker.syncAll();
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<TranslationConfig>): void {
    translationWorker.setConfig(config);
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return translationWorker.isInitialized();
  }

  /**
   * Add sync progress listener
   */
  onSyncProgress(listener: (progress: SyncProgress) => void): () => void {
    this.syncProgressListeners.add(listener);
    return () => this.syncProgressListeners.delete(listener);
  }

  /**
   * Add sync complete listener
   */
  onSyncComplete(listener: () => void): () => void {
    this.syncCompleteListeners.add(listener);
    return () => this.syncCompleteListeners.delete(listener);
  }

  /**
   * Add data updated listener
   */
  onDataUpdated(listener: (entity: string) => void): () => void {
    this.dataUpdatedListeners.add(listener);
    return () => this.dataUpdatedListeners.delete(listener);
  }

  /**
   * Terminate the translation system
   */
  terminate(): void {
    translationWorker.terminate();
    this.syncProgressListeners.clear();
    this.syncCompleteListeners.clear();
    this.dataUpdatedListeners.clear();
    console.log('[TranslationManager] Terminated');
  }

  // ----------------------------------------------------------------------
  // Private methods
  // ----------------------------------------------------------------------

  /**
   * Setup event listeners from worker
   */
  private setupEventListeners(): void {
    // Listen to sync progress
    translationWorker.on(WorkerMessageType.SYNC_PROGRESS, (progress: SyncProgress) => {
      this.syncProgressListeners.forEach((listener) => listener(progress));
    });

    // Listen to sync complete
    translationWorker.on(WorkerMessageType.SYNC_COMPLETE, () => {
      this.syncCompleteListeners.forEach((listener) => listener());
    });

    // Listen to data updates
    translationWorker.on(WorkerMessageType.DATA_UPDATED, (payload: { entity: string }) => {
      this.dataUpdatedListeners.forEach((listener) => listener(payload.entity));
    });

    // Listen to sync errors
    translationWorker.on(WorkerMessageType.SYNC_ERROR, (payload: { entity: string; error: string }) => {
      console.error(`[TranslationManager] Sync error for ${payload.entity}:`, payload.error);
    });
  }
}

// ----------------------------------------------------------------------

/**
 * Singleton instance
 */
export const TranslationManager = new TranslationManagerClass();
