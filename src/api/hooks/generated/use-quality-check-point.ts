import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createQualityCheckPoint,
  deleteQualityCheckPoint,
  generateNewQualityCheckPointCode,
  getQualityCheckPointById,
  getQualityCheckPointPage,
  updateQualityCheckPoint,
} from '../../services/generated/quality-check-point';

import type {
  BooleanResult,
  QualityCheckPointEntity,
  QualityCheckPointEntityBasePaginationResponse,
  QualityCheckPointEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// QualityCheckPoint Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for QualityCheckPoint
 */
export const qualityCheckPointKeys = {
  all: ['qualityCheckPoint'] as const,
  getQualityCheckPointById: (id: string) => ['qualityCheckPoint', 'getQualityCheckPointById', id] as const,
  generateNewQualityCheckPointCode: ['qualityCheckPoint', 'generateNewQualityCheckPointCode'] as const,
};

/**
 * Get Quality Check Point by ID
 */
export function useGetQualityCheckPointById(
  id: string,
  options?: Omit<UseQueryOptions<QualityCheckPointEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: qualityCheckPointKeys.getQualityCheckPointById(id),
    queryFn: () => getQualityCheckPointById(id),
    ...options,
  });
}

/**
 * Generate a new code for Quality Check Point
 */
export function useGenerateNewQualityCheckPointCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: qualityCheckPointKeys.generateNewQualityCheckPointCode,
    queryFn: () => generateNewQualityCheckPointCode(),
    ...options,
  });
}

/**
 * Get paginated list of Quality Check Point
 */
export function useGetQualityCheckPointPage(
  options?: Omit<UseMutationOptions<QualityCheckPointEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getQualityCheckPointPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Quality Check Point
 */
export function useCreateQualityCheckPoint(
  options?: Omit<UseMutationOptions<QualityCheckPointEntityResult, Error, { data: QualityCheckPointEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: QualityCheckPointEntity }) => createQualityCheckPoint(variables.data),
    ...options,
  });
}

/**
 * Update an existing Quality Check Point
 */
export function useUpdateQualityCheckPoint(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateQualityCheckPoint(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Quality Check Point
 */
export function useDeleteQualityCheckPoint(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteQualityCheckPoint(variables.id),
    ...options,
  });
}
