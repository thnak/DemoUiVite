import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createStationGroupStationMapping,
  deleteStationGroupStationMapping,
  generateNewStationGroupStationMappingCode,
  getStationGroupStationMappingById,
  getStationGroupStationMappingPage,
  updateStationGroupStationMapping,
} from '../../services/generated/station-group-station-mapping';

import type {
  BooleanResult,
  SortType,
  StationGroupStationMapping,
  StationGroupStationMappingBasePaginationResponse,
  StationGroupStationMappingResult,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// StationGroupStationMapping Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for StationGroupStationMapping
 */
export const stationGroupStationMappingKeys = {
  all: ['stationGroupStationMapping'] as const,
  getStationGroupStationMappingById: (id: string) => ['stationGroupStationMapping', 'getStationGroupStationMappingById', id] as const,
  generateNewStationGroupStationMappingCode: ['stationGroupStationMapping', 'generateNewStationGroupStationMappingCode'] as const,
};

/**
 * Get Station Group Station Mapping by ID
 */
export function useGetStationGroupStationMappingById(
  id: string,
  options?: Omit<UseQueryOptions<StationGroupStationMapping, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stationGroupStationMappingKeys.getStationGroupStationMappingById(id),
    queryFn: () => getStationGroupStationMappingById(id),
    ...options,
  });
}

/**
 * Generate a new code for Station Group Station Mapping
 */
export function useGenerateNewStationGroupStationMappingCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stationGroupStationMappingKeys.generateNewStationGroupStationMappingCode,
    queryFn: () => generateNewStationGroupStationMappingCode(),
    ...options,
  });
}

/**
 * Get paginated list of Station Group Station Mapping
 */
export function useGetStationGroupStationMappingPage(
  options?: Omit<UseMutationOptions<StationGroupStationMappingBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getStationGroupStationMappingPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Station Group Station Mapping
 */
export function useCreateStationGroupStationMapping(
  options?: Omit<UseMutationOptions<StationGroupStationMappingResult, Error, { data: StationGroupStationMapping }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: StationGroupStationMapping }) => createStationGroupStationMapping(variables.data),
    ...options,
  });
}

/**
 * Update an existing Station Group Station Mapping
 */
export function useUpdateStationGroupStationMapping(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateStationGroupStationMapping(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Station Group Station Mapping
 */
export function useDeleteStationGroupStationMapping(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteStationGroupStationMapping(variables.id),
    ...options,
  });
}
