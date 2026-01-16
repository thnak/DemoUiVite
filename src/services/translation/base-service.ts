/**
 * Base Translation Service
 *
 * Provides translation lookup for entity-specific translations.
 * Each entity (Area, Product, etc.) extends this base class.
 */

import { translationWorker } from './worker-manager';

import type { EntityType } from './types';

// ----------------------------------------------------------------------

/**
 * Base Translation Service
 */
export class BaseTranslationService {
  protected entity: EntityType;

  constructor(entity: EntityType) {
    this.entity = entity;
  }

  /**
   * Get translation for an entity ID
   *
   * @param id - Entity ID
   * @param lang - Language code (optional, uses current i18next language if not provided)
   * @returns Promise resolving to translated content or null
   */
  async get(id: string, lang?: string): Promise<string | null> {
    // Use provided lang or get from i18next
    const language = lang || this.getCurrentLanguage();

    try {
      const content = await translationWorker.getTranslation(this.entity, id, language);
      return content;
    } catch (error) {
      console.error(`[${this.entity}TranslationService] Error getting translation:`, error);
      return null;
    }
  }

  /**
   * Sync translations for this entity
   */
  sync(): void {
    translationWorker.syncEntity(this.entity);
  }

  /**
   * Get current language from i18next
   */
  private getCurrentLanguage(): string {
    // Access i18next instance
    if (typeof window !== 'undefined' && (window as any).i18n) {
      return (window as any).i18n.language || 'en';
    }
    return 'en';
  }
}

// ----------------------------------------------------------------------

/**
 * Create entity-specific translation service
 */
export function createTranslationService(entity: EntityType): BaseTranslationService {
  return new BaseTranslationService(entity);
}
