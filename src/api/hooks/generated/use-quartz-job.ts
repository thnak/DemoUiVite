import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  getapiQuartzJoball,
  getapiQuartzJobsummary,
  getapiQuartzJobexecuting,
  getapiQuartzJobcollections,
  deleteapiQuartzJobcollections,
  getapiQuartzJobgroupgroupName,
  deleteapiQuartzJobcollectionscollectionName,
} from '../../services/generated/quartz-job';

import type {
  QuartzJobDto,
  QuartzCollectionDto,
  QuartzJobSummaryDto,
  QuartzCollectionCleanupResultDto,
} from '../../types/generated';

// ----------------------------------------------------------------------
// QuartzJob Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for QuartzJob
 */
export const quartzJobKeys = {
  all: ['quartzJob'] as const,
  getapiQuartzJobsummary: ['quartzJob', 'getapiQuartzJobsummary'] as const,
  getapiQuartzJoball: ['quartzJob', 'getapiQuartzJoball'] as const,
  getapiQuartzJobgroupgroupName: (groupName: string) => ['quartzJob', 'getapiQuartzJobgroupgroupName', groupName] as const,
  getapiQuartzJobexecuting: ['quartzJob', 'getapiQuartzJobexecuting'] as const,
  getapiQuartzJobcollections: ['quartzJob', 'getapiQuartzJobcollections'] as const,
};

/**
 * Get summary of all Quartz jobs
 */
export function useGetapiQuartzJobsummary(
  options?: Omit<UseQueryOptions<QuartzJobSummaryDto, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: quartzJobKeys.getapiQuartzJobsummary,
    queryFn: () => getapiQuartzJobsummary(),
    ...options,
  });
}

/**
 * Get all jobs with their details
 */
export function useGetapiQuartzJoball(
  options?: Omit<UseQueryOptions<QuartzJobDto[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: quartzJobKeys.getapiQuartzJoball,
    queryFn: () => getapiQuartzJoball(),
    ...options,
  });
}

/**
 * Get jobs by group
 */
export function useGetapiQuartzJobgroupgroupName(
  groupName: string,
  options?: Omit<UseQueryOptions<QuartzJobDto[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: quartzJobKeys.getapiQuartzJobgroupgroupName(groupName),
    queryFn: () => getapiQuartzJobgroupgroupName(groupName),
    ...options,
  });
}

/**
 * Get currently executing jobs
 */
export function useGetapiQuartzJobexecuting(
  options?: Omit<UseQueryOptions<QuartzJobDto[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: quartzJobKeys.getapiQuartzJobexecuting,
    queryFn: () => getapiQuartzJobexecuting(),
    ...options,
  });
}

/**
 * Get all Quartz_* collections from MongoDB
 */
export function useGetapiQuartzJobcollections(
  options?: Omit<UseQueryOptions<QuartzCollectionDto[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: quartzJobKeys.getapiQuartzJobcollections,
    queryFn: () => getapiQuartzJobcollections(),
    ...options,
  });
}

/**
 * Delete all Quartz_* collections from MongoDB
 */
export function useDeleteapiQuartzJobcollections(
  options?: Omit<UseMutationOptions<QuartzCollectionCleanupResultDto[], Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: deleteapiQuartzJobcollections,
    ...options,
  });
}

/**
 * Delete a specific Quartz_* collection from MongoDB
 */
export function useDeleteapiQuartzJobcollectionscollectionName(
  options?: Omit<UseMutationOptions<QuartzCollectionCleanupResultDto, Error, { collectionName: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { collectionName: string }) => deleteapiQuartzJobcollectionscollectionName(variables.collectionName),
    ...options,
  });
}
