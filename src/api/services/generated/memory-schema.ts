import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  MemorySchemaEntity,
  MemorySchemaEntityResult,
  StringObjectKeyValuePair,
  MemorySchemaEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MemorySchema Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * MemorySchema API endpoints
 */
export const MEMORYSCHEMA_ENDPOINTS = {
  getMemorySchemaById: '/api/memoryschema/{id}',
  getMemorySchemaPage: '/api/memoryschema/get-page',
  createMemorySchema: '/api/memoryschema/create',
  updateMemorySchema: '/api/memoryschema/update/{id}',
  deleteMemorySchema: '/api/memoryschema/delete/{id}',
  generateNewMemorySchemaCode: '/api/memoryschema/generate-new-code',
} as const;

/**
 * Get Memory Schema by ID
 *
 * Retrieves a specific Memory Schema entity by its unique identifier.
 * @returns Promise<MemorySchemaEntity>
 */
export async function getMemorySchemaById(id: string): Promise<MemorySchemaEntity> {
  const response = await axiosInstance.get<MemorySchemaEntity>(`/api/memoryschema/${id}`);
  return response.data;
}

/**
 * Get paginated list of Memory Schema
 *
 * Retrieves a paginated list of Memory Schema entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<MemorySchemaEntityBasePaginationResponse>
 */
export async function getMemorySchemaPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<MemorySchemaEntityBasePaginationResponse> {
  const response = await axiosInstance.post<MemorySchemaEntityBasePaginationResponse>(
    MEMORYSCHEMA_ENDPOINTS.getMemorySchemaPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Memory Schema
 *
 * Creates a new Memory Schema entity in the system.
 * @param data - Request body
 * @returns Promise<MemorySchemaEntityResult>
 */
export async function createMemorySchema(
  data: MemorySchemaEntity
): Promise<MemorySchemaEntityResult> {
  const response = await axiosInstance.post<MemorySchemaEntityResult>(
    MEMORYSCHEMA_ENDPOINTS.createMemorySchema,
    data
  );
  return response.data;
}

/**
 * Update an existing Memory Schema
 *
 * Updates specific fields of an existing Memory Schema entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateMemorySchema(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/memoryschema/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Memory Schema
 *
 * Deletes a Memory Schema entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteMemorySchema(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/memoryschema/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Memory Schema
 *
 * Generates a new unique code for a Memory Schema entity.
 * @returns Promise<string>
 */
export async function generateNewMemorySchemaCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    MEMORYSCHEMA_ENDPOINTS.generateNewMemorySchemaCode
  );
  return response.data;
}
