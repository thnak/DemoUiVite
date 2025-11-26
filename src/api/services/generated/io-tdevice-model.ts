import axiosInstance from '../../axios-instance';

import type {
  BooleanResult,
  IoTDeviceModelEntity,
  IoTDeviceModelEntityBasePaginationResponse,
  IoTDeviceModelEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// IoTDeviceModel Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * IoTDeviceModel API endpoints
 */
export const IOTDEVICEMODEL_ENDPOINTS = {
  getIoTDeviceModelById: '/api/iotdevicemodel/{id}',
  getIoTDeviceModelPage: '/api/iotdevicemodel/get-page',
  createIoTDeviceModel: '/api/iotdevicemodel/create',
  updateIoTDeviceModel: '/api/iotdevicemodel/update/{id}',
  deleteIoTDeviceModel: '/api/iotdevicemodel/delete/{id}',
  generateNewIoTDeviceModelCode: '/api/iotdevicemodel/generate-new-code',
  searchIoTDeviceModel: '/api/iotdevicemodel/search',
} as const;

/**
 * Get Io TDevice Model by ID
 *
 * Retrieves a specific Io TDevice Model entity by its unique identifier.
 * @returns Promise<IoTDeviceModelEntity>
 */
export async function getIoTDeviceModelById(id: string): Promise<IoTDeviceModelEntity> {
  const response = await axiosInstance.get<IoTDeviceModelEntity>(`/api/iotdevicemodel/${id}`);
  return response.data;
}

/**
 * Get paginated list of Io TDevice Model
 *
 * Retrieves a paginated list of Io TDevice Model entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<IoTDeviceModelEntityBasePaginationResponse>
 */
export async function getIoTDeviceModelPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<IoTDeviceModelEntityBasePaginationResponse> {
  const response = await axiosInstance.post<IoTDeviceModelEntityBasePaginationResponse>(IOTDEVICEMODEL_ENDPOINTS.getIoTDeviceModelPage, data, { params });
  return response.data;
}

/**
 * Create a new Io TDevice Model
 *
 * Creates a new Io TDevice Model entity in the system.
 * @param data - Request body
 * @returns Promise<IoTDeviceModelEntityResult>
 */
export async function createIoTDeviceModel(data: IoTDeviceModelEntity): Promise<IoTDeviceModelEntityResult> {
  const response = await axiosInstance.post<IoTDeviceModelEntityResult>(IOTDEVICEMODEL_ENDPOINTS.createIoTDeviceModel, data);
  return response.data;
}

/**
 * Update an existing Io TDevice Model
 *
 * Updates specific fields of an existing Io TDevice Model entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateIoTDeviceModel(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/iotdevicemodel/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Io TDevice Model
 *
 * Deletes a Io TDevice Model entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteIoTDeviceModel(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/iotdevicemodel/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Io TDevice Model
 *
 * Generates a new unique code for a Io TDevice Model entity.
 * @returns Promise<string>
 */
export async function generateNewIoTDeviceModelCode(): Promise<string> {
  const response = await axiosInstance.get<string>(IOTDEVICEMODEL_ENDPOINTS.generateNewIoTDeviceModelCode);
  return response.data;
}

/**
 * Search Io TDevice Model entities
 *
 * Searches Io TDevice Model entities by text across searchable fields.
 * @returns Promise<IoTDeviceModelEntity[]>
 */
export async function searchIoTDeviceModel(params?: { searchText?: string; maxResults?: number }): Promise<IoTDeviceModelEntity[]> {
  const response = await axiosInstance.get<IoTDeviceModelEntity[]>(IOTDEVICEMODEL_ENDPOINTS.searchIoTDeviceModel, { params });
  return response.data;
}
