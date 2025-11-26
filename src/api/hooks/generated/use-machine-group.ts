import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createMachineGroup,
  deleteMachineGroup,
  searchMachineGroup,
  updateMachineGroup,
  getMachineGroupById,
  getMachineGroupPage,
  generateNewMachineGroupCode,
} from '../../services/generated/machine-group';

import type {
  SortType,
  BooleanResult,
  MachineGroupEntity,
  MachineGroupEntityResult,
  StringObjectKeyValuePair,
  MachineGroupEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MachineGroup Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for MachineGroup
 */
export const machineGroupKeys = {
  all: ['machineGroup'] as const,
  getMachineGroupById: (id: string) => ['machineGroup', 'getMachineGroupById', id] as const,
  generateNewMachineGroupCode: ['machineGroup', 'generateNewMachineGroupCode'] as const,
  searchMachineGroup: ['machineGroup', 'searchMachineGroup'] as const,
};

/**
 * Get Machine Group by ID
 */
export function useGetMachineGroupById(
  id: string,
  options?: Omit<UseQueryOptions<MachineGroupEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineGroupKeys.getMachineGroupById(id),
    queryFn: () => getMachineGroupById(id),
    ...options,
  });
}

/**
 * Generate a new code for Machine Group
 */
export function useGenerateNewMachineGroupCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineGroupKeys.generateNewMachineGroupCode,
    queryFn: () => generateNewMachineGroupCode(),
    ...options,
  });
}

/**
 * Search Machine Group entities
 */
export function useSearchMachineGroup(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<MachineGroupEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: machineGroupKeys.searchMachineGroup,
    queryFn: () => searchMachineGroup(params),
    ...options,
  });
}

/**
 * Get paginated list of Machine Group
 */
export function useGetMachineGroupPage(
  options?: Omit<
    UseMutationOptions<
      MachineGroupEntityBasePaginationResponse,
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
    }) => getMachineGroupPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Machine Group
 */
export function useCreateMachineGroup(
  options?: Omit<
    UseMutationOptions<MachineGroupEntityResult, Error, { data: MachineGroupEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: MachineGroupEntity }) => createMachineGroup(variables.data),
    ...options,
  });
}

/**
 * Update an existing Machine Group
 */
export function useUpdateMachineGroup(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateMachineGroup(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Machine Group
 */
export function useDeleteMachineGroup(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteMachineGroup(variables.id),
    ...options,
  });
}
