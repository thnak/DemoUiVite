import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createRolePermission,
  deleteRolePermission,
  generateNewRolePermissionCode,
  getRolePermissionById,
  getRolePermissionPage,
  updateRolePermission,
} from '../../services/generated/role-permission';

import type {
  BooleanResult,
  RolePermissionEntity,
  RolePermissionEntityBasePaginationResponse,
  RolePermissionEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// RolePermission Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for RolePermission
 */
export const rolePermissionKeys = {
  all: ['rolePermission'] as const,
  getRolePermissionById: (id: string) => ['rolePermission', 'getRolePermissionById', id] as const,
  generateNewRolePermissionCode: ['rolePermission', 'generateNewRolePermissionCode'] as const,
};

/**
 * Get Role Permission by ID
 */
export function useGetRolePermissionById(
  id: string,
  options?: Omit<UseQueryOptions<RolePermissionEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: rolePermissionKeys.getRolePermissionById(id),
    queryFn: () => getRolePermissionById(id),
    ...options,
  });
}

/**
 * Generate a new code for Role Permission
 */
export function useGenerateNewRolePermissionCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: rolePermissionKeys.generateNewRolePermissionCode,
    queryFn: () => generateNewRolePermissionCode(),
    ...options,
  });
}

/**
 * Get paginated list of Role Permission
 */
export function useGetRolePermissionPage(
  options?: Omit<UseMutationOptions<RolePermissionEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getRolePermissionPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Role Permission
 */
export function useCreateRolePermission(
  options?: Omit<UseMutationOptions<RolePermissionEntityResult, Error, { data: RolePermissionEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: RolePermissionEntity }) => createRolePermission(variables.data),
    ...options,
  });
}

/**
 * Update an existing Role Permission
 */
export function useUpdateRolePermission(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateRolePermission(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Role Permission
 */
export function useDeleteRolePermission(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteRolePermission(variables.id),
    ...options,
  });
}
