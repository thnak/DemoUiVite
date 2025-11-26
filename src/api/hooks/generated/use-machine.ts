import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createMachine,
  deleteMachine,
  generateNewMachineCode,
  getMachineById,
  getMachinePage,
  searchMachine,
  updateMachine,
} from '../../services/generated/machine';

import type {
  BooleanResult,
  MachineEntity,
  MachineEntityBasePaginationResponse,
  MachineEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Machine Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Machine
 */
export const machineKeys = {
  all: ['machine'] as const,
  getMachineById: (id: string) => ['machine', 'getMachineById', id] as const,
  generateNewMachineCode: ['machine', 'generateNewMachineCode'] as const,
  searchMachine: ['machine', 'searchMachine'] as const,
};

/**
 * Get Machine by ID
 */
export function useGetMachineById(
  id: string,
  options?: Omit<UseQueryOptions<MachineEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineKeys.getMachineById(id),
    queryFn: () => getMachineById(id),
    ...options,
  });
}

/**
 * Generate a new code for Machine
 */
export function useGenerateNewMachineCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineKeys.generateNewMachineCode,
    queryFn: () => generateNewMachineCode(),
    ...options,
  });
}

/**
 * Search Machine entities
 */
export function useSearchMachine(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<MachineEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineKeys.searchMachine,
    queryFn: () => searchMachine(params),
    ...options,
  });
}

/**
 * Get paginated list of Machine
 */
export function useGetMachinePage(
  options?: Omit<UseMutationOptions<MachineEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getMachinePage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Machine
 */
export function useCreateMachine(
  options?: Omit<UseMutationOptions<MachineEntityResult, Error, { data: MachineEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: MachineEntity }) => createMachine(variables.data),
    ...options,
  });
}

/**
 * Update an existing Machine
 */
export function useUpdateMachine(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateMachine(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Machine
 */
export function useDeleteMachine(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteMachine(variables.id),
    ...options,
  });
}
