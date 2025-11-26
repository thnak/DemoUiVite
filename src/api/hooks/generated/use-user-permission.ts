import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createUserPermission,
  deleteUserPermission,
  updateUserPermission,
  getUserPermissionById,
  getUserPermissionPage,
  generateNewUserPermissionCode,
} from '../../services/generated/user-permission';

import type {
  SortType,
  BooleanResult,
  UserPermissionEntity,
  StringObjectKeyValuePair,
  UserPermissionEntityResult,
  UserPermissionEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserPermission Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for UserPermission
 */
export const userPermissionKeys = {
  all: ['userPermission'] as const,
  getUserPermissionById: (id: string) => ['userPermission', 'getUserPermissionById', id] as const,
  generateNewUserPermissionCode: ['userPermission', 'generateNewUserPermissionCode'] as const,
};

/**
 * Get User Permission by ID
 */
export function useGetUserPermissionById(
  id: string,
  options?: Omit<UseQueryOptions<UserPermissionEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userPermissionKeys.getUserPermissionById(id),
    queryFn: () => getUserPermissionById(id),
    ...options,
  });
}

/**
 * Generate a new code for User Permission
 */
export function useGenerateNewUserPermissionCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userPermissionKeys.generateNewUserPermissionCode,
    queryFn: () => generateNewUserPermissionCode(),
    ...options,
  });
}

/**
 * Get paginated list of User Permission
 */
export function useGetUserPermissionPage(
  options?: Omit<UseMutationOptions<UserPermissionEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getUserPermissionPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new User Permission
 */
export function useCreateUserPermission(
  options?: Omit<UseMutationOptions<UserPermissionEntityResult, Error, { data: UserPermissionEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: UserPermissionEntity }) => createUserPermission(variables.data),
    ...options,
  });
}

/**
 * Update an existing User Permission
 */
export function useUpdateUserPermission(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateUserPermission(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a User Permission
 */
export function useDeleteUserPermission(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteUserPermission(variables.id),
    ...options,
  });
}
