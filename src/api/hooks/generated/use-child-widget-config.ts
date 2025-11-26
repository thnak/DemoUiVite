import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createChildWidgetConfig,
  deleteChildWidgetConfig,
  generateNewChildWidgetConfigCode,
  getChildWidgetConfigById,
  getChildWidgetConfigPage,
  updateChildWidgetConfig,
} from '../../services/generated/child-widget-config';

import type {
  BooleanResult,
  ChildWidgetConfigEntity,
  ChildWidgetConfigEntityBasePaginationResponse,
  ChildWidgetConfigEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ChildWidgetConfig Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ChildWidgetConfig
 */
export const childWidgetConfigKeys = {
  all: ['childWidgetConfig'] as const,
  getChildWidgetConfigById: (id: string) => ['childWidgetConfig', 'getChildWidgetConfigById', id] as const,
  generateNewChildWidgetConfigCode: ['childWidgetConfig', 'generateNewChildWidgetConfigCode'] as const,
};

/**
 * Get Child Widget Config by ID
 */
export function useGetChildWidgetConfigById(
  id: string,
  options?: Omit<UseQueryOptions<ChildWidgetConfigEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: childWidgetConfigKeys.getChildWidgetConfigById(id),
    queryFn: () => getChildWidgetConfigById(id),
    ...options,
  });
}

/**
 * Generate a new code for Child Widget Config
 */
export function useGenerateNewChildWidgetConfigCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: childWidgetConfigKeys.generateNewChildWidgetConfigCode,
    queryFn: () => generateNewChildWidgetConfigCode(),
    ...options,
  });
}

/**
 * Get paginated list of Child Widget Config
 */
export function useGetChildWidgetConfigPage(
  options?: Omit<UseMutationOptions<ChildWidgetConfigEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getChildWidgetConfigPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Child Widget Config
 */
export function useCreateChildWidgetConfig(
  options?: Omit<UseMutationOptions<ChildWidgetConfigEntityResult, Error, { data: ChildWidgetConfigEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: ChildWidgetConfigEntity }) => createChildWidgetConfig(variables.data),
    ...options,
  });
}

/**
 * Update an existing Child Widget Config
 */
export function useUpdateChildWidgetConfig(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateChildWidgetConfig(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Child Widget Config
 */
export function useDeleteChildWidgetConfig(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteChildWidgetConfig(variables.id),
    ...options,
  });
}
