/**
 * High-Performance Dynamic Translation System Types
 *
 * This module defines types for the worker-based translation system
 * that offloads translation storage and processing to IndexedDB and Web Workers.
 */

import type { EntityTranslationDto } from 'src/api/types/generated';

// ----------------------------------------------------------------------

/**
 * Supported entity types that have translations
 */
export type EntityType =
  | 'area'
  | 'calendar'
  | 'defectReason'
  | 'defectReasonGroup'
  | 'department'
  | 'informationDecoratorBase'
  | 'machineType'
  | 'machine'
  | 'productCategory'
  | 'product'
  | 'shift'
  | 'shiftTemplate'
  | 'stopMachineReason'
  | 'stopMachineReasonGroup'
  | 'timeBlockName'
  | 'unit'
  | 'unitConversion'
  | 'unitGroup'
  | 'workOrder';

/**
 * Worker message types for communication between main thread and worker
 */
export enum WorkerMessageType {
  // Initialization
  INIT = 'INIT',
  INIT_COMPLETE = 'INIT_COMPLETE',

  // Translation operations
  GET_TRANSLATION = 'GET_TRANSLATION',
  TRANSLATION_RESPONSE = 'TRANSLATION_RESPONSE',

  // Sync operations
  SYNC_ENTITY = 'SYNC_ENTITY',
  SYNC_ALL = 'SYNC_ALL',
  SYNC_PROGRESS = 'SYNC_PROGRESS',
  SYNC_COMPLETE = 'SYNC_COMPLETE',
  SYNC_ERROR = 'SYNC_ERROR',

  // Data updates
  DATA_UPDATED = 'DATA_UPDATED',

  // Configuration
  SET_CONFIG = 'SET_CONFIG',
}

/**
 * Worker message structure
 */
export interface WorkerMessage {
  type: WorkerMessageType;
  id?: string;
  payload?: any;
}

/**
 * Request to get a translation
 */
export interface GetTranslationRequest {
  entity: EntityType;
  entityId: string;
  lang: string;
}

/**
 * Response with translation content
 */
export interface TranslationResponse {
  entity: EntityType;
  entityId: string;
  lang: string;
  content: string | null;
  fromCache: boolean;
}

/**
 * Sync progress information
 */
export interface SyncProgress {
  entity: EntityType;
  status: 'pending' | 'syncing' | 'complete' | 'error';
  progress: number; // 0-100
  total?: number;
  current?: number;
  error?: string;
}

/**
 * ETag metadata for entity translations
 */
export interface EntityETagMetadata {
  entity: EntityType;
  etag: string | null;
  lastSync: number; // timestamp
}

/**
 * Translation storage key format: entity:entityId:lang
 */
export interface TranslationKey {
  entity: EntityType;
  entityId: string;
  lang: string;
}

/**
 * Configuration for the translation system
 */
export interface TranslationConfig {
  /** Polling interval in milliseconds (default: 30 minutes) */
  pollingInterval?: number;
  /** Enable/disable automatic background sync */
  autoSync?: boolean;
  /** Base API URL */
  baseUrl?: string;
}

/**
 * Converts TranslationKey to string key for IndexedDB
 */
export function translationKeyToString(key: TranslationKey): string {
  return `${key.entity}:${key.entityId}:${key.lang}`;
}

/**
 * Parses string key back to TranslationKey
 */
export function parseTranslationKey(key: string): TranslationKey | null {
  const parts = key.split(':');
  if (parts.length !== 3) return null;
  return {
    entity: parts[0] as EntityType,
    entityId: parts[1],
    lang: parts[2],
  };
}

/**
 * Converts EntityTranslationDto array to translation map
 */
export function convertTranslationDtoToMap(
  entity: EntityType,
  entityId: string,
  translations: EntityTranslationDto[]
): Map<string, string> {
  const map = new Map<string, string>();

  translations.forEach((dto) => {
    if (dto.key && dto.content) {
      const storageKey = translationKeyToString({
        entity,
        entityId,
        lang: dto.key,
      });
      map.set(storageKey, dto.content);
    }
  });

  return map;
}
