import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createMachineType,
  deleteMachineType,
  updateMachineType,
  getMachineTypeById,
  getMachineTypePage,
  generateNewMachineTypeCode,
} from '../../services/generated/machine-type';

import type {
  SortType,
  BooleanResult,
  MachineTypeEntity,
  MachineTypeEntityResult,
  StringObjectKeyValuePair,
  MachineTypeEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MachineType Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for MachineType
 */
export const machineTypeKeys = {
  all: ['machineType'] as const,
  getMachineTypeById: (id: string) => ['machineType', 'getMachineTypeById', id] as const,
  generateNewMachineTypeCode: ['machineType', 'generateNewMachineTypeCode'] as const,
};

/**
 * Get Machine Type by ID
 */
export function useGetMachineTypeById(
  id: string,
  options?: Omit<UseQueryOptions<MachineTypeEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineTypeKeys.getMachineTypeById(id),
    queryFn: () => getMachineTypeById(id),
    ...options,
  });
}

/**
 * Generate a new code for Machine Type
 */
export function useGenerateNewMachineTypeCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineTypeKeys.generateNewMachineTypeCode,
    queryFn: () => generateNewMachineTypeCode(),
    ...options,
  });
}

/**
 * Get paginated list of Machine Type
 */
export function useGetMachineTypePage(
  options?: Omit<UseMutationOptions<MachineTypeEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getMachineTypePage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Machine Type
 */
export function useCreateMachineType(
  options?: Omit<UseMutationOptions<MachineTypeEntityResult, Error, { data: MachineTypeEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: MachineTypeEntity }) => createMachineType(variables.data),
    ...options,
  });
}

/**
 * Update an existing Machine Type
 */
export function useUpdateMachineType(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateMachineType(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Machine Type
 */
export function useDeleteMachineType(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteMachineType(variables.id),
    ...options,
  });
}
