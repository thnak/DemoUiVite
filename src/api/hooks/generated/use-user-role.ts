import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createUserRole,
  deleteUserRole,
  updateUserRole,
  getUserRoleById,
  getUserRolePage,
  generateNewUserRoleCode,
} from '../../services/generated/user-role';

import type {
  SortType,
  BooleanResult,
  UserRoleEntity,
  UserRoleEntityResult,
  StringObjectKeyValuePair,
  UserRoleEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserRole Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for UserRole
 */
export const userRoleKeys = {
  all: ['userRole'] as const,
  getUserRoleById: (id: string) => ['userRole', 'getUserRoleById', id] as const,
  generateNewUserRoleCode: ['userRole', 'generateNewUserRoleCode'] as const,
};

/**
 * Get User Role by ID
 */
export function useGetUserRoleById(
  id: string,
  options?: Omit<UseQueryOptions<UserRoleEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userRoleKeys.getUserRoleById(id),
    queryFn: () => getUserRoleById(id),
    ...options,
  });
}

/**
 * Generate a new code for User Role
 */
export function useGenerateNewUserRoleCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userRoleKeys.generateNewUserRoleCode,
    queryFn: () => generateNewUserRoleCode(),
    ...options,
  });
}

/**
 * Get paginated list of User Role
 */
export function useGetUserRolePage(
  options?: Omit<
    UseMutationOptions<
      UserRoleEntityBasePaginationResponse,
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
    }) => getUserRolePage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new User Role
 */
export function useCreateUserRole(
  options?: Omit<
    UseMutationOptions<UserRoleEntityResult, Error, { data: UserRoleEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: UserRoleEntity }) => createUserRole(variables.data),
    ...options,
  });
}

/**
 * Update an existing User Role
 */
export function useUpdateUserRole(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateUserRole(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a User Role
 */
export function useDeleteUserRole(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteUserRole(variables.id),
    ...options,
  });
}
