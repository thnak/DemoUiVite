import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  FolderPermissionEntity,
  FolderPermissionEntityBasePaginationResponse,
  FolderPermissionEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FolderPermission Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * FolderPermission API endpoints
 */
export const FOLDERPERMISSION_ENDPOINTS = {
  getFolderPermissionById: '/api/folderpermission/{id}',
  getFolderPermissionPage: '/api/folderpermission/get-page',
  createFolderPermission: '/api/folderpermission/create',
  updateFolderPermission: '/api/folderpermission/update/{id}',
  deleteFolderPermission: '/api/folderpermission/delete/{id}',
  generateNewFolderPermissionCode: '/api/folderpermission/generate-new-code',
} as const;

/**
 * Get Folder Permission by ID
 *
 * Retrieves a specific Folder Permission entity by its unique identifier.
 * @returns Promise<FolderPermissionEntity>
 */
export async function getFolderPermissionById(id: string): Promise<FolderPermissionEntity> {
  const response = await axiosInstance.get<FolderPermissionEntity>(`/api/folderpermission/${id}`);
  return response.data;
}

/**
 * Get paginated list of Folder Permission
 *
 * Retrieves a paginated list of Folder Permission entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<FolderPermissionEntityBasePaginationResponse>
 */
export async function getFolderPermissionPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<FolderPermissionEntityBasePaginationResponse> {
  const response = await axiosInstance.post<FolderPermissionEntityBasePaginationResponse>(FOLDERPERMISSION_ENDPOINTS.getFolderPermissionPage, data, { params });
  return response.data;
}

/**
 * Create a new Folder Permission
 *
 * Creates a new Folder Permission entity in the system.
 * @param data - Request body
 * @returns Promise<FolderPermissionEntityResult>
 */
export async function createFolderPermission(data: FolderPermissionEntity): Promise<FolderPermissionEntityResult> {
  const response = await axiosInstance.post<FolderPermissionEntityResult>(FOLDERPERMISSION_ENDPOINTS.createFolderPermission, data);
  return response.data;
}

/**
 * Update an existing Folder Permission
 *
 * Updates specific fields of an existing Folder Permission entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateFolderPermission(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/folderpermission/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Folder Permission
 *
 * Deletes a Folder Permission entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteFolderPermission(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/folderpermission/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Folder Permission
 *
 * Generates a new unique code for a Folder Permission entity.
 * @returns Promise<string>
 */
export async function generateNewFolderPermissionCode(): Promise<string> {
  const response = await axiosInstance.get<string>(FOLDERPERMISSION_ENDPOINTS.generateNewFolderPermissionCode);
  return response.data;
}
