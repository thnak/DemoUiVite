import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createDataProtectionKey,
  deleteDataProtectionKey,
  generateNewDataProtectionKeyCode,
  getDataProtectionKeyById,
  getDataProtectionKeyPage,
  updateDataProtectionKey,
} from '../../services/generated/data-protection-key';

import type {
  BooleanResult,
  DataProtectionKeyEntity,
  DataProtectionKeyEntityBasePaginationResponse,
  DataProtectionKeyEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DataProtectionKey Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for DataProtectionKey
 */
export const dataProtectionKeyKeys = {
  all: ['dataProtectionKey'] as const,
  getDataProtectionKeyById: (id: string) => ['dataProtectionKey', 'getDataProtectionKeyById', id] as const,
  generateNewDataProtectionKeyCode: ['dataProtectionKey', 'generateNewDataProtectionKeyCode'] as const,
};

/**
 * Get Data Protection Key by ID
 */
export function useGetDataProtectionKeyById(
  id: string,
  options?: Omit<UseQueryOptions<DataProtectionKeyEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dataProtectionKeyKeys.getDataProtectionKeyById(id),
    queryFn: () => getDataProtectionKeyById(id),
    ...options,
  });
}

/**
 * Generate a new code for Data Protection Key
 */
export function useGenerateNewDataProtectionKeyCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dataProtectionKeyKeys.generateNewDataProtectionKeyCode,
    queryFn: () => generateNewDataProtectionKeyCode(),
    ...options,
  });
}

/**
 * Get paginated list of Data Protection Key
 */
export function useGetDataProtectionKeyPage(
  options?: Omit<UseMutationOptions<DataProtectionKeyEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getDataProtectionKeyPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Data Protection Key
 */
export function useCreateDataProtectionKey(
  options?: Omit<UseMutationOptions<DataProtectionKeyEntityResult, Error, { data: DataProtectionKeyEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: DataProtectionKeyEntity }) => createDataProtectionKey(variables.data),
    ...options,
  });
}

/**
 * Update an existing Data Protection Key
 */
export function useUpdateDataProtectionKey(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateDataProtectionKey(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Data Protection Key
 */
export function useDeleteDataProtectionKey(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteDataProtectionKey(variables.id),
    ...options,
  });
}
