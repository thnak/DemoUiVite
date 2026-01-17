import type {
  ReportQueryDto,
  ReportFieldDto,
  ReportFilterDto,
  ReportJoinDto,
  ReportSortDto,
  EntityMetadataDto,
  PropertyMetadataDto,
  RelationshipMetadataDto,
} from 'src/api/types/generated';

// ----------------------------------------------------------------------
// Report Builder Types
// ----------------------------------------------------------------------

/**
 * Saved report configuration with metadata
 */
export type SavedReport = {
  id: string;
  name: string;
  description?: string;
  query: ReportQueryDto;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  tags?: string[];
};

/**
 * Report builder UI state
 */
export type ReportBuilderState = {
  currentQuery: ReportQueryDto;
  selectedEntity?: EntityMetadataDto;
  availableEntities: EntityMetadataDto[];
  isDirty: boolean;
  isPreviewMode: boolean;
};

/**
 * Filter operator display info
 */
export type FilterOperatorInfo = {
  value: string;
  label: string;
  description: string;
  requiresValue: boolean;
  supportsMultiple: boolean;
};

/**
 * Join type display info
 */
export type JoinTypeInfo = {
  value: 'Inner' | 'Left';
  label: string;
  description: string;
  icon: string;
};

/**
 * Aggregation function info
 */
export type AggregationInfo = {
  value: string;
  label: string;
  description: string;
  supportedTypes: string[];
};

/**
 * Field selection with metadata
 */
export type FieldSelection = ReportFieldDto & {
  propertyMetadata?: PropertyMetadataDto;
  displayName?: string;
};

/**
 * Join configuration with metadata
 */
export type JoinConfiguration = ReportJoinDto & {
  relationshipMetadata?: RelationshipMetadataDto;
  targetEntityMetadata?: EntityMetadataDto;
};

/**
 * Filter configuration with metadata
 */
export type FilterConfiguration = ReportFilterDto & {
  propertyMetadata?: PropertyMetadataDto;
  displayName?: string;
};

/**
 * Query validation result
 */
export type QueryValidation = {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
};

/**
 * Report execution result with timing
 */
export type ReportExecutionResult = {
  data: Record<string, unknown>[];
  columns: string[];
  totalCount: number;
  executionTimeMs: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Re-export API types for convenience
export type {
  ReportQueryDto,
  ReportFieldDto,
  ReportFilterDto,
  ReportJoinDto,
  ReportSortDto,
  EntityMetadataDto,
  PropertyMetadataDto,
  RelationshipMetadataDto,
};
