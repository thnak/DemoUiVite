import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createBrand,
  deleteBrand,
  generateNewBrandCode,
  getBrandById,
  getBrandPage,
  updateBrand,
} from '../../services/generated/brand';

import type {
  BooleanResult,
  BrandEntity,
  BrandEntityBasePaginationResponse,
  BrandEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Brand Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Brand
 */
export const brandKeys = {
  all: ['brand'] as const,
  getBrandById: (id: string) => ['brand', 'getBrandById', id] as const,
  generateNewBrandCode: ['brand', 'generateNewBrandCode'] as const,
};

/**
 * Get Brand by ID
 */
export function useGetBrandById(
  id: string,
  options?: Omit<UseQueryOptions<BrandEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: brandKeys.getBrandById(id),
    queryFn: () => getBrandById(id),
    ...options,
  });
}

/**
 * Generate a new code for Brand
 */
export function useGenerateNewBrandCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: brandKeys.generateNewBrandCode,
    queryFn: () => generateNewBrandCode(),
    ...options,
  });
}

/**
 * Get paginated list of Brand
 */
export function useGetBrandPage(
  options?: Omit<UseMutationOptions<BrandEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getBrandPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Brand
 */
export function useCreateBrand(
  options?: Omit<UseMutationOptions<BrandEntityResult, Error, { data: BrandEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: BrandEntity }) => createBrand(variables.data),
    ...options,
  });
}

/**
 * Update an existing Brand
 */
export function useUpdateBrand(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateBrand(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Brand
 */
export function useDeleteBrand(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteBrand(variables.id),
    ...options,
  });
}
