import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createShiftTemplate,
  deleteShiftTemplate,
  searchShiftTemplate,
  updateShiftTemplate,
  getShiftTemplateById,
  getShiftTemplatePage,
  generateNewShiftTemplateCode,
} from '../../services/generated/shift-template';

import type {
  SortType,
  BooleanResult,
  ShiftTemplateEntity,
  StringObjectKeyValuePair,
  ShiftTemplateEntityResult,
  ShiftTemplateEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ShiftTemplate Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ShiftTemplate
 */
export const shiftTemplateKeys = {
  all: ['shiftTemplate'] as const,
  getShiftTemplateById: (id: string) => ['shiftTemplate', 'getShiftTemplateById', id] as const,
  generateNewShiftTemplateCode: ['shiftTemplate', 'generateNewShiftTemplateCode'] as const,
  searchShiftTemplate: ['shiftTemplate', 'searchShiftTemplate'] as const,
};

/**
 * Get Shift Template by ID
 */
export function useGetShiftTemplateById(
  id: string,
  options?: Omit<UseQueryOptions<ShiftTemplateEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: shiftTemplateKeys.getShiftTemplateById(id),
    queryFn: () => getShiftTemplateById(id),
    ...options,
  });
}

/**
 * Generate a new code for Shift Template
 */
export function useGenerateNewShiftTemplateCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: shiftTemplateKeys.generateNewShiftTemplateCode,
    queryFn: () => generateNewShiftTemplateCode(),
    ...options,
  });
}

/**
 * Search Shift Template entities
 */
export function useSearchShiftTemplate(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<ShiftTemplateEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: shiftTemplateKeys.searchShiftTemplate,
    queryFn: () => searchShiftTemplate(params),
    ...options,
  });
}

/**
 * Get paginated list of Shift Template
 */
export function useGetShiftTemplatePage(
  options?: Omit<
    UseMutationOptions<
      ShiftTemplateEntityBasePaginationResponse,
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
    }) => getShiftTemplatePage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Shift Template
 */
export function useCreateShiftTemplate(
  options?: Omit<
    UseMutationOptions<ShiftTemplateEntityResult, Error, { data: ShiftTemplateEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: ShiftTemplateEntity }) => createShiftTemplate(variables.data),
    ...options,
  });
}

/**
 * Update an existing Shift Template
 */
export function useUpdateShiftTemplate(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateShiftTemplate(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Shift Template
 */
export function useDeleteShiftTemplate(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteShiftTemplate(variables.id),
    ...options,
  });
}
