import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapitranslationsbatch,
  getapitranslationsdownload,
  getapitranslationslangCode,
  postapitranslationsgetlang,
  postapitranslationsupload,
} from '../../services/generated/localization';

import type {
  LocalizeAppLangDtoBasePaginationResponse,
  SortType,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Localization Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Localization
 */
export const localizationKeys = {
  all: ['localization'] as const,
  getapitranslationslangCode: (langCode: string) => ['localization', 'getapitranslationslangCode', langCode] as const,
  getapitranslationsbatch: ['localization', 'getapitranslationsbatch'] as const,
  getapitranslationsdownload: ['localization', 'getapitranslationsdownload'] as const,
};

/**
 * Retrieves all translations for a specific language code.
GET /api/translations/{langCode}
 */
export function useGetapitranslationslangCode(
  langCode: string,
  options?: Omit<UseQueryOptions<Record<string, string>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: localizationKeys.getapitranslationslangCode(langCode),
    queryFn: () => getapitranslationslangCode(langCode),
    ...options,
  });
}

/**
 * Retrieves a batch of translations for specific keys and a given language code.
 */
export function useGetapitranslationsbatch(
  params?: { lang?: string; keys?: string[] },
  options?: Omit<UseQueryOptions<Record<string, string>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: localizationKeys.getapitranslationsbatch,
    queryFn: () => getapitranslationsbatch(params),
    ...options,
  });
}

/**
 */
export function useGetapitranslationsdownload(
  options?: Omit<UseQueryOptions<File, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: localizationKeys.getapitranslationsdownload,
    queryFn: () => getapitranslationsdownload(),
    ...options,
  });
}

/**
 */
export function usePostapitranslationsgetlang(
  options?: Omit<UseMutationOptions<LocalizeAppLangDtoBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => postapitranslationsgetlang(variables.data, variables.params),
    ...options,
  });
}

/**
 * upload excel file to update translations. the devault culture is vi-VN and it always have value while other culture can be empty
if other culture is empty, it must be auto translated by Ollama
 */
export function usePostapitranslationsupload(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapitranslationsupload,
    ...options,
  });
}
