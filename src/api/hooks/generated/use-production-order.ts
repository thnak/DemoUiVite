import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createProductionOrder,
  deleteProductionOrder,
  updateProductionOrder,
  getProductionOrderById,
  getProductionOrderPage,
  generateNewProductionOrderCode,
} from '../../services/generated/production-order';

import type {
  SortType,
  BooleanResult,
  ProductionOrderEntity,
  StringObjectKeyValuePair,
  ProductionOrderEntityResult,
  ProductionOrderEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ProductionOrder Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ProductionOrder
 */
export const productionOrderKeys = {
  all: ['productionOrder'] as const,
  getProductionOrderById: (id: string) =>
    ['productionOrder', 'getProductionOrderById', id] as const,
  generateNewProductionOrderCode: ['productionOrder', 'generateNewProductionOrderCode'] as const,
};

/**
 * Get Production Order by ID
 */
export function useGetProductionOrderById(
  id: string,
  options?: Omit<UseQueryOptions<ProductionOrderEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productionOrderKeys.getProductionOrderById(id),
    queryFn: () => getProductionOrderById(id),
    ...options,
  });
}

/**
 * Generate a new code for Production Order
 */
export function useGenerateNewProductionOrderCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: productionOrderKeys.generateNewProductionOrderCode,
    queryFn: () => generateNewProductionOrderCode(),
    ...options,
  });
}

/**
 * Get paginated list of Production Order
 */
export function useGetProductionOrderPage(
  options?: Omit<
    UseMutationOptions<
      ProductionOrderEntityBasePaginationResponse,
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
    }) => getProductionOrderPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Production Order
 */
export function useCreateProductionOrder(
  options?: Omit<
    UseMutationOptions<ProductionOrderEntityResult, Error, { data: ProductionOrderEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: ProductionOrderEntity }) =>
      createProductionOrder(variables.data),
    ...options,
  });
}

/**
 * Update an existing Production Order
 */
export function useUpdateProductionOrder(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateProductionOrder(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Production Order
 */
export function useDeleteProductionOrder(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteProductionOrder(variables.id),
    ...options,
  });
}
