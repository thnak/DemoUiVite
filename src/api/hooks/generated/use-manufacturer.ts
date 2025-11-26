import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createManufacturer,
  deleteManufacturer,
  searchManufacturer,
  updateManufacturer,
  getManufacturerById,
  getManufacturerPage,
  generateNewManufacturerCode,
} from '../../services/generated/manufacturer';

import type {
  SortType,
  BooleanResult,
  ManufacturerEntity,
  ManufacturerEntityResult,
  StringObjectKeyValuePair,
  ManufacturerEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Manufacturer Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Manufacturer
 */
export const manufacturerKeys = {
  all: ['manufacturer'] as const,
  getManufacturerById: (id: string) => ['manufacturer', 'getManufacturerById', id] as const,
  generateNewManufacturerCode: ['manufacturer', 'generateNewManufacturerCode'] as const,
  searchManufacturer: ['manufacturer', 'searchManufacturer'] as const,
};

/**
 * Get Manufacturer by ID
 */
export function useGetManufacturerById(
  id: string,
  options?: Omit<UseQueryOptions<ManufacturerEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: manufacturerKeys.getManufacturerById(id),
    queryFn: () => getManufacturerById(id),
    ...options,
  });
}

/**
 * Generate a new code for Manufacturer
 */
export function useGenerateNewManufacturerCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: manufacturerKeys.generateNewManufacturerCode,
    queryFn: () => generateNewManufacturerCode(),
    ...options,
  });
}

/**
 * Search Manufacturer entities
 */
export function useSearchManufacturer(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<ManufacturerEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: manufacturerKeys.searchManufacturer,
    queryFn: () => searchManufacturer(params),
    ...options,
  });
}

/**
 * Get paginated list of Manufacturer
 */
export function useGetManufacturerPage(
  options?: Omit<
    UseMutationOptions<
      ManufacturerEntityBasePaginationResponse,
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
    }) => getManufacturerPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Manufacturer
 */
export function useCreateManufacturer(
  options?: Omit<
    UseMutationOptions<ManufacturerEntityResult, Error, { data: ManufacturerEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: ManufacturerEntity }) => createManufacturer(variables.data),
    ...options,
  });
}

/**
 * Update an existing Manufacturer
 */
export function useUpdateManufacturer(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateManufacturer(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Manufacturer
 */
export function useDeleteManufacturer(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteManufacturer(variables.id),
    ...options,
  });
}
