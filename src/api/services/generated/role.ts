import axiosInstance from '../../axios-instance';

import type {
  SortType,
  RoleEntity,
  BooleanResult,
  RoleEntityResult,
  StringObjectKeyValuePair,
  RoleEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Role Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Role API endpoints
 */
export const ROLE_ENDPOINTS = {
  getRoleById: '/api/role/{id}',
  getRolePage: '/api/role/get-page',
  createRole: '/api/role/create',
  updateRole: '/api/role/update/{id}',
  deleteRole: '/api/role/delete/{id}',
  generateNewRoleCode: '/api/role/generate-new-code',
} as const;

/**
 * Get Role by ID
 *
 * Retrieves a specific Role entity by its unique identifier.
 * @returns Promise<RoleEntity>
 */
export async function getRoleById(id: string): Promise<RoleEntity> {
  const response = await axiosInstance.get<RoleEntity>(`/api/role/${id}`);
  return response.data;
}

/**
 * Get paginated list of Role
 *
 * Retrieves a paginated list of Role entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<RoleEntityBasePaginationResponse>
 */
export async function getRolePage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<RoleEntityBasePaginationResponse> {
  const response = await axiosInstance.post<RoleEntityBasePaginationResponse>(
    ROLE_ENDPOINTS.getRolePage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Role
 *
 * Creates a new Role entity in the system.
 * @param data - Request body
 * @returns Promise<RoleEntityResult>
 */
export async function createRole(data: RoleEntity): Promise<RoleEntityResult> {
  const response = await axiosInstance.post<RoleEntityResult>(ROLE_ENDPOINTS.createRole, data);
  return response.data;
}

/**
 * Update an existing Role
 *
 * Updates specific fields of an existing Role entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateRole(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/role/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Role
 *
 * Deletes a Role entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteRole(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/role/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Role
 *
 * Generates a new unique code for a Role entity.
 * @returns Promise<string>
 */
export async function generateNewRoleCode(): Promise<string> {
  const response = await axiosInstance.get<string>(ROLE_ENDPOINTS.generateNewRoleCode);
  return response.data;
}
