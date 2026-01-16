/**
 * IndexedDB Storage Layer for Translation System
 * 
 * Uses idb-keyval for simple, fast IndexedDB operations.
 * Stores translations and ETag metadata for efficient caching.
 */

import { get, set, del, keys, clear } from 'idb-keyval';

import type { EntityType, EntityETagMetadata } from './types';

// ----------------------------------------------------------------------

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  ETAG_PREFIX: 'etag:',
  TRANSLATION_PREFIX: '', // translations stored with entity:id:lang directly
} as const;

/**
 * Get ETag metadata for an entity
 */
export async function getEntityETag(entity: EntityType): Promise<EntityETagMetadata | null> {
  try {
    const key = `${STORAGE_KEYS.ETAG_PREFIX}${entity}`;
    const data = await get<EntityETagMetadata>(key);
    return data || null;
  } catch (error) {
    console.error(`Failed to get ETag for ${entity}:`, error);
    return null;
  }
}

/**
 * Set ETag metadata for an entity
 */
export async function setEntityETag(
  entity: EntityType,
  etag: string | null
): Promise<void> {
  try {
    const key = `${STORAGE_KEYS.ETAG_PREFIX}${entity}`;
    const metadata: EntityETagMetadata = {
      entity,
      etag,
      lastSync: Date.now(),
    };
    await set(key, metadata);
  } catch (error) {
    console.error(`Failed to set ETag for ${entity}:`, error);
  }
}

/**
 * Get a single translation by key
 */
export async function getTranslation(key: string): Promise<string | null> {
  try {
    const content = await get<string>(key);
    return content || null;
  } catch (error) {
    console.error(`Failed to get translation for ${key}:`, error);
    return null;
  }
}

/**
 * Set a single translation
 */
export async function setTranslation(key: string, content: string): Promise<void> {
  try {
    await set(key, content);
  } catch (error) {
    console.error(`Failed to set translation for ${key}:`, error);
  }
}

/**
 * Batch set translations
 */
export async function setTranslations(translations: Map<string, string>): Promise<void> {
  try {
    const promises = Array.from(translations.entries()).map(([key, content]) =>
      set(key, content)
    );
    await Promise.all(promises);
  } catch (error) {
    console.error('Failed to batch set translations:', error);
  }
}

/**
 * Delete translations for a specific entity
 */
export async function deleteEntityTranslations(entity: EntityType): Promise<void> {
  try {
    const allKeys = await keys();
    const entityKeys = allKeys.filter((key) => 
      typeof key === 'string' && key.startsWith(`${entity}:`)
    );
    
    const promises = entityKeys.map((key) => del(key));
    await Promise.all(promises);
  } catch (error) {
    console.error(`Failed to delete translations for ${entity}:`, error);
  }
}

/**
 * Clear all translation data (for debugging/reset)
 */
export async function clearAllTranslations(): Promise<void> {
  try {
    await clear();
  } catch (error) {
    console.error('Failed to clear all translations:', error);
  }
}

/**
 * Get all translation keys for an entity
 */
export async function getEntityTranslationKeys(entity: EntityType): Promise<string[]> {
  try {
    const allKeys = await keys();
    return allKeys.filter(
      (key) => typeof key === 'string' && key.startsWith(`${entity}:`)
    ) as string[];
  } catch (error) {
    console.error(`Failed to get translation keys for ${entity}:`, error);
    return [];
  }
}

/**
 * Check if translation exists
 */
export async function hasTranslation(key: string): Promise<boolean> {
  try {
    const content = await get<string>(key);
    return content !== undefined;
  } catch (error) {
    console.error(`Failed to check translation existence for ${key}:`, error);
    return false;
  }
}

/**
 * Get storage statistics
 */
export async function getStorageStats(): Promise<{
  totalKeys: number;
  translationKeys: number;
  etagKeys: number;
}> {
  try {
    const allKeys = await keys();
    const translationKeys = allKeys.filter(
      (key) => typeof key === 'string' && !key.startsWith(STORAGE_KEYS.ETAG_PREFIX)
    );
    const etagKeys = allKeys.filter(
      (key) => typeof key === 'string' && key.startsWith(STORAGE_KEYS.ETAG_PREFIX)
    );

    return {
      totalKeys: allKeys.length,
      translationKeys: translationKeys.length,
      etagKeys: etagKeys.length,
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return { totalKeys: 0, translationKeys: 0, etagKeys: 0 };
  }
}
