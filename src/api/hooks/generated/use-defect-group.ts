import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createDefectGroup,
  deleteDefectGroup,
  searchDefectGroup,
  updateDefectGroup,
  getDefectGroupById,
  getDefectGroupPage,
  generateNewDefectGroupCode,
} from '../../services/generated/defect-group';

import type {
  SortType,
  BooleanResult,
  DefectGroupEntity,
  DefectGroupEntityResult,
  StringObjectKeyValuePair,
  DefectGroupEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DefectGroup Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for DefectGroup
 */
export const defectGroupKeys = {
  all: ['defectGroup'] as const,
  getDefectGroupById: (id: string) => ['defectGroup', 'getDefectGroupById', id] as const,
  generateNewDefectGroupCode: ['defectGroup', 'generateNewDefectGroupCode'] as const,
  searchDefectGroup: ['defectGroup', 'searchDefectGroup'] as const,
};

/**
 * Get Defect Group by ID
 */
export function useGetDefectGroupById(
  id: string,
  options?: Omit<UseQueryOptions<DefectGroupEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: defectGroupKeys.getDefectGroupById(id),
    queryFn: () => getDefectGroupById(id),
    ...options,
  });
}

/**
 * Generate a new code for Defect Group
 */
export function useGenerateNewDefectGroupCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: defectGroupKeys.generateNewDefectGroupCode,
    queryFn: () => generateNewDefectGroupCode(),
    ...options,
  });
}

/**
 * Search Defect Group entities
 */
export function useSearchDefectGroup(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<DefectGroupEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: defectGroupKeys.searchDefectGroup,
    queryFn: () => searchDefectGroup(params),
    ...options,
  });
}

/**
 * Get paginated list of Defect Group
 */
export function useGetDefectGroupPage(
  options?: Omit<UseMutationOptions<DefectGroupEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getDefectGroupPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Defect Group
 */
export function useCreateDefectGroup(
  options?: Omit<UseMutationOptions<DefectGroupEntityResult, Error, { data: DefectGroupEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: DefectGroupEntity }) => createDefectGroup(variables.data),
    ...options,
  });
}

/**
 * Update an existing Defect Group
 */
export function useUpdateDefectGroup(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateDefectGroup(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Defect Group
 */
export function useDeleteDefectGroup(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteDefectGroup(variables.id),
    ...options,
  });
}
