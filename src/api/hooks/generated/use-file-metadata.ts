import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createFileMetadata,
  deleteFileMetadata,
  updateFileMetadata,
  getFileMetadataById,
  getFileMetadataPage,
  generateNewFileMetadataCode,
} from '../../services/generated/file-metadata';

import type {
  SortType,
  BooleanResult,
  FileMetadataEntity,
  FileMetadataEntityResult,
  StringObjectKeyValuePair,
  FileMetadataEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// FileMetadata Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for FileMetadata
 */
export const fileMetadataKeys = {
  all: ['fileMetadata'] as const,
  getFileMetadataById: (id: string) => ['fileMetadata', 'getFileMetadataById', id] as const,
  generateNewFileMetadataCode: ['fileMetadata', 'generateNewFileMetadataCode'] as const,
};

/**
 * Get File Metadata by ID
 */
export function useGetFileMetadataById(
  id: string,
  options?: Omit<UseQueryOptions<FileMetadataEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: fileMetadataKeys.getFileMetadataById(id),
    queryFn: () => getFileMetadataById(id),
    ...options,
  });
}

/**
 * Generate a new code for File Metadata
 */
export function useGenerateNewFileMetadataCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: fileMetadataKeys.generateNewFileMetadataCode,
    queryFn: () => generateNewFileMetadataCode(),
    ...options,
  });
}

/**
 * Get paginated list of File Metadata
 */
export function useGetFileMetadataPage(
  options?: Omit<UseMutationOptions<FileMetadataEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getFileMetadataPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new File Metadata
 */
export function useCreateFileMetadata(
  options?: Omit<UseMutationOptions<FileMetadataEntityResult, Error, { data: FileMetadataEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: FileMetadataEntity }) => createFileMetadata(variables.data),
    ...options,
  });
}

/**
 * Update an existing File Metadata
 */
export function useUpdateFileMetadata(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateFileMetadata(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a File Metadata
 */
export function useDeleteFileMetadata(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteFileMetadata(variables.id),
    ...options,
  });
}
