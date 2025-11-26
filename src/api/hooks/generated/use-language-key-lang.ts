import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createLanguageKeyLang,
  deleteLanguageKeyLang,
  generateNewLanguageKeyLangCode,
  getLanguageKeyLangById,
  getLanguageKeyLangPage,
  updateLanguageKeyLang,
} from '../../services/generated/language-key-lang';

import type {
  BooleanResult,
  LanguageKeyLangEntity,
  LanguageKeyLangEntityBasePaginationResponse,
  LanguageKeyLangEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// LanguageKeyLang Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for LanguageKeyLang
 */
export const languageKeyLangKeys = {
  all: ['languageKeyLang'] as const,
  getLanguageKeyLangById: (id: string) => ['languageKeyLang', 'getLanguageKeyLangById', id] as const,
  generateNewLanguageKeyLangCode: ['languageKeyLang', 'generateNewLanguageKeyLangCode'] as const,
};

/**
 * Get Language Key Lang by ID
 */
export function useGetLanguageKeyLangById(
  id: string,
  options?: Omit<UseQueryOptions<LanguageKeyLangEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: languageKeyLangKeys.getLanguageKeyLangById(id),
    queryFn: () => getLanguageKeyLangById(id),
    ...options,
  });
}

/**
 * Generate a new code for Language Key Lang
 */
export function useGenerateNewLanguageKeyLangCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: languageKeyLangKeys.generateNewLanguageKeyLangCode,
    queryFn: () => generateNewLanguageKeyLangCode(),
    ...options,
  });
}

/**
 * Get paginated list of Language Key Lang
 */
export function useGetLanguageKeyLangPage(
  options?: Omit<UseMutationOptions<LanguageKeyLangEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getLanguageKeyLangPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Language Key Lang
 */
export function useCreateLanguageKeyLang(
  options?: Omit<UseMutationOptions<LanguageKeyLangEntityResult, Error, { data: LanguageKeyLangEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: LanguageKeyLangEntity }) => createLanguageKeyLang(variables.data),
    ...options,
  });
}

/**
 * Update an existing Language Key Lang
 */
export function useUpdateLanguageKeyLang(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateLanguageKeyLang(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Language Key Lang
 */
export function useDeleteLanguageKeyLang(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteLanguageKeyLang(variables.id),
    ...options,
  });
}
