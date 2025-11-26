import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  WidgetConfigEntity,
  StringObjectKeyValuePair,
  WidgetConfigEntityResult,
  WidgetConfigEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// WidgetConfig Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * WidgetConfig API endpoints
 */
export const WIDGETCONFIG_ENDPOINTS = {
  getWidgetConfigById: '/api/widgetconfig/{id}',
  getWidgetConfigPage: '/api/widgetconfig/get-page',
  createWidgetConfig: '/api/widgetconfig/create',
  updateWidgetConfig: '/api/widgetconfig/update/{id}',
  deleteWidgetConfig: '/api/widgetconfig/delete/{id}',
  generateNewWidgetConfigCode: '/api/widgetconfig/generate-new-code',
} as const;

/**
 * Get Widget Config by ID
 *
 * Retrieves a specific Widget Config entity by its unique identifier.
 * @returns Promise<WidgetConfigEntity>
 */
export async function getWidgetConfigById(id: string): Promise<WidgetConfigEntity> {
  const response = await axiosInstance.get<WidgetConfigEntity>(`/api/widgetconfig/${id}`);
  return response.data;
}

/**
 * Get paginated list of Widget Config
 *
 * Retrieves a paginated list of Widget Config entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<WidgetConfigEntityBasePaginationResponse>
 */
export async function getWidgetConfigPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<WidgetConfigEntityBasePaginationResponse> {
  const response = await axiosInstance.post<WidgetConfigEntityBasePaginationResponse>(
    WIDGETCONFIG_ENDPOINTS.getWidgetConfigPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Widget Config
 *
 * Creates a new Widget Config entity in the system.
 * @param data - Request body
 * @returns Promise<WidgetConfigEntityResult>
 */
export async function createWidgetConfig(
  data: WidgetConfigEntity
): Promise<WidgetConfigEntityResult> {
  const response = await axiosInstance.post<WidgetConfigEntityResult>(
    WIDGETCONFIG_ENDPOINTS.createWidgetConfig,
    data
  );
  return response.data;
}

/**
 * Update an existing Widget Config
 *
 * Updates specific fields of an existing Widget Config entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateWidgetConfig(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/widgetconfig/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Widget Config
 *
 * Deletes a Widget Config entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteWidgetConfig(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/widgetconfig/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Widget Config
 *
 * Generates a new unique code for a Widget Config entity.
 * @returns Promise<string>
 */
export async function generateNewWidgetConfigCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    WIDGETCONFIG_ENDPOINTS.generateNewWidgetConfigCode
  );
  return response.data;
}
