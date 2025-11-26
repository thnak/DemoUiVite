import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createJtiToken,
  deleteJtiToken,
  updateJtiToken,
  getJtiTokenById,
  getJtiTokenPage,
  generateNewJtiTokenCode,
} from '../../services/generated/jti-token';

import type {
  SortType,
  BooleanResult,
  JtiTokenEntity,
  JtiTokenEntityResult,
  StringObjectKeyValuePair,
  JtiTokenEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// JtiToken Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for JtiToken
 */
export const jtiTokenKeys = {
  all: ['jtiToken'] as const,
  getJtiTokenById: (id: string) => ['jtiToken', 'getJtiTokenById', id] as const,
  generateNewJtiTokenCode: ['jtiToken', 'generateNewJtiTokenCode'] as const,
};

/**
 * Get Jti Token by ID
 */
export function useGetJtiTokenById(
  id: string,
  options?: Omit<UseQueryOptions<JtiTokenEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: jtiTokenKeys.getJtiTokenById(id),
    queryFn: () => getJtiTokenById(id),
    ...options,
  });
}

/**
 * Generate a new code for Jti Token
 */
export function useGenerateNewJtiTokenCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: jtiTokenKeys.generateNewJtiTokenCode,
    queryFn: () => generateNewJtiTokenCode(),
    ...options,
  });
}

/**
 * Get paginated list of Jti Token
 */
export function useGetJtiTokenPage(
  options?: Omit<
    UseMutationOptions<
      JtiTokenEntityBasePaginationResponse,
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
    }) => getJtiTokenPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Jti Token
 */
export function useCreateJtiToken(
  options?: Omit<
    UseMutationOptions<JtiTokenEntityResult, Error, { data: JtiTokenEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: JtiTokenEntity }) => createJtiToken(variables.data),
    ...options,
  });
}

/**
 * Update an existing Jti Token
 */
export function useUpdateJtiToken(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateJtiToken(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Jti Token
 */
export function useDeleteJtiToken(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteJtiToken(variables.id),
    ...options,
  });
}
