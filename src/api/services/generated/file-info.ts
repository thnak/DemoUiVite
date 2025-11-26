import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  FileInfoEntity,
  FileInfoEntityResult,
  StringObjectKeyValuePair,
  FileInfoEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FileInfo Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * FileInfo API endpoints
 */
export const FILEINFO_ENDPOINTS = {
  getFileInfoById: '/api/fileinfo/{id}',
  getFileInfoPage: '/api/fileinfo/get-page',
  createFileInfo: '/api/fileinfo/create',
  updateFileInfo: '/api/fileinfo/update/{id}',
  deleteFileInfo: '/api/fileinfo/delete/{id}',
  generateNewFileInfoCode: '/api/fileinfo/generate-new-code',
} as const;

/**
 * Get File Info by ID
 *
 * Retrieves a specific File Info entity by its unique identifier.
 * @returns Promise<FileInfoEntity>
 */
export async function getFileInfoById(id: string): Promise<FileInfoEntity> {
  const response = await axiosInstance.get<FileInfoEntity>(`/api/fileinfo/${id}`);
  return response.data;
}

/**
 * Get paginated list of File Info
 *
 * Retrieves a paginated list of File Info entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<FileInfoEntityBasePaginationResponse>
 */
export async function getFileInfoPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<FileInfoEntityBasePaginationResponse> {
  const response = await axiosInstance.post<FileInfoEntityBasePaginationResponse>(
    FILEINFO_ENDPOINTS.getFileInfoPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new File Info
 *
 * Creates a new File Info entity in the system.
 * @param data - Request body
 * @returns Promise<FileInfoEntityResult>
 */
export async function createFileInfo(data: FileInfoEntity): Promise<FileInfoEntityResult> {
  const response = await axiosInstance.post<FileInfoEntityResult>(
    FILEINFO_ENDPOINTS.createFileInfo,
    data
  );
  return response.data;
}

/**
 * Update an existing File Info
 *
 * Updates specific fields of an existing File Info entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateFileInfo(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/fileinfo/update/${id}`, data);
  return response.data;
}

/**
 * Delete a File Info
 *
 * Deletes a File Info entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteFileInfo(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/fileinfo/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for File Info
 *
 * Generates a new unique code for a File Info entity.
 * @returns Promise<string>
 */
export async function generateNewFileInfoCode(): Promise<string> {
  const response = await axiosInstance.get<string>(FILEINFO_ENDPOINTS.generateNewFileInfoCode);
  return response.data;
}
