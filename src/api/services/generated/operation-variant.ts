import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  OperationVariantEntity,
  StringObjectKeyValuePair,
  OperationVariantEntityResult,
  OperationVariantEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// OperationVariant Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * OperationVariant API endpoints
 */
export const OPERATIONVARIANT_ENDPOINTS = {
  getOperationVariantById: '/api/operationvariant/{id}',
  getOperationVariantPage: '/api/operationvariant/get-page',
  createOperationVariant: '/api/operationvariant/create',
  updateOperationVariant: '/api/operationvariant/update/{id}',
  deleteOperationVariant: '/api/operationvariant/delete/{id}',
  generateNewOperationVariantCode: '/api/operationvariant/generate-new-code',
} as const;

/**
 * Get Operation Variant by ID
 *
 * Retrieves a specific Operation Variant entity by its unique identifier.
 * @returns Promise<OperationVariantEntity>
 */
export async function getOperationVariantById(id: string): Promise<OperationVariantEntity> {
  const response = await axiosInstance.get<OperationVariantEntity>(`/api/operationvariant/${id}`);
  return response.data;
}

/**
 * Get paginated list of Operation Variant
 *
 * Retrieves a paginated list of Operation Variant entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<OperationVariantEntityBasePaginationResponse>
 */
export async function getOperationVariantPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<OperationVariantEntityBasePaginationResponse> {
  const response = await axiosInstance.post<OperationVariantEntityBasePaginationResponse>(
    OPERATIONVARIANT_ENDPOINTS.getOperationVariantPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Operation Variant
 *
 * Creates a new Operation Variant entity in the system.
 * @param data - Request body
 * @returns Promise<OperationVariantEntityResult>
 */
export async function createOperationVariant(
  data: OperationVariantEntity
): Promise<OperationVariantEntityResult> {
  const response = await axiosInstance.post<OperationVariantEntityResult>(
    OPERATIONVARIANT_ENDPOINTS.createOperationVariant,
    data
  );
  return response.data;
}

/**
 * Update an existing Operation Variant
 *
 * Updates specific fields of an existing Operation Variant entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateOperationVariant(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/operationvariant/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a Operation Variant
 *
 * Deletes a Operation Variant entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteOperationVariant(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/operationvariant/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Operation Variant
 *
 * Generates a new unique code for a Operation Variant entity.
 * @returns Promise<string>
 */
export async function generateNewOperationVariantCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    OPERATIONVARIANT_ENDPOINTS.generateNewOperationVariantCode
  );
  return response.data;
}
