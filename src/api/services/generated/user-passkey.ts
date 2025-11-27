import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  UserPasskeyEntity,
  UserPasskeyEntityResult,
  StringObjectKeyValuePair,
  UserPasskeyEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserPasskey Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * UserPasskey API endpoints
 */
export const USERPASSKEY_ENDPOINTS = {
  getUserPasskeyById: '/api/userpasskey/{id}',
  getUserPasskeyPage: '/api/userpasskey/get-page',
  createUserPasskey: '/api/userpasskey/create',
  updateUserPasskey: '/api/userpasskey/update/{id}',
  deleteUserPasskey: '/api/userpasskey/delete/{id}',
  generateNewUserPasskeyCode: '/api/userpasskey/generate-new-code',
} as const;

/**
 * Get User Passkey by ID
 *
 * Retrieves a specific User Passkey entity by its unique identifier.
 * @returns Promise<UserPasskeyEntity>
 */
export async function getUserPasskeyById(id: string): Promise<UserPasskeyEntity> {
  const response = await axiosInstance.get<UserPasskeyEntity>(`/api/userpasskey/${id}`);
  return response.data;
}

/**
 * Get paginated list of User Passkey
 *
 * Retrieves a paginated list of User Passkey entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<UserPasskeyEntityBasePaginationResponse>
 */
export async function getUserPasskeyPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<UserPasskeyEntityBasePaginationResponse> {
  const response = await axiosInstance.post<UserPasskeyEntityBasePaginationResponse>(USERPASSKEY_ENDPOINTS.getUserPasskeyPage, data, { params });
  return response.data;
}

/**
 * Create a new User Passkey
 *
 * Creates a new User Passkey entity in the system.
 * @param data - Request body
 * @returns Promise<UserPasskeyEntityResult>
 */
export async function createUserPasskey(data: UserPasskeyEntity): Promise<UserPasskeyEntityResult> {
  const response = await axiosInstance.post<UserPasskeyEntityResult>(USERPASSKEY_ENDPOINTS.createUserPasskey, data);
  return response.data;
}

/**
 * Update an existing User Passkey
 *
 * Updates specific fields of an existing User Passkey entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateUserPasskey(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/userpasskey/update/${id}`, data);
  return response.data;
}

/**
 * Delete a User Passkey
 *
 * Deletes a User Passkey entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteUserPasskey(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/userpasskey/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for User Passkey
 *
 * Generates a new unique code for a User Passkey entity.
 * @returns Promise<string>
 */
export async function generateNewUserPasskeyCode(): Promise<string> {
  const response = await axiosInstance.get<string>(USERPASSKEY_ENDPOINTS.generateNewUserPasskeyCode);
  return response.data;
}
