import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createRouting,
  deleteRouting,
  updateRouting,
  getRoutingById,
  getRoutingPage,
  generateNewRoutingCode,
} from '../../services/generated/routing';

import type {
  SortType,
  BooleanResult,
  RoutingEntity,
  RoutingEntityResult,
  StringObjectKeyValuePair,
  RoutingEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// Routing Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for Routing
 */
export const routingKeys = {
  all: ['routing'] as const,
  getRoutingById: (id: string) => ['routing', 'getRoutingById', id] as const,
  generateNewRoutingCode: ['routing', 'generateNewRoutingCode'] as const,
};

/**
 * Get Routing by ID
 */
export function useGetRoutingById(
  id: string,
  options?: Omit<UseQueryOptions<RoutingEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: routingKeys.getRoutingById(id),
    queryFn: () => getRoutingById(id),
    ...options,
  });
}

/**
 * Generate a new code for Routing
 */
export function useGenerateNewRoutingCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: routingKeys.generateNewRoutingCode,
    queryFn: () => generateNewRoutingCode(),
    ...options,
  });
}

/**
 * Get paginated list of Routing
 */
export function useGetRoutingPage(
  options?: Omit<UseMutationOptions<RoutingEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getRoutingPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Routing
 */
export function useCreateRouting(
  options?: Omit<UseMutationOptions<RoutingEntityResult, Error, { data: RoutingEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: RoutingEntity }) => createRouting(variables.data),
    ...options,
  });
}

/**
 * Update an existing Routing
 */
export function useUpdateRouting(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateRouting(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Routing
 */
export function useDeleteRouting(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteRouting(variables.id),
    ...options,
  });
}
