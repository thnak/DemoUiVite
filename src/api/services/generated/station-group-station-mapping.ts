import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  StringObjectKeyValuePair,
  StationGroupStationMapping,
  StationGroupStationMappingResult,
  StationGroupStationMappingBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// StationGroupStationMapping Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * StationGroupStationMapping API endpoints
 */
export const STATIONGROUPSTATIONMAPPING_ENDPOINTS = {
  getStationGroupStationMappingById: '/api/stationgroupstationmapping/{id}',
  getStationGroupStationMappingPage: '/api/stationgroupstationmapping/get-page',
  createStationGroupStationMapping: '/api/stationgroupstationmapping/create',
  updateStationGroupStationMapping: '/api/stationgroupstationmapping/update/{id}',
  deleteStationGroupStationMapping: '/api/stationgroupstationmapping/delete/{id}',
  generateNewStationGroupStationMappingCode: '/api/stationgroupstationmapping/generate-new-code',
} as const;

/**
 * Get Station Group Station Mapping by ID
 *
 * Retrieves a specific Station Group Station Mapping entity by its unique identifier.
 * @returns Promise<StationGroupStationMapping>
 */
export async function getStationGroupStationMappingById(
  id: string
): Promise<StationGroupStationMapping> {
  const response = await axiosInstance.get<StationGroupStationMapping>(
    `/api/stationgroupstationmapping/${id}`
  );
  return response.data;
}

/**
 * Get paginated list of Station Group Station Mapping
 *
 * Retrieves a paginated list of Station Group Station Mapping entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<StationGroupStationMappingBasePaginationResponse>
 */
export async function getStationGroupStationMappingPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<StationGroupStationMappingBasePaginationResponse> {
  const response = await axiosInstance.post<StationGroupStationMappingBasePaginationResponse>(
    STATIONGROUPSTATIONMAPPING_ENDPOINTS.getStationGroupStationMappingPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Station Group Station Mapping
 *
 * Creates a new Station Group Station Mapping entity in the system.
 * @param data - Request body
 * @returns Promise<StationGroupStationMappingResult>
 */
export async function createStationGroupStationMapping(
  data: StationGroupStationMapping
): Promise<StationGroupStationMappingResult> {
  const response = await axiosInstance.post<StationGroupStationMappingResult>(
    STATIONGROUPSTATIONMAPPING_ENDPOINTS.createStationGroupStationMapping,
    data
  );
  return response.data;
}

/**
 * Update an existing Station Group Station Mapping
 *
 * Updates specific fields of an existing Station Group Station Mapping entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateStationGroupStationMapping(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(
    `/api/stationgroupstationmapping/update/${id}`,
    data
  );
  return response.data;
}

/**
 * Delete a Station Group Station Mapping
 *
 * Deletes a Station Group Station Mapping entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteStationGroupStationMapping(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(
    `/api/stationgroupstationmapping/delete/${id}`
  );
  return response.data;
}

/**
 * Generate a new code for Station Group Station Mapping
 *
 * Generates a new unique code for a Station Group Station Mapping entity.
 * @returns Promise<string>
 */
export async function generateNewStationGroupStationMappingCode(): Promise<string> {
  const response = await axiosInstance.get<string>(
    STATIONGROUPSTATIONMAPPING_ENDPOINTS.generateNewStationGroupStationMappingCode
  );
  return response.data;
}
