import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createFileVersions,
  deleteFileVersions,
  generateNewFileVersionsCode,
  getFileVersionsById,
  getFileVersionsPage,
  updateFileVersions,
} from '../../services/generated/file-versions';

import type {
  BooleanResult,
  FileVersions,
  FileVersionsBasePaginationResponse,
  FileVersionsResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FileVersions Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for FileVersions
 */
export const fileVersionsKeys = {
  all: ['fileVersions'] as const,
  getFileVersionsById: (id: string) => ['fileVersions', 'getFileVersionsById', id] as const,
  generateNewFileVersionsCode: ['fileVersions', 'generateNewFileVersionsCode'] as const,
};

/**
 * Get File Versions by ID
 */
export function useGetFileVersionsById(
  id: string,
  options?: Omit<UseQueryOptions<FileVersions, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: fileVersionsKeys.getFileVersionsById(id),
    queryFn: () => getFileVersionsById(id),
    ...options,
  });
}

/**
 * Generate a new code for File Versions
 */
export function useGenerateNewFileVersionsCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: fileVersionsKeys.generateNewFileVersionsCode,
    queryFn: () => generateNewFileVersionsCode(),
    ...options,
  });
}

/**
 * Get paginated list of File Versions
 */
export function useGetFileVersionsPage(
  options?: Omit<UseMutationOptions<FileVersionsBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getFileVersionsPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new File Versions
 */
export function useCreateFileVersions(
  options?: Omit<UseMutationOptions<FileVersionsResult, Error, { data: FileVersions }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: FileVersions }) => createFileVersions(variables.data),
    ...options,
  });
}

/**
 * Update an existing File Versions
 */
export function useUpdateFileVersions(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateFileVersions(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a File Versions
 */
export function useDeleteFileVersions(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteFileVersions(variables.id),
    ...options,
  });
}
