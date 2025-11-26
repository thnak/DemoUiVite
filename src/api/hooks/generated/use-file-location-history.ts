import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createFileLocationHistory,
  deleteFileLocationHistory,
  updateFileLocationHistory,
  getFileLocationHistoryById,
  getFileLocationHistoryPage,
  generateNewFileLocationHistoryCode,
} from '../../services/generated/file-location-history';

import type {
  SortType,
  BooleanResult,
  StringObjectKeyValuePair,
  FileLocationHistoryEntity,
  FileLocationHistoryEntityResult,
  FileLocationHistoryEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FileLocationHistory Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for FileLocationHistory
 */
export const fileLocationHistoryKeys = {
  all: ['fileLocationHistory'] as const,
  getFileLocationHistoryById: (id: string) => ['fileLocationHistory', 'getFileLocationHistoryById', id] as const,
  generateNewFileLocationHistoryCode: ['fileLocationHistory', 'generateNewFileLocationHistoryCode'] as const,
};

/**
 * Get File Location History by ID
 */
export function useGetFileLocationHistoryById(
  id: string,
  options?: Omit<UseQueryOptions<FileLocationHistoryEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: fileLocationHistoryKeys.getFileLocationHistoryById(id),
    queryFn: () => getFileLocationHistoryById(id),
    ...options,
  });
}

/**
 * Generate a new code for File Location History
 */
export function useGenerateNewFileLocationHistoryCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: fileLocationHistoryKeys.generateNewFileLocationHistoryCode,
    queryFn: () => generateNewFileLocationHistoryCode(),
    ...options,
  });
}

/**
 * Get paginated list of File Location History
 */
export function useGetFileLocationHistoryPage(
  options?: Omit<UseMutationOptions<FileLocationHistoryEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getFileLocationHistoryPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new File Location History
 */
export function useCreateFileLocationHistory(
  options?: Omit<UseMutationOptions<FileLocationHistoryEntityResult, Error, { data: FileLocationHistoryEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: FileLocationHistoryEntity }) => createFileLocationHistory(variables.data),
    ...options,
  });
}

/**
 * Update an existing File Location History
 */
export function useUpdateFileLocationHistory(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateFileLocationHistory(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a File Location History
 */
export function useDeleteFileLocationHistory(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteFileLocationHistory(variables.id),
    ...options,
  });
}
