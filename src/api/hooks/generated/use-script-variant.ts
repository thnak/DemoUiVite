import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createScriptVariant,
  deleteScriptVariant,
  generateNewScriptVariantCode,
  getScriptVariantById,
  getScriptVariantPage,
  getapiScriptVariantgetid,
  getapiScriptVariantgetscriptbyresponsetype,
  postapiScriptVariantcreate,
  postapiScriptVariantgetscripts,
  postapiScriptVariantupdateid,
  putapiScriptVariantdeletename,
  searchScriptVariant,
  updateScriptVariant,
} from '../../services/generated/script-variant';

import type {
  BooleanResult,
  ScriptVariantDto,
  ScriptVariantEntity,
  ScriptVariantEntityBasePaginationResponse,
  ScriptVariantEntityPaginationQuery,
  ScriptVariantEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ScriptVariant Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ScriptVariant
 */
export const scriptVariantKeys = {
  all: ['scriptVariant'] as const,
  getScriptVariantById: (id: string) => ['scriptVariant', 'getScriptVariantById', id] as const,
  generateNewScriptVariantCode: ['scriptVariant', 'generateNewScriptVariantCode'] as const,
  searchScriptVariant: ['scriptVariant', 'searchScriptVariant'] as const,
  getapiScriptVariantgetid: (id: string) => ['scriptVariant', 'getapiScriptVariantgetid', id] as const,
  getapiScriptVariantgetscriptbyresponsetype: ['scriptVariant', 'getapiScriptVariantgetscriptbyresponsetype'] as const,
};

/**
 * Get Script Variant by ID
 */
export function useGetScriptVariantById(
  id: string,
  options?: Omit<UseQueryOptions<ScriptVariantEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: scriptVariantKeys.getScriptVariantById(id),
    queryFn: () => getScriptVariantById(id),
    ...options,
  });
}

/**
 * Generate a new code for Script Variant
 */
export function useGenerateNewScriptVariantCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: scriptVariantKeys.generateNewScriptVariantCode,
    queryFn: () => generateNewScriptVariantCode(),
    ...options,
  });
}

/**
 * Search Script Variant entities
 */
export function useSearchScriptVariant(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<ScriptVariantEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: scriptVariantKeys.searchScriptVariant,
    queryFn: () => searchScriptVariant(params),
    ...options,
  });
}

/**
 */
export function useGetapiScriptVariantgetid(
  id: string,
  options?: Omit<UseQueryOptions<ScriptVariantEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: scriptVariantKeys.getapiScriptVariantgetid(id),
    queryFn: () => getapiScriptVariantgetid(id),
    ...options,
  });
}

/**
 */
export function useGetapiScriptVariantgetscriptbyresponsetype(
  params?: { type?: string; search?: string; pageSize?: number },
  options?: Omit<UseQueryOptions<ScriptVariantDto[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: scriptVariantKeys.getapiScriptVariantgetscriptbyresponsetype,
    queryFn: () => getapiScriptVariantgetscriptbyresponsetype(params),
    ...options,
  });
}

/**
 * Get paginated list of Script Variant
 */
export function useGetScriptVariantPage(
  options?: Omit<UseMutationOptions<ScriptVariantEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getScriptVariantPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Script Variant
 */
export function useCreateScriptVariant(
  options?: Omit<UseMutationOptions<ScriptVariantEntityResult, Error, { data: ScriptVariantEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: ScriptVariantEntity }) => createScriptVariant(variables.data),
    ...options,
  });
}

/**
 * Update an existing Script Variant
 */
export function useUpdateScriptVariant(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateScriptVariant(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Script Variant
 */
export function useDeleteScriptVariant(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteScriptVariant(variables.id),
    ...options,
  });
}

/**
 */
export function usePostapiScriptVariantcreate(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { data: ScriptVariantEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: ScriptVariantEntity }) => postapiScriptVariantcreate(variables.data),
    ...options,
  });
}

/**
 */
export function usePutapiScriptVariantdeletename(
  options?: Omit<UseMutationOptions<void, Error, { name: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { name: string }) => putapiScriptVariantdeletename(variables.name),
    ...options,
  });
}

/**
 */
export function usePostapiScriptVariantgetscripts(
  options?: Omit<UseMutationOptions<ScriptVariantEntityPaginationQuery, Error, { data: SortType[]; params?: { search?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { search?: string; pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapiScriptVariantgetscripts(variables.data, variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiScriptVariantupdateid(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => postapiScriptVariantupdateid(variables.id, variables.data),
    ...options,
  });
}
