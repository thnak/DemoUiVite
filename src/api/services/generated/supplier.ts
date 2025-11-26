import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  SupplierEntity,
  SupplierEntityResult,
  StringObjectKeyValuePair,
  SupplierEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Supplier Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Supplier API endpoints
 */
export const SUPPLIER_ENDPOINTS = {
  getSupplierById: '/api/supplier/{id}',
  getSupplierPage: '/api/supplier/get-page',
  createSupplier: '/api/supplier/create',
  updateSupplier: '/api/supplier/update/{id}',
  deleteSupplier: '/api/supplier/delete/{id}',
  generateNewSupplierCode: '/api/supplier/generate-new-code',
} as const;

/**
 * Get Supplier by ID
 *
 * Retrieves a specific Supplier entity by its unique identifier.
 * @returns Promise<SupplierEntity>
 */
export async function getSupplierById(id: string): Promise<SupplierEntity> {
  const response = await axiosInstance.get<SupplierEntity>(`/api/supplier/${id}`);
  return response.data;
}

/**
 * Get paginated list of Supplier
 *
 * Retrieves a paginated list of Supplier entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<SupplierEntityBasePaginationResponse>
 */
export async function getSupplierPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<SupplierEntityBasePaginationResponse> {
  const response = await axiosInstance.post<SupplierEntityBasePaginationResponse>(SUPPLIER_ENDPOINTS.getSupplierPage, data, { params });
  return response.data;
}

/**
 * Create a new Supplier
 *
 * Creates a new Supplier entity in the system.
 * @param data - Request body
 * @returns Promise<SupplierEntityResult>
 */
export async function createSupplier(data: SupplierEntity): Promise<SupplierEntityResult> {
  const response = await axiosInstance.post<SupplierEntityResult>(SUPPLIER_ENDPOINTS.createSupplier, data);
  return response.data;
}

/**
 * Update an existing Supplier
 *
 * Updates specific fields of an existing Supplier entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateSupplier(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/supplier/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Supplier
 *
 * Deletes a Supplier entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteSupplier(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/supplier/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Supplier
 *
 * Generates a new unique code for a Supplier entity.
 * @returns Promise<string>
 */
export async function generateNewSupplierCode(): Promise<string> {
  const response = await axiosInstance.get<string>(SUPPLIER_ENDPOINTS.generateNewSupplierCode);
  return response.data;
}
