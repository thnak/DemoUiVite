import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  DowntimeGroupEntity,
  StringObjectKeyValuePair,
  DowntimeGroupEntityResult,
  DowntimeGroupEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DowntimeGroup Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * DowntimeGroup API endpoints
 */
export const DOWNTIMEGROUP_ENDPOINTS = {
  getDowntimeGroupById: '/api/downtimegroup/{id}',
  getDowntimeGroupPage: '/api/downtimegroup/get-page',
  createDowntimeGroup: '/api/downtimegroup/create',
  updateDowntimeGroup: '/api/downtimegroup/update/{id}',
  deleteDowntimeGroup: '/api/downtimegroup/delete/{id}',
  generateNewDowntimeGroupCode: '/api/downtimegroup/generate-new-code',
  searchDowntimeGroup: '/api/downtimegroup/search',
} as const;

/**
 * Get Downtime Group by ID
 *
 * Retrieves a specific Downtime Group entity by its unique identifier.
 * @returns Promise<DowntimeGroupEntity>
 */
export async function getDowntimeGroupById(id: string): Promise<DowntimeGroupEntity> {
  const response = await axiosInstance.get<DowntimeGroupEntity>(`/api/downtimegroup/${id}`);
  return response.data;
}

/**
 * Get paginated list of Downtime Group
 *
 * Retrieves a paginated list of Downtime Group entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<DowntimeGroupEntityBasePaginationResponse>
 */
export async function getDowntimeGroupPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<DowntimeGroupEntityBasePaginationResponse> {
  const response = await axiosInstance.post<DowntimeGroupEntityBasePaginationResponse>(
    DOWNTIMEGROUP_ENDPOINTS.getDowntimeGroupPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Downtime Group
 *
 * Creates a new Downtime Group entity in the system.
 * @param data - Request body
 * @returns Promise<DowntimeGroupEntityResult>
 */
export async function createDowntimeGroup(
  data: DowntimeGroupEntity
): Promise<DowntimeGroupEntityResult> {
  const response = await axiosInstance.post<DowntimeGroupEntityResult>(
    DOWNTIMEGROUP_ENDPOINTS.createDowntimeGroup,
    data
  );
  return response.data;
}

/**
 * Update an existing Downtime Group
 *
 * Updates specific fields of an existing Downtime Group entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateDowntimeGroup(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/downtimegroup/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Downtime Group
 *
 * Deletes a Downtime Group entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteDowntimeGroup(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/downtimegroup/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Downtime Group
 *
 * Generates a new unique code for a Downtime Group entity.
 * @returns Promise<string>
 */
export async function generateNewDowntimeGroupCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    DOWNTIMEGROUP_ENDPOINTS.generateNewDowntimeGroupCode
  );
  return response.data;
}

/**
 * Search Downtime Group entities
 *
 * Searches Downtime Group entities by text across searchable fields.
 * @returns Promise<DowntimeGroupEntity[]>
 */
export async function searchDowntimeGroup(params?: {
  searchText?: string;
  maxResults?: number;
}): Promise<DowntimeGroupEntity[]> {
  const response = await axiosInstance.get<DowntimeGroupEntity[]>(
    DOWNTIMEGROUP_ENDPOINTS.searchDowntimeGroup,
    { params }
  );
  return response.data;
}
