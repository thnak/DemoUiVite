import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createAdaptiveRuleConfig,
  deleteAdaptiveRuleConfig,
  updateAdaptiveRuleConfig,
  getAdaptiveRuleConfigById,
  getAdaptiveRuleConfigPage,
  generateNewAdaptiveRuleConfigCode,
} from '../../services/generated/adaptive-rule-config';

import type {
  SortType,
  BooleanResult,
  AdaptiveRuleConfigEntity,
  StringObjectKeyValuePair,
  AdaptiveRuleConfigEntityResult,
  AdaptiveRuleConfigEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// AdaptiveRuleConfig Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for AdaptiveRuleConfig
 */
export const adaptiveRuleConfigKeys = {
  all: ['adaptiveRuleConfig'] as const,
  getAdaptiveRuleConfigById: (id: string) =>
    ['adaptiveRuleConfig', 'getAdaptiveRuleConfigById', id] as const,
  generateNewAdaptiveRuleConfigCode: [
    'adaptiveRuleConfig',
    'generateNewAdaptiveRuleConfigCode',
  ] as const,
};

/**
 * Get Adaptive Rule Config by ID
 */
export function useGetAdaptiveRuleConfigById(
  id: string,
  options?: Omit<UseQueryOptions<AdaptiveRuleConfigEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: adaptiveRuleConfigKeys.getAdaptiveRuleConfigById(id),
    queryFn: () => getAdaptiveRuleConfigById(id),
    ...options,
  });
}

/**
 * Generate a new code for Adaptive Rule Config
 */
export function useGenerateNewAdaptiveRuleConfigCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: adaptiveRuleConfigKeys.generateNewAdaptiveRuleConfigCode,
    queryFn: () => generateNewAdaptiveRuleConfigCode(),
    ...options,
  });
}

/**
 * Get paginated list of Adaptive Rule Config
 */
export function useGetAdaptiveRuleConfigPage(
  options?: Omit<
    UseMutationOptions<
      AdaptiveRuleConfigEntityBasePaginationResponse,
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
    }) => getAdaptiveRuleConfigPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Adaptive Rule Config
 */
export function useCreateAdaptiveRuleConfig(
  options?: Omit<
    UseMutationOptions<AdaptiveRuleConfigEntityResult, Error, { data: AdaptiveRuleConfigEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: AdaptiveRuleConfigEntity }) =>
      createAdaptiveRuleConfig(variables.data),
    ...options,
  });
}

/**
 * Update an existing Adaptive Rule Config
 */
export function useUpdateAdaptiveRuleConfig(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateAdaptiveRuleConfig(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Adaptive Rule Config
 */
export function useDeleteAdaptiveRuleConfig(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteAdaptiveRuleConfig(variables.id),
    ...options,
  });
}
