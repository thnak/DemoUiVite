import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  RoutingEntity,
  RoutingEntityBasePaginationResponse,
  RoutingEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Routing Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Routing API endpoints
 */
export const ROUTING_ENDPOINTS = {
  getRoutingById: '/api/routing/{id}',
  getRoutingPage: '/api/routing/get-page',
  createRouting: '/api/routing/create',
  updateRouting: '/api/routing/update/{id}',
  deleteRouting: '/api/routing/delete/{id}',
  generateNewRoutingCode: '/api/routing/generate-new-code',
} as const;

/**
 * Get Routing by ID
 *
 * Retrieves a specific Routing entity by its unique identifier.
 * @returns Promise<RoutingEntity>
 */
export async function getRoutingById(id: string): Promise<RoutingEntity> {
  const response = await axiosInstance.get<RoutingEntity>(`/api/routing/${id}`);
  return response.data;
}

/**
 * Get paginated list of Routing
 *
 * Retrieves a paginated list of Routing entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<RoutingEntityBasePaginationResponse>
 */
export async function getRoutingPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<RoutingEntityBasePaginationResponse> {
  const response = await axiosInstance.post<RoutingEntityBasePaginationResponse>(ROUTING_ENDPOINTS.getRoutingPage, data, { params });
  return response.data;
}

/**
 * Create a new Routing
 *
 * Creates a new Routing entity in the system.
 * @param data - Request body
 * @returns Promise<RoutingEntityResult>
 */
export async function createRouting(data: RoutingEntity): Promise<RoutingEntityResult> {
  const response = await axiosInstance.post<RoutingEntityResult>(ROUTING_ENDPOINTS.createRouting, data);
  return response.data;
}

/**
 * Update an existing Routing
 *
 * Updates specific fields of an existing Routing entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateRouting(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/routing/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Routing
 *
 * Deletes a Routing entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteRouting(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/routing/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Routing
 *
 * Generates a new unique code for a Routing entity.
 * @returns Promise<string>
 */
export async function generateNewRoutingCode(): Promise<string> {
  const response = await axiosInstance.get<string>(ROUTING_ENDPOINTS.generateNewRoutingCode);
  return response.data;
}
