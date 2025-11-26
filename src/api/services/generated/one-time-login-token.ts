import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  OneTimeLoginTokenEntity,
  StringObjectKeyValuePair,
  OneTimeLoginTokenEntityResult,
  OneTimeLoginTokenEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// OneTimeLoginToken Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * OneTimeLoginToken API endpoints
 */
export const ONETIMELOGINTOKEN_ENDPOINTS = {
  getOneTimeLoginTokenById: '/api/onetimelogintoken/{id}',
  getOneTimeLoginTokenPage: '/api/onetimelogintoken/get-page',
  createOneTimeLoginToken: '/api/onetimelogintoken/create',
  updateOneTimeLoginToken: '/api/onetimelogintoken/update/{id}',
  deleteOneTimeLoginToken: '/api/onetimelogintoken/delete/{id}',
  generateNewOneTimeLoginTokenCode: '/api/onetimelogintoken/generate-new-code',
} as const;

/**
 * Get One Time Login Token by ID
 *
 * Retrieves a specific One Time Login Token entity by its unique identifier.
 * @returns Promise<OneTimeLoginTokenEntity>
 */
export async function getOneTimeLoginTokenById(id: string): Promise<OneTimeLoginTokenEntity> {
  const response = await axiosInstance.get<OneTimeLoginTokenEntity>(`/api/onetimelogintoken/${id}`);
  return response.data;
}

/**
 * Get paginated list of One Time Login Token
 *
 * Retrieves a paginated list of One Time Login Token entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<OneTimeLoginTokenEntityBasePaginationResponse>
 */
export async function getOneTimeLoginTokenPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<OneTimeLoginTokenEntityBasePaginationResponse> {
  const response = await axiosInstance.post<OneTimeLoginTokenEntityBasePaginationResponse>(ONETIMELOGINTOKEN_ENDPOINTS.getOneTimeLoginTokenPage, data, { params });
  return response.data;
}

/**
 * Create a new One Time Login Token
 *
 * Creates a new One Time Login Token entity in the system.
 * @param data - Request body
 * @returns Promise<OneTimeLoginTokenEntityResult>
 */
export async function createOneTimeLoginToken(data: OneTimeLoginTokenEntity): Promise<OneTimeLoginTokenEntityResult> {
  const response = await axiosInstance.post<OneTimeLoginTokenEntityResult>(ONETIMELOGINTOKEN_ENDPOINTS.createOneTimeLoginToken, data);
  return response.data;
}

/**
 * Update an existing One Time Login Token
 *
 * Updates specific fields of an existing One Time Login Token entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateOneTimeLoginToken(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/onetimelogintoken/update/${id}`, data);
  return response.data;
}

/**
 * Delete a One Time Login Token
 *
 * Deletes a One Time Login Token entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteOneTimeLoginToken(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/onetimelogintoken/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for One Time Login Token
 *
 * Generates a new unique code for a One Time Login Token entity.
 * @returns Promise<string>
 */
export async function generateNewOneTimeLoginTokenCode(): Promise<string> {
  const response = await axiosInstance.get<string>(ONETIMELOGINTOKEN_ENDPOINTS.generateNewOneTimeLoginTokenCode);
  return response.data;
}
