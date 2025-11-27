import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createOperationVariant,
  deleteOperationVariant,
  updateOperationVariant,
  getOperationVariantById,
  getOperationVariantPage,
  generateNewOperationVariantCode,
} from '../../services/generated/operation-variant';

import type {
  SortType,
  BooleanResult,
  OperationVariantEntity,
  StringObjectKeyValuePair,
  OperationVariantEntityResult,
  OperationVariantEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// OperationVariant Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for OperationVariant
 */
export const operationVariantKeys = {
  all: ['operationVariant'] as const,
  getOperationVariantById: (id: string) => ['operationVariant', 'getOperationVariantById', id] as const,
  generateNewOperationVariantCode: ['operationVariant', 'generateNewOperationVariantCode'] as const,
};

/**
 * Get Operation Variant by ID
 */
export function useGetOperationVariantById(
  id: string,
  options?: Omit<UseQueryOptions<OperationVariantEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: operationVariantKeys.getOperationVariantById(id),
    queryFn: () => getOperationVariantById(id),
    ...options,
  });
}

/**
 * Generate a new code for Operation Variant
 */
export function useGenerateNewOperationVariantCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: operationVariantKeys.generateNewOperationVariantCode,
    queryFn: () => generateNewOperationVariantCode(),
    ...options,
  });
}

/**
 * Get paginated list of Operation Variant
 */
export function useGetOperationVariantPage(
  options?: Omit<UseMutationOptions<OperationVariantEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getOperationVariantPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Operation Variant
 */
export function useCreateOperationVariant(
  options?: Omit<UseMutationOptions<OperationVariantEntityResult, Error, { data: OperationVariantEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: OperationVariantEntity }) => createOperationVariant(variables.data),
    ...options,
  });
}

/**
 * Update an existing Operation Variant
 */
export function useUpdateOperationVariant(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateOperationVariant(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Operation Variant
 */
export function useDeleteOperationVariant(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteOperationVariant(variables.id),
    ...options,
  });
}
