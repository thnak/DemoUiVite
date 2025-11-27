import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createUserDepartment,
  deleteUserDepartment,
  updateUserDepartment,
  getUserDepartmentById,
  getUserDepartmentPage,
  generateNewUserDepartmentCode,
} from '../../services/generated/user-department';

import type {
  SortType,
  BooleanResult,
  UserDepartmentEntity,
  StringObjectKeyValuePair,
  UserDepartmentEntityResult,
  UserDepartmentEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserDepartment Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for UserDepartment
 */
export const userDepartmentKeys = {
  all: ['userDepartment'] as const,
  getUserDepartmentById: (id: string) => ['userDepartment', 'getUserDepartmentById', id] as const,
  generateNewUserDepartmentCode: ['userDepartment', 'generateNewUserDepartmentCode'] as const,
};

/**
 * Get User Department by ID
 */
export function useGetUserDepartmentById(
  id: string,
  options?: Omit<UseQueryOptions<UserDepartmentEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userDepartmentKeys.getUserDepartmentById(id),
    queryFn: () => getUserDepartmentById(id),
    ...options,
  });
}

/**
 * Generate a new code for User Department
 */
export function useGenerateNewUserDepartmentCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userDepartmentKeys.generateNewUserDepartmentCode,
    queryFn: () => generateNewUserDepartmentCode(),
    ...options,
  });
}

/**
 * Get paginated list of User Department
 */
export function useGetUserDepartmentPage(
  options?: Omit<UseMutationOptions<UserDepartmentEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getUserDepartmentPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new User Department
 */
export function useCreateUserDepartment(
  options?: Omit<UseMutationOptions<UserDepartmentEntityResult, Error, { data: UserDepartmentEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: UserDepartmentEntity }) => createUserDepartment(variables.data),
    ...options,
  });
}

/**
 * Update an existing User Department
 */
export function useUpdateUserDepartment(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateUserDepartment(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a User Department
 */
export function useDeleteUserDepartment(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteUserDepartment(variables.id),
    ...options,
  });
}
