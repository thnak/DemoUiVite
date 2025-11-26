import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

import { useQuery, useMutation } from '@tanstack/react-query';

import {
  createIoTDeviceModel,
  deleteIoTDeviceModel,
  searchIoTDeviceModel,
  updateIoTDeviceModel,
  getIoTDeviceModelById,
  getIoTDeviceModelPage,
  generateNewIoTDeviceModelCode,
} from '../../services/generated/io-tdevice-model';

import type {
  SortType,
  BooleanResult,
  IoTDeviceModelEntity,
  StringObjectKeyValuePair,
  IoTDeviceModelEntityResult,
  IoTDeviceModelEntityBasePaginationResponse,
} from '../../types/generated';

// ----------------------------------------------------------------------
// IoTDeviceModel Hooks
// Auto-generated from docs/api/response.json
// Do not edit manually - run 'npm run generate:api' to regenerate
// ----------------------------------------------------------------------

/**
 * Query keys for IoTDeviceModel
 */
export const ioTDeviceModelKeys = {
  all: ['ioTDeviceModel'] as const,
  getIoTDeviceModelById: (id: string) => ['ioTDeviceModel', 'getIoTDeviceModelById', id] as const,
  generateNewIoTDeviceModelCode: ['ioTDeviceModel', 'generateNewIoTDeviceModelCode'] as const,
  searchIoTDeviceModel: ['ioTDeviceModel', 'searchIoTDeviceModel'] as const,
};

/**
 * Get Io TDevice Model by ID
 */
export function useGetIoTDeviceModelById(
  id: string,
  options?: Omit<UseQueryOptions<IoTDeviceModelEntity, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTDeviceModelKeys.getIoTDeviceModelById(id),
    queryFn: () => getIoTDeviceModelById(id),
    ...options,
  });
}

/**
 * Generate a new code for Io TDevice Model
 */
export function useGenerateNewIoTDeviceModelCode(
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTDeviceModelKeys.generateNewIoTDeviceModelCode,
    queryFn: () => generateNewIoTDeviceModelCode(),
    ...options,
  });
}

/**
 * Search Io TDevice Model entities
 */
export function useSearchIoTDeviceModel(
  params?: { searchText?: string; maxResults?: number },
  options?: Omit<UseQueryOptions<IoTDeviceModelEntity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ioTDeviceModelKeys.searchIoTDeviceModel,
    queryFn: () => searchIoTDeviceModel(params),
    ...options,
  });
}

/**
 * Get paginated list of Io TDevice Model
 */
export function useGetIoTDeviceModelPage(
  options?: Omit<
    UseMutationOptions<
      IoTDeviceModelEntityBasePaginationResponse,
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
    }) => getIoTDeviceModelPage(variables.data, variables.params),
    ...options,
  });
}

/**
 * Create a new Io TDevice Model
 */
export function useCreateIoTDeviceModel(
  options?: Omit<
    UseMutationOptions<IoTDeviceModelEntityResult, Error, { data: IoTDeviceModelEntity }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { data: IoTDeviceModelEntity }) => createIoTDeviceModel(variables.data),
    ...options,
  });
}

/**
 * Update an existing Io TDevice Model
 */
export function useUpdateIoTDeviceModel(
  options?: Omit<
    UseMutationOptions<BooleanResult, Error, { id: string; data: StringObjectKeyValuePair[] }>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (variables: { id: string; data: StringObjectKeyValuePair[] }) =>
      updateIoTDeviceModel(variables.id, variables.data),
    ...options,
  });
}

/**
 * Delete a Io TDevice Model
 */
export function useDeleteIoTDeviceModel(
  options?: Omit<UseMutationOptions<BooleanResult, Error, { id: string }>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: (variables: { id: string }) => deleteIoTDeviceModel(variables.id),
    ...options,
  });
}
