import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  ChildWidgetConfigEntity,
  ChildWidgetConfigEntityBasePaginationResponse,
  ChildWidgetConfigEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ChildWidgetConfig Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ChildWidgetConfig API endpoints
 */
export const CHILDWIDGETCONFIG_ENDPOINTS = {
  getChildWidgetConfigById: '/api/childwidgetconfig/{id}',
  getChildWidgetConfigPage: '/api/childwidgetconfig/get-page',
  createChildWidgetConfig: '/api/childwidgetconfig/create',
  updateChildWidgetConfig: '/api/childwidgetconfig/update/{id}',
  deleteChildWidgetConfig: '/api/childwidgetconfig/delete/{id}',
  generateNewChildWidgetConfigCode: '/api/childwidgetconfig/generate-new-code',
} as const;

/**
 * Get Child Widget Config by ID
 *
 * Retrieves a specific Child Widget Config entity by its unique identifier.
 * @returns Promise<ChildWidgetConfigEntity>
 */
export async function getChildWidgetConfigById(id: string): Promise<ChildWidgetConfigEntity> {
  const response = await axiosInstance.get<ChildWidgetConfigEntity>(`/api/childwidgetconfig/${id}`);
  return response.data;
}

/**
 * Get paginated list of Child Widget Config
 *
 * Retrieves a paginated list of Child Widget Config entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ChildWidgetConfigEntityBasePaginationResponse>
 */
export async function getChildWidgetConfigPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ChildWidgetConfigEntityBasePaginationResponse> {
  const response = await axiosInstance.post<ChildWidgetConfigEntityBasePaginationResponse>(CHILDWIDGETCONFIG_ENDPOINTS.getChildWidgetConfigPage, data, { params });
  return response.data;
}

/**
 * Create a new Child Widget Config
 *
 * Creates a new Child Widget Config entity in the system.
 * @param data - Request body
 * @returns Promise<ChildWidgetConfigEntityResult>
 */
export async function createChildWidgetConfig(data: ChildWidgetConfigEntity): Promise<ChildWidgetConfigEntityResult> {
  const response = await axiosInstance.post<ChildWidgetConfigEntityResult>(CHILDWIDGETCONFIG_ENDPOINTS.createChildWidgetConfig, data);
  return response.data;
}

/**
 * Update an existing Child Widget Config
 *
 * Updates specific fields of an existing Child Widget Config entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateChildWidgetConfig(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/childwidgetconfig/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Child Widget Config
 *
 * Deletes a Child Widget Config entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteChildWidgetConfig(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/childwidgetconfig/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Child Widget Config
 *
 * Generates a new unique code for a Child Widget Config entity.
 * @returns Promise<string>
 */
export async function generateNewChildWidgetConfigCode(): Promise<string> {
  const response = await axiosInstance.get<string>(CHILDWIDGETCONFIG_ENDPOINTS.generateNewChildWidgetConfigCode);
  return response.data;
}
