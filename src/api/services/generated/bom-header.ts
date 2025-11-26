import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  BomHeaderEntity,
  BomHeaderEntityResult,
  StringObjectKeyValuePair,
  BomHeaderEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// BomHeader Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * BomHeader API endpoints
 */
export const BOMHEADER_ENDPOINTS = {
  getBomHeaderById: '/api/bomheader/{id}',
  getBomHeaderPage: '/api/bomheader/get-page',
  createBomHeader: '/api/bomheader/create',
  updateBomHeader: '/api/bomheader/update/{id}',
  deleteBomHeader: '/api/bomheader/delete/{id}',
  generateNewBomHeaderCode: '/api/bomheader/generate-new-code',
} as const;

/**
 * Get Bom Header by ID
 *
 * Retrieves a specific Bom Header entity by its unique identifier.
 * @returns Promise<BomHeaderEntity>
 */
export async function getBomHeaderById(id: string): Promise<BomHeaderEntity> {
  const response = await axiosInstance.get<BomHeaderEntity>(`/api/bomheader/${id}`);
  return response.data;
}

/**
 * Get paginated list of Bom Header
 *
 * Retrieves a paginated list of Bom Header entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<BomHeaderEntityBasePaginationResponse>
 */
export async function getBomHeaderPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<BomHeaderEntityBasePaginationResponse> {
  const response = await axiosInstance.post<BomHeaderEntityBasePaginationResponse>(BOMHEADER_ENDPOINTS.getBomHeaderPage, data, { params });
  return response.data;
}

/**
 * Create a new Bom Header
 *
 * Creates a new Bom Header entity in the system.
 * @param data - Request body
 * @returns Promise<BomHeaderEntityResult>
 */
export async function createBomHeader(data: BomHeaderEntity): Promise<BomHeaderEntityResult> {
  const response = await axiosInstance.post<BomHeaderEntityResult>(BOMHEADER_ENDPOINTS.createBomHeader, data);
  return response.data;
}

/**
 * Update an existing Bom Header
 *
 * Updates specific fields of an existing Bom Header entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateBomHeader(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/bomheader/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Bom Header
 *
 * Deletes a Bom Header entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteBomHeader(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/bomheader/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Bom Header
 *
 * Generates a new unique code for a Bom Header entity.
 * @returns Promise<string>
 */
export async function generateNewBomHeaderCode(): Promise<string> {
  const response = await axiosInstance.get<string>(BOMHEADER_ENDPOINTS.generateNewBomHeaderCode);
  return response.data;
}
