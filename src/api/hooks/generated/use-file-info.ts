import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createFileInfo,
  deleteFileInfo,
  updateFileInfo,
  getFileInfoById,
  getFileInfoPage,
  generateNewFileInfoCode,
} from '../../services/generated/file-info';

import type {
  SortType,
  BooleanResult,
  FileInfoEntity,
  FileInfoEntityResult,
  StringObjectKeyValuePair,
  FileInfoEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FileInfo Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for FileInfo
 */
export const fileInfoKeys = {
  all: ['fileInfo'] as const,
  getFileInfoById: (id: string) => ['fileInfo', 'getFileInfoById', id] as const,
  generateNewFileInfoCode: ['fileInfo', 'generateNewFileInfoCode'] as const,
};

/**
 * Get File Info by ID
 */
export function useGetFileInfoById(
  id: string,
  options?: Omit<UseQueryOptions<FileInfoEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: fileInfoKeys.getFileInfoById(id),
    queryFn: () => getFileInfoById(id),
    ...options,
  });
}

/**
 * Generate a new code for File Info
 */
export function useGenerateNewFileInfoCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: fileInfoKeys.generateNewFileInfoCode,
    queryFn: () => generateNewFileInfoCode(),
    ...options,
  });
}

/**
 * Get paginated list of File Info
 */
export function useGetFileInfoPage(
  options?: Omit<UseMutationOptions<FileInfoEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getFileInfoPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new File Info
 */
export function useCreateFileInfo(
  options?: Omit<UseMutationOptions<FileInfoEntityResult, Error, { data: FileInfoEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: FileInfoEntity }) => createFileInfo(variables.data),
    ...options,
  });
}

/**
 * Update an existing File Info
 */
export function useUpdateFileInfo(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateFileInfo(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a File Info
 */
export function useDeleteFileInfo(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteFileInfo(variables.id),
    ...options,
  });
}
