import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  QualityCheckPointEntity,
  StringObjectKeyValuePair,
  QualityCheckPointEntityResult,
  QualityCheckPointEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// QualityCheckPoint Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * QualityCheckPoint API endpoints
 */
export const QUALITYCHECKPOINT_ENDPOINTS = {
  getQualityCheckPointById: '/api/qualitycheckpoint/{id}',
  getQualityCheckPointPage: '/api/qualitycheckpoint/get-page',
  createQualityCheckPoint: '/api/qualitycheckpoint/create',
  updateQualityCheckPoint: '/api/qualitycheckpoint/update/{id}',
  deleteQualityCheckPoint: '/api/qualitycheckpoint/delete/{id}',
  generateNewQualityCheckPointCode: '/api/qualitycheckpoint/generate-new-code',
} as const;

/**
 * Get Quality Check Point by ID
 *
 * Retrieves a specific Quality Check Point entity by its unique identifier.
 * @returns Promise<QualityCheckPointEntity>
 */
export async function getQualityCheckPointById(id: string): Promise<QualityCheckPointEntity> {
  const response = await axiosInstance.get<QualityCheckPointEntity>(`/api/qualitycheckpoint/${id}`);
  return response.data;
}

/**
 * Get paginated list of Quality Check Point
 *
 * Retrieves a paginated list of Quality Check Point entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<QualityCheckPointEntityBasePaginationResponse>
 */
export async function getQualityCheckPointPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<QualityCheckPointEntityBasePaginationResponse> {
  const response = await axiosInstance.post<QualityCheckPointEntityBasePaginationResponse>(QUALITYCHECKPOINT_ENDPOINTS.getQualityCheckPointPage, data, { params });
  return response.data;
}

/**
 * Create a new Quality Check Point
 *
 * Creates a new Quality Check Point entity in the system.
 * @param data - Request body
 * @returns Promise<QualityCheckPointEntityResult>
 */
export async function createQualityCheckPoint(data: QualityCheckPointEntity): Promise<QualityCheckPointEntityResult> {
  const response = await axiosInstance.post<QualityCheckPointEntityResult>(QUALITYCHECKPOINT_ENDPOINTS.createQualityCheckPoint, data);
  return response.data;
}

/**
 * Update an existing Quality Check Point
 *
 * Updates specific fields of an existing Quality Check Point entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateQualityCheckPoint(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/qualitycheckpoint/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Quality Check Point
 *
 * Deletes a Quality Check Point entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteQualityCheckPoint(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/qualitycheckpoint/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Quality Check Point
 *
 * Generates a new unique code for a Quality Check Point entity.
 * @returns Promise<string>
 */
export async function generateNewQualityCheckPointCode(): Promise<string> {
  const response = await axiosInstance.get<string>(QUALITYCHECKPOINT_ENDPOINTS.generateNewQualityCheckPointCode);
  return response.data;
}
