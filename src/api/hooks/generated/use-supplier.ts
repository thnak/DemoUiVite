import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createSupplier,
  deleteSupplier,
  updateSupplier,
  getSupplierById,
  getSupplierPage,
  generateNewSupplierCode,
} from '../../services/generated/supplier';

import type {
  SortType,
  BooleanResult,
  SupplierEntity,
  SupplierEntityResult,
  StringObjectKeyValuePair,
  SupplierEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Supplier Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Supplier
 */
export const supplierKeys = {
  all: ['supplier'] as const,
  getSupplierById: (id: string) => ['supplier', 'getSupplierById', id] as const,
  generateNewSupplierCode: ['supplier', 'generateNewSupplierCode'] as const,
};

/**
 * Get Supplier by ID
 */
export function useGetSupplierById(
  id: string,
  options?: Omit<UseQueryOptions<SupplierEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: supplierKeys.getSupplierById(id),
    queryFn: () => getSupplierById(id),
    ...options,
  });
}

/**
 * Generate a new code for Supplier
 */
export function useGenerateNewSupplierCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: supplierKeys.generateNewSupplierCode,
    queryFn: () => generateNewSupplierCode(),
    ...options,
  });
}

/**
 * Get paginated list of Supplier
 */
export function useGetSupplierPage(
  options?: Omit<UseMutationOptions<SupplierEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getSupplierPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Supplier
 */
export function useCreateSupplier(
  options?: Omit<UseMutationOptions<SupplierEntityResult, Error, { data: SupplierEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SupplierEntity }) => createSupplier(variables.data),
    ...options,
  });
}

/**
 * Update an existing Supplier
 */
export function useUpdateSupplier(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateSupplier(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Supplier
 */
export function useDeleteSupplier(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteSupplier(variables.id),
    ...options,
  });
}
