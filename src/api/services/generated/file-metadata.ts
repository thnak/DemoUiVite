import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  FileMetadataEntity,
  FileMetadataEntityResult,
  StringObjectKeyValuePair,
  FileMetadataEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FileMetadata Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * FileMetadata API endpoints
 */
export const FILEMETADATA_ENDPOINTS = {
  getFileMetadataById: '/api/filemetadata/{id}',
  getFileMetadataPage: '/api/filemetadata/get-page',
  createFileMetadata: '/api/filemetadata/create',
  updateFileMetadata: '/api/filemetadata/update/{id}',
  deleteFileMetadata: '/api/filemetadata/delete/{id}',
  generateNewFileMetadataCode: '/api/filemetadata/generate-new-code',
} as const;

/**
 * Get File Metadata by ID
 *
 * Retrieves a specific File Metadata entity by its unique identifier.
 * @returns Promise<FileMetadataEntity>
 */
export async function getFileMetadataById(id: string): Promise<FileMetadataEntity> {
  const response = await axiosInstance.get<FileMetadataEntity>(`/api/filemetadata/${id}`);
  return response.data;
}

/**
 * Get paginated list of File Metadata
 *
 * Retrieves a paginated list of File Metadata entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<FileMetadataEntityBasePaginationResponse>
 */
export async function getFileMetadataPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<FileMetadataEntityBasePaginationResponse> {
  const response = await axiosInstance.post<FileMetadataEntityBasePaginationResponse>(
    FILEMETADATA_ENDPOINTS.getFileMetadataPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new File Metadata
 *
 * Creates a new File Metadata entity in the system.
 * @param data - Request body
 * @returns Promise<FileMetadataEntityResult>
 */
export async function createFileMetadata(
  data: FileMetadataEntity
): Promise<FileMetadataEntityResult> {
  const response = await axiosInstance.post<FileMetadataEntityResult>(
    FILEMETADATA_ENDPOINTS.createFileMetadata,
    data
  );
  return response.data;
}

/**
 * Update an existing File Metadata
 *
 * Updates specific fields of an existing File Metadata entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateFileMetadata(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/filemetadata/update/${id}`, data);
  return response.data;
}

/**
 * Delete a File Metadata
 *
 * Deletes a File Metadata entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteFileMetadata(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/filemetadata/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for File Metadata
 *
 * Generates a new unique code for a File Metadata entity.
 * @returns Promise<string>
 */
export async function generateNewFileMetadataCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    FILEMETADATA_ENDPOINTS.generateNewFileMetadataCode
  );
  return response.data;
}
