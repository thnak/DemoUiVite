import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  FilePermissionEntity,
  StringObjectKeyValuePair,
  FilePermissionEntityResult,
  FilePermissionEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FilePermission Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * FilePermission API endpoints
 */
export const FILEPERMISSION_ENDPOINTS = {
  getFilePermissionById: '/api/filepermission/{id}',
  getFilePermissionPage: '/api/filepermission/get-page',
  createFilePermission: '/api/filepermission/create',
  updateFilePermission: '/api/filepermission/update/{id}',
  deleteFilePermission: '/api/filepermission/delete/{id}',
  generateNewFilePermissionCode: '/api/filepermission/generate-new-code',
} as const;

/**
 * Get File Permission by ID
 *
 * Retrieves a specific File Permission entity by its unique identifier.
 * @returns Promise<FilePermissionEntity>
 */
export async function getFilePermissionById(id: string): Promise<FilePermissionEntity> {
  const response = await axiosInstance.get<FilePermissionEntity>(`/api/filepermission/${id}`);
  return response.data;
}

/**
 * Get paginated list of File Permission
 *
 * Retrieves a paginated list of File Permission entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<FilePermissionEntityBasePaginationResponse>
 */
export async function getFilePermissionPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<FilePermissionEntityBasePaginationResponse> {
  const response = await axiosInstance.post<FilePermissionEntityBasePaginationResponse>(FILEPERMISSION_ENDPOINTS.getFilePermissionPage, data, { params });
  return response.data;
}

/**
 * Create a new File Permission
 *
 * Creates a new File Permission entity in the system.
 * @param data - Request body
 * @returns Promise<FilePermissionEntityResult>
 */
export async function createFilePermission(data: FilePermissionEntity): Promise<FilePermissionEntityResult> {
  const response = await axiosInstance.post<FilePermissionEntityResult>(FILEPERMISSION_ENDPOINTS.createFilePermission, data);
  return response.data;
}

/**
 * Update an existing File Permission
 *
 * Updates specific fields of an existing File Permission entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateFilePermission(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/filepermission/update/${id}`, data);
  return response.data;
}

/**
 * Delete a File Permission
 *
 * Deletes a File Permission entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteFilePermission(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/filepermission/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for File Permission
 *
 * Generates a new unique code for a File Permission entity.
 * @returns Promise<string>
 */
export async function generateNewFilePermissionCode(): Promise<string> {
  const response = await axiosInstance.get<string>(FILEPERMISSION_ENDPOINTS.generateNewFilePermissionCode);
  return response.data;
}
