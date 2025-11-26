import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  DataProtectionKeyEntity,
  DataProtectionKeyEntityBasePaginationResponse,
  DataProtectionKeyEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DataProtectionKey Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * DataProtectionKey API endpoints
 */
export const DATAPROTECTIONKEY_ENDPOINTS = {
  getDataProtectionKeyById: '/api/dataprotectionkey/{id}',
  getDataProtectionKeyPage: '/api/dataprotectionkey/get-page',
  createDataProtectionKey: '/api/dataprotectionkey/create',
  updateDataProtectionKey: '/api/dataprotectionkey/update/{id}',
  deleteDataProtectionKey: '/api/dataprotectionkey/delete/{id}',
  generateNewDataProtectionKeyCode: '/api/dataprotectionkey/generate-new-code',
} as const;

/**
 * Get Data Protection Key by ID
 *
 * Retrieves a specific Data Protection Key entity by its unique identifier.
 * @returns Promise<DataProtectionKeyEntity>
 */
export async function getDataProtectionKeyById(id: string): Promise<DataProtectionKeyEntity> {
  const response = await axiosInstance.get<DataProtectionKeyEntity>(`/api/dataprotectionkey/${id}`);
  return response.data;
}

/**
 * Get paginated list of Data Protection Key
 *
 * Retrieves a paginated list of Data Protection Key entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<DataProtectionKeyEntityBasePaginationResponse>
 */
export async function getDataProtectionKeyPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<DataProtectionKeyEntityBasePaginationResponse> {
  const response = await axiosInstance.post<DataProtectionKeyEntityBasePaginationResponse>(DATAPROTECTIONKEY_ENDPOINTS.getDataProtectionKeyPage, data, { params });
  return response.data;
}

/**
 * Create a new Data Protection Key
 *
 * Creates a new Data Protection Key entity in the system.
 * @param data - Request body
 * @returns Promise<DataProtectionKeyEntityResult>
 */
export async function createDataProtectionKey(data: DataProtectionKeyEntity): Promise<DataProtectionKeyEntityResult> {
  const response = await axiosInstance.post<DataProtectionKeyEntityResult>(DATAPROTECTIONKEY_ENDPOINTS.createDataProtectionKey, data);
  return response.data;
}

/**
 * Update an existing Data Protection Key
 *
 * Updates specific fields of an existing Data Protection Key entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateDataProtectionKey(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/dataprotectionkey/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Data Protection Key
 *
 * Deletes a Data Protection Key entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteDataProtectionKey(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/dataprotectionkey/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Data Protection Key
 *
 * Generates a new unique code for a Data Protection Key entity.
 * @returns Promise<string>
 */
export async function generateNewDataProtectionKeyCode(): Promise<string> {
  const response = await axiosInstance.get<string>(DATAPROTECTIONKEY_ENDPOINTS.generateNewDataProtectionKeyCode);
  return response.data;
}
