import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createWarehouse,
  deleteWarehouse,
  generateNewWarehouseCode,
  getWarehouseById,
  getWarehousePage,
  updateWarehouse,
} from '../../services/generated/warehouse';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  WarehouseEntity,
  WarehouseEntityBasePaginationResponse,
  WarehouseEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Warehouse Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Warehouse
 */
export const warehouseKeys = {
  all: ['warehouse'] as const,
  getWarehouseById: (id: string) => ['warehouse', 'getWarehouseById', id] as const,
  generateNewWarehouseCode: ['warehouse', 'generateNewWarehouseCode'] as const,
};

/**
 * Get Warehouse by ID
 */
export function useGetWarehouseById(
  id: string,
  options?: Omit<UseQueryOptions<WarehouseEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: warehouseKeys.getWarehouseById(id),
    queryFn: () => getWarehouseById(id),
    ...options,
  });
}

/**
 * Generate a new code for Warehouse
 */
export function useGenerateNewWarehouseCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: warehouseKeys.generateNewWarehouseCode,
    queryFn: () => generateNewWarehouseCode(),
    ...options,
  });
}

/**
 * Get paginated list of Warehouse
 */
export function useGetWarehousePage(
  options?: Omit<UseMutationOptions<WarehouseEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getWarehousePage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Warehouse
 */
export function useCreateWarehouse(
  options?: Omit<UseMutationOptions<WarehouseEntityResult, Error, { data: WarehouseEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: WarehouseEntity }) => createWarehouse(variables.data),
    ...options,
  });
}

/**
 * Update an existing Warehouse
 */
export function useUpdateWarehouse(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateWarehouse(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Warehouse
 */
export function useDeleteWarehouse(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteWarehouse(variables.id),
    ...options,
  });
}
