import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createWorkDateCalendarStatistic,
  deleteWorkDateCalendarStatistic,
  updateWorkDateCalendarStatistic,
  getWorkDateCalendarStatisticById,
  getWorkDateCalendarStatisticPage,
  generateNewWorkDateCalendarStatisticCode,
} from '../../services/generated/work-date-calendar-statistic';

import type {
  SortType,
  BooleanResult,
  StringObjectKeyValuePair,
  WorkDateCalendarStatisticEntity,
  WorkDateCalendarStatisticEntityResult,
  WorkDateCalendarStatisticEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// WorkDateCalendarStatistic Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for WorkDateCalendarStatistic
 */
export const workDateCalendarStatisticKeys = {
  all: ['workDateCalendarStatistic'] as const,
  getWorkDateCalendarStatisticById: (id: string) =>
    ['workDateCalendarStatistic', 'getWorkDateCalendarStatisticById', id] as const,
  generateNewWorkDateCalendarStatisticCode: [
    'workDateCalendarStatistic',
    'generateNewWorkDateCalendarStatisticCode',
  ] as const,
};

/**
 * Get Work Date Calendar Statistic by ID
 */
export function useGetWorkDateCalendarStatisticById(
  id: string,
  options?: Omit<UseQueryOptions<WorkDateCalendarStatisticEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workDateCalendarStatisticKeys.getWorkDateCalendarStatisticById(id),
    queryFn: () => getWorkDateCalendarStatisticById(id),
    ...options,
  });
}

/**
 * Generate a new code for Work Date Calendar Statistic
 */
export function useGenerateNewWorkDateCalendarStatisticCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: workDateCalendarStatisticKeys.generateNewWorkDateCalendarStatisticCode,
    queryFn: () => generateNewWorkDateCalendarStatisticCode(),
    ...options,
  });
}

/**
 * Get paginated list of Work Date Calendar Statistic
 */
export function useGetWorkDateCalendarStatisticPage(
  options?: Omit<
    UseMutationOptions<
      WorkDateCalendarStatisticEntityBasePaginationResponse,
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
    }) => getWorkDateCalendarStatisticPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Work Date Calendar Statistic
 */
export function useCreateWorkDateCalendarStatistic(
  options?: Omit<
    UseMutationOptions<
      WorkDateCalendarStatisticEntityResult,
      Error,
      { data: WorkDateCalendarStatisticEntity }
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: WorkDateCalendarStatisticEntity }) =>
      createWorkDateCalendarStatistic(variables.data),
    ...options,
  });
}

/**
 * Update an existing Work Date Calendar Statistic
 */
export function useUpdateWorkDateCalendarStatistic(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateWorkDateCalendarStatistic(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Work Date Calendar Statistic
 */
export function useDeleteWorkDateCalendarStatistic(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteWorkDateCalendarStatistic(variables.id),
    ...options,
  });
}
