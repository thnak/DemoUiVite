import axiosInstance from '../../axios-instance';

import type {
  SortType,
  StopEntity,
  BooleanResult,
  StopEntityResult,
  StringObjectKeyValuePair,
  StopEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Stop Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Stop API endpoints
 */
export const STOP_ENDPOINTS = {
  getStopById: '/api/stop/{id}',
  getStopPage: '/api/stop/get-page',
  createStop: '/api/stop/create',
  updateStop: '/api/stop/update/{id}',
  deleteStop: '/api/stop/delete/{id}',
  generateNewStopCode: '/api/stop/generate-new-code',
} as const;

/**
 * Get Stop by ID
 *
 * Retrieves a specific Stop entity by its unique identifier.
 * @returns Promise<StopEntity>
 */
export async function getStopById(id: string): Promise<StopEntity> {
  const response = await axiosInstance.get<StopEntity>(`/api/stop/${id}`);
  return response.data;
}

/**
 * Get paginated list of Stop
 *
 * Retrieves a paginated list of Stop entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<StopEntityBasePaginationResponse>
 */
export async function getStopPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<StopEntityBasePaginationResponse> {
  const response = await axiosInstance.post<StopEntityBasePaginationResponse>(
    STOP_ENDPOINTS.getStopPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Stop
 *
 * Creates a new Stop entity in the system.
 * @param data - Request body
 * @returns Promise<StopEntityResult>
 */
export async function createStop(data: StopEntity): Promise<StopEntityResult> {
  const response = await axiosInstance.post<StopEntityResult>(STOP_ENDPOINTS.createStop, data);
  return response.data;
}

/**
 * Update an existing Stop
 *
 * Updates specific fields of an existing Stop entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateStop(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/stop/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Stop
 *
 * Deletes a Stop entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteStop(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/stop/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Stop
 *
 * Generates a new unique code for a Stop entity.
 * @returns Promise<string>
 */
export async function generateNewStopCode(): Promise<string> {
  const response = await axiosInstance.get<string>(STOP_ENDPOINTS.generateNewStopCode);
  return response.data;
}
