import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createAssemblyHashInfo,
  deleteAssemblyHashInfo,
  updateAssemblyHashInfo,
  getAssemblyHashInfoById,
  getAssemblyHashInfoPage,
  generateNewAssemblyHashInfoCode,
} from '../../services/generated/assembly-hash-info';

import type {
  SortType,
  BooleanResult,
  AssemblyHashInfoEntity,
  StringObjectKeyValuePair,
  AssemblyHashInfoEntityResult,
  AssemblyHashInfoEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// AssemblyHashInfo Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for AssemblyHashInfo
 */
export const assemblyHashInfoKeys = {
  all: ['assemblyHashInfo'] as const,
  getAssemblyHashInfoById: (id: string) =>
    ['assemblyHashInfo', 'getAssemblyHashInfoById', id] as const,
  generateNewAssemblyHashInfoCode: ['assemblyHashInfo', 'generateNewAssemblyHashInfoCode'] as const,
};

/**
 * Get Assembly Hash Info by ID
 */
export function useGetAssemblyHashInfoById(
  id: string,
  options?: Omit<UseQueryOptions<AssemblyHashInfoEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: assemblyHashInfoKeys.getAssemblyHashInfoById(id),
    queryFn: () => getAssemblyHashInfoById(id),
    ...options,
  });
}

/**
 * Generate a new code for Assembly Hash Info
 */
export function useGenerateNewAssemblyHashInfoCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: assemblyHashInfoKeys.generateNewAssemblyHashInfoCode,
    queryFn: () => generateNewAssemblyHashInfoCode(),
    ...options,
  });
}

/**
 * Get paginated list of Assembly Hash Info
 */
export function useGetAssemblyHashInfoPage(
  options?: Omit<
    UseMutationOptions<
      AssemblyHashInfoEntityBasePaginationResponse,
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
    }) => getAssemblyHashInfoPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Assembly Hash Info
 */
export function useCreateAssemblyHashInfo(
  options?: Omit<
    UseMutationOptions<AssemblyHashInfoEntityResult, Error, { data: AssemblyHashInfoEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: AssemblyHashInfoEntity }) =>
      createAssemblyHashInfo(variables.data),
    ...options,
  });
}

/**
 * Update an existing Assembly Hash Info
 */
export function useUpdateAssemblyHashInfo(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateAssemblyHashInfo(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Assembly Hash Info
 */
export function useDeleteAssemblyHashInfo(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteAssemblyHashInfo(variables.id),
    ...options,
  });
}
