import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createProduct,
  deleteProduct,
  searchProduct,
  updateProduct,
  getProductById,
  getProductPage,
  generateNewProductCode,
} from '../../services/generated/product';

import type {
  SortType,
  BooleanResult,
  ProductEntity,
  ProductEntityResult,
  StringObjectKeyValuePair,
  ProductEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Product Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Product
 */
export const productKeys = {
  all: ['product'] as const,
  getProductById: (id: string) => ['product', 'getProductById', id] as const,
  generateNewProductCode: ['product', 'generateNewProductCode'] as const,
  searchProduct: ['product', 'searchProduct'] as const,
};

/**
 * Get Product by ID
 */
export function useGetProductById(
  id: string,
  options?: Omit<UseQueryOptions<ProductEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productKeys.getProductById(id),
    queryFn: () => getProductById(id),
    ...options,
  });
}

/**
 * Generate a new code for Product
 */
export function useGenerateNewProductCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productKeys.generateNewProductCode,
    queryFn: () => generateNewProductCode(),
    ...options,
  });
}

/**
 * Search Product entities
 */
export function useSearchProduct(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<ProductEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productKeys.searchProduct,
    queryFn: () => searchProduct(params),
    ...options,
  });
}

/**
 * Get paginated list of Product
 */
export function useGetProductPage(
  options?: Omit<
    UseMutationOptions<
      ProductEntityBasePaginationResponse,
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
    }) => getProductPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Product
 */
export function useCreateProduct(
  options?: Omit<
    UseMutationOptions<ProductEntityResult, Error, { data: ProductEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: ProductEntity }) => createProduct(variables.data),
    ...options,
  });
}

/**
 * Update an existing Product
 */
export function useUpdateProduct(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateProduct(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Product
 */
export function useDeleteProduct(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteProduct(variables.id),
    ...options,
  });
}
