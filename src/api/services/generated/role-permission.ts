import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  RolePermissionEntity,
  StringObjectKeyValuePair,
  RolePermissionEntityResult,
  RolePermissionEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// RolePermission Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * RolePermission API endpoints
 */
export const ROLEPERMISSION_ENDPOINTS = {
  getRolePermissionById: '/api/rolepermission/{id}',
  getRolePermissionPage: '/api/rolepermission/get-page',
  createRolePermission: '/api/rolepermission/create',
  updateRolePermission: '/api/rolepermission/update/{id}',
  deleteRolePermission: '/api/rolepermission/delete/{id}',
  generateNewRolePermissionCode: '/api/rolepermission/generate-new-code',
} as const;

/**
 * Get Role Permission by ID
 *
 * Retrieves a specific Role Permission entity by its unique identifier.
 * @returns Promise<RolePermissionEntity>
 */
export async function getRolePermissionById(id: string): Promise<RolePermissionEntity> {
  const response = await axiosInstance.get<RolePermissionEntity>(`/api/rolepermission/${id}`);
  return response.data;
}

/**
 * Get paginated list of Role Permission
 *
 * Retrieves a paginated list of Role Permission entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<RolePermissionEntityBasePaginationResponse>
 */
export async function getRolePermissionPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<RolePermissionEntityBasePaginationResponse> {
  const response = await axiosInstance.post<RolePermissionEntityBasePaginationResponse>(ROLEPERMISSION_ENDPOINTS.getRolePermissionPage, data, { params });
  return response.data;
}

/**
 * Create a new Role Permission
 *
 * Creates a new Role Permission entity in the system.
 * @param data - Request body
 * @returns Promise<RolePermissionEntityResult>
 */
export async function createRolePermission(data: RolePermissionEntity): Promise<RolePermissionEntityResult> {
  const response = await axiosInstance.post<RolePermissionEntityResult>(ROLEPERMISSION_ENDPOINTS.createRolePermission, data);
  return response.data;
}

/**
 * Update an existing Role Permission
 *
 * Updates specific fields of an existing Role Permission entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateRolePermission(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/rolepermission/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Role Permission
 *
 * Deletes a Role Permission entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteRolePermission(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/rolepermission/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Role Permission
 *
 * Generates a new unique code for a Role Permission entity.
 * @returns Promise<string>
 */
export async function generateNewRolePermissionCode(): Promise<string> {
  const response = await axiosInstance.get<string>(ROLEPERMISSION_ENDPOINTS.generateNewRolePermissionCode);
  return response.data;
}
