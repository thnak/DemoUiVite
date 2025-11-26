import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createDepartment,
  deleteDepartment,
  searchDepartment,
  updateDepartment,
  getDepartmentById,
  getDepartmentPage,
  generateNewDepartmentCode,
} from '../../services/generated/department';

import type {
  SortType,
  BooleanResult,
  DepartmentEntity,
  DepartmentEntityResult,
  StringObjectKeyValuePair,
  DepartmentEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Department Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Department
 */
export const departmentKeys = {
  all: ['department'] as const,
  getDepartmentById: (id: string) => ['department', 'getDepartmentById', id] as const,
  generateNewDepartmentCode: ['department', 'generateNewDepartmentCode'] as const,
  searchDepartment: ['department', 'searchDepartment'] as const,
};

/**
 * Get Department by ID
 */
export function useGetDepartmentById(
  id: string,
  options?: Omit<UseQueryOptions<DepartmentEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: departmentKeys.getDepartmentById(id),
    queryFn: () => getDepartmentById(id),
    ...options,
  });
}

/**
 * Generate a new code for Department
 */
export function useGenerateNewDepartmentCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: departmentKeys.generateNewDepartmentCode,
    queryFn: () => generateNewDepartmentCode(),
    ...options,
  });
}

/**
 * Search Department entities
 */
export function useSearchDepartment(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<DepartmentEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: departmentKeys.searchDepartment,
    queryFn: () => searchDepartment(params),
    ...options,
  });
}

/**
 * Get paginated list of Department
 */
export function useGetDepartmentPage(
  options?: Omit<
    UseMutationOptions<
      DepartmentEntityBasePaginationResponse,
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
    }) => getDepartmentPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Department
 */
export function useCreateDepartment(
  options?: Omit<
    UseMutationOptions<DepartmentEntityResult, Error, { data: DepartmentEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: DepartmentEntity }) => createDepartment(variables.data),
    ...options,
  });
}

/**
 * Update an existing Department
 */
export function useUpdateDepartment(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateDepartment(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Department
 */
export function useDeleteDepartment(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteDepartment(variables.id),
    ...options,
  });
}
