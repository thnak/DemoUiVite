import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  IoTDeviceEntity,
  IoTDeviceEntityResult,
  StringObjectKeyValuePair,
  IoTDeviceEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// IoTDevice Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * IoTDevice API endpoints
 */
export const IOTDEVICE_ENDPOINTS = {
  getIoTDeviceById: '/api/iotdevice/{id}',
  getIoTDevicePage: '/api/iotdevice/get-page',
  createIoTDevice: '/api/iotdevice/create',
  updateIoTDevice: '/api/iotdevice/update/{id}',
  deleteIoTDevice: '/api/iotdevice/delete/{id}',
  generateNewIoTDeviceCode: '/api/iotdevice/generate-new-code',
  searchIoTDevice: '/api/iotdevice/search',
} as const;

/**
 * Get Io TDevice by ID
 *
 * Retrieves a specific Io TDevice entity by its unique identifier.
 * @returns Promise<IoTDeviceEntity>
 */
export async function getIoTDeviceById(id: string): Promise<IoTDeviceEntity> {
  const response = await axiosInstance.get<IoTDeviceEntity>(`/api/iotdevice/${id}`);
  return response.data;
}

/**
 * Get paginated list of Io TDevice
 *
 * Retrieves a paginated list of Io TDevice entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<IoTDeviceEntityBasePaginationResponse>
 */
export async function getIoTDevicePage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<IoTDeviceEntityBasePaginationResponse> {
  const response = await axiosInstance.post<IoTDeviceEntityBasePaginationResponse>(
    IOTDEVICE_ENDPOINTS.getIoTDevicePage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Io TDevice
 *
 * Creates a new Io TDevice entity in the system.
 * @param data - Request body
 * @returns Promise<IoTDeviceEntityResult>
 */
export async function createIoTDevice(data: IoTDeviceEntity): Promise<IoTDeviceEntityResult> {
  const response = await axiosInstance.post<IoTDeviceEntityResult>(
    IOTDEVICE_ENDPOINTS.createIoTDevice,
    data
  );
  return response.data;
}

/**
 * Update an existing Io TDevice
 *
 * Updates specific fields of an existing Io TDevice entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateIoTDevice(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/iotdevice/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Io TDevice
 *
 * Deletes a Io TDevice entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteIoTDevice(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/iotdevice/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Io TDevice
 *
 * Generates a new unique code for a Io TDevice entity.
 * @returns Promise<string>
 */
export async function generateNewIoTDeviceCode(): Promise<string> {
  const response = await axiosInstance.get<string>(IOTDEVICE_ENDPOINTS.generateNewIoTDeviceCode);
  return response.data;
}

/**
 * Search Io TDevice entities
 *
 * Searches Io TDevice entities by text across searchable fields.
 * @returns Promise<IoTDeviceEntity[]>
 */
export async function searchIoTDevice(params?: {
  searchText?: string;
  maxResults?: number;
}): Promise<IoTDeviceEntity[]> {
  const response = await axiosInstance.get<IoTDeviceEntity[]>(IOTDEVICE_ENDPOINTS.searchIoTDevice, {
    params,
  });
  return response.data;
}
