import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  ApiGatewayEntity,
  ApiGatewayEntityResult,
  StringObjectKeyValuePair,
  ApiGatewayEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ApiGateway Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * ApiGateway API endpoints
 */
export const APIGATEWAY_ENDPOINTS = {
  getApiGatewayById: '/api/apigateway/{id}',
  getApiGatewayPage: '/api/apigateway/get-page',
  createApiGateway: '/api/apigateway/create',
  updateApiGateway: '/api/apigateway/update/{id}',
  deleteApiGateway: '/api/apigateway/delete/{id}',
  generateNewApiGatewayCode: '/api/apigateway/generate-new-code',
} as const;

/**
 * Get Api Gateway by ID
 *
 * Retrieves a specific Api Gateway entity by its unique identifier.
 * @returns Promise<ApiGatewayEntity>
 */
export async function getApiGatewayById(id: string): Promise<ApiGatewayEntity> {
  const response = await axiosInstance.get<ApiGatewayEntity>(`/api/apigateway/${id}`);
  return response.data;
}

/**
 * Get paginated list of Api Gateway
 *
 * Retrieves a paginated list of Api Gateway entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<ApiGatewayEntityBasePaginationResponse>
 */
export async function getApiGatewayPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<ApiGatewayEntityBasePaginationResponse> {
  const response = await axiosInstance.post<ApiGatewayEntityBasePaginationResponse>(APIGATEWAY_ENDPOINTS.getApiGatewayPage, data, { params });
  return response.data;
}

/**
 * Create a new Api Gateway
 *
 * Creates a new Api Gateway entity in the system.
 * @param data - Request body
 * @returns Promise<ApiGatewayEntityResult>
 */
export async function createApiGateway(data: ApiGatewayEntity): Promise<ApiGatewayEntityResult> {
  const response = await axiosInstance.post<ApiGatewayEntityResult>(APIGATEWAY_ENDPOINTS.createApiGateway, data);
  return response.data;
}

/**
 * Update an existing Api Gateway
 *
 * Updates specific fields of an existing Api Gateway entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateApiGateway(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/apigateway/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Api Gateway
 *
 * Deletes a Api Gateway entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteApiGateway(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/apigateway/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Api Gateway
 *
 * Generates a new unique code for a Api Gateway entity.
 * @returns Promise<string>
 */
export async function generateNewApiGatewayCode(): Promise<string> {
  const response = await axiosInstance.get<string>(APIGATEWAY_ENDPOINTS.generateNewApiGatewayCode);
  return response.data;
}
