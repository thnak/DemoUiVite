import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  IoTSensorEntity,
  IoTSensorEntityResult,
  StringObjectKeyValuePair,
  IoTSensorEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// IoTSensor Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * IoTSensor API endpoints
 */
export const IOTSENSOR_ENDPOINTS = {
  getIoTSensorById: '/api/iotsensor/{id}',
  getIoTSensorPage: '/api/iotsensor/get-page',
  createIoTSensor: '/api/iotsensor/create',
  updateIoTSensor: '/api/iotsensor/update/{id}',
  deleteIoTSensor: '/api/iotsensor/delete/{id}',
  generateNewIoTSensorCode: '/api/iotsensor/generate-new-code',
  searchIoTSensor: '/api/iotsensor/search',
} as const;

/**
 * Get Io TSensor by ID
 *
 * Retrieves a specific Io TSensor entity by its unique identifier.
 * @returns Promise<IoTSensorEntity>
 */
export async function getIoTSensorById(id: string): Promise<IoTSensorEntity> {
  const response = await axiosInstance.get<IoTSensorEntity>(`/api/iotsensor/${id}`);
  return response.data;
}

/**
 * Get paginated list of Io TSensor
 *
 * Retrieves a paginated list of Io TSensor entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<IoTSensorEntityBasePaginationResponse>
 */
export async function getIoTSensorPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<IoTSensorEntityBasePaginationResponse> {
  const response = await axiosInstance.post<IoTSensorEntityBasePaginationResponse>(
    IOTSENSOR_ENDPOINTS.getIoTSensorPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Io TSensor
 *
 * Creates a new Io TSensor entity in the system.
 * @param data - Request body
 * @returns Promise<IoTSensorEntityResult>
 */
export async function createIoTSensor(data: IoTSensorEntity): Promise<IoTSensorEntityResult> {
  const response = await axiosInstance.post<IoTSensorEntityResult>(
    IOTSENSOR_ENDPOINTS.createIoTSensor,
    data
  );
  return response.data;
}

/**
 * Update an existing Io TSensor
 *
 * Updates specific fields of an existing Io TSensor entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateIoTSensor(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/iotsensor/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Io TSensor
 *
 * Deletes a Io TSensor entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteIoTSensor(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/iotsensor/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Io TSensor
 *
 * Generates a new unique code for a Io TSensor entity.
 * @returns Promise<string>
 */
export async function generateNewIoTSensorCode(): Promise<string> {
  const response = await axiosInstance.get<string>(IOTSENSOR_ENDPOINTS.generateNewIoTSensorCode);
  return response.data;
}

/**
 * Search Io TSensor entities
 *
 * Searches Io TSensor entities by text across searchable fields.
 * @returns Promise<IoTSensorEntity[]>
 */
export async function searchIoTSensor(params?: {
  searchText?: string;
  maxResults?: number;
}): Promise<IoTSensorEntity[]> {
  const response = await axiosInstance.get<IoTSensorEntity[]>(IOTSENSOR_ENDPOINTS.searchIoTSensor, {
    params,
  });
  return response.data;
}
