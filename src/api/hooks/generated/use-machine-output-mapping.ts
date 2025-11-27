import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createMachineOutputMapping,
  deleteMachineOutputMapping,
  updateMachineOutputMapping,
  getMachineOutputMappingById,
  getMachineOutputMappingPage,
  generateNewMachineOutputMappingCode,
} from '../../services/generated/machine-output-mapping';

import type {
  SortType,
  BooleanResult,
  MachineOutputMapping,
  StringObjectKeyValuePair,
  MachineOutputMappingResult,
  MachineOutputMappingBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MachineOutputMapping Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for MachineOutputMapping
 */
export const machineOutputMappingKeys = {
  all: ['machineOutputMapping'] as const,
  getMachineOutputMappingById: (id: string) => ['machineOutputMapping', 'getMachineOutputMappingById', id] as const,
  generateNewMachineOutputMappingCode: ['machineOutputMapping', 'generateNewMachineOutputMappingCode'] as const,
};

/**
 * Get Machine Output Mapping by ID
 */
export function useGetMachineOutputMappingById(
  id: string,
  options?: Omit<UseQueryOptions<MachineOutputMapping, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineOutputMappingKeys.getMachineOutputMappingById(id),
    queryFn: () => getMachineOutputMappingById(id),
    ...options,
  });
}

/**
 * Generate a new code for Machine Output Mapping
 */
export function useGenerateNewMachineOutputMappingCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineOutputMappingKeys.generateNewMachineOutputMappingCode,
    queryFn: () => generateNewMachineOutputMappingCode(),
    ...options,
  });
}

/**
 * Get paginated list of Machine Output Mapping
 */
export function useGetMachineOutputMappingPage(
  options?: Omit<UseMutationOptions<MachineOutputMappingBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getMachineOutputMappingPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Machine Output Mapping
 */
export function useCreateMachineOutputMapping(
  options?: Omit<UseMutationOptions<MachineOutputMappingResult, Error, { data: MachineOutputMapping }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: MachineOutputMapping }) => createMachineOutputMapping(variables.data),
    ...options,
  });
}

/**
 * Update an existing Machine Output Mapping
 */
export function useUpdateMachineOutputMapping(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateMachineOutputMapping(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Machine Output Mapping
 */
export function useDeleteMachineOutputMapping(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteMachineOutputMapping(variables.id),
    ...options,
  });
}
