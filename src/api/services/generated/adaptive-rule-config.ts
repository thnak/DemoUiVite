import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  AdaptiveRuleConfigEntity,
  StringObjectKeyValuePair,
  AdaptiveRuleConfigEntityResult,
  AdaptiveRuleConfigEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// AdaptiveRuleConfig Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * AdaptiveRuleConfig API endpoints
 */
export const ADAPTIVERULECONFIG_ENDPOINTS = {
  getAdaptiveRuleConfigById: '/api/adaptiveruleconfig/{id}',
  getAdaptiveRuleConfigPage: '/api/adaptiveruleconfig/get-page',
  createAdaptiveRuleConfig: '/api/adaptiveruleconfig/create',
  updateAdaptiveRuleConfig: '/api/adaptiveruleconfig/update/{id}',
  deleteAdaptiveRuleConfig: '/api/adaptiveruleconfig/delete/{id}',
  generateNewAdaptiveRuleConfigCode: '/api/adaptiveruleconfig/generate-new-code',
} as const;

/**
 * Get Adaptive Rule Config by ID
 *
 * Retrieves a specific Adaptive Rule Config entity by its unique identifier.
 * @returns Promise<AdaptiveRuleConfigEntity>
 */
export async function getAdaptiveRuleConfigById(id: string): Promise<AdaptiveRuleConfigEntity> {
  const response = await axiosInstance.get<AdaptiveRuleConfigEntity>(
    `/api/adaptiveruleconfig/${id}`
  );
  return response.data;
}

/**
 * Get paginated list of Adaptive Rule Config
 *
 * Retrieves a paginated list of Adaptive Rule Config entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<AdaptiveRuleConfigEntityBasePaginationResponse>
 */
export async function getAdaptiveRuleConfigPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<AdaptiveRuleConfigEntityBasePaginationResponse> {
  const response = await axiosInstance.post<AdaptiveRuleConfigEntityBasePaginationResponse>(
    ADAPTIVERULECONFIG_ENDPOINTS.getAdaptiveRuleConfigPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Adaptive Rule Config
 *
 * Creates a new Adaptive Rule Config entity in the system.
 * @param data - Request body
 * @returns Promise<AdaptiveRuleConfigEntityResult>
 */
export async function createAdaptiveRuleConfig(
  data: AdaptiveRuleConfigEntity
): Promise<AdaptiveRuleConfigEntityResult> {
  const response = await axiosInstance.post<AdaptiveRuleConfigEntityResult>(
    ADAPTIVERULECONFIG_ENDPOINTS.createAdaptiveRuleConfig,
    data
  );
  return response.data;
}

/**
 * Update an existing Adaptive Rule Config
 *
 * Updates specific fields of an existing Adaptive Rule Config entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateAdaptiveRuleConfig(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/adaptiveruleconfig/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a Adaptive Rule Config
 *
 * Deletes a Adaptive Rule Config entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteAdaptiveRuleConfig(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(
    `/api/adaptiveruleconfig/delete/${id}`
  );
  return response.data;
}

/**
 * Generate a new code for Adaptive Rule Config
 *
 * Generates a new unique code for a Adaptive Rule Config entity.
 * @returns Promise<string>
 */
export async function generateNewAdaptiveRuleConfigCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    ADAPTIVERULECONFIG_ENDPOINTS.generateNewAdaptiveRuleConfigCode
  );
  return response.data;
}
