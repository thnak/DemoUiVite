import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  UserPermissionEntity,
  StringObjectKeyValuePair,
  UserPermissionEntityResult,
  UserPermissionEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserPermission Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * UserPermission API endpoints
 */
export const USERPERMISSION_ENDPOINTS = {
  getUserPermissionById: '/api/userpermission/{id}',
  getUserPermissionPage: '/api/userpermission/get-page',
  createUserPermission: '/api/userpermission/create',
  updateUserPermission: '/api/userpermission/update/{id}',
  deleteUserPermission: '/api/userpermission/delete/{id}',
  generateNewUserPermissionCode: '/api/userpermission/generate-new-code',
} as const;

/**
 * Get User Permission by ID
 *
 * Retrieves a specific User Permission entity by its unique identifier.
 * @returns Promise<UserPermissionEntity>
 */
export async function getUserPermissionById(id: string): Promise<UserPermissionEntity> {
  const response = await axiosInstance.get<UserPermissionEntity>(`/api/userpermission/${id}`);
  return response.data;
}

/**
 * Get paginated list of User Permission
 *
 * Retrieves a paginated list of User Permission entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<UserPermissionEntityBasePaginationResponse>
 */
export async function getUserPermissionPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<UserPermissionEntityBasePaginationResponse> {
  const response = await axiosInstance.post<UserPermissionEntityBasePaginationResponse>(USERPERMISSION_ENDPOINTS.getUserPermissionPage, data, { params });
  return response.data;
}

/**
 * Create a new User Permission
 *
 * Creates a new User Permission entity in the system.
 * @param data - Request body
 * @returns Promise<UserPermissionEntityResult>
 */
export async function createUserPermission(data: UserPermissionEntity): Promise<UserPermissionEntityResult> {
  const response = await axiosInstance.post<UserPermissionEntityResult>(USERPERMISSION_ENDPOINTS.createUserPermission, data);
  return response.data;
}

/**
 * Update an existing User Permission
 *
 * Updates specific fields of an existing User Permission entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateUserPermission(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/userpermission/update/${id}`, data);
  return response.data;
}

/**
 * Delete a User Permission
 *
 * Deletes a User Permission entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteUserPermission(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/userpermission/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for User Permission
 *
 * Generates a new unique code for a User Permission entity.
 * @returns Promise<string>
 */
export async function generateNewUserPermissionCode(): Promise<string> {
  const response = await axiosInstance.get<string>(USERPERMISSION_ENDPOINTS.generateNewUserPermissionCode);
  return response.data;
}
