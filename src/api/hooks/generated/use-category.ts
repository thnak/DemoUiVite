import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
  getCategoryPage,
  generateNewCategoryCode,
} from '../../services/generated/category';

import type {
  SortType,
  BooleanResult,
  CategoryEntity,
  CategoryEntityResult,
  StringObjectKeyValuePair,
  CategoryEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Category Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Category
 */
export const categoryKeys = {
  all: ['category'] as const,
  getCategoryById: (id: string) => ['category', 'getCategoryById', id] as const,
  generateNewCategoryCode: ['category', 'generateNewCategoryCode'] as const,
};

/**
 * Get Category by ID
 */
export function useGetCategoryById(
  id: string,
  options?: Omit<UseQueryOptions<CategoryEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: categoryKeys.getCategoryById(id),
    queryFn: () => getCategoryById(id),
    ...options,
  });
}

/**
 * Generate a new code for Category
 */
export function useGenerateNewCategoryCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: categoryKeys.generateNewCategoryCode,
    queryFn: () => generateNewCategoryCode(),
    ...options,
  });
}

/**
 * Get paginated list of Category
 */
export function useGetCategoryPage(
  options?: Omit<
    UseMutationOptions<
      CategoryEntityBasePaginationResponse,
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
    }) => getCategoryPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Category
 */
export function useCreateCategory(
  options?: Omit<
    UseMutationOptions<CategoryEntityResult, Error, { data: CategoryEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: CategoryEntity }) => createCategory(variables.data),
    ...options,
  });
}

/**
 * Update an existing Category
 */
export function useUpdateCategory(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateCategory(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Category
 */
export function useDeleteCategory(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteCategory(variables.id),
    ...options,
  });
}
