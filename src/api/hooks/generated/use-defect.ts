import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createDefect,
  deleteDefect,
  updateDefect,
  getDefectById,
  getDefectPage,
  generateNewDefectCode,
} from '../../services/generated/defect';

import type {
  SortType,
  DefectEntity,
  BooleanResult,
  DefectEntityResult,
  StringObjectKeyValuePair,
  DefectEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Defect Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Defect
 */
export const defectKeys = {
  all: ['defect'] as const,
  getDefectById: (id: string) => ['defect', 'getDefectById', id] as const,
  generateNewDefectCode: ['defect', 'generateNewDefectCode'] as const,
};

/**
 * Get Defect by ID
 */
export function useGetDefectById(
  id: string,
  options?: Omit<UseQueryOptions<DefectEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: defectKeys.getDefectById(id),
    queryFn: () => getDefectById(id),
    ...options,
  });
}

/**
 * Generate a new code for Defect
 */
export function useGenerateNewDefectCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: defectKeys.generateNewDefectCode,
    queryFn: () => generateNewDefectCode(),
    ...options,
  });
}

/**
 * Get paginated list of Defect
 */
export function useGetDefectPage(
  options?: Omit<UseMutationOptions<DefectEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getDefectPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Defect
 */
export function useCreateDefect(
  options?: Omit<UseMutationOptions<DefectEntityResult, Error, { data: DefectEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: DefectEntity }) => createDefect(variables.data),
    ...options,
  });
}

/**
 * Update an existing Defect
 */
export function useUpdateDefect(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateDefect(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Defect
 */
export function useDeleteDefect(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteDefect(variables.id),
    ...options,
  });
}
