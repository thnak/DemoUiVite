import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createOperation,
  deleteOperation,
  searchOperation,
  updateOperation,
  getOperationById,
  getOperationPage,
  generateNewOperationCode,
  getapiOperationsearchbycode,
} from '../../services/generated/operation';

import type {
  SortType,
  BooleanResult,
  OperationEntity,
  OperationEntityResult,
  StringObjectKeyValuePair,
  OperationEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Operation Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Operation
 */
export const operationKeys = {
  all: ['operation'] as const,
  getOperationById: (id: string) => ['operation', 'getOperationById', id] as const,
  generateNewOperationCode: ['operation', 'generateNewOperationCode'] as const,
  searchOperation: ['operation', 'searchOperation'] as const,
  getapiOperationsearchbycode: ['operation', 'getapiOperationsearchbycode'] as const,
};

/**
 * Get Operation by ID
 */
export function useGetOperationById(
  id: string,
  options?: Omit<UseQueryOptions<OperationEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: operationKeys.getOperationById(id),
    queryFn: () => getOperationById(id),
    ...options,
  });
}

/**
 * Generate a new code for Operation
 */
export function useGenerateNewOperationCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: operationKeys.generateNewOperationCode,
    queryFn: () => generateNewOperationCode(),
    ...options,
  });
}

/**
 * Search Operation entities
 */
export function useSearchOperation(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<OperationEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: operationKeys.searchOperation,
    queryFn: () => searchOperation(params),
    ...options,
  });
}

/**
 */
export function useGetapiOperationsearchbycode(
  params?: { keyword?: string },
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: operationKeys.getapiOperationsearchbycode,
    queryFn: () => getapiOperationsearchbycode(params),
    ...options,
  });
}

/**
 * Get paginated list of Operation
 */
export function useGetOperationPage(
  options?: Omit<UseMutationOptions<OperationEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getOperationPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Operation
 */
export function useCreateOperation(
  options?: Omit<UseMutationOptions<OperationEntityResult, Error, { data: OperationEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: OperationEntity }) => createOperation(variables.data),
    ...options,
  });
}

/**
 * Update an existing Operation
 */
export function useUpdateOperation(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateOperation(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Operation
 */
export function useDeleteOperation(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteOperation(variables.id),
    ...options,
  });
}
