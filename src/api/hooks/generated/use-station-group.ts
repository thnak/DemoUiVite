import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createStationGroup,
  deleteStationGroup,
  generateNewStationGroupCode,
  getStationGroupById,
  getStationGroupPage,
  searchStationGroup,
  updateStationGroup,
} from '../../services/generated/station-group';

import type {
  BooleanResult,
  SortType,
  StationGroupEntity,
  StationGroupEntityBasePaginationResponse,
  StationGroupEntityResult,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// StationGroup Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for StationGroup
 */
export const stationGroupKeys = {
  all: ['stationGroup'] as const,
  getStationGroupById: (id: string) => ['stationGroup', 'getStationGroupById', id] as const,
  generateNewStationGroupCode: ['stationGroup', 'generateNewStationGroupCode'] as const,
  searchStationGroup: ['stationGroup', 'searchStationGroup'] as const,
};

/**
 * Get Station Group by ID
 */
export function useGetStationGroupById(
  id: string,
  options?: Omit<UseQueryOptions<StationGroupEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stationGroupKeys.getStationGroupById(id),
    queryFn: () => getStationGroupById(id),
    ...options,
  });
}

/**
 * Generate a new code for Station Group
 */
export function useGenerateNewStationGroupCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stationGroupKeys.generateNewStationGroupCode,
    queryFn: () => generateNewStationGroupCode(),
    ...options,
  });
}

/**
 * Search Station Group entities
 */
export function useSearchStationGroup(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<StationGroupEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stationGroupKeys.searchStationGroup,
    queryFn: () => searchStationGroup(params),
    ...options,
  });
}

/**
 * Get paginated list of Station Group
 */
export function useGetStationGroupPage(
  options?: Omit<UseMutationOptions<StationGroupEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getStationGroupPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Station Group
 */
export function useCreateStationGroup(
  options?: Omit<UseMutationOptions<StationGroupEntityResult, Error, { data: StationGroupEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: StationGroupEntity }) => createStationGroup(variables.data),
    ...options,
  });
}

/**
 * Update an existing Station Group
 */
export function useUpdateStationGroup(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateStationGroup(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Station Group
 */
export function useDeleteStationGroup(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteStationGroup(variables.id),
    ...options,
  });
}
