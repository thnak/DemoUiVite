import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  StorageRecordEntity,
  StringObjectKeyValuePair,
  StorageRecordEntityResult,
  StorageRecordEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// StorageRecord Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * StorageRecord API endpoints
 */
export const STORAGERECORD_ENDPOINTS = {
  getStorageRecordById: '/api/storagerecord/{id}',
  getStorageRecordPage: '/api/storagerecord/get-page',
  createStorageRecord: '/api/storagerecord/create',
  updateStorageRecord: '/api/storagerecord/update/{id}',
  deleteStorageRecord: '/api/storagerecord/delete/{id}',
  generateNewStorageRecordCode: '/api/storagerecord/generate-new-code',
} as const;

/**
 * Get Storage Record by ID
 *
 * Retrieves a specific Storage Record entity by its unique identifier.
 * @returns Promise<StorageRecordEntity>
 */
export async function getStorageRecordById(id: string): Promise<StorageRecordEntity> {
  const response = await axiosInstance.get<StorageRecordEntity>(`/api/storagerecord/${id}`);
  return response.data;
}

/**
 * Get paginated list of Storage Record
 *
 * Retrieves a paginated list of Storage Record entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<StorageRecordEntityBasePaginationResponse>
 */
export async function getStorageRecordPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<StorageRecordEntityBasePaginationResponse> {
  const response = await axiosInstance.post<StorageRecordEntityBasePaginationResponse>(
    STORAGERECORD_ENDPOINTS.getStorageRecordPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Storage Record
 *
 * Creates a new Storage Record entity in the system.
 * @param data - Request body
 * @returns Promise<StorageRecordEntityResult>
 */
export async function createStorageRecord(
  data: StorageRecordEntity
): Promise<StorageRecordEntityResult> {
  const response = await axiosInstance.post<StorageRecordEntityResult>(
    STORAGERECORD_ENDPOINTS.createStorageRecord,
    data
  );
  return response.data;
}

/**
 * Update an existing Storage Record
 *
 * Updates specific fields of an existing Storage Record entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateStorageRecord(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/storagerecord/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Storage Record
 *
 * Deletes a Storage Record entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteStorageRecord(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/storagerecord/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Storage Record
 *
 * Generates a new unique code for a Storage Record entity.
 * @returns Promise<string>
 */
export async function generateNewStorageRecordCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    STORAGERECORD_ENDPOINTS.generateNewStorageRecordCode
  );
  return response.data;
}
