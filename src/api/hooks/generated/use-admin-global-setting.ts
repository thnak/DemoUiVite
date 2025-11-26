import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createAdminGlobalSetting,
  deleteAdminGlobalSetting,
  updateAdminGlobalSetting,
  getAdminGlobalSettingById,
  getAdminGlobalSettingPage,
  generateNewAdminGlobalSettingCode,
} from '../../services/generated/admin-global-setting';

import type {
  SortType,
  BooleanResult,
  AdminGlobalSettingEntity,
  StringObjectKeyValuePair,
  AdminGlobalSettingEntityResult,
  AdminGlobalSettingEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// AdminGlobalSetting Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for AdminGlobalSetting
 */
export const adminGlobalSettingKeys = {
  all: ['adminGlobalSetting'] as const,
  getAdminGlobalSettingById: (id: string) => ['adminGlobalSetting', 'getAdminGlobalSettingById', id] as const,
  generateNewAdminGlobalSettingCode: ['adminGlobalSetting', 'generateNewAdminGlobalSettingCode'] as const,
};

/**
 * Get Admin Global Setting by ID
 */
export function useGetAdminGlobalSettingById(
  id: string,
  options?: Omit<UseQueryOptions<AdminGlobalSettingEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: adminGlobalSettingKeys.getAdminGlobalSettingById(id),
    queryFn: () => getAdminGlobalSettingById(id),
    ...options,
  });
}

/**
 * Generate a new code for Admin Global Setting
 */
export function useGenerateNewAdminGlobalSettingCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: adminGlobalSettingKeys.generateNewAdminGlobalSettingCode,
    queryFn: () => generateNewAdminGlobalSettingCode(),
    ...options,
  });
}

/**
 * Get paginated list of Admin Global Setting
 */
export function useGetAdminGlobalSettingPage(
  options?: Omit<UseMutationOptions<AdminGlobalSettingEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getAdminGlobalSettingPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Admin Global Setting
 */
export function useCreateAdminGlobalSetting(
  options?: Omit<UseMutationOptions<AdminGlobalSettingEntityResult, Error, { data: AdminGlobalSettingEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: AdminGlobalSettingEntity }) => createAdminGlobalSetting(variables.data),
    ...options,
  });
}

/**
 * Update an existing Admin Global Setting
 */
export function useUpdateAdminGlobalSetting(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateAdminGlobalSetting(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Admin Global Setting
 */
export function useDeleteAdminGlobalSetting(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteAdminGlobalSetting(variables.id),
    ...options,
  });
}
