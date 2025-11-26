import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  FilePublicLinkEntity,
  StringObjectKeyValuePair,
  FilePublicLinkEntityResult,
  FilePublicLinkEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FilePublicLink Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * FilePublicLink API endpoints
 */
export const FILEPUBLICLINK_ENDPOINTS = {
  getFilePublicLinkById: '/api/filepubliclink/{id}',
  getFilePublicLinkPage: '/api/filepubliclink/get-page',
  createFilePublicLink: '/api/filepubliclink/create',
  updateFilePublicLink: '/api/filepubliclink/update/{id}',
  deleteFilePublicLink: '/api/filepubliclink/delete/{id}',
  generateNewFilePublicLinkCode: '/api/filepubliclink/generate-new-code',
} as const;

/**
 * Get File Public Link by ID
 *
 * Retrieves a specific File Public Link entity by its unique identifier.
 * @returns Promise<FilePublicLinkEntity>
 */
export async function getFilePublicLinkById(id: string): Promise<FilePublicLinkEntity> {
  const response = await axiosInstance.get<FilePublicLinkEntity>(`/api/filepubliclink/${id}`);
  return response.data;
}

/**
 * Get paginated list of File Public Link
 *
 * Retrieves a paginated list of File Public Link entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<FilePublicLinkEntityBasePaginationResponse>
 */
export async function getFilePublicLinkPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<FilePublicLinkEntityBasePaginationResponse> {
  const response = await axiosInstance.post<FilePublicLinkEntityBasePaginationResponse>(
    FILEPUBLICLINK_ENDPOINTS.getFilePublicLinkPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new File Public Link
 *
 * Creates a new File Public Link entity in the system.
 * @param data - Request body
 * @returns Promise<FilePublicLinkEntityResult>
 */
export async function createFilePublicLink(
  data: FilePublicLinkEntity
): Promise<FilePublicLinkEntityResult> {
  const response = await axiosInstance.post<FilePublicLinkEntityResult>(
    FILEPUBLICLINK_ENDPOINTS.createFilePublicLink,
    data
  );
  return response.data;
}

/**
 * Update an existing File Public Link
 *
 * Updates specific fields of an existing File Public Link entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateFilePublicLink(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/filepubliclink/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a File Public Link
 *
 * Deletes a File Public Link entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteFilePublicLink(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/filepubliclink/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for File Public Link
 *
 * Generates a new unique code for a File Public Link entity.
 * @returns Promise<string>
 */
export async function generateNewFilePublicLinkCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    FILEPUBLICLINK_ENDPOINTS.generateNewFilePublicLinkCode
  );
  return response.data;
}
