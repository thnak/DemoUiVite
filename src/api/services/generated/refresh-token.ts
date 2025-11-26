import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  RefreshTokenEntity,
  RefreshTokenEntityResult,
  StringObjectKeyValuePair,
  RefreshTokenEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// RefreshToken Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * RefreshToken API endpoints
 */
export const REFRESHTOKEN_ENDPOINTS = {
  getRefreshTokenById: '/api/refreshtoken/{id}',
  getRefreshTokenPage: '/api/refreshtoken/get-page',
  createRefreshToken: '/api/refreshtoken/create',
  updateRefreshToken: '/api/refreshtoken/update/{id}',
  deleteRefreshToken: '/api/refreshtoken/delete/{id}',
  generateNewRefreshTokenCode: '/api/refreshtoken/generate-new-code',
} as const;

/**
 * Get Refresh Token by ID
 *
 * Retrieves a specific Refresh Token entity by its unique identifier.
 * @returns Promise<RefreshTokenEntity>
 */
export async function getRefreshTokenById(id: string): Promise<RefreshTokenEntity> {
  const response = await axiosInstance.get<RefreshTokenEntity>(`/api/refreshtoken/${id}`);
  return response.data;
}

/**
 * Get paginated list of Refresh Token
 *
 * Retrieves a paginated list of Refresh Token entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<RefreshTokenEntityBasePaginationResponse>
 */
export async function getRefreshTokenPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<RefreshTokenEntityBasePaginationResponse> {
  const response = await axiosInstance.post<RefreshTokenEntityBasePaginationResponse>(REFRESHTOKEN_ENDPOINTS.getRefreshTokenPage, data, { params });
  return response.data;
}

/**
 * Create a new Refresh Token
 *
 * Creates a new Refresh Token entity in the system.
 * @param data - Request body
 * @returns Promise<RefreshTokenEntityResult>
 */
export async function createRefreshToken(data: RefreshTokenEntity): Promise<RefreshTokenEntityResult> {
  const response = await axiosInstance.post<RefreshTokenEntityResult>(REFRESHTOKEN_ENDPOINTS.createRefreshToken, data);
  return response.data;
}

/**
 * Update an existing Refresh Token
 *
 * Updates specific fields of an existing Refresh Token entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateRefreshToken(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/refreshtoken/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Refresh Token
 *
 * Deletes a Refresh Token entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteRefreshToken(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/refreshtoken/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Refresh Token
 *
 * Generates a new unique code for a Refresh Token entity.
 * @returns Promise<string>
 */
export async function generateNewRefreshTokenCode(): Promise<string> {
  const response = await axiosInstance.get<string>(REFRESHTOKEN_ENDPOINTS.generateNewRefreshTokenCode);
  return response.data;
}
