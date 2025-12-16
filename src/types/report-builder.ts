/**
 * Report Builder Types
 *
 * Type definitions for the Report Builder Canvas UI.
 * These types align with the backend API schemas from the OpenAPI spec.
 */

// ----------------------------------------------------------------------
// API Types (aligned with backend DTOs)
// ----------------------------------------------------------------------

/**
 * Entity metadata from the API
 */
export interface EntityMetadata {
  entityName: string;
  displayName: string;
  description?: string;
  category?: string;
  collectionName?: string;
  clrTypeName?: string;
  properties: PropertyMetadata[];
  relationships?: RelationshipMetadata[];
  isAvailable: boolean;
}

/**
 * Property metadata for entity fields
 */
export interface PropertyMetadata {
  propertyName: string;
  displayName: string;
  description?: string;
  clrTypeName?: string;
  typeName: string; // String, Int32, DateTime, Boolean, etc.
  isNullable: boolean;
  isCollection: boolean;
  filterable: boolean;
  sortable: boolean;
  groupable: boolean;
  aggregatable: boolean;
}

/**
 * Relationship metadata between entities
 */
export interface RelationshipMetadata {
  relationshipName?: string;
  relatedEntity: string;
  relationType: string; // OneToOne, OneToMany, ManyToOne, ManyToMany
  foreignKey?: string;
  inverseProperty?: string;
}

/**
 * Report query field
 */
export interface ReportField {
  field: string; // Can include entity prefix like "Entity.Field"
  alias?: string;
  aggregation?: string; // Sum, Avg, Count, Min, Max
}

/**
 * Report filter condition
 */
export interface ReportFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  logicalOperator?: 'And' | 'Or';
}

/**
 * Filter operators
 */
export type FilterOperator =
  | 'Equals'
  | 'NotEquals'
  | 'Contains'
  | 'NotContains'
  | 'StartsWith'
  | 'EndsWith'
  | 'GreaterThan'
  | 'GreaterThanOrEqual'
  | 'LessThan'
  | 'LessThanOrEqual'
  | 'In'
  | 'NotIn'
  | 'Between'
  | 'IsNull'
  | 'IsNotNull';

/**
 * Report join
 */
export interface ReportJoin {
  joinEntity: string;
  joinType?: 'Inner' | 'Left' | 'Right' | 'FullOuter';
  onConditions?: Array<{
    leftField: string;
    rightField: string;
    operator?: string;
  }>;
}

/**
 * Report sort
 */
export interface ReportSort {
  field: string;
  direction: 'Asc' | 'Desc';
}

/**
 * Complete report query (aligned with ReportQueryDto)
 */
export interface ReportQuery {
  sourceEntity: string;
  fields: ReportField[];
  filters?: ReportFilter[];
  joins?: ReportJoin[];
  sorts?: ReportSort[];
  groupBy?: string[];
  page?: number;
  pageSize?: number;
  limit?: number;
}

/**
 * Report result from API (aligned with ReportResultDto)
 */
export interface ReportResult {
  data: Array<Record<string, any>>;
  columns: string[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * API Result wrapper
 */
export interface ApiResult<T> {
  value: T | null;
  isSuccess: boolean;
  message?: string;
  errorType?: string;
}

// ----------------------------------------------------------------------
// Canvas Block Types
// ----------------------------------------------------------------------

/**
 * Base block type
 */
export interface BaseBlock {
  id: string;
  type: 'table' | 'chart';
  title?: string;
  fields: string[]; // Field names to display
}

/**
 * Table block
 */
export interface TableBlock extends BaseBlock {
  type: 'table';
  pageSize: number;
}

/**
 * Chart block
 */
export interface ChartBlock extends BaseBlock {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'area';
  xAxis?: string;
  yAxis?: string;
  aggregation?: 'Sum' | 'Avg' | 'Count' | 'Min' | 'Max';
}

/**
 * Union type for all blocks
 */
export type Block = TableBlock | ChartBlock;

/**
 * Canvas definition
 */
export interface CanvasDefinition {
  entityName: string;
  blocks: Block[];
  globalFilters?: ReportFilter[];
}

/**
 * Saved report definition
 */
export interface SavedReport extends CanvasDefinition {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
