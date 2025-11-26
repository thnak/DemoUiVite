import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createUserSetting,
  deleteUserSetting,
  updateUserSetting,
  getUserSettingById,
  getUserSettingPage,
  generateNewUserSettingCode,
} from '../../services/generated/user-setting';

import type {
  SortType,
  BooleanResult,
  UserSettingEntity,
  UserSettingEntityResult,
  StringObjectKeyValuePair,
  UserSettingEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// UserSetting Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for UserSetting
 */
export const userSettingKeys = {
  all: ['userSetting'] as const,
  getUserSettingById: (id: string) => ['userSetting', 'getUserSettingById', id] as const,
  generateNewUserSettingCode: ['userSetting', 'generateNewUserSettingCode'] as const,
};

/**
 * Get User Setting by ID
 */
export function useGetUserSettingById(
  id: string,
  options?: Omit<UseQueryOptions<UserSettingEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userSettingKeys.getUserSettingById(id),
    queryFn: () => getUserSettingById(id),
    ...options,
  });
}

/**
 * Generate a new code for User Setting
 */
export function useGenerateNewUserSettingCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userSettingKeys.generateNewUserSettingCode,
    queryFn: () => generateNewUserSettingCode(),
    ...options,
  });
}

/**
 * Get paginated list of User Setting
 */
export function useGetUserSettingPage(
  options?: Omit<
    UseMutationOptions<
      UserSettingEntityBasePaginationResponse,
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
    }) => getUserSettingPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new User Setting
 */
export function useCreateUserSetting(
  options?: Omit<
    UseMutationOptions<UserSettingEntityResult, Error, { data: UserSettingEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: UserSettingEntity }) => createUserSetting(variables.data),
    ...options,
  });
}

/**
 * Update an existing User Setting
 */
export function useUpdateUserSetting(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateUserSetting(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a User Setting
 */
export function useDeleteUserSetting(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteUserSetting(variables.id),
    ...options,
  });
}
