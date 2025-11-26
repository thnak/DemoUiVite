import axiosInstance from '../../axios-instance';

import type {
  SortType,
  BooleanResult,
  LocationEntity,
  LocationEntityResult,
  StringObjectKeyValuePair,
  LocationEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Location Service
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Location API endpoints
 */
export const LOCATION_ENDPOINTS = {
  getLocationById: '/api/location/{id}',
  getLocationPage: '/api/location/get-page',
  createLocation: '/api/location/create',
  updateLocation: '/api/location/update/{id}',
  deleteLocation: '/api/location/delete/{id}',
  generateNewLocationCode: '/api/location/generate-new-code',
  searchLocation: '/api/location/search',
} as const;

/**
 * Get Location by ID
 *
 * Retrieves a specific Location entity by its unique identifier.
 * @returns Promise<LocationEntity>
 */
export async function getLocationById(id: string): Promise<LocationEntity> {
  const response = await axiosInstance.get<LocationEntity>(`/api/location/${id}`);
  return response.data;
}

/**
 * Get paginated list of Location
 *
 * Retrieves a paginated list of Location entities.
 * @param pageNumber - Page number, starting from 0.
 * @param pageSize - Number of items per page.
 * @param searchTerm - Search term for filtering results.
 * @param data - Request body
 * @returns Promise<LocationEntityBasePaginationResponse>
 */
export async function getLocationPage(
  data: SortType[],
  params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }
): Promise<LocationEntityBasePaginationResponse> {
  const response = await axiosInstance.post<LocationEntityBasePaginationResponse>(
    LOCATION_ENDPOINTS.getLocationPage,
    data,
    { params }
  );
  return response.data;
}

/**
 * Create a new Location
 *
 * Creates a new Location entity in the system.
 * @param data - Request body
 * @returns Promise<LocationEntityResult>
 */
export async function createLocation(data: LocationEntity): Promise<LocationEntityResult> {
  const response = await axiosInstance.post<LocationEntityResult>(
    LOCATION_ENDPOINTS.createLocation,
    data
  );
  return response.data;
}

/**
 * Update an existing Location
 *
 * Updates specific fields of an existing Location entity by ID.
 * @param data - Request body
 * @returns Promise<BooleanResult>
 */
export async function updateLocation(
  id: string,
  data: StringObjectKeyValuePair[]
): Promise<BooleanResult> {
  const response = await axiosInstance.post<BooleanResult>(`/api/location/update/${id}`, data);
  return response.data;
}

/**
 * Delete a Location
 *
 * Deletes a Location entity by its unique identifier.
 * @returns Promise<BooleanResult>
 */
export async function deleteLocation(id: string): Promise<BooleanResult> {
  const response = await axiosInstance.delete<BooleanResult>(`/api/location/delete/${id}`);
  return response.data;
}

/**
 * Generate a new code for Location
 *
 * Generates a new unique code for a Location entity.
 * @returns Promise<string>
 */
export async function generateNewLocationCode(): Promise<string> {
  const response = await axiosInstance.get<string>(LOCATION_ENDPOINTS.generateNewLocationCode);
  return response.data;
}

/**
 * Search Location entities
 *
 * Searches Location entities by text across searchable fields.
 * @returns Promise<LocationEntity[]>
 */
export async function searchLocation(params?: {
  searchText?: string;
  maxResults?: number;
}): Promise<LocationEntity[]> {
  const response = await axiosInstance.get<LocationEntity[]>(LOCATION_ENDPOINTS.searchLocation, {
    params,
  });
  return response.data;
}
