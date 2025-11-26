import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createSystemSetting,
  deleteSystemSetting,
  updateSystemSetting,
  getSystemSettingById,
  getSystemSettingPage,
  generateNewSystemSettingCode,
} from '../../services/generated/system-setting';

import type {
  SortType,
  BooleanResult,
  SystemSettingEntity,
  StringObjectKeyValuePair,
  SystemSettingEntityResult,
  SystemSettingEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// SystemSetting Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for SystemSetting
 */
export const systemSettingKeys = {
  all: ['systemSetting'] as const,
  getSystemSettingById: (id: string) => ['systemSetting', 'getSystemSettingById', id] as const,
  generateNewSystemSettingCode: ['systemSetting', 'generateNewSystemSettingCode'] as const,
};

/**
 * Get System Setting by ID
 */
export function useGetSystemSettingById(
  id: string,
  options?: Omit<UseQueryOptions<SystemSettingEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: systemSettingKeys.getSystemSettingById(id),
    queryFn: () => getSystemSettingById(id),
    ...options,
  });
}

/**
 * Generate a new code for System Setting
 */
export function useGenerateNewSystemSettingCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: systemSettingKeys.generateNewSystemSettingCode,
    queryFn: () => generateNewSystemSettingCode(),
    ...options,
  });
}

/**
 * Get paginated list of System Setting
 */
export function useGetSystemSettingPage(
  options?: Omit<UseMutationOptions<SystemSettingEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getSystemSettingPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new System Setting
 */
export function useCreateSystemSetting(
  options?: Omit<UseMutationOptions<SystemSettingEntityResult, Error, { data: SystemSettingEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SystemSettingEntity }) => createSystemSetting(variables.data),
    ...options,
  });
}

/**
 * Update an existing System Setting
 */
export function useUpdateSystemSetting(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateSystemSetting(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a System Setting
 */
export function useDeleteSystemSetting(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteSystemSetting(variables.id),
    ...options,
  });
}
