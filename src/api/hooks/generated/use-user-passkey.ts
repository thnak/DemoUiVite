import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createUserPasskey,
  deleteUserPasskey,
  updateUserPasskey,
  getUserPasskeyById,
  getUserPasskeyPage,
  generateNewUserPasskeyCode,
} from '../../services/generated/user-passkey';

import type {
  SortType,
  BooleanResult,
  UserPasskeyEntity,
  UserPasskeyEntityResult,
  StringObjectKeyValuePair,
  UserPasskeyEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserPasskey Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for UserPasskey
 */
export const userPasskeyKeys = {
  all: ['userPasskey'] as const,
  getUserPasskeyById: (id: string) => ['userPasskey', 'getUserPasskeyById', id] as const,
  generateNewUserPasskeyCode: ['userPasskey', 'generateNewUserPasskeyCode'] as const,
};

/**
 * Get User Passkey by ID
 */
export function useGetUserPasskeyById(
  id: string,
  options?: Omit<UseQueryOptions<UserPasskeyEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userPasskeyKeys.getUserPasskeyById(id),
    queryFn: () => getUserPasskeyById(id),
    ...options,
  });
}

/**
 * Generate a new code for User Passkey
 */
export function useGenerateNewUserPasskeyCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userPasskeyKeys.generateNewUserPasskeyCode,
    queryFn: () => generateNewUserPasskeyCode(),
    ...options,
  });
}

/**
 * Get paginated list of User Passkey
 */
export function useGetUserPasskeyPage(
  options?: Omit<
    UseMutationOptions<
      UserPasskeyEntityBasePaginationResponse,
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
    }) => getUserPasskeyPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new User Passkey
 */
export function useCreateUserPasskey(
  options?: Omit<
    UseMutationOptions<UserPasskeyEntityResult, Error, { data: UserPasskeyEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: UserPasskeyEntity }) => createUserPasskey(variables.data),
    ...options,
  });
}

/**
 * Update an existing User Passkey
 */
export function useUpdateUserPasskey(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateUserPasskey(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a User Passkey
 */
export function useDeleteUserPasskey(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteUserPasskey(variables.id),
    ...options,
  });
}
