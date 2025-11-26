import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createMemorySchema,
  deleteMemorySchema,
  updateMemorySchema,
  getMemorySchemaById,
  getMemorySchemaPage,
  generateNewMemorySchemaCode,
} from '../../services/generated/memory-schema';

import type {
  SortType,
  BooleanResult,
  MemorySchemaEntity,
  MemorySchemaEntityResult,
  StringObjectKeyValuePair,
  MemorySchemaEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MemorySchema Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for MemorySchema
 */
export const memorySchemaKeys = {
  all: ['memorySchema'] as const,
  getMemorySchemaById: (id: string) => ['memorySchema', 'getMemorySchemaById', id] as const,
  generateNewMemorySchemaCode: ['memorySchema', 'generateNewMemorySchemaCode'] as const,
};

/**
 * Get Memory Schema by ID
 */
export function useGetMemorySchemaById(
  id: string,
  options?: Omit<UseQueryOptions<MemorySchemaEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: memorySchemaKeys.getMemorySchemaById(id),
    queryFn: () => getMemorySchemaById(id),
    ...options,
  });
}

/**
 * Generate a new code for Memory Schema
 */
export function useGenerateNewMemorySchemaCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: memorySchemaKeys.generateNewMemorySchemaCode,
    queryFn: () => generateNewMemorySchemaCode(),
    ...options,
  });
}

/**
 * Get paginated list of Memory Schema
 */
export function useGetMemorySchemaPage(
  options?: Omit<UseMutationOptions<MemorySchemaEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getMemorySchemaPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Memory Schema
 */
export function useCreateMemorySchema(
  options?: Omit<UseMutationOptions<MemorySchemaEntityResult, Error, { data: MemorySchemaEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: MemorySchemaEntity }) => createMemorySchema(variables.data),
    ...options,
  });
}

/**
 * Update an existing Memory Schema
 */
export function useUpdateMemorySchema(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateMemorySchema(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Memory Schema
 */
export function useDeleteMemorySchema(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteMemorySchema(variables.id),
    ...options,
  });
}
