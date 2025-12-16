/**
 * Report Builder API Client
 *
 * Wrapper functions for the Report Builder API endpoints.
 * Uses the existing axios instance and API configuration.
 */

import type {
  ApiResult,
  EntityMetadata,
  ReportQuery,
  ReportResult,
  RelationshipMetadata,
} from 'src/types/report-builder';

import { axiosInstance } from './axios-instance';

// ----------------------------------------------------------------------

/**
 * Fetches complete metadata for all entities
 * Endpoint: GET /api/reports/metadata
 */
export async function fetchAllEntitiesMetadata(): Promise<EntityMetadata[]> {
  const response = await axiosInstance.get<ApiResult<EntityMetadata[]>>('/api/reports/metadata');

  if (!response.data.isSuccess || !response.data.value) {
    throw new Error(response.data.message || 'Failed to fetch metadata');
  }

  return response.data.value;
}

/**
 * Fetches metadata for a specific entity by name
 * Endpoint: GET /api/reports/metadata/{entityName}
 *
 * @param entityName - The entity name (e.g., "MachineEntity")
 */
export async function fetchEntityMetadata(entityName: string): Promise<EntityMetadata> {
  const response = await axiosInstance.get<ApiResult<EntityMetadata>>(
    `/api/reports/metadata/${entityName}`
  );

  if (!response.data.isSuccess || !response.data.value) {
    throw new Error(response.data.message || `Failed to fetch metadata for ${entityName}`);
  }

  return response.data.value;
}

/**
 * Fetches all relationships between entities
 * Endpoint: GET /api/reports/metadata/relationships
 */
export async function fetchRelationships(): Promise<RelationshipMetadata[]> {
  const response = await axiosInstance.get<ApiResult<RelationshipMetadata[]>>(
    '/api/reports/metadata/relationships'
  );

  if (!response.data.isSuccess || !response.data.value) {
    throw new Error(response.data.message || 'Failed to fetch relationships');
  }

  return response.data.value;
}

/**
 * Executes a report query and returns full data
 * Endpoint: POST /api/reports/query/data
 *
 * @param query - The report query to execute
 */
export async function executeQuery(query: ReportQuery): Promise<ReportResult> {
  const response = await axiosInstance.post<ApiResult<ReportResult>>(
    '/api/reports/query/data',
    query
  );

  if (!response.data.isSuccess || !response.data.value) {
    throw new Error(response.data.message || 'Failed to execute query');
  }

  return response.data.value;
}

/**
 * Executes a preview of the report query with limited results (10-20 rows)
 * Endpoint: POST /api/reports/query/preview
 *
 * @param query - The report query to preview
 */
export async function executeQueryPreview(query: ReportQuery): Promise<ReportResult> {
  const response = await axiosInstance.post<ApiResult<ReportResult>>(
    '/api/reports/query/preview',
    query
  );

  if (!response.data.isSuccess || !response.data.value) {
    throw new Error(response.data.message || 'Failed to execute preview query');
  }

  return response.data.value;
}

/**
 * Helper function to build a query from a table block
 * Converts UI block state to API query format
 */
export function buildQueryFromBlock(
  entityName: string,
  fields: string[],
  pageSize: number = 10,
  page: number = 1
): ReportQuery {
  return {
    sourceEntity: entityName,
    fields: fields.map((field) => ({
      field,
    })),
    page,
    pageSize,
  };
}
