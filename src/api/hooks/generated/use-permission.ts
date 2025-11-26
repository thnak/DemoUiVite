import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createPermission,
  deletePermission,
  updatePermission,
  getPermissionById,
  getPermissionPage,
  generateNewPermissionCode,
} from '../../services/generated/permission';

import type {
  SortType,
  BooleanResult,
  PermissionEntity,
  PermissionEntityResult,
  StringObjectKeyValuePair,
  PermissionEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Permission Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Permission
 */
export const permissionKeys = {
  all: ['permission'] as const,
  getPermissionById: (id: string) => ['permission', 'getPermissionById', id] as const,
  generateNewPermissionCode: ['permission', 'generateNewPermissionCode'] as const,
};

/**
 * Get Permission by ID
 */
export function useGetPermissionById(
  id: string,
  options?: Omit<UseQueryOptions<PermissionEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: permissionKeys.getPermissionById(id),
    queryFn: () => getPermissionById(id),
    ...options,
  });
}

/**
 * Generate a new code for Permission
 */
export function useGenerateNewPermissionCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: permissionKeys.generateNewPermissionCode,
    queryFn: () => generateNewPermissionCode(),
    ...options,
  });
}

/**
 * Get paginated list of Permission
 */
export function useGetPermissionPage(
  options?: Omit<
    UseMutationOptions<
      PermissionEntityBasePaginationResponse,
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
    }) => getPermissionPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Permission
 */
export function useCreatePermission(
  options?: Omit<
    UseMutationOptions<PermissionEntityResult, Error, { data: PermissionEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: PermissionEntity }) => createPermission(variables.data),
    ...options,
  });
}

/**
 * Update an existing Permission
 */
export function useUpdatePermission(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updatePermission(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Permission
 */
export function useDeletePermission(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deletePermission(variables.id),
    ...options,
  });
}
