import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createRole,
  deleteRole,
  generateNewRoleCode,
  getRoleById,
  getRolePage,
  updateRole,
} from '../../services/generated/role';

import type {
  BooleanResult,
  RoleEntity,
  RoleEntityBasePaginationResponse,
  RoleEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Role Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Role
 */
export const roleKeys = {
  all: ['role'] as const,
  getRoleById: (id: string) => ['role', 'getRoleById', id] as const,
  generateNewRoleCode: ['role', 'generateNewRoleCode'] as const,
};

/**
 * Get Role by ID
 */
export function useGetRoleById(
  id: string,
  options?: Omit<UseQueryOptions<RoleEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: roleKeys.getRoleById(id),
    queryFn: () => getRoleById(id),
    ...options,
  });
}

/**
 * Generate a new code for Role
 */
export function useGenerateNewRoleCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: roleKeys.generateNewRoleCode,
    queryFn: () => generateNewRoleCode(),
    ...options,
  });
}

/**
 * Get paginated list of Role
 */
export function useGetRolePage(
  options?: Omit<UseMutationOptions<RoleEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getRolePage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Role
 */
export function useCreateRole(
  options?: Omit<UseMutationOptions<RoleEntityResult, Error, { data: RoleEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: RoleEntity }) => createRole(variables.data),
    ...options,
  });
}

/**
 * Update an existing Role
 */
export function useUpdateRole(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateRole(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Role
 */
export function useDeleteRole(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteRole(variables.id),
    ...options,
  });
}
