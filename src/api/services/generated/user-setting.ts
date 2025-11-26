import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  UserSettingEntity,
  UserSettingEntityBasePaginationResponse,
  UserSettingEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserSetting Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * UserSetting API endpoints
 */
export const USERSETTING_ENDPOINTS = {
  getUserSettingById: '/api/usersetting/{id}',
  getUserSettingPage: '/api/usersetting/get-page',
  createUserSetting: '/api/usersetting/create',
  updateUserSetting: '/api/usersetting/update/{id}',
  deleteUserSetting: '/api/usersetting/delete/{id}',
  generateNewUserSettingCode: '/api/usersetting/generate-new-code',
} as const;

/**
 * Get User Setting by ID
 *
 * Retrieves a specific User Setting entity by its unique identifier.
 * @returns Promise<UserSettingEntity>
 */
export async function getUserSettingById(id: string): Promise<UserSettingEntity> {
  const response = await axiosInstance.get<UserSettingEntity>(`/api/usersetting/${id}`);
  return response.data;
}

/**
 * Get paginated list of User Setting
 *
 * Retrieves a paginated list of User Setting entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<UserSettingEntityBasePaginationResponse>
 */
export async function getUserSettingPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<UserSettingEntityBasePaginationResponse> {
  const response = await axiosInstance.post<UserSettingEntityBasePaginationResponse>(USERSETTING_ENDPOINTS.getUserSettingPage, data, { params });
  return response.data;
}

/**
 * Create a new User Setting
 *
 * Creates a new User Setting entity in the system.
 * @param data - Request body
 * @returns Promise<UserSettingEntityResult>
 */
export async function createUserSetting(data: UserSettingEntity): Promise<UserSettingEntityResult> {
  const response = await axiosInstance.post<UserSettingEntityResult>(USERSETTING_ENDPOINTS.createUserSetting, data);
  return response.data;
}

/**
 * Update an existing User Setting
 *
 * Updates specific fields of an existing User Setting entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateUserSetting(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/usersetting/update/${id}`, data);
  return response.data;
}

/**
 * Delete a User Setting
 *
 * Deletes a User Setting entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteUserSetting(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/usersetting/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for User Setting
 *
 * Generates a new unique code for a User Setting entity.
 * @returns Promise<string>
 */
export async function generateNewUserSettingCode(): Promise<string> {
  const response = await axiosInstance.get<string>(USERSETTING_ENDPOINTS.generateNewUserSettingCode);
  return response.data;
}
