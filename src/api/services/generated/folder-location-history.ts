import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  StringObjectKeyValuePair,
  FolderLocationHistoryEntity,
  FolderLocationHistoryEntityResult,
  FolderLocationHistoryEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FolderLocationHistory Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * FolderLocationHistory API endpoints
 */
export const FOLDERLOCATIONHISTORY_ENDPOINTS = {
  getFolderLocationHistoryById: '/api/folderlocationhistory/{id}',
  getFolderLocationHistoryPage: '/api/folderlocationhistory/get-page',
  createFolderLocationHistory: '/api/folderlocationhistory/create',
  updateFolderLocationHistory: '/api/folderlocationhistory/update/{id}',
  deleteFolderLocationHistory: '/api/folderlocationhistory/delete/{id}',
  generateNewFolderLocationHistoryCode: '/api/folderlocationhistory/generate-new-code',
} as const;

/**
 * Get Folder Location History by ID
 *
 * Retrieves a specific Folder Location History entity by its unique identifier.
 * @returns Promise<FolderLocationHistoryEntity>
 */
export async function getFolderLocationHistoryById(
  id: string
): Promise<FolderLocationHistoryEntity> {
  const response = await axiosInstance.get<FolderLocationHistoryEntity>(
    `/api/folderlocationhistory/${id}`
  );
  return response.data;
}

/**
 * Get paginated list of Folder Location History
 *
 * Retrieves a paginated list of Folder Location History entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<FolderLocationHistoryEntityBasePaginationResponse>
 */
export async function getFolderLocationHistoryPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<FolderLocationHistoryEntityBasePaginationResponse> {
  const response = await axiosInstance.post<FolderLocationHistoryEntityBasePaginationResponse>(
    FOLDERLOCATIONHISTORY_ENDPOINTS.getFolderLocationHistoryPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Folder Location History
 *
 * Creates a new Folder Location History entity in the system.
 * @param data - Request body
 * @returns Promise<FolderLocationHistoryEntityResult>
 */
export async function createFolderLocationHistory(
  data: FolderLocationHistoryEntity
): Promise<FolderLocationHistoryEntityResult> {
  const response = await axiosInstance.post<FolderLocationHistoryEntityResult>(
    FOLDERLOCATIONHISTORY_ENDPOINTS.createFolderLocationHistory,
    data
  );
  return response.data;
}

/**
 * Update an existing Folder Location History
 *
 * Updates specific fields of an existing Folder Location History entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateFolderLocationHistory(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/folderlocationhistory/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a Folder Location History
 *
 * Deletes a Folder Location History entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteFolderLocationHistory(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(
    `/api/folderlocationhistory/delete/${id}`
  );
  return response.data;
}

/**
 * Generate a new code for Folder Location History
 *
 * Generates a new unique code for a Folder Location History entity.
 * @returns Promise<string>
 */
export async function generateNewFolderLocationHistoryCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    FOLDERLOCATIONHISTORY_ENDPOINTS.generateNewFolderLocationHistoryCode
  );
  return response.data;
}
