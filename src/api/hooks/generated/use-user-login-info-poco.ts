import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createUserLoginInfoPoco,
  deleteUserLoginInfoPoco,
  generateNewUserLoginInfoPocoCode,
  getUserLoginInfoPocoById,
  getUserLoginInfoPocoPage,
  updateUserLoginInfoPoco,
} from '../../services/generated/user-login-info-poco';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  UserLoginInfoPocoEntity,
  UserLoginInfoPocoEntityBasePaginationResponse,
  UserLoginInfoPocoEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserLoginInfoPoco Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for UserLoginInfoPoco
 */
export const userLoginInfoPocoKeys = {
  all: ['userLoginInfoPoco'] as const,
  getUserLoginInfoPocoById: (id: string) => ['userLoginInfoPoco', 'getUserLoginInfoPocoById', id] as const,
  generateNewUserLoginInfoPocoCode: ['userLoginInfoPoco', 'generateNewUserLoginInfoPocoCode'] as const,
};

/**
 * Get User Login Info Poco by ID
 */
export function useGetUserLoginInfoPocoById(
  id: string,
  options?: Omit<UseQueryOptions<UserLoginInfoPocoEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userLoginInfoPocoKeys.getUserLoginInfoPocoById(id),
    queryFn: () => getUserLoginInfoPocoById(id),
    ...options,
  });
}

/**
 * Generate a new code for User Login Info Poco
 */
export function useGenerateNewUserLoginInfoPocoCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userLoginInfoPocoKeys.generateNewUserLoginInfoPocoCode,
    queryFn: () => generateNewUserLoginInfoPocoCode(),
    ...options,
  });
}

/**
 * Get paginated list of User Login Info Poco
 */
export function useGetUserLoginInfoPocoPage(
  options?: Omit<UseMutationOptions<UserLoginInfoPocoEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getUserLoginInfoPocoPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new User Login Info Poco
 */
export function useCreateUserLoginInfoPoco(
  options?: Omit<UseMutationOptions<UserLoginInfoPocoEntityResult, Error, { data: UserLoginInfoPocoEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: UserLoginInfoPocoEntity }) => createUserLoginInfoPoco(variables.data),
    ...options,
  });
}

/**
 * Update an existing User Login Info Poco
 */
export function useUpdateUserLoginInfoPoco(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateUserLoginInfoPoco(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a User Login Info Poco
 */
export function useDeleteUserLoginInfoPoco(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteUserLoginInfoPoco(variables.id),
    ...options,
  });
}
