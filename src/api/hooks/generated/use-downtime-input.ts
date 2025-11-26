import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createDowntimeInput,
  deleteDowntimeInput,
  updateDowntimeInput,
  getDowntimeInputById,
  getDowntimeInputPage,
  generateNewDowntimeInputCode,
} from '../../services/generated/downtime-input';

import type {
  SortType,
  BooleanResult,
  DowntimeInput,
  DowntimeInputResult,
  StringObjectKeyValuePair,
  DowntimeInputBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DowntimeInput Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for DowntimeInput
 */
export const downtimeInputKeys = {
  all: ['downtimeInput'] as const,
  getDowntimeInputById: (id: string) => ['downtimeInput', 'getDowntimeInputById', id] as const,
  generateNewDowntimeInputCode: ['downtimeInput', 'generateNewDowntimeInputCode'] as const,
};

/**
 * Get Downtime Input by ID
 */
export function useGetDowntimeInputById(
  id: string,
  options?: Omit<UseQueryOptions<DowntimeInput, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: downtimeInputKeys.getDowntimeInputById(id),
    queryFn: () => getDowntimeInputById(id),
    ...options,
  });
}

/**
 * Generate a new code for Downtime Input
 */
export function useGenerateNewDowntimeInputCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: downtimeInputKeys.generateNewDowntimeInputCode,
    queryFn: () => generateNewDowntimeInputCode(),
    ...options,
  });
}

/**
 * Get paginated list of Downtime Input
 */
export function useGetDowntimeInputPage(
  options?: Omit<UseMutationOptions<DowntimeInputBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getDowntimeInputPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Downtime Input
 */
export function useCreateDowntimeInput(
  options?: Omit<UseMutationOptions<DowntimeInputResult, Error, { data: DowntimeInput }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: DowntimeInput }) => createDowntimeInput(variables.data),
    ...options,
  });
}

/**
 * Update an existing Downtime Input
 */
export function useUpdateDowntimeInput(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateDowntimeInput(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Downtime Input
 */
export function useDeleteDowntimeInput(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteDowntimeInput(variables.id),
    ...options,
  });
}
