import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createOneTimeLoginToken,
  deleteOneTimeLoginToken,
  generateNewOneTimeLoginTokenCode,
  getOneTimeLoginTokenById,
  getOneTimeLoginTokenPage,
  updateOneTimeLoginToken,
} from '../../services/generated/one-time-login-token';

import type {
  BooleanResult,
  OneTimeLoginTokenEntity,
  OneTimeLoginTokenEntityBasePaginationResponse,
  OneTimeLoginTokenEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// OneTimeLoginToken Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for OneTimeLoginToken
 */
export const oneTimeLoginTokenKeys = {
  all: ['oneTimeLoginToken'] as const,
  getOneTimeLoginTokenById: (id: string) => ['oneTimeLoginToken', 'getOneTimeLoginTokenById', id] as const,
  generateNewOneTimeLoginTokenCode: ['oneTimeLoginToken', 'generateNewOneTimeLoginTokenCode'] as const,
};

/**
 * Get One Time Login Token by ID
 */
export function useGetOneTimeLoginTokenById(
  id: string,
  options?: Omit<UseQueryOptions<OneTimeLoginTokenEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: oneTimeLoginTokenKeys.getOneTimeLoginTokenById(id),
    queryFn: () => getOneTimeLoginTokenById(id),
    ...options,
  });
}

/**
 * Generate a new code for One Time Login Token
 */
export function useGenerateNewOneTimeLoginTokenCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: oneTimeLoginTokenKeys.generateNewOneTimeLoginTokenCode,
    queryFn: () => generateNewOneTimeLoginTokenCode(),
    ...options,
  });
}

/**
 * Get paginated list of One Time Login Token
 */
export function useGetOneTimeLoginTokenPage(
  options?: Omit<UseMutationOptions<OneTimeLoginTokenEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getOneTimeLoginTokenPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new One Time Login Token
 */
export function useCreateOneTimeLoginToken(
  options?: Omit<UseMutationOptions<OneTimeLoginTokenEntityResult, Error, { data: OneTimeLoginTokenEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: OneTimeLoginTokenEntity }) => createOneTimeLoginToken(variables.data),
    ...options,
  });
}

/**
 * Update an existing One Time Login Token
 */
export function useUpdateOneTimeLoginToken(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateOneTimeLoginToken(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a One Time Login Token
 */
export function useDeleteOneTimeLoginToken(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteOneTimeLoginToken(variables.id),
    ...options,
  });
}
