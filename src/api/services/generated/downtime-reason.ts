import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  DowntimeReasonEntity,
  StringObjectKeyValuePair,
  DowntimeReasonEntityResult,
  DowntimeReasonEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DowntimeReason Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * DowntimeReason API endpoints
 */
export const DOWNTIMEREASON_ENDPOINTS = {
  getDowntimeReasonById: '/api/downtimereason/{id}',
  getDowntimeReasonPage: '/api/downtimereason/get-page',
  createDowntimeReason: '/api/downtimereason/create',
  updateDowntimeReason: '/api/downtimereason/update/{id}',
  deleteDowntimeReason: '/api/downtimereason/delete/{id}',
  generateNewDowntimeReasonCode: '/api/downtimereason/generate-new-code',
  searchDowntimeReason: '/api/downtimereason/search',
} as const;

/**
 * Get Downtime Reason by ID
 *
 * Retrieves a specific Downtime Reason entity by its unique identifier.
 * @returns Promise<DowntimeReasonEntity>
 */
export async function getDowntimeReasonById(id: string): Promise<DowntimeReasonEntity> {
  const response = await axiosInstance.get<DowntimeReasonEntity>(`/api/downtimereason/${id}`);
  return response.data;
}

/**
 * Get paginated list of Downtime Reason
 *
 * Retrieves a paginated list of Downtime Reason entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<DowntimeReasonEntityBasePaginationResponse>
 */
export async function getDowntimeReasonPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<DowntimeReasonEntityBasePaginationResponse> {
  const response = await axiosInstance.post<DowntimeReasonEntityBasePaginationResponse>(
    DOWNTIMEREASON_ENDPOINTS.getDowntimeReasonPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Downtime Reason
 *
 * Creates a new Downtime Reason entity in the system.
 * @param data - Request body
 * @returns Promise<DowntimeReasonEntityResult>
 */
export async function createDowntimeReason(
  data: DowntimeReasonEntity
): Promise<DowntimeReasonEntityResult> {
  const response = await axiosInstance.post<DowntimeReasonEntityResult>(
    DOWNTIMEREASON_ENDPOINTS.createDowntimeReason,
    data
  );
  return response.data;
}

/**
 * Update an existing Downtime Reason
 *
 * Updates specific fields of an existing Downtime Reason entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateDowntimeReason(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/downtimereason/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a Downtime Reason
 *
 * Deletes a Downtime Reason entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteDowntimeReason(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/downtimereason/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Downtime Reason
 *
 * Generates a new unique code for a Downtime Reason entity.
 * @returns Promise<string>
 */
export async function generateNewDowntimeReasonCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    DOWNTIMEREASON_ENDPOINTS.generateNewDowntimeReasonCode
  );
  return response.data;
}

/**
 * Search Downtime Reason entities
 *
 * Searches Downtime Reason entities by text across searchable fields.
 * @returns Promise<DowntimeReasonEntity[]>
 */
export async function searchDowntimeReason(params?: {
  searchText?: string;
  maxResults?: number;
}): Promise<DowntimeReasonEntity[]> {
  const response = await axiosInstance.get<DowntimeReasonEntity[]>(
    DOWNTIMEREASON_ENDPOINTS.searchDowntimeReason,
    { params }
  );
  return response.data;
}
