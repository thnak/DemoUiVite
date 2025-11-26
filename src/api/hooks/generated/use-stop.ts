import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createStop,
  deleteStop,
  generateNewStopCode,
  getStopById,
  getStopPage,
  updateStop,
} from '../../services/generated/stop';

import type {
  BooleanResult,
  SortType,
  StopEntity,
  StopEntityBasePaginationResponse,
  StopEntityResult,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Stop Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Stop
 */
export const stopKeys = {
  all: ['stop'] as const,
  getStopById: (id: string) => ['stop', 'getStopById', id] as const,
  generateNewStopCode: ['stop', 'generateNewStopCode'] as const,
};

/**
 * Get Stop by ID
 */
export function useGetStopById(
  id: string,
  options?: Omit<UseQueryOptions<StopEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stopKeys.getStopById(id),
    queryFn: () => getStopById(id),
    ...options,
  });
}

/**
 * Generate a new code for Stop
 */
export function useGenerateNewStopCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: stopKeys.generateNewStopCode,
    queryFn: () => generateNewStopCode(),
    ...options,
  });
}

/**
 * Get paginated list of Stop
 */
export function useGetStopPage(
  options?: Omit<UseMutationOptions<StopEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getStopPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Stop
 */
export function useCreateStop(
  options?: Omit<UseMutationOptions<StopEntityResult, Error, { data: StopEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: StopEntity }) => createStop(variables.data),
    ...options,
  });
}

/**
 * Update an existing Stop
 */
export function useUpdateStop(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateStop(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Stop
 */
export function useDeleteStop(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteStop(variables.id),
    ...options,
  });
}
