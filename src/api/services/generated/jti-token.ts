import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  JtiTokenEntity,
  JtiTokenEntityResult,
  StringObjectKeyValuePair,
  JtiTokenEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// JtiToken Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * JtiToken API endpoints
 */
export const JTITOKEN_ENDPOINTS = {
  getJtiTokenById: '/api/jtitoken/{id}',
  getJtiTokenPage: '/api/jtitoken/get-page',
  createJtiToken: '/api/jtitoken/create',
  updateJtiToken: '/api/jtitoken/update/{id}',
  deleteJtiToken: '/api/jtitoken/delete/{id}',
  generateNewJtiTokenCode: '/api/jtitoken/generate-new-code',
} as const;

/**
 * Get Jti Token by ID
 *
 * Retrieves a specific Jti Token entity by its unique identifier.
 * @returns Promise<JtiTokenEntity>
 */
export async function getJtiTokenById(id: string): Promise<JtiTokenEntity> {
  const response = await axiosInstance.get<JtiTokenEntity>(`/api/jtitoken/${id}`);
  return response.data;
}

/**
 * Get paginated list of Jti Token
 *
 * Retrieves a paginated list of Jti Token entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<JtiTokenEntityBasePaginationResponse>
 */
export async function getJtiTokenPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<JtiTokenEntityBasePaginationResponse> {
  const response = await axiosInstance.post<JtiTokenEntityBasePaginationResponse>(JTITOKEN_ENDPOINTS.getJtiTokenPage, data, { params });
  return response.data;
}

/**
 * Create a new Jti Token
 *
 * Creates a new Jti Token entity in the system.
 * @param data - Request body
 * @returns Promise<JtiTokenEntityResult>
 */
export async function createJtiToken(data: JtiTokenEntity): Promise<JtiTokenEntityResult> {
  const response = await axiosInstance.post<JtiTokenEntityResult>(JTITOKEN_ENDPOINTS.createJtiToken, data);
  return response.data;
}

/**
 * Update an existing Jti Token
 *
 * Updates specific fields of an existing Jti Token entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateJtiToken(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/jtitoken/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Jti Token
 *
 * Deletes a Jti Token entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteJtiToken(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/jtitoken/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Jti Token
 *
 * Generates a new unique code for a Jti Token entity.
 * @returns Promise<string>
 */
export async function generateNewJtiTokenCode(): Promise<string> {
  const response = await axiosInstance.get<string>(JTITOKEN_ENDPOINTS.generateNewJtiTokenCode);
  return response.data;
}
