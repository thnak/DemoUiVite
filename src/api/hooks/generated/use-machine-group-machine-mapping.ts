import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createMachineGroupMachineMapping,
  deleteMachineGroupMachineMapping,
  updateMachineGroupMachineMapping,
  getMachineGroupMachineMappingById,
  getMachineGroupMachineMappingPage,
  generateNewMachineGroupMachineMappingCode,
} from '../../services/generated/machine-group-machine-mapping';

import type {
  SortType,
  BooleanResult,
  StringObjectKeyValuePair,
  MachineGroupMachineMapping,
  MachineGroupMachineMappingResult,
  MachineGroupMachineMappingBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MachineGroupMachineMapping Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for MachineGroupMachineMapping
 */
export const machineGroupMachineMappingKeys = {
  all: ['machineGroupMachineMapping'] as const,
  getMachineGroupMachineMappingById: (id: string) =>
    ['machineGroupMachineMapping', 'getMachineGroupMachineMappingById', id] as const,
  generateNewMachineGroupMachineMappingCode: [
    'machineGroupMachineMapping',
    'generateNewMachineGroupMachineMappingCode',
  ] as const,
};

/**
 * Get Machine Group Machine Mapping by ID
 */
export function useGetMachineGroupMachineMappingById(
  id: string,
  options?: Omit<UseQueryOptions<MachineGroupMachineMapping, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineGroupMachineMappingKeys.getMachineGroupMachineMappingById(id),
    queryFn: () => getMachineGroupMachineMappingById(id),
    ...options,
  });
}

/**
 * Generate a new code for Machine Group Machine Mapping
 */
export function useGenerateNewMachineGroupMachineMappingCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineGroupMachineMappingKeys.generateNewMachineGroupMachineMappingCode,
    queryFn: () => generateNewMachineGroupMachineMappingCode(),
    ...options,
  });
}

/**
 * Get paginated list of Machine Group Machine Mapping
 */
export function useGetMachineGroupMachineMappingPage(
  options?: Omit<
    UseMutationOptions<
      MachineGroupMachineMappingBasePaginationResponse,
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
    }) => getMachineGroupMachineMappingPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Machine Group Machine Mapping
 */
export function useCreateMachineGroupMachineMapping(
  options?: Omit<
    UseMutationOptions<
      MachineGroupMachineMappingResult,
      Error,
      { data: MachineGroupMachineMapping }
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: MachineGroupMachineMapping }) =>
      createMachineGroupMachineMapping(variables.data),
    ...options,
  });
}

/**
 * Update an existing Machine Group Machine Mapping
 */
export function useUpdateMachineGroupMachineMapping(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateMachineGroupMachineMapping(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Machine Group Machine Mapping
 */
export function useDeleteMachineGroupMachineMapping(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteMachineGroupMachineMapping(variables.id),
    ...options,
  });
}
