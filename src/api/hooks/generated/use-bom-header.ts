import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createBomHeader,
  deleteBomHeader,
  generateNewBomHeaderCode,
  getBomHeaderById,
  getBomHeaderPage,
  updateBomHeader,
} from '../../services/generated/bom-header';

import type {
  BomHeaderEntity,
  BomHeaderEntityBasePaginationResponse,
  BomHeaderEntityResult,
  BooleanResult,
  SortType,
  StringObjectKeyValuePair,
} from '../../types/generated';

// ----------------------------------------------------------------------
// BomHeader Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for BomHeader
 */
export const bomHeaderKeys = {
  all: ['bomHeader'] as const,
  getBomHeaderById: (id: string) => ['bomHeader', 'getBomHeaderById', id] as const,
  generateNewBomHeaderCode: ['bomHeader', 'generateNewBomHeaderCode'] as const,
};

/**
 * Get Bom Header by ID
 */
export function useGetBomHeaderById(
  id: string,
  options?: Omit<UseQueryOptions<BomHeaderEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: bomHeaderKeys.getBomHeaderById(id),
    queryFn: () => getBomHeaderById(id),
    ...options,
  });
}

/**
 * Generate a new code for Bom Header
 */
export function useGenerateNewBomHeaderCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: bomHeaderKeys.generateNewBomHeaderCode,
    queryFn: () => generateNewBomHeaderCode(),
    ...options,
  });
}

/**
 * Get paginated list of Bom Header
 */
export function useGetBomHeaderPage(
  options?: Omit<UseMutationOptions<BomHeaderEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getBomHeaderPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Bom Header
 */
export function useCreateBomHeader(
  options?: Omit<UseMutationOptions<BomHeaderEntityResult, Error, { data: BomHeaderEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: BomHeaderEntity }) => createBomHeader(variables.data),
    ...options,
  });
}

/**
 * Update an existing Bom Header
 */
export function useUpdateBomHeader(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateBomHeader(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Bom Header
 */
export function useDeleteBomHeader(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteBomHeader(variables.id),
    ...options,
  });
}
