import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  UserRoleEntity,
  UserRoleEntityBasePaginationResponse,
  UserRoleEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserRole Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * UserRole API endpoints
 */
export const USERROLE_ENDPOINTS = {
  getUserRoleById: '/api/userrole/{id}',
  getUserRolePage: '/api/userrole/get-page',
  createUserRole: '/api/userrole/create',
  updateUserRole: '/api/userrole/update/{id}',
  deleteUserRole: '/api/userrole/delete/{id}',
  generateNewUserRoleCode: '/api/userrole/generate-new-code',
} as const;

/**
 * Get User Role by ID
 *
 * Retrieves a specific User Role entity by its unique identifier.
 * @returns Promise<UserRoleEntity>
 */
export async function getUserRoleById(id: string): Promise<UserRoleEntity> {
  const response = await axiosInstance.get<UserRoleEntity>(`/api/userrole/${id}`);
  return response.data;
}

/**
 * Get paginated list of User Role
 *
 * Retrieves a paginated list of User Role entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<UserRoleEntityBasePaginationResponse>
 */
export async function getUserRolePage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<UserRoleEntityBasePaginationResponse> {
  const response = await axiosInstance.post<UserRoleEntityBasePaginationResponse>(USERROLE_ENDPOINTS.getUserRolePage, data, { params });
  return response.data;
}

/**
 * Create a new User Role
 *
 * Creates a new User Role entity in the system.
 * @param data - Request body
 * @returns Promise<UserRoleEntityResult>
 */
export async function createUserRole(data: UserRoleEntity): Promise<UserRoleEntityResult> {
  const response = await axiosInstance.post<UserRoleEntityResult>(USERROLE_ENDPOINTS.createUserRole, data);
  return response.data;
}

/**
 * Update an existing User Role
 *
 * Updates specific fields of an existing User Role entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateUserRole(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/userrole/update/${id}`, data);
  return response.data;
}

/**
 * Delete a User Role
 *
 * Deletes a User Role entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteUserRole(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/userrole/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for User Role
 *
 * Generates a new unique code for a User Role entity.
 * @returns Promise<string>
 */
export async function generateNewUserRoleCode(): Promise<string> {
  const response = await axiosInstance.get<string>(USERROLE_ENDPOINTS.generateNewUserRoleCode);
  return response.data;
}
