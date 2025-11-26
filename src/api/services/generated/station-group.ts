import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  StationGroupEntity,
  StationGroupEntityResult,
  StringObjectKeyValuePair,
  StationGroupEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// StationGroup Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * StationGroup API endpoints
 */
export const STATIONGROUP_ENDPOINTS = {
  getStationGroupById: '/api/stationgroup/{id}',
  getStationGroupPage: '/api/stationgroup/get-page',
  createStationGroup: '/api/stationgroup/create',
  updateStationGroup: '/api/stationgroup/update/{id}',
  deleteStationGroup: '/api/stationgroup/delete/{id}',
  generateNewStationGroupCode: '/api/stationgroup/generate-new-code',
  searchStationGroup: '/api/stationgroup/search',
} as const;

/**
 * Get Station Group by ID
 *
 * Retrieves a specific Station Group entity by its unique identifier.
 * @returns Promise<StationGroupEntity>
 */
export async function getStationGroupById(id: string): Promise<StationGroupEntity> {
  const response = await axiosInstance.get<StationGroupEntity>(`/api/stationgroup/${id}`);
  return response.data;
}

/**
 * Get paginated list of Station Group
 *
 * Retrieves a paginated list of Station Group entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<StationGroupEntityBasePaginationResponse>
 */
export async function getStationGroupPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<StationGroupEntityBasePaginationResponse> {
  const response = await axiosInstance.post<StationGroupEntityBasePaginationResponse>(
    STATIONGROUP_ENDPOINTS.getStationGroupPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Station Group
 *
 * Creates a new Station Group entity in the system.
 * @param data - Request body
 * @returns Promise<StationGroupEntityResult>
 */
export async function createStationGroup(
  data: StationGroupEntity
): Promise<StationGroupEntityResult> {
  const response = await axiosInstance.post<StationGroupEntityResult>(
    STATIONGROUP_ENDPOINTS.createStationGroup,
    data
  );
  return response.data;
}

/**
 * Update an existing Station Group
 *
 * Updates specific fields of an existing Station Group entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateStationGroup(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/stationgroup/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Station Group
 *
 * Deletes a Station Group entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteStationGroup(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/stationgroup/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Station Group
 *
 * Generates a new unique code for a Station Group entity.
 * @returns Promise<string>
 */
export async function generateNewStationGroupCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    STATIONGROUP_ENDPOINTS.generateNewStationGroupCode
  );
  return response.data;
}

/**
 * Search Station Group entities
 *
 * Searches Station Group entities by text across searchable fields.
 * @returns Promise<StationGroupEntity[]>
 */
export async function searchStationGroup(params?: {
  searchText?: string;
  maxResults?: number;
}): Promise<StationGroupEntity[]> {
  const response = await axiosInstance.get<StationGroupEntity[]>(
    STATIONGROUP_ENDPOINTS.searchStationGroup,
    { params }
  );
  return response.data;
}
