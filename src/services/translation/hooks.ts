/**
 * React Hooks for Translation System
 * 
 * Provides React hooks for accessing entity translations.
 */

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { EntityType, SyncProgress } from './types';
import { TranslationManager } from './manager';
import { createTranslationService } from './base-service';

// ----------------------------------------------------------------------

/**
 * Hook to get entity translation
 * 
 * @param entity - Entity type
 * @param entityId - Entity ID
 * @returns Translated content or null
 */
export function useEntityTranslation(
  entity: EntityType,
  entityId: string | undefined
): string | null {
  const { i18n } = useTranslation();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!entityId) {
      setContent(null);
      return;
    }

    let mounted = true;
    setLoading(true);

    const service = createTranslationService(entity);
    
    service.get(entityId, i18n.language).then((result) => {
      if (mounted) {
        setContent(result);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [entity, entityId, i18n.language]);

  return loading ? null : content;
}

/**
 * Hook to sync translations
 * 
 * @returns Sync functions and state
 */
export function useTranslationSync() {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState<Map<EntityType, SyncProgress>>(new Map());

  useEffect(() => {
    // Listen to sync progress
    const unsubProgress = TranslationManager.onSyncProgress((prog) => {
      setProgress((prev) => {
        const next = new Map(prev);
        next.set(prog.entity, prog);
        return next;
      });

      // Check if all are complete
      if (prog.status === 'syncing') {
        setSyncing(true);
      }
    });

    // Listen to sync complete
    const unsubComplete = TranslationManager.onSyncComplete(() => {
      setSyncing(false);
      setProgress(new Map()); // Clear progress
    });

    return () => {
      unsubProgress();
      unsubComplete();
    };
  }, []);

  const syncAll = useCallback(() => {
    setSyncing(true);
    setProgress(new Map());
    TranslationManager.syncAll();
  }, []);

  return {
    syncing,
    progress: Array.from(progress.values()),
    syncAll,
  };
}

/**
 * Hook to listen to translation data updates
 * 
 * @param callback - Callback when translations are updated
 */
export function useTranslationUpdates(callback: (entity: string) => void) {
  useEffect(() => {
    const unsubscribe = TranslationManager.onDataUpdated(callback);
    return unsubscribe;
  }, [callback]);
}

/**
 * Hook to check translation system status
 * 
 * @returns Initialization status
 */
export function useTranslationSystem() {
  const [initialized, setInitialized] = useState(
    TranslationManager.isInitialized()
  );

  useEffect(() => {
    // Check if already initialized
    if (TranslationManager.isInitialized()) {
      setInitialized(true);
      return;
    }

    // Initialize if not already done
    TranslationManager.initialize().then(() => {
      setInitialized(true);
    }).catch((error) => {
      console.error('[useTranslationSystem] Initialization failed:', error);
    });
  }, []);

  return { initialized };
}
