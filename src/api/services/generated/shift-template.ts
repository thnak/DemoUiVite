import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  ShiftTemplateEntity,
  ShiftTemplateEntityBasePaginationResponse,
  ShiftTemplateEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ShiftTemplate Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ShiftTemplate API endpoints
 */
export const SHIFTTEMPLATE_ENDPOINTS = {
  getShiftTemplateById: '/api/shifttemplate/{id}',
  getShiftTemplatePage: '/api/shifttemplate/get-page',
  createShiftTemplate: '/api/shifttemplate/create',
  updateShiftTemplate: '/api/shifttemplate/update/{id}',
  deleteShiftTemplate: '/api/shifttemplate/delete/{id}',
  generateNewShiftTemplateCode: '/api/shifttemplate/generate-new-code',
  searchShiftTemplate: '/api/shifttemplate/search',
} as const;

/**
 * Get Shift Template by ID
 *
 * Retrieves a specific Shift Template entity by its unique identifier.
 * @returns Promise<ShiftTemplateEntity>
 */
export async function getShiftTemplateById(id: string): Promise<ShiftTemplateEntity> {
  const response = await axiosInstance.get<ShiftTemplateEntity>(`/api/shifttemplate/${id}`);
  return response.data;
}

/**
 * Get paginated list of Shift Template
 *
 * Retrieves a paginated list of Shift Template entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ShiftTemplateEntityBasePaginationResponse>
 */
export async function getShiftTemplatePage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ShiftTemplateEntityBasePaginationResponse> {
  const response = await axiosInstance.post<ShiftTemplateEntityBasePaginationResponse>(SHIFTTEMPLATE_ENDPOINTS.getShiftTemplatePage, data, { params });
  return response.data;
}

/**
 * Create a new Shift Template
 *
 * Creates a new Shift Template entity in the system.
 * @param data - Request body
 * @returns Promise<ShiftTemplateEntityResult>
 */
export async function createShiftTemplate(data: ShiftTemplateEntity): Promise<ShiftTemplateEntityResult> {
  const response = await axiosInstance.post<ShiftTemplateEntityResult>(SHIFTTEMPLATE_ENDPOINTS.createShiftTemplate, data);
  return response.data;
}

/**
 * Update an existing Shift Template
 *
 * Updates specific fields of an existing Shift Template entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateShiftTemplate(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/shifttemplate/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Shift Template
 *
 * Deletes a Shift Template entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteShiftTemplate(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/shifttemplate/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Shift Template
 *
 * Generates a new unique code for a Shift Template entity.
 * @returns Promise<string>
 */
export async function generateNewShiftTemplateCode(): Promise<string> {
  const response = await axiosInstance.get<string>(SHIFTTEMPLATE_ENDPOINTS.generateNewShiftTemplateCode);
  return response.data;
}

/**
 * Search Shift Template entities
 *
 * Searches Shift Template entities by text across searchable fields.
 * @returns Promise<ShiftTemplateEntity[]>
 */
export async function searchShiftTemplate(params?: { searchText?: string; maxResults?: number }): Promise<ShiftTemplateEntity[]> {
  const response = await axiosInstance.get<ShiftTemplateEntity[]>(SHIFTTEMPLATE_ENDPOINTS.searchShiftTemplate, { params });
  return response.data;
}
