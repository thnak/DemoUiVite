import axiosInstance from '../../axios-instance';

import type {
  SortType,
  DefectEntity,
  BooleanResult,
  DefectEntityResult,
  StringObjectKeyValuePair,
  DefectEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Defect Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Defect API endpoints
 */
export const DEFECT_ENDPOINTS = {
  getDefectById: '/api/defect/{id}',
  getDefectPage: '/api/defect/get-page',
  createDefect: '/api/defect/create',
  updateDefect: '/api/defect/update/{id}',
  deleteDefect: '/api/defect/delete/{id}',
  generateNewDefectCode: '/api/defect/generate-new-code',
} as const;

/**
 * Get Defect by ID
 *
 * Retrieves a specific Defect entity by its unique identifier.
 * @returns Promise<DefectEntity>
 */
export async function getDefectById(id: string): Promise<DefectEntity> {
  const response = await axiosInstance.get<DefectEntity>(`/api/defect/${id}`);
  return response.data;
}

/**
 * Get paginated list of Defect
 *
 * Retrieves a paginated list of Defect entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<DefectEntityBasePaginationResponse>
 */
export async function getDefectPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<DefectEntityBasePaginationResponse> {
  const response = await axiosInstance.post<DefectEntityBasePaginationResponse>(
    DEFECT_ENDPOINTS.getDefectPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Defect
 *
 * Creates a new Defect entity in the system.
 * @param data - Request body
 * @returns Promise<DefectEntityResult>
 */
export async function createDefect(data: DefectEntity): Promise<DefectEntityResult> {
  const response = await axiosInstance.post<DefectEntityResult>(
    DEFECT_ENDPOINTS.createDefect,
    data
  );
  return response.data;
}

/**
 * Update an existing Defect
 *
 * Updates specific fields of an existing Defect entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateDefect(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/defect/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Defect
 *
 * Deletes a Defect entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteDefect(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/defect/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Defect
 *
 * Generates a new unique code for a Defect entity.
 * @returns Promise<string>
 */
export async function generateNewDefectCode(): Promise<string> {
  const response = await axiosInstance.get<string>(DEFECT_ENDPOINTS.generateNewDefectCode);
  return response.data;
}
