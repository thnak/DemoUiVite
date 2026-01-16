/**
 * Translation System Exports
 * 
 * High-Performance Dynamic Translation System with Web Workers and IndexedDB.
 */

// Types
export type {
  EntityType,
  TranslationConfig,
  SyncProgress,
  TranslationResponse,
  GetTranslationRequest,
  TranslationKey,
  EntityETagMetadata,
} from './types';

export { WorkerMessageType } from './types';

// Manager
export { TranslationManager } from './manager';

// Services
export { BaseTranslationService, createTranslationService } from './base-service';

export {
  AreaTranslationService,
  CalendarTranslationService,
  DefectReasonTranslationService,
  DefectReasonGroupTranslationService,
  DepartmentTranslationService,
  InformationDecoratorBaseTranslationService,
  MachineTypeTranslationService,
  MachineTranslationService,
  ProductCategoryTranslationService,
  ProductTranslationService,
  ShiftTranslationService,
  ShiftTemplateTranslationService,
  StopMachineReasonTranslationService,
  StopMachineReasonGroupTranslationService,
  TimeBlockNameTranslationService,
  UnitTranslationService,
  UnitConversionTranslationService,
  UnitGroupTranslationService,
  WorkOrderTranslationService,
} from './entity-services';

// Hooks
export {
  useEntityTranslation,
  useTranslationSync,
  useTranslationUpdates,
  useTranslationSystem,
} from './hooks';

// Storage utilities (for advanced usage)
export {
  getStorageStats,
  clearAllTranslations,
} from './storage';
