import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createWidgetConfig,
  deleteWidgetConfig,
  generateNewWidgetConfigCode,
  getWidgetConfigById,
  getWidgetConfigPage,
  updateWidgetConfig,
} from '../../services/generated/widget-config';

import type {
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
  WidgetConfigEntity,
  WidgetConfigEntityBasePaginationResponse,
  WidgetConfigEntityResult,
} from '../../types/generated';

// ----------------------------------------------------------------------
// WidgetConfig Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for WidgetConfig
 */
export const widgetConfigKeys = {
  all: ['widgetConfig'] as const,
  getWidgetConfigById: (id: string) => ['widgetConfig', 'getWidgetConfigById', id] as const,
  generateNewWidgetConfigCode: ['widgetConfig', 'generateNewWidgetConfigCode'] as const,
};

/**
 * Get Widget Config by ID
 */
export function useGetWidgetConfigById(
  id: string,
  options?: Omit<UseQueryOptions<WidgetConfigEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: widgetConfigKeys.getWidgetConfigById(id),
    queryFn: () => getWidgetConfigById(id),
    ...options,
  });
}

/**
 * Generate a new code for Widget Config
 */
export function useGenerateNewWidgetConfigCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: widgetConfigKeys.generateNewWidgetConfigCode,
    queryFn: () => generateNewWidgetConfigCode(),
    ...options,
  });
}

/**
 * Get paginated list of Widget Config
 */
export function useGetWidgetConfigPage(
  options?: Omit<UseMutationOptions<WidgetConfigEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getWidgetConfigPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Widget Config
 */
export function useCreateWidgetConfig(
  options?: Omit<UseMutationOptions<WidgetConfigEntityResult, Error, { data: WidgetConfigEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: WidgetConfigEntity }) => createWidgetConfig(variables.data),
    ...options,
  });
}

/**
 * Update an existing Widget Config
 */
export function useUpdateWidgetConfig(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateWidgetConfig(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Widget Config
 */
export function useDeleteWidgetConfig(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteWidgetConfig(variables.id),
    ...options,
  });
}
