import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createFolderInfo,
  deleteFolderInfo,
  generateNewFolderInfoCode,
  getFolderInfoById,
  getFolderInfoPage,
  updateFolderInfo,
} from '../../services/generated/folder-info';

import type {
  BooleanResult,
  FolderInfoEntity,
  FolderInfoEntityBasePaginationResponse,
  FolderInfoEntityResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FolderInfo Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for FolderInfo
 */
export const folderInfoKeys = {
  all: ['folderInfo'] as const,
  getFolderInfoById: (id: string) => ['folderInfo', 'getFolderInfoById', id] as const,
  generateNewFolderInfoCode: ['folderInfo', 'generateNewFolderInfoCode'] as const,
};

/**
 * Get Folder Info by ID
 */
export function useGetFolderInfoById(
  id: string,
  options?: Omit<UseQueryOptions<FolderInfoEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: folderInfoKeys.getFolderInfoById(id),
    queryFn: () => getFolderInfoById(id),
    ...options,
  });
}

/**
 * Generate a new code for Folder Info
 */
export function useGenerateNewFolderInfoCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: folderInfoKeys.generateNewFolderInfoCode,
    queryFn: () => generateNewFolderInfoCode(),
    ...options,
  });
}

/**
 * Get paginated list of Folder Info
 */
export function useGetFolderInfoPage(
  options?: Omit<UseMutationOptions<FolderInfoEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getFolderInfoPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Folder Info
 */
export function useCreateFolderInfo(
  options?: Omit<UseMutationOptions<FolderInfoEntityResult, Error, { data: FolderInfoEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: FolderInfoEntity }) => createFolderInfo(variables.data),
    ...options,
  });
}

/**
 * Update an existing Folder Info
 */
export function useUpdateFolderInfo(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateFolderInfo(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Folder Info
 */
export function useDeleteFolderInfo(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteFolderInfo(variables.id),
    ...options,
  });
}
