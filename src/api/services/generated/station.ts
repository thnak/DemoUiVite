import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  StationEntity,
  StationEntityResult,
  StringObjectKeyValuePair,
  StationEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Station Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Station API endpoints
 */
export const STATION_ENDPOINTS = {
  getStationById: '/api/station/{id}',
  getStationPage: '/api/station/get-page',
  createStation: '/api/station/create',
  updateStation: '/api/station/update/{id}',
  deleteStation: '/api/station/delete/{id}',
  generateNewStationCode: '/api/station/generate-new-code',
  searchStation: '/api/station/search',
  getapiStationsearchbycode: '/api/Station/search-by-code',
} as const;

/**
 * Get Station by ID
 *
 * Retrieves a specific Station entity by its unique identifier.
 * @returns Promise<StationEntity>
 */
export async function getStationById(id: string): Promise<StationEntity> {
  const response = await axiosInstance.get<StationEntity>(`/api/station/${id}`);
  return response.data;
}

/**
 * Get paginated list of Station
 *
 * Retrieves a paginated list of Station entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<StationEntityBasePaginationResponse>
 */
export async function getStationPage(data: SortType[], params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<StationEntityBasePaginationResponse> {
  const response = await axiosInstance.post<StationEntityBasePaginationResponse>(STATION_ENDPOINTS.getStationPage, data, { params });
  return response.data;
}

/**
 * Create a new Station
 *
 * Creates a new Station entity in the system.
 * @param data - Request body
 * @returns Promise<StationEntityResult>
 */
export async function createStation(data: StationEntity): Promise<StationEntityResult> {
  const response = await axiosInstance.post<StationEntityResult>(STATION_ENDPOINTS.createStation, data);
  return response.data;
}

/**
 * Update an existing Station
 *
 * Updates specific fields of an existing Station entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateStation(id: string, data: StringObjectKeyValuePair[]): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/station/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Station
 *
 * Deletes a Station entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteStation(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/station/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Station
 *
 * Generates a new unique code for a Station entity.
 * @returns Promise<string>
 */
export async function generateNewStationCode(): Promise<string> {
  const response = await axiosInstance.get<string>(STATION_ENDPOINTS.generateNewStationCode);
  return response.data;
}

/**
 * Search Station entities
 *
 * Searches Station entities by text across searchable fields.
 * @returns Promise<StationEntity[]>
 */
export async function searchStation(params?: { searchText?: string; maxResults?: number }): Promise<StationEntity[]> {
  const response = await axiosInstance.get<StationEntity[]>(STATION_ENDPOINTS.searchStation, { params });
  return response.data;
}

/**
 * @returns Promise<void>
 */
export async function getapiStationsearchbycode(params?: { keyword?: string }): Promise<void> {
  await axiosInstance.get(STATION_ENDPOINTS.getapiStationsearchbycode, { params });
}
