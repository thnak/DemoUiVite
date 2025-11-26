import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  PermissionEntity,
  PermissionEntityBasePaginationResponse,
  PermissionEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Permission Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Permission API endpoints
 */
export const PERMISSION_ENDPOINTS = {
  getPermissionById: '/api/permission/{id}',
  getPermissionPage: '/api/permission/get-page',
  createPermission: '/api/permission/create',
  updatePermission: '/api/permission/update/{id}',
  deletePermission: '/api/permission/delete/{id}',
  generateNewPermissionCode: '/api/permission/generate-new-code',
} as const;

/**
 * Get Permission by ID
 *
 * Retrieves a specific Permission entity by its unique identifier.
 * @returns Promise<PermissionEntity>
 */
export async function getPermissionById(id: string): Promise<PermissionEntity> {
  const response = await axiosInstance.get<PermissionEntity>(`/api/permission/${id}`);
  return response.data;
}

/**
 * Get paginated list of Permission
 *
 * Retrieves a paginated list of Permission entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<PermissionEntityBasePaginationResponse>
 */
export async function getPermissionPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<PermissionEntityBasePaginationResponse> {
  const response = await axiosInstance.post<PermissionEntityBasePaginationResponse>(PERMISSION_ENDPOINTS.getPermissionPage, data, { params });
  return response.data;
}

/**
 * Create a new Permission
 *
 * Creates a new Permission entity in the system.
 * @param data - Request body
 * @returns Promise<PermissionEntityResult>
 */
export async function createPermission(data: PermissionEntity): Promise<PermissionEntityResult> {
  const response = await axiosInstance.post<PermissionEntityResult>(PERMISSION_ENDPOINTS.createPermission, data);
  return response.data;
}

/**
 * Update an existing Permission
 *
 * Updates specific fields of an existing Permission entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updatePermission(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/permission/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Permission
 *
 * Deletes a Permission entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deletePermission(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/permission/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Permission
 *
 * Generates a new unique code for a Permission entity.
 * @returns Promise<string>
 */
export async function generateNewPermissionCode(): Promise<string> {
  const response = await axiosInstance.get<string>(PERMISSION_ENDPOINTS.generateNewPermissionCode);
  return response.data;
}
