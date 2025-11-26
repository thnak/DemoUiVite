import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createFolderPermission,
  deleteFolderPermission,
  updateFolderPermission,
  getFolderPermissionById,
  getFolderPermissionPage,
  generateNewFolderPermissionCode,
} from '../../services/generated/folder-permission';

import type {
  SortType,
  BooleanResult,
  FolderPermissionEntity,
  StringObjectKeyValuePair,
  FolderPermissionEntityResult,
  FolderPermissionEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FolderPermission Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for FolderPermission
 */
export const folderPermissionKeys = {
  all: ['folderPermission'] as const,
  getFolderPermissionById: (id: string) =>
    ['folderPermission', 'getFolderPermissionById', id] as const,
  generateNewFolderPermissionCode: ['folderPermission', 'generateNewFolderPermissionCode'] as const,
};

/**
 * Get Folder Permission by ID
 */
export function useGetFolderPermissionById(
  id: string,
  options?: Omit<UseQueryOptions<FolderPermissionEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: folderPermissionKeys.getFolderPermissionById(id),
    queryFn: () => getFolderPermissionById(id),
    ...options,
  });
}

/**
 * Generate a new code for Folder Permission
 */
export function useGenerateNewFolderPermissionCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: folderPermissionKeys.generateNewFolderPermissionCode,
    queryFn: () => generateNewFolderPermissionCode(),
    ...options,
  });
}

/**
 * Get paginated list of Folder Permission
 */
export function useGetFolderPermissionPage(
  options?: Omit<
    UseMutationOptions<
      FolderPermissionEntityBasePaginationResponse,
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
    }) => getFolderPermissionPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Folder Permission
 */
export function useCreateFolderPermission(
  options?: Omit<
    UseMutationOptions<FolderPermissionEntityResult, Error, { data: FolderPermissionEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: FolderPermissionEntity }) =>
      createFolderPermission(variables.data),
    ...options,
  });
}

/**
 * Update an existing Folder Permission
 */
export function useUpdateFolderPermission(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateFolderPermission(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Folder Permission
 */
export function useDeleteFolderPermission(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteFolderPermission(variables.id),
    ...options,
  });
}
