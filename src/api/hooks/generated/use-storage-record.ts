import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createStorageRecord,
  deleteStorageRecord,
  updateStorageRecord,
  getStorageRecordById,
  getStorageRecordPage,
  generateNewStorageRecordCode,
} from '../../services/generated/storage-record';

import type {
  SortType,
  BooleanResult,
  StorageRecordEntity,
  StringObjectKeyValuePair,
  StorageRecordEntityResult,
  StorageRecordEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// StorageRecord Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for StorageRecord
 */
export const storageRecordKeys = {
  all: ['storageRecord'] as const,
  getStorageRecordById: (id: string) => ['storageRecord', 'getStorageRecordById', id] as const,
  generateNewStorageRecordCode: ['storageRecord', 'generateNewStorageRecordCode'] as const,
};

/**
 * Get Storage Record by ID
 */
export function useGetStorageRecordById(
  id: string,
  options?: Omit<UseQueryOptions<StorageRecordEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: storageRecordKeys.getStorageRecordById(id),
    queryFn: () => getStorageRecordById(id),
    ...options,
  });
}

/**
 * Generate a new code for Storage Record
 */
export function useGenerateNewStorageRecordCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: storageRecordKeys.generateNewStorageRecordCode,
    queryFn: () => generateNewStorageRecordCode(),
    ...options,
  });
}

/**
 * Get paginated list of Storage Record
 */
export function useGetStorageRecordPage(
  options?: Omit<
    UseMutationOptions<
      StorageRecordEntityBasePaginationResponse,
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
    }) => getStorageRecordPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Storage Record
 */
export function useCreateStorageRecord(
  options?: Omit<
    UseMutationOptions<StorageRecordEntityResult, Error, { data: StorageRecordEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: StorageRecordEntity }) => createStorageRecord(variables.data),
    ...options,
  });
}

/**
 * Update an existing Storage Record
 */
export function useUpdateStorageRecord(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateStorageRecord(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Storage Record
 */
export function useDeleteStorageRecord(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteStorageRecord(variables.id),
    ...options,
  });
}
