import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  FolderInfoEntity,
  FolderInfoEntityBasePaginationResponse,
  FolderInfoEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FolderInfo Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * FolderInfo API endpoints
 */
export const FOLDERINFO_ENDPOINTS = {
  getFolderInfoById: '/api/folderinfo/{id}',
  getFolderInfoPage: '/api/folderinfo/get-page',
  createFolderInfo: '/api/folderinfo/create',
  updateFolderInfo: '/api/folderinfo/update/{id}',
  deleteFolderInfo: '/api/folderinfo/delete/{id}',
  generateNewFolderInfoCode: '/api/folderinfo/generate-new-code',
} as const;

/**
 * Get Folder Info by ID
 *
 * Retrieves a specific Folder Info entity by its unique identifier.
 * @returns Promise<FolderInfoEntity>
 */
export async function getFolderInfoById(id: string): Promise<FolderInfoEntity> {
  const response = await axiosInstance.get<FolderInfoEntity>(`/api/folderinfo/${id}`);
  return response.data;
}

/**
 * Get paginated list of Folder Info
 *
 * Retrieves a paginated list of Folder Info entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<FolderInfoEntityBasePaginationResponse>
 */
export async function getFolderInfoPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<FolderInfoEntityBasePaginationResponse> {
  const response = await axiosInstance.post<FolderInfoEntityBasePaginationResponse>(FOLDERINFO_ENDPOINTS.getFolderInfoPage, data, { params });
  return response.data;
}

/**
 * Create a new Folder Info
 *
 * Creates a new Folder Info entity in the system.
 * @param data - Request body
 * @returns Promise<FolderInfoEntityResult>
 */
export async function createFolderInfo(data: FolderInfoEntity): Promise<FolderInfoEntityResult> {
  const response = await axiosInstance.post<FolderInfoEntityResult>(FOLDERINFO_ENDPOINTS.createFolderInfo, data);
  return response.data;
}

/**
 * Update an existing Folder Info
 *
 * Updates specific fields of an existing Folder Info entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateFolderInfo(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/folderinfo/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Folder Info
 *
 * Deletes a Folder Info entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteFolderInfo(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/folderinfo/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Folder Info
 *
 * Generates a new unique code for a Folder Info entity.
 * @returns Promise<string>
 */
export async function generateNewFolderInfoCode(): Promise<string> {
  const response = await axiosInstance.get<string>(FOLDERINFO_ENDPOINTS.generateNewFolderInfoCode);
  return response.data;
}
