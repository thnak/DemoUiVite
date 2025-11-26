import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BomLineEntity,
  BooleanResult,
  BomLineEntityResult,
  StringObjectKeyValuePair,
  BomLineEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// BomLine Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * BomLine API endpoints
 */
export const BOMLINE_ENDPOINTS = {
  getBomLineById: '/api/bomline/{id}',
  getBomLinePage: '/api/bomline/get-page',
  createBomLine: '/api/bomline/create',
  updateBomLine: '/api/bomline/update/{id}',
  deleteBomLine: '/api/bomline/delete/{id}',
  generateNewBomLineCode: '/api/bomline/generate-new-code',
} as const;

/**
 * Get Bom Line by ID
 *
 * Retrieves a specific Bom Line entity by its unique identifier.
 * @returns Promise<BomLineEntity>
 */
export async function getBomLineById(id: string): Promise<BomLineEntity> {
  const response = await axiosInstance.get<BomLineEntity>(`/api/bomline/${id}`);
  return response.data;
}

/**
 * Get paginated list of Bom Line
 *
 * Retrieves a paginated list of Bom Line entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<BomLineEntityBasePaginationResponse>
 */
export async function getBomLinePage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<BomLineEntityBasePaginationResponse> {
  const response = await axiosInstance.post<BomLineEntityBasePaginationResponse>(BOMLINE_ENDPOINTS.getBomLinePage, data, { params });
  return response.data;
}

/**
 * Create a new Bom Line
 *
 * Creates a new Bom Line entity in the system.
 * @param data - Request body
 * @returns Promise<BomLineEntityResult>
 */
export async function createBomLine(data: BomLineEntity): Promise<BomLineEntityResult> {
  const response = await axiosInstance.post<BomLineEntityResult>(BOMLINE_ENDPOINTS.createBomLine, data);
  return response.data;
}

/**
 * Update an existing Bom Line
 *
 * Updates specific fields of an existing Bom Line entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateBomLine(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/bomline/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Bom Line
 *
 * Deletes a Bom Line entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteBomLine(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/bomline/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Bom Line
 *
 * Generates a new unique code for a Bom Line entity.
 * @returns Promise<string>
 */
export async function generateNewBomLineCode(): Promise<string> {
  const response = await axiosInstance.get<string>(BOMLINE_ENDPOINTS.generateNewBomLineCode);
  return response.data;
}
