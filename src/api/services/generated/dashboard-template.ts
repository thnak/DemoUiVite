import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  DashboardTemplateEntity,
  DashboardTemplateEntityBasePaginationResponse,
  DashboardTemplateEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DashboardTemplate Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * DashboardTemplate API endpoints
 */
export const DASHBOARDTEMPLATE_ENDPOINTS = {
  getDashboardTemplateById: '/api/dashboardtemplate/{id}',
  getDashboardTemplatePage: '/api/dashboardtemplate/get-page',
  createDashboardTemplate: '/api/dashboardtemplate/create',
  updateDashboardTemplate: '/api/dashboardtemplate/update/{id}',
  deleteDashboardTemplate: '/api/dashboardtemplate/delete/{id}',
  generateNewDashboardTemplateCode: '/api/dashboardtemplate/generate-new-code',
} as const;

/**
 * Get Dashboard Template by ID
 *
 * Retrieves a specific Dashboard Template entity by its unique identifier.
 * @returns Promise<DashboardTemplateEntity>
 */
export async function getDashboardTemplateById(id: string): Promise<DashboardTemplateEntity> {
  const response = await axiosInstance.get<DashboardTemplateEntity>(`/api/dashboardtemplate/${id}`);
  return response.data;
}

/**
 * Get paginated list of Dashboard Template
 *
 * Retrieves a paginated list of Dashboard Template entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<DashboardTemplateEntityBasePaginationResponse>
 */
export async function getDashboardTemplatePage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<DashboardTemplateEntityBasePaginationResponse> {
  const response = await axiosInstance.post<DashboardTemplateEntityBasePaginationResponse>(DASHBOARDTEMPLATE_ENDPOINTS.getDashboardTemplatePage, data, { params });
  return response.data;
}

/**
 * Create a new Dashboard Template
 *
 * Creates a new Dashboard Template entity in the system.
 * @param data - Request body
 * @returns Promise<DashboardTemplateEntityResult>
 */
export async function createDashboardTemplate(data: DashboardTemplateEntity): Promise<DashboardTemplateEntityResult> {
  const response = await axiosInstance.post<DashboardTemplateEntityResult>(DASHBOARDTEMPLATE_ENDPOINTS.createDashboardTemplate, data);
  return response.data;
}

/**
 * Update an existing Dashboard Template
 *
 * Updates specific fields of an existing Dashboard Template entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateDashboardTemplate(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/dashboardtemplate/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Dashboard Template
 *
 * Deletes a Dashboard Template entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteDashboardTemplate(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/dashboardtemplate/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Dashboard Template
 *
 * Generates a new unique code for a Dashboard Template entity.
 * @returns Promise<string>
 */
export async function generateNewDashboardTemplateCode(): Promise<string> {
  const response = await axiosInstance.get<string>(DASHBOARDTEMPLATE_ENDPOINTS.generateNewDashboardTemplateCode);
  return response.data;
}
