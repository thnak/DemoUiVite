import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createSystemErrorReportComment,
  deleteSystemErrorReportComment,
  updateSystemErrorReportComment,
  getSystemErrorReportCommentById,
  getSystemErrorReportCommentPage,
  generateNewSystemErrorReportCommentCode,
} from '../../services/generated/system-error-report-comment';

import type {
  SortType,
  BooleanResult,
  StringObjectKeyValuePair,
  SystemErrorReportCommentEntity,
  SystemErrorReportCommentEntityResult,
  SystemErrorReportCommentEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// SystemErrorReportComment Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for SystemErrorReportComment
 */
export const systemErrorReportCommentKeys = {
  all: ['systemErrorReportComment'] as const,
  getSystemErrorReportCommentById: (id: string) =>
    ['systemErrorReportComment', 'getSystemErrorReportCommentById', id] as const,
  generateNewSystemErrorReportCommentCode: [
    'systemErrorReportComment',
    'generateNewSystemErrorReportCommentCode',
  ] as const,
};

/**
 * Get System Error Report Comment by ID
 */
export function useGetSystemErrorReportCommentById(
  id: string,
  options?: Omit<UseQueryOptions<SystemErrorReportCommentEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: systemErrorReportCommentKeys.getSystemErrorReportCommentById(id),
    queryFn: () => getSystemErrorReportCommentById(id),
    ...options,
  });
}

/**
 * Generate a new code for System Error Report Comment
 */
export function useGenerateNewSystemErrorReportCommentCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: systemErrorReportCommentKeys.generateNewSystemErrorReportCommentCode,
    queryFn: () => generateNewSystemErrorReportCommentCode(),
    ...options,
  });
}

/**
 * Get paginated list of System Error Report Comment
 */
export function useGetSystemErrorReportCommentPage(
  options?: Omit<
    UseMutationOptions<
      SystemErrorReportCommentEntityBasePaginationResponse,
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
    }) => getSystemErrorReportCommentPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new System Error Report Comment
 */
export function useCreateSystemErrorReportComment(
  options?: Omit<
    UseMutationOptions<
      SystemErrorReportCommentEntityResult,
      Error,
      { data: SystemErrorReportCommentEntity }
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: SystemErrorReportCommentEntity }) =>
      createSystemErrorReportComment(variables.data),
    ...options,
  });
}

/**
 * Update an existing System Error Report Comment
 */
export function useUpdateSystemErrorReportComment(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateSystemErrorReportComment(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a System Error Report Comment
 */
export function useDeleteSystemErrorReportComment(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteSystemErrorReportComment(variables.id),
    ...options,
  });
}
