import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createOperationParameterSetting,
  deleteOperationParameterSetting,
  generateNewOperationParameterSettingCode,
  getOperationParameterSettingById,
  getOperationParameterSettingPage,
  updateOperationParameterSetting,
} from '../../services/generated/operation-parameter-setting';

import type {
  BooleanResult,
  OperationParameterSettingEntity,
  OperationParameterSettingEntityBasePaginationResponse,
  OperationParameterSettingEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// OperationParameterSetting Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for OperationParameterSetting
 */
export const operationParameterSettingKeys = {
  all: ['operationParameterSetting'] as const,
  getOperationParameterSettingById: (id: string) => ['operationParameterSetting', 'getOperationParameterSettingById', id] as const,
  generateNewOperationParameterSettingCode: ['operationParameterSetting', 'generateNewOperationParameterSettingCode'] as const,
};

/**
 * Get Operation Parameter Setting by ID
 */
export function useGetOperationParameterSettingById(
  id: string,
  options?: Omit<UseQueryOptions<OperationParameterSettingEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: operationParameterSettingKeys.getOperationParameterSettingById(id),
    queryFn: () => getOperationParameterSettingById(id),
    ...options,
  });
}

/**
 * Generate a new code for Operation Parameter Setting
 */
export function useGenerateNewOperationParameterSettingCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: operationParameterSettingKeys.generateNewOperationParameterSettingCode,
    queryFn: () => generateNewOperationParameterSettingCode(),
    ...options,
  });
}

/**
 * Get paginated list of Operation Parameter Setting
 */
export function useGetOperationParameterSettingPage(
  options?: Omit<UseMutationOptions<OperationParameterSettingEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getOperationParameterSettingPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Operation Parameter Setting
 */
export function useCreateOperationParameterSetting(
  options?: Omit<UseMutationOptions<OperationParameterSettingEntityResult, Error, { data: OperationParameterSettingEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: OperationParameterSettingEntity }) => createOperationParameterSetting(variables.data),
    ...options,
  });
}

/**
 * Update an existing Operation Parameter Setting
 */
export function useUpdateOperationParameterSetting(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateOperationParameterSetting(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Operation Parameter Setting
 */
export function useDeleteOperationParameterSetting(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteOperationParameterSetting(variables.id),
    ...options,
  });
}
