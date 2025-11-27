import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createApiGateway,
  deleteApiGateway,
  updateApiGateway,
  getApiGatewayById,
  getApiGatewayPage,
  generateNewApiGatewayCode,
} from '../../services/generated/api-gateway';

import type {
  SortType,
  BooleanResult,
  ApiGatewayEntity,
  ApiGatewayEntityResult,
  StringObjectKeyValuePair,
  ApiGatewayEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// ApiGateway Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for ApiGateway
 */
export const apiGatewayKeys = {
  all: ['apiGateway'] as const,
  getApiGatewayById: (id: string) => ['apiGateway', 'getApiGatewayById', id] as const,
  generateNewApiGatewayCode: ['apiGateway', 'generateNewApiGatewayCode'] as const,
};

/**
 * Get Api Gateway by ID
 */
export function useGetApiGatewayById(
  id: string,
  options?: Omit<UseQueryOptions<ApiGatewayEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: apiGatewayKeys.getApiGatewayById(id),
    queryFn: () => getApiGatewayById(id),
    ...options,
  });
}

/**
 * Generate a new code for Api Gateway
 */
export function useGenerateNewApiGatewayCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: apiGatewayKeys.generateNewApiGatewayCode,
    queryFn: () => generateNewApiGatewayCode(),
    ...options,
  });
}

/**
 * Get paginated list of Api Gateway
 */
export function useGetApiGatewayPage(
  options?: Omit<UseMutationOptions<ApiGatewayEntityBasePaginationResponse, Error, { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: SortType[]; params?: { pageNumber?: number; pageSize?: number; searchTerm?: string } }) => getApiGatewayPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Api Gateway
 */
export function useCreateApiGateway(
  options?: Omit<UseMutationOptions<ApiGatewayEntityResult, Error, { data: ApiGatewayEntity }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { data: ApiGatewayEntity }) => createApiGateway(variables.data),
    ...options,
  });
}

/**
 * Update an existing Api Gateway
 */
export function useUpdateApiGateway(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) => updateApiGateway(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Api Gateway
 */
export function useDeleteApiGateway(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteApiGateway(variables.id),
    ...options,
  });
}
