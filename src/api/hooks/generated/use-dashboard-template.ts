import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createDashboardTemplate,
  deleteDashboardTemplate,
  updateDashboardTemplate,
  getDashboardTemplateById,
  getDashboardTemplatePage,
  generateNewDashboardTemplateCode,
} from '../../services/generated/dashboard-template';

import type {
  SortType,
  BooleanResult,
  DashboardTemplateEntity,
  StringObjectKeyValuePair,
  DashboardTemplateEntityResult,
  DashboardTemplateEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// DashboardTemplate Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for DashboardTemplate
 */
export const dashboardTemplateKeys = {
  all: ['dashboardTemplate'] as const,
  getDashboardTemplateById: (id: string) => ['dashboardTemplate', 'getDashboardTemplateById', id] as const,
  generateNewDashboardTemplateCode: ['dashboardTemplate', 'generateNewDashboardTemplateCode'] as const,
};

/**
 * Get Dashboard Template by ID
 */
export function useGetDashboardTemplateById(
  id: string,
  options?: Omit<UseQueryOptions<DashboardTemplateEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardTemplateKeys.getDashboardTemplateById(id),
    queryFn: () => getDashboardTemplateById(id),
    ...options,
  });
}

/**
 * Generate a new code for Dashboard Template
 */
export function useGenerateNewDashboardTemplateCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardTemplateKeys.generateNewDashboardTemplateCode,
    queryFn: () => generateNewDashboardTemplateCode(),
    ...options,
  });
}

/**
 * Get paginated list of Dashboard Template
 */
export function useGetDashboardTemplatePage(
  options?: Omit<UseMutationOptions<DashboardTemplateEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getDashboardTemplatePage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Dashboard Template
 */
export function useCreateDashboardTemplate(
  options?: Omit<UseMutationOptions<DashboardTemplateEntityResult, Error, { data: DashboardTemplateEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: DashboardTemplateEntity }) => createDashboardTemplate(variables.data),
    ...options,
  });
}

/**
 * Update an existing Dashboard Template
 */
export function useUpdateDashboardTemplate(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateDashboardTemplate(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Dashboard Template
 */
export function useDeleteDashboardTemplate(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteDashboardTemplate(variables.id),
    ...options,
  });
}
