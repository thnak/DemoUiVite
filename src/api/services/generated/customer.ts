import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  CustomerEntity,
  CustomerEntityResult,
  StringObjectKeyValuePair,
  CustomerEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Customer Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Customer API endpoints
 */
export const CUSTOMER_ENDPOINTS = {
  getCustomerById: '/api/customer/{id}',
  getCustomerPage: '/api/customer/get-page',
  createCustomer: '/api/customer/create',
  updateCustomer: '/api/customer/update/{id}',
  deleteCustomer: '/api/customer/delete/{id}',
  generateNewCustomerCode: '/api/customer/generate-new-code',
} as const;

/**
 * Get Customer by ID
 *
 * Retrieves a specific Customer entity by its unique identifier.
 * @returns Promise<CustomerEntity>
 */
export async function getCustomerById(id: string): Promise<CustomerEntity> {
  const response = await axiosInstance.get<CustomerEntity>(`/api/customer/${id}`);
  return response.data;
}

/**
 * Get paginated list of Customer
 *
 * Retrieves a paginated list of Customer entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<CustomerEntityBasePaginationResponse>
 */
export async function getCustomerPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<CustomerEntityBasePaginationResponse> {
  const response = await axiosInstance.post<CustomerEntityBasePaginationResponse>(CUSTOMER_ENDPOINTS.getCustomerPage, data, { params });
  return response.data;
}

/**
 * Create a new Customer
 *
 * Creates a new Customer entity in the system.
 * @param data - Request body
 * @returns Promise<CustomerEntityResult>
 */
export async function createCustomer(data: CustomerEntity): Promise<CustomerEntityResult> {
  const response = await axiosInstance.post<CustomerEntityResult>(CUSTOMER_ENDPOINTS.createCustomer, data);
  return response.data;
}

/**
 * Update an existing Customer
 *
 * Updates specific fields of an existing Customer entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateCustomer(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/customer/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Customer
 *
 * Deletes a Customer entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteCustomer(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/customer/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Customer
 *
 * Generates a new unique code for a Customer entity.
 * @returns Promise<string>
 */
export async function generateNewCustomerCode(): Promise<string> {
  const response = await axiosInstance.get<string>(CUSTOMER_ENDPOINTS.generateNewCustomerCode);
  return response.data;
}
