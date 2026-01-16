/**
 * Entity-Specific Translation Services
 *
 * Pre-configured translation services for each entity type.
 */

import { createTranslationService } from './base-service';

// ----------------------------------------------------------------------

/**
 * Area Translation Service
 */
export const AreaTranslationService = createTranslationService('area');

/**
 * Calendar Translation Service
 */
export const CalendarTranslationService = createTranslationService('calendar');

/**
 * Defect Reason Translation Service
 */
export const DefectReasonTranslationService = createTranslationService('defectReason');

/**
 * Defect Reason Group Translation Service
 */
export const DefectReasonGroupTranslationService = createTranslationService('defectReasonGroup');

/**
 * Department Translation Service
 */
export const DepartmentTranslationService = createTranslationService('department');

/**
 * Information Decorator Base Translation Service
 */
export const InformationDecoratorBaseTranslationService = createTranslationService(
  'informationDecoratorBase'
);

/**
 * Machine Type Translation Service
 */
export const MachineTypeTranslationService = createTranslationService('machineType');

/**
 * Machine Translation Service
 */
export const MachineTranslationService = createTranslationService('machine');

/**
 * Product Category Translation Service
 */
export const ProductCategoryTranslationService = createTranslationService('productCategory');

/**
 * Product Translation Service
 */
export const ProductTranslationService = createTranslationService('product');

/**
 * Shift Translation Service
 */
export const ShiftTranslationService = createTranslationService('shift');

/**
 * Shift Template Translation Service
 */
export const ShiftTemplateTranslationService = createTranslationService('shiftTemplate');

/**
 * Stop Machine Reason Translation Service
 */
export const StopMachineReasonTranslationService = createTranslationService('stopMachineReason');

/**
 * Stop Machine Reason Group Translation Service
 */
export const StopMachineReasonGroupTranslationService =
  createTranslationService('stopMachineReasonGroup');

/**
 * Time Block Name Translation Service
 */
export const TimeBlockNameTranslationService = createTranslationService('timeBlockName');

/**
 * Unit Translation Service
 */
export const UnitTranslationService = createTranslationService('unit');

/**
 * Unit Conversion Translation Service
 */
export const UnitConversionTranslationService = createTranslationService('unitConversion');

/**
 * Unit Group Translation Service
 */
export const UnitGroupTranslationService = createTranslationService('unitGroup');

/**
 * Work Order Translation Service
 */
export const WorkOrderTranslationService = createTranslationService('workOrder');
