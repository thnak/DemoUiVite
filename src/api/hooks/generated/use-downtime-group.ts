import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createDowntimeGroup,
  deleteDowntimeGroup,
  searchDowntimeGroup,
  updateDowntimeGroup,
  getDowntimeGroupById,
  getDowntimeGroupPage,
  generateNewDowntimeGroupCode,
} from '../../services/generated/downtime-group';

import type {
  SortType,
  BooleanResult,
  DowntimeGroupEntity,
  StringObjectKeyValuePair,
  DowntimeGroupEntityResult,
  DowntimeGroupEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DowntimeGroup Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for DowntimeGroup
 */
export const downtimeGroupKeys = {
  all: ['downtimeGroup'] as const,
  getDowntimeGroupById: (id: string) => ['downtimeGroup', 'getDowntimeGroupById', id] as const,
  generateNewDowntimeGroupCode: ['downtimeGroup', 'generateNewDowntimeGroupCode'] as const,
  searchDowntimeGroup: ['downtimeGroup', 'searchDowntimeGroup'] as const,
};

/**
 * Get Downtime Group by ID
 */
export function useGetDowntimeGroupById(
  id: string,
  options?: Omit<UseQueryOptions<DowntimeGroupEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: downtimeGroupKeys.getDowntimeGroupById(id),
    queryFn: () => getDowntimeGroupById(id),
    ...options,
  });
}

/**
 * Generate a new code for Downtime Group
 */
export function useGenerateNewDowntimeGroupCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: downtimeGroupKeys.generateNewDowntimeGroupCode,
    queryFn: () => generateNewDowntimeGroupCode(),
    ...options,
  });
}

/**
 * Search Downtime Group entities
 */
export function useSearchDowntimeGroup(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<DowntimeGroupEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: downtimeGroupKeys.searchDowntimeGroup,
    queryFn: () => searchDowntimeGroup(params),
    ...options,
  });
}

/**
 * Get paginated list of Downtime Group
 */
export function useGetDowntimeGroupPage(
  options?: Omit<
    UseMutationOptions<
      DowntimeGroupEntityBasePaginationResponse,
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
    }) => getDowntimeGroupPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Downtime Group
 */
export function useCreateDowntimeGroup(
  options?: Omit<
    UseMutationOptions<DowntimeGroupEntityResult, Error, { data: DowntimeGroupEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: DowntimeGroupEntity }) => createDowntimeGroup(variables.data),
    ...options,
  });
}

/**
 * Update an existing Downtime Group
 */
export function useUpdateDowntimeGroup(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateDowntimeGroup(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Downtime Group
 */
export function useDeleteDowntimeGroup(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteDowntimeGroup(variables.id),
    ...options,
  });
}
