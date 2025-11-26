import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createUserLogHistory,
  deleteUserLogHistory,
  updateUserLogHistory,
  getUserLogHistoryById,
  getUserLogHistoryPage,
  generateNewUserLogHistoryCode,
} from '../../services/generated/user-log-history';

import type {
  SortType,
  BooleanResult,
  UserLogHistoryEntity,
  StringObjectKeyValuePair,
  UserLogHistoryEntityResult,
  UserLogHistoryEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserLogHistory Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for UserLogHistory
 */
export const userLogHistoryKeys = {
  all: ['userLogHistory'] as const,
  getUserLogHistoryById: (id: string) => ['userLogHistory', 'getUserLogHistoryById', id] as const,
  generateNewUserLogHistoryCode: ['userLogHistory', 'generateNewUserLogHistoryCode'] as const,
};

/**
 * Get User Log History by ID
 */
export function useGetUserLogHistoryById(
  id: string,
  options?: Omit<UseQueryOptions<UserLogHistoryEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userLogHistoryKeys.getUserLogHistoryById(id),
    queryFn: () => getUserLogHistoryById(id),
    ...options,
  });
}

/**
 * Generate a new code for User Log History
 */
export function useGenerateNewUserLogHistoryCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userLogHistoryKeys.generateNewUserLogHistoryCode,
    queryFn: () => generateNewUserLogHistoryCode(),
    ...options,
  });
}

/**
 * Get paginated list of User Log History
 */
export function useGetUserLogHistoryPage(
  options?: Omit<
    UseMutationOptions<
      UserLogHistoryEntityBasePaginationResponse,
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
    }) => getUserLogHistoryPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new User Log History
 */
export function useCreateUserLogHistory(
  options?: Omit<
    UseMutationOptions<UserLogHistoryEntityResult, Error, { data: UserLogHistoryEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: UserLogHistoryEntity }) => createUserLogHistory(variables.data),
    ...options,
  });
}

/**
 * Update an existing User Log History
 */
export function useUpdateUserLogHistory(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateUserLogHistory(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a User Log History
 */
export function useDeleteUserLogHistory(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteUserLogHistory(variables.id),
    ...options,
  });
}
