import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createStation,
  deleteStation,
  searchStation,
  updateStation,
  getStationById,
  getStationPage,
  generateNewStationCode,
  getapiStationsearchbycode,
} from '../../services/generated/station';

import type {
  SortType,
  BooleanResult,
  StationEntity,
  StationEntityResult,
  StringObjectKeyValuePair,
  StationEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Station Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Station
 */
export const stationKeys = {
  all: ['station'] as const,
  getStationById: (id: string) => ['station', 'getStationById', id] as const,
  generateNewStationCode: ['station', 'generateNewStationCode'] as const,
  searchStation: ['station', 'searchStation'] as const,
  getapiStationsearchbycode: ['station', 'getapiStationsearchbycode'] as const,
};

/**
 * Get Station by ID
 */
export function useGetStationById(
  id: string,
  options?: Omit<UseQueryOptions<StationEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stationKeys.getStationById(id),
    queryFn: () => getStationById(id),
    ...options,
  });
}

/**
 * Generate a new code for Station
 */
export function useGenerateNewStationCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stationKeys.generateNewStationCode,
    queryFn: () => generateNewStationCode(),
    ...options,
  });
}

/**
 * Search Station entities
 */
export function useSearchStation(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<StationEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stationKeys.searchStation,
    queryFn: () => searchStation(params),
    ...options,
  });
}

/**
 */
export function useGetapiStationsearchbycode(
  params?: { keyword?: string },
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stationKeys.getapiStationsearchbycode,
    queryFn: () => getapiStationsearchbycode(params),
    ...options,
  });
}

/**
 * Get paginated list of Station
 */
export function useGetStationPage(
  options?: Omit<
    UseMutationOptions<
      StationEntityBasePaginationResponse,
      Error,
      { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: {
      data: SortType[];
      params?: { pageNumber?: number; pageSize?: number; searchTerm?: string };
    }) => getStationPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Station
 */
export function useCreateStation(
  options?: Omit<
    UseMutationOptions<StationEntityResult, Error, { data: StationEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: StationEntity }) => createStation(variables.data),
    ...options,
  });
}

/**
 * Update an existing Station
 */
export function useUpdateStation(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateStation(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Station
 */
export function useDeleteStation(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteStation(variables.id),
    ...options,
  });
}
