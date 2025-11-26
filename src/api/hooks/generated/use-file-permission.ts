import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createFilePermission,
  deleteFilePermission,
  updateFilePermission,
  getFilePermissionById,
  getFilePermissionPage,
  generateNewFilePermissionCode,
} from '../../services/generated/file-permission';

import type {
  SortType,
  BooleanResult,
  FilePermissionEntity,
  StringObjectKeyValuePair,
  FilePermissionEntityResult,
  FilePermissionEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FilePermission Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for FilePermission
 */
export const filePermissionKeys = {
  all: ['filePermission'] as const,
  getFilePermissionById: (id: string) => ['filePermission', 'getFilePermissionById', id] as const,
  generateNewFilePermissionCode: ['filePermission', 'generateNewFilePermissionCode'] as const,
};

/**
 * Get File Permission by ID
 */
export function useGetFilePermissionById(
  id: string,
  options?: Omit<UseQueryOptions<FilePermissionEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: filePermissionKeys.getFilePermissionById(id),
    queryFn: () => getFilePermissionById(id),
    ...options,
  });
}

/**
 * Generate a new code for File Permission
 */
export function useGenerateNewFilePermissionCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: filePermissionKeys.generateNewFilePermissionCode,
    queryFn: () => generateNewFilePermissionCode(),
    ...options,
  });
}

/**
 * Get paginated list of File Permission
 */
export function useGetFilePermissionPage(
  options?: Omit<
    UseMutationOptions<
      FilePermissionEntityBasePaginationResponse,
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
    }) => getFilePermissionPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new File Permission
 */
export function useCreateFilePermission(
  options?: Omit<
    UseMutationOptions<FilePermissionEntityResult, Error, { data: FilePermissionEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: FilePermissionEntity }) => createFilePermission(variables.data),
    ...options,
  });
}

/**
 * Update an existing File Permission
 */
export function useUpdateFilePermission(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateFilePermission(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a File Permission
 */
export function useDeleteFilePermission(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteFilePermission(variables.id),
    ...options,
  });
}
