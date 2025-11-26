import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createBomLine,
  deleteBomLine,
  updateBomLine,
  getBomLineById,
  getBomLinePage,
  generateNewBomLineCode,
} from '../../services/generated/bom-line';

import type {
  SortType,
  BomLineEntity,
  BooleanResult,
  BomLineEntityResult,
  StringObjectKeyValuePair,
  BomLineEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// BomLine Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for BomLine
 */
export const bomLineKeys = {
  all: ['bomLine'] as const,
  getBomLineById: (id: string) => ['bomLine', 'getBomLineById', id] as const,
  generateNewBomLineCode: ['bomLine', 'generateNewBomLineCode'] as const,
};

/**
 * Get Bom Line by ID
 */
export function useGetBomLineById(
  id: string,
  options?: Omit<UseQueryOptions<BomLineEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: bomLineKeys.getBomLineById(id),
    queryFn: () => getBomLineById(id),
    ...options,
  });
}

/**
 * Generate a new code for Bom Line
 */
export function useGenerateNewBomLineCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: bomLineKeys.generateNewBomLineCode,
    queryFn: () => generateNewBomLineCode(),
    ...options,
  });
}

/**
 * Get paginated list of Bom Line
 */
export function useGetBomLinePage(
  options?: Omit<
    UseMutationOptions<
      BomLineEntityBasePaginationResponse,
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
    }) => getBomLinePage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Bom Line
 */
export function useCreateBomLine(
  options?: Omit<
    UseMutationOptions<BomLineEntityResult, Error, { data: BomLineEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: BomLineEntity }) => createBomLine(variables.data),
    ...options,
  });
}

/**
 * Update an existing Bom Line
 */
export function useUpdateBomLine(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateBomLine(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Bom Line
 */
export function useDeleteBomLine(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteBomLine(variables.id),
    ...options,
  });
}
