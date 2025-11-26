import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createFolderLocationHistory,
  deleteFolderLocationHistory,
  updateFolderLocationHistory,
  getFolderLocationHistoryById,
  getFolderLocationHistoryPage,
  generateNewFolderLocationHistoryCode,
} from '../../services/generated/folder-location-history';

import type {
  SortType,
  BooleanResult,
  StringObjectKeyValuePair,
  FolderLocationHistoryEntity,
  FolderLocationHistoryEntityResult,
  FolderLocationHistoryEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FolderLocationHistory Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for FolderLocationHistory
 */
export const folderLocationHistoryKeys = {
  all: ['folderLocationHistory'] as const,
  getFolderLocationHistoryById: (id: string) =>
    ['folderLocationHistory', 'getFolderLocationHistoryById', id] as const,
  generateNewFolderLocationHistoryCode: [
    'folderLocationHistory',
    'generateNewFolderLocationHistoryCode',
  ] as const,
};

/**
 * Get Folder Location History by ID
 */
export function useGetFolderLocationHistoryById(
  id: string,
  options?: Omit<UseQueryOptions<FolderLocationHistoryEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: folderLocationHistoryKeys.getFolderLocationHistoryById(id),
    queryFn: () => getFolderLocationHistoryById(id),
    ...options,
  });
}

/**
 * Generate a new code for Folder Location History
 */
export function useGenerateNewFolderLocationHistoryCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: folderLocationHistoryKeys.generateNewFolderLocationHistoryCode,
    queryFn: () => generateNewFolderLocationHistoryCode(),
    ...options,
  });
}

/**
 * Get paginated list of Folder Location History
 */
export function useGetFolderLocationHistoryPage(
  options?: Omit<
    UseMutationOptions<
      FolderLocationHistoryEntityBasePaginationResponse,
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
    }) => getFolderLocationHistoryPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Folder Location History
 */
export function useCreateFolderLocationHistory(
  options?: Omit<
    UseMutationOptions<
      FolderLocationHistoryEntityResult,
      Error,
      { data: FolderLocationHistoryEntity }
    >,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: FolderLocationHistoryEntity }) =>
      createFolderLocationHistory(variables.data),
    ...options,
  });
}

/**
 * Update an existing Folder Location History
 */
export function useUpdateFolderLocationHistory(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateFolderLocationHistory(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Folder Location History
 */
export function useDeleteFolderLocationHistory(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteFolderLocationHistory(variables.id),
    ...options,
  });
}
