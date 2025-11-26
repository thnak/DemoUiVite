import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createStorageBlock,
  deleteStorageBlock,
  generateNewStorageBlockCode,
  getStorageBlockById,
  getStorageBlockPage,
  updateStorageBlock,
} from '../../services/generated/storage-block';

import type {
  BooleanResult,
  SortType,
  StorageBlockEntity,
  StorageBlockEntityBasePaginationResponse,
  StorageBlockEntityResult,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// StorageBlock Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for StorageBlock
 */
export const storageBlockKeys = {
  all: ['storageBlock'] as const,
  getStorageBlockById: (id: string) => ['storageBlock', 'getStorageBlockById', id] as const,
  generateNewStorageBlockCode: ['storageBlock', 'generateNewStorageBlockCode'] as const,
};

/**
 * Get Storage Block by ID
 */
export function useGetStorageBlockById(
  id: string,
  options?: Omit<UseQueryOptions<StorageBlockEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: storageBlockKeys.getStorageBlockById(id),
    queryFn: () => getStorageBlockById(id),
    ...options,
  });
}

/**
 * Generate a new code for Storage Block
 */
export function useGenerateNewStorageBlockCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: storageBlockKeys.generateNewStorageBlockCode,
    queryFn: () => generateNewStorageBlockCode(),
    ...options,
  });
}

/**
 * Get paginated list of Storage Block
 */
export function useGetStorageBlockPage(
  options?: Omit<UseMutationOptions<StorageBlockEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getStorageBlockPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Storage Block
 */
export function useCreateStorageBlock(
  options?: Omit<UseMutationOptions<StorageBlockEntityResult, Error, { data: StorageBlockEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: StorageBlockEntity }) => createStorageBlock(variables.data),
    ...options,
  });
}

/**
 * Update an existing Storage Block
 */
export function useUpdateStorageBlock(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateStorageBlock(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Storage Block
 */
export function useDeleteStorageBlock(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteStorageBlock(variables.id),
    ...options,
  });
}
