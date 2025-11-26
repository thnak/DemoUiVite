import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  DowntimeInput,
  DowntimeInputResult,
  StringObjectKeyValuePair,
  DowntimeInputBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DowntimeInput Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * DowntimeInput API endpoints
 */
export const DOWNTIMEINPUT_ENDPOINTS = {
  getDowntimeInputById: '/api/downtimeinput/{id}',
  getDowntimeInputPage: '/api/downtimeinput/get-page',
  createDowntimeInput: '/api/downtimeinput/create',
  updateDowntimeInput: '/api/downtimeinput/update/{id}',
  deleteDowntimeInput: '/api/downtimeinput/delete/{id}',
  generateNewDowntimeInputCode: '/api/downtimeinput/generate-new-code',
} as const;

/**
 * Get Downtime Input by ID
 *
 * Retrieves a specific Downtime Input entity by its unique identifier.
 * @returns Promise<DowntimeInput>
 */
export async function getDowntimeInputById(id: string): Promise<DowntimeInput> {
  const response = await axiosInstance.get<DowntimeInput>(`/api/downtimeinput/${id}`);
  return response.data;
}

/**
 * Get paginated list of Downtime Input
 *
 * Retrieves a paginated list of Downtime Input entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<DowntimeInputBasePaginationResponse>
 */
export async function getDowntimeInputPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<DowntimeInputBasePaginationResponse> {
  const response = await axiosInstance.post<DowntimeInputBasePaginationResponse>(DOWNTIMEINPUT_ENDPOINTS.getDowntimeInputPage, data, { params });
  return response.data;
}

/**
 * Create a new Downtime Input
 *
 * Creates a new Downtime Input entity in the system.
 * @param data - Request body
 * @returns Promise<DowntimeInputResult>
 */
export async function createDowntimeInput(data: DowntimeInput): Promise<DowntimeInputResult> {
  const response = await axiosInstance.post<DowntimeInputResult>(DOWNTIMEINPUT_ENDPOINTS.createDowntimeInput, data);
  return response.data;
}

/**
 * Update an existing Downtime Input
 *
 * Updates specific fields of an existing Downtime Input entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateDowntimeInput(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/downtimeinput/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Downtime Input
 *
 * Deletes a Downtime Input entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteDowntimeInput(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/downtimeinput/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Downtime Input
 *
 * Generates a new unique code for a Downtime Input entity.
 * @returns Promise<string>
 */
export async function generateNewDowntimeInputCode(): Promise<string> {
  const response = await axiosInstance.get<string>(DOWNTIMEINPUT_ENDPOINTS.generateNewDowntimeInputCode);
  return response.data;
}
