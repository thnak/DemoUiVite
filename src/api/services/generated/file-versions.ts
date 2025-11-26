import axiosInstance from '../../axios-instance';

import type {
  SortType,
  FileVersions,
  BooleanResult,
  FileVersionsResult,
  StringObjectKeyValuePair,
  FileVersionsBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FileVersions Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * FileVersions API endpoints
 */
export const FILEVERSIONS_ENDPOINTS = {
  getFileVersionsById: '/api/fileversions/{id}',
  getFileVersionsPage: '/api/fileversions/get-page',
  createFileVersions: '/api/fileversions/create',
  updateFileVersions: '/api/fileversions/update/{id}',
  deleteFileVersions: '/api/fileversions/delete/{id}',
  generateNewFileVersionsCode: '/api/fileversions/generate-new-code',
} as const;

/**
 * Get File Versions by ID
 *
 * Retrieves a specific File Versions entity by its unique identifier.
 * @returns Promise<FileVersions>
 */
export async function getFileVersionsById(id: string): Promise<FileVersions> {
  const response = await axiosInstance.get<FileVersions>(`/api/fileversions/${id}`);
  return response.data;
}

/**
 * Get paginated list of File Versions
 *
 * Retrieves a paginated list of File Versions entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<FileVersionsBasePaginationResponse>
 */
export async function getFileVersionsPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<FileVersionsBasePaginationResponse> {
  const response = await axiosInstance.post<FileVersionsBasePaginationResponse>(FILEVERSIONS_ENDPOINTS.getFileVersionsPage, data, { params });
  return response.data;
}

/**
 * Create a new File Versions
 *
 * Creates a new File Versions entity in the system.
 * @param data - Request body
 * @returns Promise<FileVersionsResult>
 */
export async function createFileVersions(data: FileVersions): Promise<FileVersionsResult> {
  const response = await axiosInstance.post<FileVersionsResult>(FILEVERSIONS_ENDPOINTS.createFileVersions, data);
  return response.data;
}

/**
 * Update an existing File Versions
 *
 * Updates specific fields of an existing File Versions entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateFileVersions(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/fileversions/update/${id}`, data);
  return response.data;
}

/**
 * Delete a File Versions
 *
 * Deletes a File Versions entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteFileVersions(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/fileversions/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for File Versions
 *
 * Generates a new unique code for a File Versions entity.
 * @returns Promise<string>
 */
export async function generateNewFileVersionsCode(): Promise<string> {
  const response = await axiosInstance.get<string>(FILEVERSIONS_ENDPOINTS.generateNewFileVersionsCode);
  return response.data;
}
