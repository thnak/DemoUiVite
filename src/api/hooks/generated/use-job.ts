import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createJob,
  deleteJob,
  updateJob,
  getJobById,
  getJobPage,
  generateNewJobCode,
} from '../../services/generated/job';

import type {
  SortType,
  JobEntity,
  BooleanResult,
  JobEntityResult,
  StringObjectKeyValuePair,
  JobEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Job Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Job
 */
export const jobKeys = {
  all: ['job'] as const,
  getJobById: (id: string) => ['job', 'getJobById', id] as const,
  generateNewJobCode: ['job', 'generateNewJobCode'] as const,
};

/**
 * Get Job by ID
 */
export function useGetJobById(
  id: string,
  options?: Omit<UseQueryOptions<JobEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: jobKeys.getJobById(id),
    queryFn: () => getJobById(id),
    ...options,
  });
}

/**
 * Generate a new code for Job
 */
export function useGenerateNewJobCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: jobKeys.generateNewJobCode,
    queryFn: () => generateNewJobCode(),
    ...options,
  });
}

/**
 * Get paginated list of Job
 */
export function useGetJobPage(
  options?: Omit<
    UseMutationOptions<
      JobEntityBasePaginationResponse,
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
    }) => getJobPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Job
 */
export function useCreateJob(
  options?: Omit<UseMutationOptions<JobEntityResult, Error, { data: JobEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: JobEntity }) => createJob(variables.data),
    ...options,
  });
}

/**
 * Update an existing Job
 */
export function useUpdateJob(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateJob(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Job
 */
export function useDeleteJob(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteJob(variables.id),
    ...options,
  });
}
