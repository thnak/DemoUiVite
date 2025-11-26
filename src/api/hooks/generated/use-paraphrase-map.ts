import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createParaphraseMap,
  deleteParaphraseMap,
  updateParaphraseMap,
  getParaphraseMapById,
  getParaphraseMapPage,
  generateNewParaphraseMapCode,
} from '../../services/generated/paraphrase-map';

import type {
  SortType,
  BooleanResult,
  ParaphraseMapEntity,
  StringObjectKeyValuePair,
  ParaphraseMapEntityResult,
  ParaphraseMapEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ParaphraseMap Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ParaphraseMap
 */
export const paraphraseMapKeys = {
  all: ['paraphraseMap'] as const,
  getParaphraseMapById: (id: string) => ['paraphraseMap', 'getParaphraseMapById', id] as const,
  generateNewParaphraseMapCode: ['paraphraseMap', 'generateNewParaphraseMapCode'] as const,
};

/**
 * Get Paraphrase Map by ID
 */
export function useGetParaphraseMapById(
  id: string,
  options?: Omit<UseQueryOptions<ParaphraseMapEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: paraphraseMapKeys.getParaphraseMapById(id),
    queryFn: () => getParaphraseMapById(id),
    ...options,
  });
}

/**
 * Generate a new code for Paraphrase Map
 */
export function useGenerateNewParaphraseMapCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: paraphraseMapKeys.generateNewParaphraseMapCode,
    queryFn: () => generateNewParaphraseMapCode(),
    ...options,
  });
}

/**
 * Get paginated list of Paraphrase Map
 */
export function useGetParaphraseMapPage(
  options?: Omit<
    UseMutationOptions<
      ParaphraseMapEntityBasePaginationResponse,
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
    }) => getParaphraseMapPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Paraphrase Map
 */
export function useCreateParaphraseMap(
  options?: Omit<
    UseMutationOptions<ParaphraseMapEntityResult, Error, { data: ParaphraseMapEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: ParaphraseMapEntity }) => createParaphraseMap(variables.data),
    ...options,
  });
}

/**
 * Update an existing Paraphrase Map
 */
export function useUpdateParaphraseMap(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateParaphraseMap(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Paraphrase Map
 */
export function useDeleteParaphraseMap(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteParaphraseMap(variables.id),
    ...options,
  });
}
