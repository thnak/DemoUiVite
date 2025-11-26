import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  getUserPage,
  generateNewUserCode,
  postapiUsersettheme,
  getapiUsersetculture,
  getapiUsergetuserinfo,
  getapiUsergetuserimage,
  postapiUsersetdarkmode,
  postapiUseruploadavatar,
  postapiUseruploadbanner,
  getapiUsergetusersetting,
  postapiUserchangepassword,
  postapiUserupdateuserinfo,
  getapiUsergetuseravatarfile,
  getapiUsergetuserbannerfile,
  postapiUserupdateuserconfig,
  postapiUserchangelockscreenpassword,
} from '../../services/generated/user';

import type {
  SortType,
  UserEntity,
  UserInfoDto,
  BooleanResult,
  UserEntityResult,
  ChangePasswordDto,
  UpdateUserInfoDto,
  StringObjectKeyValuePair,
  ChangeLockScreenPasswordDto,
  UserEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// User Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for User
 */
export const userKeys = {
  all: ['user'] as const,
  getUserById: (id: string) => ['user', 'getUserById', id] as const,
  generateNewUserCode: ['user', 'generateNewUserCode'] as const,
  getapiUsersetculture: ['user', 'getapiUsersetculture'] as const,
  getapiUsergetusersetting: ['user', 'getapiUsergetusersetting'] as const,
  getapiUsergetuseravatarfile: (file: string) =>
    ['user', 'getapiUsergetuseravatarfile', file] as const,
  getapiUsergetuserbannerfile: (file: string) =>
    ['user', 'getapiUsergetuserbannerfile', file] as const,
  getapiUsergetuserimage: ['user', 'getapiUsergetuserimage'] as const,
  getapiUsergetuserinfo: ['user', 'getapiUsergetuserinfo'] as const,
};

/**
 * Get User by ID
 */
export function useGetUserById(
  id: string,
  options?: Omit<UseQueryOptions<UserEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.getUserById(id),
    queryFn: () => getUserById(id),
    ...options,
  });
}

/**
 * Generate a new code for User
 */
export function useGenerateNewUserCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.generateNewUserCode,
    queryFn: () => generateNewUserCode(),
    ...options,
  });
}

/**
 */
export function useGetapiUsersetculture(
  params?: { culture?: string; redirectUri?: string },
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.getapiUsersetculture,
    queryFn: () => getapiUsersetculture(params),
    ...options,
  });
}

/**
 */
export function useGetapiUsergetusersetting(
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.getapiUsergetusersetting,
    queryFn: () => getapiUsergetusersetting(),
    ...options,
  });
}

/**
 */
export function useGetapiUsergetuseravatarfile(
  file: string,
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.getapiUsergetuseravatarfile(file),
    queryFn: () => getapiUsergetuseravatarfile(file),
    ...options,
  });
}

/**
 */
export function useGetapiUsergetuserbannerfile(
  file: string,
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.getapiUsergetuserbannerfile(file),
    queryFn: () => getapiUsergetuserbannerfile(file),
    ...options,
  });
}

/**
 */
export function useGetapiUsergetuserimage(
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.getapiUsergetuserimage,
    queryFn: () => getapiUsergetuserimage(),
    ...options,
  });
}

/**
 * Gets comprehensive user information including settings
 */
export function useGetapiUsergetuserinfo(
  options?: Omit<UseQueryOptions<UserInfoDto, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.getapiUsergetuserinfo,
    queryFn: () => getapiUsergetuserinfo(),
    ...options,
  });
}

/**
 * Get paginated list of User
 */
export function useGetUserPage(
  options?: Omit<
    UseMutationOptions<
      UserEntityBasePaginationResponse,
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
    }) => getUserPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new User
 */
export function useCreateUser(
  options?: Omit<UseMutationOptions<UserEntityResult, Error, { data: UserEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: UserEntity }) => createUser(variables.data),
    ...options,
  });
}

/**
 * Update an existing User
 */
export function useUpdateUser(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateUser(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a User
 */
export function useDeleteUser(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteUser(variables.id),
    ...options,
  });
}

/**
 */
export function usePostapiUsersettheme(
  options?: Omit<UseMutationOptions<void, Error, { params?: { theme?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { theme?: string } }) =>
      postapiUsersettheme(variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiUsersetdarkmode(
  options?: Omit<UseMutationOptions<void, Error, { params?: { darkMode?: boolean } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { params?: { darkMode?: boolean } }) =>
      postapiUsersetdarkmode(variables.params),
    ...options,
  });
}

/**
 */
export function usePostapiUseruploadavatar(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiUseruploadavatar,
    ...options,
  });
}

/**
 */
export function usePostapiUseruploadbanner(
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: postapiUseruploadbanner,
    ...options,
  });
}

/**
 * Updates user personal information
 */
export function usePostapiUserupdateuserinfo(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { data: UpdateUserInfoDto }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: UpdateUserInfoDto }) =>
      postapiUserupdateuserinfo(variables.data),
    ...options,
  });
}

/**
 * Changes the user's account password
 */
export function usePostapiUserchangepassword(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { data: ChangePasswordDto }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: ChangePasswordDto }) =>
      postapiUserchangepassword(variables.data),
    ...options,
  });
}

/**
 * Changes the user's lock screen password
 */
export function usePostapiUserchangelockscreenpassword(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { data: ChangeLockScreenPasswordDto }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: ChangeLockScreenPasswordDto }) =>
      postapiUserchangelockscreenpassword(variables.data),
    ...options,
  });
}

/**
 */
export function usePostapiUserupdateuserconfig(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: StringObjectKeyValuePair[] }) =>
      postapiUserupdateuserconfig(variables.data),
    ...options,
  });
}
