import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  ProductionOrderEntity,
  ProductionOrderEntityBasePaginationResponse,
  ProductionOrderEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ProductionOrder Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ProductionOrder API endpoints
 */
export const PRODUCTIONORDER_ENDPOINTS = {
  getProductionOrderById: '/api/productionorder/{id}',
  getProductionOrderPage: '/api/productionorder/get-page',
  createProductionOrder: '/api/productionorder/create',
  updateProductionOrder: '/api/productionorder/update/{id}',
  deleteProductionOrder: '/api/productionorder/delete/{id}',
  generateNewProductionOrderCode: '/api/productionorder/generate-new-code',
} as const;

/**
 * Get Production Order by ID
 *
 * Retrieves a specific Production Order entity by its unique identifier.
 * @returns Promise<ProductionOrderEntity>
 */
export async function getProductionOrderById(id: string): Promise<ProductionOrderEntity> {
  const response = await axiosInstance.get<ProductionOrderEntity>(`/api/productionorder/${id}`);
  return response.data;
}

/**
 * Get paginated list of Production Order
 *
 * Retrieves a paginated list of Production Order entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ProductionOrderEntityBasePaginationResponse>
 */
export async function getProductionOrderPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ProductionOrderEntityBasePaginationResponse> {
  const response = await axiosInstance.post<ProductionOrderEntityBasePaginationResponse>(PRODUCTIONORDER_ENDPOINTS.getProductionOrderPage, data, { params });
  return response.data;
}

/**
 * Create a new Production Order
 *
 * Creates a new Production Order entity in the system.
 * @param data - Request body
 * @returns Promise<ProductionOrderEntityResult>
 */
export async function createProductionOrder(data: ProductionOrderEntity): Promise<ProductionOrderEntityResult> {
  const response = await axiosInstance.post<ProductionOrderEntityResult>(PRODUCTIONORDER_ENDPOINTS.createProductionOrder, data);
  return response.data;
}

/**
 * Update an existing Production Order
 *
 * Updates specific fields of an existing Production Order entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateProductionOrder(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/productionorder/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Production Order
 *
 * Deletes a Production Order entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteProductionOrder(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/productionorder/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Production Order
 *
 * Generates a new unique code for a Production Order entity.
 * @returns Promise<string>
 */
export async function generateNewProductionOrderCode(): Promise<string> {
  const response = await axiosInstance.get<string>(PRODUCTIONORDER_ENDPOINTS.generateNewProductionOrderCode);
  return response.data;
}
