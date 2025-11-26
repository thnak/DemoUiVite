import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createSystemErrorReport,
  deleteSystemErrorReport,
  updateSystemErrorReport,
  getSystemErrorReportById,
  getSystemErrorReportPage,
  generateNewSystemErrorReportCode,
} from '../../services/generated/system-error-report';

import type {
  SortType,
  BooleanResult,
  SystemErrorReportEntity,
  StringObjectKeyValuePair,
  SystemErrorReportEntityResult,
  SystemErrorReportEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// SystemErrorReport Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for SystemErrorReport
 */
export const systemErrorReportKeys = {
  all: ['systemErrorReport'] as const,
  getSystemErrorReportById: (id: string) =>
    ['systemErrorReport', 'getSystemErrorReportById', id] as const,
  generateNewSystemErrorReportCode: [
    'systemErrorReport',
    'generateNewSystemErrorReportCode',
  ] as const,
};

/**
 * Get System Error Report by ID
 */
export function useGetSystemErrorReportById(
  id: string,
  options?: Omit<UseQueryOptions<SystemErrorReportEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: systemErrorReportKeys.getSystemErrorReportById(id),
    queryFn: () => getSystemErrorReportById(id),
    ...options,
  });
}

/**
 * Generate a new code for System Error Report
 */
export function useGenerateNewSystemErrorReportCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: systemErrorReportKeys.generateNewSystemErrorReportCode,
    queryFn: () => generateNewSystemErrorReportCode(),
    ...options,
  });
}

/**
 * Get paginated list of System Error Report
 */
export function useGetSystemErrorReportPage(
  options?: Omit<
    UseMutationOptions<
      SystemErrorReportEntityBasePaginationResponse,
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
    }) => getSystemErrorReportPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new System Error Report
 */
export function useCreateSystemErrorReport(
  options?: Omit<
    UseMutationOptions<SystemErrorReportEntityResult, Error, { data: SystemErrorReportEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: SystemErrorReportEntity }) =>
      createSystemErrorReport(variables.data),
    ...options,
  });
}

/**
 * Update an existing System Error Report
 */
export function useUpdateSystemErrorReport(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateSystemErrorReport(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a System Error Report
 */
export function useDeleteSystemErrorReport(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteSystemErrorReport(variables.id),
    ...options,
  });
}
