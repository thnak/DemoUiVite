import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  SortType,
  StorageBlockEntity,
  StorageBlockEntityBasePaginationResponse,
  StorageBlockEntityResult,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// StorageBlock Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * StorageBlock API endpoints
 */
export const STORAGEBLOCK_ENDPOINTS = {
  getStorageBlockById: '/api/storageblock/{id}',
  getStorageBlockPage: '/api/storageblock/get-page',
  createStorageBlock: '/api/storageblock/create',
  updateStorageBlock: '/api/storageblock/update/{id}',
  deleteStorageBlock: '/api/storageblock/delete/{id}',
  generateNewStorageBlockCode: '/api/storageblock/generate-new-code',
} as const;

/**
 * Get Storage Block by ID
 *
 * Retrieves a specific Storage Block entity by its unique identifier.
 * @returns Promise<StorageBlockEntity>
 */
export async function getStorageBlockById(id: string): Promise<StorageBlockEntity> {
  const response = await axiosInstance.get<StorageBlockEntity>(`/api/storageblock/${id}`);
  return response.data;
}

/**
 * Get paginated list of Storage Block
 *
 * Retrieves a paginated list of Storage Block entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<StorageBlockEntityBasePaginationResponse>
 */
export async function getStorageBlockPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<StorageBlockEntityBasePaginationResponse> {
  const response = await axiosInstance.post<StorageBlockEntityBasePaginationResponse>(STORAGEBLOCK_ENDPOINTS.getStorageBlockPage, data, { params });
  return response.data;
}

/**
 * Create a new Storage Block
 *
 * Creates a new Storage Block entity in the system.
 * @param data - Request body
 * @returns Promise<StorageBlockEntityResult>
 */
export async function createStorageBlock(data: StorageBlockEntity): Promise<StorageBlockEntityResult> {
  const response = await axiosInstance.post<StorageBlockEntityResult>(STORAGEBLOCK_ENDPOINTS.createStorageBlock, data);
  return response.data;
}

/**
 * Update an existing Storage Block
 *
 * Updates specific fields of an existing Storage Block entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateStorageBlock(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/storageblock/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Storage Block
 *
 * Deletes a Storage Block entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteStorageBlock(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/storageblock/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Storage Block
 *
 * Generates a new unique code for a Storage Block entity.
 * @returns Promise<string>
 */
export async function generateNewStorageBlockCode(): Promise<string> {
  const response = await axiosInstance.get<string>(STORAGEBLOCK_ENDPOINTS.generateNewStorageBlockCode);
  return response.data;
}
