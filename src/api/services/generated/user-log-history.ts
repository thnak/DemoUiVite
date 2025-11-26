import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  UserLogHistoryEntity,
  UserLogHistoryEntityBasePaginationResponse,
  UserLogHistoryEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserLogHistory Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * UserLogHistory API endpoints
 */
export const USERLOGHISTORY_ENDPOINTS = {
  getUserLogHistoryById: '/api/userloghistory/{id}',
  getUserLogHistoryPage: '/api/userloghistory/get-page',
  createUserLogHistory: '/api/userloghistory/create',
  updateUserLogHistory: '/api/userloghistory/update/{id}',
  deleteUserLogHistory: '/api/userloghistory/delete/{id}',
  generateNewUserLogHistoryCode: '/api/userloghistory/generate-new-code',
} as const;

/**
 * Get User Log History by ID
 *
 * Retrieves a specific User Log History entity by its unique identifier.
 * @returns Promise<UserLogHistoryEntity>
 */
export async function getUserLogHistoryById(id: string): Promise<UserLogHistoryEntity> {
  const response = await axiosInstance.get<UserLogHistoryEntity>(`/api/userloghistory/${id}`);
  return response.data;
}

/**
 * Get paginated list of User Log History
 *
 * Retrieves a paginated list of User Log History entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<UserLogHistoryEntityBasePaginationResponse>
 */
export async function getUserLogHistoryPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<UserLogHistoryEntityBasePaginationResponse> {
  const response = await axiosInstance.post<UserLogHistoryEntityBasePaginationResponse>(USERLOGHISTORY_ENDPOINTS.getUserLogHistoryPage, data, { params });
  return response.data;
}

/**
 * Create a new User Log History
 *
 * Creates a new User Log History entity in the system.
 * @param data - Request body
 * @returns Promise<UserLogHistoryEntityResult>
 */
export async function createUserLogHistory(data: UserLogHistoryEntity): Promise<UserLogHistoryEntityResult> {
  const response = await axiosInstance.post<UserLogHistoryEntityResult>(USERLOGHISTORY_ENDPOINTS.createUserLogHistory, data);
  return response.data;
}

/**
 * Update an existing User Log History
 *
 * Updates specific fields of an existing User Log History entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateUserLogHistory(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/userloghistory/update/${id}`, data);
  return response.data;
}

/**
 * Delete a User Log History
 *
 * Deletes a User Log History entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteUserLogHistory(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/userloghistory/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for User Log History
 *
 * Generates a new unique code for a User Log History entity.
 * @returns Promise<string>
 */
export async function generateNewUserLogHistoryCode(): Promise<string> {
  const response = await axiosInstance.get<string>(USERLOGHISTORY_ENDPOINTS.generateNewUserLogHistoryCode);
  return response.data;
}
