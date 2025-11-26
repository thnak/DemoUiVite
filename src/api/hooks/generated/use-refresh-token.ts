import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createRefreshToken,
  deleteRefreshToken,
  updateRefreshToken,
  getRefreshTokenById,
  getRefreshTokenPage,
  generateNewRefreshTokenCode,
} from '../../services/generated/refresh-token';

import type {
  SortType,
  BooleanResult,
  RefreshTokenEntity,
  RefreshTokenEntityResult,
  StringObjectKeyValuePair,
  RefreshTokenEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// RefreshToken Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for RefreshToken
 */
export const refreshTokenKeys = {
  all: ['refreshToken'] as const,
  getRefreshTokenById: (id: string) => ['refreshToken', 'getRefreshTokenById', id] as const,
  generateNewRefreshTokenCode: ['refreshToken', 'generateNewRefreshTokenCode'] as const,
};

/**
 * Get Refresh Token by ID
 */
export function useGetRefreshTokenById(
  id: string,
  options?: Omit<UseQueryOptions<RefreshTokenEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: refreshTokenKeys.getRefreshTokenById(id),
    queryFn: () => getRefreshTokenById(id),
    ...options,
  });
}

/**
 * Generate a new code for Refresh Token
 */
export function useGenerateNewRefreshTokenCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: refreshTokenKeys.generateNewRefreshTokenCode,
    queryFn: () => generateNewRefreshTokenCode(),
    ...options,
  });
}

/**
 * Get paginated list of Refresh Token
 */
export function useGetRefreshTokenPage(
  options?: Omit<
    UseMutationOptions<
      RefreshTokenEntityBasePaginationResponse,
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
    }) => getRefreshTokenPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Refresh Token
 */
export function useCreateRefreshToken(
  options?: Omit<
    UseMutationOptions<RefreshTokenEntityResult, Error, { data: RefreshTokenEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: RefreshTokenEntity }) => createRefreshToken(variables.data),
    ...options,
  });
}

/**
 * Update an existing Refresh Token
 */
export function useUpdateRefreshToken(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateRefreshToken(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Refresh Token
 */
export function useDeleteRefreshToken(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteRefreshToken(variables.id),
    ...options,
  });
}
