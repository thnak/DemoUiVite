import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  WorkOrderEntity,
  WorkOrderEntityResult,
  StringObjectKeyValuePair,
  WorkOrderEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// WorkOrder Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * WorkOrder API endpoints
 */
export const WORKORDER_ENDPOINTS = {
  getWorkOrderById: '/api/workorder/{id}',
  getWorkOrderPage: '/api/workorder/get-page',
  createWorkOrder: '/api/workorder/create',
  updateWorkOrder: '/api/workorder/update/{id}',
  deleteWorkOrder: '/api/workorder/delete/{id}',
  generateNewWorkOrderCode: '/api/workorder/generate-new-code',
} as const;

/**
 * Get Work Order by ID
 *
 * Retrieves a specific Work Order entity by its unique identifier.
 * @returns Promise<WorkOrderEntity>
 */
export async function getWorkOrderById(id: string): Promise<WorkOrderEntity> {
  const response = await axiosInstance.get<WorkOrderEntity>(`/api/workorder/${id}`);
  return response.data;
}

/**
 * Get paginated list of Work Order
 *
 * Retrieves a paginated list of Work Order entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<WorkOrderEntityBasePaginationResponse>
 */
export async function getWorkOrderPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<WorkOrderEntityBasePaginationResponse> {
  const response = await axiosInstance.post<WorkOrderEntityBasePaginationResponse>(WORKORDER_ENDPOINTS.getWorkOrderPage, data, { params });
  return response.data;
}

/**
 * Create a new Work Order
 *
 * Creates a new Work Order entity in the system.
 * @param data - Request body
 * @returns Promise<WorkOrderEntityResult>
 */
export async function createWorkOrder(data: WorkOrderEntity): Promise<WorkOrderEntityResult> {
  const response = await axiosInstance.post<WorkOrderEntityResult>(WORKORDER_ENDPOINTS.createWorkOrder, data);
  return response.data;
}

/**
 * Update an existing Work Order
 *
 * Updates specific fields of an existing Work Order entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateWorkOrder(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/workorder/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Work Order
 *
 * Deletes a Work Order entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteWorkOrder(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/workorder/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Work Order
 *
 * Generates a new unique code for a Work Order entity.
 * @returns Promise<string>
 */
export async function generateNewWorkOrderCode(): Promise<string> {
  const response = await axiosInstance.get<string>(WORKORDER_ENDPOINTS.generateNewWorkOrderCode);
  return response.data;
}
