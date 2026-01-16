/**
 * Translation System Exports
 *
 * High-Performance Dynamic Translation System with Web Workers and IndexedDB.
 */

export { WorkerMessageType } from './types';

// Manager
export { TranslationManager } from './manager';

// Storage utilities (for advanced usage)
export { getStorageStats, clearAllTranslations } from './storage';

// Services
export { BaseTranslationService, createTranslationService } from './base-service';

// Hooks
export {
  useTranslationSync,
  useEntityTranslation,
  useTranslationSystem,
  useTranslationUpdates,
} from './hooks';

export {
  AreaTranslationService,
  UnitTranslationService,
  ShiftTranslationService,
  MachineTranslationService,
  ProductTranslationService,
  CalendarTranslationService,
  UnitGroupTranslationService,
  WorkOrderTranslationService,
  DepartmentTranslationService,
  MachineTypeTranslationService,
  DefectReasonTranslationService,
  ShiftTemplateTranslationService,
  TimeBlockNameTranslationService,
  UnitConversionTranslationService,
  ProductCategoryTranslationService,
  DefectReasonGroupTranslationService,
  StopMachineReasonTranslationService,
  StopMachineReasonGroupTranslationService,
  InformationDecoratorBaseTranslationService,
} from './entity-services';

// Types
export type {
  EntityType,
  SyncProgress,
  TranslationKey,
  TranslationConfig,
  EntityETagMetadata,
  TranslationResponse,
  GetTranslationRequest,
} from './types';
