import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  IoTDeviceGroupEntity,
  StringObjectKeyValuePair,
  IoTDeviceGroupEntityResult,
  IoTDeviceGroupEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// IoTDeviceGroup Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * IoTDeviceGroup API endpoints
 */
export const IOTDEVICEGROUP_ENDPOINTS = {
  getIoTDeviceGroupById: '/api/iotdevicegroup/{id}',
  getIoTDeviceGroupPage: '/api/iotdevicegroup/get-page',
  createIoTDeviceGroup: '/api/iotdevicegroup/create',
  updateIoTDeviceGroup: '/api/iotdevicegroup/update/{id}',
  deleteIoTDeviceGroup: '/api/iotdevicegroup/delete/{id}',
  generateNewIoTDeviceGroupCode: '/api/iotdevicegroup/generate-new-code',
  searchIoTDeviceGroup: '/api/iotdevicegroup/search',
} as const;

/**
 * Get Io TDevice Group by ID
 *
 * Retrieves a specific Io TDevice Group entity by its unique identifier.
 * @returns Promise<IoTDeviceGroupEntity>
 */
export async function getIoTDeviceGroupById(id: string): Promise<IoTDeviceGroupEntity> {
  const response = await axiosInstance.get<IoTDeviceGroupEntity>(`/api/iotdevicegroup/${id}`);
  return response.data;
}

/**
 * Get paginated list of Io TDevice Group
 *
 * Retrieves a paginated list of Io TDevice Group entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<IoTDeviceGroupEntityBasePaginationResponse>
 */
export async function getIoTDeviceGroupPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<IoTDeviceGroupEntityBasePaginationResponse> {
  const response = await axiosInstance.post<IoTDeviceGroupEntityBasePaginationResponse>(
    IOTDEVICEGROUP_ENDPOINTS.getIoTDeviceGroupPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Io TDevice Group
 *
 * Creates a new Io TDevice Group entity in the system.
 * @param data - Request body
 * @returns Promise<IoTDeviceGroupEntityResult>
 */
export async function createIoTDeviceGroup(
  data: IoTDeviceGroupEntity
): Promise<IoTDeviceGroupEntityResult> {
  const response = await axiosInstance.post<IoTDeviceGroupEntityResult>(
    IOTDEVICEGROUP_ENDPOINTS.createIoTDeviceGroup,
    data
  );
  return response.data;
}

/**
 * Update an existing Io TDevice Group
 *
 * Updates specific fields of an existing Io TDevice Group entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateIoTDeviceGroup(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/iotdevicegroup/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a Io TDevice Group
 *
 * Deletes a Io TDevice Group entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteIoTDeviceGroup(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/iotdevicegroup/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Io TDevice Group
 *
 * Generates a new unique code for a Io TDevice Group entity.
 * @returns Promise<string>
 */
export async function generateNewIoTDeviceGroupCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    IOTDEVICEGROUP_ENDPOINTS.generateNewIoTDeviceGroupCode
  );
  return response.data;
}

/**
 * Search Io TDevice Group entities
 *
 * Searches Io TDevice Group entities by text across searchable fields.
 * @returns Promise<IoTDeviceGroupEntity[]>
 */
export async function searchIoTDeviceGroup(params?: {
  searchText?: string;
  maxResults?: number;
}): Promise<IoTDeviceGroupEntity[]> {
  const response = await axiosInstance.get<IoTDeviceGroupEntity[]>(
    IOTDEVICEGROUP_ENDPOINTS.searchIoTDeviceGroup,
    { params }
  );
  return response.data;
}
