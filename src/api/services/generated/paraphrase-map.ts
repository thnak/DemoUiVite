import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  ParaphraseMapEntity,
  ParaphraseMapEntityBasePaginationResponse,
  ParaphraseMapEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ParaphraseMap Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ParaphraseMap API endpoints
 */
export const PARAPHRASEMAP_ENDPOINTS = {
  getParaphraseMapById: '/api/paraphrasemap/{id}',
  getParaphraseMapPage: '/api/paraphrasemap/get-page',
  createParaphraseMap: '/api/paraphrasemap/create',
  updateParaphraseMap: '/api/paraphrasemap/update/{id}',
  deleteParaphraseMap: '/api/paraphrasemap/delete/{id}',
  generateNewParaphraseMapCode: '/api/paraphrasemap/generate-new-code',
} as const;

/**
 * Get Paraphrase Map by ID
 *
 * Retrieves a specific Paraphrase Map entity by its unique identifier.
 * @returns Promise<ParaphraseMapEntity>
 */
export async function getParaphraseMapById(id: string): Promise<ParaphraseMapEntity> {
  const response = await axiosInstance.get<ParaphraseMapEntity>(`/api/paraphrasemap/${id}`);
  return response.data;
}

/**
 * Get paginated list of Paraphrase Map
 *
 * Retrieves a paginated list of Paraphrase Map entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ParaphraseMapEntityBasePaginationResponse>
 */
export async function getParaphraseMapPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ParaphraseMapEntityBasePaginationResponse> {
  const response = await axiosInstance.post<ParaphraseMapEntityBasePaginationResponse>(PARAPHRASEMAP_ENDPOINTS.getParaphraseMapPage, data, { params });
  return response.data;
}

/**
 * Create a new Paraphrase Map
 *
 * Creates a new Paraphrase Map entity in the system.
 * @param data - Request body
 * @returns Promise<ParaphraseMapEntityResult>
 */
export async function createParaphraseMap(data: ParaphraseMapEntity): Promise<ParaphraseMapEntityResult> {
  const response = await axiosInstance.post<ParaphraseMapEntityResult>(PARAPHRASEMAP_ENDPOINTS.createParaphraseMap, data);
  return response.data;
}

/**
 * Update an existing Paraphrase Map
 *
 * Updates specific fields of an existing Paraphrase Map entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateParaphraseMap(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/paraphrasemap/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Paraphrase Map
 *
 * Deletes a Paraphrase Map entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteParaphraseMap(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/paraphrasemap/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Paraphrase Map
 *
 * Generates a new unique code for a Paraphrase Map entity.
 * @returns Promise<string>
 */
export async function generateNewParaphraseMapCode(): Promise<string> {
  const response = await axiosInstance.get<string>(PARAPHRASEMAP_ENDPOINTS.generateNewParaphraseMapCode);
  return response.data;
}
