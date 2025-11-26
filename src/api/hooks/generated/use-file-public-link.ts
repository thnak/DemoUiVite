import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createFilePublicLink,
  deleteFilePublicLink,
  updateFilePublicLink,
  getFilePublicLinkById,
  getFilePublicLinkPage,
  generateNewFilePublicLinkCode,
} from '../../services/generated/file-public-link';

import type {
  SortType,
  BooleanResult,
  FilePublicLinkEntity,
  StringObjectKeyValuePair,
  FilePublicLinkEntityResult,
  FilePublicLinkEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FilePublicLink Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for FilePublicLink
 */
export const filePublicLinkKeys = {
  all: ['filePublicLink'] as const,
  getFilePublicLinkById: (id: string) => ['filePublicLink', 'getFilePublicLinkById', id] as const,
  generateNewFilePublicLinkCode: ['filePublicLink', 'generateNewFilePublicLinkCode'] as const,
};

/**
 * Get File Public Link by ID
 */
export function useGetFilePublicLinkById(
  id: string,
  options?: Omit<UseQueryOptions<FilePublicLinkEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: filePublicLinkKeys.getFilePublicLinkById(id),
    queryFn: () => getFilePublicLinkById(id),
    ...options,
  });
}

/**
 * Generate a new code for File Public Link
 */
export function useGenerateNewFilePublicLinkCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: filePublicLinkKeys.generateNewFilePublicLinkCode,
    queryFn: () => generateNewFilePublicLinkCode(),
    ...options,
  });
}

/**
 * Get paginated list of File Public Link
 */
export function useGetFilePublicLinkPage(
  options?: Omit<
    UseMutationOptions<
      FilePublicLinkEntityBasePaginationResponse,
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
    }) => getFilePublicLinkPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new File Public Link
 */
export function useCreateFilePublicLink(
  options?: Omit<
    UseMutationOptions<FilePublicLinkEntityResult, Error, { data: FilePublicLinkEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: FilePublicLinkEntity }) => createFilePublicLink(variables.data),
    ...options,
  });
}

/**
 * Update an existing File Public Link
 */
export function useUpdateFilePublicLink(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateFilePublicLink(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a File Public Link
 */
export function useDeleteFilePublicLink(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteFilePublicLink(variables.id),
    ...options,
  });
}
