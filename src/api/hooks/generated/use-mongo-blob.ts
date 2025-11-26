import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createMongoBlob,
  deleteMongoBlob,
  generateNewMongoBlobCode,
  getMongoBlobById,
  getMongoBlobPage,
  updateMongoBlob,
} from '../../services/generated/mongo-blob';

import type {
  BooleanResult,
  MongoBlob,
  MongoBlobBasePaginationResponse,
  MongoBlobResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// MongoBlob Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for MongoBlob
 */
export const mongoBlobKeys = {
  all: ['mongoBlob'] as const,
  getMongoBlobById: (id: string) => ['mongoBlob', 'getMongoBlobById', id] as const,
  generateNewMongoBlobCode: ['mongoBlob', 'generateNewMongoBlobCode'] as const,
};

/**
 * Get Mongo Blob by ID
 */
export function useGetMongoBlobById(
  id: string,
  options?: Omit<UseQueryOptions<MongoBlob, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: mongoBlobKeys.getMongoBlobById(id),
    queryFn: () => getMongoBlobById(id),
    ...options,
  });
}

/**
 * Generate a new code for Mongo Blob
 */
export function useGenerateNewMongoBlobCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: mongoBlobKeys.generateNewMongoBlobCode,
    queryFn: () => generateNewMongoBlobCode(),
    ...options,
  });
}

/**
 * Get paginated list of Mongo Blob
 */
export function useGetMongoBlobPage(
  options?: Omit<UseMutationOptions<MongoBlobBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getMongoBlobPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Mongo Blob
 */
export function useCreateMongoBlob(
  options?: Omit<UseMutationOptions<MongoBlobResult, Error, { data: MongoBlob }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: MongoBlob }) => createMongoBlob(variables.data),
    ...options,
  });
}

/**
 * Update an existing Mongo Blob
 */
export function useUpdateMongoBlob(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateMongoBlob(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Mongo Blob
 */
export function useDeleteMongoBlob(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteMongoBlob(variables.id),
    ...options,
  });
}
