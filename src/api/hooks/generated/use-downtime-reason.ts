import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createDowntimeReason,
  deleteDowntimeReason,
  searchDowntimeReason,
  updateDowntimeReason,
  getDowntimeReasonById,
  getDowntimeReasonPage,
  generateNewDowntimeReasonCode,
} from '../../services/generated/downtime-reason';

import type {
  SortType,
  BooleanResult,
  DowntimeReasonEntity,
  StringObjectKeyValuePair,
  DowntimeReasonEntityResult,
  DowntimeReasonEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DowntimeReason Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for DowntimeReason
 */
export const downtimeReasonKeys = {
  all: ['downtimeReason'] as const,
  getDowntimeReasonById: (id: string) => ['downtimeReason', 'getDowntimeReasonById', id] as const,
  generateNewDowntimeReasonCode: ['downtimeReason', 'generateNewDowntimeReasonCode'] as const,
  searchDowntimeReason: ['downtimeReason', 'searchDowntimeReason'] as const,
};

/**
 * Get Downtime Reason by ID
 */
export function useGetDowntimeReasonById(
  id: string,
  options?: Omit<UseQueryOptions<DowntimeReasonEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: downtimeReasonKeys.getDowntimeReasonById(id),
    queryFn: () => getDowntimeReasonById(id),
    ...options,
  });
}

/**
 * Generate a new code for Downtime Reason
 */
export function useGenerateNewDowntimeReasonCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: downtimeReasonKeys.generateNewDowntimeReasonCode,
    queryFn: () => generateNewDowntimeReasonCode(),
    ...options,
  });
}

/**
 * Search Downtime Reason entities
 */
export function useSearchDowntimeReason(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<DowntimeReasonEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: downtimeReasonKeys.searchDowntimeReason,
    queryFn: () => searchDowntimeReason(params),
    ...options,
  });
}

/**
 * Get paginated list of Downtime Reason
 */
export function useGetDowntimeReasonPage(
  options?: Omit<UseMutationOptions<DowntimeReasonEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getDowntimeReasonPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Downtime Reason
 */
export function useCreateDowntimeReason(
  options?: Omit<UseMutationOptions<DowntimeReasonEntityResult, Error, { data: DowntimeReasonEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: DowntimeReasonEntity }) => createDowntimeReason(variables.data),
    ...options,
  });
}

/**
 * Update an existing Downtime Reason
 */
export function useUpdateDowntimeReason(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateDowntimeReason(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Downtime Reason
 */
export function useDeleteDowntimeReason(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteDowntimeReason(variables.id),
    ...options,
  });
}
