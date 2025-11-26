import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createDocument,
  deleteDocument,
  updateDocument,
  getDocumentById,
  getDocumentPage,
  generateNewDocumentCode,
} from '../../services/generated/document';

import type {
  SortType,
  BooleanResult,
  DocumentEntity,
  DocumentEntityResult,
  StringObjectKeyValuePair,
  DocumentEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Document Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Document
 */
export const documentKeys = {
  all: ['document'] as const,
  getDocumentById: (id: string) => ['document', 'getDocumentById', id] as const,
  generateNewDocumentCode: ['document', 'generateNewDocumentCode'] as const,
};

/**
 * Get Document by ID
 */
export function useGetDocumentById(
  id: string,
  options?: Omit<UseQueryOptions<DocumentEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: documentKeys.getDocumentById(id),
    queryFn: () => getDocumentById(id),
    ...options,
  });
}

/**
 * Generate a new code for Document
 */
export function useGenerateNewDocumentCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: documentKeys.generateNewDocumentCode,
    queryFn: () => generateNewDocumentCode(),
    ...options,
  });
}

/**
 * Get paginated list of Document
 */
export function useGetDocumentPage(
  options?: Omit<
    UseMutationOptions<
      DocumentEntityBasePaginationResponse,
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
    }) => getDocumentPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Document
 */
export function useCreateDocument(
  options?: Omit<
    UseMutationOptions<DocumentEntityResult, Error, { data: DocumentEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: DocumentEntity }) => createDocument(variables.data),
    ...options,
  });
}

/**
 * Update an existing Document
 */
export function useUpdateDocument(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateDocument(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Document
 */
export function useDeleteDocument(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteDocument(variables.id),
    ...options,
  });
}
