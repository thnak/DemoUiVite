import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  FileLocationHistoryEntity,
  FileLocationHistoryEntityBasePaginationResponse,
  FileLocationHistoryEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FileLocationHistory Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * FileLocationHistory API endpoints
 */
export const FILELOCATIONHISTORY_ENDPOINTS = {
  getFileLocationHistoryById: '/api/filelocationhistory/{id}',
  getFileLocationHistoryPage: '/api/filelocationhistory/get-page',
  createFileLocationHistory: '/api/filelocationhistory/create',
  updateFileLocationHistory: '/api/filelocationhistory/update/{id}',
  deleteFileLocationHistory: '/api/filelocationhistory/delete/{id}',
  generateNewFileLocationHistoryCode: '/api/filelocationhistory/generate-new-code',
} as const;

/**
 * Get File Location History by ID
 *
 * Retrieves a specific File Location History entity by its unique identifier.
 * @returns Promise<FileLocationHistoryEntity>
 */
export async function getFileLocationHistoryById(id: string): Promise<FileLocationHistoryEntity> {
  const response = await axiosInstance.get<FileLocationHistoryEntity>(`/api/filelocationhistory/${id}`);
  return response.data;
}

/**
 * Get paginated list of File Location History
 *
 * Retrieves a paginated list of File Location History entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<FileLocationHistoryEntityBasePaginationResponse>
 */
export async function getFileLocationHistoryPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<FileLocationHistoryEntityBasePaginationResponse> {
  const response = await axiosInstance.post<FileLocationHistoryEntityBasePaginationResponse>(FILELOCATIONHISTORY_ENDPOINTS.getFileLocationHistoryPage, data, { params });
  return response.data;
}

/**
 * Create a new File Location History
 *
 * Creates a new File Location History entity in the system.
 * @param data - Request body
 * @returns Promise<FileLocationHistoryEntityResult>
 */
export async function createFileLocationHistory(data: FileLocationHistoryEntity): Promise<FileLocationHistoryEntityResult> {
  const response = await axiosInstance.post<FileLocationHistoryEntityResult>(FILELOCATIONHISTORY_ENDPOINTS.createFileLocationHistory, data);
  return response.data;
}

/**
 * Update an existing File Location History
 *
 * Updates specific fields of an existing File Location History entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateFileLocationHistory(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/filelocationhistory/update/${id}`, data);
  return response.data;
}

/**
 * Delete a File Location History
 *
 * Deletes a File Location History entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteFileLocationHistory(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/filelocationhistory/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for File Location History
 *
 * Generates a new unique code for a File Location History entity.
 * @returns Promise<string>
 */
export async function generateNewFileLocationHistoryCode(): Promise<string> {
  const response = await axiosInstance.get<string>(FILELOCATIONHISTORY_ENDPOINTS.generateNewFileLocationHistoryCode);
  return response.data;
}
