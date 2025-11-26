import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createLocation,
  deleteLocation,
  generateNewLocationCode,
  getLocationById,
  getLocationPage,
  searchLocation,
  updateLocation,
} from '../../services/generated/location';

import type {
  BooleanResult,
  LocationEntity,
  LocationEntityBasePaginationResponse,
  LocationEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Location Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Location
 */
export const locationKeys = {
  all: ['location'] as const,
  getLocationById: (id: string) => ['location', 'getLocationById', id] as const,
  generateNewLocationCode: ['location', 'generateNewLocationCode'] as const,
  searchLocation: ['location', 'searchLocation'] as const,
};

/**
 * Get Location by ID
 */
export function useGetLocationById(
  id: string,
  options?: Omit<UseQueryOptions<LocationEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: locationKeys.getLocationById(id),
    queryFn: () => getLocationById(id),
    ...options,
  });
}

/**
 * Generate a new code for Location
 */
export function useGenerateNewLocationCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: locationKeys.generateNewLocationCode,
    queryFn: () => generateNewLocationCode(),
    ...options,
  });
}

/**
 * Search Location entities
 */
export function useSearchLocation(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<LocationEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: locationKeys.searchLocation,
    queryFn: () => searchLocation(params),
    ...options,
  });
}

/**
 * Get paginated list of Location
 */
export function useGetLocationPage(
  options?: Omit<UseMutationOptions<LocationEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getLocationPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Location
 */
export function useCreateLocation(
  options?: Omit<UseMutationOptions<LocationEntityResult, Error, { data: LocationEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: LocationEntity }) => createLocation(variables.data),
    ...options,
  });
}

/**
 * Update an existing Location
 */
export function useUpdateLocation(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateLocation(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Location
 */
export function useDeleteLocation(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteLocation(variables.id),
    ...options,
  });
}
