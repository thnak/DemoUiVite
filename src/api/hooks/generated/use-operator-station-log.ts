import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createOperatorStationLog,
  deleteOperatorStationLog,
  updateOperatorStationLog,
  getOperatorStationLogById,
  getOperatorStationLogPage,
  generateNewOperatorStationLogCode,
} from '../../services/generated/operator-station-log';

import type {
  SortType,
  BooleanResult,
  OperatorStationLogEntity,
  StringObjectKeyValuePair,
  OperatorStationLogEntityResult,
  OperatorStationLogEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// OperatorStationLog Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for OperatorStationLog
 */
export const operatorStationLogKeys = {
  all: ['operatorStationLog'] as const,
  getOperatorStationLogById: (id: string) => ['operatorStationLog', 'getOperatorStationLogById', id] as const,
  generateNewOperatorStationLogCode: ['operatorStationLog', 'generateNewOperatorStationLogCode'] as const,
};

/**
 * Get Operator Station Log by ID
 */
export function useGetOperatorStationLogById(
  id: string,
  options?: Omit<UseQueryOptions<OperatorStationLogEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: operatorStationLogKeys.getOperatorStationLogById(id),
    queryFn: () => getOperatorStationLogById(id),
    ...options,
  });
}

/**
 * Generate a new code for Operator Station Log
 */
export function useGenerateNewOperatorStationLogCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: operatorStationLogKeys.generateNewOperatorStationLogCode,
    queryFn: () => generateNewOperatorStationLogCode(),
    ...options,
  });
}

/**
 * Get paginated list of Operator Station Log
 */
export function useGetOperatorStationLogPage(
  options?: Omit<UseMutationOptions<OperatorStationLogEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getOperatorStationLogPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Operator Station Log
 */
export function useCreateOperatorStationLog(
  options?: Omit<UseMutationOptions<OperatorStationLogEntityResult, Error, { data: OperatorStationLogEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: OperatorStationLogEntity }) => createOperatorStationLog(variables.data),
    ...options,
  });
}

/**
 * Update an existing Operator Station Log
 */
export function useUpdateOperatorStationLog(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateOperatorStationLog(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Operator Station Log
 */
export function useDeleteOperatorStationLog(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteOperatorStationLog(variables.id),
    ...options,
  });
}
