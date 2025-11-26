import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createWorkCell,
  deleteWorkCell,
  generateNewWorkCellCode,
  getWorkCellById,
  getWorkCellPage,
  updateWorkCell,
} from '../../services/generated/work-cell';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  WorkCellEntity,
  WorkCellEntityBasePaginationResponse,
  WorkCellEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// WorkCell Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for WorkCell
 */
export const workCellKeys = {
  all: ['workCell'] as const,
  getWorkCellById: (id: string) => ['workCell', 'getWorkCellById', id] as const,
  generateNewWorkCellCode: ['workCell', 'generateNewWorkCellCode'] as const,
};

/**
 * Get Work Cell by ID
 */
export function useGetWorkCellById(
  id: string,
  options?: Omit<UseQueryOptions<WorkCellEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workCellKeys.getWorkCellById(id),
    queryFn: () => getWorkCellById(id),
    ...options,
  });
}

/**
 * Generate a new code for Work Cell
 */
export function useGenerateNewWorkCellCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workCellKeys.generateNewWorkCellCode,
    queryFn: () => generateNewWorkCellCode(),
    ...options,
  });
}

/**
 * Get paginated list of Work Cell
 */
export function useGetWorkCellPage(
  options?: Omit<UseMutationOptions<WorkCellEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getWorkCellPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Work Cell
 */
export function useCreateWorkCell(
  options?: Omit<UseMutationOptions<WorkCellEntityResult, Error, { data: WorkCellEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: WorkCellEntity }) => createWorkCell(variables.data),
    ...options,
  });
}

/**
 * Update an existing Work Cell
 */
export function useUpdateWorkCell(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateWorkCell(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Work Cell
 */
export function useDeleteWorkCell(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteWorkCell(variables.id),
    ...options,
  });
}
