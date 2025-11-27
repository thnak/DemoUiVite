import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  OperationEntity,
  OperationEntityResult,
  StringObjectKeyValuePair,
  OperationEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Operation Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Operation API endpoints
 */
export const OPERATION_ENDPOINTS = {
  getOperationById: '/api/operation/{id}',
  getOperationPage: '/api/operation/get-page',
  createOperation: '/api/operation/create',
  updateOperation: '/api/operation/update/{id}',
  deleteOperation: '/api/operation/delete/{id}',
  generateNewOperationCode: '/api/operation/generate-new-code',
  searchOperation: '/api/operation/search',
  getapiOperationsearchbycode: '/api/Operation/search-by-code',
} as const;

/**
 * Get Operation by ID
 *
 * Retrieves a specific Operation entity by its unique identifier.
 * @returns Promise<OperationEntity>
 */
export async function getOperationById(id: string): Promise<OperationEntity> {
  const response = await axiosInstance.get<OperationEntity>(`/api/operation/${id}`);
  return response.data;
}

/**
 * Get paginated list of Operation
 *
 * Retrieves a paginated list of Operation entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<OperationEntityBasePaginationResponse>
 */
export async function getOperationPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<OperationEntityBasePaginationResponse> {
  const response = await axiosInstance.post<OperationEntityBasePaginationResponse>(OPERATION_ENDPOINTS.getOperationPage, data, { params });
  return response.data;
}

/**
 * Create a new Operation
 *
 * Creates a new Operation entity in the system.
 * @param data - Request body
 * @returns Promise<OperationEntityResult>
 */
export async function createOperation(data: OperationEntity): Promise<OperationEntityResult> {
  const response = await axiosInstance.post<OperationEntityResult>(OPERATION_ENDPOINTS.createOperation, data);
  return response.data;
}

/**
 * Update an existing Operation
 *
 * Updates specific fields of an existing Operation entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateOperation(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/operation/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Operation
 *
 * Deletes a Operation entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteOperation(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/operation/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Operation
 *
 * Generates a new unique code for a Operation entity.
 * @returns Promise<string>
 */
export async function generateNewOperationCode(): Promise<string> {
  const response = await axiosInstance.get<string>(OPERATION_ENDPOINTS.generateNewOperationCode);
  return response.data;
}

/**
 * Search Operation entities
 *
 * Searches Operation entities by text across searchable fields.
 * @returns Promise<OperationEntity[]>
 */
export async function searchOperation(params?: { searchText?: string; maxResults?: number }): Promise<OperationEntity[]> {
  const response = await axiosInstance.get<OperationEntity[]>(OPERATION_ENDPOINTS.searchOperation, { params });
  return response.data;
}

/**
 * @returns Promise<void>
 */
export async function getapiOperationsearchbycode(params?: { keyword?: string }): Promise<void> {
  await axiosInstance.get(OPERATION_ENDPOINTS.getapiOperationsearchbycode, { params });
}
