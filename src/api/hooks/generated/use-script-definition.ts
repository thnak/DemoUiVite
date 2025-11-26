import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createScriptDefinition,
  deleteScriptDefinition,
  searchScriptDefinition,
  updateScriptDefinition,
  getScriptDefinitionById,
  getScriptDefinitionPage,
  generateNewScriptDefinitionCode,
} from '../../services/generated/script-definition';

import type {
  SortType,
  BooleanResult,
  ScriptDefinitionEntity,
  StringObjectKeyValuePair,
  ScriptDefinitionEntityResult,
  ScriptDefinitionEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ScriptDefinition Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ScriptDefinition
 */
export const scriptDefinitionKeys = {
  all: ['scriptDefinition'] as const,
  getScriptDefinitionById: (id: string) =>
    ['scriptDefinition', 'getScriptDefinitionById', id] as const,
  generateNewScriptDefinitionCode: ['scriptDefinition', 'generateNewScriptDefinitionCode'] as const,
  searchScriptDefinition: ['scriptDefinition', 'searchScriptDefinition'] as const,
};

/**
 * Get Script Definition by ID
 */
export function useGetScriptDefinitionById(
  id: string,
  options?: Omit<UseQueryOptions<ScriptDefinitionEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: scriptDefinitionKeys.getScriptDefinitionById(id),
    queryFn: () => getScriptDefinitionById(id),
    ...options,
  });
}

/**
 * Generate a new code for Script Definition
 */
export function useGenerateNewScriptDefinitionCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: scriptDefinitionKeys.generateNewScriptDefinitionCode,
    queryFn: () => generateNewScriptDefinitionCode(),
    ...options,
  });
}

/**
 * Search Script Definition entities
 */
export function useSearchScriptDefinition(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<ScriptDefinitionEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: scriptDefinitionKeys.searchScriptDefinition,
    queryFn: () => searchScriptDefinition(params),
    ...options,
  });
}

/**
 * Get paginated list of Script Definition
 */
export function useGetScriptDefinitionPage(
  options?: Omit<
    UseMutationOptions<
      ScriptDefinitionEntityBasePaginationResponse,
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
    }) => getScriptDefinitionPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Script Definition
 */
export function useCreateScriptDefinition(
  options?: Omit<
    UseMutationOptions<ScriptDefinitionEntityResult, Error, { data: ScriptDefinitionEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: ScriptDefinitionEntity }) =>
      createScriptDefinition(variables.data),
    ...options,
  });
}

/**
 * Update an existing Script Definition
 */
export function useUpdateScriptDefinition(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateScriptDefinition(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Script Definition
 */
export function useDeleteScriptDefinition(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteScriptDefinition(variables.id),
    ...options,
  });
}
