import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createWorkingParameter,
  deleteWorkingParameter,
  updateWorkingParameter,
  getWorkingParameterById,
  getWorkingParameterPage,
  generateNewWorkingParameterCode,
} from '../../services/generated/working-parameter';

import type {
  SortType,
  BooleanResult,
  WorkingParameterEntity,
  StringObjectKeyValuePair,
  WorkingParameterEntityResult,
  WorkingParameterEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// WorkingParameter Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for WorkingParameter
 */
export const workingParameterKeys = {
  all: ['workingParameter'] as const,
  getWorkingParameterById: (id: string) => ['workingParameter', 'getWorkingParameterById', id] as const,
  generateNewWorkingParameterCode: ['workingParameter', 'generateNewWorkingParameterCode'] as const,
};

/**
 * Get Working Parameter by ID
 */
export function useGetWorkingParameterById(
  id: string,
  options?: Omit<UseQueryOptions<WorkingParameterEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workingParameterKeys.getWorkingParameterById(id),
    queryFn: () => getWorkingParameterById(id),
    ...options,
  });
}

/**
 * Generate a new code for Working Parameter
 */
export function useGenerateNewWorkingParameterCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workingParameterKeys.generateNewWorkingParameterCode,
    queryFn: () => generateNewWorkingParameterCode(),
    ...options,
  });
}

/**
 * Get paginated list of Working Parameter
 */
export function useGetWorkingParameterPage(
  options?: Omit<UseMutationOptions<WorkingParameterEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getWorkingParameterPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Working Parameter
 */
export function useCreateWorkingParameter(
  options?: Omit<UseMutationOptions<WorkingParameterEntityResult, Error, { data: WorkingParameterEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: WorkingParameterEntity }) => createWorkingParameter(variables.data),
    ...options,
  });
}

/**
 * Update an existing Working Parameter
 */
export function useUpdateWorkingParameter(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateWorkingParameter(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Working Parameter
 */
export function useDeleteWorkingParameter(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteWorkingParameter(variables.id),
    ...options,
  });
}
