import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  WarehouseEntity,
  WarehouseEntityBasePaginationResponse,
  WarehouseEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Warehouse Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Warehouse API endpoints
 */
export const WAREHOUSE_ENDPOINTS = {
  getWarehouseById: '/api/warehouse/{id}',
  getWarehousePage: '/api/warehouse/get-page',
  createWarehouse: '/api/warehouse/create',
  updateWarehouse: '/api/warehouse/update/{id}',
  deleteWarehouse: '/api/warehouse/delete/{id}',
  generateNewWarehouseCode: '/api/warehouse/generate-new-code',
} as const;

/**
 * Get Warehouse by ID
 *
 * Retrieves a specific Warehouse entity by its unique identifier.
 * @returns Promise<WarehouseEntity>
 */
export async function getWarehouseById(id: string): Promise<WarehouseEntity> {
  const response = await axiosInstance.get<WarehouseEntity>(`/api/warehouse/${id}`);
  return response.data;
}

/**
 * Get paginated list of Warehouse
 *
 * Retrieves a paginated list of Warehouse entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<WarehouseEntityBasePaginationResponse>
 */
export async function getWarehousePage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<WarehouseEntityBasePaginationResponse> {
  const response = await axiosInstance.post<WarehouseEntityBasePaginationResponse>(WAREHOUSE_ENDPOINTS.getWarehousePage, data, { params });
  return response.data;
}

/**
 * Create a new Warehouse
 *
 * Creates a new Warehouse entity in the system.
 * @param data - Request body
 * @returns Promise<WarehouseEntityResult>
 */
export async function createWarehouse(data: WarehouseEntity): Promise<WarehouseEntityResult> {
  const response = await axiosInstance.post<WarehouseEntityResult>(WAREHOUSE_ENDPOINTS.createWarehouse, data);
  return response.data;
}

/**
 * Update an existing Warehouse
 *
 * Updates specific fields of an existing Warehouse entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateWarehouse(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/warehouse/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Warehouse
 *
 * Deletes a Warehouse entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteWarehouse(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/warehouse/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Warehouse
 *
 * Generates a new unique code for a Warehouse entity.
 * @returns Promise<string>
 */
export async function generateNewWarehouseCode(): Promise<string> {
  const response = await axiosInstance.get<string>(WAREHOUSE_ENDPOINTS.generateNewWarehouseCode);
  return response.data;
}
